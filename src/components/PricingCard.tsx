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
      whileHover={{ y: -6, boxShadow: popular ? '0 20px 60px rgba(212,168,67,0.18)' : '0 12px 40px rgba(0,0,0,0.1)' }}
      className={`relative rounded-2xl p-8 border transition-all ${
        popular
          ? 'border-[#D4A843]/40 bg-[#D4A843]/5'
          : 'border-black/8 bg-white hover:border-[#D4A843]/30'
      }`}
      style={!popular ? { boxShadow: '0 1px 4px rgba(0,0,0,0.05)' } : {}}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#0D1117] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}>
          Most Popular
        </div>
      )}
      <div className="text-[#D4A843] text-sm font-semibold uppercase tracking-wider mb-2">{tier}</div>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-bold text-[#0F172A]">{price}</span>
        <span className="text-[#94A3B8] mb-1">{period}</span>
      </div>
      <p className="text-[#475569] text-sm mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-[#475569]">
            <span className="text-[#D4A843]">✓</span> {f}
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
            ? 'text-[#0D1117] hover:opacity-90'
            : 'border border-[#D4A843]/50 text-[#D4A843] hover:bg-[#D4A843]/8'
        }`}
        style={popular ? { background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' } : {}}
      >
        {cta}
      </motion.a>
    </motion.div>
  )
}
