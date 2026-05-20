module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, nationality, visaType, visaExpiry, caseType, description } = req.body;

  const prompt = `You are a UK immigration law expert. Based on the client details below, provide a brief eligibility assessment. Return ONLY a JSON object, no other text: {"eligible": boolean, "confidence": "high"/"medium"/"low", "summary": "one sentence", "considerations": ["item1","item2"]}

Client: ${name}
Nationality: ${nationality}
Current Visa: ${visaType}
Visa Expiry: ${visaExpiry || 'N/A'}
Case Type: ${caseType}
Situation: ${description}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: 'API error' });

  try {
    const text = data.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    res.status(200).json(JSON.parse(match[0]));
  } catch (_) {
    res.status(200).json({
      eligible: null,
      confidence: 'low',
      summary: 'Unable to assess eligibility automatically.',
      considerations: []
    });
  }
};
