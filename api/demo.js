const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { name, dob, nationality, visaType, visaExpiry, caseType, description } = req.body;

  const prompt = `You are an AI assistant for a UK immigration law firm. A new client has submitted an intake form. Based on the following details, write a professional case summary for the solicitor that includes: 1) Client overview, 2) Current immigration status, 3) Requested legal service, 4) Key considerations and urgency, 5) Recommended next steps. Keep it concise and professional.

Client details:
- Full Name: ${name}
- Date of Birth: ${dob}
- Nationality: ${nationality}
- Current Visa Type: ${visaType}
- Visa Expiry Date: ${visaExpiry}
- Case Type: ${caseType}
- Client's description: ${description}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  res.status(200).json({ summary: message.content[0].text });
};
