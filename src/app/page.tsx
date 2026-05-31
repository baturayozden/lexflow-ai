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
    tier: 'Quick Win',
    price: '£997',
    period: 'one-time',
    description: 'Best for firms new to AI',
    features: ['One core automation installed', 'Live in 5 business days', '30-day support included'],
    cta: 'Get Started',
    popular: false,
  },
  {
    tier: 'Full Setup',
    price: '£2,500',
    period: 'one-time',
    description: 'Best for firms ready to scale',
    features: ['Complete AI back office', '2–3 week implementation', '60-day support included', 'Staff training session'],
    cta: 'Get Started',
    popular: true,
  },
  {
    tier: 'Retainer',
    price: '£1,500',
    period: '/month',
    description: 'Best for hands-off growth',
    features: ['Everything managed ongoing', 'New automation added monthly', 'Dedicated Slack channel', 'Monthly ROI report'],
    cta: 'Get Started',
    popular: false,
  },
]

const faqs = [
  {
    q: 'Is my client data safe?',
    a: 'Absolutely. We never store your client data. All automations run within your existing tools. We operate in full compliance with UK GDPR and can provide a Data Processing Agreement on request.',
  },
  {
    q: 'Do I need any technical knowledge?',
    a: 'None at all. If you can send an email, you can use our systems. We handle every technical element — building, testing, and integrating.',
  },
  {
    q: 'How long does setup take?',
    a: 'The Quick Win package goes live in 5 business days. The Full Setup takes 2–3 weeks. From your first call to your first automation running, the process is designed to be low-disruption.',
  },
  {
    q: 'What if it does not deliver results?',
    a: 'We stand behind our work. If after 30 days you have not saved meaningful time, we will continue working at no extra charge until you do.',
  },
  {
    q: 'Does LexFlow work alongside my existing case management software?',
    a: 'Yes — LexFlow adds an AI layer on top of what you already use. It does not replace Clio, LEAP, or Osprey. It makes them better.',
  },
  {
    q: 'Is this only for immigration firms?',
    a: 'No. LexFlow is built specifically for UK immigration and conveyancing practices. Both practice areas are fully supported from day one.',
  },
]

const comparisonRows = [
  { feature: 'Pricing model', lexflow: '£997 one-time', clio: '£59+/user/month', leap: '£60–100+/user/month', smokeball: '£49+/user/month' },
  { feature: 'Done-for-you setup', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'UK immigration–specific', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'AI-native (not bolt-on)', lexflow: '✅', clio: '⚠️ Add-on', leap: '❌', smokeball: '❌' },
  { feature: 'Gov.uk compliance', lexflow: '✅', clio: '❌', leap: '❌', smokeball: '❌' },
  { feature: 'No long-term contract', lexflow: '✅', clio: '❌', leap: '12–36 month lock-in', smokeball: '❌' },
  { feature: 'Setup time', lexflow: '5–7 days', clio: 'Weeks', leap: 'Months', smokeball: 'Weeks' },
]

function ProductMockup() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="bg-[#161F2E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="bg-[#0D1117] px-4 py-3 flex items-center gap-2 border-b border-white/8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 mx-3 bg-white/5 rounded-md h-5 flex items-center px-2">
              <span className="text-white/30 text-[10px]">app.lexflow.co.uk/cases/LXF-2847</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white font-semibold text-sm">Mohammed Al-Rashidi</div>
                <div className="text-[#64748B] text-xs mt-0.5">Skilled Worker Visa · Afghan · London, UK</div>
              </div>
              <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-medium">In Review</span>
            </div>
            <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[#D4A843] text-xs">⚡</span>
                <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-wider">AI Case Summary</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 bg-white/10 rounded-full w-full" />
                <div className="h-1.5 bg-white/8 rounded-full w-11/12" />
                <div className="h-1.5 bg-white/10 rounded-full w-4/5" />
                <div className="h-1.5 bg-white/6 rounded-full w-3/4" />
                <div className="h-1.5 bg-white/8 rounded-full w-5/6" />
              </div>
            </div>
            <div className="bg-[#0D1117]/60 border border-white/8 rounded-xl p-3">
              <div className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-2">Action Steps (2/3)</div>
              {[
                { text: 'Request updated CoS from employer', done: true },
                { text: 'Submit online visa application', done: false, urgent: true },
                { text: 'Book biometric appointment', done: false },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-2 py-1.5 ${i < 2 ? 'border-b border-white/5' : ''}`}>
                  <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] ${
                    step.done ? 'bg-[#10B981]' : step.urgent ? 'border border-red-400/60 bg-red-400/10' : 'border border-white/20'
                  }`}>
                    {step.done && <span className="text-white font-bold">✓</span>}
                  </div>
                  <span className={`text-[11px] flex-1 ${step.done ? 'text-[#64748B] line-through' : 'text-[#94A3B8]'}`}>{step.text}</span>
                  {step.urgent && !step.done && <span className="text-[9px] text-red-400 font-bold uppercase">High</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -top-3 -right-3 bg-[#10B981] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#10B981]/30 whitespace-nowrap">
        ⚡ Parsed in 0.8s
      </div>
    </div>
  )
}

export default function Home() {
  const reduced = useReducedMotion()
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
              className="inline-flex items-center gap-0 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 32px' }}
            >
              {[
                { number: '10+', label: 'Hours saved/week' },
                { number: '7 days', label: 'To go live' },
                { number: '30-day', label: 'ROI guarantee' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-0">
                  {i > 0 && <div className="mx-6 self-stretch" style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />}
                  <div className="text-center">
                    <div style={{ color: '#D4A843', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1 }}>{s.number}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
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
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>THE PROBLEM</p>
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
            <p className="mb-4" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.7)' }}>THE HIDDEN COST</p>
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
      <section style={{ background: '#F8FAFC', padding: '120px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>WHAT YOU GET</p>
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
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>THE PROCESS</p>
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
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>WHY LEXFLOW</p>
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
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.7)' }}>SIMPLE PRICING</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#FFFFFF', lineHeight: 1.15 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              No hidden fees. No complicated contracts. No per-user charges.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={tier.tier} {...tier} delay={i * 0.15} />
            ))}
          </div>
          <p className="text-center mt-6" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            All prices exclude VAT. No hidden fees. No per-user charges.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9 · TESTIMONIALS — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '120px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>CLIENT RESULTS</p>
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
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A843' }}>FAQ</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#0F172A', lineHeight: 1.15 }}>
              Common questions
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7 }}>Everything you need to know before getting started.</p>
          </motion.div>
          <FaqAccordion faqs={faqs} />
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
            <div className="inline-flex items-center gap-2 mb-4" style={{ color: 'rgba(212,168,67,0.8)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <span style={{ width: '24px', height: '1px', background: 'rgba(212,168,67,0.5)', display: 'inline-block' }} />
              Free Audit
              <span style={{ width: '24px', height: '1px', background: 'rgba(212,168,67,0.5)', display: 'inline-block' }} />
            </div>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#FFFFFF', lineHeight: 1.15 }}>
              Ready to get your time back?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', lineHeight: 1.7 }}>
              Book a free 20-minute audit. We map your processes, show you exactly what can be automated, and give you a clear plan — no obligation.
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
