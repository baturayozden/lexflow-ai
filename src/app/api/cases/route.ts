import { NextRequest, NextResponse } from 'next/server'
import { saveCase } from '@/lib/db'

export async function POST(req: NextRequest) {
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
