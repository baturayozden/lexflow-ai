import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirmNotes, addFirmNote } from '@/lib/auth-db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const firmId = searchParams.get('firmId')!
  const notes = await getFirmNotes(firmId)
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { firmId, content, author } = await req.json()
  const note = await addFirmNote(firmId, content, author || 'Baturay')
  return NextResponse.json(note)
}
