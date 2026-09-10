import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  FileCheck2, 
  Layers, 
  BookOpenCheck, 
  ArrowUpRight, 
  Sparkles,
  BookOpen, 
  Volume2, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Bell, 
  RefreshCw, 
  Play, 
  Lock, 
  Compass, 
  Mic, 
  PenTool, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ActiveTab } from './Navbar';
import { 
  DAILY_QUOTES_POOL, 
  CONTENT_UPDATE_LOGS, 
  getStudyStreak, 
  checkInToday, 
  DailyQuote 
} from '../data/cloudSync';
import { ANIME_DRAMA_SCENES } from '../data/japanese/animeDrama';
import { speakJapanese } from '../utils/speech';
import { DramaThumbnail } from './DramaThumbnail';
import { WallpaperBanner } from './WallpaperBanner';

export type TrackId = 'exam' | 'beginner' | 'speaking';

interface TrackStep {
  stepNum: string;
  stepLabel: string;
  title: string;
  targetBadge: string;
  badgeBg: string;
  desc: string;
  actionText: string;
  targetTab: ActiveTab;
  sceneId?: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonBg: string;
}

interface TrackConfig {
  id: TrackId;
  name: string;
  targetAudience: string;
  tag: string;
  icon: string;
  activeBorder: string;
  activeBg: string;
  activeRing: string;
  desc: string;
  steps: TrackStep[];
}

