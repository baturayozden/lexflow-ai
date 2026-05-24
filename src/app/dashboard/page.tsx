import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  // Fetch firm stats
  const [leadsRes, casesRes, teamRes] = await Promise.all([
    supabaseAdmin.from('leads').select('id, status, created_at').eq('firm_id', firmId).is('deleted_at', null),
    supabaseAdmin.from('cases').select('id, status, case_type, client_name, created_at').eq('firm_id', firmId).is('deleted_at', null),
    supabaseAdmin.from('users').select('id, name, role, active').eq('firm_id', firmId).eq('active', true),
  ])

  const leads = leadsRes.data || []
  const cases = casesRes.data || []
  const team = teamRes.data || []

  const newLeads = leads.filter(l => l.status === 'new').length
  const newCases = cases.filter(c => c.status === 'new').length
  const thisWeekCases = cases.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white font-bold text-2xl">Good morning 👋</h1>
        <p className="text-white/40 mt-1">Here&apos;s what&apos;s happening at your firm today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{leads.length}</div>
          <div className="text-white/40 text-sm mt-1">Total Leads</div>
          {newLeads > 0 && <div className="text-green-400 text-xs mt-1">+{newLeads} new</div>}
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{cases.length}</div>
          <div className="text-white/40 text-sm mt-1">Total Cases</div>
          {thisWeekCases > 0 && <div className="text-green-400 text-xs mt-1">+{thisWeekCases} this week</div>}
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{newCases}</div>
          <div className="text-white/40 text-sm mt-1">Pending Review</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <div className="text-[#c9a84c] font-bold text-3xl">{team.length}</div>
          <div className="text-white/40 text-sm mt-1">Team Members</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Cases</h2>
            <Link href="/dashboard/cases" className="text-[#c9a84c] text-xs hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {cases.slice(0, 5).map(c => (
              <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white text-sm font-medium">{c.client_name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{c.case_type}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    c.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    c.status === 'reviewed' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-white/5 text-white/30 border-white/10'
                  }`}>{c.status}</span>
                </div>
              </Link>
            ))}
            {!cases.length && <p className="text-white/30 text-sm">No cases yet.</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Leads</h2>
            <Link href="/dashboard/leads" className="text-[#c9a84c] text-xs hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {leads.slice(0, 5).map(l => (
              <Link key={l.id} href={`/dashboard/leads/${l.id}`} className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors">
                <div className="flex justify-between items-start">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="text-white text-sm font-medium">{(l as any).name || 'Lead'}</div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    l.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    l.status === 'qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    'bg-white/5 text-white/30 border-white/10'
                  }`}>{l.status}</span>
                </div>
              </Link>
            ))}
            {!leads.length && <p className="text-white/30 text-sm">No leads yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
