// Global variables
let currentSection = 'home';
let quizData = [];
let currentQuestionIndex = 0;
let quizAnswers = [];
let stressScore = 0;
let gameScores = {};

// Quiz questions data
const stressQuizQuestions = [
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
    {
        question: "How well do you sleep at night?",
        options: [
            { text: "Very well, 8+ hours", value: 0 },
            { text: "Well, 7-8 hours", value: 1 },
            { text: "Okay, 6-7 hours", value: 2 },
            { text: "Poorly, 5-6 hours", value: 3 },
            { text: "Very poorly, less than 5 hours", value: 4 }
        ]
    },
    {
        question: "How often do you experience physical symptoms of stress (headaches, muscle tension, etc.)?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How do you handle unexpected changes or problems?",
        options: [
            { text: "Very calmly and adapt easily", value: 0 },
            { text: "Generally calm with minor stress", value: 1 },
            { text: "Somewhat stressed but manageable", value: 2 },
            { text: "Quite stressed and difficult to handle", value: 3 },
            { text: "Very stressed and overwhelming", value: 4 }
        ]
    },
    {
        question: "How often do you feel anxious or worried?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How is your appetite affected by stress?",
        options: [
            { text: "No change, eat normally", value: 0 },
            { text: "Slight changes occasionally", value: 1 },
            { text: "Noticeable changes sometimes", value: 2 },
            { text: "Frequent changes in eating patterns", value: 3 },
            { text: "Severe changes, either overeating or undereating", value: 4 }
        ]
    },
    {
        question: "How often do you feel irritable or easily angered?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How well can you concentrate on tasks?",
        options: [
            { text: "Very well, no problems", value: 0 },
            { text: "Well, minor distractions", value: 1 },
            { text: "Okay, some difficulty", value: 2 },
            { text: "Poorly, frequent distractions", value: 3 },
            { text: "Very poorly, can't focus", value: 4 }
        ]
    },
    {
        question: "How often do you use relaxation techniques (meditation, deep breathing, etc.)?",
        options: [
            { text: "Daily", value: 0 },
            { text: "Several times a week", value: 1 },
            { text: "Weekly", value: 2 },
            { text: "Monthly", value: 3 },
            { text: "Never", value: 4 }
        ]
    },
    {
        question: "How satisfied are you with your work-life balance?",
        options: [
            { text: "Very satisfied", value: 0 },
            { text: "Satisfied", value: 1 },
            { text: "Neutral", value: 2 },
            { text: "Dissatisfied", value: 3 },
            { text: "Very dissatisfied", value: 4 }
        ]
    },
    {
        question: "How often do you feel like you have control over your life?",
        options: [
            { text: "Always", value: 0 },
            { text: "Most of the time", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Rarely", value: 3 },
            { text: "Never", value: 4 }
        ]
    },
    {
        question: "How do you feel about your social relationships?",
        options: [
            { text: "Very positive and supportive", value: 0 },
            { text: "Generally positive", value: 1 },
            { text: "Mixed, some good some bad", value: 2 },
            { text: "Generally negative", value: 3 },
            { text: "Very negative and unsupportive", value: 4 }
        ]
    },
    {
        question: "How often do you feel physically exhausted?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How do you react to criticism or negative feedback?",
        options: [
            { text: "Take it constructively and learn", value: 0 },
            { text: "Generally handle it well", value: 1 },
            { text: "Sometimes take it personally", value: 2 },
            { text: "Often feel hurt or defensive", value: 3 },
            { text: "Always feel devastated", value: 4 }
        ]
    },
    {
        question: "How often do you worry about things that are out of your control?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How is your mood most of the time?",
        options: [
            { text: "Very positive and happy", value: 0 },
            { text: "Generally positive", value: 1 },
            { text: "Neutral", value: 2 },
            { text: "Generally negative", value: 3 },
            { text: "Very negative and depressed", value: 4 }
        ]
    },
    {
        question: "How often do you feel like you need a break or vacation?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How do you handle deadlines and time pressure?",
        options: [
            { text: "Very well, stay calm and organized", value: 0 },
            { text: "Well, with minor stress", value: 1 },
            { text: "Okay, but feel some pressure", value: 2 },
            { text: "Poorly, feel very stressed", value: 3 },
            { text: "Very poorly, feel overwhelmed", value: 4 }
        ]
    },
    {
        question: "How often do you feel like you're not good enough?",
        options: [
            { text: "Never", value: 0 },
            { text: "Rarely", value: 1 },
            { text: "Sometimes", value: 2 },
            { text: "Often", value: 3 },
            { text: "Always", value: 4 }
        ]
    },
    {
        question: "How would you rate your overall stress level right now?",
        options: [
            { text: "Very low (0-2)", value: 0 },
            { text: "Low (3-4)", value: 1 },
            { text: "Moderate (5-6)", value: 2 },
            { text: "High (7-8)", value: 3 },
            { text: "Very high (9-10)", value: 4 }
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadQuizData();
});

function initializeApp() {
    // Set initial section
    showSection('home');
    
    // Initialize stress meter animation
    animateStressMeter(0);
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionName).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific content
    if (sectionName === 'quiz') {
        loadQuizQuestion();
    } else if (sectionName === 'results') {
        loadResults();
    }
}

function loadQuizData() {
    quizData = [...stressQuizQuestions];
}

function loadQuizQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        calculateStressScore();
        showSection('results');
        return;
    }
    
    const question = quizData[currentQuestionIndex];
    const questionCard = document.getElementById('questionCard');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizData.length;
    
    // Clear and populate options
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
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = !quizAnswers[currentQuestionIndex];
}

