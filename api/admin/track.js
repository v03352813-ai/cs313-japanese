import { trackAnalyticsEvent } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { type = 'page_view', visitorId, deviceType } = body;

    await trackAnalyticsEvent(type, { visitorId, deviceType });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: false, message: 'Track silent fail' });
  }
}