const TRACKS_CONFIG: Record<TrackId, TrackConfig> = {
  exam: {
    id: 'exam',
    name: 'JLPT 考级提分冲刺',
    targetAudience: '冲刺 N5~N1 · 180分高分上岸',
    tag: '备考必选',
    icon: '🎯',
    activeBorder: 'border-sky-500',
    activeBg: 'bg-sky-50/70 border-sky-400 text-sky-950',
    activeRing: 'ring-2 ring-sky-500/20 shadow-md',
    desc: '专为 JLPT N5~N1 考生打造的高分闭环：全真机考模考 ➔ 错题遗忘曲线复盘 ➔ 听解真题课题理解逐句精练！',
    steps: [
      {
        stepNum: '01',
        stepLabel: '第 1 步 · 模考查漏',
        title: 'JLPT 历届全真机考模考',
        targetBadge: '摸清 180 分水位',
        badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200/70',
        desc: '分屏沉浸答题、言语知识与读解原卷、即时判分，精准测出真实水平与各大题型薄弱项。',
        actionText: '进入 JLPT 全真考场',
        targetTab: 'exam',
        icon: FileCheck2,
        buttonBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
      },
      {
        stepNum: '02',
        stepLabel: '第 2 步 · 靶向消错',
        title: '艾宾浩斯智能错题消灭',
        targetBadge: '遗忘曲线重练',
        badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200/70',
        desc: '真题做错的题目自动归集，遵循 1-3-7-15 天周期排期推送重练，靶向消除假名、语法与词汇盲区。',
        actionText: '消灭待复习错题',
        targetTab: 'mistakes',
        icon: BookOpen,
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
      },
      {
        stepNum: '03',
        stepLabel: '第 3 步 · 听解精听',
        title: 'JLPT 听解精听工坊',
        targetBadge: '课题/要点/即时应答',
        badgeBg: 'bg-teal-100 text-teal-800 border border-teal-200/70',
        desc: '攻克听解失分点！课题理解、概要理解与即时应答专项逐句精听，支持 0.8x~1.2x 调速与挖空填空。',
        actionText: '开启听解精听训练',
        targetTab: 'writing',
        icon: PenTool,
        buttonBg: 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
      }
    ]
  },
  beginner: {
    id: 'beginner',
    name: '零基础入门 / 五十音筑基',
    targetAudience: '从假名到中高阶 · 轻松自学',
    tag: '系统筑基',
    icon: '🌸',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-50/70 border-emerald-400 text-emerald-950',
    activeRing: 'ring-2 ring-emerald-500/20 shadow-md',
    desc: '初学者零压力入门：掌握 46 清音与浊音/拗音象形口诀 ➔ 刷透 6,500+ JLPT 核心词 ➔ 搞懂 420+ 体系文法与动词活用！',
    steps: [
      {
        stepNum: '01',
        stepLabel: '第 1 步 · 夯实假名',
        title: '五十音图发音与象形口诀',
        targetBadge: '攻克清音·浊音·拗音',
        badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/70',
        desc: '平假名片假名对照、汉字字源演变解析、趣味象形联想口诀与标准东京腔原生 TTS 发音。',
        actionText: '进入五十音发音工坊',
        targetTab: 'phonetics',
        icon: Sparkles,
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
      },
      {
        stepNum: '02',
        stepLabel: '第 2 步 · 积累词汇',
        title: '6,500+ JLPT 分级核心词卡',
        targetBadge: '音调核标注 · 遮挡默写',
        badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200/70',
        desc: 'N5~N1 分级核心词库，全配备 ①②③ 高低音调核标号、汉字假名注音、iPad 手写遮挡与原声朗读。',
        actionText: '背诵核心分级词汇',
        targetTab: 'vocab',
        icon: Layers,
        buttonBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
      },
      {
        stepNum: '03',
        stepLabel: '第 3 步 · 攻克文法',
        title: '420+ 文法宝典与动词 10 大活用',
        targetBadge: '接续公式 · 助词辨析',
        badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200/70',
        desc: '五段/一段动词 10 大活用变形器、四大助词 は/が/に/で/を 深度辨析与历届常考句型公式。',
        actionText: '查阅体系文法宝典',
        targetTab: 'grammar',
        icon: BookOpenCheck,
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
      }
    ]
  },
  speaking: {
    id: 'speaking',
    name: '兴趣日常 / 动漫日剧实战',
    targetAudience: '无字幕追番 · 突破哑巴日语',
    tag: '沉浸开口',
    icon: '🎙️',
    activeBorder: 'border-violet-500',
    activeBg: 'bg-violet-50/70 border-violet-400 text-violet-950',
    activeRing: 'ring-2 ring-violet-500/20 shadow-md',
    desc: '告别死板背诵！麦克风连线 24h AI 角色语伴对练 ➔ 30 部经典动漫日剧原声名台词精听 ➔ 每日一句晨读养成语感。',
    steps: [
      {
        stepNum: '01',
        stepLabel: '第 1 步 · 大胆开口',
        title: 'AI 语伴 24h 东京腔对练',
        targetBadge: '角色扮演 · 实时纠错',
        badgeBg: 'bg-violet-100 text-violet-800 border border-violet-200/70',
        desc: '居酒屋定制点单、秋叶原购物砍价、日企商务面试，麦克风直接说日语，AI 即时纠偏打分。',
        actionText: '开启 AI 口语对练',
        targetTab: 'speaking',
        icon: Mic,
        buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
      },
      {
        stepNum: '02',
        stepLabel: '第 2 步 · 影视精听',
        title: '30 部经典动漫日剧台词精听',
        targetBadge: '原声磨耳朵 · 考点精析',
        badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200/70',
        desc: '《千与千寻》《你的名字》《非自然死亡》《半泽直树》等 30 部名场面逐句盲听、影子跟读与考点拆解。',
        actionText: '进入动漫日剧精听',
        targetTab: 'kdrama',
        icon: Headphones,
        buttonBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
      },
      {
        stepNum: '03',
        stepLabel: '第 3 步 · 语感打卡',
        title: '每日早读经典日语音句打卡',
        targetBadge: '肌肉记忆 · 每日自律',
        badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/70',
        desc: '每日精读一句地道日语原声名言，收听慢速/标准发音，连续打卡激活语言直觉。',
        actionText: '朗读今日金句',
        targetTab: 'home',
        icon: Calendar,
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
      }
    ]
  }
};

interface HomePortalProps {
  onSelectModule: (tab: ActiveTab, sceneId?: string) => void;
  onOpenVipModal: (reason?: string) => void;
  isVip: boolean;
  onOpenWallpaperModal?: () => void;
}

