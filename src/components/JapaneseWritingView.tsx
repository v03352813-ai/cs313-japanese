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
import { JAPANESE_WRITING_DATA, JapaneseWritingQuestion, JapaneseWritingType } from '../data/japanese/writing';

interface JapaneseWritingViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

interface AICorrectionResult {
  score: number;
  totalScore: number;
  wordCount: number;
  wordCountStatus: 'perfect' | 'too_short' | 'too_long';
  styleIssues: { original: string; corrected: string; explanation: string }[];
  keigoIssues: { original: string; corrected: string; explanation: string }[];
  vocabUpgrades: { original: string; upgrade: string; reason: string }[];
  radarScores: {
    content: number;
    organization: number;
    grammar: number;
    vocabulary: number;
  };
  overallFeedback: string;
}

export const JapaneseWritingView: React.FC<JapaneseWritingViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedType, setSelectedType] = useState<JapaneseWritingType>(isVip ? 'essay' : 'business');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(isVip ? 'jp-w-essay-01' : 'jp-w-biz-01');
  const [userInputText, setUserInputText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<AICorrectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'sample' | 'formulas'>('editor');
  const [editorMode, setEditorMode] = useState<'standard' | 'genkoyoshi'>('standard');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Free user safety check: non-VIP cannot access essay or chart
  useEffect(() => {
    if (!isVip && (selectedType === 'essay' || selectedType === 'chart')) {
      setSelectedType('business');
      setEditorMode('standard');
    }
  }, [isVip]);

  // Filtered questions by type
  const filteredQuestions = useMemo(() => {
    return JAPANESE_WRITING_DATA.filter(q => q.type === selectedType);
  }, [selectedType]);

  const currentQ: JapaneseWritingQuestion = useMemo(() => {
    return filteredQuestions.find(q => q.id === selectedQuestionId) || filteredQuestions[0] || JAPANESE_WRITING_DATA[0];
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
      alert('请先在下方输入您的日文作文或邮件内容再进行 AI 批改！');
      return;
    }

    if (!isVip && (currentQ.type === 'essay' || currentQ.type === 'chart')) {
      onOpenVipModal(`🔒 【${currentQ.title}】为 VIP 专属高分真题！免费学员可体验商务邮件与日常随笔。升级 VIP 终身卡，即可享受全题型无限次 AI 智能精批与原稿纸批改！`);
      return;
    }

    if (!isVip && aiEvalCount >= 2) {
      onOpenVipModal('🎯 您的免费 AI 精批体验次数已达上限（已免费体验 2 次）！升级 VIP 终身卡，即可享受全题型无限次 AI 智能深度精批与官方原稿纸批改！');
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      setAiEvalCount(prev => prev + 1);

      // 文本分析逻辑：检测文体混用（です/ます 与 だ/である）
      const hasDesuMasu = /です|ます|でした|ました/.test(userInputText);
      const hasDaDearu = /である|だ|だった|であろう/.test(userInputText);
      const isMixedStyle = hasDesuMasu && hasDaDearu;

      const baseScore = Math.min(
        currentQ.score,
        Math.max(
          Math.floor(currentQ.score * 0.6),
          Math.floor(currentQ.score * (0.7 + Math.min(charCountWithoutSpaces / 300, 0.25)))
        )
      );

      const deductedScore = isMixedStyle ? Math.max(Math.floor(currentQ.score * 0.5), baseScore - 5) : baseScore;

      const mockResult: AICorrectionResult = {
        score: deductedScore,
        totalScore: currentQ.score,
        wordCount: charCountWithoutSpaces,
        wordCountStatus: charCountWithoutSpaces < 150 ? 'too_short' : charCountWithoutSpaces > 600 ? 'too_long' : 'perfect',
        styleIssues: isMixedStyle ? [
          {
            original: '「です・ます」と「だ・である」の混用',
            corrected: currentQ.type === 'essay' || currentQ.type === 'chart' ? '文末を「だ・である」に統一してください' : '文末を「です・ます」に統一してください',
            explanation: currentQ.type === 'essay' ? '学术小论文与论说文必须全篇统一使用【常体（だ・である体）】，绝不能混入敬体！' : '商务邮件与日常随笔必须使用【敬体（です・ます体）】，请勿混入简体。'
          }
        ] : [],
        keigoIssues: [
          {
            original: '会いたいです / 教えてください',
            corrected: 'お目にかかりたく存じます / ご教示いただけますでしょうか',
            explanation: '在正式书信中避免使用口语化表达，采用规范的谦逊语与郑重语可大幅提高得分档次。'
          }
        ],
        vocabUpgrades: [
          { original: 'すごく増えた', upgrade: '著しい増加傾向を示した', reason: '用客观书面学术语替代口语感叹词' },
          { original: 'いいと思う', upgrade: '有益であると推測される', reason: '小论文中陈述观点需用论理推断句式' },
          { original: 'すみません', upgrade: '大変恐縮に存じます', reason: '商务邮件中需用更庄重的致歉礼节表达' }
        ],
        radarScores: {
          content: Math.floor(80 + Math.random() * 15),
          organization: Math.floor(75 + Math.random() * 20),
          grammar: isMixedStyle ? 68 : Math.floor(82 + Math.random() * 15),
          vocabulary: Math.floor(80 + Math.random() * 16)
        },
        overallFeedback: isMixedStyle
          ? '【重要扣分项提醒】您的论述内容观点明确，但文中存在「敬体（です・ます）」与「简体（だ・である）」混用的情况，这是小论文与商务写作的致命扣分点！已为您高亮标注，请统一文体后再次批改。'
          : '【优秀习作点评】文章结构清晰，立意紧扣题目要求，具备良好的逻辑推进能力。若能进一步在句式多样性和高级转折助词上做适当润色，将达到满分范文水准！'
      };

      setEvalResult(mockResult);

      if (mockResult.score >= currentQ.score * 0.8) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 顶部标题区 (Clean white card style aligned with Image 3) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              ✍️ AI 写作工坊
            </span>
            <span className="text-xs text-slate-400 font-medium">
              400字原稿用紙 · 商务邮件 · EJU学术小论文
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI 日文写作与小论文智能精批系统</span>
            <Sparkles className="w-5 h-5 text-sky-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            告别中式日文与文体混用！涵盖商务书信、EJU留考论述、图表分析与日常随笔，配备日本官方400字詰原稿用紙模式与AI文体/敬语四维诊断精批。
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              setUserInputText('');
              setEvalResult(null);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>清空重写</span>
          </button>
        </div>
      </div>

      {/* 4 大题型分类选择栏 */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        
        {/* Row 1: 题型分类 Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { type: 'business' as JapaneseWritingType, title: '💼 商务邮件/敬语', tag: '200~300字', badge: '免费体验' },
            { type: 'essay' as JapaneseWritingType, title: '🎓 EJU学术小论文', tag: '400~500字', badge: 'VIP专属' },
            { type: 'chart' as JapaneseWritingType, title: '📊 图表数据分析', tag: '200~300字', badge: 'VIP专属' },
            { type: 'diary' as JapaneseWritingType, title: '✍️ 日常随笔/日记', tag: '150~250字', badge: '免费体验' },
          ].map((item) => {
            const isSelected = selectedType === item.type;
            const isLocked = !isVip && (item.type === 'essay' || item.type === 'chart');

            return (
              <button
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-2xs font-bold'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black truncate">{item.title}</span>
                  {isLocked ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> VIP
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md bg-white text-slate-500 border border-slate-200 text-[10px] font-bold shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{item.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: 题目下拉选择器 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>选择练习题目:</span>
            </span>

            <div className="relative flex-1 min-w-0 max-w-xl">
              <select
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                {filteredQuestions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.score}分)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              难度级别: {currentQ.level}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
              满分 {currentQ.score} 分
            </span>
          </div>
        </div>
      </div>

      {/* 主体交互区：左侧题目要求与辅助，右侧编辑与批改 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left 5 Cols: 题目要求、高分公式与范文 */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 题目说明卡片 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>写作题目与背景要求</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                字数建议: {currentQ.wordCountLimit || '适量'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line font-serif">
              {currentQ.prompt}
            </div>

            {currentQ.subQuestions && currentQ.subQuestions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">构思指引要求：</span>
                <div className="space-y-1">
                  {currentQ.subQuestions.map((sq, i) => (
                    <div key={i} className="text-xs text-slate-600 bg-sky-50/50 p-2 rounded-xl border border-sky-100/80">
                      {sq}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentQ.chartData && (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>【核心参考数据表】</span>
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {currentQ.chartData.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-xl border border-amber-200 text-xs">
                      <span className="text-slate-500 block text-[10px]">{item.label}</span>
                      <span className="font-bold text-slate-900 text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 辅助标签页：高分句式公式 vs 满分范文 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab('formulas')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'formulas'
                    ? 'bg-white text-sky-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>万能写作句式库</span>
              </button>

              <button
                onClick={() => setActiveTab('sample')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'sample'
                    ? 'bg-white text-sky-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5 text-sky-500" />
                <span>官方满分范文</span>
              </button>
            </div>

            {activeTab === 'formulas' ? (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">点击即可直接将句式插入当前文章中：</span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {currentQ.keyFormulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/70 transition flex items-center justify-between gap-2 text-xs group"
                    >
                      <span className="text-slate-800 font-medium select-all">{formula}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyFormula(formula)}
                          className="p-1 rounded bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition cursor-pointer"
                          title="复制句式"
                        >
                          {copiedFormula === formula ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleInsertFormula(formula)}
                          className="px-2 py-0.8 rounded bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold transition cursor-pointer"
                          title="插入编辑器"
                        >
                          + 插入
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 text-xs text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                  {currentQ.sampleAnswer}
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">💡 名师架构精析：</span>
                  {currentQ.sampleAnalysis}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: 输入编辑器与 AI 批改报告 */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 编辑器主卡片 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            
            {/* 编辑器头部工具条 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-sky-500" />
                  <span>日文正文编写</span>
                </span>

                {/* 原稿用紙模式切换 */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold ml-2">
                  <button
                    onClick={() => setEditorMode('standard')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      editorMode === 'standard' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    标准模式
                  </button>
                  <button
                    onClick={() => setEditorMode('genkoyoshi')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                      editorMode === 'genkoyoshi' ? 'bg-white text-sky-600 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Grid className="w-3 h-3 text-sky-500" />
                    <span>原稿用紙</span>
                  </button>
                </div>
              </div>

              {/* 字数统计与指标 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-500">
                  字数: <strong className="text-sky-600 font-black">{charCountWithoutSpaces}</strong> 字 (含标点: {charCountWithSpaces})
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  建议: {currentQ.wordCountLimit}
                </span>
              </div>
            </div>

            {/* 输入框区 */}
            {editorMode === 'genkoyoshi' ? (
              <div className="space-y-2">
                <div className="p-1 rounded-2xl bg-amber-50/30 border-2 border-amber-300/80">
                  <div className="px-3 py-1.5 bg-amber-100/50 rounded-xl text-[11px] font-bold text-amber-900 flex items-center justify-between">
                    <span>📝 日本文部科学省标准 400字詰原稿用紙规范模式（20列）</span>
                    <span className="text-[10px] text-amber-700">避头尾法则 / 行首空一格</span>
                  </div>
                  <textarea
                    value={userInputText}
                    onChange={(e) => setUserInputText(e.target.value)}
                    placeholder="【原稿用紙撰写提示】
1. 题目空三格，段落开头空一格；
2. 标点符号（句号、逗号）各占一格，但不能出现在行首（请使用避头尾法则放在上一行末尾）；
3. 学术小论文请严格统一使用「だ・である」体，切勿混用「です・ます」体。"
                    rows={12}
                    className="w-full p-4 bg-transparent border-0 font-serif text-sm leading-8 tracking-widest text-slate-900 placeholder:text-slate-300 focus:outline-none resize-y"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom, transparent 31px, #f1e5d1 32px)',
                      backgroundSize: '100% 32px'
                    }}
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={userInputText}
                onChange={(e) => setUserInputText(e.target.value)}
                placeholder="在此直接输入您的日文作文、商务邮件或小论文...
建议结构：
1. 導入（背景・結論・用件）：明确说明目的或立场；
2. 本論（論拠・詳細・理由）：展开论述并举出事实依据；
3. 結論（まとめ・今後の展望・結び）：总结升华或提出期望礼节。"
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white leading-relaxed resize-y font-sans"
              />
            )}

            {/* 操作条：AI 智能精批按钮 */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                AI 智能多维度精批，秒级出分与纠偏
              </span>

              <button
                onClick={handleRunAICorrection}
                disabled={isEvaluating}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-sky-500/25 transition active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <BrainCircuit className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI 正在多维深度诊断中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>立即开始 AI 智能深度精批</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI 批改结果展示区 */}
          {evalResult && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-300 shadow-md space-y-5 animate-in fade-in duration-300">
              
              {/* 评分总览 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black">
                    AI 诊断总评报告
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-3xl font-black text-slate-900">
                      {evalResult.score}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      / 满分 {evalResult.totalScore} 分
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold ml-2">
                      {evalResult.score >= evalResult.totalScore * 0.85 ? '🌟 优秀 (S级)' : evalResult.score >= evalResult.totalScore * 0.7 ? '👍 良好 (A级)' : '⚠️ 需强化'}
                    </span>
                  </div>
                </div>

                {/* 四维雷达小徽章 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">主题构思</span>
                    <span className="text-xs font-black text-slate-800">{evalResult.radarScores.content}分</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">文章结构</span>
                    <span className="text-xs font-black text-slate-800">{evalResult.radarScores.organization}分</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">文法规范</span>
                    <span className="text-xs font-black text-sky-600">{evalResult.radarScores.grammar}分</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">地道语汇</span>
                    <span className="text-xs font-black text-slate-800">{evalResult.radarScores.vocabulary}分</span>
                  </div>
                </div>
              </div>

              {/* 导师综合评语 */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1.5">
                <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>AI 导师全景综合点评：</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {evalResult.overallFeedback}
                </p>
              </div>

              {/* 文体混用警告 */}
              {evalResult.styleIssues.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>文体混用专项警示（关键失分点）：</span>
                  </span>
                  {evalResult.styleIssues.map((issue, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                      <div className="font-bold text-rose-700">{issue.original}</div>
                      <div className="text-slate-600 font-medium">{issue.explanation}</div>
                      <div className="text-emerald-700 font-bold text-[11px]">👉 建议修改：{issue.corrected}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 词汇升格建议 */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span>高级学术/商务词汇升格建议（提分技巧）：</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {evalResult.vocabUpgrades.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>原词: {item.original}</span>
                        <span className="text-emerald-600 font-bold">推荐升级 ➔</span>
                      </div>
                      <div className="font-black text-slate-900 text-xs text-sky-700">{item.upgrade}</div>
                      <div className="text-[10px] text-slate-500">{item.reason}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
