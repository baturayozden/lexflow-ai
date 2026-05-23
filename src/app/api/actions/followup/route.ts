import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirmSettings, getEmailSettings } from '@/lib/db'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { clientName, clientEmail, caseType, referenceId, message, scheduledDate } = await req.json()

  const [firmSettings, emailSettings] = await Promise.all([getFirmSettings(), getEmailSettings()])

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
          <h2 style="color:#111827;font-size:20px;margin:0 0 24px;">Following Up on Your Case</h2>
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Dear ${clientName},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 24px;">We are following up regarding your ${caseType} case (Reference: ${referenceId}).</p>
          ${message ? `<div style="background:#f9fafb;border-left:4px solid ${primaryColor};padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <p style="color:#374151;font-size:14px;margin:0;">${message}</p>
          </div>` : ''}
          ${scheduledDate ? `<p style="color:#374151;font-size:15px;margin:0 0 16px;"><strong>Next appointment:</strong> ${new Date(scheduledDate).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}</p>` : ''}
          <p style="color:#6b7280;font-size:13px;">Please do not hesitate to contact us if you have any questions.</p>
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
    subject: `Update on Your ${caseType} Case — ${firmName}`,
    html: emailHtml,
  })

  return NextResponse.json({ success: true })
}
