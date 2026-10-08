const STORAGE_KEYS = {
  accounts: 'terraQuizAccounts',
  leaderboard: 'terraQuizLeaderboard',
  session: 'terraQuizSession'
};

const questionBank = {
  General: [
    { category: 'General', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars', difficulty: 'easy' },
    { category: 'General', question: 'What is the capital city of Japan?', options: ['Kyoto', 'Tokyo', 'Osaka', 'Sapporo'], answer: 'Tokyo', difficulty: 'easy' },
    { category: 'General', question: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'], answer: 'Leonardo da Vinci', difficulty: 'easy' },
    { category: 'General', question: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Go', 'Gd'], answer: 'Au', difficulty: 'easy' },
    { category: 'General', question: 'Which ocean is the largest on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean', difficulty: 'easy' },
    { category: 'General', question: 'Which animal is the largest mammal on Earth?', options: ['Elephant', 'Blue whale', 'Giraffe', 'Hippopotamus'], answer: 'Blue whale', difficulty: 'easy' },
    { category: 'General', question: 'Which language is used to style web pages?', options: ['HTML', 'CSS', 'Java', 'SQL'], answer: 'CSS', difficulty: 'easy' },
    { category: 'General', question: 'Which year did the first moon landing happen?', options: ['1965', '1969', '1972', '1959'], answer: '1969', difficulty: 'medium' }
  ],
  Python: [
    { category: 'Python', question: 'Which keyword defines a function in Python?', options: ['function', 'def', 'func', 'lambda'], answer: 'def', difficulty: 'easy' },
    { category: 'Python', question: 'What is the output of len("terra")?', options: ['4', '5', '6', '3'], answer: '5', difficulty: 'easy' },
    { category: 'Python', question: 'Which collection keeps items in key-value pairs?', options: ['Tuple', 'List', 'Dictionary', 'Set'], answer: 'Dictionary', difficulty: 'easy' },
    { category: 'Python', question: 'Which method converts a string to lowercase?', options: ['lower()', 'small()', 'casefold()', 'trim()'], answer: 'lower()', difficulty: 'easy' },
    { category: 'Python', question: 'Which of these is a Python list?', options: ['{"a": 1}', '(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}'], answer: '[1, 2, 3]', difficulty: 'easy' },
    { category: 'Python', question: 'What does the `==` operator check for?', options: ['Assignment', 'Comparison', 'Division', 'Concatenation'], answer: 'Comparison', difficulty: 'medium' },
    { category: 'Python', question: 'Which function is used to read input from a user?', options: ['print()', 'read()', 'input()', 'scan()'], answer: 'input()', difficulty: 'easy' },
    { category: 'Python', question: 'What is the purpose of a virtual environment?', options: ['To create a website', 'To isolate dependencies for a project', 'To compile code', 'To write documentation'], answer: 'To isolate dependencies for a project', difficulty: 'medium' },
    { category: 'Python', question: 'Which library is commonly used for data analysis?', options: ['pandas', 'torch', 'matplotlib', 'requests'], answer: 'pandas', difficulty: 'medium' },
    { category: 'Python', question: 'Which statement is used for error handling?', options: ['loop', 'try', 'return', 'else'], answer: 'try', difficulty: 'medium' }
  ],
  Science: [
    { category: 'Science', question: 'What is H2O commonly known as?', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 'Water', difficulty: 'easy' },
    { category: 'Science', question: 'Which part of the cell contains genetic material?', options: ['Membrane', 'Nucleus', 'Ribosome', 'Cytoplasm'], answer: 'Nucleus', difficulty: 'easy' },
    { category: 'Science', question: 'What force keeps planets in orbit around the Sun?', options: ['Magnetism', 'Gravity', 'Friction', 'Electricity'], answer: 'Gravity', difficulty: 'easy' },
    { category: 'Science', question: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Helium', 'Nitrogen'], answer: 'Carbon dioxide', difficulty: 'easy' },
    { category: 'Science', question: 'What is the boiling point of water at sea level?', options: ['90°C', '100°C', '110°C', '120°C'], answer: '100°C', difficulty: 'medium' },
    { category: 'Science', question: 'Which blood type is considered a universal donor?', options: ['A+', 'O-', 'AB+', 'B-'], answer: 'O-', difficulty: 'medium' },
    { category: 'Science', question: 'What is the hardest natural substance?', options: ['Gold', 'Diamond', 'Iron', 'Quartz'], answer: 'Diamond', difficulty: 'medium' },
    { category: 'Science', question: 'Which organ pumps blood through the body?', options: ['Brain', 'Lungs', 'Liver', 'Heart'], answer: 'Heart', difficulty: 'easy' }
  ],
  Geography: [
    { category: 'Geography', question: 'Which is the largest ocean on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean', difficulty: 'easy' },
    { category: 'Geography', question: 'Mount Everest is in which mountain range?', options: ['Andes', 'Himalayas', 'Rockies', 'Alps'], answer: 'Himalayas', difficulty: 'easy' },
    { category: 'Geography', question: 'Which desert is the largest hot desert in the world?', options: ['Gobi', 'Kalahari', 'Sahara', 'Arabian'], answer: 'Sahara', difficulty: 'medium' },
    { category: 'Geography', question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 'Ottawa', difficulty: 'easy' },
    { category: 'Geography', question: 'Which river runs through Egypt?', options: ['Amazon', 'Nile', 'Danube', 'Yangtze'], answer: 'Nile', difficulty: 'easy' },
    { category: 'Geography', question: 'Which country has the most natural lakes?', options: ['Canada', 'Brazil', 'Russia', 'China'], answer: 'Canada', difficulty: 'easy' },
    { category: 'Geography', question: 'The Great Barrier Reef is off the coast of which country?', options: ['Australia', 'Indonesia', 'Thailand', 'Fiji'], answer: 'Australia', difficulty: 'easy' },
    { category: 'Geography', question: 'Which city is known as the City of Light?', options: ['Paris', 'Rome', 'Madrid', 'Berlin'], answer: 'Paris', difficulty: 'easy' }
  ],
  History: [
    { category: 'History', question: 'Who was the first president of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Abraham Lincoln'], answer: 'George Washington', difficulty: 'easy' },
    { category: 'History', question: 'Which civilization built the pyramids of Giza?', options: ['Romans', 'Egyptians', 'Greeks', 'Persians'], answer: 'Egyptians', difficulty: 'easy' },
    { category: 'History', question: 'Who was known as the Iron Lady?', options: ['Angela Merkel', 'Margaret Thatcher', 'Queen Elizabeth II', 'Indira Gandhi'], answer: 'Margaret Thatcher', difficulty: 'medium' },
    { category: 'History', question: 'Which event began in 1914?', options: ['World War I', 'World War II', 'Cold War', 'Industrial Revolution'], answer: 'World War I', difficulty: 'easy' },
    { category: 'History', question: 'Who was assassinated on the Ides of March?', options: ['Augustus', 'Hadrian', 'Julius Caesar', 'Nero'], answer: 'Julius Caesar', difficulty: 'medium' },
    { category: 'History', question: 'The Berlin Wall fell in which year?', options: ['1984', '1989', '1975', '1991'], answer: '1989', difficulty: 'medium' },
    { category: 'History', question: 'Which empire ruled much of the Mediterranean world during the Roman era?', options: ['Ottoman Empire', 'Roman Empire', 'Byzantine Empire', 'Mongol Empire'], answer: 'Roman Empire', difficulty: 'easy' },
    { category: 'History', question: 'Which ancient city was home to the Hanging Gardens?', options: ['Rome', 'Babylon', 'Athens', 'Cairo'], answer: 'Babylon', difficulty: 'medium' }
  ],
  Technology: [
    { category: 'Technology', question: 'What does HTML stand for?', options: ['HighText Markup Language', 'HyperText Markup Language', 'HighText Machine Language', 'Home Tool Markup Language'], answer: 'HyperText Markup Language', difficulty: 'easy' },
    { category: 'Technology', question: 'Which company created the iPhone?', options: ['Samsung', 'Microsoft', 'Apple', 'Google'], answer: 'Apple', difficulty: 'easy' },
    { category: 'Technology', question: 'What does RAM stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Module', 'Remote Access Machine'], answer: 'Random Access Memory', difficulty: 'easy' },
    { category: 'Technology', question: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 'HTTPS', difficulty: 'easy' },
    { category: 'Technology', question: 'What is the main purpose of a firewall?', options: ['To format hard drives', 'To protect a network from unauthorized access', 'To speed up CPU', 'To increase RAM'], answer: 'To protect a network from unauthorized access', difficulty: 'medium' },
    { category: 'Technology', question: 'Which data structure uses FIFO order?', options: ['Stack', 'Queue', 'Tree', 'HashMap'], answer: 'Queue', difficulty: 'medium' },
    { category: 'Technology', question: 'What does VPN stand for?', options: ['Virtual Public Network', 'Very Private Network', 'Virtual Private Network', 'Visual Processing Network'], answer: 'Virtual Private Network', difficulty: 'medium' },
    { category: 'Technology', question: 'Which database language is used to query tables?', options: ['HTML', 'SQL', 'JSON', 'XML'], answer: 'SQL', difficulty: 'easy' }
  ]
};

const state = {
  currentUser: null,
  currentPage: 'welcome',
  category: 'All',
  difficulty: 'all',
  questionCount: 5,
  score: 0,
  currentIndex: 0,
  questions: [],
  answers: [],
  leaderboard: JSON.parse(localStorage.getItem(STORAGE_KEYS.leaderboard) || '[]'),
  authMessage: ''
};

const pages = {
  welcome: document.getElementById('welcomePage'),
  auth: document.getElementById('authPage'),
  dashboard: document.getElementById('dashboardPage'),
  quiz: document.getElementById('quizPage')
};

const elements = {
  welcomeCreateBtn: document.getElementById('welcomeCreateBtn'),
  welcomeSignInBtn: document.getElementById('welcomeSignInBtn'),
  signOutBtn: document.getElementById('signOutBtn'),
  signInForm: document.getElementById('signInForm'),
  signUpForm: document.getElementById('signUpForm'),
  authMessage: document.getElementById('authMessage'),
  quizCategory: document.getElementById('quizCategory'),
  quizDifficulty: document.getElementById('quizDifficulty'),
  questionCount: document.getElementById('questionCount'),
  startQuizBtn: document.getElementById('startQuizBtn'),
  welcomeTitle: document.getElementById('welcomeTitle'),
  leaderboardList: document.getElementById('leaderboardList'),
  scoreValue: document.getElementById('scoreValue'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  questionText: document.getElementById('questionText'),
  answerButtons: document.getElementById('answerButtons'),
  quizCategoryTag: document.getElementById('quizCategoryTag'),
  quizQuestionNumber: document.getElementById('quizQuestionNumber')
};

function loadAccounts() {
  const defaultAccounts = [{ name: 'Demo User', email: 'demo@terra.com', password: 'demo123' }];
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts) || 'null');
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }
  return saved;
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

function setPage(pageName) {
  Object.entries(pages).forEach(([key, node]) => {
    node.classList.toggle('hidden', key !== pageName);
    node.classList.toggle('active', key === pageName);
  });
  state.currentPage = pageName;
}

function setAuthTab(tabName) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === tabName));
  document.getElementById('signInForm').classList.toggle('hidden', tabName !== 'signIn');
  document.getElementById('signUpForm').classList.toggle('hidden', tabName !== 'signUp');
}