export const HomePortal: React.FC<HomePortalProps> = ({
  onSelectModule,
  onOpenVipModal,
  isVip,
  onOpenWallpaperModal
}) => {
  const [streak, setStreak] = useState(() => getStudyStreak());
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const quote: DailyQuote = DAILY_QUOTES_POOL[currentQuoteIndex];

  // 学习主线选择器状态（自动记忆在本地）
  const [selectedTrack, setSelectedTrack] = useState<TrackId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cs313_jp_active_track');
      if (saved === 'exam' || saved === 'beginner' || saved === 'speaking') {
        return saved as TrackId;
      }
    }
    return 'exam';
  });

  const handleTrackChange = (track: TrackId) => {
    setSelectedTrack(track);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cs313_jp_active_track', track);
    }
  };

  const handleTrackCardClick = (trackKey: TrackId) => {
    if (selectedTrack === trackKey) {
      const firstStep = TRACKS_CONFIG[trackKey].steps[0];
      handleStepClick(firstStep);
    } else {
      handleTrackChange(trackKey);
      setTimeout(() => {
        const roadmapElem = document.getElementById('track-steps-roadmap');
        if (roadmapElem) {
          roadmapElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  };

  const currentTrackConfig = TRACKS_CONFIG[selectedTrack];

  // Auto-scrolling update logs ticker state
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);
  const [isLogHovered, setIsLogHovered] = useState<boolean>(false);

  useEffect(() => {
    if (isLogHovered) return;
    const timer = setInterval(() => {
      setActiveLogIndex(prev => (prev + 1) % CONTENT_UPDATE_LOGS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isLogHovered]);

  const handleCheckIn = () => {
    const newCount = checkInToday();
    setStreak({ count: newCount, lastDate: new Date().toISOString().slice(0, 10), isCheckedToday: true });
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES_POOL.length);
  };

  const handleStepClick = (step: TrackStep) => {
    if (step.targetTab === 'home') {
      speakJapanese(quote.audioText);
      const elem = document.getElementById('daily-quote-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onSelectModule(step.targetTab, step.sceneId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* ========================================================================= */}
      {/* 🧭 【置顶核心】3 大目标学习主线向导选择器 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Selector Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" /> 新学员指引 · 学习主线向导
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                不知道从哪学起？点击下方选定你的学习目标：
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>你当前的核心日语学习目标是什么？</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200/60 text-xs font-bold text-slate-700">
            <span className="text-slate-400">当前主线:</span>
            <span className="text-sky-600 flex items-center gap-1 font-black">
              <span>{currentTrackConfig.icon}</span>
              <span>{currentTrackConfig.name}</span>
            </span>
          </div>
        </div>

        {/* 3 Large Track Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(TRACKS_CONFIG) as TrackId[]).map((trackKey) => {
            const track = TRACKS_CONFIG[trackKey];
            const isSelected = selectedTrack === trackKey;

            return (
              <button
                key={trackKey}
                onClick={() => handleTrackCardClick(trackKey)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between gap-2.5 cursor-pointer group ${
                  isSelected
                    ? `${track.activeBg} ${track.activeBorder} ${track.activeRing}`
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 text-slate-700 hover:border-slate-300'
                }`}
                title={isSelected ? `点击直接进入【${track.name}】核心学习` : `点击切换至【${track.name}】主线`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                      ✓
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl">{track.icon}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isSelected ? 'bg-white/90 text-slate-900 border-slate-200/80 shadow-2xs' : 'bg-white text-slate-500 border-slate-200'
                  }`}>
                    {track.tag}
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-black tracking-tight ${
                    isSelected ? 'text-slate-900' : 'text-slate-800'
                  }`}>
                    {track.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {track.targetAudience}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold pt-1.5 border-t border-black/5">
                  <span className={isSelected ? 'text-sky-600 font-black flex items-center gap-1' : 'text-slate-400'}>
                    {isSelected ? `▶ 立即进入学习 (${track.steps[0].actionText.slice(0, 7)})` : '点击切换此路线'}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-sky-600 font-bold group-hover:translate-x-1 transition-transform' : 'text-slate-400'}`}>➔</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Track Summary Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-slate-50 border border-sky-200/70 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
              <span>【{currentTrackConfig.name}】闭环指引</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200 text-[10px] font-extrabold shrink-0 shadow-2xs">
              按顺序执行 3 步 ➔ 达成闭环
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium pl-3 border-l-2 border-sky-400">
            {currentTrackConfig.desc}
          </p>
        </div>

        {/* 3 Steps Sequential Roadmap Cards */}
        <div id="track-steps-roadmap" className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {currentTrackConfig.steps.map((step) => {
            const StepIcon = step.icon;

            return (
              <div
                key={step.stepNum}
                className="rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3.5 group relative"
              >
                {/* Top row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono text-[11px] font-black tracking-wider flex items-center gap-1 shadow-2xs">
                      <span>STEP</span>
                      <span className="text-sky-300">{step.stepNum}</span>
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${step.badgeBg}`}>
                      {step.targetBadge}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-sky-50 group-hover:text-sky-600 transition">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-sky-600 transition">
                      {step.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Action CTA Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleStepClick(step)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 shadow-xs cursor-pointer ${step.buttonBg}`}
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* --- 每日晨读打卡 & 持续更新动态跑马灯轮播专区 --- */}
      <div id="daily-quote-section" className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Compact Daily Morning Reading (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 font-bold text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> 每日晨读
              </span>
              <span className="text-xs font-bold text-slate-800">
                {quote.date} · {quote.source}
              </span>
              <span className="text-[10px] text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200/60 hidden sm:inline">
                考点: {quote.keyGrammar}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleNextQuote}
                className="text-[11px] text-slate-500 hover:text-sky-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                title="切换金句"
              >
                <RefreshCw className="w-3 h-3" />
                <span>换一句</span>
              </button>
            </div>
          </div>

          {/* Quote Body */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {quote.jp || quote.ko}
              </p>
              <p className="text-xs text-slate-600 truncate font-medium">
                {quote.zh}
              </p>
            </div>

            <button
              onClick={() => speakJapanese(quote.audioText)}
              className="p-2 rounded-full bg-white text-sky-600 hover:bg-sky-50 border border-slate-200 shadow-2xs shrink-0 transition cursor-pointer"
              title="朗读金句"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-sky-500 fill-current" />
              <span>已连续打卡 <strong className="text-sky-600 font-bold">{streak.count}</strong> 天</span>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={streak.isCheckedToday}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer ${
                streak.isCheckedToday
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{streak.isCheckedToday ? '今日已打卡 ✓' : '立即打卡'}</span>
            </button>
          </div>

        </div>

        {/* --- Auto-scrolling Vertical Ticker (4 cols) --- */}
        <div 
          onMouseEnter={() => setIsLogHovered(true)}
          onMouseLeave={() => setIsLogHovered(false)}
          className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2.5 relative overflow-hidden group"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Bell className="w-3.5 h-3.5 text-sky-500" />
              <span>持续交付动态</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                ● 自动滚播
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {activeLogIndex + 1}/{CONTENT_UPDATE_LOGS.length}
              </span>
            </div>
          </div>

          {/* Smooth Vertical Slide Ticker Area */}
          <div className="relative h-[66px] overflow-hidden">
            {CONTENT_UPDATE_LOGS.map((log, idx) => {
              const isCurrent = idx === activeLogIndex;
              return (
                <div
                  key={log.id}
                  className={`absolute inset-0 p-2.5 rounded-xl bg-slate-50/90 border border-slate-100/90 flex flex-col justify-center space-y-1 transition-all duration-500 ease-in-out ${
                    isCurrent
                      ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                      : 'opacity-0 -translate-y-4 pointer-events-none scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <strong className="text-xs font-bold text-slate-800 truncate">
                      {log.title}
                    </strong>
                    <span className="text-sky-600 font-semibold text-[10px] bg-sky-50 px-1.5 py-0.2 rounded shrink-0">
                      {log.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {log.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer with Micro Pagination Dots */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            <span>买家享永久云端同步解锁特权</span>
            <div className="flex items-center gap-1">
              {CONTENT_UPDATE_LOGS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLogIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === activeLogIndex ? 'w-3.5 bg-sky-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`切换至第 ${i + 1} 条更新`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- AI 智能日语口语实战对练 (Full Width Showcase) --- */}
      <div 
        onClick={() => onSelectModule('speaking')}
        className="bg-gradient-to-r from-sky-50/90 via-indigo-50/40 to-white text-slate-900 rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-sm cursor-pointer hover:shadow-md hover:border-sky-300 transition duration-300 relative overflow-hidden group"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-black flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" /> 王牌口语实战
              </span>
              <span className="text-xs text-sky-700 font-bold">
                🎙️ 麦克风直接说日语 · 标准东京腔 AI 考官即时纠错打分
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>AI 智能日语口语实战陪练中心</span>
              <ArrowUpRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              JLPT 面试口试 + 居酒屋点单 + 秋叶原淘谷子 + 与动漫角色跨时空对话，戴上耳机大胆开口练！
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition">
              ▶ 立即开启口语对练
            </span>
          </div>
        </div>

        {/* 3 Scenario Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-sky-200/60">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule('speaking');
            }}
            className="p-3 rounded-2xl bg-white/90 border border-sky-200/70 hover:border-sky-400 hover:bg-white transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
          >
            <span className="text-2xl">🍺</span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">居酒屋地道点单实战</h4>
              <p className="text-[10px] text-sky-600 font-medium truncate">生ビール · お通し · お会計</p>
            </div>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule('speaking');
            }}
            className="p-3 rounded-2xl bg-white/90 border border-sky-200/70 hover:border-sky-400 hover:bg-white transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
          >
            <span className="text-2xl">🛍️</span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">秋叶原谷子店购物</h4>
              <p className="text-[10px] text-slate-500 truncate">免税退税 · 限定版咨询</p>
            </div>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule('speaking');
            }}
            className="p-3 rounded-2xl bg-white/90 border border-sky-200/70 hover:border-sky-400 hover:bg-white transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
          >
            <span className="text-2xl">💼</span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">日企商务敬语面试</h4>
              <p className="text-[10px] text-slate-500 truncate">尊敬语与自谦语对练</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3大高阶教研利器专区 (听解精听 + 五十音诊疗 + 艾宾浩斯错题本) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card A: JLPT 听解真题精听 */}
        <div
          onClick={() => onSelectModule('writing')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 听解 60 分稳拿
              </span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                课题/即时应答
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 group-hover:text-sky-600 transition">
              JLPT 听解真题精听研习工坊
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              攻克听力失分死穴！课题理解、要点理解、概要理解与即时应答专项，支持逐句挖空盲听听写。
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
            <span>开始听解精听</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card B: 五十音图与发音工坊 */}
        <div
          onClick={() => onSelectModule('phonetics')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 假名快速通关
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                象形口诀·字源
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition">
              五十音图发音与象形工坊
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              46 清音 + 25 浊音/半浊音 + 33 拗音！汉字字源演变、平片假名对照、促音/长音发音规则全覆盖。
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>进入五十音工坊</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card C: 艾宾浩斯智能错题本 */}
        <div
          onClick={() => onSelectModule('mistakes')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> 靶向消除薄弱项
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                1-3-7-15天复习
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition">
              艾宾浩斯智能错题本
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              JLPT 模考做错题目自动归集，按科学记忆遗忘曲线定时推送重练，攻克易混淆句型与汉字假名！
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>查看待复习错题</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

      </div>

      {/* --- 4 大核心基础底座 (JLPT机考 + 听解精听 + 词汇闪卡 + 文法宝典) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* --- 1. JLPT 真题库 (大卡片) --- */}
        <div
          onClick={() => onSelectModule('exam')}
          className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-sky-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
        >
          <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-sky-50/80 via-indigo-50/30 to-slate-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 border border-sky-200/60">
            <div className="w-[240px] h-[122px] bg-white rounded-2xl p-3 shadow-md border border-sky-200/80 text-center text-slate-800 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-100 pb-1">
                <span className="text-slate-600 flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>JLPT 全真试卷</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-extrabold text-[10px] border border-sky-200/60">
                  N5~N1 收录
                </span>
              </div>
              <div className="space-y-0.5 my-auto">
                <p className="text-sm font-black text-slate-900">JLPT N2 官方全真卷</p>
                <p className="text-[11px] text-slate-500 font-medium">言语知识 + 读解 + 听解 180 分</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-4 py-1 rounded-lg bg-sky-500 text-white font-bold text-xs shadow-2xs group-hover:bg-sky-600 transition">
                  开始模考
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[10px] font-bold shadow-xs">
                N5~N1 全级别覆盖
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition">
                  JLPT 历届真题机考系统
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200/60">
                  全真模拟
                </span>
              </div>
              <p className="text-xs text-slate-500">
                历年官方 JLPT 真题卷，交互式分屏答题、180 分官方标准即时判分与高频考点深度拆解
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* --- 2. JLPT 听解精听研习室 --- */}
        <div
          onClick={() => onSelectModule('writing')}
          className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
        >
          <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-teal-50/80 via-cyan-50/30 to-slate-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 border border-teal-200/60">
            <div className="w-[240px] h-[122px] bg-white rounded-2xl p-3 shadow-md border border-teal-200/80 text-center text-slate-800 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between text-[11px] text-teal-700 font-bold border-b border-slate-100 pb-1">
                <span className="flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5 text-teal-600" />
                  <span>JLPT 官方听解</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-extrabold border border-teal-200/60">
                  音频同步
                </span>
              </div>
              <div className="space-y-0.5 my-auto">
                <p className="text-sm font-black text-slate-900">日本語能力試験 · 聴解実戦</p>
                <p className="text-[11px] text-slate-500 font-medium">NHK 播音员纯正东京腔原声</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-teal-600 text-white font-bold text-xs shadow-2xs flex items-center gap-1 group-hover:bg-teal-700 transition">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>立即精听</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold text-[10px] border border-teal-200/60">
                  0.8x~1.2x
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-bold shadow-xs">
                逐句磨耳朵跟读
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition">
                  JLPT 听解真题研习室
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
                  课题/即答
                </span>
              </div>
              <p className="text-xs text-slate-500">
                官方真题原声听力，支持 0.8x~1.2x 调速、日文中文字幕切换、逐句挖空听写与即时答题判分
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* --- 3. 单词库 (iPad 背单词) --- */}
        <div
          onClick={() => onSelectModule('vocab')}
          className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-sky-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
        >
          <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-sky-50/80 via-blue-50/30 to-slate-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 border border-sky-200/60">
            <div className="w-[240px] h-[122px] bg-white rounded-2xl p-3 shadow-md border border-sky-200/80 text-center text-slate-800 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between text-[11px] text-sky-700 font-bold border-b border-slate-100 pb-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>3D 场景单词闪卡</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-extrabold text-[10px] border border-sky-200/60">
                  6,500+ 词
                </span>
              </div>
              <div className="space-y-0.5 my-auto">
                <p className="text-base font-black text-slate-900 tracking-wide">しあわせ【幸せ】⓪</p>
                <p className="text-[11px] text-slate-500 font-medium">[名·形动] 幸福、幸运</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3.5 py-1 rounded-lg bg-sky-500 text-white font-bold text-xs shadow-2xs group-hover:bg-sky-600 transition">
                  翻转卡片
                </span>
                <span className="px-3.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs">
                  下一个 →
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[10px] font-bold shadow-xs">
                iPad 手写遮挡
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition">
                  JLPT N5~N1 核心词汇闪卡
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200/60">
                  音调核标注
                </span>
              </div>
              <p className="text-xs text-slate-500">
                按考级与场景划分的词汇库，配备 ①②③ 音调核标号、支持 3D 闪卡翻转、遮挡日文/中文默写与纯正发音
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* --- 4. 语法板块 (大卡片) --- */}
        <div
          onClick={() => onSelectModule('grammar')}
          className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
        >
          <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-indigo-50/80 via-sky-50/30 to-slate-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 border border-indigo-200/60">
            <div className="w-[240px] h-[122px] bg-white rounded-2xl p-3 shadow-md border border-indigo-200/80 text-center text-slate-800 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-100 pb-1">
                <span className="flex items-center gap-1 text-indigo-800">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>核心文法与动词活用</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 font-extrabold text-[10px] border border-indigo-200/60">
                  420+ 句型
                </span>
              </div>
              <div className="space-y-1 my-auto">
                <p className="text-xs font-black text-slate-900 bg-indigo-50/90 py-1 px-2 rounded-lg border border-indigo-200/80">
                  动词 10 大活用变形公式
                </p>
                <p className="text-[10px] text-slate-500 font-medium">は vs が · に vs で 深度辨析</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-3.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-2xs transition">
                  查阅文法宝典 →
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold shadow-xs">
                动词活用变形器
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  420+ 体系文法宝典
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60">
                  动词变形器
                </span>
              </div>
              <p className="text-xs text-slate-500">
                涵盖 N5~N1 核心句型接续公式，动词 10 大活用形态秒查与四大核心助词深度辨析
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

      {/* --- 5. 经典动漫与日剧名台词研习室 (精选 4 部 + 30部全库直达) --- */}
      <div
        onClick={() => onSelectModule('kdrama')}
        className="group bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer overflow-hidden space-y-4 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-xs">
                <Headphones className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition">
                经典动漫与日剧 · 名场面台词研习室
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-600 text-xs font-bold border border-sky-200/60">
                🎧 原声磨耳朵 · 影子跟读
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              精选《千与千寻》《你的名字》《非自然死亡》《半泽直树》等 30 部名场面逐句盲听、影子跟读与考点拆解！
            </p>
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectModule('kdrama');
              }}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-xl border border-sky-200/80 flex items-center gap-1 group-hover:translate-x-0.5 transition shadow-xs cursor-pointer"
            >
              <span>进入影视剧场</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Card Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {ANIME_DRAMA_SCENES.slice(0, 4).map((sceneItem) => {
            const isSceneLocked = !isVip && !sceneItem.isFreePreview;

            return (
              <div 
                key={sceneItem.id}
                onClick={() => {
                  if (isSceneLocked) {
                    onOpenVipModal(`🔒《${sceneItem.title}》(${sceneItem.sceneTitle})为 VIP 会员专属原声剧场！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部 30 部动漫日剧沉浸台词跟读！`);
                    return;
                  }
                  onSelectModule('kdrama', sceneItem.id);
                }}
                className="group/card bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-sky-300 hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
              >
                <DramaThumbnail 
                  dramaTitle={sceneItem.title}
                  koreanDramaTitle={sceneItem.japaneseTitle}
                  sceneTitle={sceneItem.sceneTitle}
                  levelTag={sceneItem.level}
                  category="动漫名场面"
                  genre={sceneItem.genre}
                  actionText="▶ 立即精学"
                  className="min-h-[160px] sm:min-h-[170px]"
                />
                
                {isSceneLocked && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-bold border border-amber-400/40 shadow-lg flex items-center gap-1 z-20">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>VIP专享</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All 30 Dramas Full-width Button */}
        <div className="pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule('kdrama');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 hover:from-sky-100 hover:to-sky-50 border border-slate-200/80 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200 shadow-2xs group cursor-pointer"
          >
            <span>🎬 查看全部 30 部经典动漫与日剧原声研习库（包含《千与千寻》《你的名字》《非自然死亡》《半泽直树》等）</span>
            <ArrowRight className="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* --- 6. 学员美学福利 · 一子一木 4K 伴学治愈壁纸屋横幅 --- */}
      <WallpaperBanner onOpenWallpaperModal={onOpenWallpaperModal} />

    </div>
  );
};
