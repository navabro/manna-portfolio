import { motion } from 'framer-motion'

export default function About() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
  }

  return (
    <motion.section
      id="about"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section-wrapper relative z-10"
    >
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
          001 / ABOUT
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-4">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight text-[var(--pink-soft)]">
              A little about me
            </h2>
            <p className="text-[0.95rem] md:text-[1.05rem] leading-relaxed text-[var(--text-primary)] opacity-90 max-w-xl">
              I'm Manna — an 18-year-old from the backwaters of Kerala, raised under the desert skies of Kuwait. Twelve years at United Indian School shaped me into who I am: curious, a little opinionated, and endlessly drawn to things that are beautiful and intentional.
            </p>
            
            {/* Trait Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['⚖️ Principled', '📚 Relentless', '🌸 Ammayi'].map((trait) => (
                <div 
                  key={trait}
                  className="px-4 py-2 rounded-full glass border border-[var(--border-glass)] text-sm tracking-wide text-[var(--text-primary)]"
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stat Grid */}
          <div className="perspective-1000">
            <motion.div 
              whileHover={{ rotateX: 3, rotateY: -3 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl relative overflow-hidden group shadow-[var(--shadow-card)]"
            >
              {/* Soft inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--pink-soft)]/5 to-transparent pointer-events-none" />
              
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  width: '100%',
                  gap: 0,
                  border: '1px solid var(--border-glass)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {[
                  { val: '3', label: 'MOOTS' },
                  { val: 'LLB', label: 'DEGREE' },
                  { val: 'Kerala HC', label: 'DREAM COURT' },
                  { val: '1', label: 'PURPOSE' },
                ].map((stat, i) => (
                  <div 
                    key={stat.label} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      padding: '1.5rem', 
                      gap: '0.4rem',
                      borderRight: i % 2 === 0 ? '1px solid var(--border-glass)' : 'none',
                      borderBottom: i < 2 ? '1px solid var(--border-glass)' : 'none'
                    }}
                  >
                    <span 
                      style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 'clamp(2rem,4vw,3rem)',
                        fontWeight: 300,
                        color: 'var(--pink-mid)',
                        lineHeight: 1
                      }}
                    >
                      {stat.val}
                    </span>
                    <span 
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.65rem',
                        letterSpacing: '0.15em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        textAlign: 'center'
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--pink-mid)]/20 blur-[50px] rounded-full mix-blend-screen pointer-events-none transition-all duration-500 group-hover:bg-[var(--pink-mid)]/40" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
