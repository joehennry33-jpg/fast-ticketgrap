// Vercel Serverless Function: /api/payments/fortpesa/status
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const uuid = req.query?.uuid || req.query?.id;
    const apiKey = process.env.FORTPESA_API_KEY;

    if (apiKey && apiKey.startsWith('pb_live_') && uuid && !String(uuid).startsWith('fp-sim-')) {
      const fortpesaRes = await fetch(`https://fortpesa.co.ke/api/v1/transactions/${uuid}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const data = await fortpesaRes.json();
      return res.status(fortpesaRes.status).json(data);
    }

    // Simulated status check: succeed after short duration
    const receipt = `MP${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10000000 + Math.random() * 90000000)}`;

    return res.status(200).json({
      success: true,
      data: {
        uuid: uuid || `fp-sim-${Date.now()}`,
        status: 'success',
        amount: 12500,
        phone: '254712345678',
        receipt_number: receipt,
        result_description: 'The service request is processed successfully.',
        isSimulated: true
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Status query failed' });
  }
}
