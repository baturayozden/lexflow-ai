import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[/api/leads] Received body:', body)
    const lead = await saveLead(body)
    console.log('[/api/leads] Saved lead:', lead)

    // Fire-and-forget notification
    fetch(`${process.env.NEXTAUTH_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'new_lead', data: lead }),
    }).catch((e) => console.error('[/api/leads] Notify error:', e))

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[/api/leads] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save lead' },
      { status: 500 }
    )
  }
}