function selectOption(value, element) {
    // Remove selection from other options
    element.parentNode.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
    });
    
    // Select current option
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    
    // Store answer
    quizAnswers[currentQuestionIndex] = parseInt(value);
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (quizAnswers[currentQuestionIndex] !== undefined) {
        currentQuestionIndex++;
        loadQuizQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuizQuestion();
    }
}

function calculateStressScore() {
    stressScore = quizAnswers.reduce((sum, answer) => sum + (answer || 0), 0);
    const maxScore = quizData.length * 4;
    const percentage = (stressScore / maxScore) * 100;
    
    // Update stress meter
    animateStressMeter(percentage);
    
    // Store in localStorage for persistence
    localStorage.setItem('stressScore', stressScore);
    localStorage.setItem('stressPercentage', percentage);
    localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers));
}

function animateStressMeter(percentage) {
    const meterFill = document.getElementById('homeMeter');
    const meterValue = document.querySelector('.meter-value');
    
    if (meterFill && meterValue) {
        const degrees = (percentage / 100) * 360;
        meterFill.style.background = `conic-gradient(from 0deg, #4CAF50 0deg, #FFC107 120deg, #FF5722 240deg, #F44336 ${degrees}deg, transparent ${degrees}deg)`;
        meterValue.textContent = Math.round(percentage);
    }
}

