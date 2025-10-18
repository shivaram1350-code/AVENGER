// CalmSphere VR Mobile App JavaScript

class CalmSphereApp {
    constructor() {
        this.currentScreen = 'loading';
        this.currentTab = 'dashboard';
        this.userData = this.loadUserData();
        this.breathingInterval = null;
        this.breathingPhase = 'in';
        this.breathingDuration = 4;
        this.isBreathing = false;
        this.currentEnvironment = 'forest';
        this.gyroSupported = false;
        this.camera = null;
        this.scene = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkGyroscopeSupport();
        this.startLoadingSequence();
    }

    setupEventListeners() {
        // Onboarding controls
        const nextSlideBtn = document.getElementById('next-slide');
        const prevSlideBtn = document.getElementById('prev-slide');
        
        if (nextSlideBtn) {
            nextSlideBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (prevSlideBtn) {
            prevSlideBtn.addEventListener('click', () => this.prevSlide());
        }

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Mood check-in
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mood = parseInt(e.currentTarget.dataset.mood);
                this.recordMood(mood);
            });
        });

        // Quick actions
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // VR controls
        const startVrBtn = document.getElementById('start-vr');
        const calibrateGyroBtn = document.getElementById('calibrate-gyro');
        const exitVrBtn = document.getElementById('exit-vr');

        if (startVrBtn) {
            startVrBtn.addEventListener('click', () => this.startVRExperience());
        }

        if (calibrateGyroBtn) {
            calibrateGyroBtn.addEventListener('click', () => this.calibrateGyroscope());
        }

        if (exitVrBtn) {
            exitVrBtn.addEventListener('click', () => this.exitVRExperience());
        }

        // Environment selection
        const envCards = document.querySelectorAll('.environment-card');
        envCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const environment = e.currentTarget.dataset.environment;
                this.selectEnvironment(environment);
            });
        });

        // Breathing controls
        const startBreathingBtn = document.getElementById('start-breathing');
        const pauseBreathingBtn = document.getElementById('pause-breathing');
        const stopBreathingBtn = document.getElementById('stop-breathing');
        const breathDurationSlider = document.getElementById('breath-duration');

        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', () => this.startBreathingExercise());
        }

        if (pauseBreathingBtn) {
            pauseBreathingBtn.addEventListener('click', () => this.pauseBreathingExercise());
        }

        if (stopBreathingBtn) {
            stopBreathingBtn.addEventListener('click', () => this.stopBreathingExercise());
        }

        if (breathDurationSlider) {
            breathDurationSlider.addEventListener('input', (e) => {
                this.breathingDuration = parseInt(e.target.value);
                document.getElementById('duration-value').textContent = this.breathingDuration;
            });
        }

        // Meditation sessions
        const sessionCards = document.querySelectorAll('.session-card');
        sessionCards.forEach(card => {
            const startBtn = card.querySelector('.btn');
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const session = card.dataset.session;
                this.startMeditationSession(session);
            });
        });

        // Journal
        const saveJournalBtn = document.getElementById('save-journal');
        const viewHistoryBtn = document.getElementById('view-history');

        if (saveJournalBtn) {
            saveJournalBtn.addEventListener('click', () => this.saveJournalEntry());
        }

        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', () => this.viewJournalHistory());
        }

        // Settings and Profile
        const settingsBtn = document.getElementById('settings-btn');
        const profileBtn = document.getElementById('profile-btn');
        const closeSettingsBtn = document.getElementById('close-settings');
        const closeProfileBtn = document.getElementById('close-profile');

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.openProfile());
        }

        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => this.closeModal('settings-modal'));
        }

        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => this.closeModal('profile-modal'));
        }

        // Device orientation for VR
        window.addEventListener('deviceorientation', (e) => {
            if (this.currentScreen === 'vr-experience' && this.gyroSupported) {
                this.handleGyroscopeInput(e);
            }
        });

        // Screen orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 500);
        });

        // Prevent default touch behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    startLoadingSequence() {
        setTimeout(() => {
            this.showScreen('onboarding-screen');
        }, 3000);
    }

    nextSlide() {
        const currentSlide = document.querySelector('.onboarding-slide.active');
        const nextSlide = currentSlide.nextElementSibling;
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (nextSlide) {
            currentSlide.classList.remove('active');
            nextSlide.classList.add('active');
            
            const slideIndex = parseInt(nextSlide.dataset.slide);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });

            prevBtn.disabled = false;
            if (slideIndex === indicators.length - 1) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Get Started';
                nextBtn.onclick = () => this.showScreen('main-app');
            }
        }
    }

    prevSlide() {
        const currentSlide = document.querySelector('.onboarding-slide.active');
        const prevSlide = currentSlide.previousElementSibling;
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (prevSlide) {
            currentSlide.classList.remove('active');
            prevSlide.classList.add('active');
            
            const slideIndex = parseInt(prevSlide.dataset.slide);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });

            if (slideIndex === 0) {
                prevBtn.disabled = true;
            }
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.onclick = () => this.nextSlide();
        }
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenId;
        }

        if (screenId === 'main-app') {
            this.updateProgressStats();
        }
    }

    switchTab(tabId) {
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });

        // Update content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });

        this.currentTab = tabId;
    }

    recordMood(mood) {
        // Update UI
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.classList.toggle('selected', parseInt(btn.dataset.mood) === mood);
        });

        // Save to user data
        const today = new Date().toDateString();
        this.userData.moodHistory = this.userData.moodHistory || {};
        this.userData.moodHistory[today] = mood;
        this.userData.lastMoodCheck = new Date().toISOString();

        this.saveUserData();
        this.updateProgressStats();
        this.showNotification('Mood recorded!', 'success');
    }

    handleQuickAction(action) {
        switch (action) {
            case 'breathing':
                this.switchTab('breathing');
                break;
            case 'meditation':
                this.switchTab('meditation');
                break;
            case 'vr-environment':
                this.switchTab('vr');
                break;
            case 'journal':
                this.switchTab('journal');
                break;
        }
    }

    checkGyroscopeSupport() {
        if (typeof DeviceOrientationEvent !== 'undefined') {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+ requires permission
                this.gyroSupported = true;
            } else {
                // Android and older iOS
                this.gyroSupported = true;
            }
        }
    }

    async calibrateGyroscope() {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.gyroSupported = true;
                    this.showNotification('Gyroscope calibrated!', 'success');
                } else {
                    this.showNotification('Gyroscope permission denied', 'error');
                }
            } catch (error) {
                this.showNotification('Failed to calibrate gyroscope', 'error');
            }
        } else {
            this.gyroSupported = true;
            this.showNotification('Gyroscope ready!', 'success');
        }
    }

    selectEnvironment(environment) {
        const envCards = document.querySelectorAll('.environment-card');
        envCards.forEach(card => {
            card.classList.toggle('active', card.dataset.environment === environment);
        });

        this.currentEnvironment = environment;
        this.showNotification(`Environment set to ${environment}`, 'success');
    }

    startVRExperience() {
        if (!this.gyroSupported) {
            this.showNotification('Please calibrate gyroscope first', 'warning');
            return;
        }

        this.showScreen('vr-experience');
        this.initializeVRScene();
    }

    initializeVRScene() {
        // Wait for A-Frame to load
        setTimeout(() => {
            this.scene = document.getElementById('vr-scene');
            this.camera = document.getElementById('vr-camera');
            
            if (this.scene && this.camera) {
                this.setupVREnvironment();
            }
        }, 1000);
    }

    setupVREnvironment() {
        // Create environment-specific skybox
        const sky = document.getElementById('vr-sky');
        if (sky) {
            const skyColors = {
                forest: '#228B22',
                beach: '#87CEEB',
                mountain: '#8B4513',
                space: '#000000'
            };
            
            sky.setAttribute('color', skyColors[this.currentEnvironment] || skyColors.forest);
        }

        // Add environment-specific elements
        this.addVRElements();
    }

    addVRElements() {
        // Add floating particles and calming elements based on environment
        const floatingElements = document.getElementById('floating-elements');
        if (floatingElements) {
            // Clear existing elements
            floatingElements.innerHTML = '';

            // Add environment-specific elements
            switch (this.currentEnvironment) {
                case 'forest':
                    this.addForestElements(floatingElements);
                    break;
                case 'beach':
                    this.addBeachElements(floatingElements);
                    break;
                case 'mountain':
                    this.addMountainElements(floatingElements);
                    break;
                case 'space':
                    this.addSpaceElements(floatingElements);
                    break;
            }
        }
    }

    addForestElements(container) {
        // Add floating leaves
        for (let i = 0; i < 5; i++) {
            const leaf = document.createElement('a-plane');
            leaf.setAttribute('position', `${Math.random() * 10 - 5} ${Math.random() * 5 + 2} ${Math.random() * 5 - 5}`);
            leaf.setAttribute('width', '0.1');
            leaf.setAttribute('height', '0.1');
            leaf.setAttribute('color', '#228B22');
            leaf.setAttribute('rotation', '0 0 45');
            leaf.setAttribute('animation', `property: rotation; to: 0 0 405; dur: 10000; loop: true`);
            container.appendChild(leaf);
        }
    }

    addBeachElements(container) {
        // Add floating waves
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('a-plane');
            wave.setAttribute('position', `${Math.random() * 10 - 5} 0 ${Math.random() * 5 - 5}`);
            wave.setAttribute('width', '2');
            wave.setAttribute('height', '0.1');
            wave.setAttribute('color', '#4169E1');
            wave.setAttribute('rotation', '0 0 0');
            wave.setAttribute('animation', `property: position; to: ${Math.random() * 10 - 5} 0 ${Math.random() * 5 - 5}; dur: 8000; loop: true; dir: alternate`);
            container.appendChild(wave);
        }
    }

    addMountainElements(container) {
        // Add floating clouds
        for (let i = 0; i < 4; i++) {
            const cloud = document.createElement('a-sphere');
            cloud.setAttribute('position', `${Math.random() * 10 - 5} ${Math.random() * 3 + 3} ${Math.random() * 5 - 5}`);
            cloud.setAttribute('radius', '0.3');
            cloud.setAttribute('color', '#FFFFFF');
            cloud.setAttribute('opacity', '0.8');
            cloud.setAttribute('animation', `property: position; to: ${Math.random() * 10 - 5} ${Math.random() * 3 + 3} ${Math.random() * 5 - 5}; dur: 12000; loop: true; dir: alternate`);
            container.appendChild(cloud);
        }
    }

    addSpaceElements(container) {
        // Add floating stars
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('a-sphere');
            star.setAttribute('position', `${Math.random() * 20 - 10} ${Math.random() * 20 - 10} ${Math.random() * 20 - 10}`);
            star.setAttribute('radius', '0.02');
            star.setAttribute('color', '#FFFFFF');
            star.setAttribute('animation', `property: rotation; to: 0 360 0; dur: ${Math.random() * 10000 + 5000}; loop: true`);
            container.appendChild(star);
        }
    }

    handleGyroscopeInput(event) {
        if (!this.camera) return;

        const alpha = event.alpha || 0;
        const beta = event.beta || 0;
        const gamma = event.gamma || 0;

        // Apply smoothing and convert to camera rotation
        const rotationX = beta;
        const rotationY = alpha;
        const rotationZ = gamma;

        this.camera.setAttribute('rotation', `${rotationX} ${rotationY} ${rotationZ}`);
    }

    exitVRExperience() {
        this.showScreen('main-app');
    }

    startBreathingExercise() {
        this.isBreathing = true;
        this.breathingPhase = 'in';
        
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breath-text');
        const startBtn = document.getElementById('start-breathing');
        const pauseBtn = document.getElementById('pause-breathing');
        const stopBtn = document.getElementById('stop-breathing');

        circle.classList.add('breathing');
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        stopBtn.classList.remove('hidden');

        this.breathingInterval = setInterval(() => {
            this.updateBreathingPhase();
        }, this.breathingDuration * 1000);

        this.updateBreathingPhase();
    }

    updateBreathingPhase() {
        const text = document.getElementById('breath-text');
        
        if (this.breathingPhase === 'in') {
            text.textContent = 'Breathe In';
            this.breathingPhase = 'hold';
        } else if (this.breathingPhase === 'hold') {
            text.textContent = 'Hold';
            this.breathingPhase = 'out';
        } else if (this.breathingPhase === 'out') {
            text.textContent = 'Breathe Out';
            this.breathingPhase = 'in';
        }
    }

    pauseBreathingExercise() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }

        const pauseBtn = document.getElementById('pause-breathing');
        const resumeBtn = document.createElement('button');
        resumeBtn.className = 'btn btn-primary';
        resumeBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        resumeBtn.onclick = () => this.resumeBreathingExercise();

        pauseBtn.replaceWith(resumeBtn);
    }

    resumeBreathingExercise() {
        this.startBreathingExercise();
    }

    stopBreathingExercise() {
        this.isBreathing = false;
        
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }

        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breath-text');
        const startBtn = document.getElementById('start-breathing');
        const pauseBtn = document.getElementById('pause-breathing');
        const stopBtn = document.getElementById('stop-breathing');

        circle.classList.remove('breathing');
        text.textContent = 'Breathe In';
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        stopBtn.classList.add('hidden');

        // Record session
        this.recordSession('breathing');
        this.showNotification('Breathing exercise completed!', 'success');
    }

    startMeditationSession(sessionType) {
        const sessionData = {
            'anxiety-relief': { duration: 5, title: 'Anxiety Relief' },
            'stress-management': { duration: 10, title: 'Stress Management' },
            'sleep-preparation': { duration: 15, title: 'Sleep Preparation' }
        };

        const session = sessionData[sessionType];
        if (session) {
            this.showNotification(`Starting ${session.title} meditation...`, 'success');
            this.startMeditationTimer(session.duration, session.title);
        }
    }

    startMeditationTimer(duration, title) {
        let timeLeft = duration * 60; // Convert to seconds
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            // Update UI with timer
            this.showNotification(`${title}: ${minutes}:${seconds.toString().padStart(2, '0')}`, 'info');
            
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timer);
                this.showNotification(`${title} completed!`, 'success');
                this.recordSession('meditation');
            }
        }, 1000);
    }

    saveJournalEntry() {
        const journalText = document.getElementById('journal-text').value;
        
        if (!journalText.trim()) {
            this.showNotification('Please write something in your journal', 'warning');
            return;
        }

        const entry = {
            date: new Date().toISOString(),
            text: journalText,
            mood: this.userData.lastMoodCheck ? this.userData.moodHistory[new Date().toDateString()] : null
        };

        this.userData.journalEntries = this.userData.journalEntries || [];
        this.userData.journalEntries.push(entry);
        
        this.saveUserData();
        this.showNotification('Journal entry saved!', 'success');
        
        // Clear textarea
        document.getElementById('journal-text').value = '';
    }

    viewJournalHistory() {
        const entries = this.userData.journalEntries || [];
        
        if (entries.length === 0) {
            this.showNotification('No journal entries yet', 'info');
            return;
        }

        // Create a simple history view
        const historyText = entries.map(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            return `${date}: ${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}`;
        }).join('\n\n');

        alert(`Journal History:\n\n${historyText}`);
    }

    recordSession(type) {
        const session = {
            type: type,
            date: new Date().toISOString(),
            duration: type === 'breathing' ? this.breathingDuration * 4 : 5 // Estimate
        };

        this.userData.sessions = this.userData.sessions || [];
        this.userData.sessions.push(session);
        
        this.saveUserData();
        this.updateProgressStats();
    }

    updateProgressStats() {
        const sessions = this.userData.sessions || [];
        const moodHistory = this.userData.moodHistory || {};
        
        // Update session count
        const sessionsElement = document.getElementById('sessions-completed');
        if (sessionsElement) {
            sessionsElement.textContent = sessions.length;
        }

        // Update streak
        const streakElement = document.getElementById('streak-days');
        if (streakElement) {
            const streak = this.calculateStreak();
            streakElement.textContent = streak;
        }

        // Update average mood
        const avgMoodElement = document.getElementById('avg-mood');
        if (avgMoodElement) {
            const avgMood = this.calculateAverageMood();
            avgMoodElement.textContent = avgMood;
        }

        // Update profile stats
        const totalSessionsElement = document.getElementById('total-sessions');
        const currentStreakElement = document.getElementById('current-streak');
        
        if (totalSessionsElement) {
            totalSessionsElement.textContent = sessions.length;
        }
        
        if (currentStreakElement) {
            currentStreakElement.textContent = `${this.calculateStreak()} days`;
        }
    }

    calculateStreak() {
        const sessions = this.userData.sessions || [];
        if (sessions.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateString = checkDate.toDateString();
            
            const hasSession = sessions.some(session => {
                const sessionDate = new Date(session.date).toDateString();
                return sessionDate === dateString;
            });
            
            if (hasSession) {
                streak++;
            } else if (i > 0) { // Don't break streak on first day
                break;
            }
        }
        
        return streak;
    }

    calculateAverageMood() {
        const moodHistory = this.userData.moodHistory || {};
        const moods = Object.values(moodHistory);
        
        if (moods.length === 0) return '-';
        
        const average = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        return average.toFixed(1);
    }

    openSettings() {
        this.openModal('settings-modal');
    }

    openProfile() {
        this.updateProgressStats();
        this.openModal('profile-modal');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleOrientationChange() {
        // Handle screen orientation changes
        if (this.currentScreen === 'vr-experience' && this.camera) {
            this.camera.setAttribute('rotation', '0 0 0');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800',
            info: '#2196F3'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 90%;
            animation: slideDown 0.3s ease-out;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    loadUserData() {
        try {
            const data = localStorage.getItem('calmsphere-user-data');
            return data ? JSON.parse(data) : {
                moodHistory: {},
                journalEntries: [],
                sessions: [],
                settings: {
                    notifications: true,
                    dailyReminders: true,
                    gyroSensitivity: 0.5,
                    theme: 'light'
                }
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            return {
                moodHistory: {},
                journalEntries: [],
                sessions: [],
                settings: {
                    notifications: true,
                    dailyReminders: true,
                    gyroSensitivity: 0.5,
                    theme: 'light'
                }
            };
        }
    }

    saveUserData() {
        try {
            localStorage.setItem('calmsphere-user-data', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calmSphereApp = new CalmSphereApp();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle app installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or notification
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install CalmSphere VR';
    installBtn.className = 'btn btn-primary';
    installBtn.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); z-index: 1000;';
    
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            });
        }
    });
    
    document.body.appendChild(installBtn);
});

// Handle app installed
window.addEventListener('appinstalled', (evt) => {
    console.log('CalmSphere VR was installed');
    // Remove install button
    const installBtn = document.querySelector('button[style*="position: fixed"]');
    if (installBtn) {
        installBtn.remove();
    }
});
