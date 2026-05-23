import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirmSettings, updateFirmSettings } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await getFirmSettings()
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const settings = await updateFirmSettings(body)
  return NextResponse.json(settings)
}
