import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getQuoteTemplates, updateQuoteTemplate } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const templates = await getQuoteTemplates()
  return NextResponse.json(templates)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...updates } = await req.json()
  const template = await updateQuoteTemplate(id, updates)
  return NextResponse.json(template)
}
