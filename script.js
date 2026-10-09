const STORAGE_KEYS = {
  accounts: 'terraQuizAccounts'
};

const pageRefs = {
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
    { category: 'Python', question: 'What does the == operator check for?', options: ['Assignment', 'Comparison', 'Division', 'Concatenation'], answer: 'Comparison', difficulty: 'medium' },
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
  questions: [],
  score: 0,
  currentIndex: 0,
  answers: [],
  category: 'All',
  difficulty: 'all'
};

function showMessage(message, isError = false) {
  elements.authMessage.textContent = message;
  elements.authMessage.style.color = isError ? '#bf4d4d' : '#2d5649';
}

function setPage(name) {
  Object.entries(pageRefs).forEach(([key, node]) => {
    node.classList.toggle('hidden', key !== name);
  });
}

function setAuthTab(tab) {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach((button) => {
    const isActive = button.dataset.authTab === tab;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  signInForm.classList.toggle('hidden', tab !== 'signIn');
  signUpForm.classList.toggle('hidden', tab !== 'signUp');

  signInForm.style.display = tab === 'signIn' ? 'block' : 'none';
  signUpForm.style.display = tab === 'signUp' ? 'block' : 'none';

  signInForm.classList.toggle('active', tab === 'signIn');
  signUpForm.classList.toggle('active', tab === 'signUp');

  if (tab !== 'signIn') {
    elements.authMessage.textContent = '';
  }
}

function populateCategoryOptions() {
  const categories = ['All', ...Object.keys(questionBank)];
  elements.quizCategory.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join('');
}

function asyncJson(url, options = {}) {
  return fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Request failed');
    }
    return payload;
  });
}

function refreshSession() {
  return asyncJson('/api/session')
    .then((payload) => {
      state.currentUser = payload.user;
      updateAuthUi();
      if (payload.user) {
        renderLeaderboard();
      }
      return payload.user;
    })
    .catch(() => {
      state.currentUser = null;
      updateAuthUi();
    });
}

function updateAuthUi() {
  const signedIn = Boolean(state.currentUser);
  elements.signOutBtn.classList.toggle('hidden', !signedIn);
  if (state.currentUser) {
    elements.welcomeTitle.textContent = `Welcome, ${state.currentUser.name}`;
  }
}

function handleSignUp(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    name: form.querySelector('#signUpName').value.trim(),
    email: form.querySelector('#signUpEmail').value.trim().toLowerCase(),
    password: form.querySelector('#signUpPassword').value.trim()
  };

  asyncJson('/api/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(() => {
    form.reset();
    showMessage('Account created successfully.');
    refreshSession().then(() => setPage('dashboard'));
  }).catch((error) => {
    showMessage(error.message, true);
  });
}

function handleSignIn(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    email: form.querySelector('#signInEmail').value.trim().toLowerCase(),
    password: form.querySelector('#signInPassword').value.trim()
  };

  asyncJson('/api/signin', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(() => {
    form.reset();
    showMessage('Signed in successfully.');
    refreshSession().then(() => setPage('dashboard'));
  }).catch((error) => {
    showMessage(error.message, true);
  });
}

