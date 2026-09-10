import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookMarked, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Layers, 
  HelpCircle,
  TrendingDown,
  CheckCircle,
  Award,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getSavedMistakes, 
  saveMistakes, 
  recordMistakeReview, 
  removeMistakeRecord, 
  MistakeRecord 
} from '../data/korean/mistakeBook';
import { speakKorean } from '../utils/speech';

interface MistakeNotebookViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({ isVip, onOpenVipModal }) => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => getSavedMistakes());
  const [filterMode, setFilterMode] = useState<'today' | 'all' | 'mastered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [testedAnswers, setTestedAnswers] = useState<Record<string, number>>({});
  const [reviewedIds, setReviewedIds] = useState<Record<string, boolean>>({});

  const todayStr = new Date().toISOString().slice(0, 10);

  // Stats calculation
  const totalMistakes = mistakes.length;
  const todayDueCount = mistakes.filter(m => !m.isMastered && m.nextReviewDate <= todayStr).length;
  const masteredCount = mistakes.filter(m => m.isMastered).length;

  // Filtered list
  const filteredList = useMemo(() => {
    return mistakes.filter(m => {
      if (filterMode === 'today' && (m.isMastered || m.nextReviewDate > todayStr)) return false;
      if (filterMode === 'mastered' && !m.isMastered) return false;
      if (selectedCategory !== '全部' && !m.categoryTag.includes(selectedCategory)) return false;
      return true;
    });
  }, [mistakes, filterMode, selectedCategory, todayStr]);

  const handleSelectAnswer = (record: MistakeRecord, optIdx: number) => {
    setTestedAnswers(prev => ({ ...prev, [record.id]: optIdx }));
    const isCorrect = optIdx === record.correctAnswer;

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }

    recordMistakeReview(record.id, isCorrect);
    setReviewedIds(prev => ({ ...prev, [record.id]: true }));
    setMistakes(getSavedMistakes());
  };

  const handleRemove = (id: string) => {
    if (confirm('确定要将这道题从错题本中移除吗？')) {
      removeMistakeRecord(id);
      setMistakes(getSavedMistakes());
    }
  };

  const handlePlayVoice = (text?: string) => {
    if (text) speakKorean(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Lightweight Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            05
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                提分闭环
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                艾宾浩斯智能错题本
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              基于 1-3-7-15 天遗忘衰减规律，真题考场做错题目自动归集并周期推送重测
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            遗忘曲线靶向复习
          </span>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div 
          onClick={() => setFilterMode('today')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition shadow-xs flex items-center justify-between ${
            filterMode === 'today' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 今日待复习错题
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {todayDueCount} <span className="text-xs font-normal text-slate-400">道</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">按遗忘曲线到期需重练</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            ⚡
          </div>
        </div>

        <div 
          onClick={() => setFilterMode('all')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition shadow-xs flex items-center justify-between ${
            filterMode === 'all' ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5" /> 累计错题池总数
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalMistakes} <span className="text-xs font-normal text-slate-400">道</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">考场实战做错沉淀</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
            📚
          </div>
        </div>

        <div 
          onClick={() => setFilterMode('mastered')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition shadow-xs flex items-center justify-between ${
            filterMode === 'mastered' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 已彻底攻克掌握
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {masteredCount} <span className="text-xs font-normal text-slate-400">道</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">连续3次复习全对</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            🏆
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'today' as const, label: '今日待复习', badge: todayDueCount },
            { id: 'all' as const, label: '全部错题', badge: totalMistakes },
            { id: 'mastered' as const, label: '已掌握', badge: masteredCount },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterMode(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filterMode === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterMode === t.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['全部', '词汇语法', '图表告示', '逻辑排序', '长篇阅读'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 font-bold'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mistake Items List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>
          <h3 className="text-base font-black text-slate-900">
            {filterMode === 'today' ? '太棒了！今日暂无待复习的错题' : '暂无符合条件的错题记录'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            在 56 套全真考场做题时，做错的题目会自动进入这里排期推送。保持坚持，拿下 TOPIK 高分！
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item, idx) => {
            const isMistakeLocked = !isVip && idx >= 3;
            if (isMistakeLocked) {
              if (idx === 3) {
                return (
                  <div key="locked-barrier" className="p-8 rounded-3xl bg-amber-50/40 border-2 border-dashed border-amber-300 text-center space-y-3 animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                      <BookMarked className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">剩余 {filteredList.length - 3} 道错题已进入 VIP 智能复习库</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        免费体验支持前 3 道错题靶向突破。升级 VIP 终身卡（仅 ¥49.9），即可解锁全部错题无限次重测、艾宾浩斯记忆排期与多端云同步！
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenVipModal('🔒 升级 VIP 终身卡（仅 ¥49.9），即可解锁全部错题无限次重测与记忆推送！')}
                      className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md transition active:scale-98 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>立即解锁全部错题 (¥49.9)</span>
                    </button>
                  </div>
                );
              }
              return null;
            }

            const hasAnswered = testedAnswers[item.id] !== undefined;
            const isAnswerCorrect = testedAnswers[item.id] === item.correctAnswer;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs space-y-4 ${
                  item.isMastered
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Item Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                      {item.categoryTag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      来自：{item.paperTitle} · 第 {item.questionNumber} 题
                    </span>
                    {item.isMastered && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" /> 已攻克
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>复习进度: 第 {item.reviewCount} 轮 / {item.reviewIntervalDays}天间隔</span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="移出错题本"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Title & Passage */}
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h4>

                  {item.passage && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {item.passage}
                    </div>
                  )}
                </div>

                {/* 4 Interactive Options (Re-test Mode) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {item.options.map((opt, optIdx) => {
                    const isUserSelected = testedAnswers[item.id] === optIdx;
                    const isCorrectOpt = item.correctAnswer === optIdx;

                    let optStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700';

                    if (hasAnswered) {
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-400';
                      } else if (isUserSelected && !isCorrectOpt) {
                        optStyle = 'bg-red-50 border-red-300 text-red-900 font-bold';
                      } else {
                        optStyle = 'bg-slate-50/50 opacity-60 border-slate-200 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectAnswer(item, optIdx)}
                        className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium transition text-left flex items-center justify-between gap-2 cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {['A', 'B', 'C', 'D'][optIdx]}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        {hasAnswered && isCorrectOpt && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {hasAnswered && isUserSelected && !isCorrectOpt && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Analysis Box when Answered */}
                {hasAnswered && (
                  <div className="bg-gradient-to-r from-orange-50/60 to-amber-50/60 p-4 rounded-2xl border border-orange-200/80 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        {isAnswerCorrect ? '🎉 答对了！艾宾浩斯复习周期已向后推进' : '💡 错因与考点拆解：'}
                      </span>
                      <button
                        onClick={() => handlePlayVoice(item.passage || item.title)}
                        className="p-1.5 rounded-lg bg-white text-orange-600 hover:bg-orange-500 hover:text-white transition shadow-2xs border border-orange-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> 听题干发音
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.analysis}
                    </p>

                    {item.vocabList && item.vocabList.length > 0 && (
                      <div className="pt-2 border-t border-orange-200/50 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-orange-900">核心生词：</span>
                        {item.vocabList.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-white text-[11px] text-slate-700 border border-orange-200/60 font-medium">
                            <span className="font-bold text-orange-950">{v.word}</span>: {v.meaning}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Free User Mistake VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white rounded-3xl p-5 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-200/90 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>艾宾浩斯遗忘曲线 · 靶向提分核心库</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              免费学员支持体验前 3 道错题。开通 VIP 终身卡（仅 ¥49.9），立即解锁 <strong>全站 56 套真题错题自动归集</strong>、1-3-7-15 天记忆周期靶向推送与多设备云端备份！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁全量错题智能归集与艾宾浩斯记忆周期突破！')}
            className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 font-black text-xs text-white shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>解锁无限错题本 (¥49.9)</span>
          </button>
        </div>
      )}
    </div>
  );
};