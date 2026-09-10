import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Volume2, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  Sparkles, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  List,
  Lock,
  Flame,
  Bookmark
} from 'lucide-react';
import { 
  JLPT_CORE_VOCABULARY, 
  JLPT_LEVEL_LABELS, 
  JlptLevel, 
  JlptWord 
} from '../data/japanese/jlptVocab';
import { speakJapanese } from '../utils/speech';

interface JapaneseVocabViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

export const JapaneseVocabView: React.FC<JapaneseVocabViewProps> = ({ isVip = false, onOpenVipModal }) => {
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel>('N5');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cs313_jp_mastered_vocabs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const filteredWords = useMemo(() => {
    return JLPT_CORE_VOCABULARY.filter(w => {
      const matchesLevel = w.level === selectedLevel;
      const matchesSearch = !searchQuery.trim() || 
        w.kanji.includes(searchQuery) ||
        w.furigana.includes(searchQuery) ||
        w.meaning.includes(searchQuery);
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchQuery]);

  const currentWord: JlptWord | undefined = filteredWords[currentIndex] || filteredWords[0];

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('cs313_jp_mastered_vocabs', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Header & Level Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              📚 JLPT 分级大词库
            </span>
            <span className="text-xs text-slate-400 font-medium">
              6,500+ 考纲词汇 · 音调高低核标号 · iPad 闪卡刷词
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JLPT 核心词汇记忆库
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            按 N5~N1 科学梯队记忆，标注日本原版高低核音调，告别中式哑巴日语！
          </p>
        </div>

        {/* Search & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('flashcard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'flashcard' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              闪卡模式
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              列表速览
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
              placeholder="搜索汉字、假名或释义..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 2. JLPT Level Switcher (N5 -> N1) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => {
          const isSelected = selectedLevel === lvl;
          const meta = JLPT_LEVEL_LABELS[lvl];
          return (
            <button
              key={lvl}
              onClick={() => {
                if (!isVip && lvl !== 'N5') {
                  if (onOpenVipModal) onOpenVipModal(`解锁 ${lvl} 完整核心词库`);
                  return;
                }
                setSelectedLevel(lvl);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-sky-200'
              }`}
            >
              {!isVip && lvl !== 'N5' && (
                <div className="absolute top-2 right-2 text-amber-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
              <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${meta.badgeClass}`}>
                {lvl}
              </span>
              <p className="font-bold text-slate-900 text-xs mt-1.5">{meta.label}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{meta.desc}</p>
            </button>
          );
        })}
      </div>

      {/* 3. Flashcard Mode */}
      {viewMode === 'flashcard' && currentWord && (
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span>{selectedLevel} 词库 · 第 {currentIndex + 1} / {filteredWords.length} 词</span>
            <span className="text-emerald-600">已掌握: {masteredIds.filter(id => filteredWords.some(w => w.id === id)).length} 词</span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 flex flex-col justify-between cursor-pointer hover:border-sky-300 transition-all select-none relative"
          >
            {/* Top Row: Tags & Audio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {currentWord.pos}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  音调核: {currentWord.pitch}型
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakJapanese(currentWord.kanji || currentWord.furigana);
                }}
                className="p-2.5 rounded-2xl bg-sky-600 text-white hover:bg-sky-700 shadow-xs transition cursor-pointer"
                title="发音"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Middle: Word & Furigana */}
            <div className="text-center space-y-2 my-auto py-6">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                {currentWord.kanji}
              </h2>
              <p className="text-base sm:text-lg font-bold text-sky-700 font-mono">
                {currentWord.furigana} ({currentWord.romaji})
              </p>

              {/* Flipped content: Meaning & Example */}
              {isFlipped ? (
                <div className="pt-4 space-y-3 border-t border-slate-100 animate-in fade-in">
                  <p className="text-lg font-black text-slate-900">
                    {currentWord.meaning}
                  </p>
                  <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 text-left">
                    <p className="font-bold text-slate-800">{currentWord.example.ja}</p>
                    <p className="text-slate-400 font-mono text-[11px]">{currentWord.example.furigana}</p>
                    <p className="text-slate-600">{currentWord.example.zh}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-3">
                  💡 点击卡片翻转查看中文释义与真题例句
                </p>
              )}
            </div>

            {/* Bottom Row: Mastered toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentWord.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  masteredIds.includes(currentWord.id)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{masteredIds.includes(currentWord.id) ? '已掌握' : '标为已掌握'}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                {isFlipped ? '再点一下收起' : '翻面看解析'}
              </span>
            </div>
          </div>

          {/* Next / Prev Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一个</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= filteredWords.length - 1}
              className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition shadow-md shadow-sky-600/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>下一个</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 4. List View Mode */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => speakJapanese(word.kanji || word.furigana)}
                  className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition shrink-0 cursor-pointer"
                  title="发音"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-black text-slate-900">{word.kanji}</span>
                    <span className="text-xs font-bold text-sky-700 font-mono">[{word.furigana}]</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {word.pitch}型
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">({word.pos})</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{word.meaning}</p>
                  <p className="text-[11px] text-slate-500">{word.example.ja} —— {word.example.zh}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                <button
                  onClick={() => toggleMastered(word.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    masteredIds.includes(word.id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{masteredIds.includes(word.id) ? '已掌握' : '记牢了'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export const VocabView = JapaneseVocabView;
