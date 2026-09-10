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
import { KOREAN_VOCAB_DATA, VOCAB_CATEGORIES, type VocabItem } from '../data/korean/vocab';
import { speakKorean } from '../utils/speech';
import { api } from '../services/api';

interface VocabViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

export const VocabView: React.FC<VocabViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TOPIK 1 (初级入门)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [maskMode, setMaskMode] = useState<'none' | 'hideZh' | 'hideKo'>('none');
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Free user safety check: non-VIP cannot access non-TOPIK 1 or Day > 1
  useEffect(() => {
    if (!isVip && (!selectedCategory.includes('TOPIK 1') || selectedDay !== 1)) {
      setSelectedCategory('TOPIK 1 (初级入门)');
      setSelectedDay(1);
    }
  }, [isVip]);

  // Mastered Words Tracker (LocalStorage + Backend Sync)
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cs313_mastered_vocabs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 初始加载云端进度
  useEffect(() => {
    api.syncStudyProgress({}).then(progress => {
      if (progress && progress.masteredVocabIds && progress.masteredVocabIds.length > 0) {
        setMasteredIds(progress.masteredVocabIds);
        localStorage.setItem('cs313_mastered_vocabs', JSON.stringify(progress.masteredVocabIds));
      }
    }).catch(() => {});
  }, []);

  // 类别与关键词筛选后的全量列表
  const categoryVocabs = useMemo(() => {
    return KOREAN_VOCAB_DATA.filter((item) => {
      const matchCat = selectedCategory === '全部' || item.category === selectedCategory || item.level === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query || 
        item.word.toLowerCase().includes(query) || 
        item.meaning.toLowerCase().includes(query) ||
        (item.hanja && item.hanja.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Day 单元切片 (每单元 30 词)
  const WORDS_PER_DAY = 30;
  const totalDays = Math.max(1, Math.ceil(categoryVocabs.length / WORDS_PER_DAY));

  const activeVocab = useMemo(() => {
    if (selectedDay === 0) return categoryVocabs; // 全部
    const start = (selectedDay - 1) * WORDS_PER_DAY;
    return categoryVocabs.slice(start, start + WORDS_PER_DAY);
  }, [categoryVocabs, selectedDay]);

  // 重置索引
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsAutoPlaying(false);
  }, [selectedCategory, searchQuery, selectedDay]);

  const currentItem: VocabItem | undefined = activeVocab[currentIndex];

  // 自动连续朗读 (Auto Play 磨耳朵)
  const autoPlayTimerRef = useRef<any>(null);
  useEffect(() => {
    if (!isAutoPlaying || activeVocab.length === 0) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    const word = activeVocab[currentIndex];
    if (word) {
      speakKorean(word.word);
    }

    autoPlayTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev >= activeVocab.length - 1) {
          setIsAutoPlaying(false);
          return 0;
        }
        return prev + 1;
      });
      setIsFlipped(false);
    }, 2800);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, currentIndex, activeVocab]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < activeVocab.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const rand = Math.floor(Math.random() * activeVocab.length);
    setCurrentIndex(rand);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const updated = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('cs313_mastered_vocabs', JSON.stringify(updated));
      api.syncStudyProgress({ masteredVocabIds: updated }).catch(() => {});
      return updated;
    });
  };

  const playVoice = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakKorean(text);
  };

  // 计算当前 Day 已掌握数量
  const dayMasteredCount = activeVocab.filter(v => masteredIds.includes(v.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 顶部轻量步骤导引条 (直观告知学习主线与词库目标) */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            02
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-black">
                学习主线 · 第 2 步
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                5,460 核心词汇 · 3D 闪卡切片记忆库
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline">
                已掌握 {masteredIds.length} / {KOREAN_VOCAB_DATA.length} 词
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              作答建议：结合真题高频考点 ➔ 分组刷词（每组 30 词）➔ 遮挡测试加强默写记忆
            </p>
          </div>
        </div>

        {/* 顶部快捷开关: 遮挡模式 + 自动连读 + 视图切换 (移动端自适应满宽) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end shrink-0 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setMaskMode('none')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${maskMode === 'none' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'}`}
              title="正常模式"
            >
              全显
            </button>
            <button
              onClick={() => setMaskMode('hideZh')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${maskMode === 'hideZh' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="遮挡中文（看韩文忆中文）"
            >
              <EyeOff className="w-3 h-3" />
              <span>遮中文</span>
            </button>
            <button
              onClick={() => setMaskMode('hideKo')}
              className={`px-2 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${maskMode === 'hideKo' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="遮挡韩文（看中文默写韩文）"
            >
              <EyeOff className="w-3 h-3" />
              <span>遮韩文</span>
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
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-orange-500" />}
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

      {/* 词库分类 + 单元下拉切换 + 快速搜索 (紧凑集成，首屏即见单词闪卡) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        
        {/* Row 1: 词库类别分段切换 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">词库分类:</span>
          {VOCAB_CATEGORIES.map((cat, idx) => {
            const isCategoryFree = idx === 0;
            const isCategoryLocked = !isVip && !isCategoryFree;

            return (
              <button
                key={cat}
                onClick={() => {
                  if (isCategoryLocked) {
                    onOpenVipModal?.(`🔒【${cat}】词库为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可解锁 5,460 全量核心考纲词库！`);
                    return;
                  }
                  setSelectedCategory(cat);
                  setSelectedDay(1);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat}</span>
                {isCategoryLocked && <Lock className="w-2.5 h-2.5 text-amber-500" />}
              </button>
            );
          })}
        </div>

        {/* Row 2: 下拉式单元切换器 + 搜索框 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>切换单元:</span>
            </span>

            <div className="relative flex-1 min-w-0 max-w-sm">
              <select
                value={selectedDay}
                onChange={(e) => {
                  const day = Number(e.target.value);
                  if (!isVip && day !== 1) {
                    onOpenVipModal?.('🔒【全单元词库】为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可畅学全部 Day 1~30 分组切片！');
                    return;
                  }
                  setSelectedDay(day);
                }}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
              >
                <option value={1}>✓ Day 1 (第 1~30 词 · 免费试背)</option>
                {Array.from({ length: totalDays - 1 }, (_, i) => i + 2).map((day) => {
                  const startWord = (day - 1) * WORDS_PER_DAY + 1;
                  const endWord = Math.min(day * WORDS_PER_DAY, categoryVocabs.length);
                  const label = isVip ? `✓ Day ${day} (第 ${startWord}~${endWord} 词)` : `🔒 Day ${day} (第 ${startWord}~${endWord} 词) [VIP]`;
                  return (
                    <option key={day} value={day}>
                      {label}
                    </option>
                  );
                })}
                {isVip && <option value={0}>🌟 全部词汇连续背 ({categoryVocabs.length} 词)</option>}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium hidden md:inline shrink-0">
              (单元进度: <strong className="text-orange-600 font-bold">{dayMasteredCount}</strong> / {activeVocab.length})
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索韩语或中文释义..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>
        </div>

      </div>

      {/* View Mode 1: Flashcard 3D Core Card */}
      {viewMode === 'flashcard' && activeVocab.length > 0 && currentItem && (
        <div className="space-y-4">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
            <span>
              当前词卡: <strong className="text-slate-900 font-black">{currentIndex + 1}</strong> / {activeVocab.length}
              {selectedDay > 0 && ` (Day ${selectedDay})`}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <RotateCw className="w-3.5 h-3.5" /> 点击卡片翻面
            </span>
          </div>

          {/* 3D Flip Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full min-h-[320px] sm:min-h-[360px] cursor-pointer perspective-1000 select-none group"
          >
            <div className={`relative w-full h-full min-h-[320px] sm:min-h-[360px] duration-500 transform-style-3d transition-transform rounded-3xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              
              {/* --- FRONT OF CARD --- */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg shadow-slate-200/50 flex flex-col justify-between backface-hidden">
                
                {/* Top Badge Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200/50">
                      {currentItem.level}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                      {currentItem.pos}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentItem.id);
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      masteredIds.includes(currentItem.id)
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-300 hover:text-slate-400 hover:bg-slate-50'
                    }`}
                    title={masteredIds.includes(currentItem.id) ? '已标记为掌握' : '标记为已掌握'}
                  >
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Center Word & Pronunciation */}
                <div className="text-center py-6 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <h2 className={`text-4xl sm:text-5xl font-black text-slate-900 tracking-tight transition-all ${
                      maskMode === 'hideKo' && !isFlipped ? 'filter blur-md' : ''
                    }`}>
                      {currentItem.word}
                    </h2>
                    <button
                      onClick={(e) => playVoice(e, currentItem.word)}
                      className="p-2.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 hover:scale-110 active:scale-95 transition shadow-xs cursor-pointer"
                      title="朗读发音"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {currentItem.hanja && (
                    <p className="text-sm font-bold text-slate-400">
                      汉字词根: {currentItem.hanja}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 tracking-wider font-mono">
                    [{currentItem.pronunciation}]
                  </p>

                  {/* Masked Prompt Hint */}
                  {maskMode === 'hideKo' && !isFlipped && (
                    <p className="text-xs text-orange-500 font-bold mt-2">
                      (已遮挡韩文，点击卡片翻转查看原文)
                    </p>
                  )}
                </div>

                {/* Bottom Hint */}
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-bold">
                    💡 点击翻转查看【中文释义 · 例句 · 记忆要点】
                  </p>
                </div>
              </div>

              {/* --- BACK OF CARD --- */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 text-slate-900 rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden">
                
                {/* Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                      {currentItem.word}
                    </span>
                    {currentItem.hanja && (
                      <span className="text-xs text-slate-500 font-bold">({currentItem.hanja})</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => playVoice(e, currentItem.word)}
                    className="p-1.5 rounded-lg bg-orange-100/70 text-orange-600 hover:bg-orange-200 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Center Content: Meaning & Example */}
                <div className="space-y-4 my-auto">
                  {/* Meaning */}
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                      中文释义
                    </span>
                    <p className={`text-xl sm:text-2xl font-black text-slate-900 mt-0.5 ${
                      maskMode === 'hideZh' ? 'filter blur-md' : ''
                    }`}>
                      {currentItem.meaning}
                    </p>
                  </div>

                  {/* Example sentence */}
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-orange-200/60 space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        {currentItem.exampleKo}
                      </p>
                      <button
                        onClick={(e) => playVoice(e, currentItem.exampleKo)}
                        className="p-1 text-slate-400 hover:text-orange-600 shrink-0 cursor-pointer"
                        title="朗读例句"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={`text-xs text-slate-600 leading-relaxed ${
                      maskMode === 'hideZh' ? 'filter blur-md' : ''
                    }`}>
                      {currentItem.exampleZh}
                    </p>
                  </div>

                  {/* Tips or Notes if available */}
                  {currentItem.tips && (
                    <div className="flex items-start gap-1.5 text-xs text-amber-800 font-medium">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>{currentItem.tips}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Mastery Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-bold">
                    再次点击卡片翻回正面
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentItem.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      masteredIds.includes(currentItem.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${
                      masteredIds.includes(currentItem.id) ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                    <span>{masteredIds.includes(currentItem.id) ? '已掌握' : '标记掌握'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Action Controls */}
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
              onClick={() => toggleMastered(currentItem.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-sm shadow-xs transition active:scale-98 cursor-pointer ${
                masteredIds.includes(currentItem.id)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{masteredIds.includes(currentItem.id) ? '已攻克 · 取消掌握' : '攻克此词 · 标记掌握'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === activeVocab.length - 1}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-98 cursor-pointer"
            >
              <span>下一个</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* View Mode 2: Table List Quick View */}
      {viewMode === 'list' && activeVocab.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-xs text-slate-600">
            <span>当前显示: {activeVocab.length} 个单词</span>
            <span>点击喇叭朗读 / 点击勾号标记已掌握</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {activeVocab.map((v, i) => {
              const isMastered = masteredIds.includes(v.id);
              return (
                <div 
                  key={v.id} 
                  className={`p-4 flex items-center justify-between gap-4 hover:bg-orange-50/40 transition ${
                    isMastered ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs text-slate-400 font-mono font-bold">{i + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">{v.word}</span>
                        {v.hanja && <span className="text-xs text-slate-400">({v.hanja})</span>}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{v.pos}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">{v.meaning}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => playVoice(e, v.word)}
                      className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                      title="朗读"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleMastered(v.id)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isMastered ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                      title={isMastered ? '已掌握' : '标记掌握'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeVocab.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">没有找到匹配的单词</h3>
          <p className="text-xs text-slate-400">请尝试切换分类或更换搜索关键词</p>
        </div>
      )}

      {/* Free User VIP Upgrade Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【Day 1 免费试背单元】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              完成 Day 1 体验！开通 VIP 终身卡（仅 ¥49.9），立即解锁全站 <strong>5,460 核心考纲词库</strong> 与全部 30 单元磨耳朵连读计划！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal?.('🎉 完成 Day 1 体验！开通 VIP 终身卡（仅 ¥49.9），立即解锁全站 5,460 核心考纲词库与全部 30 单元磨耳朵连读计划！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部 5,460 词 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};