import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getEmailSettings, updateEmailSettings } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId as string | undefined
  console.log('[/api/settings/email GET] session.user:', JSON.stringify(session.user))
  console.log('[/api/settings/email GET] firmId:', firmId)
  const settings = await getEmailSettings(firmId)
  console.log('[/api/settings/email GET] result:', JSON.stringify(settings))
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId as string | undefined
  const body = await req.json()
  console.log('[/api/settings/email POST] firmId:', firmId, 'body:', JSON.stringify(body))
  const settings = await updateEmailSettings(body, firmId)
  console.log('[/api/settings/email POST] result:', JSON.stringify(settings))
  return NextResponse.json(settings)
}
