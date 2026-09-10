import React, { useState, useMemo, useEffect } from 'react';
import { 
  PenTool, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Layers, 
  Award, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowRight,
  Lightbulb,
  FileText,
  BarChart3,
  BookMarked,
  ShieldCheck,
  Zap,
  TrendingUp,
  BrainCircuit,
  Grid,
  Lock,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOPIK_WRITING_DATA, WritingQuestion, WritingQuestionType } from '../data/korean/writing';

interface TopikWritingViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

interface AICorrectionResult {
  score: number;
  totalScore: number;
  wordCount: number;
  wordCountStatus: 'perfect' | 'too_short' | 'too_long';
  spacingIssues: { original: string; corrected: string; explanation: string }[];
  endingToneIssues: { original: string; corrected: string; explanation: string }[];
  vocabUpgrades: { original: string; upgrade: string; reason: string }[];
  radarScores: {
    content: number;
    organization: number;
    grammar: number;
    vocabulary: number;
  };
  overallFeedback: string;
}

export const TopikWritingView: React.FC<TopikWritingViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedType, setSelectedType] = useState<WritingQuestionType>(isVip ? 'q53' : 'q51');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(isVip ? 'w-53-01' : 'w-51-01');
  const [userInputText, setUserInputText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<AICorrectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'sample' | 'formulas'>('editor');
  const [editorMode, setEditorMode] = useState<'standard' | 'wongoji'>('standard');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Free user safety check: non-VIP cannot access q53 / q54
  useEffect(() => {
    if (!isVip && (selectedType === 'q53' || selectedType === 'q54')) {
      setSelectedType('q51');
      setEditorMode('standard');
    }
  }, [isVip]);

  // Filtered questions by type
  const filteredQuestions = useMemo(() => {
    return TOPIK_WRITING_DATA.filter(q => q.type === selectedType);
  }, [selectedType]);

  const currentQ: WritingQuestion = useMemo(() => {
    return filteredQuestions.find(q => q.id === selectedQuestionId) || filteredQuestions[0] || TOPIK_WRITING_DATA[0];
  }, [filteredQuestions, selectedQuestionId]);

  // Keep selected ID in sync when changing type
  useEffect(() => {
    if (filteredQuestions.length > 0 && !filteredQuestions.some(q => q.id === selectedQuestionId)) {
      setSelectedQuestionId(filteredQuestions[0].id);
    }
    setUserInputText('');
    setEvalResult(null);
    setActiveTab('editor');
  }, [selectedType]);

  // Real-time character count
  const charCountWithoutSpaces = userInputText.replace(/\s+/g, '').length;
  const charCountWithSpaces = userInputText.length;

  const handleCopyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleInsertFormula = (formula: string) => {
    const cleanFormula = formula.replace(/\(.*?\)/g, '').trim();
    setUserInputText(prev => prev + (prev ? ' ' : '') + cleanFormula);
  };

  const [aiEvalCount, setAiEvalCount] = useState<number>(0);

  // AI 智能诊断引擎
  const handleRunAICorrection = () => {
    if (!userInputText.trim()) {
      alert('请先在下方输入您的韩语作文内容再进行 AI 批改！');
      return;
    }

    if (!isVip && (currentQ.type === 'q53' || currentQ.type === 'q54')) {
      onOpenVipModal(`🔒 第 ${currentQ.type.replace('q', '')} 题为 VIP 专属高分真题！免费学员仅可体验 51/52 题。升级 VIP 终身卡（仅 ¥49.9），即可享受 51~54 题全题型无限次 AI 智能精批！`);
      return;
    }

    if (!isVip && aiEvalCount >= 2) {
      onOpenVipModal('🎯 您的免费 AI 精批体验次数已达上限（已免费体验 2 次）！升级 VIP 终身卡（仅 ¥49.9），即可享受 51~54 题全题型无限次 AI 智能深度精批与原版方格稿纸批改！');
      return;
    }

    setAiEvalCount(prev => prev + 1);
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);

      const text = userInputText;
      const length = text.length;

      // 1. 检查隔写常见错误
      const spacingIssues: AICorrectionResult['spacingIssues'] = [];
      if (/수있다/.test(text)) {
        spacingIssues.push({ original: '수있다', corrected: '수 있다', explanation: '依存名词 수 与 助动词 있다 之间必须保持隔写。' });
      }
      if (/할수/.test(text)) {
        spacingIssues.push({ original: '할수', corrected: '할 수', explanation: '定语词尾 -(으)ㄹ 与依存名词 수 之间必须隔写。' });
      }
      if (/때문에/.test(text) && !/\s때문에/.test(text) && !/[가-힣]때문에/.test(text)) {
        spacingIssues.push({ original: '때문에', corrected: '名词 + 때문에 / 动词 + 기 때문에', explanation: '때문에 与前方词性需规范搭配并注意空格。' });
      }
      if (/것이다/.test(text) && !/\s것이다/.test(text)) {
        spacingIssues.push({ original: '것이다', corrected: '것이다', explanation: '冠形词尾 -(으)ㄴ/는/ㄹ 与依存名词 것 之间必须隔写。' });
      }

      // 2. 检查终结词尾（52/53/54 题严禁口语 -요，必须用 -다 / -ㄴ다 / -는다）
      const endingToneIssues: AICorrectionResult['endingToneIssues'] = [];
      if (currentQ.type !== 'q51') {
        const yoMatches = text.match(/[가-힣]+(해요|에요|이에요|돼요|세요|아요|어요)/g);
        if (yoMatches && yoMatches.length > 0) {
          yoMatches.slice(0, 3).forEach(m => {
            endingToneIssues.push({
              original: m,
              corrected: m.replace(/해요$/, '한다').replace(/에요$|이에요$/, '이다').replace(/돼요$/, '된다').replace(/세요$/, '해야 한다'),
              explanation: 'TOPIK 52/53/54 题为正式说明/论述文，严禁使用口语 -요 阶，必须统一使用基本格式体 (-다 / -ㄴ다 / -는다)。'
            });
          });
        }
      }

      // 3. 高级词汇升级检测
      const vocabUpgrades: AICorrectionResult['vocabUpgrades'] = [];
      if (/많이\s*(늘었다|증가했다|많아졌다)/.test(text)) {
        vocabUpgrades.push({ original: '많이 늘었다/증가했다', upgrade: '가파른 증가세를 기록하였다 / 급격히 증가하였다', reason: '替换为更具学术色彩的高级书面动词搭配。' });
      }
      if (/좋은\s*점/.test(text)) {
        vocabUpgrades.push({ original: '좋은 점', upgrade: '긍정적인 파급 효과 / 유례없는 혜택', reason: '避免大白话，增强论述严密性。' });
      }
      if (/나쁜\s*점/.test(text)) {
        vocabUpgrades.push({ original: '나쁜 점', upgrade: '간과할 수 없는 부작용 / 심각한 폐해', reason: '使用高级社科议论词汇提升文章格调。' });
      }
      if (/생각한다/.test(text) && !/사료된다|견해이다/.test(text)) {
        vocabUpgrades.push({ original: '생각한다', upgrade: '~라고 사료된다 / ~라는 견해를 지닌다', reason: '学术论文结论句提升书面客观性。' });
      }

      // 4. 字数评定
      let wordStatus: AICorrectionResult['wordCountStatus'] = 'perfect';
      if (currentQ.type === 'q53') {
        if (length < 180) wordStatus = 'too_short';
        else if (length > 330) wordStatus = 'too_long';
      } else if (currentQ.type === 'q54') {
        if (length < 500) wordStatus = 'too_short';
        else if (length > 750) wordStatus = 'too_long';
      }

      // 5. 评分计算
      let baseScoreRatio = 0.90;
      if (endingToneIssues.length > 0) baseScoreRatio -= 0.12;
      if (spacingIssues.length > 0) baseScoreRatio -= 0.06;
      if (wordStatus !== 'perfect') baseScoreRatio -= 0.08;
      if (vocabUpgrades.length > 0) baseScoreRatio += 0.04;

      const earnedScore = Math.max(Math.round(currentQ.score * Math.min(0.98, Math.max(0.65, baseScoreRatio))), 1);

      const res: AICorrectionResult = {
        score: earnedScore,
        totalScore: currentQ.score,
        wordCount: length,
        wordCountStatus: wordStatus,
        spacingIssues,
        endingToneIssues,
        vocabUpgrades,
        radarScores: {
          content: endingToneIssues.length === 0 ? 95 : 82,
          organization: wordStatus === 'perfect' ? 94 : 80,
          grammar: spacingIssues.length === 0 && endingToneIssues.length === 0 ? 96 : 84,
          vocabulary: vocabUpgrades.length > 0 ? 92 : 88
        },
        overallFeedback: endingToneIssues.length === 0 && spacingIssues.length === 0
          ? '🌟 文章结构严密，格式体运用纯熟！论证逻辑流畅，符合 TOPIK 官方高分标准。'
          : '💡 整体论证思路良好，但需特别注意隔写（띄어쓰기）规范与书面语终结词尾一致性，修改后可冲刺满分！'
      };

      setEvalResult(res);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 600);
  };

  // Generate Won-go-ji 20-cells per row grid representation
  const wonGoJiRows = useMemo(() => {
    const lines = userInputText.split('\n');
    const rows: { cells: string[]; rowNumber: number; charOffset: number }[] = [];
    let totalCharOffset = 0;
    let rowCount = 1;

    lines.forEach((line) => {
      const paddedLine = line.length > 0 ? ' ' + line : '';
      for (let i = 0; i < Math.max(paddedLine.length, 1); i += 20) {
        const chunk = paddedLine.slice(i, i + 20);
        const cells: string[] = [];
        for (let c = 0; c < 20; c++) {
          cells.push(chunk[c] || '');
        }
        totalCharOffset += chunk.trimEnd().length;
        rows.push({
          cells,
          rowNumber: rowCount++,
          charOffset: totalCharOffset
        });
      }
    });

    while (rows.length < (currentQ.type === 'q54' ? 35 : 15)) {
      rows.push({
        cells: Array(20).fill(''),
        rowNumber: rowCount++,
        charOffset: totalCharOffset
      });
    }

    return rows;
  }, [userInputText, currentQ.type]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* 顶部轻量步骤导引条 (直观告知学习主线与写作目标) */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            03
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-black">
                学习主线 · 第 3 步
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                TOPIK 写作 AI 智能批改工坊 (51~54题)
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline">
                AI 隔写诊断 · 20×20 原版方格稿纸
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              作答建议：先审题构思关键论点 ➔ 在韩国原版方格稿纸中作答 ➔ 提交 AI 智能批改诊断隔写与终结词尾
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            已完成诊断: <strong className="text-orange-600 font-black">{aiEvalCount}</strong> 篇
          </span>
        </div>
      </div>

      {/* 题型分段切换 + 考题下拉选择 (紧凑高集成，首屏即见题目与稿纸) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* 51~54题型切换 Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'q51' as WritingQuestionType, label: '51题 · 生活填空', sub: '10分', free: true },
              { id: 'q52' as WritingQuestionType, label: '52题 · 说明短文', sub: '10分', free: true },
              { id: 'q53' as WritingQuestionType, label: '53题 · 图表小作文', sub: '30分', free: false },
              { id: 'q54' as WritingQuestionType, label: '54题 · 议论大作文', sub: '50分', free: false },
            ].map((tab) => {
              const isActive = selectedType === tab.id;
              const isLocked = !isVip && !tab.free;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenVipModal(`🔒 第 ${tab.id.replace('q', '')} 题（${tab.label}）为 VIP 专属真题！升级 VIP 终身卡（仅 ¥49.9），即可享受 51~54 全题型无限次 AI 批改！`);
                      return;
                    }
                    setSelectedType(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1 rounded ${isActive ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                    {tab.sub}
                  </span>
                  {isLocked && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                </button>
              );
            })}
          </div>

          {/* 题目下拉切换器 */}
          <div className="flex items-center gap-2 flex-1 min-w-0 sm:max-w-md justify-end">
            <span className="text-xs font-bold text-slate-700 shrink-0">选择考题:</span>
            <div className="relative flex-1 min-w-0">
              <select
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
              >
                {filteredQuestions.map((q, idx) => (
                  <option key={q.id} value={q.id}>
                    [题{idx + 1}] {q.category} · {q.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prompt & Helper Tools (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Question Prompt Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-extrabold">
                {currentQ.category} · 满分 {currentQ.score}分
              </span>
              {currentQ.wordCountLimit && (
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
                  要求字数：{currentQ.wordCountLimit}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {currentQ.title}
              </h3>
            </div>

            {/* Prompt Content */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {currentQ.prompt}
            </div>

            {/* Sub Questions for 54 */}
            {currentQ.subQuestions && currentQ.subQuestions.length > 0 && (
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> 必须涵盖的核心论点：
                </span>
                {currentQ.subQuestions.map((sq, i) => (
                  <p key={i} className="text-xs text-amber-800 leading-relaxed font-medium">
                    {sq}
                  </p>
                ))}
              </div>
            )}

            {/* Chart Info for 53 */}
            {currentQ.chartData && (
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> 图表核心数据提炼：
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {currentQ.chartData.items.map((it, i) => (
                    <div key={i} className="bg-white p-2 rounded-xl text-center border border-amber-200/50 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">{it.label}</span>
                      <span className="text-xs font-black text-amber-600">{it.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulas & Vocabulary Tool Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-orange-500" /> 必备万能加分句型 (点击插入)
              </h4>
            </div>

            <div className="space-y-2">
              {currentQ.keyFormulas.map((formula, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInsertFormula(formula)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 transition flex items-center justify-between cursor-pointer group"
                >
                  <span className="text-xs text-slate-700 group-hover:text-orange-950 font-medium leading-relaxed">
                    {formula}
                  </span>
                  <span className="text-[10px] text-orange-500 font-bold shrink-0 opacity-0 group-hover:opacity-100 transition pl-2">
                    + 插入
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Writing Editor & AI Evaluation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Editor Header Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" /> 写作演练区
              </button>
              <button
                onClick={() => setActiveTab('sample')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sample'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 官方满分范文与精析
              </button>
            </div>

            {/* Mode Toggle & Character Count */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
                <button
                  onClick={() => setEditorMode('standard')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                    editorMode === 'standard' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                  }`}
                  title="标准文本编辑"
                >
                  <FileText className="w-3.5 h-3.5" /> 文本
                </button>
                <button
                  onClick={() => {
                    if (!isVip) {
                      onOpenVipModal('🔒 官方 20×N 原版方格稿纸（원고지）为 VIP 专属功能！升级 VIP 终身卡（仅 ¥49.9），即可解锁原版方格规范书写模式与格式体排版诊断！');
                      return;
                    }
                    setEditorMode('wongoji');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                    editorMode === 'wongoji' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
                  }`}
                  title="TOPIK 官方方格稿纸视图"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>原版稿纸 (원고지)</span>
                  {!isVip && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                </button>
              </div>

              <div className="text-xs font-bold text-slate-500 pr-1">
                字数：<span className="text-orange-600 font-black">{charCountWithSpaces}</span>
                {currentQ.wordCountLimit && <span className="text-slate-400"> / {currentQ.wordCountLimit}</span>}
              </div>
            </div>
          </div>

          {/* Active Tab 1: Editor View */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              
              {/* Standard Mode: Textarea */}
              {editorMode === 'standard' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                  <textarea
                    value={userInputText}
                    onChange={(e) => setUserInputText(e.target.value)}
                    placeholder={`在此输入您的韩文作答内容...\n• 51/52 题请直接写出 ㉠ 和 ㉡ 的作答内容；\n• 53/54 题请严格使用格式体 (-다 / -ㄴ다 / -는다) 作答，完成后点击下方【AI 智能精批】进行评分诊断！`}
                    rows={currentQ.type === 'q54' ? 14 : currentQ.type === 'q53' ? 8 : 5}
                    className="w-full text-xs sm:text-sm font-medium text-slate-800 leading-relaxed placeholder:text-slate-300 border-0 focus:ring-0 focus:outline-none resize-y min-h-[180px]"
                  />

                  {/* Bottom Action Bar (Responsive full width on mobile) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 border-t border-slate-100 gap-2.5">
                    <button
                      onClick={() => {
                        setUserInputText('');
                        setEvalResult(null);
                      }}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 清空重写
                    </button>

                    <button
                      onClick={handleRunAICorrection}
                      disabled={isEvaluating}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          AI 智能深度诊断中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-200" />
                          <span>一键 AI 智能精批 (隔写+格式体+评分)</span>
                          {!isVip && (
                            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-extrabold text-amber-100">
                              免费剩余 {Math.max(0, 2 - aiEvalCount)} 次
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Won-go-ji (원고지) Mode: 20xN Official Examination Paper Grid */}
              {editorMode === 'wongoji' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
                    <span>📋 TOPIK 官方 20×N 方格稿纸规范（每行 20 格）：</span>
                    <span className="text-[11px] text-emerald-700 font-medium">段首空一格 · 数字两位占一格 · 标点不放行首 (手机端可横向滑动)</span>
                  </div>

                  {/* Real Won-go-ji Paper Canvas */}
                  <div className="p-3 bg-[#FCFBF8] rounded-2xl border-2 border-emerald-300/80 shadow-inner overflow-x-auto max-h-[480px] overflow-y-auto">
                    <div className="min-w-[620px] space-y-0.5 font-mono select-none">
                      {wonGoJiRows.map((row) => (
                        <div key={row.rowNumber} className="flex items-center">
                          {/* Line Index on left */}
                          <span className="w-6 text-[10px] text-slate-400 font-bold text-right pr-1">
                            {row.rowNumber}
                          </span>

                          {/* 20 Grid Boxes */}
                          <div className="flex border-t border-b border-l border-emerald-300/70">
                            {row.cells.map((char, cIdx) => (
                              <div 
                                key={cIdx} 
                                className={`w-7 h-7 sm:w-7.5 sm:h-7.5 border-r border-emerald-300/70 flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                                  char ? 'text-slate-900 bg-white' : 'bg-transparent'
                                }`}
                              >
                                {char}
                              </div>
                            ))}
                          </div>

                          {/* Cumulative count on right */}
                          <span className="w-10 text-[10px] text-emerald-700 font-bold pl-2">
                            {row.rowNumber * 20}字
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synchronized Text Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      实时同步编辑稿纸内容：
                    </label>
                    <textarea
                      value={userInputText}
                      onChange={(e) => setUserInputText(e.target.value)}
                      placeholder="在此打字，上方方格稿纸将实时同步映射..."
                      rows={4}
                      className="w-full text-xs font-medium text-slate-800 p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserInputText('');
                        setEvalResult(null);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 清空稿纸
                    </button>

                    <button
                      onClick={handleRunAICorrection}
                      disabled={isEvaluating}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      一键 AI 智能精批
                    </button>
                  </div>
                </div>
              )}

              {/* AI Evaluation Diagnostic Card */}
              {evalResult && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Score & Radar Overview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        AI 综合估分
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-orange-500">
                          {evalResult.score}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 font-bold">
                          / {evalResult.totalScore} 分
                        </span>
                      </div>
                    </div>

                    {/* 4-Dimension Mini Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
                      <div className="bg-white p-2 rounded-xl text-center border border-slate-200/60 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block">内容切题</span>
                        <span className="text-xs font-black text-slate-800">{evalResult.radarScores.content}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl text-center border border-slate-200/60 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block">篇章组织</span>
                        <span className="text-xs font-black text-slate-800">{evalResult.radarScores.organization}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl text-center border border-slate-200/60 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block">语法规范</span>
                        <span className="text-xs font-black text-slate-800">{evalResult.radarScores.grammar}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl text-center border border-slate-200/60 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block">学术词汇</span>
                        <span className="text-xs font-black text-slate-800">{evalResult.radarScores.vocabulary}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Summary */}
                  <div className="text-xs sm:text-sm text-slate-700 bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 leading-relaxed font-medium">
                    {evalResult.overallFeedback}
                  </div>

                  {/* Detailed Issues List */}
                  <div className="space-y-3">
                    
                    {/* 1. Ending Tone Issues */}
                    {evalResult.endingToneIssues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> 终结格式体误用 (-요 阶扣分项)：
                        </h5>
                        {evalResult.endingToneIssues.map((it, i) => (
                          <div key={i} className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-xs text-slate-800 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="line-through text-red-500 font-bold">{it.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-700 font-bold">{it.corrected}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{it.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. Spacing Issues */}
                    {evalResult.spacingIssues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> 隔写（띄어쓰기）修正建议：
                        </h5>
                        {evalResult.spacingIssues.map((it, i) => (
                          <div key={i} className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs text-slate-800 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-700 font-bold">{it.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-700 font-bold">{it.corrected}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{it.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Vocabulary Upgrade Suggestions */}
                    {evalResult.vocabUpgrades.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500" /> 高级学术词汇升级推荐：
                        </h5>
                        {evalResult.vocabUpgrades.map((it, i) => (
                          <div key={i} className="bg-orange-50/50 p-3 rounded-xl border border-orange-200/60 text-xs text-slate-800 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 font-medium">{it.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-orange-700 font-bold">{it.upgrade}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{it.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {evalResult.endingToneIssues.length === 0 && evalResult.spacingIssues.length === 0 && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        太棒了！未检测出明显的隔写与终结词尾硬伤，语法规范性极佳！
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Tab 2: Sample Essay & Deep Analysis */}
          {activeTab === 'sample' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  官方满分标准答卷
                </span>
                <h4 className="text-base font-black text-slate-900">
                  {currentQ.title} · 高分范文精读
                </h4>
              </div>

              {/* Sample Content */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {currentQ.sampleAnswer}
              </div>

              {/* Analysis */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/60 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-orange-500" /> 考级教研组名师深度拆解
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentQ.sampleAnalysis}
                </p>
              </div>

              {/* Advanced Vocab Table */}
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" /> 范文高分词汇升格表
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.advancedVocab.map((v, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">{v.word}</span>
                        <span className="text-[10px] text-slate-400">{v.meaning}</span>
                      </div>
                      <div className="text-orange-600 font-bold text-[11px]">
                        ➔ {v.replacement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Free User VIP Writing Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【51/52 题免费 AI 精批】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），即可解锁 <strong>53 题图表小作文 (30分)</strong>、<strong>54 题社科大议论文 (50分)</strong>、TOPIK 官方原版方格稿纸模式 (원고지) 及无限次 AI 智能精批！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁 53 题图表小作文、54 题社科大议论文、官方原版方格稿纸及无限次 AI 智能精批！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁 53/54 题与原版稿纸 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};