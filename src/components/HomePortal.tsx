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
  ArrowRight,
  Target
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

const STEP_VERB_DEMOS = [
  { dict: '飲む (喝)', result: '飲める (可能态)', tag: '五段跃迁至え段+る', sound: 'のめる' },
  { dict: '書く (写)', result: '書かれる (被动态)', tag: '五段跃迁至あ段+れる', sound: 'かかれる' },
  { dict: '行く (去)', result: '行って (て形特例)', tag: '🚨 促音便最大特例', sound: 'いって' },
  { dict: 'する (做)', result: 'できる (可能态)', tag: '🚨 サ变完全异化演变', sound: 'できる' },
];

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


interface JapaneseDayQuest {
  day: number;
  title: string;
  subtitle: string;
  focus: string;
  targetTab: ActiveTab;
  badge: string;
  tips: string;
}

const JAPANESE_7DAY_QUESTS: JapaneseDayQuest[] = [
  {
    day: 1,
    title: 'あ行~さ行 (15音)',
    subtitle: 'あいうえお · かきくけこ · さしすせそ',
    focus: '五大元音口型基石 · 假名草书汉字字源',
    targetTab: 'phonetics',
    badge: '元音基石',
    tips: 'あ源于「安」，い源于「以」，う源于「宇」；嘴型比汉语小，发音短促清脆'
  },
  {
    day: 2,
    title: 'た行~ま行 (15音)',
    subtitle: 'たちつてと · なにぬねの · まみむめも',
    focus: '发音器官舌位 · 平片假名易混笔顺',
    targetTab: 'phonetics',
    badge: '器官象形',
    tips: '注意「ち(chi)」与「つ(tsu)」的特殊发音；「ぬ」与「め」右侧有无打圈'
  },
  {
    day: 3,
    title: 'や行~わ行+ん (16音)',
    subtitle: 'やゆよ · らりるれろ · わを · ん',
    focus: '五十音图清音大圆满 · 假名拼读实战',
    targetTab: 'phonetics',
    badge: '清音圆满',
    tips: 'ら行是弹舌轻音，不是边音l也不是卷舌r；「を」专作宾语助词'
  },
  {
    day: 4,
    title: '浊音·半浊音+拗音 (58音)',
    subtitle: 'がざだば行(20) · ぱ行(5) · きゃ/しゃ/ちゃ(33)',
    focus: '声带震动声调 · 复合滑音快速拼读',
    targetTab: 'phonetics',
    badge: '进阶全音',
    tips: '加两点声带震动成浊音；加小圆圈成半浊爆破音；小写ゃゅょ构成拗音'
  },
  {
    day: 5,
    title: '三大特殊音拍 (Mora)',
    subtitle: '促音(っ) · 长音(ー) · 拨音(ん)',
    focus: '肌肉断气刹车 · 节拍器拉满两拍 · 口腔同化',
    targetTab: 'phonetics',
    badge: '击碎中式发音',
    tips: '促音憋满一整拍；长音拖满两拍；拨音在m/b/p前闭唇[m]，t/d/n前抵牙龈[n]'
  },
  {
    day: 6,
    title: '片假名多胞胎死敌攻坚',
    subtitle: 'シ vs ツ · ソ vs ン · ウ vs ワ vs ク',
    focus: '起笔方向与顺撇挑笔 · 汉字偏旁字源',
    targetTab: 'phonetics',
    badge: '告别假名盲',
    tips: 'シ由下往上仰头提笔，ツ由上往下顺水撇；ソ曾祖父向下扫，ン点头往上翘'
  },
  {
    day: 7,
    title: '黄金助词与见字能读',
    subtitle: 'は vs が · に vs で · ありがとう · すみません',
    focus: '大舞台vs聚光灯 · 静态存在vs动态舞台 · 毕业！',
    targetTab: 'phonetics',
    badge: '毕业蜕变',
    tips: 'は管全句大主题，が聚焦未知主语；掌握拼读公式，任意动漫歌词见字能读！'
  }
];

