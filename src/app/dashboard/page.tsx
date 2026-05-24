import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  reviewed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  awaiting_docs: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  submitted: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any
  const firmId = user?.firmId
  if (!firmId) redirect('/login')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [leadsRes, casesRes, teamRes] = await Promise.all([
    supabaseAdmin
      .from('leads')
      .select('id, name, email, status, created_at')
      .eq('firm_id', firmId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('cases')
      .select('id, client_name, case_type, nationality, status, created_at, reference_id')
      .eq('firm_id', firmId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('users')
      .select('id')
      .eq('firm_id', firmId)
      .eq('active', true),
  ])

  const leads = leadsRes.data || []
  const cases = casesRes.data || []
  const teamCount = teamRes.data?.length || 0

  const now = Date.now()
  const thisMonth = cases.filter(c => new Date(c.created_at) > new Date(now - 30 * 24 * 60 * 60 * 1000)).length
  const newCases = cases.filter(c => c.status === 'new')
  const newLeads = leads.filter(l => l.status === 'new').length

  // Value metrics — 2.5 hours saved per AI case summary at £150/hr equivalent
  const hoursSaved = Math.round(cases.length * 2.5)
  const moneySaved = hoursSaved * 150

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl">{greeting}, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-white/40 mt-1 text-sm">Here&apos;s your firm&apos;s snapshot for today.</p>
        </div>
        <Link
          href="/dashboard/intake"
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors"
        >
          New Client Intake
        </Link>
      </div>

      {/* Value stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{cases.length}</div>
          <div className="text-white/40 text-sm mt-1">Total Cases</div>
          {thisMonth > 0 && <div className="text-green-400 text-xs mt-1">+{thisMonth} this month</div>}
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{leads.length}</div>
          <div className="text-white/40 text-sm mt-1">Total Leads</div>
          {newLeads > 0 && <div className="text-blue-400 text-xs mt-1">{newLeads} new</div>}
        </div>
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{hoursSaved}h</div>
          <div className="text-white/40 text-sm mt-1">Hours Saved by AI</div>
          <div className="text-white/25 text-xs mt-1">2.5h per AI summary</div>
        </div>
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">£{moneySaved.toLocaleString()}</div>
          <div className="text-white/40 text-sm mt-1">Value Recovered</div>
          <div className="text-white/25 text-xs mt-1">at £150/hr equivalent</div>
        </div>
      </div>

      {/* Action alerts */}
      {newCases.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <div>
                <p className="text-white text-sm font-semibold">
                  {newCases.length} case{newCases.length > 1 ? 's' : ''} awaiting review
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {newCases.slice(0, 2).map(c => c.client_name).join(', ')}
                  {newCases.length > 2 ? ` +${newCases.length - 2} more` : ''}
                </p>
              </div>
            </div>
            <Link href="/dashboard/cases" className="text-blue-400 text-xs hover:underline">
              Review now →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent cases */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Recent Cases</h2>
            <Link href="/dashboard/cases" className="text-[#c9a84c] text-xs hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {cases.slice(0, 6).map(c => (
              <Link
                key={c.id}
                href={`/dashboard/cases/${c.id}`}
                className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{c.client_name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{c.case_type}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ml-3 ${STATUS_COLORS[c.status] || 'bg-white/5 text-white/30 border-white/10'}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
            {!cases.length && (
              <div className="bg-white/2 border border-white/10 rounded-xl p-8 text-center">
                <p className="text-white/30 text-sm">No cases yet.</p>
                <Link href="/dashboard/intake" className="text-[#c9a84c] text-xs mt-2 block hover:underline">
                  Submit first intake →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent leads + team */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm">Recent Leads</h2>
              <Link href="/dashboard/leads" className="text-[#c9a84c] text-xs hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {leads.slice(0, 4).map(l => (
                <Link
                  key={l.id}
                  href={`/dashboard/leads/${l.id}`}
                  className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{l.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">{l.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ml-3 ${STATUS_COLORS[l.status] || 'bg-white/5 text-white/30 border-white/10'}`}>
                      {l.status}
                    </span>
                  </div>
                </Link>
              ))}
              {!leads.length && (
                <div className="bg-white/2 border border-white/10 rounded-xl p-8 text-center">
                  <p className="text-white/30 text-sm">No leads yet.</p>
                  <Link href="/dashboard/leads" className="text-[#c9a84c] text-xs mt-2 block hover:underline">
                    Add first lead →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Team stat */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/40 text-xs mb-1">Active Team Members</div>
                <div className="text-white font-bold text-2xl">{teamCount}</div>
              </div>
              <Link href="/dashboard/team" className="text-[#c9a84c] text-xs hover:underline">Manage →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
