import { saveUserProgress, getUserProgress } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { userId } = req.query || {};
      if (!userId) {
        return res.status(400).json({ success: false, message: 'Missing userId' });
      }
      const progress = await getUserProgress(userId);
      return res.status(200).json({ success: true, progress });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { userId, progress } = body;
      if (!userId || !progress) {
        return res.status(400).json({ success: false, message: 'Missing userId or progress data' });
      }

      await saveUserProgress(userId, progress);
      return res.status(200).json({ success: true, message: 'Progress saved to cloud database' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('[Study Sync Error]', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
