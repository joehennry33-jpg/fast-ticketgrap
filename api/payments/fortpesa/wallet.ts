// Vercel Serverless Function: /api/payments/fortpesa/wallet
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.FORTPESA_API_KEY;
    if (apiKey && apiKey.startsWith('pb_live_')) {
      const fortpesaRes = await fetch('https://fortpesa.co.ke/api/v1/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const data = await fortpesaRes.json();
      return res.status(fortpesaRes.status).json(data);
    }

    return res.status(200).json({
      success: true,
      data: {
        balance: 4850,
        currency: 'KES',
        channel_id: Number(process.env.FORTPESA_CHANNEL_ID) || 54,
        isConfigured: false,
        message: 'Sandbox / Demo Wallet'
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Wallet check failed' });
  }
}
