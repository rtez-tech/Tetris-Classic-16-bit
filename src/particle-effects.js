class Particle {
    constructor(x, y, vx, vy, color, life = 1.0, size = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.gravity = 0.1;
        this.friction = 0.98;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.life -= 0.02;
        
        return this.life > 0;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class Spark extends Particle {
    constructor(x, y, vx, vy, color, life = 0.8) {
        super(x, y, vx, vy, color, life, 1);
        this.trail = [];
        this.maxTrailLength = 8;
    }
    
    update() {
        // Store previous position for trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        return super.update();
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const trailAlpha = alpha * (i / this.trail.length) * 0.5;
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = this.color;
            const size = this.size * (i / this.trail.length);
            const pos = this.trail[i];
            ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        }
        
        // Draw main particle
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class FloatingText {
    constructor(x, y, text, color = '#FFD700', size = 20) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.size = size;
        this.life = 2.0;
        this.maxLife = 2.0;
        this.vy = -1;
    }
    
    update() {
        this.y += this.vy;
        this.life -= 0.016; // ~60fps
        return this.life > 0;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.font = `bold ${this.size}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow/outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

class ParticleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.particles = [];
        this.sparks = [];
        this.texts = [];
        
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
        ];
    }
    
    createLineCllearEffect(x, y) {
        // Create explosion of particles
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, color, 1.5, 3));
        }
        
        // Create sparks
        for (let i = 0; i < 8; i++) {
            const vx = (Math.random() - 0.5) * 6;
            const vy = (Math.random() - 0.5) * 6;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.sparks.push(new Spark(x, y, vx, vy, color));
        }
    }
    
    createPiecePlacedEffect(x, y, color) {
        // Small particle burst when piece is placed
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 1;
            
            this.particles.push(new Particle(x, y, vx, vy, color, 0.8, 2));
        }
    }
    
    createScoreText(x, y, score) {
        let text = '';
        let color = '#FFD700';
        
        if (score >= 800) {
            text = 'TETRIS!';
            color = '#FF6B6B';
        } else if (score >= 500) {
            text = 'TRIPLE!';
            color = '#4ECDC4';
        } else if (score >= 300) {
            text = 'DOUBLE!';
            color = '#45B7D1';
        } else {
            text = `+${score}`;
        }
        
        this.texts.push(new FloatingText(x, y, text, color));
    }
    
    createLevelUpEffect(x, y) {
        // Big celebration effect
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const speed = 3 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, color, 2.0, 4));
        }
        
        this.texts.push(new FloatingText(x, y - 40, 'LEVEL UP!', '#FFD700', 24));
    }
    
    createGameOverEffect() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Rain of particles from top
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = -20;
            const vx = (Math.random() - 0.5) * 2;
            const vy = Math.random() * 3 + 1;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, color, 3.0, 3));
        }
    }
    
    update() {
        // Update and filter particles
        this.particles = this.particles.filter(particle => particle.update());
        this.sparks = this.sparks.filter(spark => spark.update());
        this.texts = this.texts.filter(text => text.update());
    }
    
    render(ctx) {
        // Render all particles
        this.particles.forEach(particle => particle.render(ctx));
        this.sparks.forEach(spark => spark.render(ctx));
        this.texts.forEach(text => text.render(ctx));
    }
    
    clear() {
        this.particles.length = 0;
        this.sparks.length = 0;
        this.texts.length = 0;
    }
    
    getParticleCount() {
        return this.particles.length + this.sparks.length + this.texts.length;
    }
}