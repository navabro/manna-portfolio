import { motion } from 'framer-motion'

export default function Skills() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
  }

  const cards = [
    {
      icon: '✦',
      title: 'Legal Research',
      tags: ['Case Analysis', 'Drafting', 'Argumentation', 'Mooting']
    },
    {
      icon: '⚖️',
      title: 'Practice Areas',
      tags: ['Constitutional Law', 'Criminal Law', 'Human Rights', 'Family Law']
    },
    {
      icon: '🌸',
      title: 'The Person Behind',
      tags: ['Empathy-driven', 'Storytelling', 'Attention to detail', 'Kerala roots']
    }
  ]

  return (
    <motion.section
      id="skills"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section-wrapper relative z-10"
    >
      <div className="w-full soft-divider absolute top-0 left-0" />

      <div className="content-container">
        <span
          style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: '"DM Sans", sans-serif'
          }}
        >
          004 / SKILLS
        </span>

        <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[var(--pink-soft)] mb-12">
          Things I do well
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: '1.25rem',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <div
                style={{
                  fontSize: '1.8rem',
                  marginBottom: '0.25rem',
                  color: 'var(--pink-mid)'
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  color: 'var(--text-primary)'
                }}
              >
                {card.title}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: 'auto'
                }}
              >
                {card.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255, 182, 210, 0.1)',
                      border: '1px solid rgba(255, 182, 210, 0.2)',
                      color: 'var(--pink-soft)',
                      borderRadius: '999px',
                      padding: '0.25rem 0.85rem',
                      fontSize: '0.75rem',
                      fontFamily: '"DM Sans", sans-serif',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
