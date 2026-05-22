'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormState {
  name: string
  firm_name: string
  email: string
  phone: string
  firm_type: string
  message: string
}

const INITIAL: FormState = {
  name: '',
  firm_name: '',
  email: '',
  phone: '',
  firm_type: '',
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('[ContactForm] handleSubmit fired')
    setError('')

    if (!form.name || !form.firm_name || !form.email || !form.firm_type) {
      setError('Please fill in all required fields.')
      return
    }

    console.log('[ContactForm] Sending payload:', form)
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      console.log('[ContactForm] API response:', res.status, data)
      if (!res.ok) throw new Error(data?.error || 'Server error')
      setSubmitted(true)
      setForm(INITIAL)
    } catch (err) {
      console.error('[ContactForm] Fetch error:', err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ pointerEvents: 'auto' }}
        className="bg-white/[0.02] border border-gold/30 rounded-2xl p-10 text-center"
      >
        <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-gold text-2xl">✓</span>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Booking confirmed!</h3>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
          We will be in touch within one business day to schedule your free 20-minute audit.
        </p>
      </motion.div>
    )
  }

  return (
    <div
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-left"
      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Law Firm Name *</label>
            <input
              type="text"
              value={form.firm_name}
              onChange={set('firm_name')}
              className={inputClass}
              placeholder="Smith & Associates"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              className={inputClass}
              placeholder="jane@smithlaw.co.uk"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              className={inputClass}
              placeholder="+44 7700 900000"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs mb-1.5 block">Firm Type *</label>
          <select
            value={form.firm_type}
            onChange={set('firm_type')}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select your practice area...</option>
            <option>Immigration</option>
            <option>Conveyancing</option>
            <option>Employment</option>
            <option>Family</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-white/60 text-xs mb-1.5 block">
            Anything you would like us to know?
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={set('message')}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your current challenges..."
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full text-navy font-bold py-4 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#c9a84c 0%,#d9bc72 50%,#c9a84c 100%)', pointerEvents: 'auto' }}
        >
          {submitting ? 'Sending…' : 'Book My Free Audit →'}
        </button>

        <p className="text-white/30 text-xs text-center mt-4">
          No sales pressure. 20 minutes. We will show you exactly where you are losing time.
        </p>
      </form>
    </div>
  )
}
