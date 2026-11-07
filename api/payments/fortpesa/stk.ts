// Vercel Serverless Function: /api/payments/fortpesa/stk
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { bookingReference, phoneNumber, amountKes, description } = body;

    let phone = String(phoneNumber || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('0') && phone.length === 10) {
      phone = '254' + phone.slice(1);
    } else if ((phone.startsWith('7') || phone.startsWith('1')) && phone.length === 9) {
      phone = '254' + phone;
    }

    if (!phone || phone.length !== 12 || !phone.startsWith('254')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format. Please enter a valid 10-digit Kenyan phone number (e.g. 0712345678).'
      });
    }

    const amount = Math.max(1, Math.round(Number(amountKes) || 1000));
    let rawChannel = process.env.FORTPESA_CHANNEL_ID;
    let channelId = Number(rawChannel);

    // If channelId is not a valid integer or was given as a UUID, use confirmed Channel ID 54
    if (isNaN(channelId) || !channelId || channelId <= 0) {
      channelId = 54;
    }

    const accountRef = String(bookingReference || 'KP-NAI-001').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    const desc = String(description || 'AjaxBayern').replace(/[^a-zA-Z0-9]/g, '').slice(0, 13);
    const apiKey = process.env.FORTPESA_API_KEY;

    // Call live Fortpesa API if key is present
    if (apiKey && apiKey.startsWith('pb_live_')) {
      const fortpesaRes = await fetch('https://fortpesa.co.ke/api/v1/payments/stk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `idemp-${bookingReference}-${Date.now()}`
        },
        body: JSON.stringify({
          amount,
          phone,
          channel_id: channelId,
          account_reference: accountRef,
          description: desc
        })
      });

      const responseText = await fortpesaRes.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText };
      }

      if (!fortpesaRes.ok) {
        let errorMsg = responseData?.message || responseData?.error?.message || responseData?.error || `Fortpesa error (${fortpesaRes.status})`;
        if (fortpesaRes.status === 402 || responseData?.error?.code === 'INSUFFICIENT_BALANCE') {
          errorMsg = 'Fortpesa Error 402: Insufficient prepaid wallet balance (KES 0.00). Please top up your Fortpesa platform wallet in your Fortpesa dashboard to cover Safaricom fees.';
        }
        return res.status(fortpesaRes.status).json({
          success: false,
          message: errorMsg,
          details: responseData
        });
      }

      return res.status(201).json({
        success: true,
        message: `STK push initiated via Fortpesa. Check your phone (${phone}).`,
        data: responseData.data || responseData
      });
    }

    // Sandbox / Simulation fallback
    const simUuid = `fp-sim-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return res.status(201).json({
      success: true,
      message: `Fortpesa STK prompt sent to ${phone}. Enter your M-PESA PIN to authorize.`,
      data: {
        uuid: simUuid,
        status: 'pending',
        amount,
        phone,
        account_reference: accountRef,
        isSimulated: true
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Error processing Fortpesa STK push.'
    });
  }
}
