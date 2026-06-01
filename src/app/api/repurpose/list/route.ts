import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as Record<string, unknown>)?.role as string
  if (!isPlatformAdmin(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status  = searchParams.get('status')
  const channel = searchParams.get('channel')

  let query = supabaseAdmin
    .from('repurposed_content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) query = query.eq('status', status)
  if (channel) query = query.eq('channel', channel)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
