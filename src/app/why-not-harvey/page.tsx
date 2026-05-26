import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why Not Harvey AI? | LexFlow — AI for Small UK Law Firms',
  description: 'Harvey AI costs £288,000/year and requires 20+ licences. LexFlow is built for small UK immigration and conveyancing firms. Starting at £997.',
  keywords: 'Harvey AI alternative, legal AI small law firm UK, affordable legal AI, immigration law software UK',
  openGraph: {
    title: 'Why Small UK Law Firms Choose LexFlow Over Harvey AI',
    description: 'Harvey AI costs £288,000/year. LexFlow starts at £997. Built specifically for UK immigration and conveyancing firms with 2-20 solicitors.',
  },
}

const comparisons = [
  {
    title: '20 minimum licences required',
    harvey: 'Harvey requires enterprise contracts with a minimum of 20 seats',
    lexflow: 'LexFlow works for firms of 1 to 20 people — no minimum',
    icon: '👥',
  },
  {
    title: '6-12 month implementation',
    harvey: 'Enterprise AI deployments typically take 6-12 months of IT work',
    lexflow: 'LexFlow is live in 5 working days — we do the setup for you',
    icon: '📅',
  },
  {
    title: 'US-centric legal knowledge',
    harvey: 'Harvey is trained primarily on US law and US legal workflows',
    lexflow: 'LexFlow is built exclusively for UK immigration and conveyancing law',
    icon: '🇬🇧',
  },
  {
    title: 'Legal research, not intake',
    harvey: 'Harvey excels at document review and legal research for complex matters',
    lexflow: 'LexFlow focuses on what small firms actually need: client intake, case workflow, and follow-up automation',
    icon: '🎯',
  },
  {
    title: 'Requires dedicated IT team',
    harvey: 'Enterprise implementations require IT procurement, security review, and ongoing maintenance',
    lexflow: 'No IT knowledge needed. If you can use email, you can use LexFlow',
    icon: '💻',
  },
  {
    title: '£288,000 per year minimum',
    harvey: 'At 20 licences × £12,000 per licence per year — before implementation costs',
    lexflow: 'LexFlow Quick Win is £997 one-time. Retainer is £1,500/month — everything included',
    icon: '💷',
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
    <div className="min-h-screen bg-[#0a1628]">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
            <span className="text-white font-bold text-xl">Flow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#pricing" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
              Pricing
            </Link>
            <Link href="/demo/index.html" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
              Demo
            </Link>
            <Link
              href="/#contact"
              className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
            >
              Book Free Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-red-400 text-sm font-medium">Harvey AI costs £288,000/year</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your firm needs AI.<br />
          <span className="text-[#c9a84c]">Not a £288K annual bill.</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Harvey AI is built for 500-solicitor Magic Circle firms. LexFlow is built for UK immigration
          and conveyancing firms with 2 to 20 solicitors. Same AI power. 99% less cost.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#contact"
            className="bg-[#c9a84c] text-[#0a1628] font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#f0d080] transition-colors"
          >
            Book a Free 20-Minute Audit →
          </Link>
          <Link
            href="/demo/index.html"
            className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg hover:border-white/40 transition-colors"
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
          <div className="bg-white/2 border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-white/40 font-bold text-5xl mb-2">£199</div>
            <div className="text-white/60 text-sm">Clio per user/month</div>
            <div className="text-white/30 text-xs mt-2">£14,328/year for 6 users · US-focused</div>
          </div>
          <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-[#c9a84c] text-[#0a1628] text-xs font-bold px-2 py-1 rounded-full">
              Best for you
            </div>
            <div className="text-[#c9a84c] font-bold text-5xl mb-2">£997</div>
            <div className="text-white/60 text-sm">LexFlow one-time setup</div>
            <div className="text-white/30 text-xs mt-2">No monthly fees · Built for UK firms</div>
          </div>
        </div>
      </section>

      {/* Harvey is not for you */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Harvey AI is brilliant — for the wrong firms
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Harvey AI&apos;s own evaluation guide lists 7 criteria for choosing legal AI. Here&apos;s what they
            don&apos;t say out loud.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((item, i) => (
            <div key={i} className="bg-white/2 border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-3">{item.title}</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-red-400 text-xs flex-shrink-0 mt-0.5">✗</span>
                  <p className="text-white/40 text-sm">{item.harvey}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400 text-xs flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-white/70 text-sm">{item.lexflow}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Feature comparison</h2>
          <p className="text-white/50">What actually matters for a 5-person UK immigration firm</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Feature</th>
                <th className="text-center px-6 py-4 text-white/40 text-sm font-medium">Harvey AI</th>
                <th className="text-center px-6 py-4 text-white/40 text-sm font-medium">Clio</th>
                <th className="text-center px-6 py-4 text-[#c9a84c] text-sm font-semibold">LexFlow</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([feature, harvey, clio, lexflow], i) => (
                <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                  <td className="px-6 py-3 text-white/70 text-sm">{feature}</td>
                  <td className="px-6 py-3 text-center text-sm">{harvey}</td>
                  <td className="px-6 py-3 text-center text-sm">{clio}</td>
                  <td className="px-6 py-3 text-center text-sm font-medium">{lexflow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who is LexFlow for */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">LexFlow is built for firms like yours</h2>
            <div className="space-y-4">
              {goodFitItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#c9a84c] text-xs">✓</span>
                  </div>
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/2 border border-white/10 rounded-2xl p-8">
            <h3 className="text-white font-bold text-xl mb-4">Not for you if:</h3>
            <div className="space-y-3">
              {badFitItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-red-400 text-sm flex-shrink-0">✗</span>
                  <span className="text-white/50 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-sm">We&apos;d rather be honest than sell to the wrong firm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <blockquote className="text-white text-xl font-medium mb-4 leading-relaxed">
            &quot;We went from spending 3 hours on each new client intake to under 15 minutes. The AI
            case summary alone saves us an hour per client.&quot;
          </blockquote>
          <p className="text-white/40 text-sm">Managing Partner, UK Immigration Law Firm</p>
          <p className="text-white/20 text-xs mt-1">(Early access client)</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to see if LexFlow is right for your firm?
        </h2>
        <p className="text-white/50 mb-8 max-w-xl mx-auto">
          Book a free 20-minute audit. We will map your current intake process and show you exactly
          what can be automated — no sales pressure.
        </p>
        <Link
          href="/#contact"
          className="inline-block bg-[#c9a84c] text-[#0a1628] font-bold px-10 py-5 rounded-xl text-lg hover:bg-[#f0d080] transition-colors"
        >
          Book My Free Audit →
        </Link>
        <p className="text-white/30 text-sm mt-3">Free · 20 minutes · No obligation</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[#c9a84c] font-bold">Lex</span>
            <span className="text-white font-bold">Flow</span>
            <span className="text-white/30 text-sm ml-2">AI Systems for UK Law Firms</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40 flex-wrap justify-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/demo/index.html" className="hover:text-white transition-colors">Demo</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-white/20 text-sm">© 2026 LexFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
