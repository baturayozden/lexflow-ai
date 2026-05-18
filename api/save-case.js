module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const caseData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    await fetch(`${url}/set/case:${caseData.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: JSON.stringify(caseData) })
    });

    await fetch(`${url}/lpush/cases`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: caseData.id })
    });

    res.status(200).json({ success: true, caseId: caseData.id });
  } catch (error) {
    console.error('Save case error:', error);
    res.status(500).json({ error: 'Failed to save case' });
  }
};
