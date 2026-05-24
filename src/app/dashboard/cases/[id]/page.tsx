import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { ActionCentre } from '@/components/admin/ActionCentre'
import { StatusUpdater } from '@/components/StatusUpdater'
import { AssignSection } from '@/components/admin/AssignSection'
import { NotesSection } from '@/components/admin/NotesSection'
import Link from 'next/link'

function renderMarkdown(text: string): string {
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

export default async function DashboardCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { id } = await params

  const { data: c } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(id, name, email, role)')
    .eq('id', id)
    .eq('firm_id', firmId)
    .single()

  if (!c) redirect('/dashboard/cases')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/cases" className="text-white/40 hover:text-white text-sm transition-colors">← Cases</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">{c.client_name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-2xl">{c.client_name}</h1>
          <p className="text-white/40 mt-1">{c.case_type} · {c.nationality} · {c.city}, {c.country}</p>
        </div>
        <StatusUpdater id={c.id} currentStatus={c.status} type="cases" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Email</p>
          <p className="text-white text-sm">{c.client_email}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Phone</p>
          <p className="text-white text-sm">{c.client_phone || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Reference</p>
          <p className="text-white text-sm font-mono text-xs">{c.reference_id}</p>
        </div>
      </div>

      <div className="mb-4">
        <AssignSection
          entityId={c.id}
          entityType="cases"
          currentAssignedTo={c.team_members ? (c.team_members as Record<string, unknown>).id as string : null}
        />
      </div>

      <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-4">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Client Description</p>
        <p className="text-white/80 text-sm">{c.description}</p>
      </div>

      <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#c9a84c]">⚡</span>
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">AI Case Summary</h3>
        </div>
        <div
          className="text-white/80 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(c.ai_summary || '') }}
        />
      </div>

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

      <div className="mt-4">
        <NotesSection entityId={c.id} entityType="case" />
      </div>
    </div>
  )
}
