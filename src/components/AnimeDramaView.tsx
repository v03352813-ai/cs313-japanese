import React, { useState, useEffect, useRef } from 'react';
import { 
  Clapperboard, 
  Volume2, 
  Sparkles, 
  Flame, 
  Lock, 
  Mic, 
  BookOpen, 
  HelpCircle, 
  RotateCcw, 
  Layers, 
  Play, 
  Pause, 
  Film, 
  Repeat,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  List,
  LayoutGrid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  AnimeDramaScene, 
  AnimeDialogueLine,
  ANIME_DRAMA_SCENES, 
  ANIME_GENRE_CATEGORIES, 
  getAllAnimeScenes 
} from '../data/japanese/animeDrama';
import { speakJapanese, stopSpeaking } from '../utils/speech';

interface AnimeDramaViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
  initialSceneId?: string;
}

type PracticeMode = 'breakdown' | 'shadowing' | 'quiz';

export const AnimeDramaView: React.FC<AnimeDramaViewProps> = ({
  isVip,
  onOpenVipModal,
  initialSceneId
}) => {
  const [allScenes] = useState<AnimeDramaScene[]>(() => getAllAnimeScenes());
  const [selectedGenre, setSelectedGenre] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(() => {
    if (initialSceneId) return initialSceneId;
    return allScenes[0]?.id || 'anime-spirited-away-onigiri';
  });

  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('breakdown');
  const [viewMode, setViewMode] = useState<'list' | 'slider' | 'grid'>('list');
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false);

  // 轮播滑块引用
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // 问答答题状态
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // 过滤后的剧目列表
  const filteredScenes = allScenes.filter(s => {
    const matchesGenre = selectedGenre === '全部' || s.genre === selectedGenre || s.category === selectedGenre;
    const matchesSearch = !searchQuery.trim() || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.japaneseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sceneTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // 当搜索或题材切换时，重置展开状态
  useEffect(() => {
    setIsListExpanded(false);
  }, [selectedGenre, searchQuery]);

  // 当前激活的场景
  const currentScene = allScenes.find(s => s.id === selectedSceneId) || allScenes[0];

  const handleSelectScene = (sceneId: string) => {
    const target = allScenes.find(s => s.id === sceneId);
    if (!target) return;
    if (!isVip && !target.isFreePreview) {
      onOpenVipModal(`解锁《${target.title}》完整台词精析`);
      return;
    }
    setSelectedSceneId(sceneId);
    setActiveLineId(null);
    setQuizAnswers({});
    setShowQuizResult(false);
  };

  const handlePlayLine = (line: AnimeDialogueLine) => {
    setActiveLineId(line.id);
    speakJapanese(line.ja);
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. 顶部当前场景播放器舞台 */}
      {currentScene && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Header Banner */}
          <div 
            className="p-6 sm:p-8 text-white relative flex flex-col justify-between min-h-[180px] sm:min-h-[220px]"
            style={{ background: currentScene.posterBg }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs">
                  {currentScene.levelTag}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-white/90 text-xs font-semibold">
                  {currentScene.genre}
                </span>
              </div>
              <span className="text-xs text-white/80 font-mono">
                {currentScene.year}年 · {currentScene.episode}
              </span>
            </div>

            <div className="space-y-1 my-auto pt-4">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                《{currentScene.title}》
              </h1>
              <p className="text-sm sm:text-base font-semibold text-white/90 font-mono">
                {currentScene.japaneseTitle} · {currentScene.sceneTitle}
              </p>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const firstLine = currentScene.dialogues[0];
                  if (firstLine) handlePlayLine(firstLine);
                }}
                className="px-4 py-2 rounded-2xl bg-white text-slate-900 text-xs font-black flex items-center gap-1.5 hover:bg-white/90 shadow-md transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>从头听原声</span>
              </button>
            </div>
          </div>

          {/* Practice Mode Switcher (精析 / 影子跟读 / 填空) */}
          <div className="border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap bg-slate-50/50">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl">
              <button
                onClick={() => setPracticeMode('breakdown')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  practiceMode === 'breakdown'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📖 词汇语法精析
              </button>
              <button
                onClick={() => setPracticeMode('shadowing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  practiceMode === 'shadowing'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎙️ 影子跟读打卡
              </button>
              <button
                onClick={() => setPracticeMode('quiz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  practiceMode === 'quiz'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎯 原声台词挖空
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              共 {currentScene.dialogues.length} 句经典对白
            </span>
          </div>

          {/* Dialogue Lines Container */}
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* MODE 1: 台词精析 */}
            {practiceMode === 'breakdown' && (
              <div className="space-y-4">
                {currentScene.dialogues.map((line) => {
                  const isActive = activeLineId === line.id;
                  return (
                    <div
                      key={line.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 space-y-3 ${
                        isActive
                          ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-400/20 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-sky-300'
                      }`}
                    >
                      {/* Speaker & Audio Trigger */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {line.speaker} ({line.role})
                        </span>
                        <button
                          onClick={() => handlePlayLine(line)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>听原声</span>
                        </button>
                      </div>

                      {/* Japanese sentence */}
                      <div className="space-y-1">
                        <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed font-sans">
                          {line.ja}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {line.furigana}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          {line.zh}
                        </p>
                      </div>

                      {/* Highlighted Words */}
                      {line.highlightWords.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-sky-700">重点词：</span>
                          {line.highlightWords.map((hw, idx) => (
                            <span 
                              key={idx}
                              onClick={() => speakJapanese(hw.word)}
                              className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                              title="点击听词发音"
                            >
                              <span>{hw.word}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({hw.furigana})</span>
                              <span className="text-slate-500 font-normal">· {hw.meaning}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Grammar Point */}
                      {line.grammarNotes && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
                          {line.grammarNotes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* MODE 2: 影子跟读 */}
            {practiceMode === 'shadowing' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sky-800">
                    <Mic className="w-4 h-4 text-sky-600" />
                    <span>影子跟读法 (Shadowing Practice)</span>
                  </div>
                  <p>
                    点击单句发音按钮，听完后立即模仿日本声优/演员的语调、长短停顿与情绪连读进行复述，快速建立地道日语脑回路！
                  </p>
                </div>

                <div className="space-y-3">
                  {currentScene.dialogues.map((line) => (
                    <div key={line.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          {line.speaker}
                        </span>
                        <button
                          onClick={() => handlePlayLine(line)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-sky-700 transition cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 听发音示范
                        </button>
                      </div>
                      <p className="text-lg font-black text-slate-900">{line.ja}</p>
                      <p className="text-xs text-slate-400 font-mono">{line.furigana}</p>
                      <p className="text-xs text-slate-600">{line.zh}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 3: 挖空填空挑战 */}
            {practiceMode === 'quiz' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>原声名台词挖空填空挑战</span>
                  </div>
                  <p>
                    根据剧情语境，选出最符合日语文法与语境的正确词汇，巩固动词活用与核心助词！
                  </p>
                </div>

                <div className="space-y-4">
                  {currentScene.dialogues.map((line, idx) => {
                    const quiz = line.clozeQuestion;
                    if (!quiz) return null;
                    const userSelected = quizAnswers[line.id];
                    const isCorrect = userSelected === quiz.maskedWord;

                    return (
                      <div key={line.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                        <span className="text-xs font-bold text-slate-500">
                          第 {idx + 1} 题 · {line.speaker} 的名台词
                        </span>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-base font-black text-slate-900">{quiz.maskedJa}</p>
                          <p className="text-xs text-slate-500 mt-1">中文：{line.zh}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {quiz.options.map((opt, optIdx) => {
                            const isThisOpt = userSelected === opt;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setQuizAnswers(prev => ({ ...prev, [line.id]: opt }));
                                }}
                                className={`p-2.5 rounded-xl text-xs font-bold transition border text-left cursor-pointer ${
                                  isThisOpt
                                    ? showQuizResult
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                        : 'bg-rose-50 border-rose-400 text-rose-900'
                                      : 'bg-sky-600 border-sky-600 text-white'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showQuizResult && (
                          <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                            <p className="font-bold">
                              {isCorrect ? '🎉 作答正确！' : `⚠️ 正确答案：${quiz.maskedWord}`}
                            </p>
                            <p className="mt-0.5 text-slate-600">{quiz.hint}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowQuizResult(true)}
                      className="px-6 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition shadow-sm cursor-pointer"
                    >
                      提交并查看结果
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 2. 全部剧目剧场展台 (原生上下滑动列表 + 6部精选展开 + 模式切换) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        
        {/* Header & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>经典动漫与日剧剧场</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                共 {filteredScenes.length} 部经典高光
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              吉卜力·新海诚·高分日剧名台词精析，掌握核心词汇与接续语法！
            </p>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="上下滑动列表 (手机习惯，精选展示+可展开)"
              >
                <List className="w-3.5 h-3.5" />
                <span>列表</span>
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="横向滑块视图 (左右横滑，单行不占高度)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>滑块</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-sky-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="画廊卡片视图"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>卡片</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索动漫、日剧名或台词..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {ANIME_GENRE_CATEGORIES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* --- 模式 1: 原生上下滑动列表视图 (List View - 默认精选 6 部 + 一键展开) --- */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {(isListExpanded ? filteredScenes : filteredScenes.slice(0, 6)).map(s => {
              const isSelected = s.id === selectedSceneId;
              const isLocked = !isVip && !s.isFreePreview;
              const firstLine = s.dialogues[0];

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectScene(s.id)}
                  className={`group bg-white rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-400 hover:shadow-md ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20 shadow-xs'
                      : 'border-slate-200/90 shadow-2xs hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left: Thumbnail Poster */}
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div 
                      className="relative w-28 sm:w-36 md:w-44 aspect-16/10 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs flex items-center justify-center p-2 text-white font-black text-center text-xs"
                      style={{ background: s.posterBg }}
                    >
                      <span className="drop-shadow-sm line-clamp-2">《{s.title}》</span>
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>精学中</span>
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-bold border border-amber-400/40 shadow-sm flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span>VIP</span>
                        </div>
                      )}
                    </div>

                    {/* Mobile-only Header Row */}
                    <div className="sm:hidden flex-1 min-w-0 space-y-0.5">
                      <span className="font-black text-sm text-slate-900 group-hover:text-sky-600 truncate block">《{s.title}》</span>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{s.sceneTitle}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{s.japaneseTitle}</p>
                    </div>
                  </div>

                  {/* Middle: Content Info */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full sm:w-auto">
                    <div className="hidden sm:flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-sky-600 transition">
                        《{s.title}》
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {s.japaneseTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-sky-50 text-sky-700 border-sky-200">
                        {s.levelTag}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {s.category}
                      </span>
                    </div>

                    <h3 className="hidden sm:block font-bold text-sm text-slate-800 group-hover:text-sky-600 transition line-clamp-1">
                      {s.sceneTitle}
                    </h3>

                    {/* First Dialogue Preview */}
                    {firstLine && (
                      <div className="bg-slate-50/80 hover:bg-sky-50/40 p-2 sm:p-2.5 rounded-xl border border-slate-100/90 transition text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 shrink-0">
                            {firstLine.speaker}
                          </span>
                          <span className="font-semibold text-slate-800 truncate font-sans text-xs sm:text-sm">
                            “{firstLine.ja}”
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] sm:text-xs truncate pl-1">
                          {firstLine.zh}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Enter Button */}
                  <div className="shrink-0 flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>正在精学</span>
                      </div>
                    ) : isLocked ? (
                      <button className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-2xs">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>VIP 专享</span>
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-200 hover:border-sky-600 text-xs font-bold transition shadow-2xs group-hover:bg-sky-600 group-hover:text-white">
                        <span>进入精学</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Expand / Collapse Button */}
            {filteredScenes.length > 6 && (
              <div className="pt-2">
                {!isListExpanded ? (
                  <button
                    onClick={() => setIsListExpanded(true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-sky-50 hover:from-sky-100 hover:to-indigo-100 border border-sky-200 text-sky-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-2xs hover:shadow-xs group cursor-pointer"
                  >
                    <span>向下展开查看全部 {filteredScenes.length} 部经典 (剩余 {filteredScenes.length - 6} 部)</span>
                    <ChevronDown className="w-4 h-4 text-sky-600 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsListExpanded(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-2xs cursor-pointer"
                  >
                    <span>收起列表 (返回精选 6 部)</span>
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- 模式 2: 横向滑块视图 (Slider View) --- */}
        {viewMode === 'slider' && (
          <div className="space-y-3 relative">
            <div
              ref={sliderRef}
              className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 no-scrollbar select-none"
            >
              {filteredScenes.map((s) => {
                const isSelected = s.id === selectedSceneId;
                const isLocked = !isVip && !s.isFreePreview;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectScene(s.id)}
                    className={`w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl border transition-all duration-200 p-3.5 cursor-pointer flex flex-col justify-between hover:border-sky-400 hover:shadow-lg ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20'
                        : 'border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div 
                      className="w-full h-24 rounded-xl p-3 text-white flex flex-col justify-between font-black"
                      style={{ background: s.posterBg }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-md">{s.levelTag}</span>
                        {isLocked && <span className="text-[10px] bg-amber-500 px-1.5 py-0.2 rounded-md">VIP</span>}
                      </div>
                      <span className="text-sm">《{s.title}》</span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{s.sceneTitle}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{s.japaneseTitle}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">{s.dialogues.length} 句原声</span>
                      <span className="font-bold text-sky-700 flex items-center gap-0.5">
                        <span>点击精学</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 模式 3: 卡片网格视图 (Grid View) --- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredScenes.map((s) => {
              const isSelected = s.id === selectedSceneId;
              const isLocked = !isVip && !s.isFreePreview;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectScene(s.id)}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                    isSelected ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                  }`}
                >
                  <div 
                    className="w-full h-28 p-3 text-white flex flex-col justify-between font-black"
                    style={{ background: s.posterBg }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-md">{s.levelTag}</span>
                      {isLocked && <span className="text-[10px] bg-amber-500 px-1.5 py-0.2 rounded-md">VIP</span>}
                    </div>
                    <span className="text-sm">《{s.title}》</span>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="font-bold text-xs text-slate-900 line-clamp-1">{s.sceneTitle}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{s.japaneseTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

export const KDramaView = AnimeDramaView;
