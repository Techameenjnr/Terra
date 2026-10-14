const STORAGE_KEYS = {
  accounts: 'terraQuizAccounts',
  stats: 'terraQuizStats'
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
  needHelpBtn: document.getElementById('needHelpBtn'),
  needHelpPanel: document.getElementById('needHelpPanel'),
  helpPanelMessage: document.getElementById('helpPanelMessage'),
  demoCredentials: document.getElementById('demoCredentials'),
  demoEmail: document.getElementById('demoEmail'),
  demoPassword: document.getElementById('demoPassword'),
  authMessage: document.getElementById('authMessage'),
  quizCategory: document.getElementById('quizCategory'),
  quizDifficulty: document.getElementById('quizDifficulty'),
  questionCount: document.getElementById('questionCount'),
  startQuizBtn: document.getElementById('startQuizBtn'),
  welcomeTitle: document.getElementById('welcomeTitle'),
  leaderboardList: document.getElementById('leaderboardList'),
  bestScoreStat: document.getElementById('bestScoreStat'),
  bestStreakStat: document.getElementById('bestStreakStat'),
  gamesStat: document.getElementById('gamesStat'),
  scoreValue: document.getElementById('scoreValue'),
  timeValue: document.getElementById('timeValue'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  questionText: document.getElementById('questionText'),
  answerButtons: document.getElementById('answerButtons'),
  quizCategoryTag: document.getElementById('quizCategoryTag'),
  quizQuestionNumber: document.getElementById('quizQuestionNumber')
};


const CATEGORIES = ['All', 'General', 'Python', 'Science', 'Geography', 'History', 'Technology'];

const state = {
  currentUser: null,
  questions: [],
  score: 0,
  currentIndex: 0,
  answers: [],
  category: 'All',
  difficulty: 'all',
  timeLeft: 18,
  timerId: null,
  currentStreak: 0,
  bestStreak: 0,
  bestScore: 0,
  totalGames: 0
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
    elements.needHelpPanel.classList.add('hidden');
  }
}

function populateCategoryOptions() {
  elements.quizCategory.innerHTML = CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join('');
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

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.stats);
    return raw ? JSON.parse(raw) : { bestScore: 0, bestStreak: 0, totalGames: 0 };
  } catch (error) {
    return { bestScore: 0, bestStreak: 0, totalGames: 0 };
  }
}

function saveStats() {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify({
    bestScore: state.bestScore,
    bestStreak: state.bestStreak,
    totalGames: state.totalGames
  }));
}

