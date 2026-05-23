import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getChecklistByType, getFirmSettings, getEmailSettings } from '@/lib/db'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { clientName, clientEmail, caseType, referenceId } = await req.json()

  const [checklist, firmSettings, emailSettings] = await Promise.all([
    getChecklistByType(caseType),
    getFirmSettings(),
    getEmailSettings(),
  ])

  const items: string[] = Array.isArray(checklist?.items) ? checklist.items : []
  const itemsHtml = items.length
    ? `<ul style="padding-left:20px;">${items.map((item) => `<li style="margin-bottom:8px;color:#374151;">${item}</li>`).join('')}</ul>`
    : '<p style="color:#6b7280;">Please contact us for the required documents.</p>'

  const primaryColor = (firmSettings as Record<string, unknown>).primary_color as string || '#c9a84c'
  const firmName = (firmSettings as Record<string, unknown>).firm_name as string || 'LexFlow'
  const fromName = (emailSettings as Record<string, unknown>).from_name as string || firmName
  const fromEmail = (emailSettings as Record<string, unknown>).from_email as string || 'notifications@lexflow.co.uk'
  const replyTo = (emailSettings as Record<string, unknown>).reply_to as string | undefined

  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:${primaryColor};padding:24px 40px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;">${firmName}</span>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Documents Required</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">For your ${caseType} application (Ref: ${referenceId})</p>
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Dear ${clientName},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 24px;">Please gather the following documents for your ${caseType} application:</p>
          <div style="background:#f9fafb;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
            ${itemsHtml}
          </div>
          <p style="color:#6b7280;font-size:13px;">If you have any questions, please contact us.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">${firmName} · Reference: ${referenceId}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: clientEmail,
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: `Documents Required for Your ${caseType} Application`,
    html: emailHtml,
  })

  return NextResponse.json({ success: true })
}
