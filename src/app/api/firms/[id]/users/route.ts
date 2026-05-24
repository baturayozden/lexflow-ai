import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUsersByFirm, createUser, getFirmById } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'
import { Resend } from 'resend'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userRole = (session.user as Record<string, unknown>).role as string
  const userFirmId = (session.user as Record<string, unknown>).firmId as string

  if (!isPlatformAdmin(userRole) && userFirmId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await getUsersByFirm(id)
  return NextResponse.json(users)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userRole = (session.user as Record<string, unknown>).role as string
  const userFirmId = (session.user as Record<string, unknown>).firmId as string

  if (!isPlatformAdmin(userRole) && userFirmId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const user = await createUser({ ...body, firm_id: id })

  // Send welcome email (fire-and-forget, don't block response)
  ;(async () => {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const firm = await getFirmById(id)
      await resend.emails.send({
        from: 'LexFlow <notifications@lexflow.co.uk>',
        to: body.email,
        subject: `Welcome to LexFlow — Your Account is Ready`,
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
          <h2 style="color:#ffffff;margin:0 0 16px;">Welcome to LexFlow, ${body.name}!</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 24px;">
            Your account has been created for <strong style="color:#ffffff;">${(firm as Record<string, unknown>)?.name as string || 'your firm'}</strong>.
            You can now access your firm&apos;s AI-powered case management dashboard.
          </p>
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px 24px;margin-bottom:24px;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 12px;">Your login details</p>
            <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 6px;"><strong>Email:</strong> ${body.email}</p>
            <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;"><strong>Password:</strong> ${body.password}</p>
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 24px;">Please sign in and change your password as soon as possible.</p>
          <a href="https://app.lexflow.co.uk/login" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Access Your Dashboard →</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">LexFlow — AI Systems for UK Law Firms · app.lexflow.co.uk</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      })
    } catch (err) {
      console.error('[/api/firms/[id]/users] Welcome email error:', err)
    }
  })()

  return NextResponse.json(user)
}