function updateDashboardStats() {
  elements.bestScoreStat.textContent = String(state.bestScore);
  elements.bestStreakStat.textContent = String(state.bestStreak);
  elements.gamesStat.textContent = String(state.totalGames);
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

function handleNeedHelp() {
  const isVisible = !elements.needHelpPanel.classList.contains('hidden');
  elements.needHelpPanel.classList.toggle('hidden', isVisible);
  if (isVisible) {
    return;
  }

  elements.helpPanelMessage.textContent = 'Loading help…';
  elements.demoCredentials.classList.add('hidden');
  asyncJson('/api/demo')
    .then((info) => {
      if (info.available) {
        elements.helpPanelMessage.textContent = 'Demo account';
        elements.demoEmail.textContent = info.email;
        elements.demoPassword.textContent = info.password;
        elements.demoCredentials.classList.remove('hidden');
      } else {
        elements.helpPanelMessage.textContent = 'Create an account to get started. For account recovery, contact the project team.';
      }
    })
    .catch(() => {
      elements.helpPanelMessage.textContent = 'Help is temporarily unavailable. Please try again.';
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

function clearQuestionTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerDisplay() {
  elements.timeValue.textContent = `${Math.max(0, state.timeLeft)}s`;
}

function startQuestionTimer(question) {
  clearQuestionTimer();
  state.timeLeft = 18;
  updateTimerDisplay();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearQuestionTimer();
      handleAnswer(null, question);
    }
  }, 1000);
}

function renderLeaderboard() {
  asyncJson('/api/leaderboard')
    .then((entries) => {
      const topEntries = entries.slice(0, 6);
      if (!topEntries.length) {
        elements.leaderboardList.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-rank">No scores yet</span><span class="leaderboard-score">—</span></li>';
        return;
      }
      elements.leaderboardList.replaceChildren(...topEntries.map((entry, index) => {
        const item = document.createElement('li');
        const rank = document.createElement('span');
        const score = document.createElement('span');
        item.className = 'leaderboard-item';
        rank.className = 'leaderboard-rank';
        score.className = 'leaderboard-score';
        rank.textContent = `#${index + 1} ${entry.name}`;
        score.textContent = `${entry.score}/${entry.total}`;
        item.append(rank, score);
        return item;
      }));
    })
    .catch(() => {
      elements.leaderboardList.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-rank">Leaderboard unavailable</span><span class="leaderboard-score">—</span></li>';
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

  startQuestionTimer(question);
  updateProgress();
}

function handleAnswer(button, question) {
  clearQuestionTimer();
  const selectedAnswer = button ? button.dataset.answer : null;
  elements.answerButtons.querySelectorAll('.answer-btn').forEach((node) => {
    node.disabled = true;
  });

  asyncJson('/api/quiz/answer', {
    method: 'POST',
    body: JSON.stringify({
      question_index: state.currentIndex,
      answer: selectedAnswer
    })
  }).then((result) => {
    state.score = result.score;
    state.currentStreak = result.streak;
    state.bestStreak = Math.max(state.bestStreak, result.streak);
    state.answers.push(result.answer);

    elements.answerButtons.querySelectorAll('.answer-btn').forEach((node) => {
      if (node.dataset.answer === result.correct_answer) {
        node.classList.add('correct');
      } else if (node.dataset.answer === selectedAnswer && !result.is_correct) {
        node.classList.add('incorrect');
      }
    });
    updateProgress();

    setTimeout(() => {
      if (result.finished) {
        finishQuiz(result.summary);
        return;
      }
      state.currentIndex += 1;
      renderQuestion();
    }, 650);
  }).catch((error) => {
    alert(error.message);
    elements.answerButtons.querySelectorAll('.answer-btn').forEach((node) => {
      node.disabled = false;
    });
    startQuestionTimer(question);
  });
}

function finishQuiz(summary) {
  const { total, accuracy, answers } = summary;
  const playerName = state.currentUser?.name || 'Guest';

  state.score = summary.score;
  state.bestStreak = summary.best_streak;
  state.answers = answers;
  state.bestScore = Math.max(state.bestScore, state.score);
  state.totalGames += 1;
  saveStats();
  updateDashboardStats();
  renderLeaderboard();

  elements.quizCategoryTag.textContent = 'Results';
  elements.quizQuestionNumber.textContent = 'Summary';
  elements.questionText.textContent = `${playerName}, you finished the round.`;
  elements.answerButtons.innerHTML = `
    <div class="result-summary">
      <div class="result-pill">
        <span>Score</span>
        <strong>${state.score}/${total}</strong>
      </div>
      <div class="result-pill">
        <span>Accuracy</span>
        <strong>${accuracy}%</strong>
      </div>
      <div class="result-pill">
        <span>Best streak</span>
        <strong>${state.bestStreak}</strong>
      </div>
    </div>
    <p id="resultStatus" class="result-status" role="status">Your verified score has been added to the leaderboard.</p>
    ${state.answers.map((entry) => `
      <button class="answer-btn ${entry.isCorrect ? 'correct' : 'incorrect'}" disabled>
        ${entry.question} — ${entry.isCorrect ? 'Correct' : `Correct answer: ${entry.correct}`}
      </button>
    `).join('')}
  `;
  elements.progressBar.style.width = '100%';
  elements.progressText.textContent = `${total} / ${total}`;

  const replay = document.createElement('button');
  replay.type = 'button';
  replay.textContent = 'Play again';
  replay.className = 'primary-btn full';
  replay.addEventListener('click', () => {
    setPage('dashboard');
    clearQuestionTimer();
    state.currentIndex = 0;
    state.answers = [];
    state.score = 0;
    state.currentStreak = 0;
    elements.scoreValue.textContent = '0';
    elements.timeValue.textContent = '18s';
  });
  elements.answerButtons.appendChild(replay);
}

function startQuiz() {
  const requestedCount = Math.min(Math.max(Number(elements.questionCount.value) || 5, 1), 12);
  elements.startQuizBtn.disabled = true;
  asyncJson('/api/quiz/start', {
    method: 'POST',
    body: JSON.stringify({
      category: elements.quizCategory.value,
      difficulty: elements.quizDifficulty.value,
      count: requestedCount
    })
  }).then((quiz) => {
    clearQuestionTimer();
    state.questions = quiz.questions;
    state.score = 0;
    state.currentIndex = 0;
    state.answers = [];
    state.currentStreak = 0;
    state.bestStreak = 0;
    setPage('quiz');
    renderQuestion();
  }).catch((error) => {
    alert(error.message);
  }).finally(() => {
    elements.startQuizBtn.disabled = false;
  });
}

function initialize() {
  const savedStats = loadStats();
  state.bestScore = savedStats.bestScore || 0;
  state.bestStreak = savedStats.bestStreak || 0;
  state.totalGames = savedStats.totalGames || 0;
  updateDashboardStats();

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
  elements.needHelpBtn.addEventListener('click', handleNeedHelp);
  elements.signInForm.addEventListener('submit', handleSignIn);
  elements.signUpForm.addEventListener('submit', handleSignUp);
  elements.startQuizBtn.addEventListener('click', startQuiz);
}

initialize();
