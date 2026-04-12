import { motion } from 'framer-motion'

export default function CatImage() {
  return (
    <section
      id="cat"
      className="relative w-full flex flex-col items-center justify-center py-16 px-6"
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image card */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(180,80,100,0.14), 0 2px 8px rgba(255,182,193,0.25)',
            background: '#fff5f8',
            border: '1px solid rgba(255,182,193,0.4)',
          }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          <img
            src="/cat.jpg"
            alt="A little bit of attitude 🐾"
            className="block"
            style={{
              width: 'min(340px, 85vw)',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />
          {/* Soft overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,240,245,0.3) 0%, transparent 50%)',
            }}
          />
        </motion.div>

        {/* Caption */}
        <motion.p
          className="text-sm font-semibold text-center"
          style={{ color: '#8a5a60' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          A little bit of attitude 🐾
        </motion.p>
      </motion.div>
    </section>
  )
}
