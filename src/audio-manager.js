class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.enabled = true;
        
        this.initializeAudioContext();
        this.generateSounds();
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    generateSounds() {
        if (!this.enabled) return;
        
        // Generate sound effects using oscillators
        this.sounds = {
            move: this.createTone(200, 0.1, 'square', 0.1),
            rotate: this.createTone(300, 0.15, 'triangle', 0.15),
            piecePlaced: this.createTone(150, 0.2, 'sawtooth', 0.2),
            lineClear: this.createChord([400, 500, 600], 0.3, 'sine', 0.3),
            tetris: this.createChord([400, 500, 600, 800], 0.5, 'triangle', 0.4),
            levelUp: this.createArpeggio([400, 500, 600, 800, 1000], 0.8, 'sine', 0.3),
            gameOver: this.createDescendingTone(300, 100, 1.0, 'sawtooth', 0.4),
            gameStart: this.createAscendingTone(200, 400, 0.6, 'triangle', 0.3),
            hardDrop: this.createTone(100, 0.3, 'square', 0.25),
            hold: this.createTone(450, 0.12, 'sine', 0.15)
        };
    }
    
    createTone(frequency, duration, waveType = 'sine', volume = 0.3) {
        return {
            type: 'tone',
            frequency,
            duration,
            waveType,
            volume
        };
    }
    
    createChord(frequencies, duration, waveType = 'sine', volume = 0.3) {
        return {
            type: 'chord',
            frequencies,
            duration,
            waveType,
            volume
        };
    }
    
    createArpeggio(frequencies, duration, waveType = 'sine', volume = 0.3) {
        return {
            type: 'arpeggio',
            frequencies,
            duration,
            waveType,
            volume
        };
    }
    
    createAscendingTone(startFreq, endFreq, duration, waveType = 'sine', volume = 0.3) {
        return {
            type: 'sweep',
            startFreq,
            endFreq,
            duration,
            waveType,
            volume,
            direction: 'up'
        };
    }
    
    createDescendingTone(startFreq, endFreq, duration, waveType = 'sine', volume = 0.3) {
        return {
            type: 'sweep',
            startFreq,
            endFreq,
            duration,
            waveType,
            volume,
            direction: 'down'
        };
    }
    
    playSound(soundName) {
        if (!this.enabled || !this.audioContext || !this.sounds[soundName]) {
            return;
        }
        
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const sound = this.sounds[soundName];
        const now = this.audioContext.currentTime;
        
        switch (sound.type) {
            case 'tone':
                this.playTone(sound, now);
                break;
            case 'chord':
                this.playChord(sound, now);
                break;
            case 'arpeggio':
                this.playArpeggio(sound, now);
                break;
            case 'sweep':
                this.playSweep(sound, now);
                break;
        }
    }
    
    playTone(sound, startTime) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = sound.waveType;
        oscillator.frequency.setValueAtTime(sound.frequency, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(sound.volume * this.sfxVolume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + sound.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + sound.duration);
    }
    
    playChord(sound, startTime) {
        sound.frequencies.forEach(frequency => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = sound.waveType;
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            const volume = (sound.volume * this.sfxVolume) / sound.frequencies.length;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + sound.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + sound.duration);
        });
    }
    
    playArpeggio(sound, startTime) {
        const noteInterval = sound.duration / sound.frequencies.length;
        
        sound.frequencies.forEach((frequency, index) => {
            const noteStartTime = startTime + (index * noteInterval * 0.8);
            const noteDuration = noteInterval * 1.2;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = sound.waveType;
            oscillator.frequency.setValueAtTime(frequency, noteStartTime);
            
            gainNode.gain.setValueAtTime(0, noteStartTime);
            gainNode.gain.linearRampToValueAtTime(sound.volume * this.sfxVolume, noteStartTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + noteDuration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(noteStartTime);
            oscillator.stop(noteStartTime + noteDuration);
        });
    }
    
    playSweep(sound, startTime) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = sound.waveType;
        oscillator.frequency.setValueAtTime(sound.startFreq, startTime);
        oscillator.frequency.linearRampToValueAtTime(sound.endFreq, startTime + sound.duration);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(sound.volume * this.sfxVolume, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + sound.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + sound.duration);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleEnabled() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    // Create background music (simple loop)
    playBackgroundMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        // Simple melodic loop inspired by retro games
        const melody = [
            { freq: 330, duration: 0.5 }, // E4
            { freq: 294, duration: 0.5 }, // D4
            { freq: 330, duration: 0.5 }, // E4
            { freq: 370, duration: 0.5 }, // F#4
            { freq: 440, duration: 1.0 }, // A4
            { freq: 370, duration: 0.5 }, // F#4
            { freq: 330, duration: 0.5 }, // E4
            { freq: 294, duration: 1.0 }, // D4
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        melody.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.1, currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Loop the music
        setTimeout(() => {
            if (this.enabled) {
                this.playBackgroundMusic();
            }
        }, currentTime * 1000 - Date.now());
    }
}