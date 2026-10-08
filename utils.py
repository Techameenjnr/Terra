import json
import random
from pathlib import Path


QUESTION_BANK = {
    "Science": [
        {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Venus", "Mars", "Jupiter", "Saturn"],
            "answer": "Mars",
            "difficulty": "easy",
        },
        {
            "question": "What is the chemical symbol for gold?",
            "options": ["Ag", "Go", "Au", "Gd"],
            "answer": "Au",
            "difficulty": "easy",
        },
        {
            "question": "Which gas do plants absorb from the atmosphere?",
            "options": ["Oxygen", "Carbon dioxide", "Helium", "Nitrogen"],
            "answer": "Carbon dioxide",
            "difficulty": "easy",
        },
        {
            "question": "What is the largest organ in the human body?",
            "options": ["Brain", "Liver", "Skin", "Heart"],
            "answer": "Skin",
            "difficulty": "easy",
        },
        {
            "question": "Which element has the atomic number 1?",
            "options": ["Helium", "Hydrogen", "Oxygen", "Carbon"],
            "answer": "Hydrogen",
            "difficulty": "easy",
        },
        {
            "question": "What is H2O commonly known as?",
            "options": ["Salt", "Water", "Oxygen", "Hydrogen"],
            "answer": "Water",
            "difficulty": "easy",
        },
        {
            "question": "Which part of the cell contains genetic material?",
            "options": ["Membrane", "Nucleus", "Ribosome", "Cytoplasm"],
            "answer": "Nucleus",
            "difficulty": "medium",
        },
        {
            "question": "What force keeps planets in orbit around the Sun?",
            "options": ["Magnetism", "Gravity", "Friction", "Electricity"],
            "answer": "Gravity",
            "difficulty": "medium",
        },
        {
            "question": "Which blood type is considered a universal donor?",
            "options": ["A+", "B-", "O-", "AB+"],
            "answer": "O-",
            "difficulty": "medium",
        },
        {
            "question": "Which scientist developed the theory of relativity?",
            "options": ["Newton", "Galileo", "Einstein", "Curie"],
            "answer": "Einstein",
            "difficulty": "medium",
        },
    ],
    "Geography": [
        {
            "question": "Which is the largest ocean on Earth?",
            "options": ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
            "answer": "Pacific Ocean",
            "difficulty": "easy",
        },
        {
            "question": "What is the capital city of Japan?",
            "options": ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
            "answer": "Tokyo",
            "difficulty": "easy",
        },
        {
            "question": "Which continent is the Sahara Desert located on?",
            "options": ["Asia", "Africa", "Australia", "South America"],
            "answer": "Africa",
            "difficulty": "easy",
        },
        {
            "question": "Which country has the most natural lakes?",
            "options": ["Canada", "Brazil", "Russia", "China"],
            "answer": "Canada",
            "difficulty": "easy",
        },
        {
            "question": "Mount Everest is located in which mountain range?",
            "options": ["Andes", "Rockies", "Alps", "Himalayas"],
            "answer": "Himalayas",
            "difficulty": "easy",
        },
        {
            "question": "Which city is known as the City of Light?",
            "options": ["Rome", "Paris", "Berlin", "Madrid"],
            "answer": "Paris",
            "difficulty": "medium",
        },
        {
            "question": "Which desert is the largest hot desert in the world?",
            "options": ["Gobi", "Kalahari", "Sahara", "Arabian"],
            "answer": "Sahara",
            "difficulty": "medium",
        },
        {
            "question": "Which country has the longest coastline in the world?",
            "options": ["Norway", "Canada", "Australia", "Indonesia"],
            "answer": "Canada",
            "difficulty": "medium",
        },
        {
            "question": "The Nile River flows through which continent?",
            "options": ["Europe", "Asia", "Africa", "South America"],
            "answer": "Africa",
            "difficulty": "medium",
        },
        {
            "question": "Which country is home to Machu Picchu?",
            "options": ["Peru", "Mexico", "Chile", "Bolivia"],
            "answer": "Peru",
            "difficulty": "medium",
        },
    ],
    "History": [
        {
            "question": "Who was the first president of the United States?",
            "options": ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
            "answer": "George Washington",
            "difficulty": "easy",
        },
        {
            "question": "The Great Wall of China was primarily built to protect against invasions from which direction?",
            "options": ["South", "East", "North", "West"],
            "answer": "North",
            "difficulty": "easy",
        },
        {
            "question": "Which empire built Machu Picchu?",
            "options": ["Roman Empire", "Maya Civilization", "Inca Empire", "Ottoman Empire"],
            "answer": "Inca Empire",
            "difficulty": "easy",
        },
        {
            "question": "Who painted the Mona Lisa?",
            "options": ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
            "answer": "Leonardo da Vinci",
            "difficulty": "easy",
        },
        {
            "question": "Which ancient civilization built the pyramids of Giza?",
            "options": ["Romans", "Greeks", "Egyptians", "Persians"],
            "answer": "Egyptians",
            "difficulty": "easy",
        },
        {
            "question": "Which event began in 1914 and reshaped much of the world?",
            "options": ["French Revolution", "World War I", "Cold War", "Industrial Revolution"],
            "answer": "World War I",
            "difficulty": "medium",
        },
        {
            "question": "Who was the Roman leader famously assassinated on the Ides of March?",
            "options": ["Augustus", "Julius Caesar", "Nero", "Hadrian"],
            "answer": "Julius Caesar",
            "difficulty": "medium",
        },
        {
            "question": "The Berlin Wall fell in which year?",
            "options": ["1984", "1989", "1975", "1991"],
            "answer": "1989",
            "difficulty": "medium",
        },
        {
            "question": "Who was known as the Iron Lady?",
            "options": ["Margaret Thatcher", "Angela Merkel", "Queen Elizabeth II", "Indira Gandhi"],
            "answer": "Margaret Thatcher",
            "difficulty": "medium",
        },
        {
            "question": "Which civilization developed the concept of democracy in Athens?",
            "options": ["Romans", "Egyptians", "Greeks", "Vikings"],
            "answer": "Greeks",
            "difficulty": "medium",
        },
    ],
    "Technology": [
        {
            "question": "What does CPU stand for?",
            "options": ["Central Processing Unit", "Central Program Utility", "Computer Power Unit", "Core Processing Utility"],
            "answer": "Central Processing Unit",
            "difficulty": "easy",
        },
        {
            "question": "Which company created the iPhone?",
            "options": ["Samsung", "Microsoft", "Apple", "Google"],
            "answer": "Apple",
            "difficulty": "easy",
        },
        {
            "question": "What does HTML stand for?",
            "options": ["HyperText Markup Language", "HighText Machine Language", "Hyperlink and Text Management Language", "Home Tool Markup Language"],
            "answer": "HyperText Markup Language",
            "difficulty": "easy",
        },
        {
            "question": "Which language is primarily used to style web pages?",
            "options": ["HTML", "CSS", "SQL", "Python"],
            "answer": "CSS",
            "difficulty": "easy",
        },
        {
            "question": "What does RAM stand for?",
            "options": ["Read Access Memory", "Random Access Memory", "Rapid Access Module", "Remote Access Machine"],
            "answer": "Random Access Memory",
            "difficulty": "easy",
        },
        {
            "question": "Which company developed the Python programming language?",
            "options": ["Google", "Microsoft", "Python Software Foundation", "Apple"],
            "answer": "Python Software Foundation",
            "difficulty": "medium",
        },
        {
            "question": "What is the main purpose of a firewall?",
            "options": ["To increase memory", "To protect a network from unauthorized access", "To format files", "To speed up CPU"],
            "answer": "To protect a network from unauthorized access",
            "difficulty": "medium",
        },
        {
            "question": "Which protocol is used to securely transfer web pages?",
            "options": ["FTP", "HTTP", "HTTPS", "SMTP"],
            "answer": "HTTPS",
            "difficulty": "medium",
        },
        {
            "question": "What does VPN stand for?",
            "options": ["Virtual Private Network", "Visual Processing Number", "Virtual Public Network", "Very Private Network"],
            "answer": "Virtual Private Network",
            "difficulty": "medium",
        },
        {
            "question": "Which data structure is First In, First Out?",
            "options": ["Stack", "Queue", "Tree", "Set"],
            "answer": "Queue",
            "difficulty": "medium",
        },
    ],
    "Entertainment": [
        {
            "question": "Which movie features a young lion named Simba?",
            "options": ["Toy Story", "Finding Nemo", "The Lion King", "Shrek"],
            "answer": "The Lion King",
            "difficulty": "easy",
        },
        {
            "question": "Who is the lead singer of the band Queen?",
            "options": ["David Bowie", "Freddie Mercury", "Elton John", "Robert Plant"],
            "answer": "Freddie Mercury",
            "difficulty": "easy",
        },
        {
            "question": "Which animated film features a robot named WALL-E?",
            "options": ["Toy Story", "Cars", "WALL-E", "Up"],
            "answer": "WALL-E",
            "difficulty": "easy",
        },
        {
            "question": "Which film won the Oscar for Best Picture in 2020?",
            "options": ["1917", "Parasite", "Joker", "Ford v Ferrari"],
            "answer": "Parasite",
            "difficulty": "easy",
        },
        {
            "question": "Which series features characters named Jon Snow and Daenerys Targaryen?",
            "options": ["The Witcher", "Game of Thrones", "The Last Kingdom", "Vikings"],
            "answer": "Game of Thrones",
            "difficulty": "easy",
        },
        {
            "question": "Which artist released the album ""1989""?",
            "options": ["Adele", "Taylor Swift", "Beyoncé", "Billie Eilish"],
            "answer": "Taylor Swift",
            "difficulty": "medium",
        },
        {
            "question": "What is the name of the wizarding school in Harry Potter?",
            "options": ["Beauxbatons", "Ilvermorny", "Hogwarts", "Durmstrang"],
            "answer": "Hogwarts",
            "difficulty": "medium",
        },
        {
            "question": "Which movie features the quote, \"I’ll be back\"?",
            "options": ["RoboCop", "Terminator", "Predator", "Total Recall"],
            "answer": "Terminator",
            "difficulty": "medium",
        },
        {
            "question": "Which band performed the song \"Bohemian Rhapsody\"?",
            "options": ["The Beatles", "Queen", "Pink Floyd", "The Rolling Stones"],
            "answer": "Queen",
            "difficulty": "medium",
        },
        {
            "question": "Who directed the movie Inception?",
            "options": ["Christopher Nolan", "James Cameron", "Steven Spielberg", "Martin Scorsese"],
            "answer": "Christopher Nolan",
            "difficulty": "medium",
        },
    ],
}


