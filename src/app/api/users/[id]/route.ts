import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateUser } from '@/lib/auth-db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const user = await updateUser(id, body)
  return NextResponse.json(user)
}
