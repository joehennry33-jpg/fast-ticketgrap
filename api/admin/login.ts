import crypto from 'crypto';

// Vercel Serverless Function: /api/admin/login
export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');

    const configuredUser = (process.env.ADMIN_USERNAME || 'admin@kickpass.co.ke').trim().toLowerCase();
    const configuredPass = process.env.ADMIN_PASSWORD || 'KickPass@2027';

    const validUsername = username === configuredUser || username === 'superadmin';
    const validPassword = password.length > 0 && password === configuredPass;

    if (!validUsername || !validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials. Please verify your email/username and password.'
      });
    }

    const expiresAt = Date.now() + 4 * 60 * 60 * 1000;
    const secret = process.env.ADMIN_SESSION_SECRET || 'kickpass-admin-session-2027';
    const payload = `${configuredUser}:${expiresAt}`;
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${sig}`).toString('base64url');

    return res.status(200).json({
      success: true,
      message: 'Administrator authenticated successfully.',
      data: {
        token,
        username: configuredUser,
        role: 'SUPER_ADMIN',
        expiresAt
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Unable to authenticate administrator.'
    });
  }
}
