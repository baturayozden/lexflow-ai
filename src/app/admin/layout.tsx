'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const role = (session?.user as Record<string, unknown>)?.role as string | undefined

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Top nav */}
      <nav className="border-b border-white/10 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-[#c9a84c] font-bold text-xl">Lex</span>
              <span className="text-white font-bold text-xl">Flow</span>
              <span className="text-white/30 text-xs ml-2">Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/my-work"
                className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                My Work
              </Link>
              <Link
                href="/admin/team"
                className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Team
              </Link>
              <Link
                href="/admin/reviews"
                className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Reviews
              </Link>
              <Link
                href="/admin/settings"
                className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Settings
              </Link>
              {role === 'platform_admin' && (
                <Link
                  href="/platform"
                  className="text-[#c9a84c] hover:text-[#f0d080] text-sm px-3 py-1.5 rounded-lg hover:bg-[#c9a84c]/5 transition-colors font-medium"
                >
                  Platform ↗
                </Link>
              )}
            </div>
          </div>
          <SignOutButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
