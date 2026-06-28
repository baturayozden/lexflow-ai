'use client'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmName = (session?.user as any)?.firmName || 'My Firm'
  const userName = session?.user?.name || ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role || ''
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/cases', label: 'Cases' },
    { href: '/dashboard/leads', label: 'Leads' },
    { href: '/dashboard/team', label: 'Team' },
    { href: '/dashboard/firm-settings', label: 'Firm Settings' },
    { href: '/dashboard/settings', label: 'Account' },
    { href: '/dashboard/intake', label: '⚡ New Intake' },
  ]

  const ROLE_LABELS: Record<string, string> = {
    managing_partner: 'Managing Partner',
    senior_solicitor: 'Senior Solicitor',
    associate_solicitor: 'Associate Solicitor',
    paralegal: 'Paralegal',
    receptionist: 'Receptionist',
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Top nav */}
      <nav className="border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 min-w-0">
          <Link href="/dashboard" className="flex-shrink-0">
            <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
            <span className="text-white font-bold text-xl">Flow</span>
            <span className="text-white/30 text-sm ml-2 hidden md:inline">·</span>
            <span className="text-white/60 text-sm ml-1 hidden md:inline truncate max-w-[8rem]">{firmName}</span>
          </Link>
          <div className="hidden md:flex items-center gap-5">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors whitespace-nowrap ${
                  pathname === item.href
                    ? 'text-white font-medium'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-white text-sm font-medium">{userName}</div>
            <div className="text-white/30 text-xs">{ROLE_LABELS[role] || role}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="hidden md:block text-white/40 hover:text-white text-sm transition-colors border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30"
          >
            Sign out
          </button>
          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="md:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect y="3" width="18" height="1.8" rx="0.9" fill="currentColor"/><rect y="8.1" width="18" height="1.8" rx="0.9" fill="currentColor"/><rect y="13.2" width="18" height="1.8" rx="0.9" fill="currentColor"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0d1f3c]">
          <div className="px-4 py-2 space-y-0.5">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 pb-1">
              <div className="px-3 py-1.5">
                <div className="text-white text-sm font-medium">{userName}</div>
                <div className="text-white/30 text-xs">{ROLE_LABELS[role] || role} · {firmName}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-left px-3 py-2.5 text-red-400/70 hover:text-red-400 text-sm transition-colors rounded-lg hover:bg-red-500/5"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <main>{children}</main>
    </div>
  )
}
