import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirms, createFirm } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const firms = await getFirms()
  return NextResponse.json(firms)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const firm = await createFirm(body)
  return NextResponse.json(firm)
}
