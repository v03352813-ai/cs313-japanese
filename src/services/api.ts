/**
 * CS313 日语研习社 · 前端统一云端 API 数据服务层
 * 支持【Local-First 双模架构】：优先连云端 API，离线/弱网自动使用本地缓存兜底
 */
import type { LicenseInfo } from '../data/auth/cardKeys';
import { verifyCardKey as verifyCardKeyLocal, saveLicense } from '../data/auth/cardKeys';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export interface DeviceInfo {
  deviceId: string;
  deviceType?: string;
  browser?: string;
  ip?: string;
}

export interface StudentProgress {
  userId?: string;
  masteredVocabIds: string[];
  masteredGrammarIds: string[];
  studyStreak: number;
  lastCheckinDate: string | null;
  customNotes?: Record<string, any>;
  updatedAt?: string | null;
}

export interface ExamRecordSubmission {
  userId?: string;
  paperId: string;
  paperTitle: string;
  score: number;
  totalScore?: number;
  timeSpentSec?: number;
  userAnswers: Record<string | number, number>;
  wrongQuestionIds: (string | number)[];
}

class ApiService {
  private isOnlineCache: boolean | null = null;
  private lastHealthCheck: number = 0;

  /**
   * 检测后端 API 服务是否在线 (30秒缓存)
   */
  async isServerOnline(): Promise<boolean> {
    const now = Date.now();
    if (this.isOnlineCache !== null && now - this.lastHealthCheck < 30000) {
      return this.isOnlineCache;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-cache' });
      this.isOnlineCache = res.ok;
      this.lastHealthCheck = now;
      return res.ok;
    } catch {
      this.isOnlineCache = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  /**
   * 卡密云端核销与设备绑定（严格防伪鉴权）
   */
  async verifyCardKey(cardKey: string, device: DeviceInfo): Promise<{ success: boolean; message: string; license?: LicenseInfo; action?: string; cloudProgress?: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardKey, device })
      });
      const data = await res.json();
      if (data.success && data.license) {
        saveLicense(data.license);
        // 关键：如果云端返回了此前备份的进度与错题本（换手机或清 Cookie 场景），立即恢复到本地！
        if (data.cloudProgress) {
          try {
            const localSaved = localStorage.getItem('cs313_study_progress');
            const localData = localSaved ? JSON.parse(localSaved) : {};
            const merged = {
              ...data.cloudProgress,
              ...localData,
              masteredVocabIds: Array.from(new Set([...(data.cloudProgress.masteredVocabIds || []), ...(localData.masteredVocabIds || [])])),
              masteredGrammarIds: Array.from(new Set([...(data.cloudProgress.masteredGrammarIds || []), ...(localData.masteredGrammarIds || [])]))
            };
            localStorage.setItem('cs313_study_progress', JSON.stringify(merged));
          } catch (e) {
            console.warn('[Progress Restore Warning]', e);
          }
        }
        return data;
      }
      if (!data.success) {
        return data;
      }
    } catch (err: any) {
      console.warn('[API Verification] Server unreachable, validating with cryptographic engine:', err);
    }

    // 服务端未连接时使用本地密码学防伪引擎严密核销（杜绝任何假码绕过）
    const localResult = verifyCardKeyLocal(cardKey, device);
    if (localResult.success && localResult.license) {
      saveLicense(localResult.license);
    }
    return localResult;
  }

  /**
   * 学员学习进度云端双向同步 (单词掌握、打卡天数等)
   */
  async syncStudyProgress(progress: Partial<StudentProgress>): Promise<StudentProgress> {
    const cachedLicenseStr = localStorage.getItem('cs313_license_info');
    let userId = 'std_local_guest';
    if (cachedLicenseStr) {
      try {
        const lic = JSON.parse(cachedLicenseStr);
        if (lic.userId) userId = lic.userId;
      } catch {}
    }

    // 本地持久化缓存
    const localSavedStr = localStorage.getItem('cs313_study_progress');
    const currentLocal: StudentProgress = localSavedStr ? JSON.parse(localSavedStr) : {
      userId,
      masteredVocabIds: [],
      masteredGrammarIds: [],
      studyStreak: 0,
      lastCheckinDate: null
    };

    const merged: StudentProgress = {
      userId,
      masteredVocabIds: Array.from(new Set([...currentLocal.masteredVocabIds, ...(progress.masteredVocabIds || [])])),
      masteredGrammarIds: Array.from(new Set([...currentLocal.masteredGrammarIds, ...(progress.masteredGrammarIds || [])])),
      studyStreak: Math.max(currentLocal.studyStreak, progress.studyStreak || 0),
      lastCheckinDate: progress.lastCheckinDate || currentLocal.lastCheckinDate,
      customNotes: { ...(currentLocal.customNotes || {}), ...(progress.customNotes || {}) },
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('cs313_study_progress', JSON.stringify(merged));

    // 尝试云端同步至 /api/study/sync
    try {
      const res = await fetch(`${API_BASE_URL}/study/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, progress: merged })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.progress) {
          localStorage.setItem('cs313_study_progress', JSON.stringify(data.progress));
          return data.progress;
        }
      }
    } catch {
      // 离线保持使用 local
    }

    return merged;
  }

  /**
   * 获取学员最新云端进度
   */
  async getStudyProgress(userId: string): Promise<StudentProgress> {
    try {
      const res = await fetch(`${API_BASE_URL}/user/progress?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.progress) {
          localStorage.setItem('cs313_study_progress', JSON.stringify(data.progress));
          return data.progress;
        }
      }
    } catch {}

    const localSavedStr = localStorage.getItem('cs313_study_progress');
    return localSavedStr ? JSON.parse(localSavedStr) : {
      userId,
      masteredVocabIds: [],
      masteredGrammarIds: [],
      studyStreak: 0,
      lastCheckinDate: null
    };
  }

  /**
   * 提交真题模考答卷
   */
  async submitExamRecord(submission: ExamRecordSubmission): Promise<{ success: boolean; recordId?: string }> {
    const cachedLicenseStr = localStorage.getItem('cs313_license_info');
    let userId = 'std_local_guest';
    if (cachedLicenseStr) {
      try {
        const lic = JSON.parse(cachedLicenseStr);
        if (lic.userId) userId = lic.userId;
      } catch {}
    }

    const payload = { ...submission, userId };

    try {
      const res = await fetch(`${API_BASE_URL}/exam/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    return { success: true, recordId: `local_${Date.now()}` };
  }

  private getAdminHeaders(): Record<string, string> {
    const pin = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('cs313_admin_pin') || '') : '';
    return {
      'Content-Type': 'application/json',
      'x-admin-pin': pin
    };
  }

  /**
   * 店主后台：一键批量生成卡密 (需口令鉴权)
   */
  async adminGenerateKeys(count: number = 10, tier: string = 'jp_lifetime', batchNo: string = '2026-BATCH', price: number = 49.9): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/generate-keys`, {
        method: 'POST',
        headers: this.getAdminHeaders(),
        body: JSON.stringify({ count, tier, batchNo, price })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || '网络连接失败' };
    }
  }

  /**
   * 店主后台：获取实时统计大盘 (需口令鉴权)
   */
  async adminGetStats(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: this.getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

/**
 * 智能渠道与搜索引擎/AI平台指纹识别 (First-touch Attribution)
 */
function detectInboundSource(): { channel: string; medium: string; keyword?: string; referrer?: string } {
  if (typeof window === 'undefined') return { channel: 'direct', medium: 'none' };
  
  const urlParams = new URLSearchParams(window.location.search);
  const ref = (document.referrer || '').toLowerCase();
  
  // 1. 显式推广 UTM 参数
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmTerm = urlParams.get('utm_term');
  if (utmSource) {
    return {
      channel: utmSource,
      medium: utmMedium || 'campaign',
      keyword: utmTerm || undefined,
      referrer: document.referrer
    };
  }

  // 2. AI 搜索引擎与 RAG 平台 (GEO 核心引流追踪)
  if (ref.includes('deepseek.com')) return { channel: 'ai_deepseek', medium: 'geo_ai', referrer: document.referrer };
  if (ref.includes('doubao.com')) return { channel: 'ai_doubao', medium: 'geo_ai', referrer: document.referrer };
  if (ref.includes('tongyi') || ref.includes('aliyun.com')) return { channel: 'ai_tongyi', medium: 'geo_ai', referrer: document.referrer };
  if (ref.includes('kimi.moonshot.cn') || ref.includes('kimi.ai')) return { channel: 'ai_kimi', medium: 'geo_ai', referrer: document.referrer };
  if (ref.includes('chatgpt.com') || ref.includes('openai.com')) return { channel: 'ai_chatgpt', medium: 'geo_ai', referrer: document.referrer };

  // 3. 传统搜索引擎与主流社区
  if (ref.includes('baidu.com')) return { channel: 'search_baidu', medium: 'organic_seo', referrer: document.referrer };
  if (ref.includes('google.com')) return { channel: 'search_google', medium: 'organic_seo', referrer: document.referrer };
  if (ref.includes('bing.com')) return { channel: 'search_bing', medium: 'organic_seo', referrer: document.referrer };
  if (ref.includes('xiaohongshu.com') || ref.includes('xhslink.com')) return { channel: 'social_xhs', medium: 'social', referrer: document.referrer };
  if (ref.includes('zhihu.com')) return { channel: 'community_zhihu', medium: 'social', referrer: document.referrer };
  if (ref.includes('xianyu') || ref.includes('2.taobao.com')) return { channel: 'market_xianyu', medium: 'direct_sale', referrer: document.referrer };
  if (ref.includes('weixin') || ref.includes('qq.com')) return { channel: 'social_wechat', medium: 'social', referrer: document.referrer };

  return {
    channel: ref ? 'referral_web' : 'direct',
    medium: ref ? 'referral' : 'none',
    referrer: document.referrer
  };
}

function getOrSaveFirstTouchSource(): { channel: string; medium: string; keyword?: string; referrer?: string } {
  if (typeof window === 'undefined') return { channel: 'direct', medium: 'none' };
  try {
    const cached = sessionStorage.getItem('cs313_first_touch');
    if (cached) return JSON.parse(cached);
    const current = detectInboundSource();
    sessionStorage.setItem('cs313_first_touch', JSON.stringify(current));
    return current;
  } catch {
    return detectInboundSource();
  }
}

  /**
   * 商业运营与全链路漏斗埋点 (支持 page_view | feature_engage | paywall_hit | vip_intent | key_activate)
   */
  async trackEvent(
    type: 'page_view' | 'vip_intent' | 'feature_engage' | 'paywall_hit' | 'key_activate' | string,
    meta?: Record<string, any>
  ): Promise<void> {
    try {
      const source = getOrSaveFirstTouchSource();
      const combinedMeta = {
        channel: source.channel,
        medium: source.medium,
        ...(source.keyword ? { keyword: source.keyword } : {}),
        ...meta
      };

      // 1. 同步上报至 Vercel 官方 Web Analytics
      if (typeof window !== 'undefined' && (window as any).va) {
        try {
          (window as any).va('event', { name: type, ...combinedMeta });
        } catch {}
      }

      let visitorId = localStorage.getItem('cs313_anon_vid');
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('cs313_anon_vid', visitorId);
      }
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|PlayBook|Silk/i.test(navigator.userAgent);
      const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

      await fetch(`${API_BASE_URL}/admin/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          visitorId,
          deviceType,
          ...combinedMeta
        }),
        keepalive: true
      });
    } catch {
      // 埋点静默失败，不打扰用户
    }
  }
}

export const api = new ApiService();
