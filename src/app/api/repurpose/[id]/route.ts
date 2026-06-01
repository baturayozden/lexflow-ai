import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as Record<string, unknown>)?.role as string
  if (!isPlatformAdmin(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = await req.json()

  if (!['pending', 'approved', 'rejected', 'posted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const update: Record<string, unknown> = { status }
  if (status === 'approved') update.approved_at = new Date().toISOString()
  if (status === 'posted') update.posted_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('repurposed_content')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as Record<string, unknown>)?.role as string
  if (!isPlatformAdmin(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { error } = await supabaseAdmin.from('repurposed_content').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
