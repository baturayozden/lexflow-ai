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

// ─── Count-up hook ───────────────────────────────────────────────────────────
// once:true + margin ensures the counter fires exactly once when visible
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

// ─── Data ────────────────────────────────────────────────────────────────────
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

// ─── Product Mock-up (lives inside the dark hero) ────────────────────────────
function ProductMockup() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Browser frame */}
        <div className="bg-[#161F2E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Chrome bar */}
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
          {/* Content */}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const reduced = useReducedMotion()
  const { count: lostRevenue, ref: revenueRef } = useCountUp(291200)

  return (
    <main className="min-h-screen" style={{ background: '#FFFFFF' }}>
      <ScrollProgressBar />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          1 · HERO — dark background, stays as-is
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
        style={{ background: '#0D1117' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A843]/6 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#10B981]/4 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left col */}
          <div className="lg:col-span-3 space-y-8">
            {/* Badge */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 bg-[#10B981]/10 border border-[#10B981]/25 rounded-full px-4 py-2"
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
              className="text-[#94A3B8] text-lg leading-relaxed max-w-xl"
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
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-[#0D1117] text-sm"
                style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}
              >
                See How It Works
              </motion.a>
              <motion.a
                href="/demo/index.html"
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-[#D4A843] text-sm border border-[#D4A843]/40 hover:bg-[#D4A843]/5 transition-colors"
              >
                ▶ See it in action
              </motion.a>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              animate={reduced ? {} : { opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="flex flex-wrap gap-6 pt-2"
            >
              {[
                { number: '10+', label: 'Hours saved/week' },
                { number: '7 days', label: 'To go live' },
                { number: '30-day', label: 'ROI guarantee' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-white/10" />}
                  <div>
                    <div className="text-[#D4A843] font-bold text-lg leading-none">{s.number}</div>
                    <div className="text-[#64748B] text-xs mt-0.5">{s.label}</div>
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
          2 · TRUST BAR — #F1F5F9, light badges
      ════════════════════════════════════════════════════════════════ */}
      <motion.section
        {...fadeUp}
        className="py-10 px-6 border-y"
        style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#F1F5F9' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#475569] text-xs uppercase tracking-widest mb-8 font-semibold">
            Trusted by firms across England &amp; Wales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
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
                className="flex items-center gap-2 bg-white border rounded-full px-5 py-2.5"
                style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <span className={badge.mono ? 'text-[#10B981] font-bold' : 'text-base'}>{badge.icon}</span>
                <span className="text-[#475569] text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          3 · PROBLEM — #FFFFFF, dark text, white cards
      ════════════════════════════════════════════════════════════════ */}
      <section id="problem" className="py-28 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Your team is drowning in manual work
            </h2>
            <p className="text-[#475569] max-w-xl mx-auto">
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
                whileHover={reduced ? {} : { y: -4, borderColor: 'rgba(212,168,67,0.4)' }}
                className="rounded-2xl p-7 border transition-all cursor-default"
                style={{ background: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {item.hours}
                </div>
                <h3 className="text-[#0F172A] font-semibold mb-2">{item.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Count-up block */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
            whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl py-8 px-10 border text-center"
            style={{ background: 'rgba(212,168,67,0.05)', borderColor: 'rgba(212,168,67,0.2)' }}
          >
            <p className="text-[#475569] text-base">
              That is{' '}
              <strong className="text-[#0F172A]">18–28 billable hours per week</strong> your firm is giving away.
              At £200/hr, that is up to{' '}
              <strong className="text-[#D4A843]">
                £<span ref={revenueRef}>{reduced ? '291,200' : lostRevenue.toLocaleString()}</span> in lost revenue annually.
              </strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4 · FEATURES — #F8FAFC, white cards
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Everything your firm needs.{' '}
              <span className="text-[#94A3B8]">Nothing it doesn&apos;t.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                big: true, icon: '🤖', title: 'AI Client Intake',
                desc: "A potential client fills in a form. AI reads it, summarises the case, flags urgency, and has it ready for your solicitor — before they've had their morning coffee.",
                tag: '~3 hrs saved per client', tagColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25',
              },
              {
                big: true, icon: '⚡', title: 'Action Centre',
                desc: 'For every case, AI generates the next steps automatically. Schedule, send, check eligibility — one click. No more staring at a file wondering what to do next.',
                tag: 'Zero missed deadlines', tagColor: 'text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/25',
              },
              {
                big: false, icon: '📋', title: 'Gov.uk Checklist Automation',
                desc: 'Case-specific document lists built from gov.uk. Sent to your client automatically. Updated monthly.',
              },
              {
                big: false, icon: '📄', title: 'Instant Quote Generation',
                desc: 'Template-based quotes generated and emailed in seconds. No more copy-paste from old files.',
              },
              {
                big: false, icon: '💬', title: 'AI Chatbot Widget',
                desc: "Embed on your firm's website. Answers client questions 24/7 and routes new enquiries straight into your intake pipeline.",
              },
              {
                big: false, icon: '📅', title: 'Daily & Weekly Digests',
                desc: 'Every morning: which cases need attention. Every Monday: what the week looks like. Automated. No admin.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 30 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease }}
                whileHover={reduced ? {} : { borderColor: 'rgba(212,168,67,0.35)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', y: -3 }}
                className="rounded-2xl p-7 border transition-all cursor-default"
                style={{ background: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-[#0F172A] font-semibold mb-3">{card.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{card.desc}</p>
                {card.tag && (
                  <div className={`inline-flex mt-4 text-xs font-semibold px-3 py-1 rounded-full border ${card.tagColor}`}>
                    {card.tag}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5 · HOW IT WORKS — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              A simple process.{' '}
              <span className="text-[#94A3B8]">We do the heavy lifting.</span>
            </h2>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8 md:gap-0">
            <div
              className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.3),transparent)' }}
            />
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
                className="text-center px-6"
              >
                <motion.div
                  whileHover={reduced ? {} : { scale: 1.08, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border"
                  style={{ background: 'rgba(212,168,67,0.08)', borderColor: 'rgba(212,168,67,0.25)' }}
                >
                  <span className="text-[#D4A843] font-bold text-xl">{item.step}</span>
                </motion.div>
                <h3 className="text-[#0F172A] font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed mb-4">{item.desc}</p>
                <span
                  className="text-xs text-[#D4A843] font-medium px-3 py-1 rounded-full"
                  style={{ background: 'rgba(212,168,67,0.08)' }}
                >
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
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-[#0D1117] text-sm"
              style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}
            >
              Start with a Free Audit
            </a>
            <a
              href="/demo/index.html"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#D4A843] text-sm border border-[#D4A843]/40 hover:bg-[#D4A843]/5 transition-colors"
            >
              ▶ See it in action
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6 · COMPARISON TABLE — #F8FAFC, white table
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-4">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Built for firms like yours.{' '}
              <span className="text-[#94A3B8]">Unlike everything else.</span>
            </h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              The tools that dominate the market were built for large firms — or not built for the UK at all.
            </p>
          </motion.div>

          <div className="overflow-x-auto mt-12">
            <table
              className="w-full min-w-[600px] rounded-2xl overflow-hidden border bg-white"
              style={{ borderColor: 'rgba(0,0,0,0.08)' }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <th className="text-left py-3 px-4 text-[#94A3B8] text-sm font-medium w-44">Feature</th>
                  {['LexFlow', 'Clio', 'LEAP', 'Smokeball'].map((col, i) => (
                    <th key={col} className={`py-3 px-4 text-sm font-semibold text-center ${i === 0 ? 'text-[#D4A843]' : 'text-[#94A3B8]'}`}>
                      {i === 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#D4A843]/10 border border-[#D4A843]/30 px-3 py-1 rounded-full">
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
                    className="border-t"
                    style={{ borderColor: 'rgba(0,0,0,0.06)' }}
                  >
                    <td className="py-4 px-4 text-[#475569] text-sm">{row.feature}</td>
                    {[row.lexflow, row.clio, row.leap, row.smokeball].map((cell, j) => (
                      <td key={j} className={`py-4 px-4 text-sm text-center ${j === 0 ? 'bg-[#D4A843]/5 border-x border-[#D4A843]/15 font-medium' : ''}`}>
                        <span className={
                          cell === '✅' ? 'text-[#10B981] text-base' :
                          cell === '❌' ? 'text-[#94A3B8] text-base' :
                          cell.startsWith('⚠️') ? 'text-yellow-500 text-sm' :
                          j === 0 ? 'text-[#D4A843]' : 'text-[#475569]'
                        }>
                          {cell}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <motion.p {...fadeUp} className="text-center mt-6">
            <Link href="/why-not-harvey" className="text-[#D4A843] text-sm hover:underline">
              Why not Harvey AI? See the full comparison →
            </Link>
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7 · PRICING — #FFFFFF
      ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Simple, transparent pricing
            </h2>
            <p className="text-[#475569]">No hidden fees. No complicated contracts. No per-user charges.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={tier.tier} {...tier} delay={i * 0.15} />
            ))}
          </div>
          <p className="text-center text-[#94A3B8] text-sm mt-6">
            All prices exclude VAT. No hidden fees. No per-user charges.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8 · TESTIMONIALS — #F8FAFC, white cards
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
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
                className="rounded-2xl p-7 border"
                style={{ background: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="text-[#D4A843] text-3xl font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-[#475569] text-sm leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <div className="text-[#0F172A] text-sm font-semibold">{t.author}</div>
                  <div className="text-[#94A3B8] text-xs mt-0.5">{t.firm}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9 · FAQ — #F8FAFC, separated with border-top
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        className="py-28 px-6"
        style={{ background: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Common questions
            </h2>
            <p className="text-[#475569]">Everything you need to know before getting started.</p>
          </motion.div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10 · CTA + CONTACT — #FFFFFF, separated with border-top
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="py-28 px-6 relative"
        style={{ background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.08)', position: 'relative', zIndex: 10 }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#D4A843]/4 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 text-[#D4A843] text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-[#D4A843]/50" />
              Free Audit
              <span className="w-6 h-px bg-[#D4A843]/50" />
            </div>
            <h2 className="font-bold text-[#0F172A] mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              Ready to get your time back?
            </h2>
            <p className="text-[#475569] mb-10 leading-relaxed">
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
