import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

function renderMarkdownToHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
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

  // Get firm if case belongs to one
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

  const actions: CaseAction[] = (c.case_actions || []) as CaseAction[]
  const completedActions = actions.filter(a => a.completed)

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background: white; font-size: 13px; line-height: 1.6; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid ${primaryColor}; }
    .firm-name { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    .firm-name span { color: ${primaryColor}; }
    .ref-box { text-align: right; }
    .ref-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; }
    .ref-number { font-size: 14px; font-weight: 700; color: ${primaryColor}; font-family: monospace; }
    .ref-date { font-size: 11px; color: #666; margin-top: 2px; }
    .client-header { background: #f8f9fa; border-left: 4px solid ${primaryColor}; padding: 16px 20px; margin-bottom: 24px; border-radius: 0 8px 8px 0; }
    .client-name { font-size: 20px; font-weight: 700; color: #1a1a2e; }
    .client-meta { color: #666; font-size: 12px; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; }
    .card-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .card-value { font-size: 13px; font-weight: 500; color: #1a1a2e; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${primaryColor}; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
    .section-content { color: #374151; font-size: 13px; line-height: 1.7; }
    .section-content h1, .section-content h2, .section-content h3, .section-content h4 { color: ${primaryColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 16px 0 6px; }
    .section-content li { margin-left: 16px; margin-bottom: 3px; }
    .section-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
    .action-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .action-dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
    .dot-done { background: #22c55e; }
    .dot-pending { background: #e5e7eb; border: 2px solid #d1d5db; }
    .dot-high { background: #fee2e2; border: 2px solid #fca5a5; }
    .action-text { font-size: 12px; flex: 1; }
    .action-text-done { color: #9ca3af; text-decoration: line-through; }
    .action-text-pending { color: #374151; }
    .action-status { font-size: 10px; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
    .status-done { color: #22c55e; }
    .status-high { color: #ef4444; }
    .status-medium { color: #f59e0b; }
    .status-low { color: #6b7280; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
    .footer-text { font-size: 11px; color: #999; }
    .print-btn { position: fixed; top: 20px; right: 20px; background: ${primaryColor}; color: #0a1628; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 100; }
    @media print { .print-btn { display: none; } .page { padding: 20px; } }
    @page { margin: 15mm; }
  `

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Case Summary — {c.client_name} — {c.reference_id}</title>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <button className="print-btn" />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: `document.querySelector('.print-btn').textContent='🖨 Save as PDF';document.querySelector('.print-btn').onclick=function(){window.print()};` }} />

        <div className="page">
          {/* Header */}
          <div className="header">
            <div>
              {firm?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={firm.logo_url as string} alt={firmName} style={{ height: '40px', marginBottom: '8px' }} />
              ) : (
                <div className="firm-name">
                  <span>{firmName.charAt(0)}</span>{firmName.slice(1)}
                </div>
              )}
              {!!firm?.address && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  {firm.address as string}
                  {!!firm.phone && ` · ${firm.phone as string}`}
                  {!!firm.email && ` · ${firm.email as string}`}
                </div>
              )}
            </div>
            <div className="ref-box">
              <div className="ref-label">Reference</div>
              <div className="ref-number">{c.reference_id}</div>
              <div className="ref-date">
                {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Client header */}
          <div className="client-header">
            <div className="client-name">{c.client_name}</div>
            <div className="client-meta">
              {c.case_type} · {c.nationality}
              {(c.city || c.country) && ` · ${[c.city, c.country].filter(Boolean).join(', ')}`}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid">
            <div className="card">
              <div className="card-label">Email</div>
              <div className="card-value">{c.client_email || '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Phone</div>
              <div className="card-value">{c.client_phone || '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Current Visa</div>
              <div className="card-value">{c.visa_type || '—'}</div>
            </div>
            <div className="card">
              <div className="card-label">Visa Expiry</div>
              <div className="card-value">
                {c.visa_expiry
                  ? new Date(c.visa_expiry).toLocaleDateString('en-GB')
                  : 'Not provided'}
              </div>
            </div>
          </div>

          {/* Description */}
          {!!c.description && (
            <div className="section">
              <div className="section-title">Client Description</div>
              <div className="section-content">{c.description}</div>
            </div>
          )}

          {/* AI Summary */}
          {!!c.ai_summary && (
            <div className="section">
              <div className="section-title">⚡ AI Case Summary</div>
              {/* eslint-disable-next-line react/no-danger */}
              <div className="section-content" dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(c.ai_summary) }} />
            </div>
          )}

          {/* Action steps */}
          {actions.length > 0 && (
            <div className="section">
              <div className="section-title">
                Action Steps ({completedActions.length}/{actions.length} completed)
              </div>
              {[...actions]
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map(action => (
                  <div key={action.id} className="action-item">
                    <div className={`action-dot ${action.completed ? 'dot-done' : action.urgency === 'high' ? 'dot-high' : 'dot-pending'}`} />
                    <div className={`action-text ${action.completed ? 'action-text-done' : 'action-text-pending'}`}>
                      {action.step}
                    </div>
                    <div className={`action-status ${action.completed ? 'status-done' : action.urgency === 'high' ? 'status-high' : action.urgency === 'medium' ? 'status-medium' : 'status-low'}`}>
                      {action.completed ? '✓ Done' : action.urgency}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            <div className="footer-text">
              {firmName} · Confidential · {new Date().toLocaleDateString('en-GB')}
            </div>
            <div className="footer-text">Powered by LexFlow</div>
          </div>
        </div>
      </body>
    </html>
  )
}
