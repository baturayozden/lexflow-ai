const https = require('https');

async function callClaude(systemPrompt, userPrompt, maxTokens = 4000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Claude API response status:', res.statusCode);
        console.log('Claude API response body:', data.substring(0, 500));
        try { resolve(JSON.parse(data).content[0].text); }
        catch (e) { reject(new Error('Parse failed: ' + data.substring(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getRecentSlugs() {
  return new Promise((resolve) => {
    const url = new URL(`${process.env.SUPABASE_URL}/rest/v1/blog_posts?select=slug&order=published_at.desc&limit=20`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data).map(r => r.slug)); }
        catch { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
    req.end();
  });
}

async function savePost(post) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify([post]);
    const req = https.request({
      hostname: new URL(process.env.SUPABASE_URL).hostname,
      path: '/rest/v1/blog_posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(true);
        else reject(new Error(`Supabase ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const topicSystemPrompt = 'You are a JSON-only responder. Output only valid JSON, no markdown, no backticks.';

const articleSystemPrompt = `You are a senior legal content writer and SEO specialist for UK immigration and conveyancing law firms.

Writing rules:
- UK English spelling throughout
- 1400-1800 words total
- Reference UK legislation, UKVI guidance, SRA rules, Land Registry where appropriate
- Mention LexFlow (AI intake automation for UK law firms, £997 one-time) once or twice naturally
- Never use generic filler content

HTML STRUCTURE — output ONLY this, no html/body tags:

1. Open with <h1> containing the exact post title
2. Use <h2> and <h3> for sections
3. Use <p>, <ul>, <li>, <strong>, <blockquote>

INTERNAL LINKS — include 2-3 links to these pages naturally within the content:
- <a href="/why-not-harvey">Why small UK firms choose LexFlow over Harvey AI</a>
- <a href="/#pricing">LexFlow pricing</a>
- <a href="/blog">more insights on our blog</a>

EXTERNAL AUTHORITY LINKS — include 2-3 links to UK government/regulatory sources.
CRITICAL: Only use these VERIFIED working URLs, do not invent or modify URLs:

For immigration topics:
- https://www.gov.uk/browse/visas-immigration
- https://www.gov.uk/government/organisations/uk-visas-and-immigration
- https://www.gov.uk/immigration-operational-guidance
- https://www.gov.uk/guidance/immigration-rules

For SRA/legal regulation:
- https://www.sra.org.uk/solicitors/standards-regulations/
- https://www.sra.org.uk/solicitors/guidance/
- https://www.sra.org.uk/consumers/using-solicitor/

For conveyancing:
- https://www.gov.uk/buy-sell-your-home
- https://www.gov.uk/stamp-duty-land-tax
- https://landregistry.data.gov.uk
- https://www.gov.uk/guidance/hm-land-registry-services-and-fees

For data protection:
- https://ico.org.uk/for-organisations/
- https://ico.org.uk/for-organisations/guide-to-data-protection/

For general legal:
- https://www.legislation.gov.uk
- https://www.judiciary.gov.uk
- https://www.lawsociety.org.uk/topics/

Use only URLs from this list. Link anchor text should be descriptive and natural.

FAQ SECTION — end the article with:
<h2>Frequently Asked Questions</h2>
Then 3-4 FAQ items as:
<div class="faq-item">
  <h3>Question here?</h3>
  <p>Answer here.</p>
</div>

CONCLUSION — after FAQ, add:
<h2>Ready to Automate Your Firm?</h2>
<p>...brief paragraph mentioning LexFlow...</p>`;

async function main() {
  const recentSlugs = await getRecentSlugs();
  console.log('Recent slugs:', recentSlugs.slice(0, 5));

  const day = new Date().getDay();
  const categories = { 1: 'immigration', 3: 'conveyancing', 5: 'legal-tech', 0: 'immigration' };
  const category = categories[day] || 'immigration';
  console.log('Category:', category);

  // Step 1: Generate topic + metadata + authority URLs
  const topicRaw = await callClaude(
    topicSystemPrompt,
    `You are an SEO strategist for LexFlow, an AI SaaS for small UK immigration and conveyancing law firms.
Recent slugs to AVOID: ${recentSlugs.join(', ')}
Pick ONE blog post topic for category: "${category}"
Target: UK solicitors at small firms. UK-specific content (UKVI, Land Registry, SRA).
Return ONLY valid JSON:
{
  "title": "exact post title",
  "slug": "url-slug-max-60-chars",
  "focus_keyword": "primary keyword",
  "meta_description": "150-160 char description",
  "excerpt": "2-3 sentence excerpt",
  "category": "${category}"
}`,
    600
  );

  let topic;
  try {
    topic = JSON.parse(topicRaw.replace(/```json|```/g, '').trim());
  } catch (e) {
    throw new Error('Topic JSON parse failed: ' + topicRaw);
  }
  console.log('Topic:', topic.title, '|', topic.slug);

  if (recentSlugs.includes(topic.slug)) topic.slug += '-' + Date.now();

  // Step 2: Generate full article HTML
  const content = await callClaude(
    articleSystemPrompt,
    `Write a 1400-1800 word blog post.
Title: ${topic.title}
Focus keyword: ${topic.focus_keyword}
Category: ${topic.category}
Include H1 tag as first element with the exact title.
Use focus keyword 3-5 times naturally.
Include 2-3 internal links, 2-3 external authority links (use only the verified URLs listed above).
End with FAQ section (3-4 questions) with faq-item divs, then "Ready to Automate Your Firm?" conclusion.`,
    4000
  );

  // Strip markdown code fences if Claude wrapped the output
  const cleanContent = content
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  // Step 3: Parse FAQ items and build JSON-LD schema
  const publishedDate = new Date().toISOString();
  const faqs = [];
  const faqRegex = /<div class="faq-item">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/div>/g;
  let match;
  while ((match = faqRegex.exec(cleanContent)) !== null) {
    faqs.push({ question: match[1], answer: match[2] });
  }
  console.log('FAQ items found:', faqs.length);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: topic.title,
        description: topic.meta_description,
        author: {
          '@type': 'Organization',
          name: 'LexFlow',
          url: 'https://lexflow.co.uk'
        },
        publisher: {
          '@type': 'Organization',
          name: 'LexFlow',
          url: 'https://lexflow.co.uk',
          logo: {
            '@type': 'ImageObject',
            url: 'https://lexflow.co.uk/logo.png'
          }
        },
        datePublished: publishedDate,
        dateModified: publishedDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://lexflow.co.uk/blog/${topic.slug}`
        }
      },
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      }] : [])
    ]
  };

  const finalContent = cleanContent + `\n<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

  const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  console.log('Word count:', wordCount);

  // Step 4: Save to Supabase
  await savePost({
    title: topic.title,
    slug: topic.slug,
    excerpt: topic.excerpt,
    content: finalContent,
    meta_description: topic.meta_description,
    focus_keyword: topic.focus_keyword,
    category: topic.category,
    published_at: publishedDate,
    is_published: true,
    word_count: wordCount,
    reading_time_minutes: Math.ceil(wordCount / 200)
  });

  console.log('✅ Published:', topic.slug);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});
