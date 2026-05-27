import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)

  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  twoWeeksAgo.setHours(0, 0, 0, 0)

  // Get all active firms
  const { data: firms } = await supabaseAdmin
    .from('firms')
    .select('*, users(email, name, role)')
    .eq('active', true)
    .neq('plan', 'platform')

  if (!firms?.length) return NextResponse.json({ success: true, sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const firm of firms) {
    const prefs = (firm.notification_prefs || {}) as Record<string, boolean>
    if (prefs.weekly_summary === false) continue

    const firmId = firm.id

    // Get this week vs last week stats
    const [
      thisWeekCasesRes,
      lastWeekCasesRes,
      thisWeekLeadsRes,
      lastWeekLeadsRes,
      allCasesRes,
      pendingActionsRes,
    ] = await Promise.all([
      supabaseAdmin.from('cases').select('id, client_name, case_type, status').eq('firm_id', firmId).is('deleted_at', null).gte('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('cases').select('id').eq('firm_id', firmId).is('deleted_at', null).gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('leads').select('id, name, status').eq('firm_id', firmId).is('deleted_at', null).gte('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('leads').select('id').eq('firm_id', firmId).is('deleted_at', null).gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('cases').select('id, status').eq('firm_id', firmId).is('deleted_at', null),
      supabaseAdmin.from('case_actions').select('id, completed, urgency, step, case_id').eq('completed', false),
    ])

    const thisWeekCases = thisWeekCasesRes.data || []
    const lastWeekCases = lastWeekCasesRes.data || []
    const thisWeekLeads = thisWeekLeadsRes.data || []
    const lastWeekLeads = lastWeekLeadsRes.data || []
    const allCases = allCasesRes.data || []
    const allPending = pendingActionsRes.data || []

    const firmCaseIds = new Set(allCases.map(c => c.id))
    const pendingActions = allPending.filter(a => firmCaseIds.has(a.case_id))
    const highPriorityActions = pendingActions.filter(a => a.urgency === 'high')

    // Pipeline counts
    const pipeline = {
      new: allCases.filter(c => c.status === 'new').length,
      reviewed: allCases.filter(c => c.status === 'reviewed').length,
      archived: allCases.filter(c => c.status === 'archived').length,
    }

    // Time saved estimate
    const hoursSaved = thisWeekCases.length * 1
    const moneySaved = hoursSaved * 200

    // WoW change
    const casesChange = thisWeekCases.length - lastWeekCases.length
    const leadsChange = thisWeekLeads.length - lastWeekLeads.length

    const users = firm.users as Array<{ email: string; name: string; role: string }>
    const managingPartner = users?.find(u => u.role === 'managing_partner')
    if (!managingPartner?.email) continue

    const weekStr = weekAgo.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    function changeLabel(n: number): string {
      if (n > 0) return `<span style="color:#22c55e;font-size:11px;">↑ ${n} vs last week</span>`
      if (n < 0) return `<span style="color:#ef4444;font-size:11px;">↓ ${Math.abs(n)} vs last week</span>`
      return `<span style="color:#9ca3af;font-size:11px;">same as last week</span>`
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <span style="color:#c9a84c;font-size:22px;font-weight:700;">Lex</span>
          <span style="color:#ffffff;font-size:22px;font-weight:700;">Flow</span>
          <span style="color:rgba(255,255,255,0.4);font-size:14px;margin-left:12px;">Weekly Summary</span>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#ffffff;font-size:18px;margin:0 0 4px;">Weekly Summary</h2>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 24px;">${weekStr} – ${todayStr} · ${firm.name}</p>

          ${highPriorityActions.length > 0 ? `
          <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="color:#f87171;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">⚠ ${highPriorityActions.length} High Priority Action${highPriorityActions.length !== 1 ? 's' : ''} Need Attention</p>
            ${highPriorityActions.slice(0, 3).map(a => `<p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 4px;">• ${a.step}</p>`).join('')}
          </div>` : ''}

          <!-- This week stats -->
          <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">This Week</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="48%" style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;text-align:center;">
                <div style="color:#c9a84c;font-size:32px;font-weight:700;">${thisWeekCases.length}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:12px;margin:4px 0;">New Cases</div>
                <div>${changeLabel(casesChange)}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;text-align:center;">
                <div style="color:#c9a84c;font-size:32px;font-weight:700;">${thisWeekLeads.length}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:12px;margin:4px 0;">New Leads</div>
                <div>${changeLabel(leadsChange)}</div>
              </td>
            </tr>
          </table>

          <!-- Time saved -->
          ${hoursSaved > 0 ? `
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:16px 20px;margin-bottom:24px;text-align:center;">
            <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">⚡ Estimated Time Saved This Week</p>
            <p style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">~${hoursSaved} hour${hoursSaved !== 1 ? 's' : ''}</p>
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:4px 0 0;">≈ £${moneySaved.toLocaleString()} in billable time</p>
          </div>` : ''}

          <!-- Pipeline -->
          <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Current Pipeline</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="31%" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:14px;text-align:center;">
                <div style="color:#60a5fa;font-size:24px;font-weight:700;">${pipeline.new}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px;">New</div>
              </td>
              <td width="3%"></td>
              <td width="31%" style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:8px;padding:14px;text-align:center;">
                <div style="color:#facc15;font-size:24px;font-weight:700;">${pipeline.reviewed}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px;">In Review</div>
              </td>
              <td width="3%"></td>
              <td width="31%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;text-align:center;">
                <div style="color:rgba(255,255,255,0.3);font-size:24px;font-weight:700;">${pipeline.archived}</div>
                <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px;">Closed</div>
              </td>
            </tr>
          </table>

          <!-- Pending actions summary -->
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;">
            You have <strong style="color:#ffffff;">${pendingActions.length} pending action${pendingActions.length !== 1 ? 's' : ''}</strong> across all cases.
            ${highPriorityActions.length > 0 ? `<strong style="color:#f87171;">${highPriorityActions.length} require${highPriorityActions.length === 1 ? 's' : ''} urgent attention.</strong>` : 'No urgent items.'}
          </p>

          <!-- This week's cases list -->
          ${thisWeekCases.length > 0 ? `
          <p style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">New Cases This Week</p>
          ${thisWeekCases.slice(0, 8).map(c => `
            <div style="border-bottom:1px solid rgba(255,255,255,0.06);padding:10px 0;">
              <span style="color:#ffffff;font-size:14px;font-weight:500;">${c.client_name}</span>
              <span style="color:rgba(255,255,255,0.4);font-size:13px;margin-left:8px;">— ${c.case_type}</span>
              <span style="float:right;background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10px;padding:2px 8px;border-radius:10px;">${c.status}</span>
            </div>`).join('')}
          <div style="margin-top:16px;"></div>` : ''}

          <a href="https://app.lexflow.co.uk/dashboard" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
            Open Dashboard →
          </a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
            LexFlow Weekly Summary · <a href="https://app.lexflow.co.uk/dashboard/firm-settings" style="color:rgba(255,255,255,0.3);">Manage notifications</a>
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
        subject: `${firm.name} — Weekly Summary: ${thisWeekCases.length} case${thisWeekCases.length !== 1 ? 's' : ''}, ${pendingActions.length} pending action${pendingActions.length !== 1 ? 's' : ''}`,
        html: emailHtml,
      })
      sent++
      console.log(`[weekly-summary] Sent to ${managingPartner.email} (${firm.name})`)
    } catch (err) {
      console.error(`[weekly-summary] Failed for ${firm.name}:`, err)
    }
  }

  return NextResponse.json({ success: true, sent, firms: firms.length })
}