const TRACKS_CONFIG: Record<TrackId, TrackConfig> = {
  beginner: {
    id: 'beginner',
    name: '零基础入门 / 五十音筑基',
    targetAudience: '从假名到中高阶 · 轻松自学',
    tag: '系统筑基',
    icon: '🌸',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-50/70 border-emerald-400 text-emerald-950',
    activeRing: 'ring-2 ring-emerald-500/20 shadow-md',
    desc: '初学者零压力入门路线：掌握 46 清音与浊音/拗音象形口诀 ➔ 刷透 6,500+ JLPT 核心词 ➔ 攻克动词 10 大活用变形 ➔ 搞懂 420+ 体系文法宝典！',
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
        stepLabel: '第 3 步 · 独家自研',
        title: '动词 10 大活用变形可视化演练器',
        targetBadge: '✨ 独家自研推导引擎',
        badgeBg: 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-2xs',
        desc: '彻底攻克日语活用最大痛点！辞书形/て形/ない形/可能态/被动态一键推导，假名段位跃迁与音便轨迹秒懂。',
        actionText: '开启独家动词变形演练器',
        targetTab: 'grammar',
        sceneId: 'conjugation',
        icon: BookOpenCheck,
        buttonBg: 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-xs'
      },
      {
        stepNum: '04',
        stepLabel: '第 4 步 · 搭建框架',
        title: '420+ 体系文法与全景思维导图',
        targetBadge: '72考点树 · 助词辨析',
        badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200/70',
        desc: 'N5~N1 分级核心句型公式、四大助词 は/が/に/で/を 深度辨析与全景树状思维导图。',
        actionText: '查阅体系文法宝典',
        targetTab: 'grammar',
        sceneId: 'library',
        icon: BookOpen,
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
      }
    ]
  },
  speaking: {
    id: 'speaking',
    name: '日常会话 / 原声名台词精听',
    targetAudience: '高光台词原声盲听 · 突破哑巴日语',
    tag: '沉浸开口',
    icon: '🎙️',
    activeBorder: 'border-violet-500',
    activeBg: 'bg-violet-50/70 border-violet-400 text-violet-950',
    activeRing: 'ring-2 ring-violet-500/20 shadow-md',
    desc: '告别死板背诵！经典影视名台词逐句原声精听（每周持续扩充更新） ➔ 麦克风连线 24h AI 角色语伴对练 ➔ 每日早读原声金句养成语感！',
    steps: [
      {
        stepNum: '01',
        stepLabel: '第 1 步 · 原声精听',
        title: '原声名台词 · 逐句精听与跟读',
        targetBadge: '原声磨耳朵 · 考点精析',
        badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200/70',
        desc: '精选《千与千寻》《你的名字》《非自然死亡》《半泽直树》等高光名场面台词音频，逐句盲听、影子跟读与考点拆解（每周持续扩充）。',
        actionText: '进入原声名台词精听',
        targetTab: 'kdrama',
        icon: Headphones,
        buttonBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
      },
      {
        stepNum: '02',
        stepLabel: '第 2 步 · 大胆开口',
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
        stepNum: '03',
        stepLabel: '第 3 步 · 语感打卡',
        title: '每日早读原声金句打卡',
        targetBadge: '肌肉记忆 · 激活直觉',
        badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/70',
        desc: '精选经典日剧高光台词与文学名句，配东京标准原声朗读，每日坚持打卡唤醒口腔肌肉记忆。',
        actionText: '朗读今日金句',
        targetTab: 'home',
        icon: Calendar,
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
      }
    ]
  },
  exam: {
    id: 'exam',
    name: 'JLPT 考级提分冲刺',
    targetAudience: '冲刺 N5~N1 · 180分高分上岸',
    tag: '备考必选',
    icon: '🎯',
    activeBorder: 'border-sky-500',
    activeBg: 'bg-sky-50/70 border-sky-400 text-sky-950',
    activeRing: 'ring-2 ring-sky-500/20 shadow-md',
    desc: '专为 JLPT N5~N1 考生打造的高分闭环：官方历届考期机考 ➔ 错题遗忘曲线复盘 ➔ 四大核心题型与原声听解专项突破（攻克★排词与即时应答）！',
    steps: [
      {
        stepNum: '01',
        stepLabel: '第 1 步 · 模考查漏',
        title: 'JLPT 历届官方考期真题机考',
        targetBadge: '摸清 180 分水位',
        badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200/70',
        desc: '官方标准 180 分评分、言语知识/读解/听解原卷作答、单项19分基准线诊断，精准测出真实水平与各大板块薄弱项。',
        actionText: '进入历届真题考场',
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
        stepLabel: '第 3 步 · 专项攻坚',
        title: '四大核心题型与原声听解专项突破',
        targetBadge: '听解原声 · ★排词攻坚',
        badgeBg: 'bg-blue-100 text-blue-800 border border-blue-200/70',
        desc: '攻克 JLPT 最大失分雷区：听解即时应答与课题理解磨耳朵、文法★号排词破题拆解、长篇读解信息检索靶向集训！',
        actionText: '进入四大题型专项考场',
        targetTab: 'exam',
        icon: Target,
        buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
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
  const [activeVerbDemoIdx, setActiveVerbDemoIdx] = useState<number>(0);
  const quote: DailyQuote = DAILY_QUOTES_POOL[currentQuoteIndex];

  // 学习主线选择器状态（自动记忆在本地，默认推荐零基础入门）
  const [selectedTrack, setSelectedTrack] = useState<TrackId>(() => {
    if (typeof window !== 'undefined') {
      const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.substring(window.location.hash.indexOf('?')) : '');
      const urlTrack = new URLSearchParams(searchStr).get('track');
      if (urlTrack === 'beginner' || urlTrack === 'speaking' || urlTrack === 'exam') {
        return urlTrack as TrackId;
      }
      const saved = localStorage.getItem('cs313_jp_active_track');
      if (saved === 'beginner' || saved === 'speaking' || saved === 'exam') {
        return saved as TrackId;
      }
    }
    return 'beginner';
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

    // 零基础 7 天五十音与筑基通关打卡进度
  const [completedJapaneseDays, setCompletedJapaneseDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('japanese_completed_days');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const toggleJapaneseDayComplete = (day: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedJapaneseDays(prev => {
      let next: number[];
      if (prev.includes(day)) {
        next = prev.filter(d => d !== day);
      } else {
        next = [...prev, day];
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
      try {
        localStorage.setItem('japanese_completed_days', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

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
      {/* 🌅 每日晨读打卡 & 持续更新动态跑马灯轮播专区 (置于首页顶层，进站第一眼养成语感) */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 🧭 【置顶核心】3 大目标学习主线向导选择器 (一眼明确主线，告别进站一脸懵) */}
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
                不知道从哪学起？点击下方选定你的目标：
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>你当前的核心学习目标是什么？</span>
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

        {/* Current Track Summary Callout (置于顶栏正下方、3 大主线按钮正上方，精准对齐红框规范) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-slate-50 border border-sky-200/70 space-y-2">
          {/* Header Row: Title on Left, Badge on Right */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
              <span>【{currentTrackConfig.name}】闭环指引</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200 text-[10px] font-extrabold shrink-0 shadow-2xs">
              按顺序执行 {currentTrackConfig.steps.length} 步 ➔ 达成闭环
            </span>
          </div>

          {/* Description Text: Full Width, Comfortable Line Height */}
          <p className="text-xs text-slate-700 leading-relaxed font-medium pl-3 border-l-2 border-sky-400">
            {currentTrackConfig.desc}
          </p>
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

        {/* Steps Sequential Roadmap Cards */}
        <div id="track-steps-roadmap" className={`grid grid-cols-1 ${currentTrackConfig.steps.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4 relative`}>
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

                  {/* STEP 03 专属：动词变形可视化演练器互动演示窗（整合自原底部横幅） */}
                  {selectedTrack === 'beginner' && step.stepNum === '03' && (
                    <div className="bg-sky-50/70 rounded-xl p-2.5 border border-sky-200/80 space-y-2">
                      {/* 4 个动词切换药丸 */}
                      <div className="flex items-center justify-between gap-1">
                        {STEP_VERB_DEMOS.map((demo, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVerbDemoIdx(idx);
                              speakJapanese(demo.sound);
                            }}
                            className={`flex-1 py-0.5 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                              activeVerbDemoIdx === idx
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-2xs'
                                : 'bg-white text-slate-600 hover:bg-sky-100 hover:text-sky-700 border border-slate-200/60'
                            }`}
                          >
                            {demo.dict.split(' ')[0]}
                          </button>
                        ))}
                      </div>

                      {/* 选中的变形推导卡片 */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(STEP_VERB_DEMOS[activeVerbDemoIdx].sound);
                        }}
                        className="bg-white p-2 rounded-lg border border-sky-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between group/pill shadow-2xs"
                        title="点击朗读变形读音"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-slate-400 line-through text-[10px] truncate">
                              {STEP_VERB_DEMOS[activeVerbDemoIdx].dict}
                            </span>
                            <span className="text-sky-500 font-bold">➔</span>
                            <span className="font-mono font-black text-sky-700 text-xs truncate">
                              {STEP_VERB_DEMOS[activeVerbDemoIdx].result}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold truncate">
                            {STEP_VERB_DEMOS[activeVerbDemoIdx].tag}
                          </p>
                        </div>
                        <div className="p-1 rounded-md bg-sky-50 text-sky-600 group-hover/pill:bg-sky-500 group-hover/pill:text-white transition shrink-0 ml-1">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 01 专属：假名象形与发音点读 */}
                  {selectedTrack === 'beginner' && step.stepNum === '01' && (
                    <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-200/70 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                        <span>清音·浊音·拗音·象形联想</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-emerald-200/80">点读发音</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center">
                        {[
                          { k: 'あ', r: 'a', o: '安' },
                          { k: 'か', r: 'ka', o: '加' },
                          { k: 'さ', r: 'sa', o: '左' },
                          { k: 'た', r: 'ta', o: '太' }
                        ].map((item, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(item.k);
                            }}
                            className="bg-white p-1 rounded-lg border border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 transition cursor-pointer group/k"
                            title={`点击发音: ${item.k}`}
                          >
                            <div className="text-xs font-black text-slate-800 group-hover/k:text-emerald-700">{item.k}</div>
                            <div className="text-[9px] text-slate-400 font-medium">{item.o}·{item.r}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 02 专属：高频分级词卡预览 */}
                  {selectedTrack === 'beginner' && step.stepNum === '02' && (
                    <div className="bg-sky-50/60 rounded-xl p-2.5 border border-sky-200/70 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-sky-800 font-bold">
                        <span>6,500+ 分级 · 高低音调核</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-sky-200/80">遮挡默写</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese('さくら');
                          }}
                          className="bg-white p-1.5 rounded-lg border border-sky-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between group/v shadow-2xs"
                          title="点击发音"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 text-xs">桜 ①</span>
                            <p className="text-[10px] text-slate-400">sakura / 樱花</p>
                          </div>
                          <Volume2 className="w-3 h-3 text-slate-300 group-hover/v:text-sky-600" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese('やくそく');
                          }}
                          className="bg-white p-1.5 rounded-lg border border-sky-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between group/v shadow-2xs"
                          title="点击发音"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 text-xs">約束 ⓪</span>
                            <p className="text-[10px] text-slate-400">yakusoku / 约定</p>
                          </div>
                          <Volume2 className="w-3 h-3 text-slate-300 group-hover/v:text-sky-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 04 专属：420+ 体系文法与思维导图 */}
                  {selectedTrack === 'beginner' && step.stepNum === '04' && (
                    <div className="bg-indigo-50/60 rounded-xl p-2.5 border border-indigo-200/70 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-indigo-800 font-bold">
                        <span>420+ 文法宝典 · 助词辨析</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-indigo-200/80">思维导图</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="bg-white p-1.5 rounded-lg border border-indigo-100 shadow-2xs p-1.5">
                          <div className="font-bold text-slate-800 text-xs">は / が</div>
                          <p className="text-[10px] text-slate-400">主格/主题辨析</p>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-indigo-100 shadow-2xs p-1.5">
                          <div className="font-bold text-slate-800 text-xs">に / で</div>
                          <p className="text-[10px] text-slate-400">时间/动作场所</p>
                        </div>
                      </div>
                    </div>
                  )}
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

        {/* 零基础专属：Day 1 ~ Day 7 零基础筑基通关打卡路线 */}
        {selectedTrack === 'beginner' && (
          <div className="mt-4 pt-5 border-t border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 东京外国语大学教研大纲
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Day 1 ~ Day 7 零基础筑基通关打卡路线
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  每天 20 分钟 · 7 天告别假名盲 · 见字能读、听音能写
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                  <span>通关进度: </span>
                  <strong className="text-emerald-600">{completedJapaneseDays.length}</strong>/7 天
                </div>
              </div>
            </div>

            {/* 7 Days Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {JAPANESE_7DAY_QUESTS.map((quest) => {
                const isDone = completedJapaneseDays.includes(quest.day);

                return (
                  <div
                    key={quest.day}
                    onClick={() => onSelectModule(quest.targetTab)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                      isDone
                        ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs hover:border-emerald-500'
                        : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-black ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                        }`}>
                          DAY {quest.day}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => toggleJapaneseDayComplete(quest.day, e)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border ${
                            isDone 
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs' 
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title={isDone ? '点击取消打卡' : '点击标记已掌握'}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isDone ? '已通关' : '打卡'}</span>
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="text-sm font-black text-slate-900 group-hover:text-sky-600 transition">
                            {quest.title}
                          </h5>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
                            {quest.badge}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5 font-bold">
                          {quest.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {quest.focus}
                      </p>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                        <span className="font-bold text-slate-700 block">💡 老师秘诀:</span>
                        <p className="line-clamp-2">{quest.tips}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
                      <span>进入当天训练</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {/* Final Completion Badge Card */}
              <div className="p-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 flex flex-col justify-between space-y-3 text-center">
                <div className="space-y-2 my-auto">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-xs text-lg">
                    🌸
                  </div>
                  <h5 className="text-sm font-black text-amber-950">
                    7天达成通关
                  </h5>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    掌握清浊拗 + 片假名死敌 + 特殊音拍 + 黄金助词，见字能读、任意动漫生肉随心看！
                  </p>
                </div>
                <button
                  onClick={() => onSelectModule('phonetics')}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  去五十音工坊打卡 ➔
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- 5. 原声名台词精听研习室 (精选 4 部 + 30部全库直达) --- */}
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
                原声名台词精听研习室
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-600 text-xs font-bold border border-sky-200/60">
                🎧 原声音频精听 · 影子跟读
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-700 text-[10px] font-bold">
                每周持续扩充更新
              </span>
              <span>精选《千与千寻》《你的名字》《非自然死亡》等 {ANIME_DRAMA_SCENES.length}+ 部名场面原声音频，逐句盲听、影子跟读与考点拆解！</span>
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
              <span>进入原声精听</span>
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
                    onOpenVipModal(`🔒《${sceneItem.title}》(${sceneItem.sceneTitle})为 VIP 会员专属原声台词精听！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部 ${ANIME_DRAMA_SCENES.length}+ 部经典影视原声台词沉浸精听与每周持续更新！`);
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
                  category="原声台词精听"
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

        {/* View All Dramas Full-width Button */}
        <div className="pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule('kdrama');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 hover:from-sky-100 hover:to-sky-50 border border-slate-200/80 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200 shadow-2xs group cursor-pointer"
          >
            <span>🎬 查看全部 {ANIME_DRAMA_SCENES.length}+ 部经典原声台词研习库（每周持续扩充 · 包含《千与千寻》《你的名字》《非自然死亡》《半泽直树》等高光台词音频）</span>
            <ArrowRight className="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* --- 6. 学员美学福利 · 一子一木 4K 伴学治愈壁纸屋横幅 --- */}
      <WallpaperBanner onOpenWallpaperModal={onOpenWallpaperModal} />

    </div>
  );
};
