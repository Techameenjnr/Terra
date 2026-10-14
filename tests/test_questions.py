import unittest

from questions import QUESTION_BANK, create_quiz


class QuestionBankTests(unittest.TestCase):
    def test_every_question_has_valid_answers_and_difficulty(self):
        for category, questions in QUESTION_BANK.items():
            with self.subTest(category=category):
                self.assertGreaterEqual(len(questions), 5)
                seen_questions = set()
                for question, options, answer, difficulty in questions:
                    self.assertTrue(question.strip())
                    self.assertEqual(len(options), 4)
                    self.assertEqual(len(options), len(set(options)))
                    self.assertIn(answer, options)
                    self.assertIn(difficulty, {"easy", "medium"})
                    self.assertNotIn(question, seen_questions)
                    seen_questions.add(question)

    def test_every_category_and_difficulty_filter_returns_matching_questions(self):
        for category, questions in QUESTION_BANK.items():
            for difficulty in ("easy", "medium"):
                with self.subTest(category=category, difficulty=difficulty):
                    matching_count = sum(item[3] == difficulty for item in questions)
                    self.assertGreater(matching_count, 0)
                    quiz = create_quiz(category, difficulty, 12)
                    self.assertEqual(len(quiz), matching_count)
                    self.assertTrue(all(item["category"] == category for item in quiz))
                    self.assertTrue(all(item["difficulty"] == difficulty for item in quiz))

    def test_all_category_quiz_has_unique_question_ids_and_valid_answers(self):
        quiz = create_quiz("All", "all", 12)
        self.assertEqual(len(quiz), 12)
        self.assertEqual(len({item["id"] for item in quiz}), 12)
        for item in quiz:
            self.assertIn(item["answer"], item["options"])


if __name__ == "__main__":
    unittest.main()
