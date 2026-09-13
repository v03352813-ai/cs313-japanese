import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Layers, 
  Volume2, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  Sparkles, 
  EyeOff, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  BookOpen,
  Calendar,
  Play,
  Pause,
  List,
  Grid,
  Lock
} from 'lucide-react';
import { 
  JLPT_CORE_VOCABULARY, 
  JLPT_LEVEL_LABELS, 
  JlptLevel, 
  JlptWord 
} from '../data/japanese/jlptVocab';
import { speakJapanese } from '../utils/speech';
import { api } from '../services/api';

interface JapaneseVocabViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

export const JapaneseVocabView: React.FC<JapaneseVocabViewProps> = ({ isVip = false, onOpenVipModal }) => {
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel>('N5');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [maskMode, setMaskMode] = useState<'none' | 'hideZh' | 'hideJa'>('none');
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<0.8 | 1.0 | 1.2>(1.0);

  // 音调核图示与通俗心法
  const getPitchVisual = (pitch: number) => {
    if (pitch === 0) {
      return {
        type: '0型 · 平板调',
        symbol: '─',
        desc: '首拍低，后拍持续高平不掉落 (像高铁平稳开)',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
      };
    }
    if (pitch === 1) {
      return {
        type: '1型 · 头高调',
        symbol: '＼',
        desc: '首拍最高，次拍急剧下跌 (像坐跳楼机)',
        color: 'bg-rose-50 text-rose-800 border-rose-200'
      };
    }
    if (pitch === 2) {
      return {
        type: '2型 · 中高调',
        symbol: '╭╮',
        desc: '第2拍最高，第3拍跌落',
        color: 'bg-amber-50 text-amber-800 border-amber-200'
      };
    }
    return {
      type: `${pitch}型 · 中/尾高调`,
      symbol: '╭──╮',
      desc: `第${pitch}拍最高后跌落`,
      color: 'bg-sky-50 text-sky-800 border-sky-200'
    };
  };

  // 自他动词成对速记库
  const TRANSITIVE_PAIRS: Record<string, { partner: string; type: '自' | '他'; example: string }> = {
    '開く': { partner: '開ける', type: '自', example: 'ドアが開く (门开了) ↔ ドアを開ける (开门)' },
    '開ける': { partner: '開く', type: '他', example: 'ドアを開ける (开门) ↔ ドアが開く (门开了)' },
    '閉まる': { partner: '閉める', type: '自', example: '窓が閉まる (窗关了) ↔ 窓を閉める (关窗)' },
    '閉める': { partner: '閉まる', type: '他', example: '窓を閉める (关窗) ↔ 窓が閉まる (窗关了)' },
    '始まる': { partner: '始める', type: '自', example: '授業が始まる (课开始了) ↔ 授業を始める (开始上课)' },
    '始める': { partner: '始まる', type: '他', example: '授業を始める (开始上课) ↔ 授業が始まる (课开始了)' },
    '終わる': { partner: '終える', type: '自', example: '仕事が終わる (工作结束) ↔ 仕事を終える (完成工作)' },
    '消える': { partner: '消す', type: '自', example: '電気が消える (灯熄了) ↔ 電気を消す (关灯)' },
    '消す': { partner: '消える', type: '他', example: '電気を消す (关灯) ↔ 電気が消える (灯熄了)' },
    '出る': { partner: '出す', type: '自', example: '汗が出る (流汗) ↔ 手紙を出す (寄信)' },
    '出す': { partner: '出る', type: '他', example: '手紙を出す (寄信) ↔ 汗が出る (流汗)' },
    '入る': { partner: '入れる', type: '自', example: '部屋に入る (进房间) ↔ お茶を入れる (泡茶)' },
    '入れる': { partner: '入る', type: '他', example: 'お茶を入れる (泡茶) ↔ 部屋に入る (进房间)' },
    '壊れる': { partner: '壊す', type: '自', example: '時計が壊れる (表坏了) ↔ 時計を壊す (弄坏表)' },
    '壊す': { partner: '壊れる', type: '他', example: '時計を壊す (弄坏表) ↔ 時計が壊れる (表坏了)' },
    '落ちる': { partner: '落とす', type: '自', example: '財布が落ちる (钱包掉落) ↔ 財布を落とす (弄丢钱包)' },
    '落とす': { partner: '落ちる', type: '他', example: '財布を落とす (弄丢钱包) ↔ 財布が落ちる (钱包掉落)' },
  };

  // 非 VIP 仅开放 N5 且仅限 Day 1 试背
  useEffect(() => {
    if (!isVip && (selectedLevel !== 'N5' || selectedDay !== 1)) {
      setSelectedLevel('N5');
      setSelectedDay(1);
    }
  }, [isVip]);

  // 已掌握词汇追踪 (本地存储 + 后端双向同步)
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cs313_jp_mastered_vocabs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    api.syncStudyProgress({}).then(progress => {
      if (progress && progress.masteredVocabIds && progress.masteredVocabIds.length > 0) {
        setMasteredIds(prev => Array.from(new Set([...prev, ...progress.masteredVocabIds])));
        localStorage.setItem('cs313_jp_mastered_vocabs', JSON.stringify(progress.masteredVocabIds));
      }
    }).catch(() => {});
  }, []);

  // 按等级与搜索过滤全量词汇
  const levelVocabs = useMemo(() => {
    return JLPT_CORE_VOCABULARY.filter(w => {
      const matchesLevel = w.level === selectedLevel;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        w.kanji.toLowerCase().includes(query) ||
        w.furigana.toLowerCase().includes(query) ||
        w.meaning.toLowerCase().includes(query) ||
        (w.romaji && w.romaji.toLowerCase().includes(query));
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchQuery]);

  // Day 单元切片 (每单元 30 词)
  const WORDS_PER_DAY = 30;
  const totalDays = Math.max(1, Math.ceil(levelVocabs.length / WORDS_PER_DAY));

  const activeVocab = useMemo(() => {
    if (selectedDay === 0) return levelVocabs; // 全部连续背
    const start = (selectedDay - 1) * WORDS_PER_DAY;
    return levelVocabs.slice(start, start + WORDS_PER_DAY);
  }, [levelVocabs, selectedDay]);

  // 切换筛选时重置翻面与连读
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsAutoPlaying(false);
  }, [selectedLevel, searchQuery, selectedDay]);

  const currentWord: JlptWord | undefined = activeVocab[currentIndex];

  // 自动连续朗读 (Auto Play 磨耳朵)
  const autoPlayTimerRef = useRef<any>(null);
  useEffect(() => {
    if (!isAutoPlaying || activeVocab.length === 0) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    const word = activeVocab[currentIndex];
    if (word) {
      speakJapanese(word.kanji || word.furigana, speechRate);
    }

    autoPlayTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 < activeVocab.length) return prev + 1;
        setIsAutoPlaying(false);
        return prev;
      });
    }, 3800);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, currentIndex, activeVocab, speechRate]);

  // 切词控制
  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeVocab.length - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < activeVocab.length ? prev + 1 : 0));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    if (activeVocab.length <= 1) return;
    const rand = Math.floor(Math.random() * activeVocab.length);
    setCurrentIndex(rand);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const updated = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('cs313_jp_mastered_vocabs', JSON.stringify(updated));
      api.syncStudyProgress({ masteredVocabIds: updated }).catch(() => {});
      return updated;
    });
  };

  const playVoice = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text, speechRate);
  };

  // 全键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '1') {
        e.preventDefault();
        if (currentWord) toggleMastered(currentWord.id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentWord) speakJapanese(currentWord.kanji || currentWord.furigana, speechRate);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, speechRate]);

  const dayMasteredCount = activeVocab.filter(v => masteredIds.includes(v.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. 顶部步骤导引条 (直观告知学习主线与词库目标，官方 JLPT 词汇分级体系) */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            02
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 text-[11px] font-black">
                学习主线 · 第 2 步
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                6,500+ 核心词汇 · 3D 闪卡切片记忆库
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline">
                已掌握 {masteredIds.length} 词
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              作答建议：结合真题高频考点 ➔ 分组刷词（每组 30 词）➔ 遮挡测试加强默写记忆
            </p>
          </div>
        </div>

        {/* 顶部快捷开关: 语速切换 + 遮挡模式 + 自动连读 + 视图切换 + 随机抽词 */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end shrink-0 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          
          {/* 语速选择: 0.8x 慢速精听 vs 1.0x 原速 vs 1.2x 快速 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs gap-0.5">
            <button
              type="button"
              onClick={() => setSpeechRate(0.8)}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                speechRate === 0.8 ? 'bg-amber-500 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="0.8x 慢速精听：清晰辨析促音与长音"
            >
              0.8x 慢速
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(1.0)}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                speechRate === 1.0 ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="1.0x 原速标准发音"
            >
              1.0x 原速
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(1.2)}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                speechRate === 1.2 ? 'bg-amber-500 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="1.2x 快速听力挑战"
            >
              1.2x 快速
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setMaskMode('none')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                maskMode === 'none' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="正常模式"
            >
              全显
            </button>
            <button
              onClick={() => setMaskMode('hideZh')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
                maskMode === 'hideZh' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="遮挡中文（看日文忆中文）"
            >
              <EyeOff className="w-3 h-3" />
              <span>遮中文</span>
            </button>
            <button
              onClick={() => setMaskMode('hideJa')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
                maskMode === 'hideJa' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="遮挡日文（看中文忆日文）"
            >
              <EyeOff className="w-3 h-3" />
              <span>遮日文</span>
            </button>
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isAutoPlaying 
                ? 'bg-amber-500 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="自动连读当前单元"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-600" />}
            <span>{isAutoPlaying ? '暂停' : '自动连读'}</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'flashcard' ? 'list' : 'flashcard')}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer shadow-2xs"
            title={viewMode === 'flashcard' ? '切换为列表速查视图' : '切换为3D闪卡视图'}
          >
            {viewMode === 'flashcard' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShuffle}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer shadow-2xs"
            title="随机抽词"
          >
            <Shuffle className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 2. 等级切换 + 单元切片 + 快速搜索 */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        
        {/* Row 1: JLPT 等级选择 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">JLPT 等级:</span>
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => {
            const isSelected = selectedLevel === lvl;
            const isLocked = !isVip && lvl !== 'N5';
            const meta = JLPT_LEVEL_LABELS[lvl];
            return (
              <button
                key={lvl}
                onClick={() => {
                  if (isLocked) {
                    onOpenVipModal?.(`🔒【${lvl} 核心词库】为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可解锁 6,500+ JLPT 全级别考纲核心词库！`);
                    return;
                  }
                  setSelectedLevel(lvl);
                  setSelectedDay(1);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{lvl} ({meta.label.split(' ')[1] || meta.label})</span>
                {isLocked && <Lock className="w-2.5 h-2.5 text-amber-500" />}
              </button>
            );
          })}
        </div>

        {/* Row 2: 下拉式单元切换器 + 搜索框 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>切换单元:</span>
            </span>

            <div className="relative flex-1 min-w-0 max-w-sm">
              <select
                value={selectedDay}
                onChange={(e) => {
                  const day = Number(e.target.value);
                  if (!isVip && day !== 1) {
                    onOpenVipModal?.('🔒【全单元词库】为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），畅学全部 Day 单元分组切片！');
                    return;
                  }
                  setSelectedDay(day);
                }}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
              >
                <option value={1}>✓ Day 1 (第 1~30 词 · 免费试背)</option>
                {Array.from({ length: totalDays - 1 }, (_, i) => i + 2).map((day) => {
                  const startWord = (day - 1) * WORDS_PER_DAY + 1;
                  const endWord = Math.min(day * WORDS_PER_DAY, levelVocabs.length);
                  const label = isVip ? `✓ Day ${day} (第 ${startWord}~${endWord} 词)` : `🔒 Day ${day} (第 ${startWord}~${endWord} 词) [VIP]`;
                  return (
                    <option key={day} value={day}>
                      {label}
                    </option>
                  );
                })}
                {isVip && <option value={0}>🌟 全部词汇连续背 ({levelVocabs.length} 词)</option>}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium hidden md:inline shrink-0">
              (单元进度: <strong className="text-sky-600 font-bold">{dayMasteredCount}</strong> / {activeVocab.length})
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索汉字、假名或释义..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>
        </div>

      </div>

      {/* 3. View Mode 1: 旗舰级 3D 宽屏大卡片模式 */}
      {viewMode === 'flashcard' && activeVocab.length > 0 && currentWord && (
        <div className="space-y-4 w-full">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
            <span>
              当前词卡: <strong className="text-slate-900 font-black">{currentIndex + 1}</strong> / {activeVocab.length}
              {selectedDay > 0 && ` (Day ${selectedDay})`} · <span className="text-sky-700">{selectedLevel} 词库</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <RotateCw className="w-3.5 h-3.5" /> 点击卡片翻面
            </span>
          </div>

          {/* 3D Flip Container (全宽大屏幕 + 3D 空间立体翻转) */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full min-h-[340px] sm:min-h-[380px] cursor-pointer perspective-1000 select-none group"
          >
            <div className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] duration-500 transform-style-3d transition-transform rounded-3xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              
              {/* --- FRONT OF CARD (卡片正面) --- */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg shadow-slate-200/50 flex flex-col justify-between backface-hidden">
                
                {/* Top Badge Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200/60">
                      {currentWord.level}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                      {currentWord.pos}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 shadow-2xs ${getPitchVisual(currentWord.pitch).color}`}>
                      <span className="font-mono font-black">{getPitchVisual(currentWord.pitch).symbol}</span>
                      <span>{getPitchVisual(currentWord.pitch).type}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentWord.id);
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      masteredIds.includes(currentWord.id)
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-300 hover:text-slate-400 hover:bg-slate-50'
                    }`}
                    title={masteredIds.includes(currentWord.id) ? '已标记为掌握' : '标记为已掌握'}
                  >
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Center Word & Pronunciation */}
                <div className="text-center py-6 space-y-3">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <h2 className={`text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans transition-all ${
                      maskMode === 'hideJa' && !isFlipped ? 'filter blur-md' : ''
                    }`}>
                      {currentWord.kanji}
                    </h2>
                    
                    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <button
                        type="button"
                        onClick={(e) => playVoice(e, currentWord.kanji || currentWord.furigana)}
                        className="px-2.5 py-1.5 rounded-xl bg-white text-sky-700 hover:bg-sky-600 hover:text-white transition shadow-2xs cursor-pointer flex items-center gap-1 font-bold text-xs"
                        title={`当前语速 (${speechRate}x) 朗读`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>朗读</span>
                      </button>
                      <div className="h-4 w-px bg-slate-200 mx-0.5" />
                      {([0.8, 1.0, 1.2] as const).map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSpeechRate(rate);
                            playVoice(e, currentWord.kanji || currentWord.furigana, rate);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                            speechRate === rate
                              ? 'bg-sky-600 text-white shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
                          }`}
                          title={`切换并以 ${rate}x 语速朗读`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className={`text-base sm:text-lg font-bold text-sky-700 font-mono ${
                    maskMode === 'hideJa' && !isFlipped ? 'filter blur-md' : ''
                  }`}>
                    {currentWord.furigana} <span className="text-slate-400 text-sm font-normal">({currentWord.romaji})</span>
                  </p>

                  {/* 音调心法通俗解读 */}
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium">
                    🎵 音调秘诀：{getPitchVisual(currentWord.pitch).desc}
                  </div>

                  {currentWord.tags && currentWord.tags.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                      {currentWord.tags.map(t => (
                        <span key={t} className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Masked Prompt Hint */}
                  {maskMode === 'hideJa' && !isFlipped && (
                    <p className="text-xs text-sky-600 font-bold mt-2">
                      (已遮挡日文，点击卡片翻转查看原文)
                    </p>
                  )}
                </div>

                {/* Bottom Hint */}
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-bold">
                    💡 点击翻转查看【中文释义 · 真题例句 · 自他动词 · 考点】
                  </p>
                </div>
              </div>

              {/* --- BACK OF CARD (卡片背面) --- */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/50 text-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-200/90 shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden">
                
                {/* Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                      {currentWord.kanji}
                    </span>
                    <span className="text-xs text-sky-700 font-bold font-mono">[{currentWord.furigana}]</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPitchVisual(currentWord.pitch).color}`}>
                      {getPitchVisual(currentWord.pitch).symbol} {getPitchVisual(currentWord.pitch).type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => playVoice(e, currentWord.kanji || currentWord.furigana)}
                    className="p-1.5 rounded-lg bg-sky-100/70 text-sky-600 hover:bg-sky-200 transition cursor-pointer"
                    title="朗读单词"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Center Content: Meaning & Example & Transitive Pairs */}
                <div className="space-y-3.5 my-auto">
                  {/* Meaning */}
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-sky-600 uppercase">
                      中文释义
                    </span>
                    <p className={`text-xl sm:text-2xl font-black text-slate-900 mt-0.5 ${
                      maskMode === 'hideZh' ? 'filter blur-md' : ''
                    }`}>
                      {currentWord.meaning}
                    </p>
                  </div>

                  {/* 自他动词成对焦点提示 */}
                  {TRANSITIVE_PAIRS[currentWord.kanji] && (
                    <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>自他动词成对速记 (考级必考避坑焦点)：</span>
                      </div>
                      <p className="font-medium leading-relaxed">
                        {TRANSITIVE_PAIRS[currentWord.kanji].example}
                      </p>
                    </div>
                  )}

                  {/* Example sentence */}
                  <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-sky-200/70 space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-sans">
                          {currentWord.example.ja}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {currentWord.example.furigana}
                        </p>
                      </div>
                      <button
                        onClick={(e) => playVoice(e, currentWord.example.ja)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 shrink-0 cursor-pointer transition"
                        title="朗读例句"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed pt-1.5 border-t border-slate-100 ${
                      maskMode === 'hideZh' ? 'filter blur-md' : ''
                    }`}>
                      {currentWord.example.zh}
                    </p>
                  </div>
                </div>

                {/* Bottom Mastery & Flip hint */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-bold">
                    再次点击卡片翻回正面
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentWord.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      masteredIds.includes(currentWord.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${
                      masteredIds.includes(currentWord.id) ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                    <span>{masteredIds.includes(currentWord.id) ? '已掌握' : '标记掌握'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* 底部宽大操作控制栏 (上一个 · 标记掌握 · 下一个) */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm shadow-xs transition active:scale-98 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一个</span>
            </button>

            <button
              onClick={() => toggleMastered(currentWord.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-sm shadow-xs transition active:scale-98 cursor-pointer ${
                masteredIds.includes(currentWord.id)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{masteredIds.includes(currentWord.id) ? '已攻克 · 取消掌握' : '攻克此词 · 标记掌握'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === activeVocab.length - 1}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-98 cursor-pointer"
            >
              <span>下一个</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 4. View Mode 2: 列表速查表格视图 */}
      {viewMode === 'list' && activeVocab.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-xs text-slate-600">
            <span>当前显示: {activeVocab.length} 个单词</span>
            <span>点击喇叭朗读 / 点击勾号标记已掌握</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {activeVocab.map((w, i) => {
              const isMastered = masteredIds.includes(w.id);
              return (
                <div 
                  key={w.id} 
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sky-50/40 transition ${
                    isMastered ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-6 text-xs text-slate-400 font-mono font-bold pt-2">{i + 1}</span>
                    <button
                      onClick={(e) => playVoice(e, w.kanji || w.furigana)}
                      className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition shrink-0 cursor-pointer"
                      title="朗读"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-slate-900">{w.kanji}</span>
                        <span className="text-xs font-bold text-sky-700 font-mono">[{w.furigana}]</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {w.pitch}型
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">({w.pos})</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">{w.meaning}</p>
                      <p className="text-[11px] text-slate-500">{w.example.ja} —— {w.example.zh}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={() => toggleMastered(w.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMastered ? '已掌握' : '记牢了'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. 空状态提示 */}
      {activeVocab.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">没有找到匹配的单词</h3>
          <p className="text-xs text-slate-400">请尝试切换等级或更换搜索关键词</p>
        </div>
      )}

      {/* 6. 非 VIP 学员引导横幅 */}
      {!isVip && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-sky-600/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>当前正在体验【JLPT N5 · Day 1 免费试背单元】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              完成 Day 1 体验！开通 VIP 终身卡（仅 ¥49.9），立即解锁全站 <strong>6,500+ JLPT N5~N1 全级别考纲词库</strong> 与全部分组磨耳朵连读计划！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal?.('🎉 完成 Day 1 体验！开通 VIP 终身卡（仅 ¥49.9），立即解锁全站 6,500+ JLPT 核心考纲词库与全部磨耳朵连读计划！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            <span>解锁全级别 6,500+ 词 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};

export const VocabView = JapaneseVocabView;
export default JapaneseVocabView;
