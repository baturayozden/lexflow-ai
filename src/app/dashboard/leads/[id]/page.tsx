import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { StatusUpdater } from '@/components/StatusUpdater'
import { NotesSection } from '@/components/NotesSection'
import Link from 'next/link'

export default async function DashboardLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { id } = await params
  const { data: l } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('firm_id', firmId)
    .single()

  if (!l) redirect('/dashboard/leads')

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/leads" className="text-white/40 hover:text-white text-sm transition-colors">← Leads</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">{l.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-bold text-2xl">{l.name}</h1>
          <p className="text-white/40 mt-1">
            {l.firm_type}
            {l.firm_name && ` · ${l.firm_name}`}
          </p>
        </div>
        <StatusUpdater id={l.id} currentStatus={l.status} type="leads" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Email</p>
          <a href={`mailto:${l.email}`} className="text-[#c9a84c] text-sm hover:underline break-all">{l.email}</a>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Phone</p>
          <a href={`tel:${l.phone}`} className="text-white text-sm">{l.phone || '—'}</a>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Submitted</p>
          <p className="text-white text-sm">
            {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {!!l.message && (
        <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Message</p>
          <p className="text-white/80 text-sm leading-relaxed">{l.message}</p>
        </div>
      )}

      <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-4">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="flex gap-3 flex-wrap">
          <a
            href={`mailto:${l.email}?subject=Re: Your Enquiry`}
            className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors"
          >
            ✉ Email Lead
          </a>
          {!!l.phone && (
            <a
              href={`tel:${l.phone}`}
              className="border border-white/20 text-white text-sm px-4 py-2.5 rounded-lg hover:border-white/40 transition-colors"
            >
              📞 Call Lead
            </a>
          )}
          <Link
            href="/dashboard/intake"
            className="border border-[#c9a84c]/30 text-[#c9a84c] text-sm px-4 py-2.5 rounded-lg hover:bg-[#c9a84c]/10 transition-colors"
          >
            ⚡ Convert to Case
          </Link>
        </div>
      </div>

      <NotesSection entityId={l.id} entityType="lead" />
    </div>
  )
}
