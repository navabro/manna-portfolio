import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? 'bg-[#1a0a14]/80 backdrop-blur-xl border-b border-[var(--border-glass)] py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full max-w-[1100px] mx-auto px-5 md:px-8 lg:px-0 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="font-display text-[1.3rem] text-[var(--pink-soft)] tracking-wider">
            Manna
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[0.85rem] uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--pink-mid)] transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[var(--pink-mid)] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-[110] relative"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-6 h-[2px] bg-[var(--pink-soft)] rounded transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : '-translate-y-1'
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-[var(--pink-soft)] rounded transition-all duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-[var(--pink-soft)] rounded transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : 'translate-y-1'
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-screen h-[100dvh] z-[105] glass bg-[#1a0a14]/90 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                onClick={() => setMenuOpen(false)}
                key={link.name}
                href={link.href}
                className="font-display text-3xl text-[var(--text-primary)] hover:text-[var(--pink-mid)] transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
