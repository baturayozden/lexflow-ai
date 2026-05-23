import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getQuoteByType, getFirmSettings, getEmailSettings } from '@/lib/db'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { clientName, clientEmail, caseType, referenceId } = await req.json()

  const [quote, firmSettings, emailSettings] = await Promise.all([
    getQuoteByType(caseType),
    getFirmSettings(),
    getEmailSettings(),
  ])

  const minFee = (quote as Record<string, unknown>)?.min_fee as number || 500
  const maxFee = (quote as Record<string, unknown>)?.max_fee as number || 2000
  const currency = (quote as Record<string, unknown>)?.currency as string || 'GBP'
  const homeOfficeFee = (quote as Record<string, unknown>)?.home_office_fee as number | undefined
  const notes = (quote as Record<string, unknown>)?.notes as string || ''
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'

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
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Fee Estimate</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">For your ${caseType} (Ref: ${referenceId})</p>
          <p style="color:#374151;font-size:15px;margin:0 0 24px;">Dear ${clientName},</p>
          <div style="background:#f9fafb;border-radius:8px;padding:24px;margin-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#6b7280;font-size:13px;padding-bottom:12px;">Professional fees</td>
                <td style="text-align:right;font-size:18px;font-weight:700;color:#111827;padding-bottom:12px;">${symbol}${minFee.toLocaleString()} – ${symbol}${maxFee.toLocaleString()}</td>
              </tr>
              ${homeOfficeFee ? `<tr>
                <td style="color:#6b7280;font-size:13px;padding-bottom:12px;border-top:1px solid #e5e7eb;padding-top:12px;">Home Office fee</td>
                <td style="text-align:right;font-size:15px;color:#374151;border-top:1px solid #e5e7eb;padding-top:12px;">${symbol}${homeOfficeFee.toLocaleString()}</td>
              </tr>` : ''}
              <tr><td style="color:#6b7280;font-size:12px;padding-top:12px;" colspan="2">+ VAT where applicable</td></tr>
            </table>
          </div>
          ${notes ? `<p style="color:#6b7280;font-size:13px;margin:0 0 16px;">${notes}</p>` : ''}
          <p style="color:#6b7280;font-size:13px;">This is an estimate only. The exact fee will be confirmed after your initial consultation.</p>
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
    subject: `Fee Estimate for Your ${caseType} — ${firmName}`,
    html: emailHtml,
  })

  return NextResponse.json({ success: true, quote: { minFee, maxFee, currency, homeOfficeFee, notes } })
}
