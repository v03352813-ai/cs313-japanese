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
  Flame,
  Wind,
  Shuffle
} from 'lucide-react';
import { SPECIAL_MORA_DATA, PITCH_ACCENT_DATA } from '../data/japanese/katakanaClinicData';
import { speakJapanese } from '../utils/speech';

// 连续语流发音规则教研数据 (母音无声化 · 连浊定律 · 鼻浊音化)
const CONNECTED_SPEECH_RULES = [
  {
    id: 'devoicing',
    name: '母音无声化 (Devoicing)',
    badge: '元音吞音法则',
    concept: '告别中式“得苏/马苏”塑料腔的第一秘诀',
    ruleDesc: '元音 i (い段) 和 u (う段) 处于清辅音 (k, s, t, h, p) 之间，或者位于句尾时，声带停止震动，元音弱化脱落，只保留微弱气流！',
    formula: '无声辅音 ＋ [i / u] ＋ 无声辅音 / 句末 ➔ 声带不震动',
    examples: [
      { ja: 'です', romaji: 'desu ➔ [des]', meaning: '是...', tip: '绝不念“得苏”，尾部su直接脱落为清气流 [des]' },
      { ja: 'ます', romaji: 'masu ➔ [mas]', meaning: '动词礼貌形', tip: '绝不念“马苏”，句末短促收声 [mas]' },
      { ja: '好き', romaji: 'suki ➔ [ski]', meaning: '喜欢', tip: 'u音脱落，直接由s滑向ki，念[ski]' },
      { ja: '学生', romaji: 'gakusei ➔ [gak-sei]', meaning: '学生', tip: 'く的u弱化，舌根卡住送气后立刻接sei' },
      { ja: '明日', romaji: 'ashita ➔ [ashta]', meaning: '明天', tip: 'し处于a与ta之间，i弱化吞音为[ashta]' }
    ]
  },
  {
    id: 'rendaku',
    name: '连浊现象与莱曼定律 (Rendaku)',
    badge: '复合词清变浊',
    concept: '发音省力与节拍连贯的天然演变',
    ruleDesc: '两个独立词复合为一个新词时，后项首辅音通常发生连浊 (清音变浊音)。但受严格的【莱曼定律 (Lyman’s Law)】约束！',
    formula: '词A ＋ 词B (清音起首) ➔ 词B首音变浊音 (か➔が, さ➔ざ, た➔だ, は➔ば)',
    examples: [
      { ja: '人々 (ひと＋ひと)', romaji: 'hitobito', meaning: '人们', tip: '后项ひと清音变浊音びと' },
      { ja: '手紙 (て＋かみ)', romaji: 'tegami', meaning: '信件', tip: 'かみ变浊音がみ' },
      { ja: '雨傘 (あめ＋かさ)', romaji: 'amagasa', meaning: '雨伞', tip: 'かさ变浊音がさ' },
      { ja: '🚨 春風 (はる＋かぜ)', romaji: 'harukaze (非harugaze)', meaning: '春风 (莱曼特例)', tip: '【莱曼定律】：若后词内部已有浊音(ぜ)，则绝对不再连浊！' },
      { ja: '🚨 黒蜥蜴 (くろ＋とかげ)', romaji: 'kurotokage', meaning: '黑蜥蜴 (莱曼特例)', tip: 'とかげ已有げ浊音，所以と绝不变成ど！' }
    ]
  },
  {
    id: 'bidakuon',
    name: '鼻浊音化 (Bidakuan [ŋ])',
    badge: 'NHK 播音员与声优必修',
    concept: '由爆破音软化为软腭柔和鼻共鸣',
    ruleDesc: 'が行假名在词头念普通爆破浊音 [g]；但位于词中、词尾或助词「が」时，正统东京腔转为软腭鼻浊音 [ŋ]！',
    formula: '词头 ➔ [g] (爆破浊音) ｜ 词中/词尾/助词が ➔ [ŋ] (柔和鼻共鸣)',
    examples: [
      { ja: '外国 (がいこく)', romaji: '[ga-i-ko-ku]', meaning: '外国 (词头)', tip: '位于词头，念正常清脆的 [g] 浊音' },
      { ja: '鏡 (かがみ)', romaji: '[ka-ŋa-mi]', meaning: '镜子 (词中)', tip: '位于词中，が转为柔和后鼻腔共鸣 [ŋa]' },
      { ja: '私が (わたしが)', romaji: '[watasi-ŋa]', meaning: '我(助词)', tip: '助词が标准东京播音规范皆读 [ŋa]' },
      { ja: '大学 (だいがく)', romaji: '[dai-ŋa-ku]', meaning: '大学 (词中)', tip: '避免声带剧烈摩擦爆破，听感极度温婉' }
    ]
  }
];

export const SpecialMoraPitchGuide: React.FC = () => {
  const [activeMoraId, setActiveMoraId] = useState<string>('sokuon');
  const [activePitchId, setActivePitchId] = useState<string>('pitch-0');
  const [activeRuleId, setActiveRuleId] = useState<string>('devoicing');

  const curMora = SPECIAL_MORA_DATA.find(m => m.id === activeMoraId) || SPECIAL_MORA_DATA[0];
  const curPitch = PITCH_ACCENT_DATA.find(p => p.id === activePitchId) || PITCH_ACCENT_DATA[0];
  const curRule = CONNECTED_SPEECH_RULES.find(r => r.id === activeRuleId) || CONNECTED_SPEECH_RULES[0];

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
                拍节感 (Mora) 是地道东京腔的节拍基石
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
      {/* 模块二：连续语流发音法则 (母音无声化 · 连浊定律 · 鼻浊音化)                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-600" /> 真实语流连续音变
              </span>
              <span className="text-xs text-slate-400 font-medium">
                日本语教育学·母音脱落与复合浊化
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              语流发音规则（母音无声化 · 连浊定律 · 鼻浊音化）
            </h3>
          </div>

          {/* 3 Rules Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {CONNECTED_SPEECH_RULES.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRuleId(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeRuleId === r.id
                    ? 'bg-white text-sky-800 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Rule Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/90 via-blue-50/50 to-slate-50 border border-sky-200/80 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-black">
                {curRule.badge}
              </span>
              <span className="text-sm font-black text-slate-900">
                {curRule.name} · {curRule.concept}
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-800 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">
              {curRule.formula}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium pl-4 border-l-2 border-sky-500">
            {curRule.ruleDesc}
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {curRule.examples.map((ex, idx) => (
            <div
              key={idx}
              onClick={() => speakJapanese(ex.ja.split(' ')[0])}
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-300 transition cursor-pointer flex flex-col justify-between space-y-2 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900 group-hover:text-sky-700 transition">
                    {ex.ja}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {ex.romaji}
                  </span>
                </div>
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0" />
              </div>

              <div className="text-xs text-slate-600 font-medium">
                {ex.meaning}
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-500 font-medium leading-snug">
                💡 {ex.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块三：音调核 (Pitch Accent / 高低音阶 0/1/2型) 启蒙                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 告别汉语四声顿挫
              </span>
              <span className="text-xs text-slate-400 font-medium">
                日语是音高拍节语言，不是四声声调语言
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
