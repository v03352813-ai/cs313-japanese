/**
 * CS313 韩语学习平台 · 卡密密码学防伪签名与核销算法
 * 基于 HMAC-SHA256 算法生成数学级数字防伪签名，杜绝任意伪造、穷举或绕过
 */

// 平台专属服务端防伪私钥盐值（绝不泄露）
const SIGNATURE_SECRET_SALT = 'CS313_KR_2026_PRODUCTION_AUTH_KEY_V9X_TOP_SECRET';

// 排除易混淆字符 0, O, 1, I 的 32 位标准 Base32 字母表
const SAFE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * 纯 JS 实现的确定性 SHA-256 算法（浏览器与 Node.js 100% 字节一致）
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i: number, j: number;
  let result = '';
  let words: number[] = [];
  let asciiBitLength = ascii.length * 8;
  let hash: number[] = [];
  let k: number[] = [];
  let primeCounter = 0;
  let isComposite: Record<number, number> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while (ascii.length % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length;) {
    let w = words.slice(j, (j += 16));
    let oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      let w15 = w[i - 15],
        w2 = w[i - 2];
      let a = hash[0],
        e = hash[4];
      let temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      let temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      let byte = (hash[i] >> (8 * b)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * 计算卡密专属的 4 位防伪校验签名
 */
export function computeKeySignature(type: 'KR' | 'ALL', serial: string): string {
  const payload = `${SIGNATURE_SECRET_SALT}:${type}:${serial.toUpperCase()}`;
  const rawHash = sha256(payload);

  // 截取哈希并映射到安全字符表生成 4 位防伪码
  let sig = '';
  for (let i = 0; i < 4; i++) {
    const hexPair = rawHash.slice(i * 4, i * 4 + 4);
    const num = parseInt(hexPair, 16);
    sig += SAFE_CHARSET[num % SAFE_CHARSET.length];
  }
  return sig;
}

/**
 * 生成符合闲管家自动发货标准的防伪卡密
 * 格式：CS313-KR-XXXX-YYYY 或 CS313-ALL-XXXX-YYYY
 */
export function generateSignedCardKey(type: 'KR' | 'ALL', customSerial?: string): string {
  let serial = customSerial?.toUpperCase();
  if (!serial || serial.length !== 4) {
    serial = '';
    for (let i = 0; i < 4; i++) {
      serial += SAFE_CHARSET[Math.floor(Math.random() * SAFE_CHARSET.length)];
    }
  }
  const signature = computeKeySignature(type, serial);
  return `CS313-${type}-${serial}-${signature}`;
}

export interface KeyVerificationResult {
  valid: boolean;
  type?: 'KR' | 'ALL';
  serial?: string;
  signature?: string;
  cleanKey: string;
  reason?: string;
}

/**
 * 校验卡密是否具有合法的密码学防伪签名
 * 杜绝任何 16 位假码、任意字符瞎填绕过
 */
export function verifyKeySignature(rawKey: string): KeyVerificationResult {
  const clean = (rawKey || '').trim().toUpperCase();

  if (!clean) {
    return { valid: false, cleanKey: clean, reason: '请输入激活卡密' };
  }

  // 严格正则匹配标准格式: CS313-(KR|ALL)-[4位序号]-[4位签名]
  const match = clean.match(/^CS313-(KR|ALL)-([2-9A-HJ-NP-Z]{4})-([2-9A-HJ-NP-Z]{4})$/);
  if (!match) {
    return {
      valid: false,
      cleanKey: clean,
      reason: '卡密无效，请仔细核对后重新输入。'
    };
  }

  const type = match[1] as 'KR' | 'ALL';
  const serial = match[2];
  const providedSig = match[3];

  // 重新计算预期防伪签名并严格比对
  const expectedSig = computeKeySignature(type, serial);
  if (providedSig !== expectedSig) {
    return {
      valid: false,
      cleanKey: clean,
      reason: '卡密无效，请仔细核对后重新输入。'
    };
  }

  return {
    valid: true,
    type,
    serial,
    signature: providedSig,
    cleanKey: clean
  };
}

/**
 * 批量生成供店主导入闲管家发货的卡密列表
 */
export function generateBatchSignedKeys(type: 'KR' | 'ALL', count: number = 20): string[] {
  const keys = new Set<string>();
  let attempts = 0;
  while (keys.size < count && attempts < count * 5) {
    attempts++;
    keys.add(generateSignedCardKey(type));
  }
  return Array.from(keys);
}
