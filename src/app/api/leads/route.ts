import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const lead = await saveLead(body)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Lead save error:', error)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
