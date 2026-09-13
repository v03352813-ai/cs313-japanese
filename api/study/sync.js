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
      const cleanUserId = String(userId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      if (!cleanUserId) {
        return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
      }
      const progress = await getUserProgress(cleanUserId);
      return res.status(200).json({ success: true, progress });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { userId, progress } = body;
      const cleanUserId = String(userId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      if (!cleanUserId || !progress || typeof progress !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid payload structure' });
      }

      // 严格限制数组长度与类型，防止超大攻击载荷击穿内存
      const sanitizedProgress = {
        userId: cleanUserId,
        masteredVocabIds: Array.isArray(progress.masteredVocabIds) 
          ? progress.masteredVocabIds.slice(0, 10000).map((id) => String(id).slice(0, 64))
          : [],
        masteredGrammarIds: Array.isArray(progress.masteredGrammarIds)
          ? progress.masteredGrammarIds.slice(0, 2000).map((id) => String(id).slice(0, 64))
          : [],
        studyStreak: Math.min(Math.max(Number(progress.studyStreak) || 0, 0), 10000),
        lastCheckinDate: progress.lastCheckinDate ? String(progress.lastCheckinDate).slice(0, 30) : null,
        updatedAt: new Date().toISOString()
      };

      await saveUserProgress(cleanUserId, sanitizedProgress);
      return res.status(200).json({ success: true, message: 'Progress saved to cloud database', progress: sanitizedProgress });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('[Study Sync Error]', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