function loadResults() {
    const resultsContent = document.getElementById('resultsContent');
    const storedScore = localStorage.getItem('stressScore');
    const storedPercentage = localStorage.getItem('stressPercentage');
    
    if (!storedScore) {
        resultsContent.innerHTML = `
            <div class="no-results">
                <i class="fas fa-clipboard-check"></i>
                <h3>Complete the Assessment</h3>
                <p>Please complete the quiz and games to see your personalized stress level results and recommendations.</p>
                <button class="cta-button" onclick="showSection('quiz')">
                    <i class="fas fa-play"></i>
                    Start Assessment
                </button>
            </div>
        `;
        return;
    }
    
    const score = parseInt(storedScore);
    const percentage = parseFloat(storedPercentage);
    
    let stressLevel, recommendations, color;
    
    if (percentage <= 20) {
        stressLevel = "Very Low";
        recommendations = [
            "Maintain your current healthy lifestyle",
            "Continue practicing stress management techniques",
            "Help others who might be struggling with stress",
            "Consider mentoring or teaching stress management"
        ];
        color = "#4CAF50";
    } else if (percentage <= 40) {
        stressLevel = "Low";
        recommendations = [
            "Keep up your good stress management practices",
            "Consider adding meditation or yoga to your routine",
            "Maintain regular exercise and healthy eating",
            "Stay connected with supportive friends and family"
        ];
        color = "#8BC34A";
    } else if (percentage <= 60) {
        stressLevel = "Moderate";
        recommendations = [
            "Practice daily relaxation techniques",
            "Consider time management strategies",
            "Ensure you're getting adequate sleep (7-9 hours)",
            "Take regular breaks during work",
            "Consider talking to a counselor or therapist"
        ];
        color = "#FFC107";
    } else if (percentage <= 80) {
        stressLevel = "High";
        recommendations = [
            "Prioritize self-care and stress reduction",
            "Consider professional help or counseling",
            "Practice deep breathing exercises daily",
            "Reduce caffeine and alcohol intake",
            "Create a structured daily routine",
            "Consider taking time off work if possible"
        ];
        color = "#FF5722";
    } else {
        stressLevel = "Very High";
        recommendations = [
            "Seek professional help immediately",
            "Consider medical consultation for stress management",
            "Take immediate steps to reduce stressors",
            "Practice emergency stress relief techniques",
            "Consider taking a break from major responsibilities",
            "Reach out to support networks"
        ];
        color = "#F44336";
    }
    
    resultsContent.innerHTML = `
        <div class="results-summary">
            <div class="stress-level-display" style="border-left: 5px solid ${color}">
                <h3>Your Stress Level: ${stressLevel}</h3>
                <div class="score-display">
                    <span class="score-number" style="color: ${color}">${Math.round(percentage)}%</span>
                    <span class="score-label">Stress Level</span>
                </div>
            </div>
            
            <div class="recommendations">
                <h4>Personalized Recommendations:</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="action-buttons">
                <button class="cta-button" onclick="showSection('games')">
                    <i class="fas fa-gamepad"></i>
                    Try Stress Games
                </button>
                <button class="cta-button secondary" onclick="retakeQuiz()">
                    <i class="fas fa-redo"></i>
                    Retake Quiz
                </button>
            </div>
        </div>
    `;
}

function retakeQuiz() {
    currentQuestionIndex = 0;
    quizAnswers = [];
    stressScore = 0;
    localStorage.removeItem('stressScore');
    localStorage.removeItem('stressPercentage');
    localStorage.removeItem('quizAnswers');
    showSection('quiz');
}

// Game Functions
function startBreathingGame() {
    showModal('breathingModal');
}

function startColorGame() {
    showModal('colorModal');
}

function startMemoryGame() {
    showModal('memoryModal');
}

function startReactionGame() {
    showModal('reactionModal');
}