function showAuthMessage(message, isError = false) {
  elements.authMessage.textContent = message;
  elements.authMessage.style.color = isError ? '#bf4d4d' : '#2d5649';
}

function populateCategoryOptions() {
  const categories = ['All', ...Object.keys(questionBank)];
  elements.quizCategory.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join('');
}

function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
  return user;
}

function saveSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

function updateSignedInUi() {
  const user = getCurrentUser();
  const signedIn = Boolean(user);
  elements.signOutBtn.classList.toggle('hidden', !signedIn);
  if (signedIn) {
    elements.welcomeTitle.textContent = `Welcome, ${user.name}`;
  }
}

function handleSignUp(event) {
  event.preventDefault();
  const name = document.getElementById('signUpName').value.trim();
  const email = document.getElementById('signUpEmail').value.trim();
  const password = document.getElementById('signUpPassword').value.trim();

  if (!name || !email || !password) {
    showAuthMessage('Please complete all fields.', true);
    return;
  }

  const accounts = loadAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === email.toLowerCase())) {
    showAuthMessage('An account already exists with that email.', true);
    return;
  }

  const newAccount = { name, email, password };
  accounts.push(newAccount);
  saveAccounts(accounts);
  state.currentUser = newAccount;
  saveSession(newAccount);
  updateSignedInUi();
  showAuthMessage('Account created successfully.');
  setTimeout(() => {
    setPage('dashboard');
  }, 500);
  document.getElementById('signUpForm').reset();
}

