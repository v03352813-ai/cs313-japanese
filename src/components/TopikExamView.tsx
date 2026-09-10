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
  ChevronDown,
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
  Clock,
  Zap,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KOREAN_TOPIK_EXAMS, TOPIK_PAPER_CATEGORIES } from '../data/korean/topikExams';
import type { TopikExamPaper, TopikQuestion } from '../data/korean/topikExams';
import { speakKorean } from '../utils/speech';
import { api } from '../services/api';
import { addMistakeRecord } from '../data/korean/mistakeBook';

interface TopikExamViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

type MainExamMode = 'marathon_full' | 'full_paper' | 'special_drill';
type LevelFilterType = 'all' | 'topik1' | 'topik2';

const isTopik1Paper = (level: string) => level.includes('TOPIK I') && !level.includes('TOPIK II');
const isTopik2Paper = (level: string) => level.includes('TOPIK II');

export const TopikExamView: React.FC<TopikExamViewProps> = ({ isVip, onOpenVipModal }) => {
  // 3 Distinct Core Modes
  // 'marathon_full': 官方 3小时/100分钟 全真马拉松大考场 (70~100题)
  // 'full_paper': 25~40分钟 历届高频冲刺精选大卷 (12~16题)
  // 'special_drill': 4大分类专项考点突破 (词汇语法/图表/排序/长文)
  const [mainMode, setMainMode] = useState<MainExamMode>('marathon_full');

  const [selectedPaperId, setSelectedPaperId] = useState<string>('marathon-topik2-92th');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<LevelFilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showInstantExplanation, setShowInstantExplanation] = useState<boolean>(true);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [showListeningScript, setShowListeningScript] = useState<boolean>(false);

  // Exam Countdown Timer (seconds)
  const [timeLeftSec, setTimeLeftSec] = useState<number>(180 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Filter papers based on active Main Mode, level filter, and search
  const filteredPapers = useMemo(() => {
    return KOREAN_TOPIK_EXAMS.filter(p => {
      // Mode match
      if (p.mode !== mainMode) return false;

      // Level filter match
      if (levelFilter === 'topik1' && !isTopik1Paper(p.level)) return false;
      if (levelFilter === 'topik2' && !isTopik2Paper(p.level)) return false;

      // Drill category filter match
      if (mainMode === 'special_drill' && selectedCategory !== '全部' && p.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.yearSession.toLowerCase().includes(q) || p.level.toLowerCase().includes(q);
      }

      return true;
    });
  }, [mainMode, levelFilter, selectedCategory, searchQuery]);

  // Exact paper counts for total transparency across all 56 sets
  const marathonCount = useMemo(() => KOREAN_TOPIK_EXAMS.filter(p => p.mode === 'marathon_full').length, []);
  const fullPaperCount = useMemo(() => KOREAN_TOPIK_EXAMS.filter(p => p.mode === 'full_paper').length, []);
  const drillCount = useMemo(() => KOREAN_TOPIK_EXAMS.filter(p => p.mode === 'special_drill').length, []);
  const currentModePapers = useMemo(() => KOREAN_TOPIK_EXAMS.filter(p => p.mode === mainMode), [mainMode]);
  const currentModeTopik1 = useMemo(() => currentModePapers.filter(p => isTopik1Paper(p.level)).length, [currentModePapers]);
  const currentModeTopik2 = useMemo(() => currentModePapers.filter(p => isTopik2Paper(p.level)).length, [currentModePapers]);

  // Keep selectedPaperId in sync with filtered list
  useEffect(() => {
    if (filteredPapers.length > 0 && !filteredPapers.some(p => p.id === selectedPaperId)) {
      setSelectedPaperId(filteredPapers[0].id);
    }
  }, [filteredPapers, selectedPaperId]);

  const paper: TopikExamPaper = filteredPapers.find(p => p.id === selectedPaperId) || filteredPapers[0] || KOREAN_TOPIK_EXAMS[0];
  const isLocked = !isVip && !paper.isFreePreview;
  const currentQ: TopikQuestion | undefined = paper.questions[currentQuestionIndex];

  // Reset exam on switching paper or mode
  useEffect(() => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeftSec(paper.totalTimeMinutes * 60);
    setTimerRunning(mainMode !== 'special_drill');
  }, [paper.id, mainMode]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && !isSubmitted && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, isSubmitted, timeLeftSec]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isLocked) {
      onOpenVipModal();
      return;
    }
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let earned = 0;
    let total = 0;
    paper.questions.forEach(q => {
      total += q.score;
      if (answers[q.id] === q.correctAnswer) {
        earned += q.score;
      }
    });
    const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
    
    let gradeEstimate = 'TOPIK I (1级基础)';
    if (paper.level.includes('TOPIK II')) {
      if (percentage >= 85) gradeEstimate = 'TOPIK II (6级最高精通 - 230分+)';
      else if (percentage >= 70) gradeEstimate = 'TOPIK II (5级高级 - 190分+)';
      else if (percentage >= 55) gradeEstimate = 'TOPIK II (4级中级 - 150分+)';
      else if (percentage >= 40) gradeEstimate = 'TOPIK II (3级中级 - 120分+)';
      else gradeEstimate = '暂未达标 3级 (建议重点强化基础词汇与语法)';
    } else {
      if (percentage >= 70) gradeEstimate = 'TOPIK I (2级高分通过 - 140分+)';
      else if (percentage >= 40) gradeEstimate = 'TOPIK I (1级通过 - 80分+)';
      else gradeEstimate = '暂未达标 1级';
    }

    return { earned, total, percentage, gradeEstimate };
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setTimerRunning(false);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    // 自动持久化保存答卷、得分与错题至云端 SQLite 数据库并同步至艾宾浩斯错题本
    try {
      const scoreInfo = calculateScore();
      const wrongQuestions = paper.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer);
      const wrongIds = wrongQuestions.map(q => q.id);

      // 自动归集入错题本
      wrongQuestions.forEach(wq => {
        addMistakeRecord({
          paperId: paper.id,
          paperTitle: paper.title,
          questionId: wq.id,
          questionNumber: wq.questionNumber,
          questionType: wq.questionType,
          categoryTag: wq.categoryTag,
          title: wq.title,
          passage: wq.passage,
          options: wq.options,
          correctAnswer: wq.correctAnswer,
          userAnswer: answers[wq.id],
          analysis: wq.explanation.analysis,
          vocabList: wq.explanation.vocabList || [],
          translation: wq.explanation.translation
        });
      });

      api.submitExamRecord({
        paperId: paper.id,
        paperTitle: paper.title,
        score: scoreInfo.earned,
        totalScore: scoreInfo.total,
        timeSpentSec: (paper.totalTimeMinutes * 60) - timeLeftSec,
        userAnswers: answers,
        wrongQuestionIds: wrongIds
      }).catch(() => {});
    } catch {}
  };

  const resetExam = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeftSec(paper.totalTimeMinutes * 60);
    setTimerRunning(mainMode !== 'special_drill');
  };

  const formatTimer = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const scoreResult = isSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4 animate-in fade-in duration-300">
      
      {/* --- 顶部轻量步骤导引条 (直观告知当前步骤与学习主线目标) --- */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            01
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-black">
                学习主线 · 第 1 步
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                TOPIK 56 套历届官方真题全真演练
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline">
                全库 56 套 · 现已就绪
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              全库共 56 套（初级 20套 + 中高级 36套）：20套官方马拉松全卷 + 20套历届冲刺精选 + 16套分类专项 · 错题自动归集至错题本
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {mainMode !== 'special_drill' && (
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xs font-mono font-bold text-xs">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>倒计时: {formatTimer(timeLeftSec)}</span>
            </div>
          )}

          <button
            onClick={resetExam}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="清空答题重新开始"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* --- 模式分段器 + 等级筛选 + 下拉式试卷切换器 (紧凑高集成，首屏即见考题) --- */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        
        {/* Row 1: 模式分段按钮 + 等级筛选 Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          
          {/* 3 Modes Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setMainMode('marathon_full');
                setLevelFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                mainMode === 'marathon_full'
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏛️ 官方马拉松大考</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${mainMode === 'marathon_full' ? 'bg-orange-100 text-orange-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
                {marathonCount}套 (100题)
              </span>
            </button>

            <button
              onClick={() => {
                setMainMode('full_paper');
                setLevelFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                mainMode === 'full_paper'
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡ 历届高频冲刺卷</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${mainMode === 'full_paper' ? 'bg-orange-100 text-orange-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
                {fullPaperCount}套 (16题)
              </span>
            </button>

            <button
              onClick={() => {
                setMainMode('special_drill');
                setLevelFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                mainMode === 'special_drill'
                  ? 'bg-white text-orange-600 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎯 4大分类专项突破</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${mainMode === 'special_drill' ? 'bg-orange-100 text-orange-700 font-black' : 'bg-slate-200 text-slate-600 font-bold'}`}>
                {drillCount}套 (题型)
              </span>
            </button>
          </div>

          {/* Level Filter Chips (for Marathon & Full Paper) OR Category Filter Chips (for Special Drill) */}
          {mainMode === 'special_drill' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">题型分类:</span>
              {['全部', '词汇语法专项', '图表告示专项', '逻辑排序专项', '长篇阅读专项'].map((cat) => {
                const count = cat === '全部' 
                  ? drillCount 
                  : KOREAN_TOPIK_EXAMS.filter(p => p.mode === 'special_drill' && p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white shadow-2xs font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat} ({count}套)
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">等级筛选:</span>
              <button
                onClick={() => setLevelFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  levelFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                全部 ({currentModePapers.length}套)
              </button>
              {currentModeTopik1 > 0 && (
                <button
                  onClick={() => setLevelFilter('topik1')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    levelFilter === 'topik1'
                      ? 'bg-emerald-600 text-white shadow-2xs font-black'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  🟢 初级 1~2级 ({currentModeTopik1}套)
                </button>
              )}
              {currentModeTopik2 > 0 && (
                <button
                  onClick={() => setLevelFilter('topik2')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    levelFilter === 'topik2'
                      ? 'bg-orange-500 text-white shadow-2xs font-black'
                      : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  🟠 中高级 3~6级 ({currentModeTopik2}套)
                </button>
              )}
            </div>
          )}

        </div>

        {/* Row 2: Dropdown Selector for Paper + Metadata Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 shrink-0">
              <FileCheck2 className="w-4 h-4 text-orange-500" />
              <span>选择试卷 ({filteredPapers.length}套可选):</span>
            </div>

            <div className="relative flex-1 min-w-0 max-w-2xl">
              <select
                value={paper.id}
                onChange={(e) => {
                  const targetId = e.target.value;
                  const targetPaper = KOREAN_TOPIK_EXAMS.find(p => p.id === targetId);
                  const pIdx = filteredPapers.findIndex(p => p.id === targetId);
                  const isLockedPaper = !isVip && !targetPaper?.isFreePreview && pIdx !== 0;
                  if (isLockedPaper) {
                    onOpenVipModal(`🔒《${targetPaper?.title}》为 VIP 专属真题考场！升级 VIP 终身卡（仅 ¥49.9），即可无限畅刷 56 套官方真题大卷！`);
                    return;
                  }
                  setSelectedPaperId(targetId);
                }}
                className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs sm:text-sm font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
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

          {/* Right: Active Paper Badges & Instant Analysis */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
            {mainMode === 'special_drill' && (
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">做题即时解析:</span>
                <button
                  onClick={() => setShowInstantExplanation(!showInstantExplanation)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    showInstantExplanation ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {showInstantExplanation ? '已开启' : '关闭'}
                </button>
              </div>
            )}

            <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-black border border-orange-200/60 text-xs">
              {paper.level}
            </span>
            <span className="text-slate-600 font-bold text-xs bg-slate-100 px-2 py-1 rounded-lg">
              第 {currentQuestionIndex + 1} / {paper.questions.length} 题
            </span>
          </div>
        </div>

      </div>

      {/* Locked Paper Barrier Screen for Non-VIP */}
      {!isVip && !paper.isFreePreview && filteredPapers.indexOf(paper) !== 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-orange-200 shadow-xl text-center space-y-4 max-w-xl mx-auto my-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">《{paper.title}》为 VIP 专属高分真题</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            该套试卷包含 {paper.questions.length} 道权威真题与听力录音。免费学员仅开放体验第 1 套官方试卷。升级 VIP 终身卡（仅 ¥49.9），立享全站 56 套真题大卷无限次刷题、听力录音与名师精析！
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenVipModal(`🔒《${paper.title}》为 VIP 会员专享试卷！升级 VIP 终身卡（仅 ¥49.9），即可畅刷 56 套历届真题大卷！`)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              立即升级 VIP 解锁全套真题 (¥49.9)
            </button>
            <button
              onClick={() => setSelectedPaperId(filteredPapers[0].id)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              返回免费体验卷
            </button>
          </div>
        </div>
      ) : currentQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left 8 Cols: Question Details */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md space-y-6">
            
            {/* Question Tag & Navigation (Responsive stack on mobile) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 font-extrabold text-xs">
                  第 {currentQ.questionNumber} 题 / 共 {paper.questions.length} 题
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                  {currentQ.categoryTag || currentQ.questionType}
                </span>
                <span className="text-[11px] text-slate-400">
                  [{currentQ.score}分]
                </span>
              </div>

              {/* Audio Player & Speed Controller */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Speed selector */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                  {[0.8, 1.0, 1.2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAudioSpeed(s)}
                      className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                        audioSpeed === s ? 'bg-orange-500 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => speakKorean(currentQ.passage || currentQ.title, audioSpeed)}
                  className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                  title="朗读题目韩语音频"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>朗读原音 ({audioSpeed}x)</span>
                </button>
              </div>
            </div>

            {/* Official Question Title Headline */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">
                [문항] 다음 문제를 주의 깊게 읽고 알맞은 답을 고르십시오.
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentQ.title}
              </h3>
            </div>

            {/* Reading Passage Box - 100% Authentic TOPIK Exam Layout */}
            {currentQ.passage && (
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 border-2 border-amber-200/80 text-sm sm:text-base font-medium text-slate-900 leading-loose whitespace-pre-line select-text shadow-xs relative">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200/60">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span>[지문 · 官方全真阅读文本材料]</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-200">
                    韩文原汁原味真题材料
                  </span>
                </div>
                <div className="font-serif sm:text-[15px] text-slate-900 leading-relaxed tracking-wide">
                  {currentQ.passage}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 block">
                [선택지 · 4选1单项选项]：
              </span>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const isCorrect = currentQ.correctAnswer === optIdx;
                const showFeedback = isSubmitted || (mainMode === 'special_drill' && showInstantExplanation && answers[currentQ.id] !== undefined);

                let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                if (isSelected) {
                  optionStyle = 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 font-bold';
                }
                if (showFeedback) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500 text-white border-rose-500 shadow-md font-bold';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 text-sm ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected || (showFeedback && isCorrect)
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {optIdx + 1}
                      </span>
                      <span className="font-medium">{opt}</span>
                    </div>

                    {showFeedback && (
                      <span className="shrink-0">
                        {isCorrect ? <CheckCircle className="w-5 h-5" /> : isSelected ? <XCircle className="w-5 h-5" /> : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant / Post-Submit Explanation Card */}
            {(isSubmitted || (mainMode === 'special_drill' && showInstantExplanation && answers[currentQ.id] !== undefined)) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between font-bold text-amber-900 border-b border-amber-200/60 pb-2">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>答案解析与考点拆解</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-extrabold text-[11px]">
                    正确答案: 选项 {currentQ.correctAnswer + 1}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <strong className="text-amber-950 block">💡 考点深度剖析：</strong>
                  <p className="leading-relaxed">{currentQ.explanation.analysis}</p>
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <strong className="text-amber-950 block">📖 全文中文翻译：</strong>
                  <p className="leading-relaxed text-slate-600">{currentQ.explanation.translation}</p>
                </div>

                {/* Listening Transcript (듣기 대본) Review Box */}
                {(currentQ.passage || currentQ.title.includes('듣고') || currentQ.categoryTag?.includes('听力') || currentQ.questionType?.includes('听力')) && (
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                        <span>🎧 官方听力对话录音原文大纲 (듣기 대본)</span>
                      </span>
                      <button
                        onClick={() => speakKorean(currentQ.passage || currentQ.title, audioSpeed)}
                        className="px-2 py-0.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>精听重播 ({audioSpeed}x)</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 text-slate-800 font-medium leading-relaxed font-mono text-[11px] whitespace-pre-line border border-slate-200/60">
                      {currentQ.passage || currentQ.title}
                    </div>
                  </div>
                )}

                {currentQ.explanation.vocabList && currentQ.explanation.vocabList.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <strong className="text-amber-950 block">🔑 核心考点高频词：</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQ.explanation.vocabList.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 font-mono text-[11px]">
                          <strong>{v.word}</strong>: {v.meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Question Prev/Next Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentQuestionIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一题</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {currentQuestionIndex + 1} / {paper.questions.length}
              </span>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(paper.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === paper.questions.length - 1}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentQuestionIndex === paper.questions.length - 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                }`}
              >
                <span>下一题</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right 4 Cols: Answer Sheet & Score Report */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Answer Sheet Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">
                  全真答题卡 ({paper.questions.length} 题)
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  已做 {Object.keys(answers).length}/{paper.questions.length}
                </span>
              </div>

              {/* Number Matrix */}
              <div className="grid grid-cols-5 sm:grid-cols-4 gap-1.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {paper.questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = answers[q.id] !== undefined;
                  const isCorrect = isSubmitted && answers[q.id] === q.correctAnswer;
                  const isWrong = isSubmitted && isAnswered && answers[q.id] !== q.correctAnswer;

                  let boxClass = 'bg-slate-50 text-slate-700 border-slate-200';
                  if (isAnswered) boxClass = 'bg-orange-50 text-orange-600 border-orange-300 font-bold';
                  if (isCurrent) boxClass = 'ring-2 ring-orange-500 font-black';
                  if (isSubmitted) {
                    if (isCorrect) boxClass = 'bg-emerald-500 text-white border-emerald-500 font-bold';
                    else if (isWrong) boxClass = 'bg-rose-500 text-white border-rose-500 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 rounded-lg border text-[11px] flex items-center justify-center transition font-mono ${boxClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition active:scale-98"
                >
                  交卷并生成评估报告
                </button>
              ) : (
                <button
                  onClick={resetExam}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
                >
                  重新作答本科目
                </button>
              )}
            </div>

            {/* Exam Result Report Board (When Submitted) */}
            {scoreResult && (
              <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white text-slate-900 rounded-3xl p-5 border border-amber-200/90 shadow-md space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h4 className="font-extrabold text-sm text-slate-900">
                    TOPIK 模考成绩评估单
                  </h4>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-amber-100 space-y-1 shadow-2xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">得分/总分:</span>
                    <span className="text-xl font-black text-orange-600 font-mono">
                      {scoreResult.earned} / {scoreResult.total} 分
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">正确率:</span>
                    <span className="font-bold text-emerald-600">{scoreResult.percentage}%</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-100/60 border border-amber-200 rounded-2xl space-y-1">
                  <span className="text-[11px] text-amber-900 font-bold block">📊 官方预估等级：</span>
                  <p className="text-sm font-black text-amber-800">{scoreResult.gradeEstimate}</p>
                </div>

                {/* Free User VIP Upgrade Card */}
                {!isVip && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white space-y-2 shadow-lg shadow-orange-500/25">
                    <div className="flex items-center gap-1.5 text-xs font-black">
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>首套诊断完成！开启考前冲刺</span>
                    </div>
                    <p className="text-[11px] text-white/90 leading-relaxed">
                      开通 VIP 终身卡（仅 ¥49.9），立即解锁剩余 <strong>55 套</strong> 历年全真押题大卷、听力录音大纲 (듣기 대본) 及艾宾浩斯错题重练！
                    </p>
                    <button
                      onClick={() => onOpenVipModal('🏆 您已完成免费体验卷评测！升级 VIP 终身卡（仅 ¥49.9），即可畅刷全部 56 套历届真题大卷、听力录音与名师深度拆解！')}
                      className="w-full py-2 bg-white text-orange-700 hover:bg-orange-50 font-black rounded-xl text-xs shadow-xs transition active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>立即解锁 55 套考前真题 (¥49.9)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      ) : null}

    </div>
  );
};
