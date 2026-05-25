import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { addPayment } from '@/lib/auth-db'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const payment = await addPayment(body)
  return NextResponse.json(payment)
}
