'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { SignOutButton } from '@/components/SignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin">
            <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
            <span className="text-white font-bold text-xl">Flow</span>
            <span className="text-white/40 text-sm ml-2">Admin</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-white/60 hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link href="/admin/my-work" className="text-white/60 hover:text-white text-sm transition-colors">My Work</Link>
            <Link href="/admin/team" className="text-white/60 hover:text-white text-sm transition-colors">Team</Link>
            <Link href="/admin/reviews" className="text-white/60 hover:text-white text-sm transition-colors">Reviews</Link>
            <Link href="/admin/settings" className="text-white/60 hover:text-white text-sm transition-colors">Settings</Link>
            {(session?.user as Record<string, unknown>)?.role === 'platform_admin' && (
              <Link href="/admin/firms" className="text-[#c9a84c] hover:text-[#f0d080] text-sm transition-colors font-medium">Firms</Link>
            )}
          </div>
        </div>
        <SignOutButton />
      </nav>
      <main>{children}</main>
    </div>
  )
}
