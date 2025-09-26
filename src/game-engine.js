class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextPieceCanvas = document.getElementById('nextPieceCanvas');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.CELL_SIZE = 40;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.heldPiece = null;
        this.canHold = true;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.fallSpeed = 1000;
        this.lastFallTime = 0;
        
        this.keys = {};
        this.lastMoveTime = 0;
        this.moveDelay = 120;
        
        this.particleManager = new ParticleManager(this.canvas);
        this.audioManager = new AudioManager();
        
        this.initializeBoard();
        this.setupEventListeners();
        this.setupColors();
        
        this.animationId = null;
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    setupColors() {
        this.pieceColors = {
            'I': '#3498db',  // Blue
            'O': '#5dade2',  // Light Blue
            'T': '#2980b9',  // Dark Blue
            'S': '#85c1e9',  // Very Light Blue
            'Z': '#1f4e79',  // Navy Blue
            'J': '#4a90e2',  // Medium Blue
            'L': '#74b9ff'   // Sky Blue
        };
        
        this.boardColors = {
            empty: '#1a1a2e',
            filled: '#16213e',
            border: '#2C3E50'
        };
    }
    
    initializeBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill(null)
            .map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            this.keys[e.code] = true;
            this.handleKeyPress(e.code);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    handleKeyPress(keyCode) {
        const now = Date.now();
        
        switch(keyCode) {
            case 'KeyA':
            case 'ArrowLeft':
                if (now - this.lastMoveTime > this.moveDelay) {
                    this.movePiece(-1, 0);
                    this.lastMoveTime = now;
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (now - this.lastMoveTime > this.moveDelay) {
                    this.movePiece(1, 0);
                    this.lastMoveTime = now;
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.softDrop();
                break;
            case 'KeyW':
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case 'Space':
                this.hardDrop();
                break;
            case 'KeyC':
                this.holdPiece();
                break;
        }
    }
    
    handleMobileControl(action) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(action) {
            case 'left':
                this.movePiece(-1, 0);
                break;
            case 'right':
                this.movePiece(1, 0);
                break;
            case 'down':
                this.softDrop();
                break;
            case 'rotate':
                this.rotatePiece();
                break;
            case 'drop':
                this.hardDrop();
                break;
            case 'hold':
                this.holdPiece();
                break;
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.initializeBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.fallSpeed = 1000;
        this.heldPiece = null;
        this.canHold = true;
        
        this.currentPiece = new TetrisPiece();
        this.nextPiece = new TetrisPiece();
        
        this.updateDisplay();
        this.audioManager.playSound('gameStart');
        
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('startBtn').textContent = 'Restart';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    restart() {
        this.start();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        const now = Date.now();
        
        if (now - this.lastFallTime > this.fallSpeed) {
            this.dropPiece();
            this.lastFallTime = now;
        }
        
        this.handleContinuousInput();
        this.render();
        this.particleManager.update();
        
        this.animationId = requestAnimationFrame(this.gameLoop);
    }
    
    handleContinuousInput() {
        const now = Date.now();
        
        if ((this.keys['KeyA'] || this.keys['ArrowLeft']) && 
            now - this.lastMoveTime > this.moveDelay) {
            this.movePiece(-1, 0);
            this.lastMoveTime = now;
        }
        
        if ((this.keys['KeyD'] || this.keys['ArrowRight']) && 
            now - this.lastMoveTime > this.moveDelay) {
            this.movePiece(1, 0);
            this.lastMoveTime = now;
        }
        
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.softDrop();
        }
    }
    
    dropPiece() {
        if (this.canMovePiece(0, 1)) {
            this.currentPiece.y++;
        } else {
            this.placePiece();
            this.spawnNewPiece();
        }
    }
    
    softDrop() {
        if (this.canMovePiece(0, 1)) {
            this.currentPiece.y++;
            this.score += 1;
            this.updateDisplay();
        }
    }
    
    hardDrop() {
        let dropDistance = 0;
        while (this.canMovePiece(0, 1)) {
            this.currentPiece.y++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.updateDisplay();
        
        this.placePiece();
        this.spawnNewPiece();
        this.audioManager.playSound('hardDrop');
    }
    
    movePiece(dx, dy) {
        if (this.canMovePiece(dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            if (dx !== 0) {
                this.audioManager.playSound('move');
            }
        }
    }
    
    rotatePiece() {
        const originalRotation = this.currentPiece.rotation;
        this.currentPiece.rotate();
        
        if (!this.canMovePiece(0, 0)) {
            // Try wall kicks
            const kicks = [[-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];
            let kickSuccessful = false;
            
            for (let kick of kicks) {
                if (this.canMovePiece(kick[0], kick[1])) {
                    this.currentPiece.x += kick[0];
                    this.currentPiece.y += kick[1];
                    kickSuccessful = true;
                    break;
                }
            }
            
            if (!kickSuccessful) {
                this.currentPiece.rotation = originalRotation;
            } else {
                this.audioManager.playSound('rotate');
            }
        } else {
            this.audioManager.playSound('rotate');
        }
    }
    
    holdPiece() {
        if (!this.canHold) return;
        
        if (this.heldPiece === null) {
            this.heldPiece = this.currentPiece;
            this.currentPiece = this.nextPiece;
            this.nextPiece = new TetrisPiece();
        } else {
            const temp = this.currentPiece;
            this.currentPiece = this.heldPiece;
            this.heldPiece = temp;
        }
        
        this.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - 2;
        this.currentPiece.y = 0;
        this.currentPiece.rotation = 0;
        
        this.heldPiece.x = 0;
        this.heldPiece.y = 0;
        this.heldPiece.rotation = 0;
        
        this.canHold = false;
        this.audioManager.playSound('hold');
    }
    
    canMovePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        const shape = this.currentPiece.getCurrentShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = newX + col;
                    const boardY = newY + row;
                    
                    if (boardX < 0 || boardX >= this.BOARD_WIDTH ||
                        boardY >= this.BOARD_HEIGHT ||
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    placePiece() {
        const shape = this.currentPiece.getCurrentShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = this.currentPiece.x + col;
                    const boardY = this.currentPiece.y + row;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.type;
                    }
                }
            }
        }
        
        this.clearLines();
        this.audioManager.playSound('piecePlaced');
    }
    
    clearLines() {
        const linesCleared = [];
        
        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                linesCleared.push(row);
            }
        }
        
        if (linesCleared.length > 0) {
            // Create particle effects for cleared lines
            linesCleared.forEach(row => {
                for (let col = 0; col < this.BOARD_WIDTH; col++) {
                    const x = col * this.CELL_SIZE + this.CELL_SIZE / 2;
                    const y = row * this.CELL_SIZE + this.CELL_SIZE / 2;
                    this.particleManager.createLineCllearEffect(x, y);
                }
            });
            
            // Remove cleared lines
            linesCleared.sort((a, b) => b - a);
            linesCleared.forEach(row => {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
            });
            
            this.lines += linesCleared.length;
            this.calculateScore(linesCleared.length);
            this.updateLevel();
            this.audioManager.playSound('lineClear');
        }
    }
    
    calculateScore(linesCleared) {
        const baseScores = [0, 100, 300, 500, 800];
        this.score += baseScores[linesCleared] * this.level;
        
        if (linesCleared === 4) {
            this.audioManager.playSound('tetris');
        }
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.fallSpeed = Math.max(50, 1000 - (this.level - 1) * 50);
            this.audioManager.playSound('levelUp');
        }
    }
    
    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = new TetrisPiece();
        this.canHold = true;
        
        if (!this.canMovePiece(0, 0)) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.audioManager.playSound('gameOver');
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('startBtn').textContent = 'Start Game';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    updateDisplay() {
        document.getElementById('scoreDisplay').textContent = this.score.toLocaleString();
        document.getElementById('levelDisplay').textContent = this.level;
        document.getElementById('linesDisplay').textContent = this.lines;
        
        this.renderNextPiece();
    }
    
    renderNextPiece() {
        this.nextPieceCtx.fillStyle = '#2C3E50';
        this.nextPieceCtx.fillRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        
        if (this.nextPiece) {
            const shape = this.nextPiece.getCurrentShape();
            const cellSize = 24;
            const offsetX = (this.nextPieceCanvas.width - shape[0].length * cellSize) / 2;
            const offsetY = (this.nextPieceCanvas.height - shape.length * cellSize) / 2;
            
            this.nextPieceCtx.fillStyle = this.pieceColors[this.nextPiece.type];
            
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = offsetX + col * cellSize;
                        const y = offsetY + row * cellSize;
                        
                        this.nextPieceCtx.fillRect(x, y, cellSize - 2, cellSize - 2);
                        this.nextPieceCtx.strokeStyle = '#ffffff';
                        this.nextPieceCtx.lineWidth = 1;
                        this.nextPieceCtx.strokeRect(x, y, cellSize - 2, cellSize - 2);
                    }
                }
            }
        }
    }
    
    render() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game board
        this.drawBoard();
        
        // Draw current piece with shadow
        if (this.currentPiece) {
            this.drawGhostPiece();
            this.drawPiece(this.currentPiece);
        }
        
        // Draw particles
        this.particleManager.render(this.ctx);
        
        // Draw border
        this.ctx.strokeStyle = '#4ECDC4';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBoard() {
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                const x = col * this.CELL_SIZE;
                const y = row * this.CELL_SIZE;
                
                if (this.board[row][col]) {
                    // Draw filled cell
                    this.ctx.fillStyle = this.pieceColors[this.board[row][col]];
                    this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                    
                    // Add highlight effect
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, 4);
                    
                    // Draw border
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                } else {
                    // Draw grid lines for empty cells
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                }
            }
        }
    }
    
    drawGhostPiece() {
        const ghostPiece = this.currentPiece.clone();
        
        // Find the lowest position
        const originalPiece = this.currentPiece;
        this.currentPiece = ghostPiece;
        
        while (this.canMovePiece(0, 1)) {
            ghostPiece.y++;
        }
        
        this.currentPiece = originalPiece;
        
        // Draw ghost piece
        const shape = ghostPiece.getCurrentShape();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = (ghostPiece.x + col) * this.CELL_SIZE;
                    const y = (ghostPiece.y + row) * this.CELL_SIZE;
                    this.ctx.strokeRect(x + 2, y + 2, this.CELL_SIZE - 4, this.CELL_SIZE - 4);
                }
            }
        }
    }
    
    drawPiece(piece) {
        const shape = piece.getCurrentShape();
        this.ctx.fillStyle = this.pieceColors[piece.type];
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = (piece.x + col) * this.CELL_SIZE;
                    const y = (piece.y + row) * this.CELL_SIZE;
                    
                    // Draw main piece
                    this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                    
                    // Add highlight effect
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, 6);
                    
                    // Reset fill style
                    this.ctx.fillStyle = this.pieceColors[piece.type];
                    
                    // Draw border
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                }
            }
        }
    }
}