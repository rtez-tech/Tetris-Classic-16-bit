class TetrisPiece {
    constructor(type) {
        this.types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        this.type = type || this.types[Math.floor(Math.random() * this.types.length)];
        this.x = Math.floor(10 / 2) - 2; // Center horizontally
        this.y = 0;
        this.rotation = 0;
        
        this.shapes = {
            'I': [
                [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
                [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
                [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
                [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
            ],
            'O': [
                [[1, 1], [1, 1]],
                [[1, 1], [1, 1]],
                [[1, 1], [1, 1]],
                [[1, 1], [1, 1]]
            ],
            'T': [
                [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
                [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
                [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
                [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
            ],
            'S': [
                [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
                [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
                [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
                [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
            ],
            'Z': [
                [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
                [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
                [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
                [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
            ],
            'J': [
                [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
                [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
                [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
                [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
            ],
            'L': [
                [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
                [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
                [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
                [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
            ]
        };
    }
    
    getCurrentShape() {
        return this.shapes[this.type][this.rotation];
    }
    
    rotate() {
        this.rotation = (this.rotation + 1) % 4;
    }
    
    clone() {
        const newPiece = new TetrisPiece(this.type);
        newPiece.x = this.x;
        newPiece.y = this.y;
        newPiece.rotation = this.rotation;
        return newPiece;
    }
    
    // Get the bounding box of the current piece
    getBounds() {
        const shape = this.getCurrentShape();
        let minX = shape[0].length;
        let maxX = -1;
        let minY = shape.length;
        let maxY = -1;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    minX = Math.min(minX, col);
                    maxX = Math.max(maxX, col);
                    minY = Math.min(minY, row);
                    maxY = Math.max(maxY, row);
                }
            }
        }
        
        return {
            left: minX,
            right: maxX,
            top: minY,
            bottom: maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }
    
    // Get all filled positions relative to piece position
    getFilledPositions() {
        const positions = [];
        const shape = this.getCurrentShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    positions.push({
                        x: this.x + col,
                        y: this.y + row
                    });
                }
            }
        }
        
        return positions;
    }
    
    // Kick data for SRS (Super Rotation System)
    getKickData(fromRotation, toRotation) {
        // Basic kick tests - can be expanded for more sophisticated SRS
        const kickTests = [
            [0, 0],   // No kick
            [-1, 0],  // Left
            [1, 0],   // Right
            [0, -1],  // Up
            [-1, -1], // Up-left
            [1, -1]   // Up-right
        ];
        
        return kickTests;
    }
    
    // Check if piece can be placed at specific position
    canPlaceAt(x, y, rotation, board, boardWidth, boardHeight) {
        const originalX = this.x;
        const originalY = this.y;
        const originalRotation = this.rotation;
        
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        
        const shape = this.getCurrentShape();
        let canPlace = true;
        
        for (let row = 0; row < shape.length && canPlace; row++) {
            for (let col = 0; col < shape[row].length && canPlace; col++) {
                if (shape[row][col]) {
                    const boardX = this.x + col;
                    const boardY = this.y + row;
                    
                    if (boardX < 0 || boardX >= boardWidth ||
                        boardY >= boardHeight ||
                        (boardY >= 0 && board[boardY][boardX])) {
                        canPlace = false;
                    }
                }
            }
        }
        
        // Restore original position
        this.x = originalX;
        this.y = originalY;
        this.rotation = originalRotation;
        
        return canPlace;
    }
}

// Piece bag system for more fair piece distribution
class PieceBag {
    constructor() {
        this.bag = [];
        this.refillBag();
    }
    
    refillBag() {
        const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        this.bag = [...pieces];
        
        // Fisher-Yates shuffle
        for (let i = this.bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }
    
    getNext() {
        if (this.bag.length === 0) {
            this.refillBag();
        }
        
        return new TetrisPiece(this.bag.pop());
    }
}