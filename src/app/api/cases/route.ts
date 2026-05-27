import { NextRequest, NextResponse } from 'next/server'
import { saveCase } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 5 submissions per IP per hour
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
             req.headers.get('x-real-ip') ||
             'unknown'

  const { success, remaining, resetAt } = rateLimit(`cases:${ip}`, 5, 60 * 60 * 1000)

  if (!success) {
    const resetInMinutes = Math.ceil((resetAt - Date.now()) / 60000)
    return NextResponse.json(
      { error: `Too many submissions. Please try again in ${resetInMinutes} minutes.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
        }
      }
    )
  }

  console.log(`[/api/cases] IP: ${ip}, remaining: ${remaining}`)

  try {
    const body = await req.json()
    const caseRecord = await saveCase({
      client_name: body.name,
      client_email: body.email,
      client_phone: body.phone,
      nationality: body.nationality,
      visa_type: body.visaType,
      visa_expiry: (body.visaExpiry && body.visaExpiry !== 'N/A' && body.visaExpiry !== '') ? body.visaExpiry : null,
      case_type: body.caseType,
      description: body.description,
      ai_summary: body.summary,
      ip: body.ip,
      city: body.city,
      country: body.country,
      reference_id: body.caseId || Date.now().toString(),
      firm_id: body.firm_id || null,
    })

    // Fire-and-forget notification
    fetch(`${process.env.NEXTAUTH_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_case',
        data: { ...body, reference_id: caseRecord.reference_id },
      }),
    }).catch((e) => console.error('[/api/cases] Notify error:', e))

    return NextResponse.json({ success: true, case: caseRecord })
  } catch (error) {
    console.error('Case save error:', error)
    return NextResponse.json({ error: 'Failed to save case' }, { status: 500 })
  }
}
