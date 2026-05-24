import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getFirms } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'
import Link from 'next/link'

export default async function PlatformPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) {
    redirect('/admin')
  }

  const firms = await getFirms()

  const retainerCount = firms?.filter((f: Record<string, unknown>) => f.plan === 'retainer').length || 0
  const newThisMonth = firms?.filter((f: Record<string, unknown>) =>
    new Date(f.created_at as string) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length || 0

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#c9a84c] font-bold text-2xl">Lex</span>
            <span className="text-white font-bold text-2xl">Flow</span>
            <span className="text-white/40 text-sm ml-3">Platform Admin</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="border border-white/10 text-white/60 text-sm px-4 py-2 rounded-lg hover:border-white/30 transition-colors"
            >
              My Admin Panel
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <div className="text-[#c9a84c] font-bold text-3xl">{firms?.length || 0}</div>
            <div className="text-white/40 text-sm mt-1">Active Firms</div>
          </div>
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <div className="text-[#c9a84c] font-bold text-3xl">{retainerCount}</div>
            <div className="text-white/40 text-sm mt-1">Retainer Clients</div>
          </div>
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <div className="text-[#c9a84c] font-bold text-3xl">{newThisMonth}</div>
            <div className="text-white/40 text-sm mt-1">New This Month</div>
          </div>
        </div>

        {/* Firms list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Client Firms</h2>
          <Link
            href="/platform/firms/new"
            className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors"
          >
            + Add Client Firm
          </Link>
        </div>

        <div className="space-y-3">
          {firms?.map((firm: Record<string, unknown>) => (
            <Link
              key={firm.id as string}
              href={`/platform/firms/${firm.id}`}
              className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{firm.name as string}</div>
                  <div className="text-white/40 text-sm">{(firm.email as string) || '—'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border capitalize ${
                      firm.plan === 'retainer'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : firm.plan === 'full_setup'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    {firm.plan as string}
                  </span>
                  <div className="text-white/30 text-xs">
                    {new Date(firm.created_at as string).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!firms?.length && (
            <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/30 text-sm">No client firms yet.</p>
              <p className="text-white/20 text-xs mt-1">
                Add your first client firm to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
