'use client'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { ease, stagger, fadeUp, scaleIn } from './variants'

/* ─── Mini mockup sub-components ─────────────────────────── */

function MockupCard() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 10,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            AI Case Summary
          </div>
          <div style={{ fontSize: 10, color: '#c9a84c', fontWeight: 600, marginTop: 1 }}>
            Ready for Solicitor Review
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 100,
            padding: '2px 8px',
            fontSize: 10,
            color: '#22c55e',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          Complete
        </span>
      </div>

      {/* Simulated markdown content */}
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
        <span style={{ color: '#c9a84c', fontWeight: 600 }}>## Client Overview</span>
        <br />
        <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Amir Hassan</strong>, Pakistani
        national. Current Work Visa expires <strong style={{ color: 'rgba(255,255,255,0.85)' }}>15 Mar 2026</strong>.
        ILR eligibility window open.
        <br />
        <br />
        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Urgency:</span>{' '}
        High — application should be filed within 90 days.
      </div>
    </div>
  )
}

function ActionCard({
  step,
  priority,
  priorityColor,
  label,
}: {
  step: string
  priority: string
  priorityColor: string
  label: string
}) {
  return (
    <div
      style={{
        border: '1px solid rgba(201,168,76,0.28)',
        borderRadius: 8,
        padding: '10px 12px',
        background: 'rgba(201,168,76,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '2px solid #c9a84c',
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: '#fff',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {step}
          </div>
          <div
            style={{
              fontSize: 9,
              color: priorityColor,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginTop: 1,
            }}
          >
            {priority} priority
          </div>
        </div>
      </div>
      <span
        style={{
          background: '#c9a84c',
          color: '#0a1628',
          border: 'none',
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 10,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function DemoMockup() {
  return (
    <div
      style={{
        background: 'rgba(10,22,40,0.85)',
        border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <span
            key={c}
            style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: 18,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            marginLeft: 6,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
          }}
        >
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
            lexflow-ai.vercel.app/demo
          </span>
        </div>
      </div>

      <MockupCard />

      {/* Action Centre */}
      <div
        style={{
          background: 'rgba(201,168,76,0.03)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: 10,
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em' }}>
            ⚡ ACTION CENTRE
          </span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9.5 }}>
            0 of 2 steps completed
          </span>
        </div>

        <ActionCard
          step="Schedule initial consultation"
          priority="high"
          priorityColor="#ef4444"
          label="Book"
        />
        <ActionCard
          step="Request supporting documents"
          priority="medium"
          priorityColor="#f59e0b"
          label="Send"
        />
      </div>

      {/* Saved badge */}
      <div
        style={{
          marginTop: 10,
          padding: '8px 12px',
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          color: '#22c55e',
        }}
      >
        <span>✓</span>
        <span>Case saved to system — Reference: <strong>1748123456789</strong></span>
      </div>
    </div>
  )
}

/* ─── Hero ────────────────────────────────────────────────── */

export default function Hero() {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const textY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-6%'])
  const mockupY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '10%'])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{ background: '#0a1628' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text content ── */}
          <motion.div style={{ y: textY }}>
            <motion.div
              variants={stagger(0.12, 0.1)}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {/* Badge */}
              <motion.div variants={scaleIn} className="mb-7">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gold"
                  style={{
                    background: 'rgba(201,168,76,0.10)',
                    border: '1px solid rgba(201,168,76,0.25)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse" />
                  AI Automation for UK Law Firms
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5"
              >
                We Give UK Law Firms{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg,#c9a84c 0%,#f0d080 50%,#c9a84c 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  10+ Hours Back
                </span>{' '}
                Per Week
              </motion.h1>

              {/* Sub */}
              <motion.p variants={fadeUp} className="text-lg text-white/55 leading-relaxed mb-8 max-w-lg">
                Immigration and conveyancing firms are spending £30–50k/year on tasks AI handles in
                seconds. We install the systems. You keep the savings.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
                <motion.a
                  href="#how-it-works"
                  whileHover={
                    reduced ? {} : { scale: 1.045, boxShadow: '0 0 36px rgba(201,168,76,0.45)' }
                  }
                  whileTap={reduced ? {} : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-xl text-navy text-sm"
                  style={{
                    background: 'linear-gradient(135deg,#c9a84c 0%,#d9bc72 50%,#c9a84c 100%)',
                  }}
                >
                  See How It Works
                </motion.a>
                <motion.a
                  href="/demo"
                  whileHover={reduced ? {} : { scale: 1.03 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-sm text-white/90 hover:text-white transition-colors"
                  style={{ border: '1px solid rgba(201,168,76,0.35)' }}
                >
                  Try Live Demo →
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex gap-8">
                {[
                  { value: '10+', label: 'Hours saved / week' },
                  { value: '7', label: 'Days to go live' },
                  { value: '30', label: 'Day ROI guarantee' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-gold">{s.value}</span>
                    <span className="text-xs text-white/40 mt-0.5">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Right: Floating UI mockup ── */}
          <motion.div
            style={{ y: mockupY }}
            className="relative hidden lg:block"
          >
            {/* Floating badge — top left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6, ease }}
              className="absolute -top-6 -left-6 z-20"
            >
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xl"
                style={{
                  background: 'rgba(13,31,60,0.95)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span style={{ fontSize: 15 }}>⚡</span>
                <span className="text-white/80">Steps parsed in</span>
                <span className="text-gold font-bold">0.8s</span>
              </div>
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6, ease }}
              className="absolute -bottom-5 -right-4 z-20"
            >
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xl"
                style={{
                  background: 'rgba(13,31,60,0.95)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #22c55e',
                  }}
                />
                <span className="text-white/80">Saved to case system</span>
              </div>
            </motion.div>

            {/* Main mockup card — enters from right */}
            <motion.div
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
            >
              <motion.div
                animate={reduced ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <DemoMockup />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
        >
          <span className="w-0.5 h-1.5 rounded-full bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  )
}
