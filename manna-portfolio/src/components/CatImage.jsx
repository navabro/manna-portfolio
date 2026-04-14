import { motion } from 'framer-motion'

export default function CatImage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
  }

  return (
    <motion.section
      id="gallery"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section-wrapper relative z-10"
    >
      <div className="w-full soft-divider absolute top-0 left-0" />
      
      <div className="content-container flex flex-col items-center text-center gap-10">
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
            002 / MOMENTS
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[var(--pink-soft)]">
            A little bit of attitude
          </h2>
        </div>

        <div className="relative group perspective-1000">
          {/* Blurred background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[var(--pink-mid)] blur-[60px] opacity-40 z-[-1]" />
          
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(255,100,150,0.15)] group-hover:shadow-[0_16px_48px_rgba(255,100,150,0.25)] relative max-w-[420px] w-full border border-[var(--border-glass)]"
          >
            {/* Fallback image in case cat.jpg doesn't exist */}
            <img 
              src="/cat.jpg" 
              alt="Manna's cat" 
              className="w-full h-auto object-cover aspect-[4/5]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a14]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>

        <p className="font-display italic text-[1.1rem] text-[var(--text-muted)] mt-2">
          A little bit of attitude 🐾
        </p>
      </div>
    </motion.section>
  )
}
