'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface FaqItem {
  q: string
  a: string
}

interface Props {
  faqs: FaqItem[]
  columns?: 1 | 2
}

export default function FaqAccordion({ faqs, columns = 1 }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const isGrid = columns === 2

  return (
    <div
      className={isGrid ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col'}
      style={{ gap: '8px', alignItems: 'start' }}
    >
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.45 }}
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: open === i ? '1px solid rgba(212,168,67,0.4)' : '1px solid rgba(15,23,42,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
          }}
        >
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              minHeight: '64px',
            }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.95rem', paddingRight: '16px', lineHeight: 1.4 }}>{faq.q}</span>
            <motion.span
              animate={reduced ? {} : { rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: '#D4A843', fontSize: '1.2rem', flexShrink: 0 }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={reduced ? {} : { height: 0, opacity: 0 }}
                animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                exit={reduced ? {} : { height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ padding: '0 24px 20px', color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid rgba(15,23,42,0.08)' }}>{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
