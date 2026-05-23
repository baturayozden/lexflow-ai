import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { approveChecklistReview } from '@/lib/db'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const review = await approveChecklistReview(id)
  return NextResponse.json({ success: true, review })
}
