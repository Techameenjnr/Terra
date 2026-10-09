import os
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request, send_file, session
from werkzeug.security import check_password_hash, generate_password_hash


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "trivia.db"

app = Flask(__name__, static_folder=".")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-me")


def get_db_connection():
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


@app.get("/api/session")
def get_session():
    user = session.get("user")
    return jsonify({"user": user})


@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "An account with that email already exists"}), 409

    hashed = generate_password_hash(password)
    cursor = conn.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, hashed),
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    session["user"] = {"id": user_id, "name": name, "email": email}
    return jsonify({"message": "Account created", "user": session["user"]})


@app.post("/api/signin")
def signin():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

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
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "Guest").strip() or "Guest"
    score = int(data.get("score", 0) or 0)
    total = int(data.get("total", 0) or 0)
    accuracy = int(data.get("accuracy", 0) or 0)
    category = (data.get("category") or "General").strip() or "General"

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO leaderboard (name, score, total, accuracy, category) VALUES (?, ?, ?, ?, ?)",
        (name, score, total, accuracy, category),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Score saved"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
