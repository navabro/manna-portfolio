import { motion } from 'framer-motion'

export default function Contact() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
  }

  const contacts = [
    { icon: '📧', label: 'Email', value: 'hello@manna.domain' },
    { icon: '📱', label: 'Instagram', value: '@ninteammayiamma_' },
    { icon: '📍', label: 'Location', value: 'Kerala, India' },
    { icon: '🌐', label: 'LinkedIn', value: 'linkedin.com/in/manna' }
  ]

  return (
    <motion.section
      id="contact"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section-wrapper relative z-10"
    >
      <div className="w-full soft-divider absolute top-0 left-0" />

      <div className="content-container flex flex-col items-center text-center gap-12">
        <div className="w-full text-left">
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
            005 / REACH OUT
          </span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[var(--pink-soft)] leading-tight max-w-2xl">
            Let's create something beautiful
          </h2>
          <p className="text-[1.05rem] text-[var(--text-muted)] max-w-xl leading-relaxed mt-2">
            I'm always open to collaborations, conversations, or just a good recommendation. Don't be a stranger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 w-full justify-center">
          {contacts.map((contact) => (
            <div
              key={contact.label}
              className="glass rounded-full hover:bg-[var(--bg-glass)] transition-colors w-full lg:w-auto"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.85rem 1.25rem',
                gap: '0.75rem'
              }}
            >
              <span className="text-xl">{contact.icon}</span>
              <div className="flex flex-col items-start text-left">
                <span
                  style={{
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontFamily: '"DM Sans", sans-serif'
                  }}
                >
                  {contact.label}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    fontFamily: '"DM Sans", sans-serif'
                  }}
                >
                  {contact.value}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}
