// Global Application State
const AppState = {
    currentUser: null,
    currentSection: 'dashboard',
    isAuthenticated: false,
    stressData: [],
    gameScores: {},
    moodLogs: [],
    goals: [],
    assessments: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Simulate app initialization
    setTimeout(() => {
        hideLoadingScreen();
        checkAuthentication();
    }, 2000);
}

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('hidden');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
}

function checkAuthentication() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        AppState.currentUser = JSON.parse(user);
        AppState.isAuthenticated = true;
        showMainApp();
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function showMainApp() {
    document.getElementById('mainApp').style.display = 'block';
    updateUserInterface();
    loadDashboardData();
}

function setupEventListeners() {
    // Auth form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // User menu toggle
    document.addEventListener('click', function(e) {
        const userMenu = document.getElementById('userDropdown');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (e.target === userAvatar || userAvatar.contains(e.target)) {
            userMenu.classList.toggle('active');
        } else {
            userMenu.classList.remove('active');
        }
    });
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Authentication Functions
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login validation
    if (email && password) {
        const user = {
            id: Date.now(),
            name: 'John Doe',
            email: email,
            birthdate: '1990-01-01',
            joinDate: new Date().toISOString()
        };
        
        AppState.currentUser = user;
        AppState.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        hideAuthModal();
        showMainApp();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const birthdate = document.getElementById('registerBirthdate').value;
    
    if (name && email && password && birthdate) {
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            birthdate: birthdate,
            joinDate: new Date().toISOString()
        };
        
        AppState.currentUser = user;
        AppState.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        hideAuthModal();
        showMainApp();
        showNotification('Registration successful!', 'success');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function logout() {
    AppState.currentUser = null;
    AppState.isAuthenticated = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('stressData');
    localStorage.removeItem('gameScores');
    localStorage.removeItem('moodLogs');
    
    document.getElementById('mainApp').style.display = 'none';
    showAuthModal();
    showNotification('Logged out successfully', 'info');
}

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionName).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
    
    AppState.currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'assessment':
            loadAssessmentData();
            break;
        case 'games':
            loadGamesData();
            break;
        case 'tracking':
            loadTrackingData();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

function updateUserInterface() {
    if (AppState.currentUser) {
        document.getElementById('userName').textContent = AppState.currentUser.name;
        document.getElementById('userEmail').textContent = AppState.currentUser.email;
        document.getElementById('dashboardUserName').textContent = AppState.currentUser.name.split(' ')[0];
    }
}

// Dashboard Functions
function loadDashboardData() {
    loadStressMeter();
    loadRecentActivity();
    loadWeeklyChart();
    loadGoals();
    loadDailyTip();
}

function loadStressMeter() {
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    const today = new Date().toDateString();
    const todayData = stressData.find(entry => new Date(entry.date).toDateString() === today);
    
    const stressLevel = todayData ? todayData.stressLevel : 0;
    const percentage = (stressLevel / 10) * 100;
    
    animateStressMeter(percentage);
    updateStressTrend(stressData);
}

function animateStressMeter(percentage) {
    const meterFill = document.getElementById('dashboardStressMeter');
    const meterValue = document.getElementById('dashboardStressValue');
    
    if (meterFill && meterValue) {
        const degrees = (percentage / 100) * 360;
        meterFill.style.background = `conic-gradient(from 0deg, #4CAF50 0deg, #FFC107 120deg, #FF5722 240deg, #F44336 ${degrees}deg, transparent ${degrees}deg)`;
        meterValue.textContent = Math.round(percentage);
    }
}

function updateStressTrend(stressData) {
    const trendIndicator = document.getElementById('stressTrend');
    if (stressData.length < 2) return;
    
    const today = stressData[stressData.length - 1];
    const yesterday = stressData[stressData.length - 2];
    
    const change = today.stressLevel - yesterday.stressLevel;
    const changePercent = Math.round((change / yesterday.stressLevel) * 100);
    
    if (change > 0) {
        trendIndicator.innerHTML = `<i class="fas fa-arrow-up"></i><span>+${changePercent}% from yesterday</span>`;
        trendIndicator.className = 'trend-indicator negative';
    } else {
        trendIndicator.innerHTML = `<i class="fas fa-arrow-down"></i><span>${changePercent}% from yesterday</span>`;
        trendIndicator.className = 'trend-indicator';
    }
}

function loadRecentActivity() {
    const activities = [
        { icon: 'fas fa-clipboard-check', title: 'Completed Stress Assessment', time: '2 hours ago' },
        { icon: 'fas fa-lungs', title: 'Breathing Exercise', time: 'Yesterday' },
        { icon: 'fas fa-om', title: 'Meditation Session', time: '2 days ago' },
        { icon: 'fas fa-gamepad', title: 'Color Matching Game', time: '3 days ago' }
    ];
    
    const container = document.getElementById('recentActivity');
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon}"></i>
            <div class="activity-content">
                <span class="activity-title">${activity.title}</span>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function loadWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    const stressData = generateMockStressData(7);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stressData.map(d => d.day),
            datasets: [{
                label: 'Stress Level',
                data: stressData.map(d => d.stressLevel),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function loadGoals() {
    const goals = [
        { title: 'Daily Meditation', progress: 5, total: 7, percentage: 71 },
        { title: 'Exercise', progress: 3, total: 5, percentage: 60 },
        { title: 'Breathing Exercises', progress: 8, total: 10, percentage: 80 }
    ];
    
    const container = document.querySelector('.goals-list');
    container.innerHTML = goals.map(goal => `
        <div class="goal-item">
            <div class="goal-info">
                <span class="goal-title">${goal.title}</span>
                <span class="goal-progress">${goal.progress}/${goal.total} days</span>
            </div>
            <div class="goal-bar">
                <div class="goal-fill" style="width: ${goal.percentage}%"></div>
            </div>
        </div>
    `).join('');
}

function loadDailyTip() {
    const tips = [
        "Take a 5-minute break every hour to stretch and breathe deeply. This can significantly reduce stress levels throughout the day.",
        "Practice the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
        "Keep a gratitude journal. Writing down three things you're grateful for each day can improve your mood and reduce stress.",
        "Try progressive muscle relaxation: tense each muscle group for 5 seconds, then release. Start from your toes and work up to your head.",
        "Spend time in nature. Even 10 minutes outdoors can reduce cortisol levels and improve your sense of well-being."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('dailyTip').textContent = randomTip;
}

// Quick Actions
function startQuickAssessment() {
    showSection('assessment');
    showNotification('Starting quick assessment...', 'info');
}

function startBreathingExercise() {
    openGameModal('breathing');
}

function startMeditation() {
    openGameModal('meditation');
}

function logMood() {
    openModal('moodLogModal');
}

// Assessment Functions
function loadAssessmentData() {
    loadQuizData();
    loadAssessmentHistory();
}

function switchAssessmentTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="switchAssessmentTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Quiz functionality (reusing from previous implementation)
let currentQuestionIndex = 0;
let quizAnswers = [];
let stressQuizQuestions = [
    {
        question: "How often do you feel overwhelmed by your daily responsibilities?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    // ... (include all 20 questions from previous implementation)
];

function loadQuizData() {
    if (currentQuestionIndex >= stressQuizQuestions.length) {
        calculateStressScore();
        return;
    }
    
    const question = stressQuizQuestions[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    questionText.textContent = question.question;
    
    const progress = ((currentQuestionIndex + 1) / stressQuizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = stressQuizQuestions.length;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="question${currentQuestionIndex}" value="${option.value}" id="option${index}">
            <label for="option${index}">${option.text}</label>
        `;
        
        optionElement.addEventListener('click', function() {
            selectOption(option.value, optionElement);
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = !quizAnswers[currentQuestionIndex];
}

function selectOption(value, element) {
    element.parentNode.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
    });
    
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    
    quizAnswers[currentQuestionIndex] = parseInt(value);
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (quizAnswers[currentQuestionIndex] !== undefined) {
        currentQuestionIndex++;
        loadQuizData();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuizData();
    }
}

function calculateStressScore() {
    const stressScore = quizAnswers.reduce((sum, answer) => sum + (answer || 0), 0);
    const maxScore = stressQuizQuestions.length * 4;
    const percentage = (stressScore / maxScore) * 100;
    
    // Save assessment data
    const assessment = {
        id: Date.now(),
        type: 'quiz',
        score: stressScore,
        percentage: percentage,
        date: new Date().toISOString(),
        answers: [...quizAnswers]
    };
    
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    assessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(assessments));
    
    // Save stress data
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    stressData.push({
        date: new Date().toISOString(),
        stressLevel: Math.round(percentage / 10),
        source: 'quiz'
    });
    localStorage.setItem('stressData', JSON.stringify(stressData));
    
    showNotification('Assessment completed! Check your results in the Reports section.', 'success');
    showSection('reports');
}

function loadAssessmentHistory() {
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const container = document.getElementById('assessmentHistory');
    
    if (assessments.length === 0) {
        container.innerHTML = '<p>No assessments completed yet.</p>';
        return;
    }
    
    container.innerHTML = assessments.map(assessment => `
        <div class="assessment-item">
            <div class="assessment-header">
                <h4>${assessment.type === 'quiz' ? 'Stress Assessment Quiz' : 'Game Assessment'}</h4>
                <span class="assessment-date">${new Date(assessment.date).toLocaleDateString()}</span>
            </div>
            <div class="assessment-details">
                <span class="assessment-score">Score: ${assessment.score}</span>
                <span class="assessment-percentage">${Math.round(assessment.percentage)}%</span>
            </div>
        </div>
    `).join('');
}

// Games Functions
function loadGamesData() {
    // Games data is loaded dynamically when modals are opened
}

function switchGameCategory(category) {
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.category-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="switchGameCategory('${category}')"]`).classList.add('active');
    document.getElementById(category + 'Games').classList.add('active');
}

function openGameModal(gameType) {
    const modal = document.getElementById(gameType + 'Modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeGameModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Breathing Exercise Game
let breathingInterval;
let breathingCycles = 0;
let breathingStartTime;
let breathingPhase = 'ready';

function startBreathing() {
    const startBtn = document.getElementById('breathingStartBtn');
    const circle = document.getElementById('breathingCircle');
    const instruction = document.getElementById('breathingInstruction');
    const timer = document.getElementById('breathingTimer');
    
    if (breathingPhase === 'ready') {
        breathingPhase = 'inhale';
        breathingStartTime = Date.now();
        startBtn.textContent = 'Pause';
        
        breathingInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - breathingStartTime) / 1000);
            const cycleTime = elapsed % 8;
            
            if (cycleTime < 3) {
                breathingPhase = 'inhale';
                circle.className = 'breathing-circle breathing-in';
                instruction.textContent = 'Breathe In';
                timer.textContent = 3 - cycleTime;
            } else if (cycleTime < 4) {
                breathingPhase = 'hold';
                circle.className = 'breathing-circle';
                instruction.textContent = 'Hold';
                timer.textContent = 4 - cycleTime;
            } else {
                breathingPhase = 'exhale';
                circle.className = 'breathing-circle breathing-out';
                instruction.textContent = 'Breathe Out';
                timer.textContent = 8 - cycleTime;
            }
            
            if (cycleTime === 0 && elapsed > 0) {
                breathingCycles++;
                document.getElementById('breathingCycles').textContent = breathingCycles;
            }
            
            document.getElementById('breathingDuration').textContent = elapsed + 's';
        }, 1000);
    } else {
        pauseBreathing();
    }
}

function pauseBreathing() {
    clearInterval(breathingInterval);
    document.getElementById('breathingStartBtn').textContent = 'Resume';
    breathingPhase = 'paused';
}

function resetBreathing() {
    clearInterval(breathingInterval);
    breathingCycles = 0;
    breathingPhase = 'ready';
    
    document.getElementById('breathingCircle').className = 'breathing-circle';
    document.getElementById('breathingInstruction').textContent = 'Get Ready';
    document.getElementById('breathingTimer').textContent = '0';
    document.getElementById('breathingStartBtn').textContent = 'Start';
    document.getElementById('breathingCycles').textContent = '0';
    document.getElementById('breathingDuration').textContent = '0s';
}

// Tracking Functions
function loadTrackingData() {
    loadTrackingOverview();
    loadDailyLog();
    loadAnalytics();
    loadGoals();
}

function switchTrackingTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="switchTrackingTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

function loadTrackingOverview() {
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    const currentStress = stressData.length > 0 ? stressData[stressData.length - 1].stressLevel : 0;
    
    document.getElementById('currentStressLevel').textContent = getStressLevelText(currentStress);
    
    // Load weekly trend chart
    loadWeeklyTrendChart();
}

function getStressLevelText(level) {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
}

function loadWeeklyTrendChart() {
    const ctx = document.getElementById('weeklyTrendChart');
    if (!ctx) return;
    
    const stressData = generateMockStressData(7);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stressData.map(d => d.day),
            datasets: [{
                label: 'Stress Level',
                data: stressData.map(d => d.stressLevel),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function loadDailyLog() {
    generateCalendar();
    loadLogEntries();
}

function generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        grid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.onclick = () => selectDay(day);
        
        // Check if this day has data
        const dayData = getDayData(year, month, day);
        if (dayData) {
            dayElement.classList.add('has-data');
        }
        
        // Check if today
        if (day === now.getDate()) {
            dayElement.classList.add('today');
        }
        
        grid.appendChild(dayElement);
    }
}

function getDayData(year, month, day) {
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    const targetDate = new Date(year, month, day).toDateString();
    return stressData.find(entry => new Date(entry.date).toDateString() === targetDate);
}

function selectDay(day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    
    // Add selection to clicked day
    event.target.classList.add('selected');
    
    // Load entries for selected day
    loadLogEntries(day);
}

function loadLogEntries(day = null) {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    const container = document.getElementById('dailyLogEntries');
    
    let filteredLogs = moodLogs;
    if (day) {
        const selectedDate = new Date();
        selectedDate.setDate(day);
        filteredLogs = moodLogs.filter(log => 
            new Date(log.date).toDateString() === selectedDate.toDateString()
        );
    }
    
    if (filteredLogs.length === 0) {
        container.innerHTML = '<p>No entries for this day.</p>';
        return;
    }
    
    container.innerHTML = filteredLogs.map(log => `
        <div class="log-entry">
            <div class="log-entry-header">
                <span class="log-entry-date">${new Date(log.date).toLocaleDateString()}</span>
                <span class="log-entry-time">${new Date(log.date).toLocaleTimeString()}</span>
            </div>
            <div class="log-entry-content">
                <div class="log-entry-item">
                    <span class="log-entry-label">Mood</span>
                    <span class="log-entry-value">${getMoodText(log.mood)}</span>
                </div>
                <div class="log-entry-item">
                    <span class="log-entry-label">Stress Level</span>
                    <span class="log-entry-value">${log.stressLevel}/10</span>
                </div>
                <div class="log-entry-item">
                    <span class="log-entry-label">Factors</span>
                    <span class="log-entry-value">${log.factors.join(', ')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getMoodText(mood) {
    const moods = {
        1: 'Very Bad',
        2: 'Bad',
        3: 'Okay',
        4: 'Good',
        5: 'Great'
    };
    return moods[mood] || 'Unknown';
}

function loadAnalytics() {
    loadStressChart();
    loadActivityChart();
    loadCorrelationChart();
}

function loadStressChart() {
    const ctx = document.getElementById('stressChart');
    if (!ctx) return;
    
    const stressData = generateMockStressData(30);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stressData.map(d => d.day),
            datasets: [{
                label: 'Stress Level',
                data: stressData.map(d => d.stressLevel),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function loadActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const activityData = {
        'Breathing Exercise': 12,
        'Meditation': 8,
        'Exercise': 5,
        'Games': 3
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(activityData),
            datasets: [{
                data: Object.values(activityData),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#4CAF50',
                    '#FFC107'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadCorrelationChart() {
    const ctx = document.getElementById('correlationChart');
    if (!ctx) return;
    
    const correlationData = generateMockCorrelationData();
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Stress vs Mood',
                data: correlationData,
                backgroundColor: 'rgba(102, 126, 234, 0.6)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Stress Level'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Mood'
                    }
                }
            }
        }
    });
}

// Reports Functions
function loadReportsData() {
    loadWeeklyReport();
    loadMonthlyProgress();
    loadPersonalizedInsights();
}

function loadWeeklyReport() {
    const ctx = document.getElementById('weeklyReportChart');
    if (!ctx) return;
    
    const weeklyData = generateMockStressData(7);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(d => d.day),
            datasets: [{
                label: 'Stress Level',
                data: weeklyData.map(d => d.stressLevel),
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function loadMonthlyProgress() {
    // Monthly progress data is already loaded in the HTML
}

function loadPersonalizedInsights() {
    // Personalized insights are already loaded in the HTML
}

// Mood Log Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openMoodLogModal() {
    openModal('moodLogModal');
}

function submitMoodLog(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const mood = parseInt(formData.get('mood'));
    const stressLevel = parseInt(formData.get('stressLevel'));
    const factors = formData.getAll('factors');
    const notes = formData.get('notes');
    
    const moodLog = {
        id: Date.now(),
        date: new Date().toISOString(),
        mood: mood,
        stressLevel: stressLevel,
        factors: factors,
        notes: notes
    };
    
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    moodLogs.push(moodLog);
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    
    // Also save to stress data
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    stressData.push({
        date: new Date().toISOString(),
        stressLevel: stressLevel,
        source: 'mood_log'
    });
    localStorage.setItem('stressData', JSON.stringify(stressData));
    
    closeModal('moodLogModal');
    showNotification('Mood logged successfully!', 'success');
    
    // Refresh dashboard if we're on it
    if (AppState.currentSection === 'dashboard') {
        loadDashboardData();
    }
}

// Utility Functions
function generateMockStressData(days) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            stressLevel: Math.floor(Math.random() * 8) + 2 // 2-10 range
        });
    }
    
    return data;
}

function generateMockCorrelationData() {
    const data = [];
    for (let i = 0; i < 20; i++) {
        data.push({
            x: Math.floor(Math.random() * 10) + 1,
            y: Math.floor(Math.random() * 5) + 1
        });
    }
    return data;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FFC107' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function loadUserData() {
    // Load user data from localStorage
    const stressData = JSON.parse(localStorage.getItem('stressData') || '[]');
    const gameScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    
    AppState.stressData = stressData;
    AppState.gameScores = gameScores;
    AppState.moodLogs = moodLogs;
    AppState.goals = goals;
    AppState.assessments = assessments;
}

// Game Variables
let gameStates = {
    breathing: {
        active: false,
        cycles: 0,
        startTime: null,
        interval: null
    },
    color: {
        active: false,
        score: 0,
        timeLeft: 30,
        interval: null
    },
    memory: {
        cards: [],
        flippedCards: [],
        matches: 0,
        moves: 0,
        startTime: null,
        interval: null
    },
    reaction: {
        times: [],
        waiting: false,
        startTime: null
    },
    meditation: {
        active: false,
        timeLeft: 300,
        interval: null
    },
    nature: {
        playing: false,
        currentCategory: 'rain',
        audio: null
    },
    focus: {
        active: false,
        focusTime: 0,
        bestTime: 0,
        interval: null,
        dotPosition: { x: 0, y: 0 }
    }
};

// Game Functions
function openGameModal(gameType) {
    const modal = document.getElementById(gameType + 'Modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeGameModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Breathing Exercise Game
function startBreathing() {
    const state = gameStates.breathing;
    const startBtn = document.getElementById('breathingStartBtn');
    const circle = document.getElementById('breathingCircle');
    const instruction = document.getElementById('breathingInstruction');
    const timer = document.getElementById('breathingTimer');
    
    if (!state.active) {
        state.active = true;
        state.startTime = Date.now();
        startBtn.textContent = 'Pause';
        
        state.interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            const cycleTime = elapsed % 8;
            
            if (cycleTime < 3) {
                circle.className = 'breathing-circle breathing-in';
                instruction.textContent = 'Breathe In';
                timer.textContent = 3 - cycleTime;
            } else if (cycleTime < 4) {
                circle.className = 'breathing-circle';
                instruction.textContent = 'Hold';
                timer.textContent = 4 - cycleTime;
            } else {
                circle.className = 'breathing-circle breathing-out';
                instruction.textContent = 'Breathe Out';
                timer.textContent = 8 - cycleTime;
            }
            
            if (cycleTime === 0 && elapsed > 0) {
                state.cycles++;
                document.getElementById('breathingCycles').textContent = state.cycles;
            }
            
            document.getElementById('breathingDuration').textContent = elapsed + 's';
        }, 1000);
    } else {
        pauseBreathing();
    }
}

function pauseBreathing() {
    const state = gameStates.breathing;
    clearInterval(state.interval);
    state.active = false;
    document.getElementById('breathingStartBtn').textContent = 'Resume';
}

function resetBreathing() {
    const state = gameStates.breathing;
    clearInterval(state.interval);
    state.active = false;
    state.cycles = 0;
    
    document.getElementById('breathingCircle').className = 'breathing-circle';
    document.getElementById('breathingInstruction').textContent = 'Get Ready';
    document.getElementById('breathingTimer').textContent = '0';
    document.getElementById('breathingStartBtn').textContent = 'Start';
    document.getElementById('breathingCycles').textContent = '0';
    document.getElementById('breathingDuration').textContent = '0s';
}

// Color Matching Game
function startColorGame() {
    const state = gameStates.color;
    if (state.active) return;
    
    state.active = true;
    state.score = 0;
    state.timeLeft = 30;
    
    document.getElementById('colorStartBtn').textContent = 'Playing...';
    document.getElementById('colorStartBtn').disabled = true;
    
    state.interval = setInterval(() => {
        state.timeLeft--;
        document.getElementById('colorTime').textContent = state.timeLeft;
        
        if (state.timeLeft <= 0) {
            endColorGame();
        }
    }, 1000);
    
    generateColorQuestion();
}

function generateColorQuestion() {
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'];
    const colorValues = {
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Yellow': '#FFFF00',
        'Purple': '#800080',
        'Orange': '#FFA500',
        'Pink': '#FFC0CB',
        'Brown': '#A52A2A'
    };
    
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    
    const colorDisplay = document.getElementById('colorDisplay');
    const colorText = document.getElementById('colorText');
    
    colorText.textContent = textColor;
    colorText.style.color = colorValues[displayColor];
    
    const options = [textColor];
    while (options.length < 4) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (!options.includes(randomColor)) {
            options.push(randomColor);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('colorOptions');
    optionsContainer.innerHTML = '';
    
    options.forEach(color => {
        const option = document.createElement('div');
        option.className = 'color-option';
        option.textContent = color;
        option.onclick = () => selectColorOption(color, textColor, option);
        optionsContainer.appendChild(option);
    });
}

function selectColorOption(selectedColor, correctColor, element) {
    if (!gameStates.color.active) return;
    
    const options = document.querySelectorAll('.color-option');
    options.forEach(opt => opt.onclick = null);
    
    if (selectedColor === correctColor) {
        element.classList.add('correct');
        gameStates.color.score += 10;
        document.getElementById('colorScore').textContent = gameStates.color.score;
        
        setTimeout(() => {
            if (gameStates.color.active) {
                generateColorQuestion();
            }
        }, 1000);
    } else {
        element.classList.add('incorrect');
        options.forEach(opt => {
            if (opt.textContent === correctColor) {
                opt.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            if (gameStates.color.active) {
                generateColorQuestion();
            }
        }, 2000);
    }
}

function endColorGame() {
    const state = gameStates.color;
    state.active = false;
    clearInterval(state.interval);
    
    document.getElementById('colorStartBtn').textContent = 'Start Game';
    document.getElementById('colorStartBtn').disabled = false;
    
    alert(`Color Game Complete!\nScore: ${state.score}\nTime: 30 seconds`);
}

function resetColorGame() {
    const state = gameStates.color;
    endColorGame();
    state.score = 0;
    state.timeLeft = 30;
    document.getElementById('colorScore').textContent = '0';
    document.getElementById('colorTime').textContent = '30';
    document.getElementById('colorDisplay').innerHTML = '<div class="color-text">Ready?</div>';
    document.getElementById('colorOptions').innerHTML = '';
}

// Memory Game
function startMemoryGame() {
    const state = gameStates.memory;
    if (state.cards.length > 0) return;
    
    state.moves = 0;
    state.matches = 0;
    state.flippedCards = [];
    
    const symbols = ['🎯', '🎨', '🎪', '🎭', '🎸', '🎹', '🎺', '🎻'];
    state.cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    state.cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
    
    state.startTime = Date.now();
    state.interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        document.getElementById('memoryTime').textContent = elapsed;
    }, 1000);
    
    updateMemoryStats();
}

function flipCard(card) {
    const state = gameStates.memory;
    if (state.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    state.flippedCards.push(card);
    
    if (state.flippedCards.length === 2) {
        state.moves++;
        updateMemoryStats();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const state = gameStates.memory;
    const [card1, card2] = state.flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        state.matches++;
        
        if (state.matches === 8) {
            endMemoryGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    state.flippedCards = [];
}

function updateMemoryStats() {
    const state = gameStates.memory;
    document.getElementById('memoryMoves').textContent = state.moves;
    document.getElementById('memoryMatches').textContent = state.matches;
}

function endMemoryGame() {
    const state = gameStates.memory;
    clearInterval(state.interval);
    const timeElapsed = Math.floor((Date.now() - state.startTime) / 1000);
    
    const score = Math.max(0, 1000 - (timeElapsed * 10) - (state.moves * 5));
    
    alert(`Memory Game Complete!\nTime: ${timeElapsed}s\nMoves: ${state.moves}\nScore: ${score}`);
}

function resetMemoryGame() {
    const state = gameStates.memory;
    clearInterval(state.interval);
    state.cards = [];
    state.flippedCards = [];
    state.matches = 0;
    state.moves = 0;
    
    document.getElementById('memoryGrid').innerHTML = '';
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryMatches').textContent = '0';
    document.getElementById('memoryTime').textContent = '0';
}

// Reaction Time Game
function startReactionTest() {
    const state = gameStates.reaction;
    if (state.waiting) return;
    
    state.waiting = true;
    const circle = document.getElementById('reactionCircle');
    const text = document.getElementById('reactionText');
    
    circle.className = 'reaction-circle waiting';
    text.textContent = 'Wait...';
    
    const delay = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
        if (state.waiting) {
            circle.className = 'reaction-circle ready';
            text.textContent = 'Click Now!';
            state.startTime = Date.now();
        }
    }, delay);
}

function reactToClick() {
    const state = gameStates.reaction;
    if (!state.waiting || !state.startTime) return;
    
    const reactionTime = Date.now() - state.startTime;
    state.times.push(reactionTime);
    
    const circle = document.getElementById('reactionCircle');
    const text = document.getElementById('reactionText');
    
    if (reactionTime < 100) {
        circle.className = 'reaction-circle too-early';
        text.textContent = 'Too Early!';
    } else {
        circle.className = 'reaction-circle';
        text.textContent = `${reactionTime}ms`;
    }
    
    state.waiting = false;
    state.startTime = null;
    
    updateReactionStats();
    
    setTimeout(() => {
        if (state.times.length < 5) {
            startReactionTest();
        } else {
            endReactionTest();
        }
    }, 2000);
}

function updateReactionStats() {
    const state = gameStates.reaction;
    document.getElementById('reactionAttempts').textContent = state.times.length;
    
    if (state.times.length > 0) {
        const average = Math.round(state.times.reduce((a, b) => a + b, 0) / state.times.length);
        document.getElementById('reactionAverage').textContent = average;
    }
}

function endReactionTest() {
    const state = gameStates.reaction;
    const average = Math.round(state.times.reduce((a, b) => a + b, 0) / state.times.length);
    
    alert(`Reaction Test Complete!\nAverage: ${average}ms\nAttempts: ${state.times.length}`);
}

function resetReactionTest() {
    const state = gameStates.reaction;
    state.times = [];
    state.waiting = false;
    state.startTime = null;
    
    document.getElementById('reactionCircle').className = 'reaction-circle';
    document.getElementById('reactionText').textContent = 'Wait...';
    document.getElementById('reactionAttempts').textContent = '0';
    document.getElementById('reactionAverage').textContent = '0';
}

// Meditation Timer
function startMeditation() {
    const state = gameStates.meditation;
    if (state.active) return;
    
    state.timeLeft = parseInt(document.getElementById('meditationDuration').value);
    state.active = true;
    
    document.getElementById('meditationStartBtn').textContent = 'Meditating...';
    document.getElementById('meditationStartBtn').disabled = true;
    
    state.interval = setInterval(() => {
        state.timeLeft--;
        updateMeditationDisplay();
        
        if (state.timeLeft <= 0) {
            endMeditation();
        }
    }, 1000);
    
    updateMeditationDisplay();
}

function pauseMeditation() {
    const state = gameStates.meditation;
    if (state.active) {
        clearInterval(state.interval);
        state.active = false;
        document.getElementById('meditationStartBtn').textContent = 'Resume';
        document.getElementById('meditationStartBtn').disabled = false;
    }
}

function resetMeditation() {
    const state = gameStates.meditation;
    clearInterval(state.interval);
    state.active = false;
    state.timeLeft = parseInt(document.getElementById('meditationDuration').value);
    
    document.getElementById('meditationStartBtn').textContent = 'Start Meditation';
    document.getElementById('meditationStartBtn').disabled = false;
    updateMeditationDisplay();
}

function updateMeditationDisplay() {
    const state = gameStates.meditation;
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('meditationTime').textContent = timeString;
    
    const guidance = document.getElementById('meditationGuidance');
    if (state.timeLeft > 0) {
        const guidanceTexts = [
            "Focus on your breathing. Inhale slowly through your nose, exhale through your mouth.",
            "Notice any thoughts that arise, but don't judge them. Let them pass like clouds.",
            "Feel your body relaxing with each breath. Release any tension you're holding.",
            "Bring your attention to the present moment. You are safe and at peace.",
            "Continue breathing deeply. Each breath brings you more calm and clarity."
        ];
        
        const guidanceIndex = Math.floor((300 - state.timeLeft) / 60) % guidanceTexts.length;
        guidance.textContent = guidanceTexts[guidanceIndex];
    }
}

function endMeditation() {
    const state = gameStates.meditation;
    clearInterval(state.interval);
    state.active = false;
    
    document.getElementById('meditationStartBtn').textContent = 'Start Meditation';
    document.getElementById('meditationStartBtn').disabled = false;
    
    const duration = parseInt(document.getElementById('meditationDuration').value);
    alert(`Meditation Complete!\nDuration: ${Math.floor(duration / 60)} minutes\nGreat job taking time for yourself!`);
}

// Nature Sounds
function switchSoundCategory(category) {
    const state = gameStates.nature;
    state.currentCategory = category;
    
    document.querySelectorAll('.sound-category').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchSoundCategory('${category}')"]`).classList.add('active');
}

function toggleSound() {
    const state = gameStates.nature;
    const playBtn = document.getElementById('playBtn');
    const icon = playBtn.querySelector('i');
    
    if (state.playing) {
        // Stop sound
        if (state.audio) {
            state.audio.pause();
            state.audio = null;
        }
        state.playing = false;
        icon.className = 'fas fa-play';
    } else {
        // Start sound (simulated)
        state.playing = true;
        icon.className = 'fas fa-pause';
        
        // Simulate audio playing
        state.audio = {
            pause: () => {
                state.playing = false;
                icon.className = 'fas fa-play';
            }
        };
    }
}

// Focus Training
function startFocusGame() {
    const state = gameStates.focus;
    if (state.active) return;
    
    state.active = true;
    state.focusTime = 0;
    
    document.getElementById('focusStartBtn').textContent = 'Focusing...';
    document.getElementById('focusStartBtn').disabled = true;
    
    state.interval = setInterval(() => {
        state.focusTime++;
        document.getElementById('focusTime').textContent = state.focusTime;
        
        if (state.focusTime > state.bestTime) {
            state.bestTime = state.focusTime;
            document.getElementById('focusBest').textContent = state.bestTime;
        }
        
        // Move dot randomly
        moveFocusDot();
    }, 1000);
    
    moveFocusDot();
}

function moveFocusDot() {
    const state = gameStates.focus;
    const dot = document.getElementById('focusDot');
    const circle = document.getElementById('focusCircle');
    
    const angle = Math.random() * 2 * Math.PI;
    const radius = 120; // Half of circle width minus dot size
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    dot.style.left = `calc(50% + ${x}px)`;
    dot.style.top = `calc(50% + ${y}px)`;
}

function resetFocusGame() {
    const state = gameStates.focus;
    clearInterval(state.interval);
    state.active = false;
    state.focusTime = 0;
    
    document.getElementById('focusStartBtn').textContent = 'Start Training';
    document.getElementById('focusStartBtn').disabled = false;
    document.getElementById('focusTime').textContent = '0';
    
    // Reset dot position
    const dot = document.getElementById('focusDot');
    dot.style.left = '50%';
    dot.style.top = '50%';
}

// Export functions for global access
window.showSection = showSection;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.toggleUserMenu = function() {
    document.getElementById('userDropdown').classList.toggle('active');
};
window.startQuickAssessment = startQuickAssessment;
window.startBreathingExercise = startBreathingExercise;
window.startMeditation = startMeditation;
window.logMood = logMood;
window.switchAssessmentTab = switchAssessmentTab;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.switchGameCategory = switchGameCategory;
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.startBreathing = startBreathing;
window.resetBreathing = resetBreathing;
window.switchTrackingTab = switchTrackingTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.openMoodLogModal = openMoodLogModal;
window.submitMoodLog = submitMoodLog;
window.startColorGame = startColorGame;
window.resetColorGame = resetColorGame;
window.startMemoryGame = startMemoryGame;
window.resetMemoryGame = resetMemoryGame;
window.startReactionTest = startReactionTest;
window.resetReactionTest = resetReactionTest;
window.reactToClick = reactToClick;
window.pauseMeditation = pauseMeditation;
window.resetMeditation = resetMeditation;
window.switchSoundCategory = switchSoundCategory;
window.toggleSound = toggleSound;
window.startFocusGame = startFocusGame;
window.resetFocusGame = resetFocusGame;
