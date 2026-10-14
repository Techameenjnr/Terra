import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import server


class ServerTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.database_path = Path(self.temp_dir.name) / "test-trivia.db"
        self.db_path_patch = patch.object(server, "DB_PATH", self.database_path)
        self.db_path_patch.start()
        server.init_db()
        server.app.config.update(TESTING=True, SECRET_KEY="test-secret")
        self.client = server.app.test_client()

    def tearDown(self):
        self.db_path_patch.stop()
        self.temp_dir.cleanup()

    def signup(self, email="player@example.com", password="securepass123"):
        return self.client.post(
            "/api/signup",
            json={"name": "Quiz Player", "email": email, "password": password},
        )

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "ok")

    def test_demo_credentials_are_not_exposed_in_production(self):
        self.assertTrue(self.client.get("/api/demo").json["available"])
        with patch.object(server, "IS_PRODUCTION", True):
            response = self.client.get("/api/demo")
        self.assertEqual(response.json, {"available": False})

    def test_signup_validation_and_duplicate_account(self):
        short_password = self.signup(password="short")
        self.assertEqual(short_password.status_code, 400)

        invalid_email = self.signup(email="not-an-email")
        self.assertEqual(invalid_email.status_code, 400)

        created = self.signup()
        self.assertEqual(created.status_code, 200)
        self.assertEqual(created.json["user"]["email"], "player@example.com")

        duplicate = self.signup()
        self.assertEqual(duplicate.status_code, 409)

    def test_signin_rejects_wrong_password_and_accepts_valid_user(self):
        self.signup()

        failed = self.client.post(
            "/api/signin",
            json={"email": "player@example.com", "password": "wrong-password"},
        )
        self.assertEqual(failed.status_code, 401)

        signed_in = self.client.post(
            "/api/signin",
            json={"email": "player@example.com", "password": "securepass123"},
        )
        self.assertEqual(signed_in.status_code, 200)
        self.assertEqual(self.client.get("/api/session").json["user"]["name"], "Quiz Player")

    def test_quiz_answers_are_verified_and_scores_saved_server_side(self):
        unauthorized = self.client.post(
            "/api/quiz/start",
            json={"category": "Python", "difficulty": "easy", "count": 1},
        )
        self.assertEqual(unauthorized.status_code, 401)

        self.signup()
        started = self.client.post(
            "/api/quiz/start",
            json={"category": "Python", "difficulty": "easy", "count": 1},
        )
        self.assertEqual(started.status_code, 200)
        self.assertNotIn("answer", started.json["questions"][0])
        self.assertEqual(started.json["total"], 1)

        invalid_answer = self.client.post(
            "/api/quiz/answer",
            json={"question_index": 0, "answer": "not an option"},
        )
        self.assertEqual(invalid_answer.status_code, 400)

        conn = server.get_db_connection()
        attempt = conn.execute(
            "SELECT questions_json FROM quiz_attempts WHERE id = ?",
            (started.json["quiz_id"],),
        ).fetchone()
        answer = json.loads(attempt["questions_json"])[0]["answer"]
        conn.close()

        saved = self.client.post(
            "/api/quiz/answer",
            json={"question_index": 0, "answer": answer},
        )
        self.assertEqual(saved.status_code, 200)
        self.assertTrue(saved.json["finished"])
        self.assertEqual(saved.json["summary"]["score"], 1)

        entry = self.client.get("/api/leaderboard").json[0]
        self.assertEqual(entry["name"], "Quiz Player")
        self.assertEqual(entry["score"], 1)
        self.assertEqual(entry["category"], "Python")

        forged_score = self.client.post(
            "/api/leaderboard",
            json={"name": "Cheater", "score": 999, "total": 1, "accuracy": 100},
        )
        self.assertIn(forged_score.status_code, (404, 405))

    def test_quiz_requires_valid_filters_and_sequential_answers(self):
        self.signup()
        bad_difficulty = self.client.post(
            "/api/quiz/start",
            json={"category": "Python", "difficulty": ["easy"], "count": 2},
        )
        self.assertEqual(bad_difficulty.status_code, 400)

        started = self.client.post(
            "/api/quiz/start",
            json={"category": "Python", "difficulty": "easy", "count": 2},
        )
        self.assertEqual(started.status_code, 200)
        out_of_order = self.client.post(
            "/api/quiz/answer",
            json={"question_index": 1, "answer": started.json["questions"][1]["options"][0]},
        )
        self.assertEqual(out_of_order.status_code, 409)

    def test_non_object_json_is_rejected(self):
        response = self.client.post(
            "/api/signup",
            data='["not", "an", "object"]',
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
