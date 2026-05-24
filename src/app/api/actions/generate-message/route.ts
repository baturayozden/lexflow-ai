import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseType, clientName, referenceId, messageType } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Write a brief professional follow-up message body for a UK immigration law firm.
Case type: ${caseType}
Client name: ${clientName}
Reference: ${referenceId}
Message type: ${messageType || 'general follow-up'}

Requirements:
- 2-3 sentences only
- Warm but professional UK law firm tone
- Ask client to contact us if they have any questions
- Do NOT include greeting (Dear...) or sign-off
- Just the message body text`,
      }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })
  }

  return NextResponse.json({ message: data.content[0].text.trim() })
}
