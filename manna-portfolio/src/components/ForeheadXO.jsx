import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const ForeheadXO = ({ imageSrc = '/manna.jpeg' }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);

  const calculateWinner = useCallback((squares) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (!squares.includes(null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
  }, []);

  // Bot Logic
  const getBotMove = useCallback((squares) => {
    // 1. Try to win
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      const line = [squares[a], squares[b], squares[c]];
      if (line.filter(s => s === 'O').length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)];
      }
    }
    // 2. Block user
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      const line = [squares[a], squares[b], squares[c]];
      if (line.filter(s => s === 'X').length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)];
      }
    }
    // 3. Center if available
    if (squares[4] === null) return 4;
    // 4. Random
    const emptySquares = squares.map((s, i) => s === null ? i : null).filter(i => i !== null);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }, []);

  // Handle Bot Turn
  useEffect(() => {
    if (!isXNext && !winnerInfo) {
      const timer = setTimeout(() => {
        const move = getBotMove(board);
        if (move !== undefined) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          const win = calculateWinner(newBoard);
          if (win) setWinnerInfo(win);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winnerInfo, getBotMove, calculateWinner]);

  // Auto-reset after game end
  useEffect(() => {
    if (winnerInfo) {
      const timer = setTimeout(() => {
        resetGame();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [winnerInfo, resetGame]);

  const handleCellClick = (index) => {
    if (board[index] || winnerInfo || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const win = calculateWinner(newBoard);
    if (win) setWinnerInfo(win);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <motion.section
      id="play"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="section-wrapper relative z-10"
    >
      <div className="content-container flex flex-col items-center text-center gap-10">
        <div className="w-full text-left">
          <span className="block mb-4 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--text-muted)] font-sans">
            003 / PLAY
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[var(--pink-soft)]">
            A friendly challenge
          </h2>
          <p className="text-[0.9rem] text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
            I've placed a tiny board on my forehead. Beat the bot if you can.
          </p>
        </div>

        <div className="relative group max-w-[420px] w-full">
          {/* Main Image Container */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--border-glass)] glass shadow-[var(--shadow-card)] aspect-[4/5] sm:aspect-auto">
            <img
              src={imageSrc}
              alt="Manna"
              className="w-full h-auto object-contain block opacity-95 group-hover:opacity-100 transition-opacity duration-500"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
              }}
            />

            {/* Forehead Game Grid Overlay */}
            <div
              className="absolute top-[13%] left-[52%] -translate-x-1/2 
                         bg-black/25 backdrop-blur-sm 
                         border border-black/10 rounded-lg p-1
                         w-[75px] h-[75px] sm:w-[95px] sm:h-[95px] md:w-[110px] md:h-[110px]
                         grid grid-cols-3 grid-rows-3 gap-[1px] shadow-2xl transition-all duration-300"
            >
              {board.map((cell, index) => {
                const isWinningCell = winnerInfo?.line?.includes(index);
                return (
                  <motion.div
                    key={index}
                    whileTap={!cell && !winnerInfo && isXNext ? { scale: 0.9 } : {}}
                    onClick={() => handleCellClick(index)}
                    className={`
                      flex items-center justify-center overflow-hidden
                      border border-white/5 rounded-sm cursor-pointer
                      text-lg sm:text-x[22px] font-bold font-mono transition-colors
                      ${!cell && !winnerInfo && isXNext ? 'hover:bg-white/5' : ''}
                      ${isWinningCell ? 'bg-[var(--pink-soft)]/10 z-10' : ''}
                    `}
                    style={{
                      color: cell === 'X' ? 'var(--pink-mid)' : 'var(--pink-soft)',
                      boxShadow: isWinningCell ? 'inset 0 0 10px rgba(255, 182, 193, 0.4)' : 'none'
                    }}
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Game Result Message */}
          <div className="mt-8 h-10 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {winnerInfo ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-white font-medium tracking-wide flex items-center gap-2"
                >
                  {winnerInfo.winner === 'X' && (
                    <span className="flex items-center gap-2"><span className="text-[var(--pink-soft)]">FOR WHAT JOY</span></span>
                  )}
                  {winnerInfo.winner === 'O' && (
                    <span className="text-[var(--text-muted)]">PODA PATTI</span>
                  )}
                  {winnerInfo.winner === 'Draw' && (
                    <span className="text-[var(--text-muted)]">LDF varum ellam sheri aakum</span>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="turn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="text-[0.75rem] uppercase tracking-widest text-[var(--text-muted)]"
                >
                  {isXNext ? "Your turn (X)" : "Bot thinking..."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ForeheadXO;
