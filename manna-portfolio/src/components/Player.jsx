import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Player() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visualizer, setVisualizer] = useState([0.2, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.4, 0.6, 0.8])

  useEffect(() => {
    const audio = audioRef.current
    audio.loop = true

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onLoaded = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setVisualizer(prev => prev.map(() => 0.15 + Math.random() * 0.85))
    }, 120)
    return () => clearInterval(id)
  }, [playing])

  const toggle = () => {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(p => !p)
  }

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentTime = duration ? progress * duration : 0

  return (
    <section
      id="player"
      className="relative w-full flex flex-col items-center justify-center py-24 px-6"
    >
      {/* Glow blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255,105,180,0.14) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card */}
        <div
          className="glass rounded-3xl p-8 flex flex-col items-center gap-6"
          style={{ boxShadow: '0 8px 40px rgba(255,105,180,0.2), 0 2px 8px rgba(255,182,193,0.25)' }}
        >
          {/* Title */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#e05fa0' }}>
              ✦ Now Playing ✦
            </p>
            <h2
              className="font-extrabold text-2xl"
              style={{
                fontFamily: "'Pacifico', cursive",
                background: 'linear-gradient(135deg, #e05fa0, #ff69b4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Oorum Blood
            </h2>
          </div>

          {/* Visualizer bars */}
          <div className="flex items-end gap-[3px] h-12">
            {visualizer.map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0.15 }}
                animate={{ scaleY: playing ? h : 0.15 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                style={{
                  height: '48px',
                  width: '4px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to top, #ff69b4, #ffd1dc)',
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full flex flex-col gap-1.5">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,105,180,0.2)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ff69b4, #e05fa0)' }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold" style={{ color: '#e05fa0', opacity: 0.7 }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Play / Pause Button */}
          <motion.button
            id="music-toggle-btn"
            onClick={toggle}
            className="relative flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-sm tracking-wide overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ff69b4 0%, #e05fa0 100%)',
              boxShadow: playing
                ? '0 0 0 0 rgba(255,105,180,0), 0 8px 28px rgba(255,105,180,0.5)'
                : '0 8px 28px rgba(255,105,180,0.35)',
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.span
                  key="pause"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-2"
                >
                  <PauseIcon /> Pause Oorum Blood
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-2"
                >
                  <PlayIcon /> Play Oorum Blood
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="text-xs font-medium" style={{ color: '#e05fa0', opacity: 0.55 }}>
            Loop enabled · Auto-loop on
          </p>
        </div>
      </motion.div>

      <audio ref={audioRef} src="/oorum-blood.mp3" preload="metadata" />
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}