function handleSignIn(event) {
  event.preventDefault();
  const email = document.getElementById('signInEmail').value.trim();
  const password = document.getElementById('signInPassword').value.trim();

  const accounts = loadAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

  if (!account) {
    showAuthMessage('Invalid email or password.', true);
    return;
  }

  state.currentUser = account;
  saveSession(account);
  updateSignedInUi();
  showAuthMessage('Signed in successfully.');
  setTimeout(() => {
    setPage('dashboard');
  }, 500);
  document.getElementById('signInForm').reset();
}

function signOut() {
  localStorage.removeItem(STORAGE_KEYS.session);
  state.currentUser = null;
  updateSignedInUi();
  setPage('welcome');
}

function getQuestionPool() {
  const selectedCategory = elements.quizCategory.value;
  const allEntries = Object.values(questionBank).flat();
  const filtered = selectedCategory === 'All'
    ? allEntries
    : allEntries.filter((item) => item.category === selectedCategory);

  return filtered.filter((entry) => {
    const difficulty = elements.quizDifficulty.value;
    return difficulty === 'all' || entry.difficulty === difficulty;
  });
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderLeaderboard() {
  const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.leaderboard) || '[]');
  const top = [...entries].sort((a, b) => b.score - a.score).slice(0, 6);

  if (!top.length) {
    elements.leaderboardList.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-rank">No scores yet</span><span class="leaderboard-score">—</span></li>';
    return;
  }

  elements.leaderboardList.innerHTML = top.map((entry, index) => `
    <li class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1} ${entry.name}</span>
      <span class="leaderboard-score">${entry.score}/${entry.total}</span>
    </li>
  `).join('');
}

