// ============================================
// SMARTBOARD INTERFACE - JAVASCRIPT
// ============================================

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    musicFiles: [],
    videoFiles: [],
    lessonLinks: {},
    currentTheme: 'default',
    backgroundColor: null,
    volume: 70,
    timerRunning: false,
    timerInterval: null,
    totalSeconds: 0,
    currentLessonContent: {}
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeEventListeners();
    initializeLessonContent();
});

function initializeEventListeners() {
    // Sidebar buttons
    document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
    document.getElementById('backgroundBtn').addEventListener('click', () => openModal('backgroundModal'));
    document.getElementById('musicBtn').addEventListener('click', () => openModal('musicModal'));
    document.getElementById('videoBtn').addEventListener('click', () => openModal('videoModal'));
    document.getElementById('quietBtn').addEventListener('click', () => openModal('quietModal'));
    document.getElementById('timerBtn').addEventListener('click', () => openModal('timerModal'));
    document.getElementById('volumeBtn').addEventListener('click', () => openModal('volumeModal'));

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    });

    // Modal backdrop close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Settings
    document.getElementById('fullscreenToggle').addEventListener('change', toggleFullscreen);
    document.getElementById('addLinkBtn').addEventListener('click', addLessonLink);

    // Background
    document.getElementById('uploadBgBtn').addEventListener('click', uploadBackground);
    document.getElementById('removeBgBtn').addEventListener('click', removeBackground);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => changeTheme(e.target.closest('.theme-btn').dataset.theme));
    });

    // Music
    document.getElementById('uploadMusicBtn').addEventListener('click', uploadMusic);

    // Video
    document.getElementById('uploadVideoBtn').addEventListener('click', uploadVideo);

    // Timer
    document.getElementById('timerStart').addEventListener('click', startTimer);
    document.getElementById('timerStop').addEventListener('click', stopTimer);
    document.getElementById('timerReset').addEventListener('click', resetTimer);
    document.getElementById('timerMinutes').addEventListener('change', updateTimerDisplay);
    document.getElementById('timerSeconds').addEventListener('change', updateTimerDisplay);

    // Volume
    document.getElementById('volumeSlider').addEventListener('input', changeVolume);

    // Lesson flow items
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', (e) => selectLessonItem(e.target.closest('.lesson-item')));
    });

    // Fullscreen keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11' || (e.ctrlKey && e.shiftKey && e.key === 'F')) {
            e.preventDefault();
            document.getElementById('fullscreenToggle').checked = !document.getElementById('fullscreenToggle').checked;
            toggleFullscreen();
        }
    });
}

