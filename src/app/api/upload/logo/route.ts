import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()
  const filename = `logos/firm-logo-${Date.now()}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from('lexflow-assets')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabaseAdmin.storage.from('lexflow-assets').getPublicUrl(filename)

  return NextResponse.json({ url: data.publicUrl })
}
