import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getFirms } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'
import Link from 'next/link'

export default async function FirmsPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) redirect('/admin')

  const firms = await getFirms()

  const totalMRR = firms?.reduce((sum: number, f: Record<string, unknown>) => {
    const planValues: Record<string, number> = { retainer: 1500, full_setup: 0, quick_win: 0, starter: 0 }
    return sum + (planValues[f.plan as string] || 0)
  }, 0) || 0

  const retainerCount = firms?.filter((f: Record<string, unknown>) => f.plan === 'retainer').length || 0
  const newThisMonth = firms?.filter((f: Record<string, unknown>) =>
    new Date(f.created_at as string) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length || 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-xl">Client Firms</h1>
          <p className="text-white/40 text-sm mt-1">Manage all LexFlow client firms and their users</p>
        </div>
        <Link
          href="/admin/firms/new"
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors"
        >
          + Add Client Firm
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{firms?.length || 0}</div>
          <div className="text-white/40 text-sm mt-1">Total Firms</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{retainerCount}</div>
          <div className="text-white/40 text-sm mt-1">Retainer Clients</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{newThisMonth}</div>
          <div className="text-white/40 text-sm mt-1">New This Month</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">£{totalMRR.toLocaleString()}</div>
          <div className="text-white/40 text-sm mt-1">Monthly MRR</div>
        </div>
      </div>

      {/* Firms list */}
      <div className="space-y-3">
        {firms?.map((firm: Record<string, unknown>) => (
          <Link
            key={firm.id as string}
            href={`/admin/firms/${firm.id}`}
            className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {firm.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={firm.logo_url as string}
                    alt={firm.name as string}
                    className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] font-bold text-sm">
                    {(firm.name as string).charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-white font-medium">{firm.name as string}</div>
                  <div className="text-white/40 text-sm">{(firm.email as string) || '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white/40 text-xs">Plan</div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    firm.plan === 'retainer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    firm.plan === 'full_setup' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    firm.plan === 'quick_win' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {(firm.plan as string)?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs">Added</div>
                  <div className="text-white/60 text-sm">
                    {new Date(firm.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-white/20 text-sm">→</div>
              </div>
            </div>
          </Link>
        ))}
        {!firms?.length && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">No client firms yet.</p>
            <p className="text-white/20 text-xs mt-1">Add your first client firm to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
