// AI Stress Prediction Chatbot
class StressBotAI {
    constructor() {
        this.conversationHistory = [];
        this.stressKeywords = this.initializeStressKeywords();
        this.emotionKeywords = this.initializeEmotionKeywords();
        this.contextPatterns = this.initializeContextPatterns();
        this.recommendations = this.initializeRecommendations();
        this.isRecording = false;
        this.recognition = null;
        
        this.initializeVoiceRecognition();
        this.loadSettings();
        this.setupEventListeners();
    }

    // Initialize stress-related keywords and their weights
    initializeStressKeywords() {
        return {
            // High stress indicators (weight: 3)
            high: {
                words: ['overwhelmed', 'stressed', 'anxious', 'panic', 'crisis', 'emergency', 'urgent', 'deadline', 'pressure', 'exhausted', 'burnout', 'breakdown', 'can\'t cope', 'too much', 'impossible', 'hopeless', 'desperate', 'frustrated', 'angry', 'furious', 'rage', 'hate', 'terrible', 'awful', 'horrible', 'nightmare', 'disaster', 'catastrophe'],
                weight: 3
            },
            // Medium stress indicators (weight: 2)
            medium: {
                words: ['worried', 'concerned', 'nervous', 'tension', 'strain', 'difficult', 'challenging', 'hard', 'tough', 'struggling', 'problem', 'issue', 'trouble', 'concern', 'uneasy', 'uncomfortable', 'bothered', 'annoyed', 'irritated', 'upset', 'sad', 'depressed', 'down', 'low', 'tired', 'fatigued', 'drained', 'sick', 'ill', 'pain', 'hurt'],
                weight: 2
            },
            // Low stress indicators (weight: 1)
            low: {
                words: ['busy', 'hectic', 'rushed', 'swamped', 'loaded', 'packed', 'full', 'crowded', 'noisy', 'loud', 'distracted', 'confused', 'uncertain', 'unsure', 'doubt', 'question', 'wonder', 'think', 'consider', 'plan', 'organize', 'manage', 'handle', 'deal', 'cope', 'manageable', 'okay', 'fine', 'good', 'well', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'perfect', 'calm', 'peaceful', 'relaxed', 'chill', 'cool', 'easy', 'simple', 'smooth', 'comfortable', 'happy', 'joyful', 'cheerful', 'positive', 'optimistic', 'confident', 'secure', 'safe', 'stable', 'balanced'],
                weight: 1
            }
        };
    }

