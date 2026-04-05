import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function GamePage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  let confettiAnimationId = useRef(null);

  // --- Game State ---
  const [step, setStep] = useState('mode'); // mode, grid, difficulty, series, names, playing
  const [mode, setMode] = useState(null); // 'pvp' or 'ai'
  const [gridSize, setGridSize] = useState(3);
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'
  const [seriesTarget, setSeriesTarget] = useState(1);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [running, setRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Player X's Turn");
  const [statusColor, setStatusColor] = useState("#5A189A");
  
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [winningCondition, setWinningCondition] = useState(null);
  
  // Pulse animation states
  const [pulseX, setPulseX] = useState(false);
  const [pulseO, setPulseO] = useState(false);
  const [shakeCell, setShakeCell] = useState(null);

  // --- Fullscreen Effect ---
  useEffect(() => {
    document.body.classList.add('fullscreen-mode');
    return () => {
      document.body.classList.remove('fullscreen-mode');
      stopConfetti();
    };
  }, []);

  // --- Win Condition Generator ---
  const getWinConditions = useCallback((size) => {
    const conditions = [];
    for (let row = 0; row < size; row++) {
      const rowCond = [];
      for (let col = 0; col < size; col++) rowCond.push(row * size + col);
      conditions.push(rowCond);
    }
    for (let col = 0; col < size; col++) {
      const colCond = [];
      for (let row = 0; row < size; row++) colCond.push(row * size + col);
      conditions.push(colCond);
    }
    const diag1 = [];
    for (let i = 0; i < size; i++) diag1.push(i * size + i);
    conditions.push(diag1);
    
    const diag2 = [];
    for (let i = 0; i < size; i++) diag2.push(i * size + (size - 1 - i));
    conditions.push(diag2);
    
    return conditions;
  }, []);

  // --- Core Game Logic ---
  const checkWinner = useCallback((currentBoard, currentTurn) => {
    const conditions = getWinConditions(gridSize);
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      const allFilled = condition.every(index => currentBoard[index] !== "");
      if (!allFilled) continue;
      
      const firstCell = currentBoard[condition[0]];
      const allSame = condition.every(index => currentBoard[index] === firstCell);
      if (allSame) return { won: true, condition, winner: firstCell };
    }
    if (!currentBoard.includes("")) return { draw: true };
    return null;
  }, [gridSize, getWinConditions]);

  const handleWin = useCallback((winner, condition) => {
    setRunning(false);
    setWinningCondition(condition);
    const winnerName = winner === 'X' ? player1Name : player2Name;
    
    setStatusMessage(`${winnerName} Wins!`);
    setStatusColor("#9D4EDD");
    
    if (winner === "X") {
      setXWins(prev => prev + 1);
      setPulseX(true);
      setTimeout(() => setPulseX(false), 600);
    } else {
      setOWins(prev => prev + 1);
      setPulseO(true);
      setTimeout(() => setPulseO(false), 600);
    }
    
    triggerConfetti();
    
    // Add History
    const timestamp = new Date().toLocaleTimeString();
    setGameHistory(prev => [{
      winner: winnerName,
      result: 'win',
      timestamp,
      score: `${winner === 'X' ? xWins + 1 : xWins}-${winner === 'O' ? oWins + 1 : oWins}`
    }, ...prev]);

    // Check Series Winner
    const targetWins = Math.ceil(seriesTarget / 2);
    if ((winner === 'X' && xWins + 1 >= targetWins) || (winner === 'O' && oWins + 1 >= targetWins)) {
      setTimeout(() => alert(`🏆 ${winnerName} wins the series!`), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1Name, player2Name, seriesTarget, xWins, oWins]);

  const handleDraw = useCallback(() => {
    setRunning(false);
    setStatusMessage(`It's a Draw!`);
    setStatusColor("#FFA500");
    const timestamp = new Date().toLocaleTimeString();
    setGameHistory(prev => [{ winner: 'Draw', result: 'draw', timestamp, score: `${xWins}-${oWins}` }, ...prev]);
  }, [xWins, oWins]);

  const handleCellClick = (index) => {
    if (board[index] !== "" || !running) {
      setShakeCell(index);
      setTimeout(() => setShakeCell(null), 500);
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, currentPlayer);
    if (result?.won) {
      handleWin(result.winner, result.condition);
    } else if (result?.draw) {
      handleDraw();
    } else {
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      setStatusMessage(`${nextPlayer === 'X' ? player1Name : player2Name}'s Turn`);
    }
  };

  // --- AI Logic ---
  const makeAIMove = useCallback(() => {
    if (!running) return;
    
    const availableCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (availableCells.length === 0) return;

    let move = null;
    const getRandomMove = () => availableCells[Math.floor(Math.random() * availableCells.length)];
    
    const getBestMove = () => {
      // 1. Check win
      for (let i of availableCells) {
        const testBoard = [...board];
        testBoard[i] = "O";
        if (checkWinner(testBoard, "O")?.won) return i;
      }
      // 2. Block
      for (let i of availableCells) {
        const testBoard = [...board];
        testBoard[i] = "X";
        if (checkWinner(testBoard, "X")?.won) return i;
      }
      // 3. Center
      if (gridSize % 2 === 1) {
        const center = Math.floor((gridSize * gridSize) / 2);
        if (board[center] === "") return center;
      }
      // 4. Corners
      const corners = [0, gridSize - 1, (gridSize * gridSize) - gridSize, (gridSize * gridSize) - 1];
      const availCorners = corners.filter(i => board[i] === "");
      if (availCorners.length > 0) return availCorners[Math.floor(Math.random() * availCorners.length)];
      // 5. Random
      return getRandomMove();
    };

    if (difficulty === 'easy') move = getRandomMove();
    else if (difficulty === 'medium') move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
    else move = getBestMove();

    if (move !== null) handleCellClick(move);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, running, difficulty, gridSize, checkWinner]);

  useEffect(() => {
    if (step === 'playing' && running && mode === 'ai' && currentPlayer === 'O') {
      const timer = setTimeout(makeAIMove, 600);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, running, step, mode, makeAIMove]);

  // --- Game Flow Handlers ---
  const startGame = () => {
    setBoard(Array(gridSize * gridSize).fill(''));
    setWinningCondition(null);
    setCurrentPlayer('X');
    setRunning(true);
    setStatusMessage(`${player1Name}'s Turn`);
    setStatusColor("#5A189A");
    setStep('playing');
  };

  const restartRound = () => {
    stopConfetti();
    setBoard(Array(gridSize * gridSize).fill(''));
    setWinningCondition(null);
    setCurrentPlayer('X');
    setRunning(true);
    setStatusMessage(`${player1Name}'s Turn`);
    setStatusColor("#5A189A");
  };

  const newGame = () => {
    stopConfetti();
    setStep('mode');
    setXWins(0);
    setOWins(0);
    setGameHistory([]);
    setBoard(Array(9).fill(''));
  };

  // --- Confetti Logic ---
  const stopConfetti = () => {
    if (confettiAnimationId.current) {
      cancelAnimationFrame(confettiAnimationId.current);
      confettiAnimationId.current = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.style.display = 'none';
    }
  };

  const triggerConfetti = () => {
    stopConfetti();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    const particles = [];
    const colors = ['#9D4EDD', '#C77DFF', '#E0AAFF', '#3498db', '#e91e63', '#FFA500'];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 2,
        d: Math.random() * 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let remaining = 0;
      for (let i = 0; i < 150; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
        if (p.y <= canvas.height) remaining++;
      }
      if (remaining > 0) confettiAnimationId.current = requestAnimationFrame(draw);
      else {
        canvas.style.display = 'none';
        confettiAnimationId.current = null;
      }
    };
    draw();
  };

  // --- UI Helpers ---
  const getLineCoordinates = () => {
    if (!winningCondition) return { display: 'none' };
    const startIdx = winningCondition[0];
    const endIdx = winningCondition[winningCondition.length - 1];
    
    const startRow = Math.floor(startIdx / gridSize);
    const startCol = startIdx % gridSize;
    const endRow = Math.floor(endIdx / gridSize);
    const endCol = endIdx % gridSize;

    // Calculate percentage based on grid size
    const cellPct = 100 / gridSize;
    const x1 = (startCol * cellPct) + (cellPct / 2);
    const y1 = (startRow * cellPct) + (cellPct / 2);
    const x2 = (endCol * cellPct) + (cellPct / 2);
    const y2 = (endRow * cellPct) + (cellPct / 2);

    return {
      x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%`, display: 'block'
    };
  };

  return (
    <div className="fullscreen-overlay active" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="fullscreen-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="fullscreen-content">
        <canvas id="confetti-canvas" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, display: 'none' }}></canvas>

        <section className="game-container">
          <div className="container game-layout">
            
            {/* Sidebar History */}
            <div className="game-history">
              <h3>Match History</h3>
              <div className="history-list">
                {gameHistory.length === 0 ? (
                  <p className="empty-history">No games played yet</p>
                ) : (
                  gameHistory.slice(0, 10).map((item, idx) => (
                    <div key={idx} className={`history-item ${item.result}`}>
                      <div className="history-header">
                        <span className="history-number">#{gameHistory.length - idx}</span>
                        <span className="history-time">{item.timestamp}</span>
                      </div>
                      <div className="history-result">
                        {item.result === 'win' ? `🏆 ${item.winner}` : '🤝 Draw'}
                      </div>
                      <div className="history-score">{item.score}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Main Game Area */}
            <div className="game-main">
              <h2 className="game-title">Tic-Tac-Toe</h2>

              {/* Mode Selection */}
              {step === 'mode' && (
                <div className="mode-selection">
                  <h3>Select Game Mode</h3>
                  <div className="mode-buttons">
                    <button className="mode-btn" onClick={() => { setMode('pvp'); setStep('grid'); }}>
                      <span className="mode-icon">👥</span><span>Player vs Player</span>
                    </button>
                    <button className="mode-btn" onClick={() => { setMode('ai'); setStep('grid'); }}>
                      <span className="mode-icon">🤖</span><span>Player vs AI</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Selection */}
              {step === 'grid' && (
                <div className="grid-selection">
                  <h3>Select Grid Size</h3>
                  <div className="grid-buttons">
                    {[3, 4, 5].map(size => (
                      <button key={size} className="grid-btn" onClick={() => { 
                        setGridSize(size); 
                        setStep(mode === 'ai' ? 'difficulty' : 'series'); 
                      }}>
                        <span className={`grid-visual ${size === 4 ? 'grid-4x4' : size === 5 ? 'grid-5x5' : ''}`}>
                          {Array(size * size).fill(0).map((_, i) => <span key={i} className="grid-cell"></span>)}
                        </span>
                        <span className="grid-label">{size}x{size} {size===3?'Classic':size===4?'Advanced':'Expert'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Selection */}
              {step === 'difficulty' && (
                <div className="difficulty-selection">
                  <h3>Select Difficulty</h3>
                  <div className="difficulty-buttons">
                    {['easy', 'medium', 'hard'].map(diff => (
                      <button key={diff} className="difficulty-btn" style={{textTransform: 'capitalize'}} onClick={() => { setDifficulty(diff); setStep('series'); }}>{diff}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Series Setup */}
              {step === 'series' && (
                <div className="series-setup">
                  <h3>Game Series</h3>
                  <div className="series-options">
                    {[1, 3, 5, 7].map(num => (
                      <button key={num} className="series-btn" onClick={() => { 
                        setSeriesTarget(num); 
                        if (mode === 'ai') setPlayer2Name('AI');
                        setStep('names'); 
                      }}>
                        {num === 1 ? 'Single Game' : `Best of ${num}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name Setup */}
              {step === 'names' && (
                <div className="name-setup">
                  <h3>Enter Player Names</h3>
                  <div className="name-inputs">
                    <div className="name-input-group">
                      <label>Player 1 (X)</label>
                      <input type="text" value={player1Name} onChange={e => setPlayer1Name(e.target.value)} maxLength="12" />
                    </div>
                    <div className="name-input-group">
                      <label>Player 2 (O)</label>
                      <input type="text" value={player2Name} onChange={e => setPlayer2Name(e.target.value)} maxLength="12" disabled={mode === 'ai'} />
                    </div>
                  </div>
                  <button className="btn start-game-btn" onClick={startGame}>Start Game</button>
                </div>
              )}

              {/* Game Board */}
              {step === 'playing' && (
                <div className="game-board">
                  {seriesTarget > 1 && (
                    <div className="series-progress">
                      <p>Series: First to <span>{Math.ceil(seriesTarget / 2)}</span> wins</p>
                    </div>
                  )}

                  <div className="scoreboard">
                    <div className={`score-box player1-score ${pulseX ? 'score-pulse' : ''}`}>
                      <p>{player1Name}</p>
                      <span>{xWins}</span>
                    </div>
                    <div className={`score-box player2-score ${pulseO ? 'score-pulse' : ''}`}>
                      <p>{player2Name}</p>
                      <span>{oWins}</span>
                    </div>
                  </div>

                  <p id="statusText" style={{ color: statusColor }}>{statusMessage}</p>
                  
                  {/* Grid Container */}
                  <div id="cellContainer" className={`grid-${gridSize}x${gridSize}`} style={{ position: 'relative' }}>
                    
                    {/* SVG Winning Line (Rendered Conditionally) */}
                    <svg className={`winning-line ${winningCondition ? 'active' : ''}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                       {winningCondition && <line id="winLine" {...getLineCoordinates()} stroke="#9D4EDD" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 10px #9D4EDD)" />}
                    </svg>

                    {/* Cells */}
                    {board.map((cellValue, idx) => {
                      const isWinner = winningCondition?.includes(idx);
                      return (
                        <div 
                          key={idx} 
                          className={`cell ${cellValue ? 'placed' : ''} ${shakeCell === idx ? 'shake' : ''} ${isWinner ? 'winner-glow' : ''}`}
                          style={{ color: cellValue === 'X' ? '#3498db' : '#e91e63' }}
                          onClick={() => handleCellClick(idx)}
                        >
                          {cellValue}
                        </div>
                      )
                    })}
                  </div>

                  <div className="game-controls">
                    <button className="btn" onClick={restartRound}>Restart Round</button>
                    <button className="btn secondary-btn" onClick={newGame}>New Game</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GamePage;