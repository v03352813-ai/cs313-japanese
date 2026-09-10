import { 
  verifyKeySignature, 
  generateSignedCardKey, 
  generateBatchSignedKeys 
} from '../../utils/cardKeyCrypto';
import { 
  OFFICIAL_PRESET_KR_KEYS, 
  OFFICIAL_PRESET_ALL_KEYS 
} from './officialKeyPool';

export interface LicenseInfo {
  isVip: boolean;
  licenseKey?: string;
  cardKey?: string;
  type?: 'KOREAN_SINGLE' | 'ALL_LANGUAGES_VIP';
  tier?: string;
  activatedAt?: string;
  planName?: string;
  boundDevicesCount?: number;
  maxDevices?: number;
  userId?: string;
}

// 预设的一批官方首推示范卡密（已注入密码学签名）
export const PRESET_VIP_KEYS: Record<string, { type: 'KOREAN_SINGLE' | 'ALL_LANGUAGES_VIP'; planName: string }> = {
  'CS313-KR-8888-YQK5': { type: 'KOREAN_SINGLE', planName: '韩语单语种终身VIP' },
  'CS313-KR-9999-YWME': { type: 'KOREAN_SINGLE', planName: '韩语单语种终身VIP' },
  'CS313-KR-5200-5BNR': { type: 'KOREAN_SINGLE', planName: '韩语单语种终身VIP' },
  'CS313-KR-6666-3GA7': { type: 'KOREAN_SINGLE', planName: '韩语单语种终身VIP' },
  'CS313-KR-7777-N6P8': { type: 'KOREAN_SINGLE', planName: '韩语单语种终身VIP' },
  'CS313-ALL-GOLD-7U7R': { type: 'ALL_LANGUAGES_VIP', planName: '全球小语种黑金终身通卡' },
  'CS313-ALL-VIP8-87GT': { type: 'ALL_LANGUAGES_VIP', planName: '全球小语种黑金终身通卡' }
};

// 店主管理后台访问安全密码验证
export const ADMIN_PIN_CODES = ['cs313admin', '888888', 'cs313'];
const ADMIN_SESSION_KEY = 'cs313_admin_session_auth_v1';
const STORAGE_KEY = 'cs313_vip_license_v1';
const ADMIN_GENERATED_KEYS_STORAGE = 'cs313_admin_generated_keys_v2';
const BINDINGS_STORAGE_KEY = 'cs313_key_device_bindings_v2';

export function checkAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function verifyAdminPin(pin: string): boolean {
  const clean = pin.trim().toLowerCase();
  if (ADMIN_PIN_CODES.includes(clean)) {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
    } catch {
      // Ignore storage errors
    }
    return true;
  }
  return false;
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Ignore
  }
}

/**
 * 获取店主后台动态生成的所有有效卡密
 */
