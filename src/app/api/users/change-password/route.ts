import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserByEmail, verifyPassword, hashPassword } from '@/lib/auth-db'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  const user = await getUserByEmail(session.user?.email || '')
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const valid = await verifyPassword(currentPassword, user.password_hash)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  const password_hash = await hashPassword(newPassword)
  await supabaseAdmin.from('users').update({ password_hash }).eq('id', user.id)

  return NextResponse.json({ success: true })
}
