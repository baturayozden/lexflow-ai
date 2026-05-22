import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[/api/leads] Received body:', body)
    const lead = await saveLead(body)
    console.log('[/api/leads] Saved lead:', lead)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[/api/leads] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save lead' },
      { status: 500 }
    )
  }
}
