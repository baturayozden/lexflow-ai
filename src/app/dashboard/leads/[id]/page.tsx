import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { StatusUpdater } from '@/components/StatusUpdater'
import { AssignSection } from '@/components/admin/AssignSection'
import { NotesSection } from '@/components/admin/NotesSection'
import Link from 'next/link'

export default async function DashboardLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { id } = await params

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('*, team_members(id, name, email, role)')
    .eq('id', id)
    .eq('firm_id', firmId)
    .single()

  if (!lead) redirect('/dashboard/leads')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/leads" className="text-white/40 hover:text-white text-sm transition-colors">← Leads</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">{lead.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-2xl">{lead.name}</h1>
          <p className="text-white/40 mt-1">{lead.firm_name} · {lead.firm_type}</p>
        </div>
        <StatusUpdater id={lead.id} currentStatus={lead.status} type="leads" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Email</p>
          <p className="text-white text-sm">{lead.email}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Phone</p>
          <p className="text-white text-sm">{lead.phone || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Date</p>
          <p className="text-white text-sm">{new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="mb-4">
        <AssignSection
          entityId={lead.id}
          entityType="leads"
          currentAssignedTo={lead.team_members ? (lead.team_members as Record<string, unknown>).id as string : null}
        />
      </div>

      {!!lead.message && (
        <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Message</p>
          <p className="text-white/80 text-sm">{lead.message}</p>
        </div>
      )}

      <NotesSection entityId={lead.id} entityType="lead" />
    </div>
  )
}
