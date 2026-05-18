module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const caseData = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };

  // Store in Vercel KV (we will connect KV in next step)
  // For now store in a simple log
  console.log('NEW CASE SAVED:', JSON.stringify(caseData));

  res.status(200).json({ success: true, caseId: caseData.id });
};
