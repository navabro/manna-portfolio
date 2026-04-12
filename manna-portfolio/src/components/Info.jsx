import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
}

const details = [
  { icon: '🎂', label: 'Birthday',     value: 'December 21, 2006' },
  { icon: '📍', label: 'Native',       value: 'Poothirikka, Ernakulam, Kerala' },
  { icon: '🎓', label: 'School',       value: 'United Indian School, Kuwait  ·  LKG – 12' },
  { icon: '⚖️', label: 'Currently',   value: 'Law Student at VIT Chennai' },
  { icon: '🏆', label: 'Achievement',  value: '7th Rank Holder · Entire Law School' },
]

function InfoCard({ icon, label, value, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(180,80,100,0.14)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="glass rounded-2xl px-6 py-5 flex items-start gap-4 w-full"
      style={{ boxShadow: '0 3px 16px rgba(180,80,100,0.08)', border: '1px solid rgba(255,182,193,0.35)' }}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
          style={{ color: '#d4607a' }}
        >
          {label}
        </p>
        <p className="text-[15px] font-semibold leading-snug" style={{ color: '#4a2c2a' }}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

export default function Info() {
  return (
    <section
      id="info"
      className="relative w-full flex flex-col items-center justify-center py-24 px-6"
    >
      <motion.div
        className="w-full max-w-lg flex flex-col items-center gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-4" variants={fadeUp} custom={0}>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.32em] mb-3"
            style={{ color: '#d4607a' }}
          >
            ✦ &nbsp;A little about me&nbsp; ✦
          </p>
          <h2
            style={{
              fontFamily: "'Pacifico', cursive",
              fontSize: 'clamp(1.9rem, 5.5vw, 2.9rem)',
              background: 'linear-gradient(135deg, #c4536a 0%, #e0607c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.25,
            }}
          >
            Manna Mary
          </h2>
          <p className="mt-1.5 text-sm font-semibold" style={{ color: '#8a5a60' }}>
            Mannammayi
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          custom={1}
          style={{
            height: '1px',
            width: '80px',
            borderRadius: '99px',
            background: 'linear-gradient(90deg, transparent, #ffb6c1, transparent)',
            marginBottom: '8px',
          }}
        />

        {/* Cards */}
        {details.map((d, i) => (
          <InfoCard key={d.label} {...d} index={i + 2} />
        ))}

        <motion.span
          variants={fadeUp}
          custom={details.length + 2}
          className="mt-3 text-xl select-none"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          🌸
        </motion.span>
      </motion.div>
    </section>
  )
}
