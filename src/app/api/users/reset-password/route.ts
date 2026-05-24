import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserByEmail, hashPassword } from '@/lib/auth-db'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email } = await req.json()
  const user = await getUserByEmail(email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Generate temporary password
  const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
  const password_hash = await hashPassword(tempPassword)

  await supabaseAdmin.from('users').update({ password_hash }).eq('id', user.id)

  await resend.emails.send({
    from: 'LexFlow <notifications@lexflow.co.uk>',
    to: email,
    subject: 'Your LexFlow Password Has Been Reset',
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
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="color:#ffffff;margin:0 0 16px;">Password Reset</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 24px;">Hi ${user.name}, your password has been reset.</p>
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px 24px;margin-bottom:24px;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;">Temporary password</p>
            <p style="color:#c9a84c;font-size:20px;font-weight:700;font-family:monospace;margin:0;">${tempPassword}</p>
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 24px;">Please sign in and change your password immediately.</p>
          <a href="https://app.lexflow.co.uk/login" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Sign In →</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">LexFlow — AI Systems for UK Law Firms</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  return NextResponse.json({ success: true })
}
