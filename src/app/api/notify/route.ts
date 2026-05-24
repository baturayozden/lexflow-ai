import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'new_lead') {
      // Admin notification
      console.log('[notify] Sending email via Resend...')
      const result = await resend.emails.send({
        from: 'LexFlow <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL!,
        subject: `New Lead: ${data.name} — ${data.firm_name}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628; border-radius:12px; overflow:hidden;">
        <tr>
          <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="color:#c9a84c; font-size:22px; font-weight:700;">Lex</span><span style="color:#ffffff; font-size:22px; font-weight:700;">Flow</span>
            <span style="color:rgba(255,255,255,0.4); font-size:14px; margin-left:12px;">New Lead</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 40px;">
            <p style="color:#c9a84c; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin:0 0 24px 0;">Contact Form Submission</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Name</span>
                <span style="color:#ffffff; font-size:15px; font-weight:500;">${data.name}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Law Firm</span>
                <span style="color:#ffffff; font-size:15px; font-weight:500;">${data.firm_name}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Email</span>
                <span style="color:#c9a84c; font-size:15px;">${data.email}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Phone</span>
                <span style="color:#ffffff; font-size:15px;">${data.phone || '—'}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Firm Type</span>
                <span style="color:#ffffff; font-size:15px;">${data.firm_type}</span>
              </td></tr>
              ${data.message ? `<tr><td style="padding:10px 0;">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Message</span>
                <span style="color:rgba(255,255,255,0.8); font-size:14px; line-height:1.6;">${data.message}</span>
              </td></tr>` : ''}
            </table>
            <div style="margin-top:32px;">
              <a href="https://lexflow.co.uk/admin" style="display:inline-block; background:#c9a84c; color:#0a1628; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px;">View in Admin Panel →</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px; border-top:1px solid rgba(255,255,255,0.1);">
            <p style="color:rgba(255,255,255,0.2); font-size:12px; margin:0;">LexFlow — AI Systems for UK Law Firms</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      })
      console.log('[notify] Resend result:', JSON.stringify(result))

      // Client confirmation email
      const clientResult = await resend.emails.send({
        from: 'LexFlow <notifications@lexflow.co.uk>',
        to: data.email,
        subject: 'We received your audit request — LexFlow',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628; border-radius:12px; overflow:hidden;">
        <tr>
          <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="color:#c9a84c; font-size:22px; font-weight:700;">Lex</span><span style="color:#ffffff; font-size:22px; font-weight:700;">Flow</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 40px;">
            <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0 0 16px 0;">We've received your request</h1>
            <p style="color:rgba(255,255,255,0.6); font-size:15px; line-height:1.7; margin:0 0 24px 0;">
              Hi ${data.name}, thank you for reaching out to LexFlow. We've received your free audit request for <strong style="color:#ffffff;">${data.firm_name}</strong>.
            </p>
            <div style="background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); border-radius:8px; padding:20px 24px; margin-bottom:24px;">
              <p style="color:#c9a84c; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin:0 0 8px 0;">What happens next</p>
              <p style="color:rgba(255,255,255,0.7); font-size:14px; line-height:1.7; margin:0;">We will review your details and be in touch within <strong style="color:#ffffff;">one business day</strong> to schedule your free 20-minute audit call.</p>
            </div>
            <p style="color:rgba(255,255,255,0.4); font-size:13px; line-height:1.6; margin:0;">
              In the meantime, you can explore our <a href="https://lexflow.co.uk/demo/index.html" style="color:#c9a84c;">live AI demo</a> to see exactly how we automate client intake for immigration and conveyancing firms.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px; border-top:1px solid rgba(255,255,255,0.1);">
            <p style="color:rgba(255,255,255,0.2); font-size:12px; margin:0;">LexFlow — AI Systems for UK Law Firms · <a href="https://lexflow.co.uk" style="color:rgba(255,255,255,0.3);">lexflow.co.uk</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      })
      console.log('[notify] Client confirmation result:', JSON.stringify(clientResult))
    }

    if (type === 'new_case') {
      console.log('[notify] Sending email via Resend...')

      // For firm cases, notify the managing partner; for demo cases, notify platform admin
      let notifyEmail = process.env.ADMIN_EMAIL!
      let caseLabel = 'Demo Case'
      let dashboardUrl = 'https://lexflow.co.uk/admin'

      if (data.firm_id) {
        caseLabel = 'New Client Enquiry'
        dashboardUrl = 'https://app.lexflow.co.uk/dashboard/cases'
        try {
          const { data: firmUser } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('firm_id', data.firm_id)
            .eq('role', 'managing_partner')
            .eq('active', true)
            .limit(1)
            .single()
          if (firmUser?.email) notifyEmail = firmUser.email
        } catch {
          // fall back to ADMIN_EMAIL
        }
      }

      const result = await resend.emails.send({
        from: 'LexFlow <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `${caseLabel}: ${data.client_name} — ${data.case_type}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628; border-radius:12px; overflow:hidden;">
        <tr>
          <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="color:#c9a84c; font-size:22px; font-weight:700;">Lex</span><span style="color:#ffffff; font-size:22px; font-weight:700;">Flow</span>
            <span style="color:rgba(255,255,255,0.4); font-size:14px; margin-left:12px;">${caseLabel}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 40px;">
            <p style="color:#c9a84c; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin:0 0 24px 0;">${caseLabel}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Client Name</span>
                <span style="color:#ffffff; font-size:15px; font-weight:500;">${data.client_name}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Email</span>
                <span style="color:#c9a84c; font-size:15px;">${data.client_email}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Case Type</span>
                <span style="color:#ffffff; font-size:15px;">${data.case_type}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Nationality</span>
                <span style="color:#ffffff; font-size:15px;">${data.nationality}</span>
              </td></tr>
              <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Location</span>
                <span style="color:#ffffff; font-size:15px;">${data.city}, ${data.country}</span>
              </td></tr>
              <tr><td style="padding:10px 0;">
                <span style="color:rgba(255,255,255,0.4); font-size:12px; display:block; margin-bottom:4px;">Reference</span>
                <span style="color:#c9a84c; font-size:13px; font-family:monospace;">${data.reference_id}</span>
              </td></tr>
            </table>
            <div style="margin-top:32px;">
              <a href="${dashboardUrl}" style="display:inline-block; background:#c9a84c; color:#0a1628; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px;">View Case →</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px; border-top:1px solid rgba(255,255,255,0.1);">
            <p style="color:rgba(255,255,255,0.2); font-size:12px; margin:0;">LexFlow — AI Systems for UK Law Firms</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      })
      console.log('[notify] Resend result:', JSON.stringify(result))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