function initializeLessonContent() {
    state.currentLessonContent = {
        warmup: {
            title: 'Warm-up Activity',
            html: `
                <div class="lesson-content">
                    <h2>🔥 Warm-up Activity</h2>
                    <p>YouTube Playlist - Let's get started with some music and energy!</p>
                    <iframe width="100%" height="400" src="https://www.youtube.com/embed/videoseries?list=RDZanHgPprl-0&start_radio=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `
        },
        review: {
            title: 'Review',
            html: `
                <div class="lesson-content">
                    <h2>📋 Review</h2>
                    <p>Let's review what we learned!</p>
                    <iframe src="https://canva.link/eqg6dzndko5g7on" width="100%" height="500" style="border-radius: 10px;"></iframe>
                </div>
            `
        },
        prior: {
            title: 'Prior Knowledge',
            html: `
                <div class="lesson-content">
                    <h2>💭 Prior Knowledge</h2>
                    <p>Let's activate what you already know about this topic.</p>
                    <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(255, 182, 217, 0.2), rgba(212, 174, 221, 0.2)); border-radius: 12px;">
                        <p style="font-size: 1.2rem; color: #666;">What do you already know about this topic?</p>
                        <textarea placeholder="Type your thoughts here..." style="width: 90%; height: 150px; padding: 12px; border-radius: 8px; border: 2px solid #ddd; margin-top: 20px; font-family: inherit;"></textarea>
                    </div>
                </div>
            `
        },
        lesson: {
            title: 'Lesson of the Day',
            html: `
                <div class="lesson-content">
                    <h2>📚 Lesson of the Day</h2>
                    <p>Today's main lesson content goes here.</p>
                    <div style="padding: 40px; background: linear-gradient(135deg, rgba(255, 182, 217, 0.2), rgba(212, 174, 221, 0.2)); border-radius: 12px;">
                        <p style="font-size: 1.1rem; line-height: 1.8;">This is where the main lesson content will be displayed. You can embed videos, presentations, or other interactive content here.</p>
                    </div>
                </div>
            `
        },
        practice: {
            title: 'Practice',
            html: `
                <div class="lesson-content">
                    <h2>✏️ Practice</h2>
                    <p>Let's practice what we've learned!</p>
                    <div style="padding: 40px; background: linear-gradient(135deg, rgba(255, 182, 217, 0.2), rgba(212, 174, 221, 0.2)); border-radius: 12px;">
                        <p style="font-size: 1.1rem;">Practice problems and activities will appear here.</p>
                        <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                            <button style="padding: 15px; background: #FFB6D9; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Exercise 1</button>
                            <button style="padding: 15px; background: #D4AEDD; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Exercise 2</button>
                            <button style="padding: 15px; background: #FFB6D9; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Exercise 3</button>
                        </div>
                    </div>
                </div>
            `
        },
        assessment: {
            title: 'Assessment',
            html: `
                <div class="lesson-content">
                    <h2>✅ Assessment</h2>
                    <p>Let's check your understanding!</p>
                    <div style="padding: 40px; background: linear-gradient(135deg, rgba(255, 182, 217, 0.2), rgba(212, 174, 221, 0.2)); border-radius: 12px;">
                        <p style="font-size: 1.1rem;">Assessment and quiz content will appear here.</p>
                    </div>
                </div>
            `
        },
        wrapup: {
            title: 'Wrap Up',
            html: `
                <div class="lesson-content">
                    <h2>🎉 Wrap Up</h2>
                    <p>Let's summarize what we learned today!</p>
                    <div style="padding: 40px; background: linear-gradient(135deg, rgba(255, 182, 217, 0.2), rgba(212, 174, 221, 0.2)); border-radius: 12px;">
                        <p style="font-size: 1.1rem; line-height: 1.8;">
                            Great job today! Here's what we covered:
                            <ul style="margin-top: 15px; margin-left: 20px;">
                                <li>Key point 1</li>
                                <li>Key point 2</li>
                                <li>Key point 3</li>
                            </ul>
                        </p>
                    </div>
                </div>
            `
        }
    };
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    refreshModalContent(modalId);
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}

function refreshModalContent(modalId) {
    if (modalId === 'musicModal') {
        renderMusicList();
    } else if (modalId === 'videoModal') {
        renderVideoList();
    } else if (modalId === 'settingsModal') {
        renderLessonLinksList();
    }
}

// ============================================
// SETTINGS
// ============================================

function addLessonLink() {
    const newLink = {
        id: Date.now(),
        name: `Link ${Object.keys(state.lessonLinks).length + 1}`,
        url: ''
    };
    state.lessonLinks[newLink.id] = newLink;
    renderLessonLinksList();
    saveState();
}

function renderLessonLinksList() {
    const container = document.getElementById('lessonLinksList');
    container.innerHTML = '';
    
    Object.values(state.lessonLinks).forEach(link => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item';
        linkDiv.innerHTML = `
            <input type="text" placeholder="Label" value="${link.name}" onchange="updateLinkName(${link.id}, this.value)">
            <input type="text" placeholder="URL" value="${link.url}" onchange="updateLinkUrl(${link.id}, this.value)" style="flex: 2;">
            <button class="link-item-remove" onclick="removeLink(${link.id})">Remove</button>
        `;
        container.appendChild(linkDiv);
    });
}

function updateLinkName(id, name) {
    if (state.lessonLinks[id]) {
        state.lessonLinks[id].name = name;
        saveState();
    }
}

