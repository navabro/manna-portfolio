import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const STICKER_SEQUENCE = [
  '/manna-sticker.jpeg',
  '/manna-sticker 2.jpeg',
  '/manna-sticker 3.jpeg',
];

const ForeheadXO = ({ imageSrc = '/manna.jpeg', onStickerUnlock }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [currentStickerIndex, setCurrentStickerIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
    setShowWinMessage(false);
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

  // Win reward: unlock sticker + show message
  useEffect(() => {
    if (winnerInfo?.winner === 'X') {
      setShowWinMessage(true);

      // Update sticker index (no looping, cap at max)
      setCurrentStickerIndex(prev => Math.min(prev + 1, STICKER_SEQUENCE.length));
      setIsVisible(true);

      if (typeof onStickerUnlock === 'function') {
        onStickerUnlock();
      }
    }
  }, [winnerInfo, onStickerUnlock]);

  // Sticker visibility timer (1 minute)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Auto-reset after game end
  useEffect(() => {
    if (winnerInfo) {
      const resetDelay = winnerInfo.winner === 'X' ? 2000 : 2500;
      const timer = setTimeout(() => {
        resetGame();
      }, resetDelay);
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

  const handleDownload = () => {
    if (currentStickerIndex === 0) return;
    const path = STICKER_SEQUENCE[currentStickerIndex - 1];
    const link = document.createElement('a');
    link.href = path;
    link.download = `manna-sticker-${currentStickerIndex}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="mt-8 min-h-[2.5rem] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {winnerInfo ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-white font-medium tracking-wide flex flex-col items-center gap-1"
                >
                  {winnerInfo.winner === 'X' && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="text-[var(--pink-soft)] text-sm font-semibold tracking-wide"
                      >
                        🎉 You unlocked a sticker 🎉
                      </motion.span>
                    </>
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

          {/* Reward Notification */}
          <AnimatePresence>
            {isVisible && currentStickerIndex > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
                className="mt-12 w-full pt-8 border-t border-[var(--border-glass)] flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 rounded-2xl glass border border-[var(--border-glass)] p-2 mb-4"
                >
                  <img
                    src={STICKER_SEQUENCE[currentStickerIndex - 1]}
                    alt={`Sticker ${currentStickerIndex}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="mt-10 sm:mt-12 px-7 py-3 rounded-full bg-[var(--pink-mid)] text-white font-semibold text-base shadow-lg hover:bg-[var(--pink-accent)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.766-5.764-5.766zm3.392 8.221c-.142.399-.715.762-1.205.814-.421.044-.966.185-2.827-.543-2.313-.905-3.805-3.245-3.921-3.4-.116-.156-.948-1.259-.948-2.401 0-1.141.6-1.701.814-1.933.214-.232.464-.291.62-.291.155 0 .311.001.446.006.141.006.333-.053.52.404.188.457.643 1.564.7 1.68.058.116.096.251.019.404-.078.153-.117.247-.232.38l-.35.404c-.114.133-.24.278-.103.513.138.235.611.999 1.309 1.62.898.799 1.657 1.046 1.892 1.163.235.117.373.097.513-.065.14-.162.597-.695.756-.93.159-.236.319-.199.54-.116l1.714.808c.221.107.368.161.42.249.053.088.053.513-.089.912z" />
                  </svg>
                  Add to WhatsApp
                </motion.button>

                <p className="mt-4 text-[0.7rem] text-[var(--text-muted)] tracking-wide font-sans">
                  Available for a short time ⏳
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default ForeheadXO;
