import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUsersByFirm, createUser } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userRole = (session.user as Record<string, unknown>).role as string
  const userFirmId = (session.user as Record<string, unknown>).firmId as string

  if (!isPlatformAdmin(userRole) && userFirmId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await getUsersByFirm(id)
  return NextResponse.json(users)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userRole = (session.user as Record<string, unknown>).role as string
  const userFirmId = (session.user as Record<string, unknown>).firmId as string

  if (!isPlatformAdmin(userRole) && userFirmId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const user = await createUser({ ...body, firm_id: id })
  return NextResponse.json(user)
}
