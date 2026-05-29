import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060f1a]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-2">
              <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
              <span className="text-white font-bold text-xl">Flow</span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed max-w-xs">
              AI systems for UK immigration and conveyancing law firms.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex gap-8 flex-wrap">
            <div>
              <p className="text-white/20 text-xs uppercase tracking-wider mb-3">Product</p>
              <div className="flex flex-col gap-2">
                <Link href="/#how-it-works" className="text-white/40 text-sm hover:text-white transition-colors">How It Works</Link>
                <Link href="/#pricing" className="text-white/40 text-sm hover:text-white transition-colors">Pricing</Link>
                <Link href="/why-not-harvey" className="text-white/40 text-sm hover:text-white transition-colors">Why not Harvey?</Link>
                <Link href="/demo/index.html" className="text-white/40 text-sm hover:text-white transition-colors">Live Demo</Link>
              </div>
            </div>
            <div>
              <p className="text-white/20 text-xs uppercase tracking-wider mb-3">Resources</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog" className="text-white/40 text-sm hover:text-white transition-colors">Blog</Link>
                <Link href="/#faq" className="text-white/40 text-sm hover:text-white transition-colors">FAQ</Link>
                <Link href="/#contact" className="text-white/40 text-sm hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Company details */}
            <div className="text-white/20 text-xs leading-relaxed space-y-0.5">
              <p>LexFlow is a brand owned by <span className="text-white/30">B4Mind Brand Consulting and Digital Marketing Ltd</span></p>
              <p>Company No. 11296210 · Registered office: 66 Paul Street, London, England, EC2A 4NA</p>
              <p>
                <a href="tel:+442036952872" className="hover:text-white/40 transition-colors">+44 203 695 2872</a>
                {' · '}
                <a href="mailto:hello@lexflow.co.uk" className="hover:text-white/40 transition-colors">hello@lexflow.co.uk</a>
              </p>
            </div>
            <p className="text-white/20 text-xs whitespace-nowrap">© {new Date().getFullYear()} LexFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
