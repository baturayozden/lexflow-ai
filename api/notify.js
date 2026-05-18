module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, nationality, visaType, visaExpiry, caseType, description, summary } = req.body;

  console.log('New intake submission received:', {
    name, email, phone, nationality, visaType, visaExpiry, caseType, description, summary,
  });

  // Email sending via Resend will be wired up in the next step:
  // await fetch('https://api.resend.com/emails', { ... })

  res.status(200).json({ success: true });
};
