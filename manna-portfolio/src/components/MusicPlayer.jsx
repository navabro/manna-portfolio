import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bars, setBars] = useState(() => Array.from({ length: 14 }, () => 0.15))

  useEffect(() => {
    const audio = audioRef.current
    audio.loop = true

    const onUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onLoad = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', onUpdate)
    audio.addEventListener('loadedmetadata', onLoad)
    return () => {
      audio.removeEventListener('timeupdate', onUpdate)
      audio.removeEventListener('loadedmetadata', onLoad)
    }
  }, [])

  useEffect(() => {
    if (!playing) {
      setBars(prev => prev.map(() => 0.15))
      return
    }
    const id = setInterval(() => {
      setBars(prev => prev.map(() => 0.12 + Math.random() * 0.88))
    }, 130)
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

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  return (
    <section
      id="player"
      className="relative w-full flex flex-col items-center justify-center py-20 px-6"
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="glass rounded-3xl p-8 flex flex-col items-center gap-5"
          style={{
            boxShadow: '0 6px 28px rgba(180,80,100,0.1)',
            border: '1px solid rgba(255,182,193,0.38)',
          }}
        >
          {/* Label */}
          <div className="text-center">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: '#d4607a' }}
            >
              ✦ Now Playing ✦
            </p>
            <h2
              className="font-extrabold text-xl"
              style={{
                fontFamily: "'Pacifico', cursive",
                background: 'linear-gradient(135deg, #c4536a, #e05f7a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Oorum Blood
            </h2>
          </div>

          {/* Visualizer */}
          <div className="flex items-end gap-[3px]" style={{ height: '40px' }}>
            {bars.map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: h }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                initial={{ scaleY: 0.15 }}
                style={{
                  width: '4px',
                  height: '40px',
                  borderRadius: '3px',
                  background: playing
                    ? 'linear-gradient(to top, #e0607c, #ffb6c1)'
                    : 'rgba(212,96,122,0.2)',
                  transformOrigin: 'bottom',
                  transition: 'background 0.4s',
                }}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="w-full flex flex-col gap-1.5">
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: '5px', background: 'rgba(212,96,122,0.14)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #d4607a, #ff8fa8)' }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
            </div>
            <div
              className="flex justify-between text-[11px] font-semibold"
              style={{ color: '#8a5a60' }}
            >
              <span>{fmt(duration ? progress * duration : 0)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Pill Toggle Button */}
          <motion.button
            id="music-toggle-btn"
            onClick={toggle}
            className="flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-white text-sm tracking-wide"
            style={{
              background: playing
                ? 'linear-gradient(135deg, #c4536a, #b03060)'
                : 'linear-gradient(135deg, #e8748a, #d4607a)',
              boxShadow: '0 4px 14px rgba(212,96,122,0.2)',
              transition: 'background 0.35s ease',
            }}
            whileHover={{
              boxShadow: '0 6px 22px rgba(212,96,122,0.38)',
              scale: 1.04,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {playing ? (
                <motion.span
                  key="pause"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <PauseIcon /> Pause Oorum Blood
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <PlayIcon /> Play Oorum Blood
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="text-[11px] font-medium" style={{ color: '#8a5a60', opacity: 0.65 }}>
            Loop enabled · No autoplay
          </p>
        </div>
      </motion.div>

      <audio ref={audioRef} src="/oorum-blood.mp3" preload="metadata" />
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}
