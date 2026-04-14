import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [greeting, setGreeting] = useState({ mal: '', eng: '' })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting({ mal: 'സുപ്രഭാതം മന്ന അമ്മായി 🌸', eng: 'Good Morning' })
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ mal: 'ഉച്ചസ്നേഹം മന്ന അമ്മായി ☀️', eng: 'Good Afternoon' })
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ mal: 'ശുഭ സന്ധ്യ മന്ന അമ്മായി 🌙', eng: 'Good Evening' })
    } else {
      setGreeting({ mal: 'ശുഭ രാത്രി മന്ന അമ്മായി 🌟', eng: 'Good Night' })
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <section className="relative w-full h-[90svh] md:h-screen flex flex-col items-center justify-center z-10 px-5 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center max-w-[800px] w-full"
      >
        {/* Greetings */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 mb-6">
          <p className="font-malayalam italic text-[0.85rem] md:text-[1.1rem] text-[var(--text-muted)]">
            {greeting.mal}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-[0.85rem] md:text-[0.9rem] uppercase tracking-widest text-[var(--pink-soft)]"
          >
            {greeting.eng}
          </motion.p>
        </motion.div>

        {/* Thin rule divider */}
        <motion.div variants={itemVariants} className="w-16 soft-divider mb-8" />

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-[300] tracking-[-0.02em] leading-none mb-6 relative"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          <span
            className="bg-clip-text text-transparent animate-shimmer"
            style={{
              backgroundImage: 'linear-gradient(90deg, var(--pink-soft) 0%, var(--gold-shimmer) 50%, var(--pink-soft) 100%)',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite'
            }}
          >
            Manna ✦
          </span>
          <style>{`
            @keyframes shimmer {
              to { background-position: 200% center; }
            }
          `}</style>
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={itemVariants}
          className="text-[0.95rem] tracking-[0.25em] uppercase text-[var(--text-muted)] mb-4 sm:mb-6"
        >
          Law Student · Ammayi · Malayali manga🌴
        </motion.p>


      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          scroll to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-4 h-4 border-b-2 border-r-2 border-[var(--pink-mid)] rotate-45 transform translate-y-[-25%]"
        />
      </motion.div>
    </section>
  )
}
