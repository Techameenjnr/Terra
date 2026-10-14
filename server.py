import os
import re
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request, send_file, session
from werkzeug.security import check_password_hash, generate_password_hash


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("DATABASE_PATH", BASE_DIR / "trivia.db"))
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
QUESTION_CATEGORIES = {"General", "Python", "Science", "Geography", "History", "Technology"}
IS_PRODUCTION = os.environ.get("APP_ENV") == "production"

app = Flask(__name__, static_folder=".")
secret_key = os.environ.get("SECRET_KEY")
if not secret_key and os.environ.get("APP_ENV") == "production":
    raise RuntimeError("SECRET_KEY must be configured in production")

app.config.update(
    SECRET_KEY=secret_key or "dev-secret-key-change-me",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=IS_PRODUCTION,
    MAX_CONTENT_LENGTH=16 * 1024,
)


def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            accuracy INTEGER NOT NULL,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    if not IS_PRODUCTION:
        demo_user = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            ("demo@terra.com",),
        ).fetchone()
        if demo_user is None:
            conn.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                ("Demo User", "demo@terra.com", generate_password_hash("demo123")),
            )

    conn.commit()
    conn.close()


init_db()


@app.route("/")
def index():
    return send_file(BASE_DIR / "index.html")


@app.route("/styles.css")
def styles():
    return send_file(BASE_DIR / "styles.css")


@app.route("/script.js")
def script():
    return send_file(BASE_DIR / "script.js")


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "service": "terra-trivia"})


@app.get("/api/demo")
def demo_account_info():
    if IS_PRODUCTION:
        return jsonify({"available": False})
    return jsonify({"available": True, "email": "demo@terra.com", "password": "demo123"})


@app.get("/api/session")
def get_session():
    user = session.get("user")
    return jsonify({"user": user})


@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    name_value = data.get("name")
    email_value = data.get("email")
    password_value = data.get("password")
    if not all(isinstance(value, str) for value in (name_value, email_value, password_value)):
        return jsonify({"error": "name, email, and password must be text"}), 400

    name = name_value.strip()
    email = email_value.strip().lower()
    password = password_value.strip()

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if len(name) > 80 or len(email) > 254:
        return jsonify({"error": "Name or email is too long"}), 400

    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    if len(password) > 128:
        return jsonify({"error": "Password is too long"}), 400

    conn = get_db_connection()
    try:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"error": "An account with that email already exists"}), 409

        hashed = generate_password_hash(password)
        cursor = conn.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed),
        )
        user_id = cursor.lastrowid
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()
        return jsonify({"error": "An account with that email already exists"}), 409
    finally:
        conn.close()

    session["user"] = {"id": user_id, "name": name, "email": email}
    return jsonify({"message": "Account created", "user": session["user"]})


@app.post("/api/signin")
def signin():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    email_value = data.get("email")
    password_value = data.get("password")
    if not isinstance(email_value, str) or not isinstance(password_value, str):
        return jsonify({"error": "email and password must be text"}), 400

    email = email_value.strip().lower()
    password = password_value.strip()

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    if len(email) > 254:
        return jsonify({"error": "Email address is too long"}), 400

    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    if len(password) > 128:
        return jsonify({"error": "Password is too long"}), 400

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not row or not check_password_hash(row["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    session["user"] = {"id": row["id"], "name": row["name"], "email": row["email"]}
    return jsonify({"message": "Signed in", "user": session["user"]})


@app.post("/api/logout")
def logout():
    session.pop("user", None)
    return jsonify({"message": "Signed out"})


@app.get("/api/leaderboard")
def leaderboard():
    conn = get_db_connection()
    rows = conn.execute(
        """
        SELECT name, score, total, accuracy, category
        FROM leaderboard
        ORDER BY score DESC, accuracy DESC, created_at ASC
        LIMIT 10
        """
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.post("/api/leaderboard")
def save_leaderboard_entry():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Sign in to save a score"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    score = data.get("score")
    total = data.get("total")
    accuracy = data.get("accuracy")
    category = data.get("category")

    if any(isinstance(value, bool) or not isinstance(value, int) for value in (score, total, accuracy)):
        return jsonify({"error": "score, total, and accuracy must be integers"}), 400

    if total < 1 or total > 12 or score < 0 or score > total:
        return jsonify({"error": "Score must be within the selected quiz total"}), 400

    if accuracy != round((score / total) * 100):
        return jsonify({"error": "Accuracy does not match the score"}), 400

    if not isinstance(category, str) or (category not in QUESTION_CATEGORIES and category != "All"):
        return jsonify({"error": "Unknown quiz category"}), 400

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO leaderboard (name, score, total, accuracy, category) VALUES (?, ?, ?, ?, ?)",
        (user["name"], score, total, accuracy, category),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Score saved"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
