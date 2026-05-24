'use client'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmName = (session?.user as any)?.firmName || 'My Firm'
  const userName = session?.user?.name || ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role || ''

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/cases', label: 'Cases' },
    { href: '/dashboard/leads', label: 'Leads' },
    { href: '/dashboard/team', label: 'Team' },
    { href: '/dashboard/settings', label: 'Settings' },
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
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
            <span className="text-white font-bold text-xl">Flow</span>
            <span className="text-white/30 text-sm ml-2">·</span>
            <span className="text-white/60 text-sm ml-2">{firmName}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
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
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-white text-sm font-medium">{userName}</div>
            <div className="text-white/30 text-xs">{ROLE_LABELS[role] || role}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-white/40 hover:text-white text-sm transition-colors border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
