import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseType, nationality, visaType, description, aiSummary } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `You are a UK immigration law expert. Based on the following case details, provide a brief eligibility assessment.

Case Type: ${caseType}
Nationality: ${nationality}
Current Visa: ${visaType}
Client Description: ${description}
AI Summary: ${aiSummary}

Respond in this exact JSON format only, no other text:
{
  "eligible": true or false or "likely" or "unlikely",
  "confidence": "high" or "medium" or "low",
  "summary": "2-3 sentence assessment",
  "key_requirements_met": ["requirement 1", "requirement 2"],
  "key_concerns": ["concern 1", "concern 2"],
  "recommendation": "1 sentence recommended next step"
}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: 'AI request failed', detail: err }, { status: 500 })
  }

  const data = await response.json()
  const text: string = data.content[0].text
  const clean = text.replace(/```json\n?/g, '').replace(/```/g, '').trim()
  const result = JSON.parse(clean)

  return NextResponse.json(result)
}
