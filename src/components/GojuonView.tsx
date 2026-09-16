import React, { useState, useMemo, useEffect } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Search, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw,
  Zap,
  Play,
  Layers,
  Award,
  Lock,
  Blocks,
  Puzzle,
  ChevronRight,
  ChevronLeft,
  Info,
  Type,
  LayoutGrid,
  CreditCard,
  Headphones,
  Flame,
  HelpCircle,
  Music,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SEION_ROWS, 
  DAKUON_ROWS, 
  YOUON_ROWS, 
  KanaItem,
  KanaRow
} from '../data/japanese/gojuon';
import { 
  KANA_DETAILS,
  getKanaDetailedInfo,
  CONSONANT_BLOCKS,
  VOWEL_BLOCKS,
  assembleKanaSyllable,
  PRESET_KANA_COMBOS,
  EAR_TRAINING_QUESTIONS,
  EarTrainingQuiz
} from '../data/japanese/gojuonDetailedData';
import { speakJapanese } from '../utils/speech';
import { KatakanaClinic } from './KatakanaClinic';
import { SpecialMoraPitchGuide } from './SpecialMoraPitchGuide';
import { JapaneseParticleGuide } from './JapaneseParticleGuide';

interface GojuonViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

// 4大主Tab（完全对标韩语模板：40音工坊、辨音室、拼字实验室、音变诊疗室）
export type MainTab = 'gojuon' | 'earTraining' | 'builder' | 'clinic';

// 五十音阶段分类
export type KanaStage = 'seion' | 'dakuon' | 'youon' | 'specialMora' | 'particles';

