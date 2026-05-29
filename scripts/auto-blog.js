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

async function main() {
  const recentSlugs = await getRecentSlugs();
  console.log('Recent slugs:', recentSlugs.slice(0, 5));

  const day = new Date().getDay();
  const categories = { 1: 'immigration', 3: 'conveyancing', 5: 'legal-tech', 0: 'immigration' };
  const category = categories[day] || 'immigration';

  const topicRaw = await callClaude(
    'You are a JSON-only responder. Output only valid JSON, no markdown, no backticks.',
    `You are an SEO strategist for LexFlow, an AI SaaS for small UK immigration and conveyancing law firms.
Recent slugs to AVOID: ${recentSlugs.join(', ')}
Pick ONE blog post topic for category: "${category}"
Target: UK solicitors at small firms. UK-specific content (UKVI, Land Registry, SRA).
Return ONLY valid JSON:
{"title":"exact post title","slug":"url-slug-max-60-chars","focus_keyword":"primary keyword","meta_description":"150-160 char description","excerpt":"2-3 sentence excerpt","category":"${category}"}`,
    500
  );

  let topic;
  try {
    topic = JSON.parse(topicRaw.replace(/```json|```/g, '').trim());
  } catch (e) {
    throw new Error('Topic JSON parse failed: ' + topicRaw);
  }

  if (recentSlugs.includes(topic.slug)) topic.slug += '-' + Date.now();

  const content = await callClaude(
    `You are a senior legal content writer for UK immigration and conveyancing law firms.
Write authoritative, practical, SEO-optimised blog content.
UK English. Reference UK legislation, UKVI, SRA where relevant.
Mention LexFlow (AI intake automation, £997 one-time) once or twice where it fits naturally.
Output ONLY HTML body: use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>. No html/body tags.`,
    `Write a 1000-1400 word blog post.
Title: ${topic.title}
Focus keyword: ${topic.focus_keyword}
Category: ${topic.category}
Use focus keyword 3-5 times naturally. End with brief mention of LexFlow.`,
    3000
  );

  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;

  await savePost({
    title: topic.title,
    slug: topic.slug,
    excerpt: topic.excerpt,
    content,
    meta_description: topic.meta_description,
    focus_keyword: topic.focus_keyword,
    category: topic.category,
    published_at: new Date().toISOString(),
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
