import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userFirmId = (session.user as any)?.firmId as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any)?.role as string | undefined

  // Users can only get their own firm; platform admins can get any
  if (!isPlatformAdmin(userRole || '') && userFirmId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  console.log('[/api/firms/[id] GET] firmId requested:', id, '| session firmId:', userFirmId, '| role:', userRole)
  const { data, error } = await supabaseAdmin
    .from('firms')
    .select('*')
    .eq('id', id)
    .single()

  console.log('[/api/firms/[id] GET] result error:', error?.message ?? null, '| data keys:', data ? Object.keys(data) : null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userFirmId = (session.user as any)?.firmId as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any)?.role as string | undefined
  const isAdmin = isPlatformAdmin(userRole || '')
  const isOwnFirm = userFirmId === id

  // Platform admins can update any firm; firm members can update their own
  if (!isAdmin && !isOwnFirm) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  // Firm members can only update branding fields (not plan/active/onboarding)
  // Platform admins can update everything
  const firmMemberAllowed = ['name', 'email', 'phone', 'website', 'address', 'logo_url', 'primary_color']
  const adminAllowed = [...firmMemberAllowed, 'plan', 'active', 'onboarding_steps', 'onboarding_completed']
  const allowed = isAdmin ? adminAllowed : firmMemberAllowed

  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  const { data, error } = await supabaseAdmin
    .from('firms')
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
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  // Soft-delete: set active = false
  const { error } = await supabaseAdmin
    .from('firms')
    .update({ active: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