export const GojuonView: React.FC<GojuonViewProps> = ({ isVip = true, onOpenVipModal }) => {
  // 1. 主功能 Tab 状态
  const [mainTab, setMainTab] = useState<MainTab>('gojuon');

  // ==================== 1. 五十音象形工坊 状态 ====================
  const [kanaStage, setKanaStage] = useState<KanaStage>('seion');
  const [displayScript, setDisplayScript] = useState<'hiragana' | 'katakana'>('hiragana');
  // 视图模式：'flashcard' (逐字精学卡，默认推荐) | 'matrix' (紧凑点读琴键)
  const [viewMode, setViewMode] = useState<'flashcard' | 'matrix'>('flashcard');
  const [activeKanaId, setActiveKanaId] = useState<string>('a');

  // 全量清音列表 (46音)
  const seionFlatList = useMemo(() => {
    return SEION_ROWS.flatMap(r => r.items.filter((i): i is KanaItem => i !== null));
  }, []);

  // 全量浊音/半浊音列表 (25音)
  const dakuonFlatList = useMemo(() => {
    return DAKUON_ROWS.flatMap(r => r.items.filter((i): i is KanaItem => i !== null));
  }, []);

  // 全量拗音列表 (33音)
  const youonFlatList = useMemo(() => {
    return YOUON_ROWS.flatMap(group => group.items.map(item => ({
      id: item.romaji,
      hiragana: item.hiragana,
      katakana: item.katakana,
      romaji: item.romaji,
      row: group.group,
      col: item.romaji.slice(-1) + '段',
      origin: { hiragana: '假名复合组合', katakana: '片假名复合组合' },
      mnemonic: `拗音「${item.hiragana}」由辅音与缩小半拍的「ゃ/ゅ/ょ」连拼而成`,
      example: { word: item.zh.split('(')[0] || item.hiragana, hiragana: item.hiragana, zh: item.zh },
      audioText: item.audioText
    } as KanaItem)));
  }, []);

  // 当前阶段有效假名清单
  const currentStageList = useMemo(() => {
    if (kanaStage === 'seion') return seionFlatList;
    if (kanaStage === 'dakuon') return dakuonFlatList;
    if (kanaStage === 'youon') return youonFlatList;
    return [];
  }, [kanaStage, seionFlatList, dakuonFlatList, youonFlatList]);

  // 当前选中的假名
  const activeKana = useMemo(() => {
    const found = currentStageList.find(k => k.id === activeKanaId);
    return found || currentStageList[0] || seionFlatList[0];
  }, [activeKanaId, currentStageList, seionFlatList]);

  // 当前选中的假名详细音韵信息（口型、笔顺、类似拼音、3大高频词）
  const activeKanaDetails = useMemo(() => {
    if (!activeKana) return getKanaDetailedInfo('a', 'a');
    return getKanaDetailedInfo(activeKana.id, activeKana.romaji);
  }, [activeKana]);

  // 当前假名在阶段中的序号
  const currentIndex = useMemo(() => {
    const idx = currentStageList.findIndex(k => k.id === activeKana?.id);
    return idx >= 0 ? idx : 0;
  }, [currentStageList, activeKana]);

  // 切换阶段助手
  const handleSelectStage = (stage: KanaStage) => {
    setKanaStage(stage);
    if (stage === 'seion') setActiveKanaId('a');
    else if (stage === 'dakuon') setActiveKanaId('ga');
    else if (stage === 'youon') setActiveKanaId('kya');
  };

  // 上一个假名
  const handlePrevKana = () => {
    if (currentStageList.length === 0) return;
    const prevIdx = (currentIndex - 1 + currentStageList.length) % currentStageList.length;
    const prevItem = currentStageList[prevIdx];
    setActiveKanaId(prevItem.id);
    speakJapanese(prevItem.audioText);
  };

  // 下一个假名
  const handleNextKana = () => {
    if (currentStageList.length === 0) return;
    const nextIdx = (currentIndex + 1) % currentStageList.length;
    const nextItem = currentStageList[nextIdx];
    setActiveKanaId(nextItem.id);
    speakJapanese(nextItem.audioText);
  };

  // 键盘快捷键监听：左右翻页、空格朗读
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mainTab !== 'gojuon' || viewMode !== 'flashcard' || ['specialMora', 'particles'].includes(kanaStage)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevKana();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextKana();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activeKana) {
          speakJapanese(activeKana.audioText);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainTab, viewMode, kanaStage, currentIndex, currentStageList, activeKana]);

  // ==================== 2. 辨音室状态 ====================
  const [earMode, setEarMode] = useState<'pairs' | 'blind'>('pairs');
  const [selectedPairQuizIdx, setSelectedPairQuizIdx] = useState<number>(0);
  const [pairQuizResult, setPairQuizResult] = useState<{ selectedId: string; isCorrect: boolean } | null>(null);

  // 盲听测验状态
  const [blindQuestion, setBlindQuestion] = useState<{ target: KanaItem; options: KanaItem[] } | null>(null);
  const [blindResult, setBlindResult] = useState<{ selectedId: string; isCorrect: boolean } | null>(null);
  const [blindStreak, setBlindStreak] = useState<number>(0);

  // 生成盲听识假名测验
  const startNewBlindQuiz = () => {
    const allKana = seionFlatList;
    const randomTarget = allKana[Math.floor(Math.random() * allKana.length)];
    const distractors: KanaItem[] = [];
    while (distractors.length < 3) {
      const candidate = allKana[Math.floor(Math.random() * allKana.length)];
      if (candidate.id !== randomTarget.id && !distractors.some(d => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }
    const options = [randomTarget, ...distractors].sort(() => Math.random() - 0.5);
    setBlindQuestion({ target: randomTarget, options });
    setBlindResult(null);
    speakJapanese(randomTarget.audioText);
  };

  const handleSelectBlindOption = (opt: KanaItem) => {
    if (!blindQuestion || blindResult) return;
    const isCorrect = opt.id === blindQuestion.target.id;
    setBlindResult({ selectedId: opt.id, isCorrect });

    if (isCorrect) {
      setBlindStreak(prev => prev + 1);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        startNewBlindQuiz();
      }, 1200);
    } else {
      setBlindStreak(0);
    }
  };

  // ==================== 3. 假名拼读实验室状态 ====================
  const [selectedConsonant, setSelectedConsonant] = useState<string>('k');
  const [selectedVowel, setSelectedVowel] = useState<string>('a');

  // 当前拼装音节计算
  const assembledSyllable = useMemo(() => {
    return assembleKanaSyllable(selectedConsonant, selectedVowel);
  }, [selectedConsonant, selectedVowel]);

  const handleApplyPresetCombo = (combo: typeof PRESET_KANA_COMBOS[0]) => {
    setSelectedConsonant(combo.consonant);
    setSelectedVowel(combo.vowel);
    speakJapanese(combo.fullWord);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* 顶部工作台卡片 Header (完全对标韩语图2现代化模板) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* 顶部标题与动态说明 (对标图3标准 Hero Banner 规范) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                🌸 零基础音韵筑基 · 日本语教育学标准
              </span>
              <span className="text-xs text-stone-500 font-medium">
                46清音 · 25浊音 · 33拗音 · 3大特殊音拍 · 连浊与无声化铁律
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              日语五十音图与特殊音拍·语音规则工作台
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              清音·浊音·拗音假名全图 · 特殊音拍（促音/长音/拨音）节拍器 · 语流发音法则（母音无声化/连浊） · 片假名死敌诊疗！
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto shadow-2xs">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>全假名真人发音已就绪</span>
          </div>
        </div>

        {/* 4 大核心功能大Tab卡片 (Major Tabs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => setMainTab('gojuon')}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
              mainTab === 'gojuon'
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
              mainTab === 'gojuon' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              <Type className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                50音象形工坊
                {mainTab === 'gojuon' && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>}
              </div>
              <p className="text-[11px] text-slate-500 truncate">平假名/片假名逐字精学</p>
            </div>
          </button>

          <button
            onClick={() => {
              setMainTab('earTraining');
              if (!blindQuestion) startNewBlindQuiz();
            }}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer relative overflow-hidden ${
              mainTab === 'earTraining'
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="absolute top-1.5 right-1.5">
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                突破难点
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
              mainTab === 'earTraining' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                清浊/促音 辨音室
                {mainTab === 'earTraining' && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>}
              </div>
              <p className="text-[11px] text-slate-500 truncate">对立体听辨 · 盲听测验</p>
            </div>
          </button>

          <button
            onClick={() => setMainTab('builder')}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
              mainTab === 'builder'
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
              mainTab === 'builder' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              <Blocks className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                假名拼读实验室
                {mainTab === 'builder' && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>}
              </div>
              <p className="text-[11px] text-slate-500 truncate">搭积木拼读 · 键盘打字法则</p>
            </div>
          </button>

          <button
            onClick={() => setMainTab('clinic')}
            className={`p-3 rounded-2xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
              mainTab === 'clinic'
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
              mainTab === 'clinic' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                片假名与音变诊疗室
                {mainTab === 'clinic' && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>}
              </div>
              <p className="text-[11px] text-slate-500 truncate">易混死敌诊疗 · 促音长音</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 50音象形发音工坊 (沉浸单卡精学 / 紧凑矩阵点读自由切换)                  */}
      {/* ========================================================================= */}
      {mainTab === 'gojuon' && (
        <div className="space-y-5">
          
          {/* Top Control Bar: 阶段分类 + 视图模式切换 */}
          <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* 5 Stages Classification Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {[
                { id: 'seion', label: '① 清音 (46音)', hint: '核心发音基础' },
                { id: 'dakuon', label: '② 浊音·半浊 (25音)', hint: '声带震动演化' },
                { id: 'youon', label: '③ 拗音 (33音)', hint: '复合拼音组合' },
                { id: 'specialMora', label: '④ 特殊音拍·声调', hint: '促音/长音/节拍器' },
                { id: 'particles', label: '⑤ 黄金助词对决', hint: 'は/が·に/で大辨析' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSelectStage(tab.id as KanaStage)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    kanaStage === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* View Mode & Script Toggle */}
            {!['specialMora', 'particles'].includes(kanaStage) && (
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
                {/* 平假名/片假名切换 */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setDisplayScript('hiragana')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      displayScript === 'hiragana'
                        ? 'bg-white text-sky-700 shadow-2xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    平假名 (あ)
                  </button>
                  <button
                    onClick={() => setDisplayScript('katakana')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      displayScript === 'katakana'
                        ? 'bg-white text-sky-700 shadow-2xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    片假名 (ア)
                  </button>
                </div>

                {/* 视图模式切换 (逐字精学卡 vs 紧凑点读琴键) */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setViewMode('flashcard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'flashcard'
                        ? 'bg-white text-sky-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="逐字精学模式：单卡专注，带象形渊源与笔顺"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>逐字精学卡</span>
                  </button>
                  <button
                    onClick={() => setViewMode('matrix')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'matrix'
                        ? 'bg-white text-sky-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="紧凑琴键模式：一览全局五十音图，点击即发音"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>紧凑点读琴键</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =================== A. 逐字精学单卡模式 (默认推荐，韩语同款核心大展台) =================== */}
          {!['specialMora', 'particles'].includes(kanaStage) && viewMode === 'flashcard' && activeKana && (
            <div className="space-y-4">
              
              {/* Progress Indicator & Keyboard tips */}
              <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                  <span>当前进度：{currentIndex + 1} / {currentStageList.length} 音</span>
                </div>
                <span className="text-slate-400 hidden sm:inline">支持键盘 [← 左] [右 →] 翻页，[空格] 朗读</span>
              </div>

              {/* Central Focused Learning Card (左5列，右7列大卡片) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Big Character Hero */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 via-indigo-50/40 to-sky-50/50 rounded-3xl p-6 sm:p-8 border border-sky-200/60 flex flex-col items-center justify-center text-center relative shadow-xs">
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-sky-700 border border-sky-200/60 shadow-2xs">
                        {activeKana.row} · {activeKana.col}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/50">
                        {kanaStage === 'seion' ? '清音' : kanaStage === 'dakuon' ? '浊音/半浊' : '拗音'}
                      </span>
                    </div>

                    {/* Big Letter Character (平假名 & 片假名 对照显示) */}
                    <div className="my-2 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <span className="text-7xl sm:text-8xl font-black text-slate-900 tracking-tight select-none inline-block">
                          {displayScript === 'hiragana' ? activeKana.hiragana : activeKana.katakana}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-white/80 border border-sky-200/60 text-center shadow-2xs">
                        <span className="text-2xl sm:text-3xl font-black text-sky-800 block">
                          {displayScript === 'hiragana' ? activeKana.katakana : activeKana.hiragana}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          {displayScript === 'hiragana' ? '片假名' : '平假名'}
                        </span>
                      </div>
                    </div>

                    {/* Phonetic and Romaji details */}
                    <div className="flex items-center gap-2 text-sm font-black text-slate-700 mt-1">
                      <span>名称: {activeKana.hiragana}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-sky-600 font-mono">[{activeKana.romaji}]</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 font-mono text-xs">{activeKanaDetails.ipa}</span>
                    </div>

                    {/* Pinyin Hint */}
                    <div className="mt-3 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-900 text-xs font-bold border border-sky-200">
                      {activeKanaDetails.pinyinHint}
                    </div>

                    {/* Pronounce Button */}
                    <button
                      onClick={() => speakJapanese(activeKana.audioText)}
                      className="mt-4 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>听标准发音</span>
                    </button>
                  </div>

                  {/* Right Details: Origin, Mouth Shape, Stroke Order, High Freq Words */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* Origin & Mouth Shape */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 汉字起源与草楷渊源
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          平假名源自 <span className="font-bold underline text-amber-900">{activeKana.origin.hiragana}</span>
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          片假名源自 <span className="font-bold underline text-amber-900">{activeKana.origin.katakana}</span>
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                        <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-sky-500" /> 发音要领与口型
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {activeKanaDetails.mouthShape}
                        </p>
                      </div>
                    </div>

                    {/* Stroke Order & Mnemonic */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Type className="w-3.5 h-3.5 text-slate-500" /> 标准书写笔顺：
                        </span>
                        <span className="text-[11px] text-sky-600 font-bold">
                          💡 趣味口诀：{activeKana.mnemonic}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeKanaDetails.strokeOrder.map((step, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 shadow-2xs"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* High-frequency Exam Vocabulary */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" /> 高频核心例词 (点击即刻发音)：
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {activeKanaDetails.sampleWords.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => speakJapanese(item.reading || item.word)}
                            className="bg-slate-50 hover:bg-sky-50/80 hover:border-sky-300 p-3 rounded-2xl border border-slate-200/80 transition cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="text-sm font-black text-slate-800 group-hover:text-sky-700">
                                {item.word}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {item.reading} · {item.meaning}
                              </div>
                            </div>
                            <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 group-hover:border-sky-400 flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition shadow-2xs">
                              <Volume2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Bottom Navigation Buttons for Flashcard */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrevKana}
                    className="px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>上一个假名</span>
                  </button>

                  {/* Mini Jump Bar */}
                  <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-md px-2 no-scrollbar">
                    {currentStageList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveKanaId(item.id);
                          speakJapanese(item.audioText);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 ${
                          activeKana.id === item.id
                            ? 'bg-sky-600 text-white font-black shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                        }`}
                      >
                        {displayScript === 'hiragana' ? item.hiragana : item.katakana}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextKana}
                    className="px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>下一个假名</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* =================== B. 紧凑琴键矩阵模式 (Matrix View) =================== */}
          {!['specialMora', 'particles'].includes(kanaStage) && viewMode === 'matrix' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  点击任意假名即刻朗读发音，并联动更新选中状态
                </span>
                <button
                  onClick={() => setViewMode('flashcard')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>进入精学单卡深入剖析</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column labels for Seion & Dakuon */}
              {(kanaStage === 'seion' || kanaStage === 'dakuon') && (
                <div className="grid grid-cols-6 text-center text-xs font-bold text-slate-400 py-1.5 bg-slate-50/80 rounded-xl">
                  <span>行 / 段</span>
                  <span>a段</span>
                  <span>i段</span>
                  <span>u段</span>
                  <span>e段</span>
                  <span>o段</span>
                </div>
              )}

              {/* Seion Table */}
              {kanaStage === 'seion' && (
                <div className="space-y-2">
                  {SEION_ROWS.map(row => (
                    <div key={row.rowName} className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center">
                      <span className="text-[11px] font-bold text-slate-400 text-center truncate">
                        {row.rowName.split(' ')[0]}
                      </span>
                      {row.items.map((kana, idx) => {
                        if (!kana) return <div key={idx} className="h-14 rounded-2xl bg-slate-50/50" />;
                        const isSelected = activeKana?.id === kana.id;
                        return (
                          <button
                            key={kana.id}
                            onClick={() => {
                              setActiveKanaId(kana.id);
                              speakJapanese(kana.audioText);
                            }}
                            className={`h-14 sm:h-16 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center relative cursor-pointer ${
                              isSelected
                                ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30 text-sky-700 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/80 text-slate-800'
                            }`}
                          >
                            <span className="text-xl sm:text-2xl font-black">
                              {displayScript === 'hiragana' ? kana.hiragana : kana.katakana}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {kana.romaji}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Dakuon Table */}
              {kanaStage === 'dakuon' && (
                <div className="space-y-2">
                  {DAKUON_ROWS.map(row => (
                    <div key={row.rowName} className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center">
                      <span className="text-[11px] font-bold text-slate-400 text-center truncate">
                        {row.rowName.split(' ')[0]}
                      </span>
                      {row.items.map((kana, idx) => {
                        if (!kana) return <div key={idx} className="h-14 rounded-2xl bg-slate-50/50" />;
                        const isSelected = activeKana?.id === kana.id;
                        return (
                          <button
                            key={kana.id}
                            onClick={() => {
                              setActiveKanaId(kana.id);
                              speakJapanese(kana.audioText);
                            }}
                            className={`h-14 sm:h-16 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30 text-sky-700 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/80 text-slate-800'
                            }`}
                          >
                            <span className="text-xl sm:text-2xl font-black">
                              {displayScript === 'hiragana' ? kana.hiragana : kana.katakana}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {kana.romaji}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Youon Grid */}
              {kanaStage === 'youon' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {YOUON_ROWS.map(group => (
                    <div key={group.group} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-sky-700 block">
                        {group.group}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {group.items.map(item => (
                          <button
                            key={item.romaji}
                            onClick={() => {
                              setActiveKanaId(item.romaji);
                              speakJapanese(item.audioText);
                            }}
                            className={`p-2 rounded-xl border hover:shadow-xs transition text-center cursor-pointer ${
                              activeKana?.id === item.romaji
                                ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30'
                                : 'bg-white border-slate-200 hover:border-sky-400'
                            }`}
                          >
                            <span className="text-lg font-black block text-slate-800">
                              {displayScript === 'hiragana' ? item.hiragana : item.katakana}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {item.romaji}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate block mt-0.5">
                              {item.zh}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* =================== C. 特殊音拍与黄金助词嵌入 =================== */}
          {kanaStage === 'specialMora' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <SpecialMoraPitchGuide />
            </div>
          )}

          {kanaStage === 'particles' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <JapaneseParticleGuide />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 清浊/促音 辨音室 (突破初学听辨痛点 · 盲听识字挑战)                    */}
      {/* ========================================================================= */}
      {mainTab === 'earTraining' && (
        <div className="space-y-5">
          
          {/* Sub Switcher: 难点对立体听辨 vs 盲听识字冲刺 */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEarMode('pairs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  earMode === 'pairs'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🎯 难点对立体深度辨析 (清浊/促长)
              </button>
              <button
                onClick={() => {
                  setEarMode('blind');
                  if (!blindQuestion) startNewBlindQuiz();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  earMode === 'blind'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>⚡ 全假名盲听识字挑战</span>
                {blindStreak > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                    {blindStreak}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mode A: 对立体听辨 */}
          {earMode === 'pairs' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Question list pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {EAR_TRAINING_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedPairQuizIdx(idx);
                      setPairQuizResult(null);
                      speakJapanese(q.targetAudio);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedPairQuizIdx === idx
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    第 {idx + 1} 组对立
                  </button>
                ))}
              </div>

              {/* Active Pair Quiz Card */}
              {(() => {
                const currentQuiz = EAR_TRAINING_QUESTIONS[selectedPairQuizIdx];
                return (
                  <div className="bg-gradient-to-br from-sky-50/60 to-indigo-50/40 rounded-3xl p-6 sm:p-8 border border-sky-200/80 text-center space-y-6">
                    <div className="max-w-md mx-auto space-y-2">
                      <span className="text-xs font-bold text-sky-700 bg-white px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
                        {currentQuiz.title}
                      </span>
                      <p className="text-xs text-slate-500">
                        点击喇叭仔细分辨声带与气流差异，选出听到的正确选项
                      </p>
                    </div>

                    <button
                      onClick={() => speakJapanese(currentQuiz.targetAudio)}
                      className="w-20 h-20 rounded-3xl bg-sky-600 hover:bg-sky-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-600/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                      title="重听发音"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                      {currentQuiz.options.map(opt => {
                        const isSelected = pairQuizResult?.selectedId === opt.id;
                        let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 text-slate-800';

                        if (pairQuizResult) {
                          if (opt.isCorrect) btnStyle = 'bg-emerald-500 border-emerald-500 text-white font-black shadow-md';
                          else if (isSelected) btnStyle = 'bg-rose-500 border-rose-500 text-white font-black';
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              if (pairQuizResult) return;
                              setPairQuizResult({ selectedId: opt.id, isCorrect: opt.isCorrect });
                              if (opt.isCorrect) confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
                            }}
                            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${btnStyle}`}
                          >
                            <span className="text-lg font-black block">
                              {opt.text}
                            </span>
                            <span className={`text-xs block mt-1 ${pairQuizResult && (opt.isCorrect || isSelected) ? 'text-white/90' : 'text-slate-400'}`}>
                              {opt.subText}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {pairQuizResult && (
                      <div className="max-w-lg mx-auto bg-white p-4 rounded-2xl border border-slate-200 text-left space-y-2 animate-in fade-in">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>音韵解析秘诀：</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {currentQuiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>
          )}

          {/* Mode B: 盲听识字挑战 */}
          {earMode === 'blind' && blindQuestion && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-center">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
                  🎯 听音选假名
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>连对 {blindStreak} 题</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => speakJapanese(blindQuestion.target.audioText)}
                  className="w-20 h-20 rounded-3xl bg-sky-600 hover:bg-sky-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-600/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                  title="重听发音"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
                <p className="text-xs text-slate-500 font-medium">
                  点击上方喇叭重听发音，在下方 4 个候选中选出正确的假名
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                {blindQuestion.options.map(opt => {
                  const isSelected = blindResult?.selectedId === opt.id;
                  const isTarget = opt.id === blindQuestion.target.id;
                  let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 text-slate-800';

                  if (blindResult) {
                    if (isTarget) btnStyle = 'bg-emerald-500 border-emerald-500 text-white font-black shadow-md';
                    else if (isSelected) btnStyle = 'bg-rose-500 border-rose-500 text-white font-black';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectBlindOption(opt)}
                      disabled={blindResult !== null}
                      className={`p-4 rounded-2xl border text-center transition cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-3xl font-black block">
                        {displayScript === 'hiragana' ? opt.hiragana : opt.katakana}
                      </span>
                      <span className="text-xs text-slate-400 font-mono mt-1 block">
                        {opt.romaji}
                      </span>
                    </button>
                  );
                })}
              </div>

              {blindResult && (
                <div className="pt-2">
                  <p className={`text-sm font-bold ${blindResult.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {blindResult.isCorrect ? '🎉 作答正确！太棒了！' : `⚠️ 正确答案是「${blindQuestion.target.hiragana} (${blindQuestion.target.romaji})」`}
                  </p>
                  <button
                    onClick={startNewBlindQuiz}
                    className="mt-3 px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition cursor-pointer"
                  >
                    下一题 ➡️
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 假名拼读实验室 (辅音+元音搭积木 · 键盘打字法则速查)                  */}
      {/* ========================================================================= */}
      {mainTab === 'builder' && (
        <div className="space-y-5">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Blocks className="w-5 h-5 text-sky-600" />
                  <span>罗马字搭积木拼读 · 日文输入法键入测试</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  分别选择声母辅音与韵母元音，实时合成假名，直击罗马字拼打与输入法按键映射！
                </p>
              </div>
            </div>

            {/* Presets Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-600 block">
                💡 点击一键装配高频生活实词：
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_KANA_COMBOS.map((combo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPresetCombo(combo)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer flex items-center gap-1"
                  >
                    <span>{combo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Builder Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Selector: Consonants */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-bold text-sky-700 block">
                  ① 选择行/辅音声母 (Consonant):
                </span>
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {CONSONANT_BLOCKS.map(c => (
                    <button
                      key={c.key}
                      onClick={() => {
                        setSelectedConsonant(c.key);
                        const next = assembleKanaSyllable(c.key, selectedVowel);
                        if (next.exists) speakJapanese(next.hiragana);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        selectedConsonant === c.key
                          ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span className="text-xs font-black block">{c.rowName}</span>
                      <span className="text-[10px] opacity-80 font-mono block">
                        {c.romaji || '纯元音'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Selector: Vowels */}
              <div className="lg:col-span-3 space-y-2">
                <span className="text-xs font-bold text-indigo-700 block">
                  ② 选择段/元音韵母 (Vowel):
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {VOWEL_BLOCKS.map(v => (
                    <button
                      key={v.key}
                      onClick={() => {
                        setSelectedVowel(v.key);
                        const next = assembleKanaSyllable(selectedConsonant, v.key);
                        if (next.exists) speakJapanese(next.hiragana);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        selectedVowel === v.key
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span className="text-xs font-black">{v.label}</span>
                      <span className="text-[10px] opacity-80">{v.mouth}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Output: Assembled Syllable & Typing Tips */}
              <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-indigo-50/50 rounded-3xl p-6 border border-sky-200/80 text-center space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-sky-700 border border-sky-200 shadow-2xs">
                  装配结果
                </span>

                <div className="flex items-center justify-center gap-4 my-2">
                  <div>
                    <span className="text-7xl font-black text-slate-900 block">
                      {assembledSyllable.hiragana}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">平假名</span>
                  </div>
                  <div>
                    <span className="text-7xl font-black text-sky-700 block">
                      {assembledSyllable.katakana}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">片假名</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
                  <span>罗马字: <strong className="text-sky-700 font-mono text-sm">{assembledSyllable.romaji}</strong></span>
                </div>

                {/* Keyboard typing tips */}
                <div className="p-3 bg-white rounded-2xl border border-sky-200 text-left space-y-1">
                  <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1">
                    ⌨️ 日文输入法键盘按键：
                  </span>
                  <p className="text-xs text-slate-700 font-mono font-medium">
                    {assembledSyllable.typingTips}
                  </p>
                </div>

                {/* Example Word */}
                <div className="flex items-center justify-between bg-white/70 p-3 rounded-2xl border border-slate-200/70 text-left">
                  <div>
                    <span className="text-xs font-black text-slate-800 block">
                      {assembledSyllable.exampleWord}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {assembledSyllable.exampleMeaning}
                    </span>
                  </div>
                  <button
                    onClick={() => speakJapanese(assembledSyllable.hiragana)}
                    className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition cursor-pointer"
                    title="朗读拼装音节"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 片假名与音变诊疗室                                                   */}
      {/* ========================================================================= */}
      {mainTab === 'clinic' && (
        <div className="space-y-6">
          {/* 片假名死敌诊疗室 */}
          <KatakanaClinic />
        </div>
      )}

    </div>
  );
};

export const PhoneticsView = GojuonView;