function startMeditationTimer() {
    showModal('meditationModal');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Breathing Exercise Game
let breathingInterval;
let breathingCycles = 0;
let breathingStartTime;
let breathingPhase = 'ready'; // ready, inhale, hold, exhale

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
            const cycleTime = elapsed % 8; // 8-second cycle: 3 inhale, 1 hold, 4 exhale
            
            if (cycleTime < 3) {
                // Inhale phase
                breathingPhase = 'inhale';
                circle.className = 'breathing-circle breathing-in';
                instruction.textContent = 'Breathe In';
                timer.textContent = 3 - cycleTime;
            } else if (cycleTime < 4) {
                // Hold phase
                breathingPhase = 'hold';
                circle.className = 'breathing-circle';
                instruction.textContent = 'Hold';
                timer.textContent = 4 - cycleTime;
            } else {
                // Exhale phase
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

// Color Matching Game
let colorGameActive = false;
let colorScore = 0;
let colorTimeLeft = 30;
let colorInterval;

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

function startColorGame() {
    if (colorGameActive) return;
    
    colorGameActive = true;
    colorScore = 0;
    colorTimeLeft = 30;
    
    document.getElementById('colorStartBtn').textContent = 'Playing...';
    document.getElementById('colorStartBtn').disabled = true;
    
    colorInterval = setInterval(() => {
        colorTimeLeft--;
        document.getElementById('colorTime').textContent = colorTimeLeft;
        
        if (colorTimeLeft <= 0) {
            endColorGame();
        }
    }, 1000);
    
    generateColorQuestion();
}

function generateColorQuestion() {
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    
    const colorDisplay = document.getElementById('colorDisplay');
    const colorText = document.getElementById('colorText');
    
    colorText.textContent = textColor;
    colorText.style.color = colorValues[displayColor];
    
    // Generate options
    const options = [textColor];
    while (options.length < 4) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (!options.includes(randomColor)) {
            options.push(randomColor);
        }
    }
    
    // Shuffle options
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
    if (!colorGameActive) return;
    
    const options = document.querySelectorAll('.color-option');
    options.forEach(opt => opt.onclick = null);
    
    if (selectedColor === correctColor) {
        element.classList.add('correct');
        colorScore += 10;
        document.getElementById('colorScore').textContent = colorScore;
        
        setTimeout(() => {
            if (colorGameActive) {
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
            if (colorGameActive) {
                generateColorQuestion();
            }
        }, 2000);
    }
}

function endColorGame() {
    colorGameActive = false;
    clearInterval(colorInterval);
    
    document.getElementById('colorStartBtn').textContent = 'Start Game';
    document.getElementById('colorStartBtn').disabled = false;
    
    // Store score
    gameScores.colorGame = colorScore;
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    alert(`Color Game Complete!\nScore: ${colorScore}\nTime: 30 seconds`);
}

function resetColorGame() {
    endColorGame();
    colorScore = 0;
    colorTimeLeft = 30;
    document.getElementById('colorScore').textContent = '0';
    document.getElementById('colorTime').textContent = '30';
    document.getElementById('colorDisplay').innerHTML = '<div class="color-text">Ready?</div>';
    document.getElementById('colorOptions').innerHTML = '';
}

// Memory Game
let memoryCards = [];
let memoryFlippedCards = [];
let memoryMatches = 0;
let memoryMoves = 0;
let memoryStartTime;
let memoryInterval;

const memorySymbols = ['🎯', '🎨', '🎪', '🎭', '🎸', '🎹', '🎺', '🎻'];

function startMemoryGame() {
    if (memoryCards.length > 0) return;
    
    memoryMoves = 0;
    memoryMatches = 0;
    memoryFlippedCards = [];
    
    // Create pairs
    const symbols = [...memorySymbols];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
    
    memoryStartTime = Date.now();
    memoryInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
        document.getElementById('memoryTime').textContent = elapsed;
    }, 1000);
    
    updateMemoryStats();
}

