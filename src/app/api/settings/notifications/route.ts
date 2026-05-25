import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { firmId, prefs } = await req.json()

  // Users may only update their own firm's prefs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userFirmId = (session.user as any)?.firmId

  if (!firmId || firmId !== userFirmId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabaseAdmin
    .from('firms')
    .update({ notification_prefs: prefs })
    .eq('id', firmId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