function updateProgress() {
  const current = state.currentIndex + 1;
  const total = state.questions.length || 1;
  const progress = (current / total) * 100;
  elements.progressBar.style.width = `${progress}%`;
  elements.progressText.textContent = `${current} / ${total}`;
  elements.scoreValue.textContent = state.score;
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  if (!question) {
    finishQuiz();
    return;
  }

  elements.quizCategoryTag.textContent = question.category;
  elements.quizQuestionNumber.textContent = `Question ${state.currentIndex + 1}`;
  elements.questionText.textContent = question.question;
  elements.answerButtons.innerHTML = question.options.map((option, index) => `
    <button class="answer-btn" data-choice="${index}" data-value="${option}">${option}</button>
  `).join('');

  elements.answerButtons.querySelectorAll('.answer-btn').forEach((button) => {
    button.addEventListener('click', () => handleAnswer(button, question));
  });

  updateProgress();
}

function handleAnswer(button, question) {
  const selectedAnswer = button.dataset.value;
  const isCorrect = selectedAnswer === question.answer;

  elements.answerButtons.querySelectorAll('.answer-btn').forEach((node) => {
    const isChosen = node.dataset.value === selectedAnswer;
    const isTrueAnswer = node.dataset.value === question.answer;
    node.disabled = true;
    if (isTrueAnswer) {
      node.classList.add('correct');
    }
    if (isChosen && !isCorrect) {
      node.classList.add('incorrect');
    }
  });

  if (isCorrect) {
    state.score += 1;
  }

  state.answers.push({
    question: question.question,
    selected: selectedAnswer,
    correct: question.answer,
    isCorrect
  });

  setTimeout(() => {
    state.currentIndex += 1;
    if (state.currentIndex < state.questions.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 700);

  updateProgress();
}

function finishQuiz() {
  const total = state.questions.length;
  const accuracy = total ? Math.round((state.score / total) * 100) : 0;
  const playerName = state.currentUser?.name || 'Guest';

  const leaderboardEntry = {
    name: playerName,
    score: state.score,
    total,
    accuracy
  };

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.leaderboard) || '[]');
  saved.push(leaderboardEntry);
  localStorage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(saved));
  renderLeaderboard();

  elements.answerButtons.innerHTML = state.answers.map((entry) => `
    <button class="answer-btn ${entry.isCorrect ? 'correct' : 'incorrect'}" disabled>
      ${entry.question} — ${entry.isCorrect ? 'Correct' : `Correct answer: ${entry.correct}`}
    </button>
  `).join('');

  elements.questionText.textContent = `${playerName}, your final score is ${state.score}/${total} (${accuracy}%).`;
  elements.quizCategoryTag.textContent = 'Results';
  elements.quizQuestionNumber.textContent = 'Summary';
  elements.progressText.textContent = `${total} / ${total}`;
  elements.progressBar.style.width = '100%';

  const replayButton = document.createElement('button');
  replayButton.type = 'button';
  replayButton.textContent = 'Play again';
  replayButton.className = 'primary-btn full';
  replayButton.addEventListener('click', () => {
    setPage('dashboard');
  });

  const existing = elements.answerButtons.querySelector('.primary-btn');
  if (existing) existing.remove();
  elements.answerButtons.appendChild(replayButton);
}

