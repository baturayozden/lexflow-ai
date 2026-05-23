import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getNotes, addNote } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entity_type = searchParams.get('entity_type')
  const entity_id = searchParams.get('entity_id')

  if (!entity_type || !entity_id) {
    return NextResponse.json({ error: 'entity_type and entity_id required' }, { status: 400 })
  }

  const notes = await getNotes(entity_type, entity_id)
  return NextResponse.json({ notes })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { entity_type, entity_id, content, author } = body
    if (!entity_type || !entity_id || !content) {
      return NextResponse.json({ error: 'entity_type, entity_id and content are required' }, { status: 400 })
    }
    const note = await addNote({ entity_type, entity_id, content, author: author || 'Admin' })
    return NextResponse.json({ success: true, note })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add note' },
      { status: 500 }
    )
  }
}
