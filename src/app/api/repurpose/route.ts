import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isPlatformAdmin } from '@/lib/permissions'

const SYSTEM_PROMPT = `You are a professional content writer for LexFlow, a legal-AI company serving UK immigration and conveyancing law firms.

LANGUAGE RULES — non-negotiable:
- British English only: authorise, recognise, practise, optimise, colour, behaviour, customise, specialise, organise, licence (noun)
- American spellings are forbidden (authorize, recognize, practice as verb, etc.)

AUDIENCE: UK law firm managing partners and practice managers, 38–58 years old. Experienced professionals, not interested in hype.

TONE:
- Knowledgeable, calm, direct
- Empathy before solution
- Specific details and numbers beat vague claims
- NO startup vocabulary: revolutionary, game-changing, leverage, disruptive, transformative, seamlessly, supercharge, cutting-edge, state-of-the-art, groundbreaking, unprecedented

FORBIDDEN CONSTRUCTIONS:
- "could potentially", "may potentially", "might possibly"
- Exclamation marks in professional copy
- Second-guessing phrases ("you might think", "you may wonder")

OUTPUT: Return ONLY valid JSON. No markdown fences, no explanations, no preamble. The response must parse with JSON.parse() with zero modifications.`

const buildUserPrompt = (title: string, content: string) => `Blog post title: ${title}

Blog post content (first 3,000 characters):
${content.slice(0, 3000)}

Produce exactly 5 pieces of social content based on this blog post. Return a single JSON object with this exact structure:

{
  "linkedin_problem": {
    "hook": "Opening line — a specific, relatable moment from a solicitor's week (1 sentence)",
    "body": "Full post body — 150–200 words. Short paragraphs for LinkedIn readability. Start with the hook. Deepen the problem. End with a faint implication that a better way exists, but NO product pitch. This is pure empathy and insight.",
    "cta": "Soft closing call-to-action (1 sentence, e.g. 'What does your intake process look like?' or 'Worth a conversation — link in bio.')"
  },
  "linkedin_evidence": {
    "stat_used": "The exact statistic chosen from the approved list",
    "body": "Full post — 120–180 words. Open with the statistic, frame why it matters for UK firms, connect to the blog topic, close with a gentle observation. Use ONLY these approved statistics — do not invent data: '86% of leads are lost by the average law firm', '79% of clients expect a response within 24 hours whilst the average firm takes 3+ days', '42% of clients contact more than one firm simultaneously', 'the first firm to respond helpfully wins the instruction roughly 79% of the time'. Pick the one that fits most naturally.",
    "cta": "Soft CTA (1 sentence)"
  },
  "linkedin_carousel": {
    "slides": [
      { "n": 1, "heading": "Hook — compelling question or statement (max 8 words)", "body": "Subtext to intrigue (max 20 words)" },
      { "n": 2, "heading": "The Problem — part 1 (max 8 words)", "body": "Specific, relatable pain (max 20 words)" },
      { "n": 3, "heading": "The Problem — part 2 (max 8 words)", "body": "Deepen the pain, add consequence (max 20 words)" },
      { "n": 4, "heading": "Insight or step 1 (max 8 words)", "body": "Concrete takeaway (max 20 words)" },
      { "n": 5, "heading": "Insight or step 2 (max 8 words)", "body": "Concrete takeaway (max 20 words)" },
      { "n": 6, "heading": "Insight or step 3 (max 8 words)", "body": "Concrete takeaway (max 20 words)" },
      { "n": 7, "heading": "The Result — specific benefit (max 8 words)", "body": "What changes when this is fixed (max 20 words)" },
      { "n": 8, "heading": "Book a free audit", "body": "Find out what can be automated in your firm. lexflow.co.uk" }
    ]
  },
  "linkedin_quote": {
    "quote": "One powerful, standalone insight from the blog — 15–30 words. Must make sense without context. Should prompt a senior solicitor to pause and think.",
    "attribution": "LexFlow",
    "context": "Which blog post this came from (short phrase)"
  },
  "instagram_caption": {
    "caption": "Full caption — slightly warmer than LinkedIn but still professional. First line is the hook (strong enough to stop scrolling). 3–5 short paragraphs of value. Final line: 'Comment AUDIT for a free workflow review.' 120–180 words total.",
    "hashtags": ["UKlaw", "immigrationlaw", "conveyancing", "legaltech", "lawfirm", "solicitors", "UKsolicitor", "legalAI", "lawfirmgrowth", "practicemanagement"],
    "first_comment": "One more observation or question to spark engagement (1–2 sentences, conversational)"
  }
}`

export async function POST(req: NextRequest) {
  // Auth: allow CRON_SECRET bearer OR platform_admin session
  const authHeader = req.headers.get('authorization')
  const isCronAuth = authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isCronAuth) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const role = (session.user as Record<string, unknown>)?.role as string
    if (!isPlatformAdmin(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { blogPostId } = await req.json()
  if (!blogPostId) return NextResponse.json({ error: 'blogPostId required' }, { status: 400 })

  // 1. Fetch blog post
  const { data: post, error: postError } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, content')
    .eq('id', blogPostId)
    .single()

  if (postError || !post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  // 2. Call Claude Sonnet to generate all 5 pieces
  let parsed: Record<string, unknown>
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(post.title, post.content) }],
      }),
    })

    const claudeData = await claudeRes.json()
    if (!claudeRes.ok) {
      console.error('[repurpose] Claude error:', claudeData)
      return NextResponse.json({ error: 'Claude API error', detail: claudeData }, { status: 500 })
    }

    const rawText: string = claudeData.content[0].text.trim()
    // Strip any accidental markdown fences
    const jsonText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    parsed = JSON.parse(jsonText)
  } catch (err) {
    console.error('[repurpose] Parse error:', err)
    return NextResponse.json({ error: 'Failed to parse Claude response' }, { status: 500 })
  }

  // 3. Map to DB rows
  const rows = [
    {
      blog_post_id: post.id,
      blog_title: post.title,
      channel: 'linkedin',
      format: 'text_post',
      post_type: 'problem',
      content: parsed.linkedin_problem,
      status: 'pending',
    },
    {
      blog_post_id: post.id,
      blog_title: post.title,
      channel: 'linkedin',
      format: 'text_post',
      post_type: 'evidence',
      content: parsed.linkedin_evidence,
      status: 'pending',
    },
    {
      blog_post_id: post.id,
      blog_title: post.title,
      channel: 'linkedin',
      format: 'carousel',
      post_type: 'case',
      content: parsed.linkedin_carousel,
      status: 'pending',
    },
    {
      blog_post_id: post.id,
      blog_title: post.title,
      channel: 'linkedin',
      format: 'quote_graphic',
      post_type: 'positioning',
      content: parsed.linkedin_quote,
      status: 'pending',
    },
    {
      blog_post_id: post.id,
      blog_title: post.title,
      channel: 'instagram',
      format: 'caption',
      post_type: 'positioning',
      content: parsed.instagram_caption,
      status: 'pending',
    },
  ]

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('repurposed_content')
    .insert(rows)
    .select()

  if (insertError) {
    console.error('[repurpose] Insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  console.log(`[repurpose] Generated ${inserted?.length} pieces for blog: "${post.title}"`)
  return NextResponse.json({ success: true, count: inserted?.length, items: inserted })
}
