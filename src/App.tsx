import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = '/src/tetris-pieces.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = '/src/particle-effects.js';
    script2.async = true;
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = '/src/audio-manager.js';
    script3.async = true;
    document.body.appendChild(script3);

    const script4 = document.createElement('script');
    script4.src = '/src/game-engine.js';
    script4.async = true;
    document.body.appendChild(script4);

    const script5 = document.createElement('script');
    script5.src = '/src/main.js';
    script5.async = true;
    document.body.appendChild(script5);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
      document.body.removeChild(script4);
      document.body.removeChild(script5);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #001d4a 0%, #003d82 50%, #db0a30 100%)' }}>
      <div className="game-container" style={{
        background: 'rgba(0, 29, 74, 0.95)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '4px solid #db0a30',
        maxWidth: '800px',
        width: '100%',
        margin: '20px auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #db0a30, #003d82, #0066cc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px'
        }}>🎮 Retro Block Adventure 🎮</h1>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative' }}>
            <canvas id="gameCanvas" width="400" height="800" style={{
              border: '3px solid #db0a30',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(219, 10, 48, 0.3)',
              background: '#001d4a'
            }}></canvas>
            <div id="gameOver" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 29, 74, 0.95)',
              color: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              border: '3px solid #db0a30',
              display: 'none'
            }}>
              <h2 style={{ color: '#db0a30', marginBottom: '15px', fontSize: '2rem' }}>Game Over!</h2>
              <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Final Score: <span id="finalScore">0</span></p>
              <button style={{
                padding: '12px 24px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #db0a30 0%, #003d82 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(219, 10, 48, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }} onClick={() => (window as any).game?.restart()}>Play Again</button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            minWidth: '200px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
              padding: '15px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              border: '2px solid #db0a30'
            }}>
              <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff' }}>Score</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#db0a30' }} id="scoreDisplay">0</div>

              <h3 style={{ marginTop: '15px', marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff' }}>Level</h3>
              <div style={{ fontSize: '1.3rem', color: '#ffeb3b' }} id="levelDisplay">1</div>

              <h3 style={{ marginTop: '15px', marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff' }}>Lines</h3>
              <div style={{ fontSize: '1.3rem', color: '#ffeb3b' }} id="linesDisplay">0</div>

              <h3 style={{ marginTop: '15px', marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff' }}>Next Piece</h3>
              <canvas id="nextPieceCanvas" width="120" height="120" style={{
                border: '2px solid #db0a30',
                borderRadius: '5px',
                background: '#001d4a',
                margin: '10px auto',
                display: 'block'
              }}></canvas>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #001d4a 0%, #003d82 100%)',
              padding: '15px',
              borderRadius: '10px',
              color: 'white',
              border: '2px solid #db0a30'
            }}>
              <h3 style={{ marginBottom: '10px', color: '#ffffff' }}>Controls</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Move Left</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>A / ←</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Move Right</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>D / →</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Rotate</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>W / ↑</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Soft Drop</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>S / ↓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Hard Drop</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>Space</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontSize: '0.9rem' }}>
                <span>Hold Piece</span>
                <span style={{ background: 'rgba(219, 10, 48, 0.3)', padding: '2px 6px', borderRadius: '3px' }}>C</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <button style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #db0a30 0%, #003d82 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(219, 10, 48, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }} id="startBtn" onClick={() => (window as any).game?.start()}>Start Game</button>
          <button style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0, 61, 130, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }} id="pauseBtn" onClick={() => (window as any).game?.togglePause()}>Pause</button>
        </div>

        <div className="mobile-controls" id="mobileControls" style={{
          display: 'none',
          marginTop: '20px',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxWidth: '300px',
          margin: '20px auto 0'
        }}>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('rotate')}>↻</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('up')}>↑</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('hold')}>Hold</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('left')}>←</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('down')}>↓</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #003d82 0%, #0066cc 100%)',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('right')}>→</button>
          <button style={{
            padding: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #db0a30 0%, #003d82 100%)',
            color: 'white',
            cursor: 'pointer',
            gridColumn: 'span 3',
            userSelect: 'none'
          }} onPointerDown={() => (window as any).game?.handleMobileControl('drop')}>Hard Drop</button>
        </div>
      </div>
    </div>
  );
}

export default App;
