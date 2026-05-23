import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getChecklistReviews } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const reviews = await getChecklistReviews()
  return NextResponse.json(reviews)
}
