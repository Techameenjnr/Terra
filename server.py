import os
import json
import re
import secrets
import sqlite3
import time
from pathlib import Path

from flask import Flask, jsonify, request, send_file, session
from werkzeug.security import check_password_hash, generate_password_hash
from questions import QUESTION_BANK, create_quiz


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("DATABASE_PATH", BASE_DIR / "trivia.db"))
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
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
    conn.execute("PRAGMA foreign_keys = ON")
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
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            category TEXT NOT NULL,
            questions_json TEXT NOT NULL,
            answers_json TEXT NOT NULL DEFAULT '[]',
            current_index INTEGER NOT NULL DEFAULT 0,
            score INTEGER NOT NULL DEFAULT 0,
            current_streak INTEGER NOT NULL DEFAULT 0,
            best_streak INTEGER NOT NULL DEFAULT 0,
            question_started_at REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    attempt_columns = {
        row["name"] for row in conn.execute("PRAGMA table_info(quiz_attempts)")
    }
    if "question_started_at" not in attempt_columns:
        conn.execute(
            "ALTER TABLE quiz_attempts ADD COLUMN question_started_at REAL NOT NULL DEFAULT 0"
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
    session.pop("active_quiz_id", None)
    return jsonify({"message": "Signed out"})


@app.get("/api/leaderboard")
def leaderboard():
    conn = get_db_connection()
    rows = conn.execute(
        """
        SELECT name, score, total, accuracy, category
        FROM leaderboard
        ORDER BY accuracy DESC, score DESC, created_at ASC
        LIMIT 10
        """
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


def public_question(question):
    return {
        "id": question["id"],
        "category": question["category"],
        "question": question["question"],
        "options": question["options"],
    }


def calculate_accuracy(score, total):
    return (score * 100 + total // 2) // total


@app.post("/api/quiz/start")
def start_quiz():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Sign in to start a quiz"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    category = data.get("category", "All")
    difficulty = data.get("difficulty", "all")
    count = data.get("count", 5)
    if not isinstance(category, str) or (category != "All" and category not in QUESTION_BANK):
        return jsonify({"error": "Unknown quiz category"}), 400
    if not isinstance(difficulty, str) or difficulty not in {"all", "easy", "medium"}:
        return jsonify({"error": "Unknown difficulty"}), 400
    if isinstance(count, bool) or not isinstance(count, int) or not 1 <= count <= 12:
        return jsonify({"error": "Question count must be between 1 and 12"}), 400

    questions = create_quiz(category, difficulty, count)
    if not questions:
        return jsonify({"error": "No questions match those filters"}), 400

    quiz_id = secrets.token_urlsafe(24)
    conn = get_db_connection()
    conn.execute(
        "UPDATE quiz_attempts SET status = 'abandoned' WHERE user_id = ? AND status = 'active'",
        (user["id"],),
    )
    conn.execute(
        """
        INSERT INTO quiz_attempts
            (id, user_id, category, questions_json, question_started_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (quiz_id, user["id"], category, json.dumps(questions), time.time()),
    )
    conn.commit()
    conn.close()

    session["active_quiz_id"] = quiz_id
    return jsonify({
        "quiz_id": quiz_id,
        "questions": [public_question(question) for question in questions],
        "total": len(questions),
    })


@app.post("/api/quiz/answer")
def answer_quiz_question():
    user = session.get("user")
    quiz_id = session.get("active_quiz_id")
    if not user or not quiz_id:
        return jsonify({"error": "No active quiz session"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    question_index = data.get("question_index")
    selected_answer = data.get("answer")
    if isinstance(question_index, bool) or not isinstance(question_index, int):
        return jsonify({"error": "Question index must be an integer"}), 400
    if selected_answer is not None and not isinstance(selected_answer, str):
        return jsonify({"error": "Answer must be text or null"}), 400

    conn = get_db_connection()
    try:
        conn.execute("BEGIN IMMEDIATE")
        attempt = conn.execute(
            "SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?",
            (quiz_id, user["id"]),
        ).fetchone()
        if attempt is None or attempt["status"] != "active":
            conn.rollback()
            return jsonify({"error": "Quiz session is not active"}), 409
        if question_index != attempt["current_index"]:
            conn.rollback()
            return jsonify({"error": "Answer the current question before continuing"}), 409

        questions = json.loads(attempt["questions_json"])
        question = questions[question_index]
        if selected_answer is not None and selected_answer not in question["options"]:
            conn.rollback()
            return jsonify({"error": "Answer is not one of the available options"}), 400

        timed_out = time.time() - attempt["question_started_at"] > 20
        if timed_out:
            selected_answer = None
        is_correct = selected_answer == question["answer"]
        score = attempt["score"] + int(is_correct)
        streak = attempt["current_streak"] + 1 if is_correct else 0
        best_streak = max(attempt["best_streak"], streak)
        answers = json.loads(attempt["answers_json"])
        answers.append({
            "question": question["question"],
            "selected": selected_answer or "No answer",
            "correct": question["answer"],
            "isCorrect": is_correct,
        })
        next_index = question_index + 1
        is_finished = next_index == len(questions)
        conn.execute(
            """
            UPDATE quiz_attempts
            SET answers_json = ?, current_index = ?, score = ?, current_streak = ?,
                best_streak = ?, question_started_at = ?, status = ?
            WHERE id = ?
            """,
            (
                json.dumps(answers),
                next_index,
                score,
                streak,
                best_streak,
                time.time(),
                "finished" if is_finished else "active",
                quiz_id,
            ),
        )

        response = {
            "is_correct": is_correct,
            "correct_answer": question["answer"],
            "score": score,
            "streak": streak,
            "answer": answers[-1],
            "timed_out": timed_out,
            "finished": is_finished,
        }
        if is_finished:
            total = len(questions)
            accuracy = calculate_accuracy(score, total)
            conn.execute(
                "INSERT INTO leaderboard (name, score, total, accuracy, category) VALUES (?, ?, ?, ?, ?)",
                (user["name"], score, total, accuracy, attempt["category"]),
            )
            response["summary"] = {
                "score": score,
                "total": total,
                "accuracy": accuracy,
                "best_streak": best_streak,
                "answers": answers,
            }
            session.pop("active_quiz_id", None)
        else:
            response["next_question"] = public_question(questions[next_index])

        conn.commit()
        return jsonify(response)
    except (sqlite3.Error, ValueError, KeyError, IndexError):
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
