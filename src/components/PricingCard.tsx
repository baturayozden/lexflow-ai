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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(201,168,76,0.2)' }}
      className={`relative rounded-2xl p-8 border transition-colors ${
        popular
          ? 'bg-gold/5 border-gold/50'
          : 'bg-white/[0.02] border-white/10 hover:border-gold/30'
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">{tier}</div>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-white/50 mb-1">{period}</span>
      </div>
      <p className="text-white/50 text-sm mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-white/70">
            <span className="text-gold">✓</span> {f}
          </li>
        ))}
      </ul>
      <motion.a
        href="#contact"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`block text-center font-semibold py-3 rounded-xl text-sm transition-colors ${
          popular
            ? 'bg-gold text-navy hover:bg-gold-light'
            : 'border border-gold/40 text-gold hover:bg-gold/10'
        }`}
      >
        {cta}
      </motion.a>
    </motion.div>
  )
}
