import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getCaseActions, saveCaseActions } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const caseId = searchParams.get('caseId')
  if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

  const actions = await getCaseActions(caseId)
  return NextResponse.json(actions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { caseId, steps } = await req.json()
    if (!caseId || !Array.isArray(steps)) {
      return NextResponse.json({ error: 'caseId and steps array required' }, { status: 400 })
    }
    const actions = await saveCaseActions(caseId, steps)
    return NextResponse.json(actions)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save actions' },
      { status: 500 }
    )
  }
}
