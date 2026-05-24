import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function DashboardLeadsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('firm_id', firmId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-white font-bold text-xl mb-8">Leads</h1>
      <div className="space-y-3">
        {leads?.map(l => (
          <Link key={l.id} href={`/dashboard/leads/${l.id}`} className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{l.name}</div>
                <div className="text-white/40 text-sm mt-0.5">{l.firm_name} · {l.firm_type}</div>
                <div className="text-white/30 text-xs mt-1">{l.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-white/30 text-xs">{new Date(l.created_at).toLocaleDateString('en-GB')}</div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  l.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  l.status === 'qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  l.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-white/5 text-white/30 border-white/10'
                }`}>{l.status}</span>
              </div>
            </div>
          </Link>
        ))}
        {!leads?.length && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">No leads yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