    // Initialize emotion keywords
    initializeEmotionKeywords() {
        return {
            anger: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated', 'frustrated', 'pissed', 'livid', 'outraged'],
            fear: ['scared', 'afraid', 'terrified', 'panic', 'anxious', 'worried', 'nervous', 'frightened', 'alarmed', 'concerned'],
            sadness: ['sad', 'depressed', 'down', 'low', 'blue', 'miserable', 'unhappy', 'gloomy', 'melancholy', 'sorrowful'],
            joy: ['happy', 'joyful', 'cheerful', 'excited', 'thrilled', 'delighted', 'ecstatic', 'elated', 'blissful', 'content'],
            surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'bewildered', 'confused', 'perplexed'],
            disgust: ['disgusted', 'revolted', 'sickened', 'repulsed', 'appalled', 'horrified', 'offended', 'disturbed']
        };
    }

    // Initialize context patterns
    initializeContextPatterns() {
        return {
            work: ['work', 'job', 'office', 'meeting', 'project', 'deadline', 'boss', 'colleague', 'client', 'presentation', 'report', 'email', 'computer', 'desk', 'office', 'company', 'business', 'career', 'promotion', 'salary', 'interview'],
            relationships: ['relationship', 'partner', 'boyfriend', 'girlfriend', 'husband', 'wife', 'family', 'friend', 'parent', 'child', 'sibling', 'marriage', 'divorce', 'breakup', 'dating', 'love', 'romance', 'conflict', 'argument', 'fight'],
            health: ['health', 'sick', 'ill', 'pain', 'ache', 'doctor', 'hospital', 'medicine', 'treatment', 'symptoms', 'disease', 'injury', 'wound', 'surgery', 'medical', 'physical', 'mental', 'therapy', 'counseling'],
            finance: ['money', 'financial', 'debt', 'bill', 'payment', 'loan', 'credit', 'bank', 'budget', 'expensive', 'cheap', 'cost', 'price', 'income', 'salary', 'job', 'unemployment', 'poverty', 'rich', 'poor'],
            future: ['future', 'tomorrow', 'next week', 'next month', 'next year', 'plan', 'goal', 'dream', 'hope', 'wish', 'expectation', 'anticipation', 'unknown', 'uncertainty', 'change', 'decision', 'choice', 'option']
        };
    }

    // Initialize recommendations
    initializeRecommendations() {
        return {
            high: [
                {
                    icon: 'breathing',
                    title: 'Deep Breathing Exercise',
                    description: 'Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
                    action: 'breathing'
                },
                {
                    icon: 'meditation',
                    title: 'Emergency Meditation',
                    description: 'Take 5 minutes to focus on your breathing and clear your mind. This can help reduce immediate stress.',
                    action: 'meditation'
                },
                {
                    icon: 'exercise',
                    title: 'Physical Activity',
                    description: 'Go for a 10-minute walk or do some light stretching. Physical movement helps release stress hormones.',
                    action: 'exercise'
                }
            ],
            medium: [
                {
                    icon: 'breathing',
                    title: 'Mindful Breathing',
                    description: 'Practice 5 minutes of deep, slow breathing to help calm your nervous system.',
                    action: 'breathing'
                },
                {
                    icon: 'music',
                    title: 'Calming Music',
                    description: 'Listen to soothing music or nature sounds to help relax your mind and body.',
                    action: 'music'
                },
                {
                    icon: 'meditation',
                    title: 'Progressive Relaxation',
                    description: 'Tense and relax each muscle group from your toes to your head for complete relaxation.',
                    action: 'meditation'
                }
            ],
            low: [
                {
                    icon: 'breathing',
                    title: 'Maintain Balance',
                    description: 'Keep up your good stress management practices. Consider adding meditation to your routine.',
                    action: 'breathing'
                },
                {
                    icon: 'exercise',
                    title: 'Regular Exercise',
                    description: 'Continue with regular physical activity to maintain your current stress levels.',
                    action: 'exercise'
                },
                {
                    icon: 'meditation',
                    title: 'Preventive Meditation',
                    description: 'Practice daily meditation to prevent stress from building up.',
                    action: 'meditation'
                }
            ]
        };
    }

    // Initialize voice recognition
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceStatus('Error: ' + event.error);
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateVoiceUI();
            };
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Auto-resize textarea
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('input', () => this.autoResize(messageInput));

        // Settings
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            document.getElementById('sensitivityValue').textContent = e.target.value;
            this.saveSettings();
        });

        // Voice input
        document.getElementById('voiceBtn').addEventListener('click', () => this.toggleRecording());
    }

    // Auto-resize textarea
    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // Send message
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        messageInput.value = '';
        this.autoResize(messageInput);

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and generate response
        setTimeout(() => {
            this.processMessage(message);
        }, 1500);
    }

    // Add message to chat
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = `<p>${text}</p>`;

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();

        content.appendChild(messageText);
        content.appendChild(messageTime);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString()
        });
    }

    // Show typing indicator
    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.style.display = 'flex';
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    hideTypingIndicator() {
        document.getElementById('typingIndicator').style.display = 'none';
    }

    // Process message and generate AI response
    processMessage(message) {
        this.hideTypingIndicator();

        // Analyze the message
        const analysis = this.analyzeMessage(message);
        
        // Generate stress level prediction
        const stressLevel = this.predictStressLevel(analysis);
        
        // Generate response
        const response = this.generateResponse(message, analysis, stressLevel);
        
        // Add bot response
        this.addMessage(response, 'bot');
        
        // Show stress analysis
        this.showStressAnalysis(analysis, stressLevel);
        
        // Show recommendations
        this.showRecommendations(stressLevel);
        
        // Save to conversation history
        this.conversationHistory.push({
            text: response,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            analysis: analysis,
            stressLevel: stressLevel
        });
    }

    // Analyze message for stress indicators
    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();
        const words = lowerMessage.split(/\s+/);
        
        let stressScore = 0;
        let emotionScores = {};
        let contextScores = {};
        let detectedKeywords = [];
        let sentiment = 'neutral';

        // Analyze stress keywords
        Object.keys(this.stressKeywords).forEach(level => {
            this.stressKeywords[level].words.forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    stressScore += this.stressKeywords[level].weight;
                    detectedKeywords.push(keyword);
                }
            });
        });

        // Analyze emotions
        Object.keys(this.emotionKeywords).forEach(emotion => {
            emotionScores[emotion] = 0;
            this.emotionKeywords[emotion].forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    emotionScores[emotion]++;
                }
            });
        });

        // Analyze context
        Object.keys(this.contextPatterns).forEach(context => {
            contextScores[context] = 0;
            this.contextPatterns[context].forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    contextScores[context]++;
                }
            });
        });

        // Determine dominant emotion
        const dominantEmotion = Object.keys(emotionScores).reduce((a, b) => 
            emotionScores[a] > emotionScores[b] ? a : b
        );

        // Determine sentiment
        if (emotionScores.joy > 0 && stressScore < 3) {
            sentiment = 'positive';
        } else if (emotionScores.anger > 0 || emotionScores.fear > 0 || stressScore > 5) {
            sentiment = 'negative';
        } else if (emotionScores.sadness > 0 || stressScore > 2) {
            sentiment = 'negative';
        }

        // Calculate confidence based on keyword matches and context
        const confidence = Math.min(95, Math.max(60, 
            (detectedKeywords.length * 10) + 
            (Object.values(contextScores).reduce((a, b) => a + b, 0) * 5) +
            (Object.values(emotionScores).reduce((a, b) => a + b, 0) * 8)
        ));

        return {
            stressScore: stressScore,
            emotionScores: emotionScores,
            contextScores: contextScores,
            dominantEmotion: dominantEmotion,
            sentiment: sentiment,
            detectedKeywords: detectedKeywords,
            confidence: Math.round(confidence),
            wordCount: words.length,
            messageLength: message.length
        };
    }

    // Predict stress level based on analysis
    predictStressLevel(analysis) {
        let stressLevel = 0;
        
        // Base stress level from keyword analysis
        if (analysis.stressScore >= 8) {
            stressLevel = 8 + Math.min(2, Math.random() * 2); // 8-10
        } else if (analysis.stressScore >= 5) {
            stressLevel = 6 + Math.min(2, Math.random() * 2); // 6-8
        } else if (analysis.stressScore >= 3) {
            stressLevel = 4 + Math.min(2, Math.random() * 2); // 4-6
        } else if (analysis.stressScore >= 1) {
            stressLevel = 2 + Math.min(2, Math.random() * 2); // 2-4
        } else {
            stressLevel = 1 + Math.random(); // 1-2
        }

        // Adjust based on sentiment
        if (analysis.sentiment === 'negative') {
            stressLevel += 1;
        } else if (analysis.sentiment === 'positive') {
            stressLevel -= 0.5;
        }

        // Adjust based on dominant emotion
        if (analysis.dominantEmotion === 'anger' || analysis.dominantEmotion === 'fear') {
            stressLevel += 1.5;
        } else if (analysis.dominantEmotion === 'sadness') {
            stressLevel += 1;
        } else if (analysis.dominantEmotion === 'joy') {
            stressLevel -= 1;
        }

        // Adjust based on context
        const contextAdjustment = Object.values(analysis.contextScores).reduce((a, b) => a + b, 0) * 0.3;
        stressLevel += contextAdjustment;

        // Normalize to 1-10 range
        stressLevel = Math.max(1, Math.min(10, Math.round(stressLevel * 10) / 10));

        return {
            level: stressLevel,
            category: this.getStressCategory(stressLevel),
            description: this.getStressDescription(stressLevel),
            confidence: analysis.confidence
        };
    }

    // Get stress category
    getStressCategory(level) {
        if (level >= 8) return 'Very High';
        if (level >= 6) return 'High';
        if (level >= 4) return 'Moderate';
        if (level >= 2) return 'Low';
        return 'Very Low';
    }

    // Get stress description
    getStressDescription(level) {
        const descriptions = {
            1: 'You seem very calm and relaxed!',
            2: 'You appear to be doing well with minimal stress.',
            3: 'You have a low level of stress - keep up the good work!',
            4: 'You have moderate stress levels - some relaxation might help.',
            5: 'You have moderate stress - consider some stress management techniques.',
            6: 'You have elevated stress levels - it\'s time to take action.',
            7: 'You have high stress - prioritize stress reduction activities.',
            8: 'You have very high stress - immediate intervention recommended.',
            9: 'You have extremely high stress - seek professional help if needed.',
            10: 'You have critical stress levels - please consider professional support.'
        };
        return descriptions[Math.round(level)] || descriptions[5];
    }

    // Generate AI response
    generateResponse(message, analysis, stressLevel) {
        const responses = {
            veryHigh: [
                "I can sense you're going through a very difficult time right now. Your stress levels appear to be quite high, and I want you to know that it's okay to feel this way. Let's work together to help you find some relief.",
                "I'm concerned about your stress levels - they seem very elevated. Please know that you're not alone, and there are ways to help manage this. Let's focus on some immediate relief techniques.",
                "Your message indicates you're experiencing significant stress. This is completely understandable, and I'm here to help you work through this step by step."
            ],
            high: [
                "I can tell you're feeling quite stressed right now. That's completely normal, and I'm here to help you work through it. Let's try some techniques to help you feel better.",
                "Your stress levels seem elevated, and I want to help you find some relief. There are several strategies we can try to help you feel more balanced.",
                "I can sense the stress in your message. Let's work together to help you feel more calm and in control."
            ],
            moderate: [
                "I can see you're experiencing some stress, which is completely normal. Let's work on some techniques to help you feel more balanced and relaxed.",
                "Your stress levels are moderate, which means we can definitely work on managing them effectively. Here are some strategies that might help.",
                "I notice some stress indicators in your message. Let's explore some ways to help you feel more calm and centered."
            ],
            low: [
                "It's great to hear that you're managing stress well! Your levels appear to be quite manageable. Let's keep up the good work and maybe explore some preventive techniques.",
                "You seem to be handling stress quite well! That's wonderful. Let's continue with some practices to maintain this positive state.",
                "Your stress levels appear to be low, which is excellent! Let's work on maintaining this healthy balance."
            ]
        };

        const category = stressLevel.category.toLowerCase().replace(' ', '');
        const categoryKey = category === 'verylow' ? 'low' : category;
        const responseArray = responses[categoryKey] || responses.moderate;
        const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

        return randomResponse;
    }

    // Show stress analysis
    showStressAnalysis(analysis, stressLevel) {
        // Update stress meter
        const percentage = (stressLevel.level / 10) * 100;
        const stressFill = document.getElementById('stressFill');
        const stressValue = document.getElementById('stressValue');
        const stressLevelText = document.getElementById('stressLevelText');
        const stressDescription = document.getElementById('stressDescription');

        // Animate stress meter
        stressFill.style.background = `conic-gradient(from 0deg, #4CAF50 0deg, #FFC107 120deg, #FF5722 240deg, #F44336 ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`;
        stressValue.textContent = Math.round(stressLevel.level);
        stressLevelText.textContent = stressLevel.category;
        stressDescription.textContent = stressLevel.description;

        // Show stress display
        document.getElementById('stressDisplay').style.display = 'flex';

        // Update analysis panel
        document.getElementById('sentimentValue').textContent = analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1);
        document.getElementById('emotionValue').textContent = analysis.dominantEmotion.charAt(0).toUpperCase() + analysis.dominantEmotion.slice(1);
        document.getElementById('confidenceValue').textContent = analysis.confidence + '%';
        document.getElementById('keywordsValue').textContent = analysis.detectedKeywords.slice(0, 3).join(', ') || 'None detected';

        // Show analysis panel
        document.getElementById('analysisPanel').style.display = 'block';
    }

    // Show recommendations
    showRecommendations(stressLevel) {
        const recommendationsList = document.getElementById('recommendationsList');
        const level = stressLevel.level >= 7 ? 'high' : stressLevel.level >= 4 ? 'medium' : 'low';
        const recommendations = this.recommendations[level];

        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item" onclick="stressBot.executeRecommendation('${rec.action}')">
                <div class="recommendation-icon ${rec.icon}">
                    <i class="fas fa-${this.getRecommendationIcon(rec.icon)}"></i>
                </div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-description">${rec.description}</div>
                </div>
            </div>
        `).join('');

        // Show recommendations panel
        document.getElementById('recommendationsPanel').style.display = 'block';
    }

    // Get recommendation icon
    getRecommendationIcon(type) {
        const icons = {
            breathing: 'lungs',
            meditation: 'om',
            exercise: 'running',
            music: 'music'
        };
        return icons[type] || 'heart';
    }

    // Execute recommendation
    executeRecommendation(action) {
        const actions = {
            breathing: () => {
                this.addMessage('Let\'s do a breathing exercise together. I\'ll guide you through it step by step.', 'bot');
                this.startBreathingExercise();
            },
            meditation: () => {
                this.addMessage('I\'ll help you with a quick meditation session. Find a comfortable position and let\'s begin.', 'bot');
                this.startMeditation();
            },
            exercise: () => {
                this.addMessage('Physical activity is great for stress relief! Here are some quick exercises you can do right now.', 'bot');
                this.suggestExercise();
            },
            music: () => {
                this.addMessage('Music can be very therapeutic. Let me suggest some calming options for you.', 'bot');
                this.suggestMusic();
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    // Start breathing exercise
    startBreathingExercise() {
        this.addMessage('🌬️ Breathing Exercise: Let\'s do the 4-7-8 technique. Inhale for 4 counts, hold for 7, exhale for 8. Ready? Let\'s begin...', 'bot');
        // You could integrate with the main app's breathing exercise here
    }

    // Start meditation
    startMeditation() {
        this.addMessage('🧘 Meditation: Find a quiet space. Close your eyes and focus on your breathing. Let thoughts come and go without judgment. Start with 5 minutes.', 'bot');
        // You could integrate with the main app's meditation timer here
    }

    // Suggest exercise
    suggestExercise() {
        this.addMessage('🏃 Exercise Suggestions: 1) Take a 10-minute walk 2) Do 20 jumping jacks 3) Stretch your arms and shoulders 4) Practice yoga poses like downward dog or child\'s pose.', 'bot');
    }

    // Suggest music
    suggestMusic() {
        this.addMessage('🎵 Music Therapy: Try listening to nature sounds, classical music, or ambient sounds. Spotify and YouTube have great playlists for stress relief and relaxation.', 'bot');
    }

    // Voice input functions
    toggleRecording() {
        if (!this.recognition) {
            this.addMessage('Sorry, voice input is not supported in your browser.', 'bot');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isRecording = true;
            this.updateVoiceUI();
        }
    }

    updateVoiceUI() {
        const voiceCircle = document.getElementById('voiceCircle');
        const voiceIcon = document.getElementById('voiceIcon');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceBtn = document.getElementById('voiceBtn');

        if (this.isRecording) {
            voiceCircle.classList.add('recording');
            voiceIcon.className = 'fas fa-stop';
            voiceStatus.textContent = 'Recording... Click to stop';
            voiceBtn.textContent = 'Stop Recording';
        } else {
            voiceCircle.classList.remove('recording');
            voiceIcon.className = 'fas fa-microphone';
            voiceStatus.textContent = 'Click to start recording';
            voiceBtn.textContent = 'Start Recording';
        }
    }

    updateVoiceStatus(status) {
        document.getElementById('voiceStatus').textContent = status;
    }

    // Settings functions
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('stressBotSettings') || '{}');
        document.getElementById('enableVoice').checked = settings.enableVoice !== false;
        document.getElementById('enableNotifications').checked = settings.enableNotifications !== false;
        document.getElementById('saveConversations').checked = settings.saveConversations !== false;
        document.getElementById('sensitivity').value = settings.sensitivity || 5;
        document.getElementById('sensitivityValue').textContent = settings.sensitivity || 5;
    }

    saveSettings() {
        const settings = {
            enableVoice: document.getElementById('enableVoice').checked,
            enableNotifications: document.getElementById('enableNotifications').checked,
            saveConversations: document.getElementById('saveConversations').checked,
            sensitivity: parseInt(document.getElementById('sensitivity').value)
        };
        localStorage.setItem('stressBotSettings', JSON.stringify(settings));
    }

    // Utility functions
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            document.getElementById('chatMessages').innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            <p>Chat cleared! How can I help you today?</p>
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
            `;
            this.conversationHistory = [];
            this.hideAllPanels();
        }
    }

    hideAllPanels() {
        document.getElementById('stressDisplay').style.display = 'none';
        document.getElementById('analysisPanel').style.display = 'none';
        document.getElementById('recommendationsPanel').style.display = 'none';
    }

    // Quick message functions
    sendQuickMessage(message) {
        document.getElementById('messageInput').value = message;
        this.sendMessage();
    }

    fillInput(text) {
        document.getElementById('messageInput').value = text;
        document.getElementById('messageInput').focus();
    }

    // Modal functions
    toggleSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
        this.saveSettings();
    }

    closeVoiceModal() {
        document.getElementById('voiceModal').classList.remove('active');
        if (this.isRecording) {
            this.recognition.stop();
        }
    }

    goBack() {
        window.location.href = 'app.html';
    }
}

// Global functions for HTML onclick events
function sendMessage() {
    stressBot.sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    stressBot.autoResize(textarea);
}

function clearChat() {
    stressBot.clearChat();
}

function toggleSettings() {
    stressBot.toggleSettings();
}

function closeSettings() {
    stressBot.closeSettings();
}

function toggleVoiceInput() {
    document.getElementById('voiceModal').classList.add('active');
}

function closeVoiceModal() {
    stressBot.closeVoiceModal();
}

function toggleRecording() {
    stressBot.toggleRecording();
}

function sendQuickMessage(message) {
    stressBot.sendQuickMessage(message);
}

function fillInput(text) {
    stressBot.fillInput(text);
}

function goBack() {
    stressBot.goBack();
}

// Initialize the chatbot when the page loads
let stressBot;
document.addEventListener('DOMContentLoaded', function() {
    stressBot = new StressBotAI();
    
    // Add some initial conversation context
    stressBot.addMessage('Hi! I\'m here to help you understand and manage your stress levels. Just tell me how you\'re feeling or what\'s on your mind, and I\'ll analyze your message to predict your stress level and provide personalized recommendations.', 'bot');
});
