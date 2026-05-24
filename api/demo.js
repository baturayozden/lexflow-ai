module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, dob, nationality, visaType, visaExpiry, caseType, description } = req.body;

  // Resolve client IP
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;
  console.log('Client IP:', ip);

  let city = 'Unknown';
  let country = 'Unknown';

  const isPrivate = !ip || ip === '::1' || ip === '127.0.0.1' || ip?.startsWith('192.168') || ip?.startsWith('10.');

  if (!isPrivate) {
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country`);
      const geoData = await geoRes.json();
      console.log('Geo result:', geoData);
      city = geoData.status === 'success' ? geoData.city : 'Unknown';
      country = geoData.status === 'success' ? geoData.country : 'Unknown';
    } catch (err) {
      console.error('Geolocation error:', err.message);
    }
  }

  const prompt = `You are an expert UK immigration law solicitor's assistant. A new client has submitted an intake form.

IMPORTANT LANGUAGE INSTRUCTION: The client may have written their description in any language. If it is not in English, translate it and note the original language. Always write the full case summary in professional English.

Based on the following client details, write a comprehensive professional case summary for the supervising solicitor. Format it clearly with each header on its own line.

Client details:
- Full Name: ${name}
- Date of Birth: ${dob}
- Nationality: ${nationality}
- Current Visa Type: ${visaType}
- Visa Expiry Date: ${visaExpiry || 'Not provided'}
- Case Type: ${caseType}
- Client's description (may be in any language): ${description}
- Client Location: ${city}, ${country} (based on IP)
- Today's Date: ${new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}

Start the summary with these three items each on their own separate line:

**Date:** [today's date]

**Prepared for:** Supervising Solicitor

**Case Reference:** Pending Assignment

Each must be on its own line with a blank line between them. Do not put them on the same line.

---

## 1) CLIENT OVERVIEW
[Name, DOB with age, nationality, location]

## 2) CLIENT'S DESCRIPTION
[If not in English, state: "Originally submitted in [language]:" then provide the original text, followed by "Translation:" and the English translation. If already in English, just include the description.]

## 3) CURRENT IMMIGRATION STATUS
[Current visa, expiry, status assessment]

## 4) REQUESTED LEGAL SERVICE
[Case type and what the client is seeking]

## 5) KEY CONSIDERATIONS & URGENCY
[Critical factors, risks, timeline concerns, urgency level: HIGH/MEDIUM/LOW]

## 6) RECOMMENDED NEXT STEPS
[Numbered action list for the solicitor]

**Priority Level:** [HIGH/MEDIUM/LOW] — [one sentence reason]`;

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

  res.status(200).json({ summary: data.content[0].text, ip, city, country });
};
