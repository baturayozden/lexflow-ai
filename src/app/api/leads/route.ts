import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 3 submissions per IP per hour for contact form
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
             req.headers.get('x-real-ip') ||
             'unknown'

  const { success, remaining, resetAt } = await rateLimit(`leads:${ip}`, 3, 60 * 60 * 1000)

  if (!success) {
    const resetInMinutes = Math.ceil((resetAt - Date.now()) / 60000)
    return NextResponse.json(
      { error: `Too many submissions. Please try again in ${resetInMinutes} minutes.` },
      { status: 429 }
    )
  }

  console.log(`[/api/leads] IP: ${ip}, remaining: ${remaining}`)

  try {
    const body = await req.json()
    console.log('[/api/leads] Received body:', body)

    const { name, email, phone, firm_name, firm_type, message, firm_id } = body

    const lead = await saveLead({
      name,
      email,
      phone: phone || undefined,
      firm_name: firm_name || 'Unknown',
      firm_type: firm_type || 'Not specified',
      message: message || undefined,
      firm_id: firm_id || null,
    })
    console.log('[/api/leads] Saved lead:', lead)

    // Only notify admin for public contact form submissions (firm_id = null)
    if (!firm_id) {
      try {
        const notifyRes = await fetch(`${process.env.NEXTAUTH_URL}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'new_lead', data: lead }),
        })
        const notifyData = await notifyRes.json()
        console.log('[/api/leads] Notify result:', notifyRes.status, notifyData)
      } catch (notifyError) {
        console.error('[/api/leads] Notify failed:', notifyError)
      }
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[/api/leads] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save lead' },
      { status: 500 }
    )
  }
}
