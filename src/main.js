// Main game initialization and control
let game;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        game = new GameEngine();
        
        // Setup mobile controls
        setupMobileControls();
        
        // Add touch event handling for mobile
        setupTouchControls();
        
        // Setup audio initialization on first user interaction
        setupAudioInitialization();
        
        // Start the render loop even before game starts
        game.render();
        game.updateDisplay();
        
        console.log('🎮 Retro Block Adventure initialized!');
        console.log('🎵 Audio system ready');
        console.log('📱 Mobile controls configured');
        console.log('✨ Particle system active');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Fallback initialization
        setTimeout(() => {
            try {
                game = new GameEngine();
                setupMobileControls();
                setupTouchControls();
                setupAudioInitialization();
                game.render();
                game.updateDisplay();
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }, 100);
    }
});

// Also try to initialize when window loads (fallback)
window.addEventListener('load', () => {
    if (!game) {
        try {
            game = new GameEngine();
            setupMobileControls();
            setupTouchControls();
            setupAudioInitialization();
            game.render();
            game.updateDisplay();
        } catch (error) {
            console.error('Window load initialization failed:', error);
        }
    }
});

function setupMobileControls() {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    const mobileControls = document.getElementById('mobileControls');
    
    if (mobileControls && isMobile) {
        mobileControls.style.display = 'grid';
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.innerWidth <= 768 || 'ontouchstart' in window;
        if (mobileControls) {
            mobileControls.style.display = isMobileNow ? 'grid' : 'none';
        }
    });
}

function setupTouchControls() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!game || !game.gameRunning || game.gamePaused) return;
        
        const touch = e.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const touchDuration = Date.now() - touchStartTime;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Tap (short duration, small distance)
        if (touchDuration < 200 && distance < 30) {
            game.rotatePiece();
            return;
        }
        
        // Swipe detection
        if (distance > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    game.movePiece(1, 0); // Right
                } else {
                    game.movePiece(-1, 0); // Left
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    game.hardDrop(); // Down
                } else {
                    game.holdPiece(); // Up
                }
            }
        }
    }, { passive: false });
}

function setupAudioInitialization() {
    const initAudio = () => {
        if (game && game.audioManager && game.audioManager.audioContext && 
            game.audioManager.audioContext.state === 'suspended') {
            game.audioManager.audioContext.resume();
        }
        
        // Remove the event listeners after first interaction
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
        document.removeEventListener('touchstart', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    document.addEventListener('touchstart', initAudio);
}

// Game state management
window.addEventListener('visibilitychange', () => {
    if (game && document.hidden && game.gameRunning && !game.gamePaused) {
        game.togglePause();
    }
});

// Handle window focus/blur for pause functionality
window.addEventListener('blur', () => {
    if (game && game.gameRunning && !game.gamePaused) {
        game.togglePause();
    }
});

window.addEventListener('focus', () => {
    // Auto-resume could be annoying, so we don't auto-resume
});

// Prevent default behavior for arrow keys to avoid page scrolling
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});

// Performance monitoring
let lastPerformanceLog = 0;
function logPerformance() {
    const now = performance.now();
    if (now - lastPerformanceLog > 5000) { // Log every 5 seconds
        lastPerformanceLog = now;
        if (game && game.particleManager) {
            const particleCount = game.particleManager.getParticleCount();
            if (particleCount > 0) {
                console.log(`🎪 Active particles: ${particleCount}`);
            }
        }
    }
}

// Animation frame callback with performance monitoring
const originalRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
    return originalRequestAnimationFrame.call(this, function(timestamp) {
        logPerformance();
        return callback(timestamp);
    });
};

// Easter eggs and special effects
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        console.log('🎊 Konami Code activated! Special effects enabled!');
        if (game && game.particleManager) {
            game.particleManager.createLevelUpEffect(
                game.canvas.width / 2, 
                game.canvas.height / 2
            );
        }
        if (game && game.audioManager) {
            game.audioManager.playSound('tetris');
        }
        konamiCode = []; // Reset
        
        // Add some bonus score
        if (game && game.gameRunning) {
            game.score += 1000;
            game.updateDisplay();
            if (game.particleManager) {
                game.particleManager.createScoreText(
                    game.canvas.width / 2,
                    game.canvas.height / 2 - 60,
                    1000
                );
            }
        }
    }
});

// Export game instance for debugging
if (typeof window !== 'undefined') {
    window.game = game;
}
window.debugMode = false;

// Debug mode toggle
window.toggleDebug = function() {
    window.debugMode = !window.debugMode;
    console.log(`Debug mode: ${window.debugMode ? 'ON' : 'OFF'}`);
    
    if (window.debugMode) {
        console.log('🔧 Debug commands available:');
        console.log('  - game.score = X (set score)');
        console.log('  - game.level = X (set level)'); 
        console.log('  - game.fallSpeed = X (set fall speed)');
        console.log('  - game.particleManager.clear() (clear particles)');
        console.log('  - game.audioManager.toggleEnabled() (toggle audio)');
    }
};

console.log('🎮 Type toggleDebug() to enable debug mode');