def format_choice(label, option):
    return f"{label}. {option}"


class QuizApp:
    def __init__(self, leaderboard_path="leaderboard.json"):
        self.leaderboard_path = Path(leaderboard_path)

    def load_leaderboard(self):
        if not self.leaderboard_path.exists():
            return []
        try:
            with self.leaderboard_path.open("r", encoding="utf-8") as file:
                data = json.load(file)
            return data if isinstance(data, list) else []
        except (json.JSONDecodeError, OSError):
            return []

    def save_leaderboard(self, entries):
        with self.leaderboard_path.open("w", encoding="utf-8") as file:
            json.dump(entries, file, indent=2)

    def get_question_pool(self, category=None, difficulty=None):
        selected = []
        for cat, questions in QUESTION_BANK.items():
            if category and category.lower() != cat.lower():
                continue
            for question in questions:
                if difficulty and question.get("difficulty", "easy").lower() != difficulty.lower():
                    continue
                selected.append({**question, "category": cat})
        return selected

    def build_quiz(self, category, difficulty, count):
        pool = self.get_question_pool(category, difficulty)
        if not pool:
            raise ValueError("No questions available for the chosen category and difficulty.")
        if count > len(pool):
            count = len(pool)
        random.shuffle(pool)
        return pool[:count]

    def show_leaderboard(self):
        scores = self.load_leaderboard()
        if not scores:
            print("\nNo leaderboard entries yet. Be the first to set a score!\n")
            return

        print("\nLeaderboard")
        print("-" * 40)
        for index, entry in enumerate(sorted(scores, key=lambda item: (-item["score"], item["name"]))[:10], start=1):
            print(f"{index}. {entry['name']} - {entry['score']}/{entry['total']} ({entry['accuracy']}%)")
        print("-" * 40)

    def prompt_choice(self, prompt, options):
        while True:
            try:
                print(prompt)
                for index, option in enumerate(options, start=1):
                    print(f"{index}. {option}")
                selection = input("Choose an option: ").strip()
                value = int(selection)
                if 1 <= value <= len(options):
                    return options[value - 1]
            except (EOFError, ValueError):
                print("Please enter a valid number.")
                return options[0]
            print("Please enter a valid number.")

    def prompt_for_answer(self, question):
        while True:
            try:
                response = input("Select an answer number: ").strip()
                choice = int(response)
            except (EOFError, ValueError):
                print("Please enter a valid number.")
                return 1

            if 1 <= choice <= len(question["options"]):
                return choice
            print("Choice out of range. Try again.")

    def present_question(self, question, question_number, total_questions):
        print(f"\nQuestion {question_number}/{total_questions} [{question['category']} - {question['difficulty']}]")
        print(question["question"])
        for index, option in enumerate(question["options"], start=1):
            print(format_choice(index, option))

        chosen_index = self.prompt_for_answer(question)
        selected_option = question["options"][chosen_index - 1]
        is_correct = selected_option == question["answer"]

        if is_correct:
            print("Correct! ✅")
        else:
            print(f"Incorrect. The correct answer is: {question['answer']} ❌")

        return chosen_index, selected_option, is_correct

    def run(self):
        print("\n=== Terra Quiz Challenge ===")
        print("A Python-only quiz app with multiple categories and difficulty levels.\n")

        try:
            player_name = input("Enter your name: ").strip() or "Player"
        except EOFError:
            player_name = "Player"

        categories = ["Random"] + sorted(QUESTION_BANK.keys())
        category = self.prompt_choice("Choose a category:", categories)
        difficulty_options = ["Any", "Easy", "Medium"]
        difficulty = self.prompt_choice("Choose difficulty:", difficulty_options)

        try:
            question_count = input("How many questions do you want? (default 5): ").strip() or "5"
        except EOFError:
            question_count = "5"

        try:
            question_count = int(question_count)
        except ValueError:
            question_count = 5

        if question_count <= 0:
            question_count = 5

        selected_category = None if category == "Random" else category
        selected_difficulty = None if difficulty == "Any" else difficulty.lower()
        questions = self.build_quiz(selected_category, selected_difficulty, question_count)

        score = 0
        reviewed_answers = []

        for index, question in enumerate(questions, start=1):
            chosen_index, selected_option, is_correct = self.present_question(question, index, len(questions))
            score += 1 if is_correct else 0
            reviewed_answers.append({
                "question": question["question"],
                "your_answer": selected_option,
                "correct_answer": question["answer"],
                "correct": is_correct,
            })

        accuracy = round((score / len(questions)) * 100, 1) if questions else 0
        print("\nQuiz complete!")
        print(f"Your score: {score}/{len(questions)}")
        print(f"Accuracy: {accuracy}%")

        print("\nReview")
        for index, item in enumerate(reviewed_answers, start=1):
            status = "Correct" if item["correct"] else "Incorrect"
            print(f"{index}. {status} - {item['question']} (Answer: {item['correct_answer']})")

        leaderboard = self.load_leaderboard()
        leaderboard.append({
            "name": player_name,
            "score": score,
            "total": len(questions),
            "accuracy": accuracy,
        })
        self.save_leaderboard(leaderboard)

        print("\nWould you like to see the leaderboard? (y/n)")
        try:
            choice = input().strip().lower()
        except EOFError:
            choice = "n"
        if choice in {"y", "yes"}:
            self.show_leaderboard()

        print("\nPlay again? (y/n)")
        try:
            replay = input().strip().lower()
        except EOFError:
            replay = "n"
        if replay in {"y", "yes"}:
            self.run()


def generate_questions():
    return QUESTION_BANK


def get_questions(category=None, difficulty=None):
    app = QuizApp()
    pool = app.get_question_pool(category, difficulty)
    return pool


def run_quiz():
    app = QuizApp()
    app.run()
