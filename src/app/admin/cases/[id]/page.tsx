import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { StatusUpdater } from '@/components/StatusUpdater'
import { AssignSection } from '@/components/admin/AssignSection'
import { NotesSection } from '@/components/admin/NotesSection'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { ActionCentre } from '@/components/admin/ActionCentre'

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
  // Aggressively split header meta fields onto separate lines
  text = text
    .replace(/\*\*Date:\*\*/g, '\n**Date:**')
    .replace(/\*\*Prepared for:\*\*/g, '\n**Prepared for:**')
    .replace(/\*\*Case Reference:\*\*/g, '\n**Case Reference:**')
    .replace(/\*\*Name:\*\*/g, '\n**Name:**')
    .replace(/\*\*Date of Birth:\*\*/g, '\n**Date of Birth:**')
    .replace(/\*\*Nationality:\*\*/g, '\n**Nationality:**')
    .replace(/\*\*Current Location:\*\*/g, '\n**Current Location:**')
    .replace(/\*\*Current Visa:\*\*/g, '\n**Current Visa:**')
    .replace(/\*\*Current Visa Type:\*\*/g, '\n**Current Visa Type:**')
    .replace(/\*\*Expiry Date:\*\*/g, '\n**Expiry Date:**')
    .replace(/\*\*Visa Expiry:\*\*/g, '\n**Visa Expiry:**')
    .replace(/\*\*Case Type:\*\*/g, '\n**Case Type:**')
    .replace(/\*\*Client Query:\*\*/g, '\n**Client Query:**')
    .replace(/\*\*Priority Level:\*\*/g, '\n**Priority Level:**')
    .trim()
  // Force Date/Prepared for/Case Reference onto separate lines
  text = text.replace(/(\*\*Date:\*\*\s*[^\n*]+?)\s+(\*\*(?:Prepared for|Client Name|Matter):\*\*)/g, '$1\n$2')
  text = text.replace(/(\*\*(?:Prepared for|Client Name|Matter):\*\*\s*[^\n*]+?)\s+(\*\*(?:Case Reference|Reference|Matter Reference):\*\*)/g, '$1\n$2')
  text = text.replace(/(\*\*(?:Case Reference|Reference):\*\*\s*[^\n*]+?)\s+(\*\*(?:Date|Client|Priority|Status):\*\*)/g, '$1\n$2')
  // Fix header meta lines — put each on its own line
  text = text.replace(/(\*\*Date:\*\*[^\n]+)\s+(\*\*Prepared for:\*\*)/g, '$1\n$2')
  text = text.replace(/(\*\*Prepared for:\*\*[^\n]+)\s+(\*\*(?:Case Reference|Matter):\*\*)/g, '$1\n$2')
  text = text.replace(/(\*\*(?:Case Reference|Matter):\*\*[^\n]+)\s+(\*\*)/g, '$1\n$2')

  let result = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#### (.+)$/gm, '<p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:20px 0 6px 0;">$1</p>')
    .replace(/^### (.+)$/gm, '<p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:20px 0 6px 0;">$1</p>')
    .replace(/^## (.+)$/gm, '<p style="color:#c9a84c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:24px 0 8px 0;">$1</p>')
    .replace(/^# (.+)$/gm, '<p style="color:white;font-size:14px;font-weight:700;margin:0 0 16px 0;">$1</p>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0;"/>')

  result = result.replace(/(^- .+$(\n^- .+$)*)/gm, (match) => {
    const items = match.split('\n').map(line =>
      `<li style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:3px;">${line.replace(/^- /, '')}</li>`
    ).join('')
    return `<ul style="margin:6px 0 12px 16px;padding:0;list-style:disc;">${items}</ul>`
  })

  result = result.replace(/(^\d+\. .+$(\n^\d+\. .+$)*)/gm, (match) => {
    const items = match.split('\n').map(line =>
      `<li style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:3px;">${line.replace(/^\d+\. /, '')}</li>`
    ).join('')
    return `<ol style="margin:6px 0 12px 16px;padding:0;list-style:decimal;">${items}</ol>`
  })

  result = result
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n\n/g, '<br style="display:block;margin:6px 0;"/>')
    .replace(/\n/g, ' ')

  return result
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
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Case {c.reference_id}</span>
        </div>

        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{c.client_name}</h1>
            <p className="text-white/40 mt-1">
              {c.case_type} · {c.nationality} · {c.city}, {c.country}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/admin/cases/${c.id}/print`}
              target="_blank"
              rel="noreferrer"
              className="border border-white/20 text-white/60 text-sm px-4 py-2 rounded-lg hover:border-white/40 hover:text-white transition-colors"
            >
              🖨 Export PDF
            </a>
            <DeleteButton entityType="cases" entityId={c.id} redirectTo="/admin" />
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <StatusUpdater id={c.id} currentStatus={c.status} type="cases" />
        </div>

        {/* Assignment */}
        <div className="mb-6">
          <AssignSection entityType="cases" entityId={c.id} currentAssignedTo={c.assigned_to} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Client Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Email</div><div className="text-white text-sm">{c.client_email}</div></div>
              <div><div className="text-white/40 text-xs">Phone</div><div className="text-white text-sm">{c.client_phone || '—'}</div></div>
              <div><div className="text-white/40 text-xs">Nationality</div><div className="text-white text-sm">{c.nationality}</div></div>
              <div><div className="text-white/40 text-xs">Location</div><div className="text-white text-sm">{c.city}, {c.country}</div></div>
            </div>
          </div>

          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Case Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Case Type</div><div className="text-white text-sm">{c.case_type}</div></div>
              <div><div className="text-white/40 text-xs">Current Visa</div><div className="text-white text-sm">{c.visa_type}</div></div>
              <div><div className="text-white/40 text-xs">Visa Expiry</div><div className="text-white text-sm">{c.visa_expiry || 'Not provided'}</div></div>
              <div><div className="text-white/40 text-xs">Reference</div><div className="text-white text-sm font-mono text-xs">{c.reference_id}</div></div>
            </div>
          </div>

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
            data-ai-summary
            className="text-white/80 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(c.ai_summary) }}
          />
        </div>

        {/* Action Centre */}
        <div className="mb-6">
          <ActionCentre
            caseId={c.id}
            clientName={c.client_name}
            clientEmail={c.client_email}
            caseType={c.case_type}
            referenceId={c.reference_id}
            nationality={c.nationality}
            visaType={c.visa_type}
            description={c.description}
            aiSummary={c.ai_summary}
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
