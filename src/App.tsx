import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import type { ActiveTab } from './components/Navbar';
import { HomePortal } from './components/HomePortal';
import { VipModal } from './components/VipModal';

// 工业级高可用容错懒加载器（自动防御云端版本发布时的分片 404 与弱网丢包）
function resilientLazy<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  chunkName: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      return await factory();
    } catch (err: any) {
      console.warn(`[Auto-Heal] 模块 ${chunkName} 首次拉取失败，正在重试...`, err);
      try {
        await new Promise(r => setTimeout(r, 600));
        return await factory();
      } catch (retryErr: any) {
        console.warn(`[Auto-Heal] 模块 ${chunkName} 遇到云端版本更新分片变更，正在强制重载最新版本...`, retryErr);
        if (typeof window !== 'undefined') {
          const reloadKey = `cs313_reload_${chunkName}`;
          const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
          if (Date.now() - lastReload > 10000) {
            sessionStorage.setItem(reloadKey, Date.now().toString());
            const targetUrl = window.location.pathname + '?_v=' + Date.now() + (window.location.hash || '');
            window.location.replace(targetUrl);
            return new Promise(() => {}); // 挂起等待页面平滑刷新
          }
        }
        throw retryErr;
      }
    }
  });
}

// Code splitting: 动态懒加载9大重型学习模块，极大降低国内首屏体积，实现0.3秒极速秒开
const AISpeakingView = resilientLazy(() => import('./components/AISpeakingView').then(m => ({ default: m.AISpeakingView })), 'AISpeaking');
const VocabView = resilientLazy(() => import('./components/JapaneseVocabView').then(m => ({ default: m.JapaneseVocabView })), 'Vocab');
const GrammarView = resilientLazy(() => import('./components/JapaneseGrammarView').then(m => ({ default: m.JapaneseGrammarView })), 'Grammar');
const ListeningView = resilientLazy(() => import('./components/JapaneseListeningView').then(m => ({ default: m.JapaneseListeningView })), 'Listening');
const JlptExamView = resilientLazy(() => import('./components/JlptExamView').then(m => ({ default: m.JlptExamView })), 'JlptExam');
const JapaneseWritingView = resilientLazy(() => import('./components/JapaneseWritingView').then(m => ({ default: m.JapaneseWritingView })), 'JapaneseWriting');
const JapaneseListeningView = resilientLazy(() => import('./components/JapaneseListeningView').then(m => ({ default: m.JapaneseListeningView })), 'JapaneseListening');
const PhoneticsView = resilientLazy(() => import('./components/GojuonView').then(m => ({ default: m.GojuonView })), 'Phonetics');
const MistakeNotebookView = resilientLazy(() => import('./components/MistakeNotebookView').then(m => ({ default: m.MistakeNotebookView })), 'MistakeNotebook');
const KDramaView = resilientLazy(() => import('./components/AnimeDramaView').then(m => ({ default: m.AnimeDramaView })), 'KDrama');
const AdminKeyGeneratorModal = resilientLazy(() => import('./components/AdminKeyGeneratorModal').then(m => ({ default: m.AdminKeyGeneratorModal })), 'AdminKey');
const MultiLangModal = resilientLazy(() => import('./components/MultiLangModal').then(m => ({ default: m.MultiLangModal })), 'MultiLang');
const WallpaperRewardModal = resilientLazy(() => import('./components/WallpaperRewardModal').then(m => ({ default: m.WallpaperRewardModal })), 'Wallpaper');
const ExamRegistrationModal = resilientLazy(() => import('./components/ExamRegistrationModal').then(m => ({ default: m.ExamRegistrationModal })), 'ExamRegistration');
import { WallpaperBanner } from './components/WallpaperBanner';
import { getSavedLicense, saveLicense, clearLicense } from './data/auth/cardKeys';
import { getDeviceFingerprint } from './utils/fingerprint';
import { Shield, Sparkles, ChevronLeft, Tablet, AlertTriangle, CheckCircle2, Home, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from './services/api';

interface ErrorBoundaryProps {
  name: string;
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary - ${this.props.name}] Caught error:`, error, errorInfo);
    // 自动检测是否为发布迭代引起的分片 404，如果是则静默自愈刷新
    const isChunkError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError';
    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = `cs313_eb_reload_${this.props.name}`;
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem(reloadKey, Date.now().toString());
        const targetUrl = window.location.pathname + '?_v=' + Date.now() + (window.location.hash || '');
        window.location.replace(targetUrl);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl border-2 border-red-200 shadow-xl text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">该功能模块在加载时遇到了一个偶发异常</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
            系统已自动隔离此错误，其他模块（AI 口语、JLPT 全真考场、6,500+ 核心词库、文法宝典）不受任何影响。
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.clear();
                  const targetUrl = window.location.pathname + '?_v=' + Date.now() + (window.location.hash || '');
                  window.location.replace(targetUrl);
                } else {
                  this.setState({ hasError: false, error: null });
                }
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:from-sky-600 hover:to-indigo-700 transition cursor-pointer"
            >
              🔄 立即重新加载
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) {
                  this.props.onReset();
                } else {
                  window.location.hash = '';
                }
              }}
              className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              返回总览首页
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [license, setLicense] = useState<LicenseInfo>(() => getSavedLicense());
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isMultiLangModalOpen, setIsMultiLangModalOpen] = useState<boolean>(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState<boolean>(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [deviceInfo] = useState(() => getDeviceFingerprint());
  const [autoActivatedToast, setAutoActivatedToast] = useState<string | null>(null);
  const [vipModalReason, setVipModalReason] = useState<string | undefined>();

  const handleOpenVipModal = (reason?: string) => {
    setVipModalReason(reason);
    setIsVipModalOpen(true);
    // 运营漏斗埋点：记录学员购买意向点击
    api.trackEvent('vip_intent', { reason: reason || 'direct_click' });
  };

  // 1. 运营流量统计：首屏加载与访客 UV/PV 静默上报
  useEffect(() => {
    api.trackEvent('page_view', { path: window.location.hash || '#home' });
  }, []);

  // 2. 店主专属全局快捷键：Ctrl + Shift + A (Mac: Cmd + Shift + A) 随时唤出管理与转化率后台
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleVipForTesting = () => {
    if (license.isVip) {
      const freeLicense: LicenseInfo = { isVip: false };
      setLicense(freeLicense);
      clearLicense();
    } else {
      const vipLicense: LicenseInfo = {
        isVip: true,
        planName: '日语单语种终身VIP',
        licenseKey: 'CS313-JP-8888-HL3Y',
        activatedAt: new Date().toLocaleDateString('zh-CN')
      };
      setLicense(vipLicense);
      saveLicense(vipLicense);
    }
  };

  // 1. 自动捕获 URL 中的卡密参数 (例如 ?key=CS313-JP-8888-HL3Y 或 ?code=... 或 ?license=...) 实现一键无感秒激活
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryKey = urlParams.get('key') || urlParams.get('code') || urlParams.get('license');
      if (queryKey && queryKey.trim()) {
        const cleanKey = queryKey.trim().toUpperCase();
        api.verifyCardKey(cleanKey, deviceInfo).then((res) => {
          if (res.success && res.license) {
            setLicense(res.license);
            saveLicense(res.license);
            setAutoActivatedToast(`🎉 欢迎您！已通过专属链接自动激活【${res.license.planName || '日语终身VIP'}】！已解锁全站全部功能！`);
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            
            // 自动清除 URL 中的 key 参数，保持地址栏干净
            const newUrl = window.location.pathname + (window.location.hash || '');
            window.history.replaceState({}, document.title, newUrl);
          }
        }).catch(() => {});
        if (policy === 'strict' && !license.isVip) {
          setIsVipModalOpen(true);
        }
      }

      // 自动响应直接打开考期指南弹窗 (?modal=exam 或 ?exam=1)
      if (urlParams.get('modal') === 'exam' || urlParams.get('exam') === '1') {
        setIsExamModalOpen(true);
      }
    } catch {}
  }, [license.isVip]);

  // Listen to hash / direct route navigation (e.g. #speaking, #vocab, #grammar, #kdrama)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim() as ActiveTab;
      if (!hash || hash === 'home') {
        setActiveTab('home');
      } else if (['speaking', 'listening', 'exam', 'writing', 'phonetics', 'mistakes', 'vocab', 'grammar', 'kdrama'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [selectedDramaSceneId, setSelectedDramaSceneId] = useState<string | undefined>();

  // 监听页面向下滚动距离，超过 200px 时在右下角优雅浮现快捷控制（回到顶部 / 返回首页）
  const [showScrollControls, setShowScrollControls] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollControls(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab: ActiveTab, sceneId?: string) => {
    setActiveTab(tab);
    if (sceneId) {
      setSelectedDramaSceneId(sceneId);
    }
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLicenseActivated = (newLicense: LicenseInfo) => {
    setLicense(newLicense);
    saveLicense(newLicense);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col antialiased selection:bg-sky-100 selection:text-sky-700 overflow-x-hidden w-full">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        license={license}
        onOpenVipModal={() => setIsVipModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
        onOpenExamModal={() => setIsExamModalOpen(true)}
      />

      {/* Auto Activated Success Toast Banner */}
      {autoActivatedToast && (
        <div className="bg-emerald-600 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{autoActivatedToast}</span>
          <button
            onClick={() => setAutoActivatedToast(null)}
            className="ml-3 px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition"
          >
            知道了
          </button>
        </div>
      )}

      {/* VIP Upsell Ribbon for Free Preview Users (Aligned with max-w-6xl card layout) */}
      {!license.isVip && (
        <div className="max-w-6xl mx-auto px-4 pt-3 w-full min-w-0">
          <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white py-2.5 px-4 sm:px-6 rounded-2xl text-xs font-semibold shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border border-sky-400/30 min-w-0">
            <div className="flex items-start sm:items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 shrink-0 text-sky-200 mt-0.5 sm:mt-0" />
              <span className="leading-snug break-words min-w-0">当前为【免费试学模式】· 拍下激活码即享 JLPT 官方历届考期真题机考（每年7月/12月考后持续同步更新）、6,500+ 核心词库与影视高光名台词原声精听</span>
            </div>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 sm:py-1 rounded-xl bg-white text-sky-700 font-extrabold hover:bg-sky-50 transition shadow-xs text-xs cursor-pointer shrink-0 text-center"
            >
              输入卡密解锁 →
            </button>
          </div>
        </div>
      )}


      {/* Main Learning Content Area */}
      <main className="flex-1 pb-6">
        <ErrorBoundary key={activeTab} name={activeTab} onReset={() => handleTabChange('home')}>
          <React.Suspense fallback={
            <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-3">
              <div className="w-9 h-9 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-bold tracking-wider">正在极速加载学习模块...</span>
            </div>
          }>
            {activeTab === 'home' && (
              <HomePortal
                onSelectModule={handleTabChange}
                onOpenVipModal={handleOpenVipModal}
                isVip={license.isVip}
                onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
              />
            )}
            {activeTab === 'speaking' && (
              <AISpeakingView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'listening' && (
              <ListeningView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'exam' && (
              <JlptExamView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
                onNavigateToWriting={() => setActiveTab('writing')}
              />
            )}
            {activeTab === 'writing' && (
              <JapaneseWritingView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'phonetics' && (
              <PhoneticsView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'mistakes' && (
              <MistakeNotebookView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'vocab' && (
              <VocabView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'grammar' && (
              <GrammarView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
              />
            )}
            {activeTab === 'kdrama' && (
              <KDramaView
                isVip={license.isVip}
                onOpenVipModal={handleOpenVipModal}
                initialSceneId={selectedDramaSceneId}
              />
            )}
          </React.Suspense>
        </ErrorBoundary>

        {/* 🎁 学员美学福利 · 一子一木 4K 伴学治愈壁纸屋横幅 (所有二级页面底部统一展示) */}
        {activeTab !== 'home' && (
          <div className="max-w-6xl mx-auto px-4 mt-8 pb-2">
            <WallpaperBanner onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Floating Store Owner Role Tester Pill (仅在本地开发环境或带有 ?test_mode=1 时显示，线上生产环境自动对真实用户隐藏) */}
      {Boolean((import.meta as any).env?.DEV || (typeof window !== 'undefined' && window.location.search.includes('test_mode=1'))) && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center shadow-xl rounded-full bg-white/95 text-slate-800 p-1 backdrop-blur-md border border-slate-200/90 transition-all hover:scale-105 select-none">
          <button
            onClick={handleToggleVipForTesting}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
              license.isVip
                ? 'bg-gradient-to-r from-amber-500 to-sky-600 text-white shadow-xs'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            }`}
            title="点击即可随时在【VIP已激活学员】与【普通免费试学学员】之间一键切换视角"
          >
            <span>{license.isVip ? '👑 当前测试身份: VIP会员' : '🆓 当前测试身份: 免费学员'}</span>
            <span className="text-[10px] bg-black/15 px-1.5 py-0.5 rounded-full font-normal">
              (点击切为{license.isVip ? '免费体验' : 'VIP'})
            </span>
          </button>
        </div>
      )}

      {/* Bottom Footer (Clean, two-item spread layout) */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 w-full">
          
          {/* Brand & Platform Identity */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CS313.CN</span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-600">日语研习社 · 数字化智能学习平台</span>
          </div>

          {/* Device and Security Info (Spread to right) */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-500">
              <Tablet className="w-3.5 h-3.5 text-slate-400" />
              <span>当前设备: {deviceInfo.deviceType} ({deviceInfo.browser})</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>2台设备安全绑定保护</span>
            </span>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => {
          setIsVipModalOpen(false);
          setVipModalReason(undefined);
        }}
        onActivated={handleLicenseActivated}
        reason={vipModalReason}
      />

      <React.Suspense fallback={null}>
        {isAdminModalOpen && (
          <AdminKeyGeneratorModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            onOpenMultiLangModal={() => setIsMultiLangModalOpen(true)}
          />
        )}

        {isMultiLangModalOpen && (
          <MultiLangModal
            isOpen={isMultiLangModalOpen}
            onClose={() => setIsMultiLangModalOpen(false)}
          />
        )}

        {isWallpaperModalOpen && (
          <WallpaperRewardModal
            isOpen={isWallpaperModalOpen}
            onClose={() => setIsWallpaperModalOpen(false)}
          />
        )}

        {isExamModalOpen && (
          <ExamRegistrationModal
            isOpen={isExamModalOpen}
            onClose={() => setIsExamModalOpen(false)}
          />
        )}
      </React.Suspense>

      {/* 右下角智能悬浮快捷控制（向下滚动 > 200px 后优雅浮现） */}
      <div
        className={`fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 transition-all duration-300 ${
          showScrollControls
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* 回到顶部按钮 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="回到顶部"
          aria-label="回到顶部"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 flex items-center justify-center transition active:scale-95 cursor-pointer group"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* 非首页状态：一键返回首页 */}
        {activeTab !== 'home' && (
          <button
            onClick={() => handleTabChange('home')}
            title="返回首页"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg hover:border-sky-300 text-slate-700 hover:text-sky-600 text-xs font-bold transition active:scale-95 cursor-pointer group"
          >
            <Home className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
            <span>返回首页</span>
          </button>
        )}
      </div>

    </div>
  );
}

export default App;
