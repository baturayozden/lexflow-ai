import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LfIcon } from '@/components/LfIcon'

export const metadata: Metadata = {
  title: 'Why Not Harvey AI? | LexFlow — AI for Small UK Law Firms',
  description: 'Harvey AI costs £288,000/year and requires 20+ licences. LexFlow is built for small UK immigration and conveyancing firms. From £199/month, fully set up.',
  keywords: 'Harvey AI alternative, legal AI small law firm UK, affordable legal AI, immigration law software UK',
  openGraph: {
    title: 'Why Small UK Law Firms Choose LexFlow Over Harvey AI',
    description: 'Harvey AI costs £288,000/year. LexFlow starts from £199/month, fully managed. Built specifically for UK immigration and conveyancing firms with 2-20 solicitors.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Small UK Law Firms Choose LexFlow Over Harvey AI',
    description: 'Harvey AI costs £288,000/year. LexFlow starts from £199/month, fully managed. Built specifically for UK immigration and conveyancing firms with 2-20 solicitors.',
  },
}

const comparisons = [
  {
    title: '20 minimum licences required',
    harvey: 'Harvey requires enterprise contracts with a minimum of 20 seats',
    lexflow: 'LexFlow works for firms of 1 to 20 people — no minimum',
    icon: 'features',
  },
  {
    title: '6-12 month implementation',
    harvey: 'Enterprise AI deployments typically take 6-12 months of IT work',
    lexflow: 'LexFlow is live in 5 working days — we do the setup for you',
    icon: 'clock',
  },
  {
    title: 'US-centric legal knowledge',
    harvey: 'Harvey is trained primarily on US law and US legal workflows',
    lexflow: 'LexFlow is built exclusively for UK immigration and conveyancing law',
    icon: 'flag',
  },
  {
    title: 'Legal research, not intake',
    harvey: 'Harvey excels at document review and legal research for complex matters',
    lexflow: 'LexFlow focuses on what small firms actually need: client intake, case workflow, and follow-up automation',
    icon: 'action-centre',
  },
  {
    title: 'Requires dedicated IT team',
    harvey: 'Enterprise implementations require IT procurement, security review, and ongoing maintenance',
    lexflow: 'No IT knowledge needed. If you can use email, you can use LexFlow',
    icon: 'step-build',
  },
  {
    title: '£288,000 per year minimum',
    harvey: 'At 20 licences × £12,000 per licence per year — before implementation costs',
    lexflow: 'LexFlow starts from £199/month with a one-time setup — everything included, first month free',
    icon: 'pricing',
  },
]

const tableRows: [string, string, string, string][] = [
  ['UK immigration law focus', '⚠️ Partial', '⚠️ Partial', '✅ Full'],
  ['AI client intake', '❌ No', '❌ No', '✅ Yes'],
  ['AI case summary', '✅ Yes', '❌ No', '✅ Yes'],
  ['Document checklist automation', '❌ No', '⚠️ Manual', '✅ Auto'],
  ['Small firm pricing (under £5K/yr)', '❌ No', '❌ No', '✅ Yes'],
  ['Setup in under 1 week', '❌ No', '⚠️ Partial', '✅ Yes'],
  ['No IT team required', '❌ No', '⚠️ Some tech needed', '✅ Yes'],
  ['UK GDPR compliant', '✅ Yes', '✅ Yes', '✅ Yes'],
  ['Gov.uk compliance updates', '❌ No', '❌ No', '✅ Monthly auto-check'],
  ['Free setup audit', '❌ No', '❌ No', '✅ Yes'],
]

const goodFitItems = [
  'UK immigration or conveyancing firm',
  '1 to 20 solicitors and support staff',
  'Spending hours on manual client intake',
  'Missing enquiries outside office hours',
  'Want AI without the enterprise price tag',
  'Need something working this week, not next year',
]

const badFitItems = [
  'You have 100+ solicitors and dedicated IT',
  'You need complex document drafting AI',
  'You are a US law firm',
  'You already have a working intake system',
]

