import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function Particles() {
  // 18 tiny elements
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      type: i % 2 === 0 ? '🌸' : '·',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: Math.random() * 6 + 6, // 6 to 12s
      delay: Math.random() * 6, // 0 to 6s
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute ${p.type === '·' ? 'text-[8px] opacity-20' : 'text-base opacity-30'} text-[var(--pink-soft)]`}
          style={{ 
            left: p.left, 
            top: p.top 
          }}
          animate={{
            y: [0, -80],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.type}
        </motion.div>
      ))}
    </div>
  )
}
