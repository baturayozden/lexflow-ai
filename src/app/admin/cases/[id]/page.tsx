import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { StatusUpdater } from '@/components/StatusUpdater'
import { AssignSection } from '@/components/admin/AssignSection'
import { NotesSection } from '@/components/admin/NotesSection'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getCase(id: string) {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name, email, role)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h4 class="text-[#c9a84c] font-semibold text-xs uppercase tracking-wider mt-5 mb-2">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-[#c9a84c] font-semibold text-sm uppercase tracking-wider mt-6 mb-2">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="text-white font-bold text-base mt-4 mb-2">$1</h2>')
    .replace(/^- (.+)$/gm, '<li class="text-white/70 text-sm ml-4 list-disc mb-1">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-white/70 text-sm ml-4 list-decimal mb-1">$2</li>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-4">')
    .replace(/\n\n/g, '<br/><br/>')
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/admin/login')

  const c = await getCase(id)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">← Dashboard</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Case {c.reference_id}</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{c.client_name}</h1>
            <p className="text-white/40 mt-1">{c.case_type} · {c.nationality} · {c.city}, {c.country}</p>
          </div>
          <DeleteButton entityType="cases" entityId={c.id} redirectTo="/admin" />
        </div>

        {/* Status updater */}
        <div className="mb-6">
          <StatusUpdater id={c.id} currentStatus={c.status} type="cases" />
        </div>

        {/* Assignment */}
        <div className="mb-6">
          <AssignSection entityType="cases" entityId={c.id} currentAssignedTo={c.assigned_to} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Client Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Client Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Email</div><div className="text-white text-sm">{c.client_email}</div></div>
              <div><div className="text-white/40 text-xs">Phone</div><div className="text-white text-sm">{c.client_phone || '—'}</div></div>
              <div><div className="text-white/40 text-xs">Nationality</div><div className="text-white text-sm">{c.nationality}</div></div>
              <div><div className="text-white/40 text-xs">Location</div><div className="text-white text-sm">{c.city}, {c.country}</div></div>
            </div>
          </div>

          {/* Case Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Case Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Case Type</div><div className="text-white text-sm">{c.case_type}</div></div>
              <div><div className="text-white/40 text-xs">Current Visa</div><div className="text-white text-sm">{c.visa_type}</div></div>
              <div><div className="text-white/40 text-xs">Visa Expiry</div><div className="text-white text-sm">{c.visa_expiry || 'Not provided'}</div></div>
              <div><div className="text-white/40 text-xs">Reference</div><div className="text-white text-sm font-mono text-xs">{c.reference_id}</div></div>
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Submission</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Date</div><div className="text-white text-sm">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
              <div><div className="text-white/40 text-xs">Time</div><div className="text-white text-sm">{new Date(c.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div></div>
              <div><div className="text-white/40 text-xs">IP Address</div><div className="text-white text-sm font-mono text-xs">{c.ip || '—'}</div></div>
              <div><div className="text-white/40 text-xs">Assigned</div><div className="text-white text-sm">{c.team_members?.name || '—'}</div></div>
            </div>
          </div>
        </div>

        {/* Client Description */}
        <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">Client&apos;s Description</h3>
          <p className="text-white/80 text-sm leading-relaxed">{c.description}</p>
        </div>

        {/* AI Summary */}
        <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#c9a84c]">⚡</span>
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">AI Case Summary</h3>
          </div>
          <div
            className="text-white/80 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(c.ai_summary) }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${c.client_email}?subject=Re: Your ${c.case_type} Enquiry&body=Dear ${c.client_name},%0D%0A%0D%0AThank you for your enquiry regarding your ${c.case_type}.%0D%0A%0D%0AReference: ${c.reference_id}`}
              className="bg-[#c9a84c] text-[#0a1628] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
            >
              ✉ Email Client
            </a>
            {c.client_phone && (
              <a
                href={`tel:${c.client_phone}`}
                className="border border-white/20 text-white text-sm px-4 py-2 rounded-lg hover:border-white/40 transition-colors"
              >
                📞 Call Client
              </a>
            )}
          </div>
        </div>

        {/* Notes */}
        <NotesSection entityType="case" entityId={c.id} />

      </div>
    </div>
  )
}
