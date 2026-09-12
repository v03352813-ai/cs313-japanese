import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Flame, 
  Eye, 
  PenTool,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KATAKANA_TWIN_GROUPS, KatakanaTwinGroup, KatakanaTwinItem } from '../data/japanese/katakanaClinicData';
import { speakJapanese } from '../utils/speech';

export const KatakanaClinic: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(KATAKANA_TWIN_GROUPS[0].id);

  // Active Group
  const activeGroup = KATAKANA_TWIN_GROUPS.find(g => g.id === selectedGroupId) || KATAKANA_TWIN_GROUPS[0];

  // ==================== 火眼金睛·混淆片假名眼力盲测 ====================
  const [quizQuestion, setQuizQuestion] = useState<{
    targetItem: KatakanaTwinItem;
    group: KatakanaTwinGroup;
  } | null>(() => {
    const group = KATAKANA_TWIN_GROUPS[0];
    const targetItem = group.items[0];
    return { targetItem, group };
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  const generateNewQuiz = (group: KatakanaTwinGroup) => {
    const randomItem = group.items[Math.floor(Math.random() * group.items.length)];
    setQuizQuestion({ targetItem: randomItem, group });
    setSelectedAnswer(null);
    speakJapanese(randomItem.kana);
  };

  const handleSelectQuiz = (kana: string) => {
    if (!quizQuestion || selectedAnswer) return;
    setSelectedAnswer(kana);

    if (kana === quizQuestion.targetItem.kana) {
      setQuizScore(prev => prev + 1);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
      speakJapanese(kana);
    } else {
      setQuizScore(0);
      speakJapanese(kana);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 顶部教研导言与组别切换 */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current text-rose-500" /> 日本语教育学·专项拔刺
              </span>
              <span className="text-xs text-slate-400 font-medium">
                攻克全国日语自学者 90% 必踩的片假名深坑
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              片假名“多胞胎死敌”专项辨异诊断室
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/70 shrink-0 font-bold">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>笔顺轨迹 · 角度起笔 · 汉字字源</span>
          </div>
        </div>

        {/* 4 组死敌切换标签 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {KATAKANA_TWIN_GROUPS.map((group) => {
            const isSelected = group.id === selectedGroupId;
            return (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedGroupId(group.id);
                  generateNewQuiz(group);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm shadow-sky-600/20 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-sky-50/50 border-slate-200/80 text-slate-700 hover:border-sky-300'
                }`}
              >
                <div className="text-base font-black tracking-wider">
                  {group.items.map(i => i.kana).join(' vs ')}
                </div>
                <div className={`text-[10px] font-bold mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {group.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 核心区别速记横幅 */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/5 border border-sky-200 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900">
          <Lightbulb className="w-4 h-4 text-sky-600" />
          <span>【{activeGroup.title}】秒懂核心差异：</span>
        </div>
        <p className="text-xs text-slate-700 font-medium leading-relaxed pl-6 border-l-2 border-sky-400">
          {activeGroup.coreDifference}
        </p>
      </div>

      {/* 双胞胎/三胞胎并排卡片 */}
      <div className={`grid grid-cols-1 ${activeGroup.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {activeGroup.items.map((item, idx) => (
          <div
            key={item.kana}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden group"
          >
            {/* Top Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${idx === 0 ? 'bg-sky-500' : idx === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />

            <div className="space-y-3 pt-1">
              {/* Header: Romaji + Hiragana badge */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                  平假名对应：{item.hiragana}
                </span>
                <span className="text-xs font-mono font-black text-sky-600">
                  [{item.romaji}] · {item.strokeCount}画
                </span>
              </div>

              {/* Big Katakana Display */}
              <div className="text-center py-2 relative">
                <div className="text-7xl font-black text-slate-900 tracking-tight select-none group-hover:scale-105 transition-transform">
                  {item.kana}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200/70">
                  <PenTool className="w-3 h-3 text-sky-600" />
                  <span>{item.directionRule}</span>
                </div>
              </div>

              {/* Kanji Origin */}
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70 text-xs text-amber-950 space-y-0.5">
                <span className="font-extrabold text-amber-900 block">📜 楷书字源：</span>
                <p className="font-medium">{item.origin}</p>
              </div>

              {/* Mnemonic */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs text-slate-700 space-y-0.5">
                <span className="font-extrabold text-slate-900 block">💡 形象记忆口诀：</span>
                <p className="font-medium leading-relaxed">{item.mnemonic}</p>
              </div>

              {/* Loanwords Examples */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 block">高频外来语实词：</span>
                <div className="space-y-1">
                  {item.words.map((w, wIdx) => (
                    <div
                      key={wIdx}
                      onClick={() => speakJapanese(w.word)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition flex items-center justify-between group/w"
                      title="点击发音"
                    >
                      <div>
                        <span className="font-black text-slate-800 text-xs mr-2">
                          {w.word}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          [{w.romaji}]
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {w.meaning}
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover/w:text-sky-600 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => speakJapanese(item.kana)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>朗读发音【{item.kana} ({item.romaji})】</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 火眼金睛辨假名·盲测闯关 */}
      {quizQuestion && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-600" /> 火眼金睛盲测 · 认准哪一个是【{quizQuestion.targetItem.romaji}】？
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                平假名是「{quizQuestion.targetItem.hiragana}」，请在下方孪生片假名中精准选出对应的字形
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>连对 {quizScore} 题</span>
              </div>
              <button
                onClick={() => generateNewQuiz(activeGroup)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>换一题</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeGroup.items.map((candidate) => {
              const isSelected = selectedAnswer === candidate.kana;
              const isTarget = quizQuestion.targetItem.kana === candidate.kana;

              let btnStyle = 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-800';
              if (selectedAnswer) {
                if (isTarget) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-500/30 font-black shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 font-black';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 opacity-60 border-slate-200';
                }
              }

              return (
                <button
                  key={candidate.kana}
                  onClick={() => handleSelectQuiz(candidate.kana)}
                  disabled={!!selectedAnswer}
                  className={`p-5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${btnStyle}`}
                >
                  <span className="text-4xl font-black">{candidate.kana}</span>
                  <span className="text-xs opacity-80 font-mono">
                    {selectedAnswer ? `[${candidate.romaji}]` : '点击选择'}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in ${
              selectedAnswer === quizQuestion.targetItem.kana
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2">
                {selectedAnswer === quizQuestion.targetItem.kana ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <strong className="block text-sm font-black">
                    {selectedAnswer === quizQuestion.targetItem.kana
                      ? `🎉 太强了！眼力精准！这就是【${quizQuestion.targetItem.kana} (${quizQuestion.targetItem.romaji})】！`
                      : `💡 看仔细啦！正确的是【${quizQuestion.targetItem.kana} (${quizQuestion.targetItem.romaji})】哦！`}
                  </strong>
                  <p className="opacity-90 mt-0.5">{quizQuestion.targetItem.directionRule}</p>
                </div>
              </div>

              <button
                onClick={() => generateNewQuiz(activeGroup)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 shadow-xs cursor-pointer ${
                  selectedAnswer === quizQuestion.targetItem.kana ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                下一题 ➔
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