function flipCard(card) {
    if (memoryFlippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    memoryFlippedCards.push(card);
    
    if (memoryFlippedCards.length === 2) {
        memoryMoves++;
        updateMemoryStats();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = memoryFlippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryMatches++;
        
        if (memoryMatches === 8) {
            endMemoryGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    memoryFlippedCards = [];
}

function updateMemoryStats() {
    document.getElementById('memoryMoves').textContent = memoryMoves;
    document.getElementById('memoryMatches').textContent = memoryMatches;
}

function endMemoryGame() {
    clearInterval(memoryInterval);
    const timeElapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
    
    // Calculate score based on time and moves
    const score = Math.max(0, 1000 - (timeElapsed * 10) - (memoryMoves * 5));
    gameScores.memoryGame = score;
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    alert(`Memory Game Complete!\nTime: ${timeElapsed}s\nMoves: ${memoryMoves}\nScore: ${score}`);
}

function resetMemoryGame() {
    clearInterval(memoryInterval);
    memoryCards = [];
    memoryFlippedCards = [];
    memoryMatches = 0;
    memoryMoves = 0;
    
    document.getElementById('memoryGrid').innerHTML = '';
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryMatches').textContent = '0';
    document.getElementById('memoryTime').textContent = '0';
}

// Reaction Time Game
let reactionTimes = [];
let reactionStartTime;
let reactionWaiting = false;
let reactionInterval;

function startReactionTest() {
    if (reactionWaiting) return;
    
    reactionWaiting = true;
    const circle = document.getElementById('reactionCircle');
    const text = document.getElementById('reactionText');
    
    circle.className = 'reaction-circle waiting';
    text.textContent = 'Wait...';
    
    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
        if (reactionWaiting) {
            circle.className = 'reaction-circle ready';
            text.textContent = 'Click Now!';
            reactionStartTime = Date.now();
        }
    }, delay);
}

function reactToClick() {
    if (!reactionWaiting || !reactionStartTime) return;
    
    const reactionTime = Date.now() - reactionStartTime;
    reactionTimes.push(reactionTime);
    
    const circle = document.getElementById('reactionCircle');
    const text = document.getElementById('reactionText');
    
    if (reactionTime < 100) {
        circle.className = 'reaction-circle too-early';
        text.textContent = 'Too Early!';
    } else {
        circle.className = 'reaction-circle';
        text.textContent = `${reactionTime}ms`;
    }
    
    reactionWaiting = false;
    reactionStartTime = null;
    
    updateReactionStats();
    
    setTimeout(() => {
        if (reactionTimes.length < 5) {
            startReactionTest();
        } else {
            endReactionTest();
        }
    }, 2000);
}

function updateReactionStats() {
    document.getElementById('reactionAttempts').textContent = reactionTimes.length;
    
    if (reactionTimes.length > 0) {
        const average = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
        document.getElementById('reactionAverage').textContent = average;
    }
}

function endReactionTest() {
    const average = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    gameScores.reactionGame = average;
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    alert(`Reaction Test Complete!\nAverage: ${average}ms\nAttempts: ${reactionTimes.length}`);
}

function resetReactionTest() {
    reactionTimes = [];
    reactionWaiting = false;
    reactionStartTime = null;
    
    document.getElementById('reactionCircle').className = 'reaction-circle';
    document.getElementById('reactionText').textContent = 'Wait...';
    document.getElementById('reactionAttempts').textContent = '0';
    document.getElementById('reactionAverage').textContent = '0';
}

// Meditation Timer
let meditationInterval;
let meditationTimeLeft = 300; // 5 minutes default
let meditationActive = false;

function startMeditation() {
    if (meditationActive) return;
    
    meditationTimeLeft = parseInt(document.getElementById('meditationDuration').value);
    meditationActive = true;
    
    document.getElementById('meditationStartBtn').textContent = 'Meditating...';
    document.getElementById('meditationStartBtn').disabled = true;
    
    meditationInterval = setInterval(() => {
        meditationTimeLeft--;
        updateMeditationDisplay();
        
        if (meditationTimeLeft <= 0) {
            endMeditation();
        }
    }, 1000);
    
    updateMeditationDisplay();
}

function pauseMeditation() {
    if (meditationActive) {
        clearInterval(meditationInterval);
        meditationActive = false;
        document.getElementById('meditationStartBtn').textContent = 'Resume';
        document.getElementById('meditationStartBtn').disabled = false;
    }
}

function resetMeditation() {
    clearInterval(meditationInterval);
    meditationActive = false;
    meditationTimeLeft = parseInt(document.getElementById('meditationDuration').value);
    
    document.getElementById('meditationStartBtn').textContent = 'Start Meditation';
    document.getElementById('meditationStartBtn').disabled = false;
    updateMeditationDisplay();
}

function updateMeditationDisplay() {
    const minutes = Math.floor(meditationTimeLeft / 60);
    const seconds = meditationTimeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('meditationTime').textContent = timeString;
    
    // Update guidance text
    const guidance = document.getElementById('meditationGuidance');
    if (meditationTimeLeft > 0) {
        const guidanceTexts = [
            "Focus on your breathing. Inhale slowly through your nose, exhale through your mouth.",
            "Notice any thoughts that arise, but don't judge them. Let them pass like clouds.",
            "Feel your body relaxing with each breath. Release any tension you're holding.",
            "Bring your attention to the present moment. You are safe and at peace.",
            "Continue breathing deeply. Each breath brings you more calm and clarity."
        ];
        
        const guidanceIndex = Math.floor((300 - meditationTimeLeft) / 60) % guidanceTexts.length;
        guidance.textContent = guidanceTexts[guidanceIndex];
    }
}

function endMeditation() {
    clearInterval(meditationInterval);
    meditationActive = false;
    
    document.getElementById('meditationStartBtn').textContent = 'Start Meditation';
    document.getElementById('meditationStartBtn').disabled = false;
    
    const duration = parseInt(document.getElementById('meditationDuration').value);
    gameScores.meditationGame = duration;
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    alert(`Meditation Complete!\nDuration: ${Math.floor(duration / 60)} minutes\nGreat job taking time for yourself!`);
}

// Load game scores from localStorage
function loadGameScores() {
    const stored = localStorage.getItem('gameScores');
    if (stored) {
        gameScores = JSON.parse(stored);
    }
}

// Initialize game scores
loadGameScores();
