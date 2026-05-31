'use client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface PricingCardProps {
  tier: string
  monthlyPrice: string      // e.g. "£199"
  annualPrice: string       // e.g. "£2,030"
  setupOriginal: string     // e.g. "£1,500"
  setupDiscounted: string   // e.g. "£900"
  description: string
  features: string[]
  cta: string
  popular?: boolean
  delay?: number
  isAnnual?: boolean
}

export default function PricingCard({
  tier,
  monthlyPrice,
  annualPrice,
  setupOriginal,
  setupDiscounted,
  description,
  features,
  cta,
  popular,
  delay = 0,
  isAnnual = false,
}: PricingCardProps) {
  const reduced = useReducedMotion()

  // Discounted monthly when billed annually (×0.85, rounded)
  const monthlyNum = parseInt(monthlyPrice.replace(/[£,]/g, ''), 10)
  const discountedMonthly = `£${Math.round(monthlyNum * 0.85)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      whileHover={{ y: -6 }}
      className="relative flex flex-col"
      style={{
        background: popular ? 'rgba(212,168,67,0.07)' : '#161F2E',
        border: popular ? '2px solid #D4A843' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px',
        color: '#FFFFFF',
      }}
    >
      {/* Most Popular badge */}
      {popular && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap"
          style={{ background: '#D4A843', color: '#0D1117', letterSpacing: '0.04em' }}
        >
          Most Popular
        </div>
      )}

      {/* Tier label */}
      <div style={{
        color: '#D4A843',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '10px',
      }}>
        {tier}
      </div>

      {/* Founding rate badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(212,168,67,0.08)',
        border: '1px solid rgba(212,168,67,0.2)',
        borderRadius: '100px',
        padding: '3px 10px',
        marginBottom: '20px',
        width: 'fit-content',
      }}>
        <span style={{ color: 'rgba(212,168,67,0.85)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.01em' }}>
          Founding rate · until 31 July
        </span>
      </div>

      {/* Animated price block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isAnnual ? 'annual' : 'monthly'}
          initial={reduced ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '2.6rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
              {isAnnual ? discountedMonthly : monthlyPrice}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '5px', fontSize: '0.9rem' }}>
              /month
            </span>
          </div>
          {isAnnual ? (
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem', marginBottom: '2px' }}>
              {annualPrice} billed annually · save 15%
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.78rem', marginBottom: '2px' }}>
              billed monthly
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Setup fee line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', marginBottom: '18px' }}>
        <span style={{
          color: 'rgba(255,255,255,0.32)',
          fontSize: '0.88rem',
          textDecoration: 'line-through',
          textDecorationColor: 'rgba(255,255,255,0.25)',
        }}>
          {setupOriginal}
        </span>
        <span style={{ color: '#D4A843', fontWeight: 600, fontSize: '0.92rem' }}>
          {setupDiscounted} setup
        </span>
      </div>

      {/* Description */}
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.55 }}>
        {description}
      </p>

      {/* Features */}
      <ul className="flex-1" style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45 }}>
            <span style={{ color: '#D4A843', flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.a
        href="/#contact"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="block text-center font-bold py-3.5 rounded-xl text-sm"
        style={popular
          ? { background: 'linear-gradient(135deg,#c9a84c 0%,#d9bc72 50%,#c9a84c 100%)', color: '#0D1117' }
          : { background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }
        }
      >
        {cta}
      </motion.a>
    </motion.div>
  )
}