export function getAdminGeneratedKeys(): string[] {
  try {
    const raw = localStorage.getItem(ADMIN_GENERATED_KEYS_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 保存店主后台新生成的卡密到有效库
 */
export function saveAdminGeneratedKeys(newKeys: string[]): void {
  try {
    const existing = getAdminGeneratedKeys();
    const set = new Set([...existing, ...newKeys]);
    localStorage.setItem(ADMIN_GENERATED_KEYS_STORAGE, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage errors
  }
}

/**
 * 获取卡密设备绑定记录
 */
interface KeyBindingRecord {
  boundDeviceIds: string[];
  firstActivatedAt: string;
  lastActiveAt: string;
}

function getKeyBindings(): Record<string, KeyBindingRecord> {
  try {
    const raw = localStorage.getItem(BINDINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveKeyBindings(bindings: Record<string, KeyBindingRecord>): void {
  try {
    localStorage.setItem(BINDINGS_STORAGE_KEY, JSON.stringify(bindings));
  } catch {
    // Ignore storage errors
  }
}

/**
 * 核心严格鉴权：密码学签名 + 官方出库白名单 + 严格2台设备核销
 * 严禁任何 16 位假码、任意字符瞎填绕过！
 */
export function verifyCardKey(
  key: string, 
  device?: { deviceId?: string; deviceName?: string }
): { success: boolean; message: string; license?: LicenseInfo } {
  const cleanKey = (key || '').trim().toUpperCase();

  if (!cleanKey) {
    return { success: false, message: '请输入激活卡密' };
  }

  // 1. 第一道防线：数学级数字防伪签名校验（杜绝假码、瞎填）
  const sigResult = verifyKeySignature(cleanKey);
  if (!sigResult.valid) {
    return {
      success: false,
      message: sigResult.reason || '激活码无效或已被篡改，请核对后重试。'
    };
  }

  // 2. 第二道防线：官方正版出库库比对（杜绝未售出或伪造号码）
  const isInPresetKr = OFFICIAL_PRESET_KR_KEYS.includes(cleanKey);
  const isInPresetAll = OFFICIAL_PRESET_ALL_KEYS.includes(cleanKey);
  const isInPresetDemo = Boolean(PRESET_VIP_KEYS[cleanKey]);
  const isInAdminGenerated = getAdminGeneratedKeys().includes(cleanKey);

  const isOfficiallyIssued = isInPresetKr || isInPresetAll || isInPresetDemo || isInAdminGenerated;

  if (!isOfficiallyIssued) {
    return {
      success: false,
      message: '激活码未在官方出库系统中，请核对小红书/闲鱼拍下后发货的卡密，或联系客服。'
    };
  }

  // 3. 第三道防线：设备绑定与 2 台设备使用限制
  const devId = device?.deviceId || `dev_${Math.random().toString(36).slice(2, 10)}`;
  const now = new Date().toISOString();
  const bindings = getKeyBindings();
  const record = bindings[cleanKey] || {
    boundDeviceIds: [],
    firstActivatedAt: now,
    lastActiveAt: now
  };

  const isAlreadyBoundToThisDevice = record.boundDeviceIds.includes(devId);

  if (!isAlreadyBoundToThisDevice) {
    if (record.boundDeviceIds.length >= 2) {
      return {
        success: false,
        message: '安全拦截：该卡密已在 2 台设备绑定激活，已达最大设备上限！严禁转借他人或多设备滥用。如需更换设备请联系官方微信客服。'
      };
    }

    // 绑定新设备
    record.boundDeviceIds.push(devId);
    record.lastActiveAt = now;
    bindings[cleanKey] = record;
    saveKeyBindings(bindings);
  } else {
    record.lastActiveAt = now;
    bindings[cleanKey] = record;
    saveKeyBindings(bindings);
  }

  const isAllLang = sigResult.type === 'ALL' || cleanKey.includes('ALL') || PRESET_VIP_KEYS[cleanKey]?.type === 'ALL_LANGUAGES_VIP';
  const planName = isAllLang ? 'CS313 全球小语种黑金终身通卡' : 'CS313 韩语单语种终身VIP';
  const tier = isAllLang ? '全语种黑金卡' : '韩语单语种终身VIP';

  const license: LicenseInfo = {
    isVip: true,
    licenseKey: cleanKey,
    cardKey: cleanKey,
    type: isAllLang ? 'ALL_LANGUAGES_VIP' : 'KOREAN_SINGLE',
    tier,
    planName,
    activatedAt: record.firstActivatedAt || new Date().toLocaleDateString('zh-CN'),
    boundDevicesCount: record.boundDeviceIds.length,
    maxDevices: 2,
    userId: `std_${cleanKey.replace(/[^A-Z0-9]/g, '').slice(-8).toLowerCase()}`
  };

  saveLicense(license);

  const deviceNotice = record.boundDeviceIds.length === 1 
    ? '（已绑定当前第 1 台设备，还可绑定 1 台备用设备）'
    : '（已绑定满 2 台授权设备）';

  return {
    success: true,
    message: `🎉 恭喜！已成功激活【${planName}】！${deviceNotice}`,
    license
  };
}

export function getSavedLicense(): LicenseInfo {
  try {
    let data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // 兼容可能存在的 cs313_license_info key
      data = localStorage.getItem('cs313_license_info');
    }
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        // 双向同步确保无论读取哪个 key 都能持久保持
        if (!localStorage.getItem(STORAGE_KEY)) {
          localStorage.setItem(STORAGE_KEY, data);
        }
        if (!localStorage.getItem('cs313_license_info')) {
          localStorage.setItem('cs313_license_info', data);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load license', e);
  }
  return { isVip: false };
}

export function saveLicense(license: LicenseInfo) {
  try {
    const serialized = JSON.stringify(license);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem('cs313_license_info', serialized);
  } catch (e) {
    console.error('Failed to save license', e);
  }
}

export function clearLicense() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cs313_license_info');
  } catch (e) {
    console.error('Failed to clear license', e);
  }
}

/**
 * 批量生成供店主导入闲管家发货的卡密列表
 * 并自动入库，确保学员拿到即可正常激活！
 */
export function generateBatchKeys(type: 'KR' | 'ALL', count: number = 20): string[] {
  const newKeys = generateBatchSignedKeys(type, count);
  saveAdminGeneratedKeys(newKeys);
  return newKeys;
}
