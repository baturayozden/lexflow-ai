module.exports = async (req, res) => {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // PATCH — mark a step complete on an existing case
  if (req.method === 'PATCH') {
    try {
      const { caseId, stepIndex, step } = req.body;
      const getRes = await fetch(`${url}/get/case:${caseId}`, { headers });
      const getJson = await getRes.json();
      const caseData = JSON.parse(getJson.result);

      if (!caseData.completedSteps) caseData.completedSteps = [];
      if (!caseData.completedSteps.includes(stepIndex)) {
        caseData.completedSteps.push(stepIndex);
      }

      await fetch(`${url}/set/case:${caseId}`, {
        method: 'POST', headers,
        body: JSON.stringify({ value: JSON.stringify(caseData) })
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('PATCH save-case error:', error);
      return res.status(500).json({ error: 'Failed to update case' });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // POST — create a new case record
  try {
    const { ip, city, country, ...rest } = req.body;

    const caseData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ip: ip || null,
      city: city || null,
      country: country || null,
      ...rest
    };

    await fetch(`${url}/set/case:${caseData.id}`, {
      method: 'POST', headers,
      body: JSON.stringify({ value: JSON.stringify(caseData) })
    });

    await fetch(`${url}/lpush/cases`, {
      method: 'POST', headers,
      body: JSON.stringify({ value: caseData.id })
    });

    res.status(200).json({ success: true, caseId: caseData.id });
  } catch (error) {
    console.error('Save case error:', error);
    res.status(500).json({ error: 'Failed to save case' });
  }
};
