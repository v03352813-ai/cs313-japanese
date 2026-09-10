import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Search, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  HelpCircle, 
  RotateCcw,
  Zap,
  Play,
  Layers,
  Award,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  KOREAN_SOUND_RULES, 
  SOUND_CHANGE_CATEGORIES, 
  SoundRuleItem, 
  analyzeSoundChange 
} from '../data/korean/phonetics';
import { speakKorean } from '../utils/speech';

interface PhoneticsViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

export const PhoneticsView: React.FC<PhoneticsViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activeRuleId, setActiveRuleId] = useState<string>('rule-01');
  const [searchInput, setSearchInput] = useState<string>('');
  const [clinicInput, setClinicInput] = useState<string>('한국말');
  const [clinicResult, setClinicResult] = useState(() => analyzeSoundChange('한국말'));

  // Free user safety check: non-VIP cannot access rules beyond 01 and 02
  React.useEffect(() => {
    if (!isVip && activeRuleId !== 'rule-01' && activeRuleId !== 'rule-02') {
      setActiveRuleId('rule-01');
    }
  }, [isVip, activeRuleId]);

  // Active rule
  const currentRule = KOREAN_SOUND_RULES.find(r => r.id === activeRuleId) || KOREAN_SOUND_RULES[0];

  // Filter rules
  const filteredRules = KOREAN_SOUND_RULES.filter(r => {
    if (selectedCategory !== '全部' && r.category !== selectedCategory) return false;
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase();
      return r.ruleName.toLowerCase().includes(q) || r.ruleKorean.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRunClinic = (textToTest?: string) => {
    const text = (textToTest || clinicInput).trim();
    if (!text) return;
    setClinicInput(text);
    const result = analyzeSoundChange(text);
    setClinicResult(result);
    speakKorean(result.phonetic);
  };

  const handlePlayAudio = (text: string) => {
    speakKorean(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Lightweight Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            01
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                发音底座
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                8 大音变交互诊疗室
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              输入任意词句秒级拆解底层收音演变，掌握地道连音与自然变调
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            连音 · 鼻音 · 流音 · 紧音 · 激音
          </span>
        </div>
      </div>

      {/* Interactive Sound Clinic Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> 智能音变秒级诊断
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              输入任意词句，实时拆解音标形态
            </h3>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold shrink-0">高频速试：</span>
            {['한국어', '국물', '감사합니다', '신라', '학교', '축하', '같이', '좋아'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleRunClinic(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 transition cursor-pointer border border-slate-200/60"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input and Result Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Input Bar (5 Cols) */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-500 block">输入韩语单词/句子：</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={clinicInput}
                onChange={(e) => setClinicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunClinic()}
                placeholder="例如: 국물, 같이, 한국어..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <button
                onClick={() => handleRunClinic()}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0"
              >
                诊断
              </button>
            </div>
          </div>

          {/* Diagnostic Result Card (7 Cols) */}
          <div className="md:col-span-7 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg sm:text-xl font-black text-slate-900">
                  {clinicResult.original}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-xl sm:text-2xl font-black text-orange-600 tracking-wide font-mono">
                  [{clinicResult.phonetic}]
                </span>
              </div>

              <button
                onClick={() => handlePlayAudio(clinicResult.phonetic)}
                className="p-2 rounded-xl bg-white text-orange-600 hover:bg-orange-500 hover:text-white transition shadow-2xs border border-orange-200 flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="发音"
              >
                <Volume2 className="w-4 h-4" />
                <span>听标准音</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {clinicResult.appliedRules.map((rule, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200/60 text-[11px] font-bold">
                  ⚡ 触发法则：{rule}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {clinicResult.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* 8 Big Sound Change Rules Grid */}
      <div className="space-y-4">
        
        {/* Category Filter Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SOUND_CHANGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 8 Rules Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRules.map((rule) => {
            const isSelected = activeRuleId === rule.id;
            const isRuleFree = rule.id === 'rule-01' || rule.id === 'rule-02';
            const isRuleLocked = !isVip && !isRuleFree;
            return (
              <div
                key={rule.id}
                onClick={() => {
                  if (isRuleLocked) {
                    onOpenVipModal(`🔒【${rule.ruleName}】音变规则为 VIP 会员专属！升级 VIP 终身卡（仅 ¥49.9），即可解锁 8 大音变全规则深度拆解、高频词汇例音与智能发音诊疗室！`);
                    return;
                  }
                  setActiveRuleId(rule.id);
                }}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-[1.01]'
                    : isRuleLocked
                    ? 'border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-orange-200 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-[11px] font-bold">
                      {rule.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isRuleFree ? (
                        <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                          免费
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                          {!isVip && <Lock className="w-2.5 h-2.5 text-amber-600" />}
                          <span>{isVip ? '已解锁' : 'VIP'}</span>
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-400">
                        {rule.ruleKorean}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    {rule.ruleName}
                  </h3>

                  {/* Formula Box */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs font-bold text-slate-800 whitespace-pre-line leading-relaxed font-mono">
                    {rule.formula}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {rule.description}
                  </p>
                </div>

                {/* Mnemonic Badge */}
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>口诀：{rule.mnemonic}</span>
                </div>

                {/* Example Quick List */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">代表词汇与发音：</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {rule.examples.slice(0, 4).map((ex, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(ex.pron);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-[11px] flex items-center justify-between border border-slate-200/40 cursor-pointer group"
                      >
                        <span className="font-bold text-slate-700">{ex.word}</span>
                        <span className="text-orange-600 font-bold font-mono">[{ex.pron}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Exploration Modal / Drawer of Current Selected Rule */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              音变深度拆解与对比例句
            </span>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              {currentRule.ruleName} · {currentRule.ruleKorean}
            </h3>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            记忆秘诀：{currentRule.mnemonic}
          </div>
        </div>

        {/* Detailed Examples Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-orange-500" /> 高频官方真题例词精析 (点击喇叭发音)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRule.examples.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-orange-300 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{ex.word}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-base font-black text-orange-600 font-mono">[{ex.pron}]</span>
                    {ex.hanja && <span className="text-xs text-slate-400 font-medium font-serif">({ex.hanja})</span>}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">释义：{ex.meaning}</p>
                  <p className="text-[11px] text-slate-600 font-medium">演变：{ex.breakdown}</p>
                </div>

                <button
                  onClick={() => handlePlayAudio(ex.pron)}
                  className="p-2 rounded-xl bg-white text-orange-600 hover:bg-orange-500 hover:text-white transition shadow-2xs border border-slate-200 shrink-0 cursor-pointer"
                  title="播放发音"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes Avoidance */}
        {currentRule.commonMistakes && currentRule.commonMistakes.length > 0 && (
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
            <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> 考级易错与发音避坑提醒
            </h5>
            {currentRule.commonMistakes.map((mis, i) => (
              <div key={i} className="text-xs text-slate-700 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold line-through">错读：{mis.wrong}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-700 font-bold">正读：{mis.correct}</span>
                </div>
                <p className="text-[11px] text-slate-500">{mis.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free User Phonetics VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【连音与鼻音化 · 免费体验】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），即可解锁全部 <strong>8 大音变规律</strong>（流音化、紧音化、激音化、口盖音化、头音法则、ㅎ音变）与真题发音避坑提醒！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁 8 大音变全规则与真题发音避坑提醒！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部 8 大音变 (¥49.9)</span>
          </button>
        </div>
      )}
    </div>
  );
};