function handleSignOut() {
  asyncJson('/api/logout', { method: 'POST' })
    .finally(() => {
      state.currentUser = null;
      updateAuthUi();
      setPage('welcome');
    });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderLeaderboard() {
  asyncJson('/api/leaderboard')
    .then((entries) => {
      const topEntries = entries.slice(0, 6);
      if (!topEntries.length) {
        elements.leaderboardList.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-rank">No scores yet</span><span class="leaderboard-score">—</span></li>';
        return;
      }
      elements.leaderboardList.innerHTML = topEntries.map((entry, index) => `
        <li class="leaderboard-item">
          <span class="leaderboard-rank">#${index + 1} ${entry.name}</span>
          <span class="leaderboard-score">${entry.score}/${entry.total}</span>
        </li>
      `).join('');
    })
    .catch(() => {
      elements.leaderboardList.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-rank">Leaderboard unavailable</span><span class="leaderboard-score">—</span></li>';
    });
}

function buildQuestionPool() {
  const selectedCategory = elements.quizCategory.value;
  const selectedDifficulty = elements.quizDifficulty.value;
  const allQuestions = Object.values(questionBank).flat();
  return allQuestions.filter((question) => {
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });
}

function updateProgress() {
  const total = state.questions.length || 1;
  const current = state.currentIndex + 1;
  elements.progressBar.style.width = `${(current / total) * 100}%`;
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
  elements.answerButtons.innerHTML = question.options.map((option) => `
    <button class="answer-btn" data-answer="${option}">${option}</button>
  `).join('');

  elements.answerButtons.querySelectorAll('.answer-btn').forEach((button) => {
    button.addEventListener('click', () => handleAnswer(button, question));
  });

  updateProgress();
}

function handleAnswer(button, question) {
  const selectedAnswer = button.dataset.answer;
  const isCorrect = selectedAnswer === question.answer;

  elements.answerButtons.querySelectorAll('.answer-btn').forEach((node) => {
    const value = node.dataset.answer;
    node.disabled = true;
    if (value === question.answer) {
      node.classList.add('correct');
    }
    if (value === selectedAnswer && !isCorrect) {
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
  }, 650);

  updateProgress();
}

function finishQuiz() {
  const total = state.questions.length;
  const accuracy = total ? Math.round((state.score / total) * 100) : 0;
  const playerName = state.currentUser?.name || 'Guest';

  asyncJson('/api/leaderboard', {
    method: 'POST',
    body: JSON.stringify({
      name: playerName,
      score: state.score,
      total,
      accuracy,
      category: elements.quizCategory.value
    })
  }).finally(() => {
    renderLeaderboard();
  });

  elements.quizCategoryTag.textContent = 'Results';
  elements.quizQuestionNumber.textContent = 'Summary';
  elements.questionText.textContent = `${playerName}, your final score is ${state.score}/${total} (${accuracy}%).`;
  elements.answerButtons.innerHTML = state.answers.map((entry) => `
    <button class="answer-btn ${entry.isCorrect ? 'correct' : 'incorrect'}" disabled>
      ${entry.question} — ${entry.isCorrect ? 'Correct' : `Correct answer: ${entry.correct}`}
    </button>
  `).join('');
  elements.progressBar.style.width = '100%';
  elements.progressText.textContent = `${total} / ${total}`;

  const replay = document.createElement('button');
  replay.type = 'button';
  replay.textContent = 'Play again';
  replay.className = 'primary-btn full';
  replay.addEventListener('click', () => setPage('dashboard'));
  elements.answerButtons.appendChild(replay);
}

function startQuiz() {
  const pool = buildQuestionPool();
  const requestedCount = Math.min(Math.max(Number(elements.questionCount.value) || 5, 1), 12);
  const selectedQuestions = shuffle(pool).slice(0, Math.min(requestedCount, pool.length));

  if (!selectedQuestions.length) {
    alert('No questions match your selected filters. Please choose another combination.');
    return;
  }

  state.questions = selectedQuestions;
  state.score = 0;
  state.currentIndex = 0;
  state.answers = [];
  setPage('quiz');
  renderQuestion();
}

function initialize() {
  populateCategoryOptions();
  renderLeaderboard();
  setPage('welcome');
  setAuthTab('signIn');
  refreshSession();

  elements.welcomeCreateBtn.addEventListener('click', () => {
    setAuthTab('signUp');
    setPage('auth');
  });

  elements.welcomeSignInBtn.addEventListener('click', () => {
    setAuthTab('signIn');
    setPage('auth');
  });

  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => setAuthTab(button.dataset.authTab));
  });

  elements.signOutBtn.addEventListener('click', handleSignOut);
  elements.signInForm.addEventListener('submit', handleSignIn);
  elements.signUpForm.addEventListener('submit', handleSignUp);
  elements.startQuizBtn.addEventListener('click', startQuiz);
}

initialize();
