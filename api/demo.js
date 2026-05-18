module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, dob, nationality, visaType, visaExpiry, caseType, description } = req.body;

  const prompt = `You are an AI assistant for a UK immigration law firm. A new client has submitted an intake form. Based on the following details, write a professional case summary for the solicitor that includes: 1) Client overview, 2) Current immigration status, 3) Requested legal service, 4) Key considerations and urgency, 5) Recommended next steps. Keep it concise and professional.

Client details:
- Full Name: ${name}
- Date of Birth: ${dob}
- Nationality: ${nationality}
- Current Visa Type: ${visaType}
- Visa Expiry Date: ${visaExpiry}
- Case Type: ${caseType}
- Client description: ${description}

Today's date is ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Use this as the date in the case summary header.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: data.error?.message || 'API error' });
  }

  res.status(200).json({ summary: data.content[0].text });
};