function startQuiz() {
  const pool = getQuestionPool();
  const totalQuestions = Math.min(Math.max(Number(elements.questionCount.value) || 5, 1), 12);
  const questions = shuffle(pool).slice(0, Math.min(totalQuestions, pool.length));

  if (!questions.length) {
    alert('There are no questions in that category and difficulty. Please choose another option.');
    return;
  }

  state.questions = questions;
  state.currentIndex = 0;
  state.score = 0;
  state.answers = [];
  setPage('quiz');
  renderQuestion();
}

function initialize() {
  populateCategoryOptions();
  renderLeaderboard();
  updateSignedInUi();

  const currentUser = getCurrentUser();
  if (currentUser) {
    state.currentUser = currentUser;
    updateSignedInUi();
    setPage('dashboard');
  } else {
    setPage('welcome');
  }

  elements.welcomeCreateBtn.addEventListener('click', () => {
    setAuthTab('signUp');
    setPage('auth');
  });

  elements.welcomeSignInBtn.addEventListener('click', () => {
    setAuthTab('signIn');
    setPage('auth');
  });

  document.querySelectorAll('.tab-btn').forEach((tab) => {
    tab.addEventListener('click', () => setAuthTab(tab.dataset.authTab));
  });

  elements.signOutBtn.addEventListener('click', signOut);
  elements.signInForm.addEventListener('submit', handleSignIn);
  elements.signUpForm.addEventListener('submit', handleSignUp);
  elements.startQuizBtn.addEventListener('click', startQuiz);
}

initialize();
