import { NextRequest, NextResponse } from 'next/server'
import { getFirmBySlug } from '@/lib/auth-db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 20 messages per IP per hour for chatbot
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
             req.headers.get('x-real-ip') ||
             'unknown'

  const { success } = rateLimit(`chat:${ip}`, 20, 60 * 60 * 1000)

  if (!success) {
    return NextResponse.json(
      { message: "I've reached my message limit for now. Please try again in an hour or contact us directly.", intakeData: null },
      { status: 200 } // Return 200 so chatbot shows the message gracefully
    )
  }

  const { messages, slug } = await req.json()

  const firm = slug ? await getFirmBySlug(slug) : null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmName = (firm as any)?.name || 'our firm'

  const systemPrompt = `You are a helpful AI assistant for ${firmName}, a UK immigration and conveyancing law firm. Your job is to:

1. Answer general questions about UK immigration law, visa types, and processes
2. Help potential clients understand their options
3. Collect their details for a consultation booking when they are ready

You are friendly, professional, and concise. Keep responses to 2-3 sentences maximum.

When a user seems ready to book or wants more specific advice, say something like:
"I'd love to help you further. Let me take a few details to arrange a free consultation with our solicitors."

Then collect: name, email, phone, nationality, current visa type, visa expiry, what they need help with.

Once you have enough details, end your message with exactly this JSON on a new line:
INTAKE_DATA:{"name":"...","email":"...","phone":"...","nationality":"...","visaType":"...","caseType":"...","description":"..."}

Keep the conversation warm and helpful. Never give specific legal advice — always recommend a consultation.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: (messages as any[]).map((m: any) => ({ role: m.role, content: m.content })),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })
  }

  const text: string = data.content[0].text

  // Check if intake data is ready
  const intakeMatch = text.match(/INTAKE_DATA:([\s\S]*?\})\s*$/)
  let intakeData = null
  let cleanText = text

  if (intakeMatch) {
    try {
      intakeData = JSON.parse(intakeMatch[1])
      cleanText = text.replace(/INTAKE_DATA:[\s\S]*?\}\s*$/, '').trim()
    } catch {
      // leave intakeData null
    }
  }

  return NextResponse.json({
    message: cleanText,
    intakeData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    firmId: (firm as any)?.id || null,
  })
}
