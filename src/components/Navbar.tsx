'use client'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ease, spring } from './variants'

const NAV_LINKS = ['How It Works', 'Pricing', 'FAQ']

export default function Navbar() {
  const reduced = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Scroll-reactive background:
          Not scrolled → transparent (dark hero behind → white text readable)
          Scrolled      → white bg + dark text + subtle shadow               */}
      <motion.div
        className="absolute inset-0 border-b"
        animate={
          reduced
            ? {}
            : {
                backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(0,0,0,0)',
                borderBottomColor: scrolled ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0)',
                boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : '0 0 0 rgba(0,0,0,0)',
              }
        }
        transition={{ duration: 0.3 }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={reduced ? {} : { scale: 1.05 }} transition={spring}>
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-gold">Lex</span>
            <motion.span
              animate={{ color: scrolled ? '#0F172A' : '#FFFFFF' }}
              transition={{ duration: 0.3 }}
              style={{ color: '#FFFFFF' }}
            >
              Flow
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3, ease }}
              className="relative group text-sm font-medium transition-colors duration-300"
              style={{ color: scrolled ? '#475569' : 'rgba(255,255,255,0.7)' }}
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * NAV_LINKS.length + 0.3, ease }}
          >
            <Link
              href="/blog"
              className="relative group text-sm font-medium transition-colors duration-300"
              style={{ color: scrolled ? '#475569' : 'rgba(255,255,255,0.7)' }}
            >
              Blog
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (NAV_LINKS.length + 1) + 0.3, ease }}
          >
            <Link
              href="/why-not-harvey"
              className="relative group text-sm font-medium transition-colors duration-300"
              style={{ color: scrolled ? '#475569' : 'rgba(255,255,255,0.7)' }}
            >
              Why not Harvey?
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
          </motion.div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, ease }}
            whileHover={reduced ? {} : { scale: 1.045 }}
            whileTap={reduced ? {} : { scale: 0.96 }}
            className="text-navy font-semibold text-sm px-5 py-2.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg,#c9a84c 0%,#d9bc72 50%,#c9a84c 100%)',
            }}
          >
            Book a Free Call
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-0.5 w-6 rounded-full origin-center"
              style={{ backgroundColor: scrolled ? '#334155' : 'rgba(255,255,255,0.8)' }}
              animate={
                reduced
                  ? {}
                  : menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 8 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -8 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer — stays dark for contrast */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-white/10 px-6 py-6 flex flex-col gap-5"
            style={{
              backgroundColor: 'rgba(13,17,23,0.97)',
              backdropFilter: 'blur(18px)',
            }}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-white font-medium transition-colors"
              >
                {item}
              </a>
            ))}
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-white font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/why-not-harvey"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-white font-medium transition-colors"
            >
              Why not Harvey?
            </Link>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="text-navy font-semibold text-sm px-5 py-3 rounded-lg text-center"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#d9bc72)' }}
            >
              Book a Free Call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
