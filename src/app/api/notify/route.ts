import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'new_lead') {
      await resend.emails.send({
        from: 'LexFlow <notifications@lexflow.co.uk>',
        to: process.env.ADMIN_EMAIL!,
        subject: `New Lead: ${data.name} — ${data.firm_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a84c;">New Lead — LexFlow</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Firm:</strong> ${data.firm_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || '—'}</p>
            <p><strong>Firm Type:</strong> ${data.firm_type}</p>
            <p><strong>Message:</strong> ${data.message || '—'}</p>
            <a href="https://lexflow.co.uk/admin" style="display:inline-block; margin-top:16px; background:#c9a84c; color:#0a1628; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">View in Admin Panel</a>
          </div>
        `,
      })
    }

    if (type === 'new_case') {
      await resend.emails.send({
        from: 'LexFlow <notifications@lexflow.co.uk>',
        to: process.env.ADMIN_EMAIL!,
        subject: `New Demo Case: ${data.client_name} — ${data.case_type}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a84c;">New Demo Case — LexFlow</h2>
            <p><strong>Client:</strong> ${data.client_name}</p>
            <p><strong>Email:</strong> ${data.client_email}</p>
            <p><strong>Case Type:</strong> ${data.case_type}</p>
            <p><strong>Nationality:</strong> ${data.nationality}</p>
            <p><strong>Location:</strong> ${data.city}, ${data.country}</p>
            <p><strong>Reference:</strong> ${data.reference_id}</p>
            <a href="https://lexflow.co.uk/admin" style="display:inline-block; margin-top:16px; background:#c9a84c; color:#0a1628; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">View in Admin Panel</a>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
