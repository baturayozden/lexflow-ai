'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PricingCard from '@/components/PricingCard'
import ContactForm from '@/components/ContactForm'

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease },
  style: { pointerEvents: 'auto' as const },
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
    features: [
      'Complete AI back office',
      '2–3 week implementation',
      '60-day support included',
      'Staff training session',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    tier: 'Retainer',
    price: '£1,500',
    period: '/month',
    description: 'Best for hands-off growth',
    features: [
      'Everything managed ongoing',
      'New automation added monthly',
      'Dedicated Slack channel',
      'Monthly ROI report',
    ],
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
]

export default function Home() {
  return (
    <main className="bg-navy min-h-screen">
      <Navbar />
      <Hero />

      {/* Social proof bar */}
      <motion.section
        {...sectionAnim}
        className="bg-navy-light border-y border-white/5 py-4"
      >
        <p className="text-center text-white/40 text-sm">
          Built for immigration &amp; conveyancing firms across{' '}
          <span className="text-white/70">London</span>,{' '}
          <span className="text-white/70">Manchester</span>, and{' '}
          <span className="text-white/70">Bristol</span>
        </p>
      </motion.section>

      {/* Stats bar */}
      <motion.section
        className="py-16 px-6 border-b border-white/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '~3hrs', label: 'Saved per client intake' },
            { number: '5 days', label: 'Average setup time' },
            { number: '£997', label: 'Starting price' },
            { number: '24/7', label: 'AI works while you sleep' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-[#c9a84c] font-bold text-3xl md:text-4xl">{stat.number}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Problem */}
      <motion.section
        id="problem"
        {...sectionAnim}
        className="py-24 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your team is drowning in manual work</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every hour your fee-earners spend on admin is an hour not billed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Manual Client Intake',
                hours: '8–12 hrs/week',
                desc: 'Collecting forms, chasing documents, manually entering data into your case management system.',
              },
              {
                title: 'Document Prep & Templates',
                hours: '6–10 hrs/week',
                desc: 'Drafting the same letters and contracts from scratch — or hunting through old files for the right template.',
              },
              {
                title: 'Email Sorting & Responses',
                hours: '4–6 hrs/week',
                desc: 'Triaging enquiries, writing standard update emails, and following up clients who have not sent documents.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease }}
                whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.4)' }}
                style={{ pointerEvents: 'auto' }}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-colors"
              >
                <div className="text-gold font-bold text-lg mb-1">{item.hours} lost</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ pointerEvents: 'auto' }}
            className="mt-10 text-center bg-gold/5 border border-gold/20 rounded-2xl py-6 px-8"
          >
            <p className="text-white/80">
              That is{' '}
              <strong className="text-gold">18–28 billable hours per week</strong> your firm is
              giving away. At £200/hr, that is up to{' '}
              <strong className="text-gold">£291,200 in lost revenue annually.</strong>
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        id="how-it-works"
        {...sectionAnim}
        className="py-24 px-6 bg-navy-light"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-white/50">A simple, low-friction process. We do the heavy lifting.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Free Audit',
                desc: 'We spend 20 minutes mapping your manual processes. You get a clear picture of what can be automated.',
                tag: 'Completely free',
              },
              {
                step: '2',
                title: 'We Build & Install',
                desc: 'You approve the plan. We build everything and install directly into your existing tools.',
                tag: 'You do nothing technical',
              },
              {
                step: '3',
                title: 'You Save Time',
                desc: 'Go live in 7 days, measurable results in 30. Your team works on billable matters while AI handles the rest.',
                tag: 'Live in 7 days',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, ease }}
                style={{ pointerEvents: 'auto' }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-gold font-bold text-xl">{item.step}</span>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{item.desc}</p>
                <span className="text-xs text-gold bg-gold/10 px-3 py-1 rounded-full">
                  {item.tag}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ pointerEvents: 'auto' }}
            className="mt-12 text-center flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{ pointerEvents: 'auto' }}
              className="bg-gold text-navy font-bold px-8 py-4 rounded-xl"
            >
              Start with a Free Audit
            </motion.a>
            <motion.a
              href="/demo/index.html"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{ pointerEvents: 'auto' }}
              className="border border-gold/40 text-gold font-semibold px-8 py-4 rounded-xl hover:bg-gold/5 transition-colors"
            >
              ▶ See it in action
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section
        id="pricing"
        {...sectionAnim}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-white/50">No hidden fees. No complicated contracts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={tier.tier} {...tier} delay={i * 0.15} />
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-6">All prices exclude VAT.</p>
        </div>
      </motion.section>

      {/* Trust indicators */}
      <motion.section
        className="py-16 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/30 text-sm uppercase tracking-wider mb-8">Built for UK firms. Trusted from day one.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🇬🇧', title: 'UK-only focus', desc: 'Built exclusively for UK immigration & conveyancing law' },
              { icon: '🔒', title: 'GDPR compliant', desc: 'EU data residency, encrypted at rest and in transit' },
              { icon: '⚖️', title: 'Gov.uk verified', desc: 'Monthly compliance checks against official guidance' },
              { icon: '🤝', title: 'Done for you', desc: 'We set everything up — no technical knowledge needed' },
            ].map((item, i) => (
              <div key={i} className="bg-white/2 border border-white/10 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        {...sectionAnim}
        className="py-24 px-6 bg-navy-light"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                style={{ pointerEvents: 'auto' }}
                className="border border-white/10 rounded-xl p-6 hover:border-gold/30 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-16 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote: 'We used to spend 3 hours on every new client. Now it takes 15 minutes and the AI summary is ready for the solicitor.',
                author: 'Managing Partner',
                firm: 'UK Immigration Firm',
              },
              {
                quote: 'The checklist automation alone saved us from a compliance issue. The monthly gov.uk check flagged a change we had missed.',
                author: 'Senior Solicitor',
                firm: 'Conveyancing Practice',
              },
              {
                quote: "I was sceptical about AI but the setup was genuinely 5 days and it just works. No IT headaches.",
                author: 'Practice Manager',
                firm: 'Immigration & Family Law',
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/2 border border-white/10 rounded-xl p-6">
                <div className="text-[#c9a84c] text-2xl mb-3">&quot;</div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{t.quote}</p>
                <div>
                  <div className="text-white text-sm font-medium">{t.author}</div>
                  <div className="text-white/30 text-xs">{t.firm}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Book a free 20-minute audit</h2>
          <p className="text-white/50 mb-10">
            We will map your manual processes and show you exactly what can be automated.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6" style={{ pointerEvents: 'auto' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-gold font-bold text-xl">Lex</span>
            <span className="text-white font-bold text-xl">Flow</span>
            <p className="text-white/30 text-xs mt-1">AI systems for UK law firms</p>
          </div>
          <div className="flex gap-6 text-sm text-white/40 flex-wrap justify-center">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/why-not-harvey" className="hover:text-white transition-colors">Why not Harvey?</a>
          </div>
          <p className="text-white/20 text-sm">© 2026 LexFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
