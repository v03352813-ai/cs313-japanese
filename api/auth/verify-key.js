import crypto from 'node:crypto';
import { bindDeviceToLicense, checkRateLimit, recordFailedAttempt, getUserProgress } from '../lib/db.js';

const JP_SECRET_SALT = 'CS313_JP_2026_PRODUCTION_AUTH_KEY_V9X_TOP_SECRET';
const KR_SECRET_SALT = 'CS313_KR_2026_PRODUCTION_AUTH_KEY_V9X_TOP_SECRET';
const SAFE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

// 官方特权/母卡白名单（永久有效）
const PRESET_VIP_KEYS = {
  'CS313-ALL-VIP8-87GT': { tier: 'all_lang', planName: '全球小语种黑金终身通卡' },
  'CS313-ALL-GOLD-7U7R': { tier: 'all_lang', planName: '全球小语种黑金终身通卡' },
  'CS313-JP-8888-HL3Y': { tier: 'jp_lifetime', planName: '日语单语种终身VIP' },
  'CS313-JP-9999-DVCG': { tier: 'jp_lifetime', planName: '日语单语种终身VIP' },
  'CS313-JP-5200-Q2NH': { tier: 'jp_lifetime', planName: '日语单语种终身VIP' },
  'CS313-JP-6666-9575': { tier: 'jp_lifetime', planName: '日语单语种终身VIP' },
  'CS313-JP-7777-UU7Z': { tier: 'jp_lifetime', planName: '日语单语种终身VIP' },
  'CS313-KR-8888-A1B2': { tier: 'kr_lifetime', planName: '韩语单语种终身VIP' },
};

function computeKeySignature(type, serial, salt = JP_SECRET_SALT) {
  const payload = `${salt}:${type}:${serial.toUpperCase()}`;
  const rawHash = crypto.createHash('sha256').update(payload).digest('hex');
  let sig = '';
  for (let i = 0; i < 4; i++) {
    const hexPair = rawHash.slice(i * 4, i * 4 + 4);
    const num = parseInt(hexPair, 16);
    sig += SAFE_CHARSET[num % SAFE_CHARSET.length];
  }
  return sig;
}

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

  const rawFwd = req.headers['x-forwarded-for'];
  const rawIp = req.headers['x-real-ip'] || (typeof rawFwd === 'string' ? rawFwd.split(',')[0].trim() : req.socket?.remoteAddress) || '127.0.0.1';
  const clientIp = String(rawIp).replace(/[^0-9a-fA-F:.]/g, '').slice(0, 45);

  try {
    // 1. 防暴力破解限流保护 (5分钟输错超5次锁定)
    const isAllowed = await checkRateLimit(clientIp);
    if (!isAllowed) {
      return res.status(429).json({
        success: false,
        message: '⚠️ 安全风控警告：输错卡密次数过多，当前 IP 已被临时锁定 5 分钟，请稍后再试。'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { cardKey, device } = body;
    const cleanKey = (cardKey || '').trim().toUpperCase();

    if (!cleanKey) {
      return res.status(400).json({ success: false, message: '请输入激活卡密' });
    }

    const safeDevice = {
      deviceId: String(device?.deviceId || 'dev_unknown').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64),
      deviceType: String(device?.deviceType || device?.browser || '主力学习设备').slice(0, 50),
      browser: String(device?.browser || '').slice(0, 50)
    };

    let tier = 'jp_lifetime';
    let planName = 'CS313 日语单语种终身VIP';

    // 2. 优先检查是否命中官方特权/母卡白名单
    if (PRESET_VIP_KEYS[cleanKey]) {
      tier = PRESET_VIP_KEYS[cleanKey].tier;
      planName = PRESET_VIP_KEYS[cleanKey].planName;
    } else {
      // 3. 严格正则匹配标准格式: CS313-(JP|KR|ALL)-[4位序号]-[4位签名]
      const match = cleanKey.match(/^CS313-(JP|KR|ALL)-([0-9A-Z]{4})-([0-9A-Z]{4})$/);
      if (!match) {
        await recordFailedAttempt(clientIp);
        return res.status(400).json({
          success: false,
          message: '激活码格式无效（标准格式示例：CS313-JP-8888-HL3Y 或 CS313-ALL-VIP8-87GT）。'
        });
      }

      const type = match[1];
      const serial = match[2];
      const providedSig = match[3];

      // 4. 密码学数学签名校验（同时适配 JP 盐与 KR 盐）
      const expectedSigJP = computeKeySignature(type, serial, JP_SECRET_SALT);
      const expectedSigKR = computeKeySignature(type, serial, KR_SECRET_SALT);

      if (providedSig !== expectedSigJP && providedSig !== expectedSigKR) {
        await recordFailedAttempt(clientIp);
        return res.status(400).json({
          success: false,
          message: '激活码防伪签名校验失败！此码为伪造代码，无法激活。'
        });
      }

      tier = type === 'ALL' ? 'all_lang' : (type === 'JP' ? 'jp_lifetime' : 'kr_lifetime');
      planName = type === 'ALL' ? '全球小语种黑金终身通卡' : (type === 'JP' ? '日语单语种终身VIP' : '韩语单语种终身VIP');
    }

    // 5. 云数据库持久化 & 设备绑定与找回逻辑
    const dbResult = await bindDeviceToLicense(cleanKey, safeDevice, tier);

    if (!dbResult.success) {
      return res.status(403).json({
        success: false,
        message: dbResult.message
      });
    }

    // 5. 检查并拉取学员此前同步在云端的学习数据（用于换手机或清 Cookie 后恢复做题本）
    const cloudProgress = await getUserProgress(dbResult.license.userId);

    return res.status(200).json({
      success: true,
      action: dbResult.action,
      message: dbResult.message,
      license: {
        isVip: true,
        cardKey: cleanKey,
        licenseKey: cleanKey,
        tier: dbResult.license.tier,
        planName: dbResult.license.planName,
        activatedAt: dbResult.license.activatedAt,
        boundDevicesCount: dbResult.license.boundDevices?.length || 1,
        maxDevices: dbResult.license.maxDevices || 2,
        boundDevices: dbResult.license.boundDevices,
        userId: dbResult.license.userId
      },
      cloudProgress
    });
  } catch (err) {
    console.error('[Verify Key Error]', err);
    return res.status(500).json({
      success: false,
      message: '服务端核销异常，请稍后重试'
    });
  }
}
