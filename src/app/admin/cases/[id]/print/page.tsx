import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

function renderMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<h3 style="color:inherit;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:16px 0 6px;">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 style="font-size:14px;font-weight:700;margin:12px 0 6px;">$1</h2>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;margin-bottom:3px;">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left:16px;margin-bottom:3px;">$2</li>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;"/>')
    .replace(/\*\*Date:\*\*/g, '<br/><strong>Date:</strong>')
    .replace(/\*\*Prepared for:\*\*/g, '<br/><strong>Prepared for:</strong>')
    .replace(/\*\*Case Reference:\*\*/g, '<br/><strong>Case Reference:</strong>')
    .replace(/\*\*Name:\*\*/g, '<br/><strong>Name:</strong>')
    .replace(/\*\*Date of Birth:\*\*/g, '<br/><strong>Date of Birth:</strong>')
    .replace(/\*\*Nationality:\*\*/g, '<br/><strong>Nationality:</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, ' ')
}

interface CaseAction {
  id: string
  step: string
  urgency: string
  completed: boolean
  sort_order: number
}

export default async function AdminCasePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/admin/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isPlatformAdmin((session.user as any)?.role)) redirect('/admin')

  const { id } = await params

  const { data: c } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name), case_actions(*)')
    .eq('id', id)
    .single()

  if (!c) redirect('/admin')

  let firm: Record<string, unknown> | null = null
  if (c.firm_id) {
    const { data } = await supabaseAdmin
      .from('firms')
      .select('name, logo_url, primary_color, address, phone, email')
      .eq('id', c.firm_id)
      .single()
    firm = data
  }

  const primaryColor = (firm?.primary_color as string) || '#c9a84c'
  const firmName = (firm?.name as string) || 'LexFlow Demo'

  const actions = (c.case_actions || []) as CaseAction[]
  const completedActions = actions.filter(a => a.completed)
  const sortedActions = [...actions].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#1a1a2e', background: 'white', minHeight: '100vh' }}>
      {/* Print button */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }} className="no-print">
        <button
          id="print-btn"
          style={{ background: primaryColor, color: '#0a1628', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          🖨 Save as PDF
        </button>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn').onclick=function(){window.print()}` }} />
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `@media print{.no-print{display:none!important}}@page{margin:15mm}*{box-sizing:border-box}` }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: `2px solid ${primaryColor}` }}>
          <div>
            {firm?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={firm.logo_url as string} alt={firmName} style={{ height: '40px', marginBottom: '8px', display: 'block' }} />
            ) : (
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e' }}>{firmName}</div>
            )}
            {!!firm?.address && <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{firm.address as string}</div>}
            {!!firm?.email && <div style={{ fontSize: '11px', color: '#666' }}>{firm.email as string}{!!firm.phone && ` · ${firm.phone as string}`}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reference</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: primaryColor, fontFamily: 'monospace' }}>{c.reference_id}</div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Client header */}
        <div style={{ background: '#f8f9fa', borderLeft: `4px solid ${primaryColor}`, padding: '16px 20px', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e' }}>{c.client_name}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
            {c.case_type} · {c.nationality}
            {(c.city || c.country) && ` · ${[c.city, c.country].filter(Boolean).join(', ')}`}
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Email', value: c.client_email || '—' },
            { label: 'Phone', value: c.client_phone || '—' },
            { label: 'Current Visa', value: c.visa_type || '—' },
            { label: 'Visa Expiry', value: c.visa_expiry ? new Date(c.visa_expiry).toLocaleDateString('en-GB') : 'Not provided' },
          ].map((item, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a2e' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {!!c.description && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: primaryColor, marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb' }}>
              Client Description
            </div>
            <div style={{ color: '#374151', fontSize: '13px', lineHeight: 1.7 }}>{c.description}</div>
          </div>
        )}

        {/* AI Summary */}
        {!!c.ai_summary && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: primaryColor, marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb' }}>
              ⚡ AI Case Summary
            </div>
            {/* eslint-disable-next-line react/no-danger */}
            <div style={{ color: '#374151', fontSize: '13px', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(c.ai_summary) }} />
          </div>
        )}

        {/* Action steps */}
        {sortedActions.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: primaryColor, marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb' }}>
              Action Steps ({completedActions.length}/{sortedActions.length} completed)
            </div>
            {sortedActions.map(action => (
              <div key={action.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                  background: action.completed ? '#22c55e' : action.urgency === 'high' ? '#fee2e2' : '#e5e7eb',
                  border: action.completed ? 'none' : action.urgency === 'high' ? '2px solid #fca5a5' : '2px solid #d1d5db',
                }} />
                <div style={{ fontSize: '12px', color: action.completed ? '#9ca3af' : '#374151', flex: 1, textDecoration: action.completed ? 'line-through' : 'none' }}>
                  {action.step}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap', color: action.completed ? '#22c55e' : action.urgency === 'high' ? '#ef4444' : action.urgency === 'medium' ? '#f59e0b' : '#6b7280' }}>
                  {action.completed ? '✓ Done' : action.urgency}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '11px', color: '#999' }}>{firmName} · Confidential · {new Date().toLocaleDateString('en-GB')}</div>
          <div style={{ fontSize: '10px', color: '#ccc' }}>Powered by LexFlow</div>
        </div>

      </div>
    </div>
  )
}
