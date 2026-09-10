import React, { useState, useMemo } from 'react';
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
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JAPANESE_JLPT_EXAMS, JLPT_PAPER_CATEGORIES } from '../data/japanese/jlptExams';
import type { JlptExamPaper, JlptQuestion } from '../data/japanese/jlptExams';
import { speakJapanese } from '../utils/speech';
import { api } from '../services/api';

interface JlptExamViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

type MainExamMode = 'marathon_full' | 'full_paper' | 'special_drill';
type LevelFilterType = 'all' | 'n1' | 'n2' | 'n3' | 'n4' | 'n5';

export const JlptExamView: React.FC<JlptExamViewProps> = ({ isVip, onOpenVipModal }) => {
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

  const currentPaper = useMemo(() => {
    return JAPANESE_JLPT_EXAMS.find(p => p.id === selectedPaperId) || JAPANESE_JLPT_EXAMS[0];
  }, [selectedPaperId]);

  const currentQuestion: JlptQuestion | undefined = currentPaper?.questions[currentQuestionIndex];

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
              JLPT 日本語能力試験 · 全真机考
            </span>
            <span className="text-xs text-sky-100 font-bold">
              180分标准评分 · 言语知识/读解/听解
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            JLPT 历届官方真题全真机考系统
          </h2>
          <p className="text-xs text-sky-100 font-medium">
            全真还原官方考试作答流程，配备答案深度解析、高频词汇表与星号排序题技巧拆解！
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

      {/* Main Mode Switcher & Level Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* 3 Main Modes */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setMainMode('marathon_full')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                mainMode === 'marathon_full'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>全真马拉松大考场</span>
            </button>
            <button
              onClick={() => setMainMode('full_paper')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                mainMode === 'full_paper'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>精选冲刺大卷</span>
            </button>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1">
            {(['all', 'n1', 'n2', 'n3', 'n4', 'n5'] as LevelFilterType[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition uppercase cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {lvl === 'all' ? '全部' : lvl}
              </button>
            ))}
          </div>

        </div>

        {/* Paper Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {filteredPapers.map((paper) => {
            const isPaperLocked = !isVip && !paper.isFreePreview;
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
                    ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isPaperLocked && <Lock className="w-3 h-3 text-amber-500" />}
                <span>{paper.title}</span>
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

              {/* Passage if any */}
              {currentQuestion.passage && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {currentQuestion.passage}
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
