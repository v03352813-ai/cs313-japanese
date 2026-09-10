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

  /**
   * 店主后台：一键批量生成卡密
   */
  async adminGenerateKeys(count: number = 10, tier: string = 'kr_lifetime', batchNo: string = '2026-BATCH', price: number = 49.9): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/generate-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, tier, batchNo, price })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || '网络连接失败' };
    }
  }

  /**
   * 店主后台：获取实时统计大盘
   */
  async adminGetStats(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`);
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * 商业运营埋点：静默上报访客访问 (PV/UV) 与 VIP 购买意向点击
   */
  async trackEvent(type: 'page_view' | 'vip_intent', meta?: Record<string, any>): Promise<void> {
    try {
      // 1. 同步上报至 Vercel 官方 Web Analytics (与七宗罪保持一致，支持控制台查看实时访客与自定义事件)
      if (typeof window !== 'undefined' && (window as any).va) {
        try {
          (window as any).va('event', { name: type, ...meta });
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
          ...meta
        })
      });
    } catch {
      // 埋点静默失败，不打扰用户
    }
  }
}

export const api = new ApiService();
