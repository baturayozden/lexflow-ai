import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function DashboardCasesPage() {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { data: cases } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name), case_actions(id, completed)')
    .eq('firm_id', firmId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white font-bold text-xl">Cases</h1>
      </div>
      <div className="space-y-3">
        {cases?.map(c => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const totalActions = (c.case_actions as any[])?.length || 0
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const completedActions = (c.case_actions as any[])?.filter((a: any) => a.completed).length || 0
          return (
            <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{c.client_name}</div>
                  <div className="text-white/40 text-sm mt-0.5">{c.case_type} · {c.nationality}</div>
                  <div className="text-white/30 text-xs mt-1">Ref: {c.reference_id}</div>
                </div>
                <div className="flex items-center gap-4">
                  {totalActions > 0 && (
                    <div className="text-right">
                      <div className="text-white/40 text-xs">Actions</div>
                      <div className={`text-sm font-medium ${completedActions === totalActions ? 'text-green-400' : 'text-[#c9a84c]'}`}>
                        {completedActions}/{totalActions}
                      </div>
                    </div>
                  )}
                  {!!c.team_members && (
                    <div className="text-right">
                      <div className="text-white/40 text-xs">Assigned</div>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <div className="text-white/60 text-sm">{(c.team_members as any).name}</div>
                    </div>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    c.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    c.status === 'reviewed' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-white/5 text-white/30 border-white/10'
                  }`}>{c.status}</span>
                </div>
              </div>
            </Link>
          )
        })}
        {!cases?.length && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">No cases yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