function updateLinkUrl(id, url) {
    if (state.lessonLinks[id]) {
        state.lessonLinks[id].url = url;
        saveState();
    }
}

function removeLink(id) {
    delete state.lessonLinks[id];
    renderLessonLinksList();
    saveState();
}

function toggleFullscreen() {
    const isChecked = document.getElementById('fullscreenToggle').checked;
    if (isChecked) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen request denied');
        });
    }
}

// ============================================
// BACKGROUND & THEME
// ============================================

function changeTheme(theme) {
    state.currentTheme = theme;
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    saveState();
}

function uploadBackground() {
    const file = document.getElementById('backgroundUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            state.backgroundColor = e.target.result;
            applyBackgroundImage(e.target.result);
            showBgPreview(e.target.result);
            saveState();
        };
        reader.readAsDataURL(file);
    }
}

function applyBackgroundImage(imageData) {
    document.body.style.backgroundImage = `url('${imageData}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

function removeBackground() {
    state.backgroundColor = null;
    document.body.style.backgroundImage = 'none';
    document.getElementById('bgPreview').classList.remove('active');
    saveState();
}

function showBgPreview(imageData) {
    const preview = document.getElementById('bgPreview');
    preview.style.backgroundImage = `url('${imageData}')`;
    preview.classList.add('active');
}

// ============================================
// MUSIC MANAGEMENT
// ============================================

function uploadMusic() {
    const file = document.getElementById('musicUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const musicFile = {
                id: Date.now(),
                name: file.name,
                data: e.target.result,
                type: file.type
            };
            state.musicFiles.push(musicFile);
            document.getElementById('musicUpload').value = '';
            renderMusicList();
            saveState();
        };
        reader.readAsDataURL(file);
    }
}

function renderMusicList() {
    const container = document.getElementById('musicList');
    container.innerHTML = '';
    
    state.musicFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-item-name">🎵 ${file.name}</span>
            <div class="file-item-actions">
                <button class="file-item-btn" onclick="playMusic(${file.id})">Play</button>
                <button class="file-item-btn delete" onclick="deleteMusic(${file.id})">Delete</button>
            </div>
        `;
        container.appendChild(fileItem);
    });
}

function playMusic(fileId) {
    const file = state.musicFiles.find(f => f.id === fileId);
    if (file) {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = file.data;
        audioPlayer.volume = state.volume / 100;
        audioPlayer.play();
    }
}

function deleteMusic(fileId) {
    state.musicFiles = state.musicFiles.filter(f => f.id !== fileId);
    renderMusicList();
    saveState();
}

// ============================================
// VIDEO MANAGEMENT
// ============================================

function uploadVideo() {
    const file = document.getElementById('videoUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const videoFile = {
                id: Date.now(),
                name: file.name,
                data: e.target.result,
                type: file.type
            };
            state.videoFiles.push(videoFile);
            document.getElementById('videoUpload').value = '';
            renderVideoList();
            saveState();
        };
        reader.readAsDataURL(file);
    }
}

