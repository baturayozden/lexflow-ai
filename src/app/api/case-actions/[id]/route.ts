import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateCaseAction } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const { completed, completedBy } = await req.json()
    await updateCaseAction(id, completed, completedBy)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update action' },
      { status: 500 }
    )
  }
}
