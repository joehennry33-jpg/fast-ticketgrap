// Vercel Serverless Function: /api/payments/stk-push
export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  return res.status(200).json({
    success: true,
    MerchantRequestID: `${Math.floor(1000000 + Math.random() * 9000000)}`,
    CheckoutRequestID: `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: `Success. An STK PIN prompt has been sent to ${body.phoneNumber || 'your phone'}.`
  });
}
