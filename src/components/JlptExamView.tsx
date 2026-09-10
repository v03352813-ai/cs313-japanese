import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Volume2, 
  Lock,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  GraduationCap,
  Timer,
  Award,
  Target,
  BookOpen,
  Search,
  CheckCircle2,
  Calendar,
  Headphones,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JAPANESE_JLPT_EXAMS, JLPT_PAPER_CATEGORIES } from '../data/japanese/jlptExams';
import type { JlptExamPaper, JlptQuestion } from '../data/japanese/jlptExams';
import { speakJapanese } from '../utils/speech';
import { api } from '../services/api';

interface JlptExamViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
  onNavigateToWriting?: () => void;
}

type MainExamMode = 'marathon_full' | 'full_paper' | 'special_drill';
type LevelFilterType = 'all' | 'n1' | 'n2' | 'n3' | 'n4' | 'n5';

export const JlptExamView: React.FC<JlptExamViewProps> = ({ isVip, onOpenVipModal, onNavigateToWriting }) => {
  const [mainMode, setMainMode] = useState<MainExamMode>('marathon_full');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('jlpt-n2-2025-dec');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<LevelFilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showInstantExplanation, setShowInstantExplanation] = useState<boolean>(true);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return JAPANESE_JLPT_EXAMS.filter((paper) => {
      if (mainMode === 'marathon_full' && paper.mode !== 'marathon_full') return false;
      if (mainMode === 'full_paper' && paper.mode !== 'full_paper') return false;
      if (mainMode === 'special_drill' && paper.mode !== 'special_drill') return false;

      if (levelFilter !== 'all') {
        const lvlMap: Record<string, string> = {
          n1: 'N1',
          n2: 'N2',
          n3: 'N3',
          n4: 'N4',
          n5: 'N5'
        };
        if (!paper.level.includes(lvlMap[levelFilter])) return false;
      }

      if (selectedCategory !== '全部' && paper.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return paper.title.toLowerCase().includes(q) || paper.summary.toLowerCase().includes(q);
      }

      return true;
    });
  }, [mainMode, levelFilter, selectedCategory, searchQuery]);

  const marathonCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'marathon_full').length, []);
  const fullPaperCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'full_paper').length, []);
  const drillCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'special_drill').length, []);

  // Filtered by current mode (before level/cat/search)
  const currentModePapers = useMemo(() => {
    return JAPANESE_JLPT_EXAMS.filter(p => p.mode === mainMode);
  }, [mainMode]);

  // Level counts within current mode
  const levelCounts = useMemo(() => {
    return {
      all: currentModePapers.length,
      n1: currentModePapers.filter(p => p.level.includes('N1')).length,
      n2: currentModePapers.filter(p => p.level.includes('N2')).length,
      n3: currentModePapers.filter(p => p.level.includes('N3')).length,
      n4: currentModePapers.filter(p => p.level.includes('N4')).length,
      n5: currentModePapers.filter(p => p.level.includes('N5')).length,
    };
  }, [currentModePapers]);

  // Automatically select first paper if current selection is not in filtered list
  useEffect(() => {
    if (filteredPapers.length > 0 && !filteredPapers.some(p => p.id === selectedPaperId)) {
      setSelectedPaperId(filteredPapers[0].id);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsSubmitted(false);
    }
  }, [filteredPapers, selectedPaperId]);

  const currentPaper = useMemo(() => {
    return JAPANESE_JLPT_EXAMS.find(p => p.id === selectedPaperId) || filteredPapers[0] || JAPANESE_JLPT_EXAMS[0];
  }, [selectedPaperId, filteredPapers]);

  const currentQuestion: JlptQuestion | undefined = currentPaper?.questions[currentQuestionIndex];

  // 计算当前试卷三大官方核心板块（言语知识、读解分析、听解原声）的题量与起始位置
  const sectionTabs = useMemo(() => {
    if (!currentPaper || !currentPaper.questions || currentPaper.questions.length === 0) return [];
    
    let vocabStart = -1, vocabCount = 0;
    let readingStart = -1, readingCount = 0;
    let listeningStart = -1, listeningCount = 0;

    currentPaper.questions.forEach((q, idx) => {
      const isReading = q.questionType === '读解分析' || q.categoryTag.includes('读解');
      const isListening = q.questionType === '听解理解' || q.categoryTag.includes('听解');

      if (isReading) {
        if (readingStart === -1) readingStart = idx;
        readingCount++;
      } else if (isListening) {
        if (listeningStart === -1) listeningStart = idx;
        listeningCount++;
      } else {
        if (vocabStart === -1) vocabStart = idx;
        vocabCount++;
      }
    });

    const curQ = currentPaper.questions[currentQuestionIndex];
    const curIsReading = curQ && (curQ.questionType === '读解分析' || curQ.categoryTag.includes('读解'));
    const curIsListening = curQ && (curQ.questionType === '听解理解' || curQ.categoryTag.includes('听解'));
    const curIsVocab = curQ && !curIsReading && !curIsListening;

    const list: { key: string; name: string; icon: string; startIndex: number; count: number; isActive: boolean }[] = [];

    if (vocabCount > 0) {
      list.push({
        key: 'vocab',
        name: '言语知识 (词汇·文法)',
        icon: '🈳',
        startIndex: vocabStart,
        count: vocabCount,
        isActive: Boolean(curIsVocab)
      });
    }
    if (readingCount > 0) {
      list.push({
        key: 'reading',
        name: '读解分析 (长短篇阅读)',
        icon: '📖',
        startIndex: readingStart,
        count: readingCount,
        isActive: Boolean(curIsReading)
      });
    }
    if (listeningCount > 0) {
      list.push({
        key: 'listening',
        name: '听解原声 (场景应答)',
        icon: '🎧',
        startIndex: listeningStart,
        count: listeningCount,
        isActive: Boolean(curIsListening)
      });
    }

    return list;
  }, [currentPaper, currentQuestionIndex]);

  // Handle select option
  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  // Submit and calculate 180-point scale score
  const scoreReport = useMemo(() => {
    if (!currentPaper || !isSubmitted) return null;
    let totalScore = 0;
    let earnedScore = 0;
    let correctCount = 0;

    currentPaper.questions.forEach((q, idx) => {
      totalScore += q.score;
      if (answers[idx] === q.correctAnswer) {
        earnedScore += q.score;
        correctCount += 1;
      }
    });

    // Scaled to JLPT 180 total
    const scaledScore = totalScore > 0 ? Math.round((earnedScore / totalScore) * 180) : 0;
    
    // Pass threshold: N1: 100, N2: 90, N3: 95, N4: 90, N5: 80
    const passThreshold = currentPaper.level.includes('N1') ? 100 : currentPaper.level.includes('N3') ? 95 : currentPaper.level.includes('N5') ? 80 : 90;
    const isPassed = scaledScore >= passThreshold;

    return {
      earnedScore,
      totalScore,
      correctCount,
      totalQuestions: currentPaper.questions.length,
      scaledScore,
      isPassed,
      passThreshold
    };
  }, [currentPaper, isSubmitted, answers]);

  const handleSubmitPaper = () => {
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleResetExam = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black">
              JLPT 日本語能力試験 · 历届考期真题机考
            </span>
            <span className="text-xs text-sky-100 font-bold">
              180分官方标准评分 · 言语知识/读解/听解 · 每年7月/12月考后同步收录
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            JLPT 历届官方考期真题与全真机考系统
          </h2>
          <p className="text-xs text-sky-100 font-medium">
            全真还原官方考试作答流程，覆盖 N1~N5 历年官方 7月/12月 考期全真卷与题型专项强化，每年考后持续同步扩充！
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => handleResetExam()}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置答卷</span>
          </button>
        </div>
      </div>

      {/* 📌 官方 JLPT 考纲权威指引横幅 (消除无写作顾虑，讲透客观机考体系) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-slate-50 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-1 shrink-0 animate-pulse" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <span>JLPT 官方考纲权威说明</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold">
                100% 客观选择题 · 官方无写作
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              日本语能力测试（JLPT N1~N5）官方大纲全卷为客观四选一（机读涂卡），<strong>官方不设主观写作（作文）题型</strong>。本机考题库严格对齐官方大纲，完整覆盖<strong>【言语知识】、【文法排词★】、【读解长文分析】与【听解原声】</strong>四大核心板块。
            </p>
          </div>
        </div>

        {onNavigateToWriting && (
          <button
            onClick={onNavigateToWriting}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
          >
            <span>✍️ 前往 AI 日语写作工坊</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Mode Switcher & Level Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
        
        {/* 全真题库架构与总量导航说明 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span className="font-black text-slate-800">
              📚 全真题库总计 56+ 套
            </span>
            <span className="text-slate-500 hidden sm:inline">
              (包含 3 大实战训练模式，每届考后持续扩充，点击下方模式切换分库):
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
            <span className="text-sky-600 font-extrabold">{marathonCount}套马拉松大考</span>
            <span>+</span>
            <span className="text-sky-600 font-extrabold">{fullPaperCount}套历届冲刺</span>
            <span>+</span>
            <span className="text-sky-600 font-extrabold">{drillCount}套专项突破</span>
            <span>=</span>
            <span className="text-slate-900 font-black">全库 56+ 套</span>
          </div>
        </div>

        {/* Row 1: 3大核心考试模式分段器 (独立整排，3等分网格，大气清晰) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl">
          <button
            onClick={() => {
              setMainMode('marathon_full');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mainMode === 'marathon_full'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-sky-500" />
            <span>🏛️ 官方马拉松大考</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${mainMode === 'marathon_full' ? 'bg-sky-100 text-sky-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
              {marathonCount}套
            </span>
          </button>

          <button
            onClick={() => {
              setMainMode('full_paper');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mainMode === 'full_paper'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-sky-500" />
            <span>⚡ 历届高频冲刺卷</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${mainMode === 'full_paper' ? 'bg-sky-100 text-sky-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
              {fullPaperCount}套
            </span>
          </button>

          <button
            onClick={() => {
              setMainMode('special_drill');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mainMode === 'special_drill'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-sky-500" />
            <span>🎯 4大分类专项突破</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${mainMode === 'special_drill' ? 'bg-sky-100 text-sky-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
              {drillCount}套
            </span>
          </button>
        </div>

        {/* Row 2: 等级/题型快速筛选 (独立整排，告别挤压堆叠) */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 shrink-0">
            <span className="w-1.5 h-3.5 bg-sky-500 rounded-full" />
            <span>{mainMode === 'special_drill' ? '题型分类筛选:' : 'JLPT等级筛选:'}</span>
          </div>

          {mainMode === 'special_drill' ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {JLPT_PAPER_CATEGORIES.map((cat) => {
                const count = cat === '全部'
                  ? drillCount
                  : JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'special_drill' && p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-2xs font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat === '全部' ? '当前模式全部' : cat} ({count}套)
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'n1', 'n2', 'n3', 'n4', 'n5'] as LevelFilterType[]).map((lvl) => {
                const count = levelCounts[lvl] || 0;
                const labelMap: Record<string, string> = {
                  all: '当前模式全部',
                  n1: 'N1 (高级)',
                  n2: 'N2 (中高级)',
                  n3: 'N3 (中级)',
                  n4: 'N4 (初中级)',
                  n5: 'N5 (入门)'
                };
                const isSelected = levelFilter === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {labelMap[lvl]} ({count}套)
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Row 3: Dropdown Quick Paper Selector + Summary Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 shrink-0">
              <FileCheck2 className="w-4 h-4 text-sky-500" />
              <span>选择试卷 (当前模式 {filteredPapers.length} 套 / 全库共 56+ 套):</span>
            </div>

            <div className="relative flex-1 min-w-0 max-w-2xl">
              <select
                value={currentPaper?.id || ''}
                onChange={(e) => {
                  const targetId = e.target.value;
                  const targetPaper = JAPANESE_JLPT_EXAMS.find(p => p.id === targetId);
                  const pIdx = filteredPapers.findIndex(p => p.id === targetId);
                  const isLockedPaper = !isVip && !targetPaper?.isFreePreview && pIdx !== 0;
                  if (isLockedPaper) {
                    onOpenVipModal(`🔒《${targetPaper?.title}》为 VIP 专属真题考场！升级 VIP 终身卡（仅 ¥49.9），即可无限畅刷 56+ 套官方真题大卷（每届考后持续同步更新）！`);
                    return;
                  }
                  setSelectedPaperId(targetId);
                  handleResetExam();
                }}
                className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs sm:text-sm font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
              >
                {filteredPapers.map((p, idx) => {
                  const isFreeTrial = idx === 0 || p.isFreePreview;
                  const statusLabel = isVip || isFreeTrial ? '✓ [可作答] ' : '🔒 [VIP专属] ';
                  return (
                    <option key={p.id} value={p.id}>
                      {statusLabel}[{idx + 1}/{filteredPapers.length}] {p.yearSession} · {p.title} ({p.questions.length}题 · {p.totalTimeMinutes}分钟)
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
            <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              当前级别: {currentPaper?.level}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {currentPaper?.questions.length} 道题目 · {currentPaper?.totalTimeMinutes} 分钟
            </span>
          </div>
        </div>

        {/* Paper Selector Pills (Horizontal Scroll or Grid) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          {filteredPapers.map((paper, idx) => {
            const isPaperLocked = !isVip && !paper.isFreePreview && idx !== 0;
            const isSelected = selectedPaperId === paper.id;

            return (
              <button
                key={paper.id}
                onClick={() => {
                  if (isPaperLocked) {
                    onOpenVipModal(`🔒【${paper.title}】为 VIP 会员专享全真试卷！升级终身 VIP 即可畅刷所有 N5~N1 历年大卷！`);
                    return;
                  }
                  setSelectedPaperId(paper.id);
                  handleResetExam();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isPaperLocked ? <Lock className="w-3 h-3 text-amber-500" /> : <span className="text-sky-500 font-mono text-[10px]">#{idx + 1}</span>}
                <span className="max-w-[200px] truncate">{paper.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500">
                  {paper.level}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Exam Arena: Left Question Area + Right Answer Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 8 Cols: Question Display */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          
          {currentQuestion ? (
            <div className="space-y-5">
              {/* 三大板块快速直达 (言语知识 / 读解长文 / 听解原声) */}
              {sectionTabs.length > 1 && (
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-slate-500 pl-2 shrink-0">题型直达:</span>
                  {sectionTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setCurrentQuestionIndex(tab.startIndex)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        tab.isActive
                          ? 'bg-sky-500 text-white shadow-xs font-black'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60'
                      }`}
                      title={`直接跳转到【${tab.name}】首题`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${tab.isActive ? 'bg-white/25 text-white font-black' : 'bg-slate-100 text-slate-600'}`}>
                        {tab.count}题
                      </span>
                    </button>
                  ))}

                  {onNavigateToWriting && (
                    <button
                      onClick={onNavigateToWriting}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 shadow-2xs ml-auto cursor-pointer"
                      title="前往 AI 日文写作与原稿纸批改实验室"
                    >
                      <span>✍️</span>
                      <span>AI写作 (原稿纸/邮件)</span>
                      <ChevronRight className="w-3 h-3 text-sky-700" />
                    </button>
                  )}
                </div>
              )}

              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-sky-500 text-white font-mono text-xs font-black">
                    第 {currentQuestion.questionNumber} 题
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {currentQuestion.categoryTag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    分值: {currentQuestion.score} 分
                  </span>
                </div>

                <button
                  onClick={() => speakJapanese(currentQuestion.passage || currentQuestion.title)}
                  className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition cursor-pointer"
                  title="朗读题目"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Passage if any - 100% Authentic JLPT Reading Layout */}
              {currentQuestion.passage && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-200/80 space-y-2.5 select-text shadow-2xs relative">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>【读解分析 · 官方全真日文阅读文本材料】</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-200 shadow-2xs">
                      日文原汁原味阅读长文
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line font-serif">
                    {currentQuestion.passage}
                  </div>
                </div>
              )}

              {/* Question Title */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                {currentQuestion.title}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestionIndex] === optIdx;
                  const isCorrect = currentQuestion.correctAnswer === optIdx;
                  const showResult = isSubmitted || (showInstantExplanation && answers[currentQuestionIndex] !== undefined);

                  let optStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
                  if (isSelected) {
                    optStyle = 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs font-bold';
                  }
                  if (showResult) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition duration-150 flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${optStyle}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation */}
              {(isSubmitted || (showInstantExplanation && answers[currentQuestionIndex] !== undefined)) && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>考点深度解析</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {currentQuestion.explanation.analysis}
                  </p>

                  <div className="pt-2 border-t border-amber-200/60 space-y-1">
                    <span className="font-bold text-slate-700 block">中文参考翻译：</span>
                    <p className="text-slate-600 font-medium italic">
                      {currentQuestion.explanation.translation}
                    </p>
                  </div>

                  {currentQuestion.explanation.vocabList.length > 0 && (
                    <div className="pt-2 border-t border-amber-200/60 space-y-1">
                      <span className="font-bold text-slate-700 block">核心考点词汇：</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {currentQuestion.explanation.vocabList.map((v, i) => (
                          <div key={i} className="p-2 rounded-xl bg-white border border-amber-100 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{v.word}</span>
                            <span className="text-slate-500">{v.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              暂无试卷内容
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一题</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              {currentQuestionIndex + 1} / {currentPaper?.questions.length || 0}
            </span>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min((currentPaper?.questions.length || 1) - 1, prev + 1))}
              disabled={currentQuestionIndex === (currentPaper?.questions.length || 1) - 1}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>下一题</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Answer Sheet & Score Result */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Answer Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-500" />
                <span>答题卡</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                已答 {Object.keys(answers).length} / {currentPaper?.questions.length || 0}
              </span>
            </div>

            {/* Answer Bubbles Grid */}
            <div className="grid grid-cols-5 gap-2">
              {currentPaper?.questions.map((q, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                const isCorrect = answers[idx] === q.correctAnswer;

                let bubbleStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (isCurrent) {
                  bubbleStyle = 'ring-2 ring-sky-500 font-bold';
                }
                if (isSubmitted) {
                  bubbleStyle = isCorrect ? 'bg-emerald-500 text-white font-bold' : 'bg-rose-500 text-white font-bold';
                } else if (isAnswered) {
                  bubbleStyle = 'bg-sky-500 text-white font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center transition cursor-pointer ${bubbleStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Instant Mode Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>做完即时显示解析</span>
              <button
                onClick={() => setShowInstantExplanation(prev => !prev)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  showInstantExplanation ? 'bg-sky-500' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  showInstantExplanation ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Submit Button */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitPaper}
                className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm shadow-md shadow-sky-500/20 active:scale-98 transition cursor-pointer"
              >
                提交答卷 · 生成成绩单
              </button>
            ) : (
              <button
                onClick={handleResetExam}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                再考一次
              </button>
            )}
          </div>

          {/* Score Card when submitted */}
          {scoreReport && (
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 ${
              scoreReport.isPassed ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  JLPT 官方 180 分评级
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  scoreReport.isPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {scoreReport.isPassed ? '🎉 达到合格线' : '⚠️ 需重点补强'}
                </span>
              </div>

              <div className="text-center py-2 space-y-1">
                <p className="text-4xl font-black text-slate-900">
                  {scoreReport.scaledScore} <span className="text-sm font-normal text-slate-500">/ 180 分</span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  答对 {scoreReport.correctCount} / {scoreReport.totalQuestions} 题（合格线为 {scoreReport.passThreshold} 分）
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// 兼容别名以防外部导入断裂
export const TopikExamView = JlptExamView;
