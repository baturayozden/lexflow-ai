'use client'
import { motion, type Variants } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(-45deg, #0a1628, #0d1f3c, #1a2a4a, #0a1628)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
      }}
    >
      {/* Floating orbs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
          <span className="text-gold text-sm font-medium">AI Automation for UK Law Firms</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          We Give UK Law Firms{' '}
          <span className="gold-shimmer">10+ Hours Back</span>{' '}
          Per Week
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Immigration and conveyancing firms are spending £30–50k/year on tasks AI handles in
          seconds. We install the systems. You keep the savings.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201,168,76,0.4)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="bg-gold text-navy font-bold px-8 py-4 rounded-xl text-base"
          >
            See How It Works
          </motion.a>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="border border-gold/40 text-white font-semibold px-8 py-4 rounded-xl text-base hover:border-gold/70 hover:bg-gold/5 transition-colors"
          >
            View Pricing
          </motion.a>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center gap-12">
          {[
            { value: '10+', label: 'Hours saved/week' },
            { value: '7', label: 'Days to go live' },
            { value: '30', label: 'Day ROI guarantee' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              style={{ animation: `float ${4 + i}s ease-in-out ${i}s infinite` }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animation: 'float 2s ease-in-out infinite' }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
