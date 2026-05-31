'use client'
import { motion } from 'framer-motion'

interface PricingCardProps {
  tier: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
  delay?: number
}

export default function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  popular,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      whileHover={{ y: -6 }}
      className="relative"
      style={{
        background: popular ? 'rgba(212,168,67,0.06)' : '#161F2E',
        border: popular ? '2px solid #D4A843' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px',
        color: '#FFFFFF',
      }}
    >
      {popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap"
          style={{ background: '#D4A843', color: '#0D1117' }}
        >
          Most Popular
        </div>
      )}
      <div style={{ color: '#D4A843', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{tier}</div>
      <div className="flex items-end gap-1 mb-1">
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF' }}>{price}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{period}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '24px' }}>{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ color: '#D4A843' }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <motion.a
        href="#contact"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="block text-center font-bold py-3.5 rounded-xl text-sm transition-colors"
        style={popular
          ? { background: '#D4A843', color: '#0D1117' }
          : { background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }
        }
      >
        {cta}
      </motion.a>
    </motion.div>
  )
}
