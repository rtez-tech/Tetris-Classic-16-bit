# 🎮 Retro Block Adventure - Tetris

A modern take on the classic Tetris game with retro-inspired visual and audio elements reminiscent of classic games. Built with vanilla JavaScript, HTML5 Canvas, and Web Audio API.
See an example of game:
https://tetris-game-with-mar-hksp.bolt.host
https://stylized-tetris-adventure.rork.app
## 🎯 Features

### Core Gameplay
- **Classic Tetris Mechanics**: All 7 standard tetromino pieces (I, O, T, S, Z, J, L)
- **Progressive Difficulty**: Increasing fall speed as you advance through levels
- **Line Clearing**: Traditional line clearing with combo scoring
- **Hold System**: Hold a piece for strategic play
- **Ghost Piece**: Preview where your piece will land
- **Next Piece Preview**: See what's coming next

### Visual Elements
- **Retro Pixel Art Style**: Inspired by classic 16-bit platformer aesthetics
- **Particle Effects**: Satisfying visual feedback for line clears and combos
- **Gradient Backgrounds**: Beautiful color transitions reminiscent of classic games
- **Smooth Animations**: Polished micro-interactions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Audio Design
- **Original Sound Effects**: Procedurally generated retro-style sounds using Web Audio API
- **Dynamic Audio**: Different sounds for moves, rotations, line clears, and special events
- **No Copyright Issues**: All audio is generated in real-time, completely original

### Controls
- **Keyboard Support** (Desktop):
  - `A` / `←`: Move left
  - `D` / `→`: Move right
  - `S` / `↓`: Soft drop
  - `W` / `↑`: Rotate piece
  - `Space`: Hard drop
  - `C`: Hold piece

- **Touch Controls** (Mobile):
  - Tap to rotate
  - Swipe left/right to move
  - Swipe down for hard drop
  - Swipe up to hold piece
  - On-screen control buttons

## 🚀 Getting Started

### Running the Game
1. Open `index.html` in a modern web browser
2. Click "Start Game" to begin playing
3. Use keyboard controls (desktop) or touch controls (mobile)

### Browser Requirements
- Modern browser with HTML5 Canvas support
- Web Audio API support (for sound effects)
- ES6+ JavaScript support

## 🎨 Design Philosophy

This game combines the timeless gameplay of Tetris with visual and audio elements inspired by classic platformer games like Mario and Sonic, while using completely original assets to avoid copyright issues.

### Visual Inspiration
- Bright, cheerful color palettes
- Smooth gradients and transitions
- Pixel-perfect sprite-like elements
- Playful UI design

### Audio Inspiration  
- Retro chiptune-style sound effects
- Satisfying audio feedback
- Progressive audio complexity
- Classic arcade game feel

## 📁 Project Structure

```
/
├── index.html              # Main game page with UI
├── src/
│   ├── game-engine.js      # Core game logic and rendering
│   ├── tetris-pieces.js    # Tetromino definitions and logic
│   ├── audio-manager.js    # Sound generation and management
│   ├── particle-effects.js # Visual effects and animations
│   └── main.js             # Game initialization and controls
└── README.md               # This file
```

## 🎪 Special Features

### Particle System
- Dynamic particle effects for line clears
- Floating score text
- Celebration effects for achievements
- Smooth animation system

### Audio System
- Procedural sound generation
- No external audio files required
- Real-time audio synthesis
- Customizable volume controls

### Mobile Optimization
- Touch gesture recognition
- Responsive layout
- On-screen control buttons
- Optimized performance

## 🏆 Scoring System

- **Single Line**: 100 × level
- **Double Lines**: 300 × level  
- **Triple Lines**: 500 × level
- **Tetris (4 lines)**: 800 × level
- **Soft Drop**: 1 point per cell
- **Hard Drop**: 2 points per cell

## 🎲 Easter Eggs

Try entering the famous Konami Code: ↑↑↓↓←→←→BA

## 🔧 Technical Details

### Performance
- 60 FPS gameplay
- Efficient canvas rendering
- Optimized particle system
- Memory-conscious design

### Compatibility
- Works on all modern browsers
- Mobile-first responsive design
- Progressive enhancement
- Graceful audio fallbacks

## 🎯 Future Enhancements

Potential improvements for future versions:
- Multiple game modes
- Local high score storage
- More particle effects
- Additional visual themes
- Multiplayer support

## 🎮 Controls Reference

### Desktop
| Action | Keys |
|--------|------|
| Move Left | A, ← |
| Move Right | D, → |
| Soft Drop | S, ↓ |
| Rotate | W, ↑ |
| Hard Drop | Space |
| Hold Piece | C |
| Pause | Pause Button |

### Mobile
- **Tap**: Rotate piece
- **Swipe Left/Right**: Move piece
- **Swipe Down**: Hard drop
- **Swipe Up**: Hold piece
- **Control Buttons**: Available on screen

## 🔊 Audio Credits

All audio effects are generated procedurally using the Web Audio API. No external audio files or copyrighted material is used.

---

**Enjoy playing Retro Block Adventure!** 🎊

*Created with vanilla JavaScript, HTML5 Canvas, and Web Audio API*
