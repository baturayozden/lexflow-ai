import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirmSettings, updateFirmSettings } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId as string | undefined
  const settings = await getFirmSettings(firmId)
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId as string | undefined
  const body = await req.json()
  const settings = await updateFirmSettings(body, firmId)
  return NextResponse.json(settings)
}
