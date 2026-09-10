import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid,
  Headphones, 
  FileCheck2, 
  Layers, 
  BookOpenCheck, 
  KeyRound, 
  Settings2,
  Crown,
  Mic,
  PenTool,
  Sparkles,
  BookMarked,
  Calendar
} from 'lucide-react';
import type { LicenseInfo } from '../data/auth/cardKeys';
import { checkAdminSession } from '../data/auth/cardKeys';
import { getJlptExamCountdown } from '../utils/examCountdown';

export type ActiveTab = 'home' | 'speaking' | 'exam' | 'writing' | 'phonetics' | 'mistakes' | 'kdrama' | 'vocab' | 'grammar' | 'listening';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  license: LicenseInfo;
  onOpenVipModal: () => void;
  onOpenAdminModal: () => void;
  onOpenWallpaperModal?: () => void;
  onOpenExamModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  license,
  onOpenVipModal,
  onOpenAdminModal,
  onOpenWallpaperModal,
  onOpenExamModal
}) => {
  const examCountdown = getJlptExamCountdown();

  // 首页 + 8 大核心模块根据学员学习进阶 1-8 顺序排列
  const navItems = [
    { id: 'home' as ActiveTab, label: '首页', shortLabel: '首页', icon: LayoutGrid },
    { id: 'phonetics' as ActiveTab, label: '五十音图', shortLabel: '五十音', icon: Sparkles },
    { id: 'vocab' as ActiveTab, label: 'JLPT词库', shortLabel: '词库', icon: Layers },
    { id: 'mistakes' as ActiveTab, label: '错题本', shortLabel: '错题', icon: BookMarked },
    { id: 'grammar' as ActiveTab, label: '文法宝典', shortLabel: '文法', icon: BookOpenCheck },
    { id: 'kdrama' as ActiveTab, label: '原声精听', shortLabel: '精听', icon: Headphones },
    { id: 'speaking' as ActiveTab, label: 'AI口语', shortLabel: '口语', icon: Mic, isHero: true },
    { id: 'writing' as ActiveTab, label: 'AI写作', shortLabel: '写作', icon: PenTool },
    { id: 'exam' as ActiveTab, label: 'JLPT真题', shortLabel: '真题', icon: FileCheck2 },
  ];

  // 管理员视图控制（默认学员完全隐藏，管理员可通过专属暗号唤醒）
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return checkAdminSession() || urlParams.get('admin') === 'true' || window.location.hash.includes('admin');
  });

  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const logoClickTimerRef = useRef<any>(null);

  // 专属管理员快捷键：Ctrl+Shift+A 或 Alt+A 随时唤起店主后台
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || 
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        setIsAdmin(true);
        onOpenAdminModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdminModal]);

  // 点击 Logo 5 次彩蛋唤起管理员模式
  const handleLogoClick = () => {
    setActiveTab('home');
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdmin(true);
        onOpenAdminModal();
        return 0;
      }
      return next;
    });

    if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
    logoClickTimerRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2000);
  };

  // 首页专属：按照 1 -> 2 -> 3 层次，将 1（主标语与平台定位）与 2（全功能平铺导航）融为一体化主展台（上下紧凑精致）
  if (activeTab === 'home') {
    return (
      <header className="w-full pt-2.5 sm:pt-3 transition-all">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3 sm:space-y-3.5 overflow-hidden">
            
            {/* 1. 顶部品牌与核心主标语 (紧凑排布) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-w-0">
              <div className="space-y-1 min-w-0">
                {/* 顶部品牌与徽章区域 (自适应响应式：手机端到大屏全平铺展开) */}
                <div className="flex flex-row items-center gap-1.5 sm:gap-2 flex-wrap">
                  {/* Brand Logo & Name */}
                  <div 
                    onClick={handleLogoClick}
                    className="flex items-center gap-1.5 cursor-pointer select-none group mr-1 shrink-0"
                    title="日语研习社 (点击刷新首页 / 连击5次开启管理员)"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-xs font-black text-xs tracking-tight group-hover:scale-105 transition shrink-0">
                      JP
                    </div>
                    <span className="font-black text-sm tracking-tight text-slate-900">
                      日语研习社
                    </span>
                  </div>

                  {/* 平台定位与功能更新徽章 */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <span className="hidden xs:inline-block px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 text-[10.5px] sm:text-[11px] font-bold whitespace-nowrap">
                      JP-Study Pop · 自研平台
                    </span>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 text-[10.5px] sm:text-[11px] font-bold items-center gap-1 whitespace-nowrap">
                      <Sparkles className="w-2.5 h-2.5 text-sky-600" /> 🎙️ AI 口语已上线
                    </span>

                    {/* 框位 2：动态考期倒计时模块 */}
                    <button
                      onClick={onOpenExamModal}
                      className={`px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-black flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition shadow-2xs active:scale-95 group ${examCountdown.badgeClass}`}
                      title="点击查看 JLPT 官方考期全景与避坑指南"
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                      </span>
                      <span>{examCountdown.badgeText}</span>
                      <span className="text-[9px] sm:text-[9.5px] opacity-75 group-hover:opacity-100 font-bold">指南&gt;</span>
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                  日语备考与追番，从未如此简单
                </h1>

                <p className="text-xs text-slate-500 font-medium leading-snug">
                  AI 口语考级陪练 + JLPT 官方全真机考 + 6,500+ 高频考纲词库 + 420+ 核心文法宝典 + 动漫日剧原声精听
                </p>
              </div>

              {/* 快速直达统计徽章与管理员栏 (自适应：手机端 5 等分并排，平板/电脑端横向流式) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-full lg:w-auto min-w-0">
                <div className="mobile-grid-5 sm:flex sm:items-center gap-1 sm:gap-2 w-full sm:w-auto min-w-0">
                  <button 
                    onClick={() => setActiveTab('speaking')}
                    className="min-w-0 w-full sm:w-auto overflow-hidden flex flex-col items-center justify-center px-1 sm:px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-center cursor-pointer transition shadow-xs shadow-sky-500/20 active:scale-98"
                  >
                    <span className="hidden sm:block text-sm font-black text-white whitespace-nowrap">🎙️ AI口语</span>
                    <span className="block sm:hidden text-[10px] font-black text-white truncate w-full">🎙️ 口语</span>
                    <span className="hidden sm:block text-[9px] text-sky-100 font-medium whitespace-nowrap">麦克风对练</span>
                    <span className="block sm:hidden text-[8px] text-sky-100 font-medium truncate w-full">对练</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('exam')}
                    className="min-w-0 w-full sm:w-auto overflow-hidden flex flex-col items-center justify-center px-1 sm:px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center cursor-pointer hover:bg-slate-100 transition active:scale-98"
                  >
                    <span className="hidden sm:block text-sm font-black text-slate-900 whitespace-nowrap">56+套</span>
                    <span className="block sm:hidden text-[10px] font-black text-slate-900 truncate w-full">56+套</span>
                    <span className="hidden sm:block text-[9px] text-slate-500 font-medium whitespace-nowrap">历届真题</span>
                    <span className="block sm:hidden text-[8px] text-slate-500 font-medium truncate w-full">真题</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('vocab')}
                    className="min-w-0 w-full sm:w-auto overflow-hidden flex flex-col items-center justify-center px-1 sm:px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center cursor-pointer hover:bg-slate-100 transition active:scale-98"
                  >
                    <span className="hidden sm:block text-sm font-black text-slate-900 whitespace-nowrap">6500+</span>
                    <span className="block sm:hidden text-[10px] font-black text-slate-900 truncate w-full">6500+</span>
                    <span className="hidden sm:block text-[9px] text-slate-500 font-medium whitespace-nowrap">分级词库</span>
                    <span className="block sm:hidden text-[8px] text-slate-500 font-medium truncate w-full">词库</span>
                  </button>
                  {/* 框位 1：官方考期 (全景色 - 与全局天蓝色调统一) */}
                  <button 
                    onClick={onOpenExamModal}
                    className="min-w-0 w-full sm:w-auto overflow-hidden flex flex-col items-center justify-center px-1 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white text-center cursor-pointer transition shadow-xs shadow-sky-500/20 active:scale-98 group"
                    title="2026 JLPT 官方考期全景与避坑指南"
                  >
                    <span className="hidden sm:block text-sm font-black text-white whitespace-nowrap">📅 官方考期</span>
                    <span className="block sm:hidden text-[10px] font-black text-white truncate w-full">📅 考期</span>
                    <span className="hidden sm:block text-[9px] text-sky-100 font-medium whitespace-nowrap">{examCountdown.buttonSubText}</span>
                    <span className="block sm:hidden text-[8px] text-sky-100 font-medium truncate w-full">{examCountdown.days}天</span>
                  </button>
                  <button 
                    onClick={onOpenWallpaperModal}
                    className="min-w-0 w-full sm:w-auto overflow-hidden flex flex-col items-center justify-center px-1 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-center cursor-pointer transition active:scale-98 shadow-2xs"
                    title="免费领取 iPad/手机 4K 伴学壁纸"
                  >
                    <span className="hidden sm:block text-sm font-black text-amber-900 whitespace-nowrap">🎁 免费壁纸</span>
                    <span className="block sm:hidden text-[10px] font-black text-amber-900 truncate w-full">🎁 壁纸</span>
                    <span className="hidden sm:block text-[9px] text-amber-700 font-bold whitespace-nowrap">4K 伴学锁屏</span>
                    <span className="block sm:hidden text-[8px] text-amber-700 font-bold truncate w-full">伴学</span>
                  </button>
                </div>

                {/* Admin Status / Trigger */}
                {isAdmin && (
                  <div className="flex items-center justify-end gap-1.5 pt-1 sm:pt-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-slate-200">
                    <button
                      onClick={onOpenAdminModal}
                      className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/80 shrink-0 cursor-pointer flex items-center gap-1 text-xs font-bold"
                      title="店主管理后台"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-sky-500" />
                      <span className="hidden xl:inline text-slate-700 font-bold">后台</span>
                    </button>

                    {license.isVip ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-bold shadow-xs shadow-sky-500/20 shrink-0 whitespace-nowrap">
                        <Crown className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{license.planName || 'VIP 终身卡'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={onOpenVipModal}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold shadow-xs shadow-sky-500/20 active:scale-98 transition shrink-0 whitespace-nowrap cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">激活</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsAdmin(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                      title="关闭管理员控制栏"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. 紧随其后的 9 大核心功能平铺导航条 (保留经典的灰底胶囊轨道与纯白高亮，紧凑无缝) */}
            <div className="pt-0.5">
              <nav className="hidden md:grid grid-cols-9 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-xs lg:text-[13px] font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
                        isActive
                          ? 'bg-white text-sky-600 shadow-2xs shadow-slate-200/90 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 hidden lg:inline ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile All-in-One 2-Row Visible Navigation Bar (All 9 items fully visible without scrolling) */}
              <div className="md:hidden space-y-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 shadow-2xs min-w-0">
                {/* Top Row: 5 Core Items */}
                <div className="grid grid-cols-5 gap-1 min-w-0">
                  {navItems.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`min-w-0 w-full flex items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-xl text-[10.5px] font-bold transition whitespace-nowrap cursor-pointer select-none ${
                          isActive
                            ? 'bg-white text-sky-600 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span className="truncate">{item.shortLabel || item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Row: 4 Advanced Items */}
                <div className="grid grid-cols-4 gap-1 min-w-0">
                  {navItems.slice(5).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`min-w-0 w-full flex items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-xl text-[10.5px] font-bold transition whitespace-nowrap cursor-pointer select-none ${
                          isActive
                            ? 'bg-white text-sky-600 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span className="truncate">{item.shortLabel || item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>
    );
  }

  // 获取当前正在浏览的模块信息
  const currentActiveItem = navItems.find(i => i.id === activeTab);

  // 二级功能页面：采用上下分层舒展设计（上层：品牌+操作，下层：电脑端全宽独立展开 9 大模块导航条，手机端保持 2 行平铺）
  return (
    <header className="sticky top-0 z-40 w-full pt-2.5 sm:pt-3 transition-all">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs px-3 sm:px-5 py-2.5 sm:py-3 w-full space-y-2.5 sm:space-y-3">
          
          {/* 上层：品牌标识、当前位置定位与右侧 VIP / 壁纸区 */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Left Brand Area (Prominent & Clear) */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer select-none shrink-0 group"
              title="日语研习社 (点击返回首页)"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 font-black text-base sm:text-lg tracking-tight group-hover:scale-105 transition shrink-0">
                JP
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900">
                  日语研习社
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-600 border border-sky-200/80 hidden sm:inline">
                  JLPT
                </span>
                {currentActiveItem && currentActiveItem.id !== 'home' && (
                  <div className="hidden lg:flex items-center gap-1.5 pl-2.5 ml-2 border-l border-slate-200">
                    <span className="text-xs text-slate-400 font-medium">当前模块:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-600 font-bold text-xs border border-sky-200/60">
                      {currentActiveItem.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Area: 福利与VIP/管理区 */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
              <button
                onClick={onOpenExamModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-2xs"
                title="查看 JLPT 官方考期全景与避坑指南"
              >
                <span>📅</span>
                <span className="hidden sm:inline">官方考期</span>
                <span className="text-[10px] bg-white/20 px-1 rounded-full">{examCountdown.badgeText}</span>
              </button>

              <button
                onClick={onOpenWallpaperModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-bold transition shrink-0 cursor-pointer shadow-2xs"
                title="免费领取 4K 伴学壁纸"
              >
                <span>🎁</span>
                <span className="hidden sm:inline">免费壁纸</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={onOpenAdminModal}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/80 shrink-0 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="店主管理后台（卡密生成与多语种管理）"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-sky-500" />
                    <span className="hidden sm:inline text-slate-700 font-bold">管理后台</span>
                  </button>

                  <button
                    onClick={() => setIsAdmin(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    title="关闭管理员控制栏（切回纯净学员视图）"
                  >
                    ✕
                  </button>
                </>
              )}

              {/* VIP Status or Activation Button */}
              {license.isVip ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-bold shadow-xs shadow-sky-500/20 shrink-0 whitespace-nowrap">
                  <Crown className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{license.planName || 'VIP 终身卡'}</span>
                </div>
              ) : (
                <button
                  onClick={onOpenVipModal}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold shadow-xs shadow-sky-500/20 active:scale-98 transition shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">卡密激活</span>
                </button>
              )}
            </div>

          </div>

          {/* 下层：电脑端独立全宽 9 大核心功能导航轨 (彻底舒展展开，无挤压碰撞) */}
          <nav className="hidden md:grid grid-cols-9 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs lg:text-[13px] font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
                    isActive
                      ? 'bg-white text-sky-600 shadow-2xs shadow-slate-200/90 font-black ring-1 ring-sky-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 手机端：保持原先优秀的 2 行平铺紧凑导航栏 */}
          <div className="md:hidden space-y-1 border-t border-slate-100 pt-2 min-w-0">
            {/* Top Row: 5 Core Items */}
            <div className="grid grid-cols-5 gap-1 min-w-0">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`min-w-0 w-full flex items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-lg transition whitespace-nowrap text-[10.5px] font-bold cursor-pointer select-none ${
                      isActive
                        ? 'text-sky-600 font-black bg-sky-50 border border-sky-200/70 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                    <span className="truncate">{item.shortLabel || item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Row: 4 Advanced Items */}
            <div className="grid grid-cols-4 gap-1 min-w-0">
              {navItems.slice(5).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`min-w-0 w-full flex items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-lg transition whitespace-nowrap text-[10.5px] font-bold cursor-pointer select-none ${
                      isActive
                        ? 'text-sky-600 font-black bg-sky-50 border border-sky-200/70 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                    <span className="truncate">{item.shortLabel || item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};