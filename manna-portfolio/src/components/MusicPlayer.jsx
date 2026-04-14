import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio error:', e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, '0')
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      if (!isPlaying) setIsPlaying(true)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isExpanded && !isPlaying) setIsExpanded(true)
    else if (isExpanded && isPlaying) setIsExpanded(false)
  }

  return (
    <div 
      className="fixed z-[9999] bottom-[1.25rem] right-[1.25rem] w-auto max-w-[360px] md:max-w-none md:w-auto"
      style={{
        width: 'calc(100% - 2rem)',
        '@media (max-width: 768px)': {
          right: '50%',
          transform: 'translateX(50%)'
        }
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .music-player-container {
            right: 50% !important;
            transform: translateX(50%) !important;
            width: calc(100% - 2.5rem) !important;
            max-width: 360px !important;
          }
          .music-player-expanded {
            width: 100% !important;
            left: 0 !important;
          }
          .music-player-pill {
            width: 100% !important;
          }
        }
        @keyframes eq-bounce {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>
      
      {/* Outer wrapper applying media queries */}
      <div className="music-player-container fixed bottom-[1.25rem] right-[1.25rem] z-[9999] flex flex-col items-end">
        <audio ref={audioRef} src="/oorum-blood.mp3" onEnded={() => setIsPlaying(false)} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="music-player-expanded absolute bottom-[60px] right-0 flex flex-col items-center"
              style={{
                background: 'rgba(26, 10, 20, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--border-glass)',
                borderRadius: '1.25rem',
                padding: '1.25rem 1.5rem',
                width: '280px',
                gap: '0.85rem',
                boxShadow: '0 -8px 32px rgba(255, 100, 150, 0.08)'
              }}
            >
              {/* Row 1 - Song info */}
              <div className="w-full flex flex-col">
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  Oorum Blood
                </span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ♪ Now Playing
                </span>
              </div>

              {/* Row 2 - Progress bar */}
              <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between w-full" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{ width: '100%', height: '4px', accentColor: 'var(--pink-mid)', cursor: 'pointer' }}
                />
              </div>

              {/* Row 3 - Controls */}
              <div className="flex items-center justify-center gap-[1.25rem] w-full mt-2">
                <button
                  onClick={handleRestart}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: '1px solid var(--border-glass)', background: 'transparent',
                    fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ⏮
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                    background: 'var(--pink-mid)', border: 'none', color: 'white',
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: '1px solid var(--border-glass)', background: 'transparent',
                    fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isMuted || volume === 0 ? '🔇' : '🔊'}
                </button>
              </div>

              {/* Row 4 - Volume */}
              <div className="w-full flex items-center gap-2 mt-2">
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                  VOL
                </span>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    setVolume(v)
                    if (v > 0) setIsMuted(false)
                  }}
                  style={{ width: '100%', height: '4px', accentColor: 'var(--pink-mid)', cursor: 'pointer' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Pill (Always visible) */}
        <div 
          className="music-player-pill"
          style={{
            height: '48px', width: '200px',
            background: 'rgba(26, 10, 20, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            borderRadius: '999px',
            display: 'flex', alignItems: 'center',
            padding: '0 1rem', gap: '0.6rem'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>🎵</span>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Now Playing
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px', margin: '0 0.2rem' }}>
            <div style={{ width: '3px', borderRadius: '2px', background: 'var(--pink-mid)', height: '4px', animation: isPlaying ? 'eq-bounce 0.8s infinite 0s' : 'none' }}></div>
            <div style={{ width: '3px', borderRadius: '2px', background: 'var(--pink-mid)', height: '4px', animation: isPlaying ? 'eq-bounce 0.8s infinite 0.15s' : 'none' }}></div>
            <div style={{ width: '3px', borderRadius: '2px', background: 'var(--pink-mid)', height: '4px', animation: isPlaying ? 'eq-bounce 0.8s infinite 0.3s' : 'none' }}></div>
          </div>

          <div style={{ flex: 1 }}></div>

          <button
            onClick={togglePlay}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--pink-mid)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', color: 'white', flexShrink: 0
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>
    </div>
  )
}
