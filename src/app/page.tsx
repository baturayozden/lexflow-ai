'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import PricingCard from '@/components/PricingCard'
import ScrollProgressBar from '@/components/landing/ScrollProgressBar'
import FaqAccordion from '@/components/landing/FaqAccordion'

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease },
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    let animFrame: number
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) animFrame = requestAnimationFrame(tick)
    }
    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [inView, target, duration])

  return { count, ref }
}

const pricingTiers = [
  {
    tier: 'Starter',
    monthlyPrice: '£199',
    annualPrice: '£2,030',
    setupOriginal: '£1,500',
    setupDiscounted: '£900',
    description: 'For practices with 2–4 solicitors',
    features: [
      'AI client intake & case summaries',
      'Gov.uk checklist automation',
      'Live in 7 days',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    tier: 'Professional',
    monthlyPrice: '£399',
    annualPrice: '£4,070',
    setupOriginal: '£2,950',
    setupDiscounted: '£1,750',
    description: 'For growing firms with 4–10 solicitors',
    features: [
      'Everything in Starter',
      'Action Centre & quote automation',
      'AI chatbot widget',
      'Priority support',
      'Monthly ROI report',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    tier: 'Managed',
    monthlyPrice: '£799',
    annualPrice: '£8,150',
    setupOriginal: '£4,950',
    setupDiscounted: '£2,950',
    description: 'Fully managed, hands-off',
    features: [
      'Everything in Professional',
      'Unlimited automations',
      'Dedicated Slack channel',
      'Monthly optimisation call',
      'Dedicated account manager',
    ],
    cta: 'Talk to Us',
    popular: false,
  },
]

const faqsLeft = [
  {
    q: 'Will this help us respond to enquiries faster?',
    a: 'Yes — and this is where most firms lose business. 79% of legal clients expect a response within 24 hours, but the average small firm takes three days or more. LexFlow captures every enquiry the moment it arrives, drafts a response, and has a case summary ready before a competitor has even opened their inbox.',
  },
  {
    q: 'We lose clients to firms that reply first. Can LexFlow fix that?',
    a: '42% of potential clients contact more than one firm at the same time, and the first to respond helpfully wins the instruction roughly 8 times out of 10. LexFlow\'s AI intake and chatbot work 24/7, so an enquiry at 9pm on a Sunday is handled before Monday morning.',
  },
  {
    q: 'Our clients complain we don\'t keep them updated. Does this help?',
    a: 'This is the single biggest source of complaints against UK firms — poor communication, not poor outcomes. LexFlow automates client updates, checklist requests, and follow-ups, so clients are never left in the dark and your fee-earners are never the bottleneck.',
  },
  {
    q: 'Is my client data safe and SRA-compliant?',
    a: 'Yes. Data is stored in UK-compliant infrastructure, encrypted in transit and at rest. The AI does not send client data to external training systems. We can provide a Data Processing Agreement, and our gov.uk checklists are reviewed monthly to stay current.',
  },
  {
    q: 'We tried an AI tool before and it didn\'t fit our work. Why is this different?',
    a: 'Most firms adopt a general AI tool and have to work out how to make it fit. LexFlow is built specifically for UK immigration and conveyancing — the case types, the gov.uk requirements, the workflows. It arrives configured, not as a blank box you have to assemble.',
  },
  {
    q: 'Do I need technical knowledge or an IT team?',
    a: 'None. This is done-for-you. We build, test, and install everything. If you can send an email, you can use the system. There is nothing for you to configure and no IT resource required.',
  },
]

const faqsRight = [
  {
    q: 'Does LexFlow replace Clio, LEAP, or Osprey?',
    a: 'No — it works alongside them. LexFlow adds the AI intake and case-summary layer those platforms don\'t provide natively. You keep the system you already know; we remove the admin overhead sitting on top of it.',
  },
  {
    q: 'How is the pricing different from the per-user monthly model?',
    a: 'Clio, LEAP, and Smokeball charge per user, every month, indefinitely. A five-person firm can pay £3,000+ a year before add-ons — and that number grows as you hire. LexFlow starts from £199/month with no per-user charges, no long-term contract, and a one-time setup rather than endless per-seat costs.',
  },
  {
    q: 'How long until we actually see results?',
    a: 'The Quick Win package goes live in five to seven business days. Measurable time savings typically show within 30 days. There is no months-long onboarding like the larger platforms.',
  },
  {
    q: 'Is this only for immigration firms?',
    a: 'No. LexFlow is built for both UK immigration and conveyancing practices, and both are fully supported from day one. Many firms that do both use a single setup across the whole practice.',
  },
  {
    q: 'What if it doesn\'t deliver results?',
    a: 'We stand behind the work. If after 30 days you haven\'t saved meaningful time, we keep working at no extra charge until you do. Our model depends on firms succeeding and staying — not on locking you into a contract.',
  },
  {
    q: 'How do you handle quotes and document checklists?',
    a: 'Both are automated. LexFlow generates template-based quotes and emails them in seconds, and builds case-specific document checklists from gov.uk that are sent to clients automatically. No copy-pasting from old files, no missed documents.',
  },
]

const comparisonRows = [
  { feature: 'Pricing model', lexflow: 'From £199/mo + setup', clio: '£59+/user/month', leap: '£60–100+/user/month', smokeball: '£49+/user/month' },
  { feature: 'Done-for-you setup', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'UK immigration–specific', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'AI-native (not bolt-on)', lexflow: '✅', clio: '⚠️ Add-on', leap: '❌', smokeball: '❌' },
  { feature: 'Gov.uk compliance', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'No long-term contract', lexflow: '✅', clio: '❌', leap: '12–36 month lock-in', smokeball: '❌' },
  { feature: 'Setup time', lexflow: '5–7 days', clio: 'Weeks', leap: 'Months', smokeball: 'Weeks' },
]

// ─── Animated Product Mockup ─────────────────────────────────────────────────
const SUMMARY_TEXT = 'EU Settlement Scheme · Spanish national · Upgrading pre-settled → settled status. Eligible to apply now — 60-day window recommended.'
const STEP_DURATIONS = [1000, 1000, 2500, 1200, 1200, 1500]

function ProductMockup() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? 4 : 0)
  const [typed, setTyped] = useState(reduced ? SUMMARY_TEXT : '')

  // Step progression
  useEffect(() => {
    if (reduced) return
    const timer = setTimeout(() => {
      setStep((s) => {
        const next = (s + 1) % 6
        if (next === 0) setTyped('')
        return next
      })
    }, STEP_DURATIONS[step])
    return () => clearTimeout(timer)
  }, [step, reduced])

  // Typewriter when step === 2
  useEffect(() => {
    if (reduced || step !== 2) return
    setTyped('')
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(SUMMARY_TEXT.slice(0, i))
      if (i >= SUMMARY_TEXT.length) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [step, reduced])

  return (
    <div className="relative">
      <div className="bg-[#161F2E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        {/* Chrome bar */}
        <div className="bg-[#0D1117] px-4 py-3 flex items-center gap-2 border-b border-white/8">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 mx-3 bg-white/5 rounded-md h-5 flex items-center px-2">
            <span className="text-white/30 text-[10px]">app.lexflow.co.uk/intake/LXF-2847</span>
          </div>
        </div>

        {/* Animated content */}
        <div className="p-4" style={{ minHeight: '240px' }}>

          {/* Step 0 — intake form filling */}
          {step === 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-blue-400"
                />
                <span className="text-blue-400 text-xs font-medium">Client submitting form...</span>
              </div>
              {['Carlos Mendoza', 'Spanish national', 'EU Settlement Scheme', ''].map((val, i) => (
                <div key={i} className="h-7 bg-white/5 border border-white/10 rounded-lg px-3 flex items-center">
                  {val && <span className="text-white/30 text-xs">{val}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Step 1 — AI analysing */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center gap-5" style={{ minHeight: '200px' }}>
              <div className="flex items-center gap-3">
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.div
                    key={delay}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay }}
                    className="w-2.5 h-2.5 rounded-full bg-[#D4A843]"
                  />
                ))}
                <span className="text-[#D4A843] font-semibold text-sm ml-1">⚡ AI analysing...</span>
              </div>
              <div className="w-full space-y-2">
                {[1, 0.8, 0.65].map((w, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.15, 0.4, 0.15] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                    className="h-2 rounded-full bg-[#D4A843]/30"
                    style={{ width: `${w * 100}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — typewriter summary */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#D4A843] text-xs">⚡</span>
                <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-wider">AI Case Summary</span>
              </div>
              <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-3" style={{ minHeight: '80px' }}>
                <p className="text-white/70 text-xs leading-relaxed">
                  {typed}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block bg-[#D4A843] ml-0.5 align-middle"
                    style={{ width: '2px', height: '12px' }}
                  />
                </p>
              </div>
            </div>
          )}

          {/* Steps 3-5 — full case view */}
          {step >= 3 && (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">Carlos Mendoza</div>
                  <div className="text-[#64748B] text-xs mt-0.5">EU Settlement Scheme · Spanish · London, UK</div>
                </div>
                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-medium">In Review</span>
              </div>
              <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#D4A843] text-xs">⚡</span>
                  <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-wider">AI Case Summary</span>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">{SUMMARY_TEXT}</p>
              </div>
              <div className="bg-[#0D1117]/60 border border-white/8 rounded-xl p-3">
                <div className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-2">Action Steps</div>
                {[
                  'Schedule eligibility consultation',
                  'Request 5-year residence evidence',
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={step === 3 ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.25, duration: 0.35 }}
                    className={`flex items-center gap-2 py-1.5 ${i < 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                    <span className="text-[11px] text-[#94A3B8]">{text}</span>
                  </motion.div>
                ))}
              </div>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#10B981]/10 border border-[#10B981]/25 rounded-xl p-3 flex items-center gap-2"
                >
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span className="text-[#10B981] text-xs font-semibold">Case saved to system</span>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute -top-3 -right-3 bg-[#10B981] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#10B981]/30 whitespace-nowrap">
        ⚡ Parsed in 0.8s
      </div>
    </div>
  )
}

export default function Home() {
  const reduced = useReducedMotion()
  const [isAnnual, setIsAnnual] = useState(false)
  const { count: lostRevenue, ref: revenueRef } = useCountUp(291200)

  return (
    <main className="min-h-screen" style={{ background: '#FFFFFF' }}>
      <ScrollProgressBar />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          1 · HERO — dark gradient background
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1117 0%, #111827 50%, #0D1117 100%)' }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
          <div className="absolute top-0 left-0 right-0 bottom-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,168,67,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,168,67,0.04) 0%, transparent 40%)', pointerEvents: 'none' }} />
        </div>

        <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left col */}
          <div className="lg:col-span-3 space-y-8">
            {/* Badge */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-2"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span className="text-[#10B981] text-sm font-medium">AI Automation for UK Law Firms</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={reduced ? {} : { opacity: 0, y: 30 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="font-extrabold leading-tight"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}
            >
              <span className="text-white block">We Give UK Law Firms</span>
              <span className="block my-1" style={{
                background: 'linear-gradient(135deg,#D4A843 0%,#E8BC5A 40%,#D4A843 70%,#E8BC5A 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: reduced ? 'none' : 'shimmer 3s linear infinite',
              }}>
                10+ Hours Back
              </span>
              <span className="text-white block">Per Week</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(148,163,184,1)' }}
            >
              Immigration and conveyancing firms are spending £30–50k/year on tasks AI handles in seconds. We install the systems. You keep the savings.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#how-it-works"
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)', color: '#0D1117' }}
              >
                See How It Works
              </motion.a>
              <motion.a
                href="/demo/index.html"
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-colors"
                style={{ color: '#D4A843', border: '1px solid rgba(212,168,67,0.4)' }}
              >
                ▶ See it in action
              </motion.a>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              animate={reduced ? {} : { opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px 32px',
                maxWidth: '520px',
              }}
            >
              {[
                { number: '10+', label: 'Hours saved/week' },
                { number: '7 days', label: 'To go live' },
                { number: '30-day', label: 'ROI guarantee' },
              ].flatMap((s, i) => [
                i > 0 ? (
                  <div
                    key={`div-${i}`}
                    style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)', flexShrink: 0, margin: '0 28px' }}
                  />
                ) : null,
                <div key={`stat-${i}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#D4A843', fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.1 }}>{s.number}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px' }}>{s.label}</div>
                </div>,
              ])}
            </motion.div>
          </div>

          {/* Right col — Product mock-up */}
          <motion.div
            className="lg:col-span-2"
            initial={reduced ? {} : { opacity: 0, x: 30 }}
            animate={reduced ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2 · TRUST BAR — #F8FAFC
      ════════════════════════════════════════════════════════════════ */}
      <motion.section
        {...fadeUp}
        className="px-6"
        style={{ background: '#F8FAFC', borderTop: '1px solid rgba(15,23,42,0.08)', borderBottom: '1px solid rgba(15,23,42,0.08)', padding: '24px 24px' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-center mb-6" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: '#94A3B8', textTransform: 'uppercase' }}>
            Trusted by firms across England &amp; Wales
          </p>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: '8px' }}>
            {[
              { icon: '🇬🇧', label: 'UK-Only Focus' },
              { icon: '🔒', label: 'GDPR Compliant' },
              { icon: '⚖️', label: 'Gov.uk Verified' },
              { icon: '✓', label: 'SRA Aware', mono: true },
              { icon: '🤝', label: 'Done For You' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 12 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center"
                style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.14)', borderRadius: '100px', padding: '8px 16px', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
              >
                <span style={{ fontSize: badge.mono ? '0.9rem' : '1rem', color: badge.mono ? '#10B981' : undefined, fontWeight: badge.mono ? 700 : undefined }}>{badge.icon}</span>
                <span style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          3 · PROBLEM — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section id="problem" style={{ background: '#FFFFFF', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>THE PROBLEM</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              Your team is drowning in manual work
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Every hour your fee-earners spend on admin is an hour not billed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Manual Client Intake', hours: '8–12 hrs/week lost', desc: 'Collecting forms, chasing documents, manually entering data into your case management system.' },
              { title: 'Document Prep & Templates', hours: '6–10 hrs/week lost', desc: 'Drafting the same letters and contracts from scratch — or hunting through old files for the right template.' },
              { title: 'Email Sorting & Responses', hours: '4–6 hrs/week lost', desc: 'Triaging enquiries, writing standard update emails, and following up clients who have not sent documents.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 30 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease }}
                className="cursor-default"
                style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s ease, transform 0.2s ease' }}
                whileHover={reduced ? {} : { y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="inline-flex items-center gap-2 mb-4" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px' }}>
                  {item.hours}
                </div>
                <h3 style={{ color: '#0F172A', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.65 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4 · DARK STATS — #0D1117 — £291,200 count-up
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#0D1117', padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
            whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>THE HIDDEN COST</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '16px' }}>
              That is <strong style={{ color: '#FFFFFF' }}>18–28 billable hours per week</strong> your firm is giving away.
              At £200/hr, that is up to:
            </p>
            <div style={{ fontWeight: 900, color: '#D4A843', letterSpacing: '-0.02em', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1 }}>
              £<span ref={revenueRef}>{reduced ? '291,200' : lostRevenue.toLocaleString()}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '12px' }}>in lost revenue annually</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5 · FEATURES — #F8FAFC
      ════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ background: '#F8FAFC', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>WHAT YOU GET</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              Everything your firm needs.{' '}
              <span style={{ color: '#D4A843' }}>Nothing it doesn&apos;t.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '🤖', title: 'AI Client Intake',
                desc: "A potential client fills in a form. AI reads it, summarises the case, flags urgency, and has it ready for your solicitor — before they've had their morning coffee.",
                tag: '~3 hrs saved per client',
              },
              {
                icon: '⚡', title: 'Action Centre',
                desc: 'For every case, AI generates the next steps automatically. Schedule, send, check eligibility — one click. No more staring at a file wondering what to do next.',
                tag: 'Zero missed deadlines',
              },
              {
                icon: '📋', title: 'Gov.uk Checklist Automation',
                desc: 'Case-specific document lists built from gov.uk. Sent to your client automatically. Updated monthly.',
              },
              {
                icon: '📄', title: 'Instant Quote Generation',
                desc: 'Template-based quotes generated and emailed in seconds. No more copy-paste from old files.',
              },
              {
                icon: '💬', title: 'AI Chatbot Widget',
                desc: "Embed on your firm's website. Answers client questions 24/7 and routes new enquiries straight into your intake pipeline.",
              },
              {
                icon: '📅', title: 'Daily & Weekly Digests',
                desc: 'Every morning: which cases need attention. Every Monday: what the week looks like. Automated. No admin.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 30 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease }}
                className="cursor-default"
                style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '20px', padding: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', transition: 'all 0.25s ease' }}
                whileHover={reduced ? {} : { borderColor: 'rgba(212,168,67,0.4)', boxShadow: '0 8px 32px rgba(212,168,67,0.08)', y: -3 }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212,168,67,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '20px' }}>
                  {card.icon}
                </div>
                <h3 style={{ color: '#0F172A', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.65 }}>{card.desc}</p>
                {card.tag && (
                  <div style={{ display: 'inline-block', marginTop: '20px', background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px' }}>
                    {card.tag}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6 · HOW IT WORKS — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#FFFFFF', padding: '120px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>THE PROCESS</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              A simple process.{' '}
              <span style={{ color: '#94A3B8' }}>We do the heavy lifting.</span>
            </h2>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8 md:gap-0">
            {/* Connector lines — desktop only */}
            <div className="hidden md:flex absolute top-6 left-0 right-0 items-center pointer-events-none" style={{ padding: '0 calc(100%/6)' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #D4A843, rgba(212,168,67,0.2))' }} />
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212,168,67,0.2), #D4A843)' }} />
            </div>

            {[
              { step: '1', title: 'Free Audit', desc: 'We spend 20 minutes mapping your manual processes. You get a clear picture of what can be automated.', tag: 'Completely free' },
              { step: '2', title: 'We Build & Install', desc: 'You approve the plan. We build everything and install directly into your existing tools. Zero technical effort from you.', tag: 'You do nothing technical' },
              { step: '3', title: 'You Save Time', desc: 'Go live in 7 days, measurable results in 30. Your team works on billable matters while AI handles the rest.', tag: 'Live in 7 days' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 30 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, ease }}
                className="text-center px-8"
              >
                <div
                  className="flex items-center justify-center mx-auto mb-6"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0D1117', color: '#D4A843', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#0F172A', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '16px' }}>{item.desc}</p>
                <span style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid rgba(21,128,61,0.2)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 500, padding: '3px 10px', display: 'inline-block' }}>
                  {item.tag}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)', color: '#0D1117' }}
            >
              Start with a Free Audit
            </a>
            <a
              href="/demo/index.html"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-colors"
              style={{ color: '#D4A843', border: '1px solid rgba(212,168,67,0.4)' }}
            >
              ▶ See it in action
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7 · COMPARISON TABLE — #F8FAFC
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#F8FAFC', padding: '120px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>WHY LEXFLOW</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              Built for firms like yours.{' '}
              <span style={{ color: '#94A3B8' }}>Unlike everything else.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              The tools that dominate the market were built for large firms — or not built for the UK at all.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}>
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                    <th className="text-left" style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 500 }}>Feature</th>
                    {['LexFlow', 'Clio', 'LEAP', 'Smokeball'].map((col, i) => (
                      <th key={col} style={{
                        padding: '16px 24px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        color: i === 0 ? '#D4A843' : '#94A3B8',
                        background: i === 0 ? 'rgba(212,168,67,0.08)' : undefined,
                        borderLeft: i === 0 ? '2px solid #D4A843' : undefined,
                        borderRight: i === 0 ? '2px solid #D4A843' : undefined,
                      }}>
                        {i === 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
                            {col} ✦
                          </span>
                        ) : col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={reduced ? {} : { opacity: 0, x: -10 }}
                      whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      style={{ borderTop: '1px solid rgba(15,23,42,0.06)', background: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}
                    >
                      <td style={{ padding: '16px 24px', color: '#475569', fontSize: '0.9rem' }}>{row.feature}</td>
                      {[row.lexflow, row.clio, row.leap, row.smokeball].map((cell, j) => (
                        <td key={j} style={{
                          padding: '16px 24px',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          background: j === 0 ? 'rgba(212,168,67,0.04)' : undefined,
                          borderLeft: j === 0 ? '2px solid rgba(212,168,67,0.3)' : undefined,
                          borderRight: j === 0 ? '2px solid rgba(212,168,67,0.3)' : undefined,
                          borderBottom: j === 0 && i === comparisonRows.length - 1 ? '2px solid rgba(212,168,67,0.3)' : undefined,
                        }}>
                          <span style={{
                            color: cell === '✅' ? '#10B981' :
                                   cell === '❌' ? '#94A3B8' :
                                   cell.startsWith('⚠️') ? '#EAB308' :
                                   j === 0 ? '#0F172A' : '#475569',
                            fontWeight: j === 0 ? 600 : 400,
                          }}>
                            {cell}
                          </span>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <motion.p {...fadeUp} className="text-center mt-6">
            <Link href="/why-not-harvey" style={{ color: '#D4A843', fontSize: '0.9rem' }} className="hover:underline">
              Why not Harvey AI? See the full comparison →
            </Link>
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8 · PRICING — #0D1117 (dark)
      ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ background: '#0D1117', padding: '120px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>SIMPLE PRICING</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#FFFFFF', lineHeight: 1.15 }}>
              Transparent pricing.{' '}
              <span style={{ color: '#D4A843' }}>No per-user fees. Ever.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
              A fixed monthly subscription plus a one-time setup. No surprises.
            </p>
          </motion.div>

          {/* Offer banner */}
          <motion.div
            {...fadeUp}
            className="flex justify-center mb-6"
          >
            <span style={{
              display: 'inline-block',
              background: 'rgba(212,168,67,0.10)',
              border: '1px solid rgba(212,168,67,0.30)',
              borderRadius: '100px',
              color: '#D4A843',
              fontSize: '0.85rem',
              fontWeight: 500,
              padding: '8px 20px',
              textAlign: 'center',
            }}>
              ✦ Founding rate — reduced setup for firms that join before 31 July. Your first month is on us.
            </span>
          </motion.div>

          {/* Monthly / Annual toggle */}
          <motion.div
            {...fadeUp}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '52px' }}
          >
            <span style={{
              color: isAnnual ? 'rgba(255,255,255,0.38)' : '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: isAnnual ? 400 : 600,
              transition: 'color 0.2s, font-weight 0.2s',
            }}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual((a) => !a)}
              aria-label="Toggle annual billing"
              style={{
                width: '50px',
                height: '28px',
                borderRadius: '100px',
                background: isAnnual ? '#D4A843' : 'rgba(255,255,255,0.14)',
                position: 'relative',
                cursor: 'pointer',
                border: 'none',
                transition: 'background 0.25s ease',
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }}
              />
            </button>
            <span style={{
              color: isAnnual ? '#D4A843' : 'rgba(255,255,255,0.38)',
              fontSize: '0.9rem',
              fontWeight: isAnnual ? 600 : 400,
              transition: 'color 0.2s, font-weight 0.2s',
            }}>
              Annual{' '}
              <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>(save 15%)</span>
            </span>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={tier.tier} {...tier} delay={i * 0.15} isAnnual={isAnnual} />
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center mt-8" style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            All prices exclude VAT. First month free after setup. No per-user charges, ever. Cancel anytime — no long-term contract.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9 · TESTIMONIALS — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '120px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>CLIENT RESULTS</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              What firms are saying
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: 'We used to spend 3 hours on every new client. Now it takes 15 minutes and the AI summary is ready for the solicitor.', author: 'Managing Partner', firm: 'UK Immigration Firm' },
              { quote: 'The checklist automation alone saved us from a compliance issue. The monthly gov.uk check flagged a change we had missed.', author: 'Senior Solicitor', firm: 'Conveyancing Practice' },
              { quote: "I was sceptical about AI but the setup was genuinely 5 days and it just works. No IT headaches.", author: 'Practice Manager', firm: 'Immigration & Family Law' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 25 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '20px', padding: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
              >
                <span style={{ fontSize: '5rem', lineHeight: 0.5, color: '#D4A843', fontFamily: 'Georgia, serif', display: 'block', marginBottom: '16px' }}>&ldquo;</span>
                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '24px' }}>{t.quote}</p>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{t.author}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '2px' }}>{t.firm}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10 · FAQ — #F8FAFC
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        style={{ background: '#F8FAFC', padding: '120px 24px', borderTop: '1px solid rgba(15,23,42,0.08)' }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div {...fadeUp} className="text-center mb-12">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C99A35', marginBottom: '10px' }}>COMMON QUESTIONS</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              Straight answers to what firms actually ask
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FaqAccordion faqs={faqsLeft} />
            <FaqAccordion faqs={faqsRight} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11 · CTA + CONTACT — #0D1117 (dark)
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{ background: '#0D1117', padding: '120px 24px', position: 'relative', zIndex: 10 }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl" style={{ background: 'rgba(212,168,67,0.04)' }} />
        </div>
        <div className="relative" style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 mb-4" style={{ color: '#C99A35', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <span style={{ width: '24px', height: '1px', background: 'rgba(212,168,67,0.5)', display: 'inline-block' }} />
              Free Audit
              <span style={{ width: '24px', height: '1px', background: 'rgba(212,168,67,0.5)', display: 'inline-block' }} />
            </div>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#FFFFFF', lineHeight: 1.15 }}>
              Ready to get your time back?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', lineHeight: 1.7 }}>
              Book your free audit — and lock in founding rates before 31 July. We map your processes, show you exactly what can be automated, and give you a clear plan — no obligation.
            </p>
          </motion.div>
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ pointerEvents: 'auto' }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