export default function WhyNotHarveyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Shared Navbar — handles scroll-reactive white/transparent transition */}
      <Navbar />

      {/* ── HERO + BIG NUMBERS (dark, like main page hero) ─────────────────── */}
      <div style={{ background: '#0D1117' }}>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
            <span className="text-red-400 text-sm font-medium">Harvey AI costs £288,000/year</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your firm needs AI.<br />
            <span className="text-[#D4A843]">Not a £288K annual bill.</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Harvey AI is built for 500-solicitor Magic Circle firms. LexFlow is built for UK immigration
            and conveyancing firms with 2 to 20 solicitors. Same AI power. 99% less cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-[#0D1117] text-lg"
              style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}
            >
              Book a Free 20-Minute Audit →
            </Link>
            <Link
              href="/demo/index.html"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
            >
              Try the Demo
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-4">No sales pressure. No contract. Cancel anytime.</p>
        </section>

        {/* Big number comparison */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="text-red-400 font-bold text-5xl mb-2">£288K</div>
              <div className="text-white/60 text-sm">Harvey AI per year</div>
              <div className="text-white/30 text-xs mt-2">20 minimum licences · Enterprise only</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-white/40 font-bold text-5xl mb-2">£199</div>
              <div className="text-white/60 text-sm">Clio per user/month</div>
              <div className="text-white/30 text-xs mt-2">£14,328/year for 6 users · US-focused</div>
            </div>
            <div className="bg-[#D4A843]/5 border border-[#D4A843]/30 rounded-2xl p-8 text-center relative overflow-hidden">
              <div
                className="absolute top-3 right-3 text-[#0D1117] text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}
              >
                Best for you
              </div>
              <div className="text-[#D4A843] font-bold text-5xl mb-2">£199</div>
              <div className="text-white/60 text-sm">LexFlow per month</div>
              <div className="text-white/30 text-xs mt-2">From £199/mo + setup · First month free · Built for UK firms</div>
            </div>
          </div>
        </section>
      </div>

      {/* ── WHY HARVEY DOESN'T FIT — #F8FAFC ──────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              Harvey AI is brilliant — for the wrong firms
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Harvey AI&apos;s own evaluation guide lists 7 criteria for choosing legal AI. Here&apos;s what they
              don&apos;t say out loud.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.map((item, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-6"
                style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="lf-tile mb-3"><LfIcon name={item.icon} size={24} /></div>
                <h3 className="text-[#0F172A] font-semibold mb-3">{item.title}</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-red-500 text-xs flex-shrink-0 mt-0.5">✗</span>
                    <p className="text-[#94A3B8] text-sm">{item.harvey}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#10B981] text-xs flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-[#475569] text-sm">{item.lexflow}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE COMPARISON TABLE — #FFFFFF ─────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Feature comparison</h2>
            <p className="text-[#475569]">What actually matters for a 5-person UK immigration firm</p>
          </div>
          <div
            className="border rounded-2xl overflow-hidden overflow-x-auto bg-white"
            style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <table className="w-full min-w-[540px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <th className="text-left px-6 py-4 text-[#94A3B8] text-sm font-medium">Feature</th>
                  <th className="text-center px-6 py-4 text-[#94A3B8] text-sm font-medium">Harvey AI</th>
                  <th className="text-center px-6 py-4 text-[#94A3B8] text-sm font-medium">Clio</th>
                  <th className="text-center px-6 py-4 text-[#D4A843] text-sm font-semibold">LexFlow</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(([feature, harvey, clio, lexflow], i) => (
                  <tr
                    key={i}
                    className="border-t"
                    style={{ borderColor: 'rgba(0,0,0,0.06)', background: i % 2 !== 0 ? '#F8FAFC' : '#FFFFFF' }}
                  >
                    <td className="px-6 py-3 text-[#475569] text-sm">{feature}</td>
                    <td className="px-6 py-3 text-center text-sm text-[#94A3B8]">{harvey}</td>
                    <td className="px-6 py-3 text-center text-sm text-[#94A3B8]">{clio}</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-[#10B981]">{lexflow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR — #F8FAFC ─────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">LexFlow is built for firms like yours</h2>
              <div className="space-y-4">
                {goodFitItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.35)' }}
                    >
                      <span className="text-[#D4A843] text-xs">✓</span>
                    </div>
                    <span className="text-[#475569] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="bg-white border rounded-2xl p-8"
              style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-[#0F172A] font-bold text-xl mb-4">Not for you if:</h3>
              <div className="space-y-3">
                {badFitItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                    <span className="text-[#94A3B8] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <p className="text-[#94A3B8] text-sm">We&apos;d rather be honest than sell to the wrong firm.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL — #FFFFFF ──────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="border rounded-2xl p-10 text-center"
            style={{ background: 'rgba(212,168,67,0.04)', borderColor: 'rgba(212,168,67,0.2)' }}
          >
            <div className="flex justify-center mb-4"><div className="lf-tile lf-tile--featured"><LfIcon name="ai-spark" size={28} /></div></div>
            <blockquote className="text-[#0F172A] text-xl font-medium mb-4 leading-relaxed">
              &quot;We went from spending 3 hours on each new client intake to under 15 minutes. The AI
              case summary alone saves us an hour per client.&quot;
            </blockquote>
            <p className="text-[#94A3B8] text-sm">Managing Partner, UK Immigration Law Firm</p>
            <p className="text-[#CBD5E1] text-xs mt-1">(Early access client)</p>
          </div>
        </div>
      </section>

      {/* ── CTA — #F8FAFC ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ background: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
            Ready to see if LexFlow is right for your firm?
          </h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            Book a free 20-minute audit. We will map your current intake process and show you exactly
            what can be automated — no sales pressure.
          </p>
          <Link
            href="/#contact"
            className="inline-block font-bold px-10 py-5 rounded-xl text-lg text-[#0D1117] transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#D4A843,#E8BC5A)' }}
          >
            Book My Free Audit →
          </Link>
          <p className="text-[#94A3B8] text-sm mt-3">Free · 20 minutes · No obligation</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
