import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updatePaymentStatus } from '@/lib/auth-db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status } = await req.json()
  const payment = await updatePaymentStatus(id, status)
  return NextResponse.json(payment)
}
