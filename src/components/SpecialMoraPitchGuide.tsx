import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Music, 
  Lightbulb, 
  Clock, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Flame
} from 'lucide-react';
import { SPECIAL_MORA_DATA, PITCH_ACCENT_DATA } from '../data/japanese/katakanaClinicData';
import { speakJapanese } from '../utils/speech';

export const SpecialMoraPitchGuide: React.FC = () => {
  const [activeMoraId, setActiveMoraId] = useState<string>('sokuon');
  const [activePitchId, setActivePitchId] = useState<string>('pitch-0');

  const curMora = SPECIAL_MORA_DATA.find(m => m.id === activeMoraId) || SPECIAL_MORA_DATA[0];
  const curPitch = PITCH_ACCENT_DATA.find(p => p.id === activePitchId) || PITCH_ACCENT_DATA[0];

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 模块一：三大特殊音拍 (Mora 拍节) 节拍器与断气拉长法则                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> 击碎中式发音硬伤
              </span>
              <span className="text-xs text-slate-400 font-medium">
                拍节感 (Mora) 是地道东京腔的灵魂
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              三大特殊音拍（促音 · 长音 · 拨音）节拍器实训
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {SPECIAL_MORA_DATA.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMoraId(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeMoraId === m.id
                    ? 'bg-white text-indigo-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.name.split(' ')[0]} ({m.symbol})
              </button>
            ))}
          </div>
        </div>

        {/* 当前音拍核心法则横幅 */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>【{curMora.name}】核心教学原理与节拍模型：</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-indigo-800 border border-indigo-200 text-[11px] font-black">
              节拍公式：{curMora.rhythmBeat}
            </span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed font-medium pl-6 border-l-2 border-indigo-400">
            {curMora.goldenRule}
          </p>
        </div>

        {/* 关键对比对战卡 (Contrast Pairs) */}
        <div className="space-y-3">
          <span className="text-xs font-black text-slate-900 block">
            典型对比实战：多一拍少一拍，含义彻底天翻地覆！
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curMora.contrastPairs.map((pair, pIdx) => (
              <div
                key={pIdx}
                className="bg-slate-50/70 hover:bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">对照组：</span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {pair.wrongBeats} 拍 ➔ {pair.correctBeats} 拍
                    </span>
                  </div>

                  {/* Contrast Blocks */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">原音 / 基准</span>
                      <span className="text-base font-black text-slate-600 block">{pair.wrongOrBase}</span>
                      <span className="text-[11px] text-slate-500 font-medium block">{pair.wrongMeaning}</span>
                    </div>

                    <div 
                      onClick={() => speakJapanese(pair.audioTarget)}
                      className="bg-indigo-50/80 hover:bg-indigo-100/80 p-3 rounded-xl border border-indigo-200 text-center space-y-1 cursor-pointer transition group"
                      title="点击发音"
                    >
                      <span className="text-[10px] text-indigo-700 font-bold flex items-center justify-center gap-1">
                        <span>目标发音</span>
                        <Volume2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      </span>
                      <span className="text-base font-black text-indigo-950 block">{pair.correctOrTarget}</span>
                      <span className="text-[11px] text-indigo-800 font-bold block">{pair.correctMeaning}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-slate-100">
                    💡 <strong>名师点拨：</strong>{pair.explanation}
                  </p>
                </div>

                <button
                  onClick={() => speakJapanese(pair.audioTarget)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>朗读示范【{pair.correctOrTarget}】</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块二：音调核 (Pitch Accent / 高低音阶 0/1/2型) 启蒙                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 告别汉语四声顿挫
              </span>
              <span className="text-xs text-slate-400 font-medium">
                日语是音高拍节语言，不是声调语言
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              音调核 (Pitch Accent) 高低调型解剖室
            </h3>
          </div>

          {/* 3 Pitch Types Tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto">
            {PITCH_ACCENT_DATA.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePitchId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activePitchId === p.id
                    ? 'bg-white text-emerald-800 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.typePattern.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Contour Visualization */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-slate-50 border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-black text-emerald-950">
              {curPitch.typePattern} · 声调曲线模型
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 text-xs font-mono font-black">
              音高走向：{curPitch.contour}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {curPitch.patternDesc}。<strong>{curPitch.ruleSummary}</strong>
          </p>
        </div>

        {/* Word Examples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {curPitch.examples.map((item, idx) => (
            <div
              key={idx}
              onClick={() => speakJapanese(item.audio)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition">
                  {item.word}
                </span>
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs text-slate-500 font-medium">
                  释义：{item.meaning}
                </p>
                <div className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-100 inline-block">
                  {item.particlePitch}
                </div>
              </div>

              <div className="pt-1 text-[10px] text-slate-400 font-medium">
                点击试听标准高低音调
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
