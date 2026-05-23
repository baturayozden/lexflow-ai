import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getLeads } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const leads = await getLeads()
  return NextResponse.json({ leads })
}
