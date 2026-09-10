import crypto from 'node:crypto';
import { bindDeviceToLicense, checkRateLimit, recordFailedAttempt, getUserProgress } from '../lib/db.js';

const SIGNATURE_SECRET_SALT = 'CS313_KR_2026_PRODUCTION_AUTH_KEY_V9X_TOP_SECRET';
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

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

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

    // 2. 严禁任意 16 位字符随意通过，必须严格符合 CS313 密码学防伪格式
    const match = cleanKey.match(/^CS313-(KR|ALL)-([2-9A-HJ-NP-Z]{4})-([2-9A-HJ-NP-Z]{4})$/);
    if (!match) {
      await recordFailedAttempt(clientIp);
      return res.status(400).json({
        success: false,
        message: '激活码格式无效（标准格式示例：CS313-KR-8888-A1B2）。'
      });
    }

    const type = match[1];
    const serial = match[2];
    const providedSig = match[3];

    // 3. 密码学数学签名校验
    const expectedSig = computeKeySignature(type, serial);
    if (providedSig !== expectedSig) {
      await recordFailedAttempt(clientIp);
      return res.status(400).json({
        success: false,
        message: '激活码防伪签名校验失败！此码为伪造代码，无法激活。'
      });
    }

    // 4. 云数据库持久化 & 设备绑定与找回逻辑
    const tier = type === 'ALL' ? 'all_lang' : 'kr_lifetime';
    const dbResult = await bindDeviceToLicense(cleanKey, device, tier);

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
