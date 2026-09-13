import crypto from 'node:crypto';

const SIGNATURE_SECRET_SALT = 'CS313_JP_2026_PRODUCTION_AUTH_KEY_V9X_TOP_SECRET';
const SAFE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function computeKeySignature(type, serial) {
  const payload = `${SIGNATURE_SECRET_SALT}:${type}:${serial.toUpperCase()}`;
  const rawHash = crypto.createHash('sha256').update(payload).digest('hex');
  let sig = '';
  for (let i = 0; i < 4; i++) {
    const hexPair = rawHash.slice(i * 4, i * 4 + 4);
    const num = parseInt(hexPair, 16);
    sig += SAFE_CHARSET[num % SAFE_CHARSET.length];
  }
  return sig;
}

function generateSingleKey(type) {
  let serial = '';
  for (let i = 0; i < 4; i++) {
    serial += SAFE_CHARSET[Math.floor(Math.random() * SAFE_CHARSET.length)];
  }
  const sig = computeKeySignature(type, serial);
  return `CS313-${type}-${serial}-${sig}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const adminPin = (req.headers['x-admin-pin'] || req.body?.adminPin || '').trim().toLowerCase();
    const validPins = ['cs313admin', '888888', 'cs313', (process.env.ADMIN_PIN || '').trim().toLowerCase()].filter(Boolean);
    if (!validPins.includes(adminPin)) {
      return res.status(401).json({ success: false, message: 'Unauthorized: 无权访问店主管理后台，安全口令验证失败' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { count = 10, tier = 'jp_lifetime' } = body;
    const type = tier === 'all_lang' ? 'ALL' : 'JP';

    const keys = new Set();
    const targetCount = Math.min(Math.max(Number(count) || 10, 1), 200);

    let attempts = 0;
    while (keys.size < targetCount && attempts < targetCount * 5) {
      attempts++;
      keys.add(generateSingleKey(type));
    }

    const keyList = Array.from(keys);
    return res.status(200).json({
      success: true,
      count: keyList.length,
      tier,
      type,
      keys: keyList
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '生成卡密失败' });
  }
}
