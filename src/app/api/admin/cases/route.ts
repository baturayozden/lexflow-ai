import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getCases } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cases = await getCases()
  return NextResponse.json({ cases })
}
