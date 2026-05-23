import { NextRequest, NextResponse } from 'next/server'
import { getChecklistTemplates, createChecklistReview } from '@/lib/db'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const checklists = await getChecklistTemplates()
  const results: { case_type: string; has_changes?: boolean; error?: boolean }[] = []

  for (const checklist of checklists) {
    const cl = checklist as Record<string, unknown>
    if (!cl.gov_url) continue

    try {
      const pageRes = await fetch(cl.gov_url as string, {
        headers: { 'User-Agent': 'LexFlow-Checker/1.0 (legal compliance tool)' },
      })
      const html = await pageRes.text()

      const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a UK immigration document specialist.

Current document checklist for ${cl.case_type}:
${JSON.stringify(cl.items)}

Gov.uk page content (HTML):
${html.substring(0, 8000)}

Task: Extract the current document requirements from the gov.uk page. Compare with the existing checklist.

Respond ONLY with valid JSON in this exact format:
{
  "has_changes": true or false,
  "proposed_items": ["item 1", "item 2", ...],
  "changes_summary": "Brief description of what changed, or 'No changes detected'"
}`,
            },
          ],
        }),
      })

      const aiData = await aiRes.json()
      const text: string = aiData.content[0].text
      const clean = text.replace(/```json\n?/g, '').replace(/```/g, '').trim()
      const result = JSON.parse(clean)

      if (result.has_changes) {
        await createChecklistReview({
          checklist_id: cl.id as string,
          case_type: cl.case_type as string,
          current_items: (cl.items as unknown[]) || [],
          proposed_items: result.proposed_items,
          changes_summary: result.changes_summary,
          gov_url: cl.gov_url as string,
        })
        results.push({ case_type: cl.case_type as string, has_changes: true })
      } else {
        results.push({ case_type: cl.case_type as string, has_changes: false })
      }
    } catch (err) {
      console.error(`Error checking ${cl.case_type}:`, err)
      results.push({ case_type: cl.case_type as string, error: true })
    }
  }

  const changedCount = results.filter((r) => r.has_changes).length

  if (changedCount > 0 && process.env.ADMIN_EMAIL) {
    await resend.emails.send({
      from: 'LexFlow <notifications@lexflow.co.uk>',
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ ${changedCount} checklist update${changedCount > 1 ? 's' : ''} detected — Action Required`,
      html: `
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
          <span style="color:rgba(255,255,255,0.4);font-size:14px;margin-left:12px;">Monthly Checklist Review</span>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Monthly Gov.uk Review Complete</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 24px;">
            The monthly gov.uk compliance check has been completed.
            <strong style="color:#c9a84c;">${changedCount} checklist${changedCount > 1 ? 's require' : ' requires'} your review.</strong>
          </p>
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
            ${results
              .map(
                (r) => `
              <div style="margin-bottom:8px;">
                <span style="color:${r.has_changes ? '#f59e0b' : '#22c55e'};font-size:14px;">${r.has_changes ? '⚠' : '✓'}</span>
                <span style="color:rgba(255,255,255,0.8);font-size:14px;margin-left:8px;">${r.case_type}: ${r.has_changes ? 'Changes detected' : 'No changes'}</span>
              </div>
            `
              )
              .join('')}
          </div>
          <a href="${process.env.NEXTAUTH_URL}/admin/reviews"
             style="display:inline-block;background:#c9a84c;color:#0a1628;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
            Review Changes →
          </a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">LexFlow — Monthly Compliance Check</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
  }

  return NextResponse.json({ success: true, results, changedCount })
}
