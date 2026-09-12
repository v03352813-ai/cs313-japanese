import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Compass,
  Layers
} from 'lucide-react';
import { GOLDEN_PARTICLE_CONTRASTS, ParticleContrastItem } from '../data/japanese/katakanaClinicData';
import { speakJapanese } from '../utils/speech';

export const JapaneseParticleGuide: React.FC = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>('wa-vs-ga');

  const activePair = GOLDEN_PARTICLE_CONTRASTS.find(p => p.id === selectedPairId) || GOLDEN_PARTICLE_CONTRASTS[0];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
      
      {/* 顶部标题与切换标签 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 日本语教育学·核心助词解析
            </span>
            <span className="text-xs text-slate-400 font-medium">
              攻克初级最容易纠结的两大世纪难题
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            初级黄金助词双轨解剖卡（は vs が · に vs で）
          </h3>
        </div>

        {/* 助词对决标签 */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          {GOLDEN_PARTICLE_CONTRASTS.map(pair => (
            <button
              key={pair.id}
              onClick={() => setSelectedPairId(pair.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedPairId === pair.id
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pair.title.split('：')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* 核心口诀横幅 */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/30 border border-amber-200 text-xs text-amber-950 space-y-1.5">
        <div className="font-black text-amber-900 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>💡 教授记忆口诀：</span>
        </div>
        <p className="font-extrabold text-slate-800 leading-relaxed text-sm">
          {activePair.conceptMnemonic}
        </p>
      </div>

      {/* 左右并排双轨卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左侧助词 */}
        <div className="rounded-2xl p-5 border border-sky-200 bg-sky-50/40 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-sky-700 font-mono">
                {activePair.leftItem.particle}
              </span>
              <span className="text-xs font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-lg border border-sky-200">
                {activePair.leftItem.role}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{activePair.leftItem.focusMetaphor}</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-sky-200/70 shadow-2xs space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold block">语法公式：</span>
              <p className="text-xs font-bold text-slate-800 font-mono">
                {activePair.leftItem.formula}
              </p>
            </div>

            {/* 例句 */}
            <div 
              onClick={() => speakJapanese(activePair.leftItem.exampleJa)}
              className="p-3 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 cursor-pointer transition space-y-1 group"
              title="点击发音"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 group-hover:text-sky-700 transition">
                  {activePair.leftItem.exampleJa}
                </span>
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {activePair.leftItem.exampleZh}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
              🔍 <strong>深度析理：</strong>{activePair.leftItem.why}
            </p>
          </div>

          <button
            onClick={() => speakJapanese(activePair.leftItem.exampleJa)}
            className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            试听【{activePair.leftItem.particle}】例句发音
          </button>
        </div>

        {/* 右侧助词 */}
        <div className="rounded-2xl p-5 border border-indigo-200 bg-indigo-50/40 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-indigo-700 font-mono">
                {activePair.rightItem.particle}
              </span>
              <span className="text-xs font-bold text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {activePair.rightItem.role}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{activePair.rightItem.focusMetaphor}</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-indigo-200/70 shadow-2xs space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold block">语法公式：</span>
              <p className="text-xs font-bold text-slate-800 font-mono">
                {activePair.rightItem.formula}
              </p>
            </div>

            {/* 例句 */}
            <div 
              onClick={() => speakJapanese(activePair.rightItem.exampleJa)}
              className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 cursor-pointer transition space-y-1 group"
              title="点击发音"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition">
                  {activePair.rightItem.exampleJa}
                </span>
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {activePair.rightItem.exampleZh}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
              🔍 <strong>深度析理：</strong>{activePair.rightItem.why}
            </p>
          </div>

          <button
            onClick={() => speakJapanese(activePair.rightItem.exampleJa)}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            试听【{activePair.rightItem.particle}】例句发音
          </button>
        </div>
      </div>

      {/* 名家名句巅峰对决框 (象鼻句或电车句) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900">
            {activePair.classicShowdown.title}
          </h4>
          <span className="text-[10px] text-slate-400 font-bold">
            {activePair.classicShowdown.explanation}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div 
            onClick={() => speakJapanese(activePair.classicShowdown.sentence1)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-sky-300 transition"
          >
            <div className="font-black text-slate-900 flex items-center justify-between">
              <span>{activePair.classicShowdown.sentence1}</span>
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-500">{activePair.classicShowdown.sentence1Meaning}</span>
          </div>

          <div 
            onClick={() => speakJapanese(activePair.classicShowdown.sentence2)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
          >
            <div className="font-black text-slate-900 flex items-center justify-between">
              <span>{activePair.classicShowdown.sentence2}</span>
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-500">{activePair.classicShowdown.sentence2Meaning}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
