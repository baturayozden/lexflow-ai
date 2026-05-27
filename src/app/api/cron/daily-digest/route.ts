import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all active firms (not platform)
  const { data: firms } = await supabaseAdmin
    .from('firms')
    .select('*, users(email, name, role)')
    .eq('active', true)
    .neq('plan', 'platform')

  if (!firms?.length) return NextResponse.json({ success: true, sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const firm of firms) {
    // Check notification prefs
    const prefs = (firm.notification_prefs as Record<string, boolean>) || {}
    if (prefs.daily_digest === false) continue

    const firmId = firm.id as string

    // Get yesterday's stats
    const [newCasesRes, newLeadsRes, pendingActionsRes, highPriorityRes] = await Promise.all([
      supabaseAdmin
        .from('cases')
        .select('id, client_name, case_type')
        .eq('firm_id', firmId)
        .is('deleted_at', null)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString()),
      supabaseAdmin
        .from('leads')
        .select('id, name, firm_type')
        .eq('firm_id', firmId)
        .is('deleted_at', null)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString()),
      supabaseAdmin
        .from('case_actions')
        .select('id, step, urgency, case_id')
        .eq('completed', false),
      supabaseAdmin
        .from('case_actions')
        .select('id, step, case_id')
        .eq('completed', false)
        .eq('urgency', 'high'),
    ])

    const newCases = newCasesRes.data || []
    const newLeads = newLeadsRes.data || []
    const allPending = pendingActionsRes.data || []
    const highPriority = highPriorityRes.data || []

    // Get firm case IDs to filter actions
    const { data: firmCases } = await supabaseAdmin
      .from('cases')
      .select('id')
      .eq('firm_id', firmId)
      .is('deleted_at', null)

    const firmCaseIds = new Set((firmCases || []).map((c: { id: string }) => c.id))
    const firmPendingActions = allPending.filter((a: { case_id: string }) => firmCaseIds.has(a.case_id))
    const firmHighPriority = highPriority.filter((a: { case_id: string }) => firmCaseIds.has(a.case_id))

    // Skip if nothing to report
    if (newCases.length === 0 && newLeads.length === 0 && firmHighPriority.length === 0) continue

    // Find managing partner email
    const managingPartner = (firm.users as { email: string; name: string; role: string }[])
      ?.find(u => u.role === 'managing_partner')
    if (!managingPartner?.email) continue

    const dateStr = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

    const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <span style="color:#c9a84c;font-size:22px;font-weight:700;">Lex</span>
          <span style="color:#ffffff;font-size:22px;font-weight:700;">Flow</span>
          <span style="color:rgba(255,255,255,0.4);font-size:14px;margin-left:12px;">Daily Digest</span>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#ffffff;font-size:18px;margin:0 0 4px;">Good morning, ${managingPartner.name?.split(' ')[0] || 'there'}</h2>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 24px;">${dateStr} · ${firm.name as string}</p>

          ${firmHighPriority.length > 0 ? `
          <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:16px 20px;margin-bottom:20px;">
            <p style="color:#f87171;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">⚠ ${firmHighPriority.length} High Priority Action${firmHighPriority.length > 1 ? 's' : ''}</p>
            ${(firmHighPriority as { step: string }[]).slice(0, 3).map(a => `<p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 4px;">• ${a.step}</p>`).join('')}
            ${firmHighPriority.length > 3 ? `<p style="color:rgba(255,255,255,0.3);font-size:12px;margin:4px 0 0;">+${firmHighPriority.length - 3} more</p>` : ''}
          </div>` : ''}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="33%" style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;">
                <div style="color:#c9a84c;font-size:28px;font-weight:700;">${newCases.length}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">New Cases</div>
              </td>
              <td width="4%"></td>
              <td width="33%" style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;">
                <div style="color:#c9a84c;font-size:28px;font-weight:700;">${newLeads.length}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">New Leads</div>
              </td>
              <td width="4%"></td>
              <td width="33%" style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;">
                <div style="color:${firmHighPriority.length > 0 ? '#f87171' : '#c9a84c'};font-size:28px;font-weight:700;">${firmPendingActions.length}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">Pending Actions</div>
              </td>
            </tr>
          </table>

          ${newCases.length > 0 ? `
          <div style="margin-bottom:20px;">
            <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Yesterday's Cases</p>
            ${(newCases as { client_name: string; case_type: string }[]).slice(0, 5).map(c => `
              <div style="border-bottom:1px solid rgba(255,255,255,0.06);padding:10px 0;">
                <span style="color:#ffffff;font-size:14px;font-weight:500;">${c.client_name}</span>
                <span style="color:rgba(255,255,255,0.4);font-size:13px;margin-left:8px;">— ${c.case_type}</span>
              </div>`).join('')}
          </div>` : ''}

          ${newLeads.length > 0 ? `
          <div style="margin-bottom:24px;">
            <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Yesterday's Leads</p>
            ${(newLeads as { name: string; firm_type: string }[]).slice(0, 5).map(l => `
              <div style="border-bottom:1px solid rgba(255,255,255,0.06);padding:10px 0;">
                <span style="color:#ffffff;font-size:14px;font-weight:500;">${l.name}</span>
                <span style="color:rgba(255,255,255,0.4);font-size:13px;margin-left:8px;">— ${l.firm_type}</span>
              </div>`).join('')}
          </div>` : ''}

          <a href="https://app.lexflow.co.uk/dashboard" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
            Open Dashboard →
          </a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
            LexFlow Daily Digest · <a href="https://app.lexflow.co.uk/dashboard/firm-settings" style="color:rgba(255,255,255,0.3);">Manage notifications</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    try {
      await resend.emails.send({
        from: 'LexFlow <notifications@lexflow.co.uk>',
        to: managingPartner.email,
        subject: `${firm.name as string} — Daily Digest: ${newCases.length} new case${newCases.length !== 1 ? 's' : ''}, ${firmPendingActions.length} pending action${firmPendingActions.length !== 1 ? 's' : ''}`,
        html: emailHtml,
      })
      sent++
      console.log(`[daily-digest] Sent to ${managingPartner.email} (${firm.name as string})`)
    } catch (err) {
      console.error(`[daily-digest] Failed for ${firm.name as string}:`, err)
    }
  }

  return NextResponse.json({ success: true, sent, firms: firms.length })
}
