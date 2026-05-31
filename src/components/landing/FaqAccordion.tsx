'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface FaqItem {
  q: string
  a: string
}

interface Props {
  faqs: FaqItem[]
}

export default function FaqAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
            open === i ? 'border-[#D4A843]/40 bg-[#D4A843]/5' : 'border-white/8 bg-[#161F2E]'
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
            <motion.span
              animate={reduced ? {} : { rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#D4A843] text-xl flex-shrink-0"
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
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-[#94A3B8] text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
