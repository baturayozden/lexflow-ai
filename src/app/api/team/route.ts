import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getTeamMembers, addTeamMember } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const members = await getTeamMembers()
  return NextResponse.json({ members })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, email, role } = body
    if (!name || !email || !role) {
      return NextResponse.json({ error: 'name, email and role are required' }, { status: 400 })
    }
    const member = await addTeamMember({ name, email, role })
    return NextResponse.json({ success: true, member })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add member' },
      { status: 500 }
    )
  }
}
