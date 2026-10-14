import random


QUESTION_BANK = {
    "General": [
        ("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], "Mars", "easy"),
        ("What is the capital city of Japan?", ["Kyoto", "Tokyo", "Osaka", "Sapporo"], "Tokyo", "easy"),
        ("Who painted the Mona Lisa?", ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], "Leonardo da Vinci", "easy"),
        ("What is the chemical symbol for gold?", ["Ag", "Au", "Go", "Gd"], "Au", "easy"),
        ("Which ocean is the largest on Earth?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], "Pacific Ocean", "easy"),
        ("Which animal is the largest mammal on Earth?", ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"], "Blue whale", "easy"),
        ("Which language is used to style web pages?", ["HTML", "CSS", "Java", "SQL"], "CSS", "easy"),
        ("Which year did the first moon landing happen?", ["1965", "1969", "1972", "1959"], "1969", "medium"),
    ],
    "Python": [
        ("Which keyword defines a function in Python?", ["function", "def", "func", "lambda"], "def", "easy"),
        ('What is the output of len("terra")?', ["4", "5", "6", "3"], "5", "easy"),
        ("Which collection keeps items in key-value pairs?", ["Tuple", "List", "Dictionary", "Set"], "Dictionary", "easy"),
        ("Which method converts a string to lowercase?", ["lower()", "small()", "casefold()", "trim()"], "lower()", "easy"),
        ("Which of these is a Python list?", ['{"a": 1}', "(1, 2, 3)", "[1, 2, 3]", "{1, 2, 3}"], "[1, 2, 3]", "easy"),
        ("What does the == operator check for?", ["Assignment", "Comparison", "Division", "Concatenation"], "Comparison", "medium"),
        ("Which function is used to read input from a user?", ["print()", "read()", "input()", "scan()"], "input()", "easy"),
        ("What is the purpose of a virtual environment?", ["To create a website", "To isolate dependencies for a project", "To compile code", "To write documentation"], "To isolate dependencies for a project", "medium"),
        ("Which library is commonly used for data analysis?", ["pandas", "torch", "matplotlib", "requests"], "pandas", "medium"),
        ("Which statement is used for error handling?", ["loop", "try", "return", "else"], "try", "medium"),
    ],
    "Science": [
        ("What is H2O commonly known as?", ["Salt", "Water", "Oxygen", "Hydrogen"], "Water", "easy"),
        ("Which part of the cell contains genetic material?", ["Membrane", "Nucleus", "Ribosome", "Cytoplasm"], "Nucleus", "easy"),
        ("What force keeps planets in orbit around the Sun?", ["Magnetism", "Gravity", "Friction", "Electricity"], "Gravity", "easy"),
        ("Which gas do plants absorb from the atmosphere?", ["Oxygen", "Carbon dioxide", "Helium", "Nitrogen"], "Carbon dioxide", "easy"),
        ("What is the boiling point of water at sea level?", ["90°C", "100°C", "110°C", "120°C"], "100°C", "medium"),
        ("Which blood type is considered a universal donor?", ["A+", "O-", "AB+", "B-"], "O-", "medium"),
        ("What is the hardest natural substance?", ["Gold", "Diamond", "Iron", "Quartz"], "Diamond", "medium"),
        ("Which organ pumps blood through the body?", ["Brain", "Lungs", "Liver", "Heart"], "Heart", "easy"),
    ],
    "Geography": [
        ("Which is the largest ocean on Earth?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], "Pacific Ocean", "easy"),
        ("Mount Everest is in which mountain range?", ["Andes", "Himalayas", "Rockies", "Alps"], "Himalayas", "easy"),
        ("Which desert is the largest hot desert in the world?", ["Gobi", "Kalahari", "Sahara", "Arabian"], "Sahara", "medium"),
        ("What is the capital of Canada?", ["Toronto", "Vancouver", "Ottawa", "Montreal"], "Ottawa", "easy"),
        ("Which river runs through Egypt?", ["Amazon", "Nile", "Danube", "Yangtze"], "Nile", "easy"),
        ("Which country has the most natural lakes?", ["Canada", "Brazil", "Russia", "China"], "Canada", "easy"),
        ("The Great Barrier Reef is off the coast of which country?", ["Australia", "Indonesia", "Thailand", "Fiji"], "Australia", "easy"),
        ("Which city is known as the City of Light?", ["Paris", "Rome", "Madrid", "Berlin"], "Paris", "easy"),
    ],
    "History": [
        ("Who was the first president of the United States?", ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"], "George Washington", "easy"),
        ("Which civilization built the pyramids of Giza?", ["Romans", "Egyptians", "Greeks", "Persians"], "Egyptians", "easy"),
        ("Who was known as the Iron Lady?", ["Angela Merkel", "Margaret Thatcher", "Queen Elizabeth II", "Indira Gandhi"], "Margaret Thatcher", "medium"),
        ("Which event began in 1914?", ["World War I", "World War II", "Cold War", "Industrial Revolution"], "World War I", "easy"),
        ("Who was assassinated on the Ides of March?", ["Augustus", "Hadrian", "Julius Caesar", "Nero"], "Julius Caesar", "medium"),
        ("The Berlin Wall fell in which year?", ["1984", "1989", "1975", "1991"], "1989", "medium"),
        ("Which empire ruled much of the Mediterranean world during the Roman era?", ["Ottoman Empire", "Roman Empire", "Byzantine Empire", "Mongol Empire"], "Roman Empire", "easy"),
        ("Which ancient city was home to the Hanging Gardens?", ["Rome", "Babylon", "Athens", "Cairo"], "Babylon", "medium"),
    ],
    "Technology": [
        ("What does HTML stand for?", ["HighText Markup Language", "HyperText Markup Language", "HighText Machine Language", "Home Tool Markup Language"], "HyperText Markup Language", "easy"),
        ("Which company created the iPhone?", ["Samsung", "Microsoft", "Apple", "Google"], "Apple", "easy"),
        ("What does RAM stand for?", ["Read Access Memory", "Random Access Memory", "Rapid Access Module", "Remote Access Machine"], "Random Access Memory", "easy"),
        ("Which protocol is used for secure web browsing?", ["HTTP", "FTP", "HTTPS", "SMTP"], "HTTPS", "easy"),
        ("What is the main purpose of a firewall?", ["To format hard drives", "To protect a network from unauthorized access", "To speed up CPU", "To increase RAM"], "To protect a network from unauthorized access", "medium"),
        ("Which data structure uses FIFO order?", ["Stack", "Queue", "Tree", "HashMap"], "Queue", "medium"),
        ("What does VPN stand for?", ["Virtual Public Network", "Very Private Network", "Virtual Private Network", "Visual Processing Network"], "Virtual Private Network", "medium"),
        ("Which database language is used to query tables?", ["HTML", "SQL", "JSON", "XML"], "SQL", "easy"),
    ],
}


def create_quiz(category, difficulty, count):
    pool = [
        (category_name, question, options, answer, level)
        for category_name, questions in QUESTION_BANK.items()
        for question, options, answer, level in questions
        if (category == "All" or category == category_name)
        and (difficulty == "all" or difficulty == level)
    ]
    random.shuffle(pool)

    quiz = []
    for question_id, (category_name, question, options, answer, level) in enumerate(pool[:count]):
        shuffled_options = options.copy()
        random.shuffle(shuffled_options)
        quiz.append({
            "id": question_id,
            "category": category_name,
            "question": question,
            "options": shuffled_options,
            "answer": answer,
            "difficulty": level,
        })
    return quiz
