module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: 'summary required' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Extract the recommended next steps from this legal case summary. Return ONLY a valid JSON array, no markdown, no explanation. Each object must have exactly these fields: {"step": "action description", "type": "consultation|documents|eligibility|quote|followup", "urgency": "high|medium|low"}. Summary: ${summary}`
      }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('[parse-steps] Claude API error:', data);
    return res.status(500).json({ error: 'API error' });
  }

  const text = data.content[0].text.trim();
  console.log('[parse-steps] Claude raw output:', text);

  try {
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const steps = JSON.parse(clean);
    if (!Array.isArray(steps)) throw new Error('Not an array');
    res.status(200).json({ steps });
  } catch (e) {
    console.error('[parse-steps] Parse error, returning fallback:', e.message);
    res.status(200).json({ steps: [
      { step: "Schedule initial consultation to assess full case details", type: "consultation", urgency: "high" },
      { step: "Request supporting documents from client", type: "documents", urgency: "medium" },
      { step: "Prepare fee estimate for client", type: "quote", urgency: "low" }
    ]});
  }
};
