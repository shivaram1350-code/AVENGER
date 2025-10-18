// Mobile VR Relaxation Experience - JavaScript Controller
class MobileVRController {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.isGyroSupported = false;
        this.isPermissionGranted = false;
        this.isExperienceStarted = false;
        this.orientationData = { alpha: 0, beta: 0, gamma: 0 };
        this.cameraRotation = { x: 0, y: 0, z: 0 };
        this.smoothingFactor = 0.1;
        this.breathPhase = 0;
        this.breathDirection = 1;
        
        this.init();
    }

    init() {
        // Wait for A-Frame to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.checkGyroscopeSupport();
            this.setupBreathingAnimation();
        });
    }

    setupEventListeners() {
        // Start button event
        const startBtn = document.getElementById('start-btn');
        const fallbackBtn = document.getElementById('fallback-btn');
        const resetViewBtn = document.getElementById('reset-view');
        const toggleSoundBtn = document.getElementById('toggle-sound');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.requestMotionPermission());
        }

        if (fallbackBtn) {
            fallbackBtn.addEventListener('click', () => this.startFallbackExperience());
        }

        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => this.resetCameraView());
        }

        if (toggleSoundBtn) {
            toggleSoundBtn.addEventListener('click', () => this.toggleSound());
        }

        // Device orientation event
        window.addEventListener('deviceorientation', (event) => {
            if (this.isExperienceStarted && this.isGyroSupported) {
                this.handleOrientationChange(event);
            }
        });

        // Screen orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resetCameraView(), 500);
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

    checkGyroscopeSupport() {
        // Check if device orientation is supported
        if (typeof DeviceOrientationEvent !== 'undefined') {
            // Check if we can request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.isGyroSupported = true;
                this.showPermissionScreen();
            } else {
                // For Android and older iOS
                this.isGyroSupported = true;
                this.startExperience();
            }
        } else {
            this.showNoGyroScreen();
        }
    }

    showPermissionScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const permissionScreen = document.getElementById('permission-screen');
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            permissionScreen.classList.remove('hidden');
            permissionScreen.classList.add('fade-in');
        }, 2000);
    }

    showNoGyroScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const noGyroScreen = document.getElementById('no-gyro-screen');
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            noGyroScreen.classList.remove('hidden');
            noGyroScreen.classList.add('fade-in');
        }, 2000);
    }

    async requestMotionPermission() {
        try {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.isPermissionGranted = true;
                    this.startExperience();
                } else {
                    this.showPermissionDeniedMessage();
                }
            }
        } catch (error) {
            console.error('Error requesting motion permission:', error);
            this.startFallbackExperience();
        }
    }

    showPermissionDeniedMessage() {
        const permissionScreen = document.getElementById('permission-screen');
        const startBtn = document.getElementById('start-btn');
        
        startBtn.textContent = 'Permission Denied - Try Fallback Mode';
        startBtn.onclick = () => this.startFallbackExperience();
        
        const note = document.createElement('p');
        note.textContent = 'You can still enjoy the experience with touch controls.';
        note.style.marginTop = '10px';
        note.style.fontSize = '14px';
        note.style.opacity = '0.8';
        permissionScreen.querySelector('.permission-content').appendChild(note);
    }

    startExperience() {
        this.hideAllScreens();
        this.initializeAFrame();
        this.isExperienceStarted = true;
        this.startBreathingAnimation();
    }

    startFallbackExperience() {
        this.hideAllScreens();
        this.initializeAFrame();
        this.isExperienceStarted = true;
        this.enableTouchControls();
        this.startBreathingAnimation();
    }

    hideAllScreens() {
        const screens = ['loading-screen', 'permission-screen', 'no-gyro-screen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }

    initializeAFrame() {
        const scene = document.getElementById('vr-scene');
        if (scene) {
            scene.classList.remove('hidden');
            this.scene = scene;
            
            // Wait for A-Frame to initialize
            scene.addEventListener('loaded', () => {
                this.camera = document.getElementById('main-camera');
                this.setupSkybox();
                this.showUIOverlay();
            });
        }
    }

    setupSkybox() {
        // Create a simple gradient skybox since we can't load external textures easily
        const sky = document.getElementById('sky');
        if (sky) {
            // Create a canvas for gradient sky
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(0.5, '#E0F6FF'); // Light blue
            gradient.addColorStop(1, '#F0F8FF'); // Alice blue
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add some cloud-like shapes
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height * 0.6;
                const size = Math.random() * 100 + 50;
                this.drawCloud(ctx, x, y, size);
            }
            
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL();
            sky.setAttribute('src', dataURL);
        }
    }

    drawCloud(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x + size * 0.6, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    handleOrientationChange(event) {
        if (!this.camera) return;

        // Get orientation data
        const alpha = event.alpha || 0; // Z-axis rotation (compass)
        const beta = event.beta || 0;   // X-axis rotation (front-to-back)
        const gamma = event.gamma || 0; // Y-axis rotation (left-to-right)

        // Apply smoothing to reduce jitter
        this.orientationData.alpha = this.lerp(this.orientationData.alpha, alpha, this.smoothingFactor);
        this.orientationData.beta = this.lerp(this.orientationData.beta, beta, this.smoothingFactor);
        this.orientationData.gamma = this.lerp(this.orientationData.gamma, gamma, this.smoothingFactor);

        // Convert to camera rotation
        // Note: A-Frame uses different coordinate system
        this.cameraRotation.x = this.orientationData.beta;
        this.cameraRotation.y = this.orientationData.alpha;
        this.cameraRotation.z = this.orientationData.gamma;

        // Apply rotation to camera
        this.camera.setAttribute('rotation', 
            `${this.cameraRotation.x} ${this.cameraRotation.y} ${this.cameraRotation.z}`
        );
    }

    enableTouchControls() {
        let isDragging = false;
        let lastTouchX = 0;
        let lastTouchY = 0;
        let touchRotationX = 0;
        let touchRotationY = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1 && this.camera) {
                e.preventDefault();
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                const deltaX = touchX - lastTouchX;
                const deltaY = touchY - lastTouchY;
                
                // Apply rotation based on touch movement
                touchRotationY += deltaX * 0.5;
                touchRotationX += deltaY * 0.5;
                
                // Limit vertical rotation
                touchRotationX = Math.max(-90, Math.min(90, touchRotationX));
                
                this.camera.setAttribute('rotation', 
                    `${touchRotationX} ${touchRotationY} 0`
                );
                
                lastTouchX = touchX;
                lastTouchY = touchY;
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    resetCameraView() {
        if (this.camera) {
            this.camera.setAttribute('rotation', '0 0 0');
            this.cameraRotation = { x: 0, y: 0, z: 0 };
        }
    }

    setupBreathingAnimation() {
        // Breathing animation for the UI circle
        const breathCircle = document.getElementById('breath-circle');
        if (breathCircle) {
            setInterval(() => {
                this.breathPhase += 0.02;
                const scale = 1 + Math.sin(this.breathPhase) * 0.1;
                breathCircle.style.transform = `scale(${scale})`;
            }, 50);
        }
    }

    startBreathingAnimation() {
        const breathCircle = document.getElementById('breath-circle');
        const breathText = document.getElementById('breath-text');
        
        if (breathCircle && breathText) {
            let phase = 0;
            const breatheInText = "Breathe In";
            const breatheOutText = "Breathe Out";
            const holdText = "Hold";
            
            setInterval(() => {
                phase += 0.01;
                const cycle = Math.sin(phase);
                
                if (cycle > 0.7) {
                    breathText.textContent = breatheInText;
                } else if (cycle < -0.7) {
                    breathText.textContent = breatheOutText;
                } else {
                    breathText.textContent = holdText;
                }
                
                // Scale the circle
                const scale = 1 + cycle * 0.2;
                breathCircle.style.transform = `scale(${scale})`;
            }, 100);
        }
    }

    showUIOverlay() {
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            setTimeout(() => {
                uiOverlay.classList.remove('hidden');
                uiOverlay.classList.add('fade-in');
            }, 1000);
        }
    }

    toggleSound() {
        // Placeholder for sound functionality
        const soundBtn = document.getElementById('toggle-sound');
        if (soundBtn) {
            const isOn = soundBtn.textContent.includes('🔊');
            soundBtn.textContent = isOn ? '🔇 Sound' : '🔊 Sound';
            soundBtn.style.opacity = isOn ? '0.6' : '1';
        }
    }

    // Utility function for smooth interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// Initialize the application
const mobileVR = new MobileVRController();

// Additional utility functions
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
    }
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle resize events
window.addEventListener('resize', () => {
    // Recalculate viewport if needed
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// Set initial viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
