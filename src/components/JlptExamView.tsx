import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Volume2, 
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

type MainExamMode = 'marathon_full' | 'full_paper' | 'special_drill' | 'all_papers';
type LevelFilterType = 'all' | 'n1' | 'n2' | 'n3' | 'n4' | 'n5';

export const JlptExamView: React.FC<JlptExamViewProps> = ({ isVip, onOpenVipModal, onNavigateToWriting }) => {
  const [mainMode, setMainMode] = useState<MainExamMode>('marathon_full');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('marathon-jlpt-n1-2025-12');
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
      if (mainMode !== 'all_papers' && paper.mode !== mainMode) return false;

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

  const totalCount = useMemo(() => JAPANESE_JLPT_EXAMS.length, []);
  const marathonCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'marathon_full').length, []);
  const fullPaperCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'full_paper').length, []);
  const drillCount = useMemo(() => JAPANESE_JLPT_EXAMS.filter(p => p.mode === 'special_drill').length, []);

  // Filtered by current mode (before level/cat/search)
  const currentModePapers = useMemo(() => {
    if (mainMode === 'all_papers') return JAPANESE_JLPT_EXAMS;
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

  // Submit and calculate 180-point scale score with official JLPT section benchmarks
  const scoreReport = useMemo(() => {
    if (!currentPaper || !isSubmitted) return null;
    let totalScore = 0;
    let earnedScore = 0;
    let correctCount = 0;

    let vocabTotal = 0, vocabEarned = 0, vocabCorrect = 0, vocabCount = 0;
    let readingTotal = 0, readingEarned = 0, readingCorrect = 0, readingCount = 0;
    let listeningTotal = 0, listeningEarned = 0, listeningCorrect = 0, listeningCount = 0;

    currentPaper.questions.forEach((q, idx) => {
      totalScore += q.score;
      const isCorrect = answers[idx] === q.correctAnswer;
      if (isCorrect) {
        earnedScore += q.score;
        correctCount += 1;
      }

      const isReading = q.questionType === '读解分析' || q.categoryTag.includes('读解');
      const isListening = q.questionType === '听解理解' || q.categoryTag.includes('听解');

      if (isReading) {
        readingTotal += q.score;
        readingCount += 1;
        if (isCorrect) {
          readingEarned += q.score;
          readingCorrect += 1;
        }
      } else if (isListening) {
        listeningTotal += q.score;
        listeningCount += 1;
        if (isCorrect) {
          listeningEarned += q.score;
          listeningCorrect += 1;
        }
      } else {
        vocabTotal += q.score;
        vocabCount += 1;
        if (isCorrect) {
          vocabEarned += q.score;
          vocabCorrect += 1;
        }
      }
    });

    const isMultiSectionPaper = (vocabCount > 0 ? 1 : 0) + (readingCount > 0 ? 1 : 0) + (listeningCount > 0 ? 1 : 0) > 1;

    let scaledVocab = 0;
    let scaledReading = 0;
    let scaledListening = 0;
    let scaledScore = 0;

    if (isMultiSectionPaper) {
      scaledVocab = vocabTotal > 0 ? Math.round((vocabEarned / vocabTotal) * 60) : 0;
      scaledReading = readingTotal > 0 ? Math.round((readingEarned / readingTotal) * 60) : 0;
      scaledListening = listeningTotal > 0 ? Math.round((listeningEarned / listeningTotal) * 60) : 0;
      scaledScore = scaledVocab + scaledReading + scaledListening;
    } else {
      scaledScore = totalScore > 0 ? Math.round((earnedScore / totalScore) * 180) : 0;
      if (vocabCount > 0) scaledVocab = Math.round(scaledScore / 3);
      if (readingCount > 0) scaledReading = Math.round(scaledScore / 3);
      if (listeningCount > 0) scaledListening = Math.round(scaledScore / 3);
    }
    
    // Official JLPT passing score: N1: 100, N2: 90, N3: 95, N4: 90, N5: 80
    const passThreshold = currentPaper.level.includes('N1') ? 100 : currentPaper.level.includes('N3') ? 95 : currentPaper.level.includes('N5') ? 80 : 90;
    
    // Official JLPT section passing threshold: each section must be >= 19 (for N1~N3)
    const vocabPass = vocabTotal === 0 || scaledVocab >= 19;
    const readingPass = readingTotal === 0 || scaledReading >= 19;
    const listeningPass = listeningTotal === 0 || scaledListening >= 19;
    const allSectionsPass = vocabPass && readingPass && listeningPass;

    const isTotalScorePass = scaledScore >= passThreshold;
    const isPassed = isMultiSectionPaper ? (isTotalScorePass && allSectionsPass) : isTotalScorePass;

    let verdictType: 'pass' | 'section_fail' | 'total_fail' = 'total_fail';
    let failReason = '';

    if (isPassed) {
      verdictType = 'pass';
    } else if (isTotalScorePass && !allSectionsPass) {
      verdictType = 'section_fail';
      const failedNames: string[] = [];
      if (!vocabPass) failedNames.push(`言语知识(${scaledVocab}分)`);
      if (!readingPass) failedNames.push(`读解(${scaledReading}分)`);
      if (!listeningPass) failedNames.push(`听解(${scaledListening}分)`);
      failReason = `总分已达到 ${scaledScore} 分，但【${failedNames.join('、')}】未达到单项 19 分基准点，触发 JLPT 官方单科否决制！`;
    } else {
      verdictType = 'total_fail';
      failReason = `总分 ${scaledScore} 分未达到本级别合格线（${passThreshold} 分），仍需巩固拔高！`;
    }

    return {
      earnedScore,
      totalScore,
      correctCount,
      totalQuestions: currentPaper.questions.length,
      scaledScore,
      isPassed,
      passThreshold,
      isMultiSectionPaper,
      verdictType,
      failReason,
      vocab: { score: scaledVocab, earned: vocabEarned, total: vocabTotal, count: vocabCount, correct: vocabCorrect, pass: vocabPass },
      reading: { score: scaledReading, earned: readingEarned, total: readingTotal, count: readingCount, correct: readingCorrect, pass: readingPass },
      listening: { score: scaledListening, earned: listeningEarned, total: listeningTotal, count: listeningCount, correct: listeningCorrect, pass: listeningPass }
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
      
      {/* Top Hero Banner (Clean white card style aligned with Image 3) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              🏛️ 官方全真考场
            </span>
            <span className="text-xs text-slate-400 font-medium">
              180分官方标准评分 · 言语知识/读解/听解 · 每年7月/12月考后同步收录
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JLPT 历届官方考期真题与全真机考系统
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            全真还原官方考试作答流程，覆盖 N1~N5 历年官方 7月/12月 考期全真卷与题型专项强化，每年考后持续同步扩充！
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleResetExam()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
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

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => {
              setMainMode('special_drill');
              setSelectedCategory('全部');
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
          >
            <span>🎯 刷四大核心题型专项</span>
          </button>
          {onNavigateToWriting && (
            <button
              onClick={onNavigateToWriting}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shrink-0 flex items-center justify-center gap-1 border border-slate-200 transition cursor-pointer"
              title="JLPT官方无写作，此工坊专为EJU留考/商务邮件设计"
            >
              <span>✍️ 选修: 留考/商务写作</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Switcher & Level Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
        
        {/* 全真题库架构与总量导航说明 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span className="font-black text-slate-800">
              📚 JLPT 官方历届考期真题与全真机考题库
            </span>
            <span className="text-slate-500 hidden sm:inline">
              (覆盖 N1~N5 五大等级，每年 7月 / 12月 考后持续同步更新收录):
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
            <span className="text-emerald-600 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              每年 7月 / 12月 考后官方考期同步入库
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sky-600 font-extrabold">官方考期真题 · 考前冲刺 · 专项突破 · 每年考后同步更新</span>
          </div>
        </div>

        {/* Row 1: 4大核心考试模式分段器 (独立整排，4等分网格，大气清晰) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-slate-100/90 rounded-2xl">
          <button
            onClick={() => {
              setMainMode('marathon_full');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mainMode === 'marathon_full'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">🏛️ 官方考期全真卷</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${mainMode === 'marathon_full' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-600'}`}>
              {marathonCount}套大考
            </span>
          </button>

          <button
            onClick={() => {
              setMainMode('full_paper');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mainMode === 'full_paper'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">⚡ 考前高频精选卷</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${mainMode === 'full_paper' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-600'}`}>
              {fullPaperCount}套冲刺
            </span>
          </button>

          <button
            onClick={() => {
              setMainMode('special_drill');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mainMode === 'special_drill'
                ? 'bg-white text-sky-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">🎯 四大题型专项</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${mainMode === 'special_drill' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-600'}`}>
              {drillCount}套突破
            </span>
          </button>

          <button
            onClick={() => {
              setMainMode('all_papers');
              setLevelFilter('all');
              setSelectedCategory('全部');
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mainMode === 'all_papers'
                ? 'bg-white text-indigo-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">🌟 全部真题综合库</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${mainMode === 'all_papers' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
              全{totalCount}套
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
                    {cat === '全部' ? '全部题型' : cat}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'n1', 'n2', 'n3', 'n4', 'n5'] as LevelFilterType[]).map((lvl) => {
                const labelMap: Record<string, string> = {
                  all: `全部级别 (${levelCounts.all})`,
                  n1: `N1 (${levelCounts.n1})`,
                  n2: `N2 (${levelCounts.n2})`,
                  n3: `N3 (${levelCounts.n3})`,
                  n4: `N4 (${levelCounts.n4})`,
                  n5: `N5 (${levelCounts.n5})`
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
                    {labelMap[lvl]}
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
              <span>
                选择作答试卷
                {mainMode === 'marathon_full' && ` (官方历届全真大卷 · 共 ${filteredPapers.length} 套):`}
                {mainMode === 'full_paper' && ` (考前高频冲刺卷 · 共 ${filteredPapers.length} 套):`}
                {mainMode === 'special_drill' && ` (题型专项突破卷 · 共 ${filteredPapers.length} 套):`}
                {mainMode === 'all_papers' && ` (真题题库全量汇总 · 共 ${filteredPapers.length} 套):`}
              </span>
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
                    onOpenVipModal(`🔒《${targetPaper?.title}》为 VIP 专属真题考场！升级 VIP 终身卡（仅 ¥49.9），即可无限畅刷 JLPT 历届官方考期真题大卷与四大题型专项突破（每年7月/12月考后持续同步更新）！`);
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
            <div className={`rounded-3xl p-5 border shadow-sm space-y-4 ${
              scoreReport.verdictType === 'pass'
                ? 'bg-emerald-50/80 border-emerald-300'
                : scoreReport.verdictType === 'section_fail'
                ? 'bg-amber-50/80 border-amber-300'
                : 'bg-rose-50/80 border-rose-300'
            }`}>
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>JLPT 官方 180 分成绩单</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  scoreReport.verdictType === 'pass'
                    ? 'bg-emerald-600 text-white'
                    : scoreReport.verdictType === 'section_fail'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  {scoreReport.verdictType === 'pass'
                    ? '🎉 官方判定：合格 (Pass)'
                    : scoreReport.verdictType === 'section_fail'
                    ? '⚠️ 单科否决 (单项未过线)'
                    : '❌ 官方判定：未合格'}
                </span>
              </div>

              {/* Total Score */}
              <div className="text-center py-2 space-y-1 bg-white/70 rounded-2xl p-3 border border-slate-100">
                <p className="text-4xl font-black text-slate-900">
                  {scoreReport.scaledScore} <span className="text-sm font-normal text-slate-500">/ 180 分</span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  答对 {scoreReport.correctCount} / {scoreReport.totalQuestions} 题 · 本级别合格线为 <strong className="text-slate-800">{scoreReport.passThreshold} 分</strong>
                </p>
              </div>

              {/* 3-Section Breakdown (Authentic JLPT Structure) */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-black text-slate-700 flex items-center justify-between">
                  <span>三大官方得分区分 (满分各60分)</span>
                  <span className="text-[10px] text-slate-500">单项基准点: ≥19分</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {/* 言语知识 */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🈳</span>
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">言語知識 (文字·語彙·文法)</div>
                        <div className="text-[10px] text-slate-400 font-mono">答对 {scoreReport.vocab.correct}/{scoreReport.vocab.count} 题</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">{scoreReport.vocab.score}</span>
                      <span className="text-[10px] text-slate-400">/60分</span>
                      <div className={`text-[10px] font-bold ${scoreReport.vocab.pass ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {scoreReport.vocab.pass ? '✓ 达标(≥19)' : '✗ 未达标(<19)'}
                      </div>
                    </div>
                  </div>

                  {/* 读解 */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">📖</span>
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">読解 (长中短篇阅读)</div>
                        <div className="text-[10px] text-slate-400 font-mono">答对 {scoreReport.reading.correct}/{scoreReport.reading.count} 题</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">{scoreReport.reading.score}</span>
                      <span className="text-[10px] text-slate-400">/60分</span>
                      <div className={`text-[10px] font-bold ${scoreReport.reading.pass ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {scoreReport.reading.pass ? '✓ 达标(≥19)' : '✗ 未达标(<19)'}
                      </div>
                    </div>
                  </div>

                  {/* 听解 */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🎧</span>
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">聴解 (原声场景听力)</div>
                        <div className="text-[10px] text-slate-400 font-mono">答对 {scoreReport.listening.correct}/{scoreReport.listening.count} 题</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">{scoreReport.listening.score}</span>
                      <span className="text-[10px] text-slate-400">/60分</span>
                      <div className={`text-[10px] font-bold ${scoreReport.listening.pass ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {scoreReport.listening.pass ? '✓ 达标(≥19)' : '✗ 未达标(<19)'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis Alert */}
              <div className="pt-2 border-t border-slate-200/60 text-xs">
                {scoreReport.verdictType === 'pass' ? (
                  <p className="text-emerald-800 font-medium leading-relaxed">
                    🌟 <strong>恭喜合格！</strong>您的总分与三大单项均已达到 JLPT 日本官方合格标准，具备冲击更高等级的扎实实力！
                  </p>
                ) : (
                  <p className={`${scoreReport.verdictType === 'section_fail' ? 'text-amber-900' : 'text-rose-800'} font-medium leading-relaxed`}>
                    📌 <strong>官方诊断：</strong>{scoreReport.failReason}
                  </p>
                )}
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed bg-white/50 p-2 rounded-lg">
                  ℹ️ <strong>JLPT 官方合格规则提示：</strong>总分达到及格线且言语知识、读解、听解三大板块得分各自<strong>均须 ≥19分</strong>。单项低于 19 分无论总分多高均判定不合格。
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
