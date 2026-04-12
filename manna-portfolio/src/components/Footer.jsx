import { motion } from 'framer-motion'

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  emoji: ['💕', '🌸', '✨', '💗', '🌷', '🐾', '✦', '💝', '🍃', '💖'][i],
  x: 5 + i * 9.5,
  delay: i * 0.52,
  dur: 3.8 + (i % 4) * 0.6,
}))

function Particle({ emoji, x, delay, dur }) {
  return (
    <motion.span
      className="absolute bottom-0 text-base select-none pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 0.55, 0], y: -100 }}
      transition={{ delay, duration: dur, repeat: Infinity, repeatDelay: 4 + Math.random() * 3, ease: 'easeOut' }}
    >
      {emoji}
    </motion.span>
  )
}

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full py-14 flex flex-col items-center justify-center overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255,182,193,0.25)',
        background: 'linear-gradient(to top, rgba(255,210,220,0.18), transparent)',
      }}
    >
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      <motion.div
        className="z-10 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="text-base font-bold"
          style={{ color: '#d4607a' }}
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        >
          Made with 💕
        </motion.p>
        <p
          className="text-[11px] font-semibold"
          style={{ color: '#8a5a60', opacity: 0.55, letterSpacing: '0.12em' }}
        >
          © 2025 Manna Mary · All rights reserved
        </p>
      </motion.div>
    </footer>
  )
}
