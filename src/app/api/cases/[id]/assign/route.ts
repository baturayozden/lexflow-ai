import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { assignCase } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const { member_id } = await req.json()
    await assignCase(id, member_id ?? null)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign case' },
      { status: 500 }
    )
  }
}