function renderVideoList() {
    const container = document.getElementById('videoList');
    container.innerHTML = '';
    
    state.videoFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-item-name">🎬 ${file.name}</span>
            <div class="file-item-actions">
                <button class="file-item-btn" onclick="playVideo(${file.id})">Play</button>
                <button class="file-item-btn delete" onclick="deleteVideo(${file.id})">Delete</button>
            </div>
        `;
        container.appendChild(fileItem);
    });
}

function playVideo(fileId) {
    const file = state.videoFiles.find(f => f.id === fileId);
    if (file) {
        // Open video in fullscreen or new window
        const videoWindow = window.open('', '_blank');
        videoWindow.document.write(`
            <html>
            <head><title>${file.name}</title></head>
            <body style="margin: 0; background: #000;">
                <video width="100%" height="100%" controls autoplay style="display: block;">
                    <source src="${file.data}" type="${file.type}">
                </video>
            </body>
            </html>
        `);
    }
}

function deleteVideo(fileId) {
    state.videoFiles = state.videoFiles.filter(f => f.id !== fileId);
    renderVideoList();
    saveState();
}

// ============================================
// TIMER
// ============================================

function startTimer() {
    if (state.timerRunning) return;
    
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    state.totalSeconds = minutes * 60 + seconds;
    
    if (state.totalSeconds <= 0) {
        alert('Please set a time greater than 0');
        return;
    }
    
    state.timerRunning = true;
    document.getElementById('timerStart').disabled = true;
    document.getElementById('timerStop').disabled = false;
    document.getElementById('timerMinutes').disabled = true;
    document.getElementById('timerSeconds').disabled = true;
    
    state.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    document.getElementById('timerStart').disabled = false;
    document.getElementById('timerStop').disabled = true;
    document.getElementById('timerMinutes').disabled = false;
    document.getElementById('timerSeconds').disabled = false;
}

function resetTimer() {
    stopTimer();
    state.totalSeconds = 0;
    updateTimerDisplay();
    document.getElementById('bombAnimation').classList.add('hidden');
}

function updateTimer() {
    if (state.totalSeconds <= 0) {
        state.timerRunning = false;
        clearInterval(state.timerInterval);
        triggerTimerComplete();
        return;
    }
    
    state.totalSeconds--;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    if (!state.timerRunning) {
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        state.totalSeconds = minutes * 60 + seconds;
    }
    
    const minutes = Math.floor(state.totalSeconds / 60);
    const seconds = state.totalSeconds % 60;
    document.getElementById('timerValue').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function triggerTimerComplete() {
    const bombAnimation = document.getElementById('bombAnimation');
    bombAnimation.classList.remove('hidden');
    
    // Play explosion effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    setTimeout(() => {
        bombAnimation.classList.add('hidden');
    }, 2000);
    
    document.getElementById('timerStart').disabled = false;
    document.getElementById('timerStop').disabled = true;
    document.getElementById('timerMinutes').disabled = false;
    document.getElementById('timerSeconds').disabled = false;
}

// ============================================
// VOLUME CONTROL
// ============================================

function changeVolume(e) {
    state.volume = e.target.value;
    document.getElementById('volumePercent').textContent = `${state.volume}%`;
    document.getElementById('audioPlayer').volume = state.volume / 100;
    saveState();
}

// ============================================
// LESSON FLOW
// ============================================

function selectLessonItem(element) {
    // Remove active class from all lesson items
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    element.classList.add('active');
    
    // Get lesson data
    const lessonType = element.dataset.lesson;
    const content = state.currentLessonContent[lessonType];
    
    if (content) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = content.html;
    }
}

// ============================================
// STATE PERSISTENCE
// ============================================

function saveState() {
    const saveData = {
        musicFiles: state.musicFiles,
        videoFiles: state.videoFiles,
        lessonLinks: state.lessonLinks,
        currentTheme: state.currentTheme,
        backgroundColor: state.backgroundColor,
        volume: state.volume
    };
    localStorage.setItem('smartboardState', JSON.stringify(saveData));
}

function loadState() {
    const saved = localStorage.getItem('smartboardState');
    if (saved) {
        const data = JSON.parse(saved);
        state.musicFiles = data.musicFiles || [];
        state.videoFiles = data.videoFiles || [];
        state.lessonLinks = data.lessonLinks || {};
        state.currentTheme = data.currentTheme || 'default';
        state.backgroundColor = data.backgroundColor || null;
        state.volume = data.volume || 70;
        
        // Apply saved theme
        if (state.currentTheme !== 'default') {
            changeTheme(state.currentTheme);
        }
        
        // Apply saved background
        if (state.backgroundColor) {
            applyBackgroundImage(state.backgroundColor);
        }
        
        // Set volume
        document.getElementById('volumeSlider').value = state.volume;
        document.getElementById('volumePercent').textContent = `${state.volume}%`;
    }
    
    // Initialize timer display
    updateTimerDisplay();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function playSound(frequency = 440, duration = 200) {
    if (!document.getElementById('soundToggle').checked) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}