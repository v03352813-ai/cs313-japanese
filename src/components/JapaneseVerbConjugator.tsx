import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Lock,
  Lightbulb,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  HelpCircle,
  Play
} from 'lucide-react';
import {
  VERB_CONJUGATOR_DATABASE,
  CONJUGATION_FORMS_META,
  ConjugationFormKey,
  ConjugatorVerbItem,
  VerbGroupType
} from '../data/japanese/verbConjugatorData';
import { VERB_CONJUGATION_RULES } from '../data/japanese/jlptGrammar';

// 东京标准音原声朗读辅助引擎
const speakJapanese = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.88; // 沉稳清晰语速

  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.name.includes('Japan'));
  if (jaVoice) {
    utterance.voice = jaVoice;
  }
  window.speechSynthesis.speak(utterance);
};

interface JapaneseVerbConjugatorProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
  initialVerbId?: string;
  initialFormKey?: ConjugationFormKey;
}

export const JapaneseVerbConjugator: React.FC<JapaneseVerbConjugatorProps> = ({
  isVip = false,
  onOpenVipModal,
  initialVerbId = 'kaku',
  initialFormKey = 'potential'
}) => {
  // 当前视图模式：'workbench' (交互演练工作台) vs 'rules' (10大全局法则库)
  const [viewMode, setViewMode] = useState<'workbench' | 'rules'>('workbench');

  // 动词库筛选与搜索
  const [selectedGroup, setSelectedGroup] = useState<'all' | VerbGroupType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 当前选中的动词与当前演练形态
  const [selectedVerbId, setSelectedVerbId] = useState<string>(initialVerbId);
  const [selectedFormKey, setSelectedFormKey] = useState<ConjugationFormKey>(initialFormKey);

  // 是否展开当前动词全部 10 大变形全览速查表
  const [showFullMatrix, setShowFullMatrix] = useState<boolean>(true);

  // 动词列表过滤
  const filteredVerbs = VERB_CONJUGATOR_DATABASE.filter(v => {
    const matchesGroup = selectedGroup === 'all' || v.group === selectedGroup;
    const matchesQuery =
      v.kanji.includes(searchQuery) ||
      v.hiragana.includes(searchQuery) ||
      v.meaning.includes(searchQuery) ||
      v.romaji.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  const selectedVerb: ConjugatorVerbItem =
    VERB_CONJUGATOR_DATABASE.find(v => v.id === selectedVerbId) || VERB_CONJUGATOR_DATABASE[0];

  const currentDerivation = selectedVerb.forms[selectedFormKey];
  const currentFormMeta = CONJUGATION_FORMS_META.find(m => m.key === selectedFormKey)!;

  const handleSelectVerb = (verb: ConjugatorVerbItem) => {
    if (!isVip && !verb.isFree) {
      onOpenVipModal?.(`🔒【${verb.kanji} (${verb.meaning})】为 VIP 终身卡专属动词变形演练！激活 VIP 即可解锁全量动词库与深度特例剖析！`);
      return;
    }
    setSelectedVerbId(verb.id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 🚀 顶部高光 Hero 看板：自研技术招牌与核心卖点 */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-white via-sky-50/40 to-indigo-50/30 rounded-3xl border border-sky-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                独家研发 · 动词活用推导引擎
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                10 大核心活用形态 · 假名段位跃迁 · 音便轨迹秒懂
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>日语动词 10 大活用变形可视化演练器</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              彻底告别枯燥死记硬背！选择任意动词，系统一键锁定「词干」，动态演示假名从 <strong>う段跃迁到 あ/い/え/お段</strong>、<strong>促音便/拨音便/イ音便</strong> 及 <strong>一段动词去る接续</strong> 的完整演变轨迹，配备东京腔原声即点即读。
            </p>
          </div>

          {/* 模式切换按钮 */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('workbench')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'workbench'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              <span>交互推导工作台</span>
            </button>
            <button
              onClick={() => setViewMode('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'rules'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>全景法则宝典 (10大卡)</span>
            </button>
          </div>
        </div>

        {/* 动词 3 大分类极简速判口诀 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1 border-t border-sky-100">
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>1类动词 (五段动词)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              词尾非「る」，或词尾是「る」但倒数第二假名在「あ/う/お段」。(如: 書く, 飲む, 帰る)
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>2类动词 (一段动词)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              词尾必为「る」，且倒数第二假名在「い段」(上一段)或「え段」(下一段)。(如: 食べる, 見る)
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>3类动词 (不规则动词)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              日语全语系仅有两个：<strong>する (サ变)</strong> 与 <strong>来る (くる/カ变)</strong>。
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模式 1：交互推导工作台 (全新居中对称架构 · 凸显推导核心焦点) */}
      {/* ========================================================================= */}
      {viewMode === 'workbench' && (
        <div className="space-y-4 sm:space-y-5">
          
          {/* ========================================================================= */}
          {/* ① 顶部动词选控中心 (Symmetrical Verb Selection Deck) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3.5">
            {/* 上排：搜索与分类对称排布 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索动词 (如 書く, 食べる, 飲む, 行く, する)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition text-slate-800"
                />
              </div>

              {/* 分类药丸组 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">动词分类：</span>
                {[
                  { key: 'all', label: '全部核心词' },
                  { key: 'group1_godan', label: '1类五段' },
                  { key: 'group2_ichidan', label: '2类一段' },
                  { key: 'group3_irregular', label: '3类不规则' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedGroup(tab.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedGroup === tab.key
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 下排：动词选择卡片胶囊网格 (整齐对称排列) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
              {filteredVerbs.map(verb => {
                const isSelected = selectedVerb.id === verb.id;
                const isLocked = !isVip && !verb.isFree;

                return (
                  <button
                    key={verb.id}
                    onClick={() => handleSelectVerb(verb)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md ring-2 ring-sky-300'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-base font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {verb.kanji}
                      </span>
                      {isLocked ? (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> VIP
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {verb.jlptLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-mono truncate ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {verb.hiragana}
                      </span>
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                        {verb.meaning}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ② 选中的动词标头栏 + 10 大活用形态对称切换矩阵 */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            
            {/* 动词大标头 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {selectedVerb.kanji}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-sky-600 font-mono">
                      【{selectedVerb.hiragana} · {selectedVerb.romaji}】
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-extrabold">
                      {selectedVerb.groupLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      JLPT {selectedVerb.jlptLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    核心原意：<strong>{selectedVerb.meaning}</strong>
                    {selectedVerb.specialFeatureBadge && (
                      <span className="ml-2 text-amber-600 font-bold">
                        • {selectedVerb.specialFeatureBadge}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => speakJapanese(selectedVerb.kanji)}
                className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
                title="朗读辞书形原形"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>朗读原型发音</span>
              </button>
            </div>

            {/* 10 大活用形态切换条 (5x2 完美对称网格) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  切换目标活用形态（点击即刻执行推导）
                </span>
                <span className="text-xs text-sky-600 font-black">
                  当前形态：{currentFormMeta.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CONJUGATION_FORMS_META.map(form => {
                  const isCurrent = form.key === selectedFormKey;
                  return (
                    <button
                      key={form.key}
                      onClick={() => {
                        setSelectedFormKey(form.key);
                        speakJapanese(selectedVerb.forms[form.key].result);
                      }}
                      className={`p-3 rounded-2xl text-left transition cursor-pointer flex flex-col justify-between gap-1 border ${
                        isCurrent
                          ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-transparent shadow-md ring-2 ring-sky-400/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {form.shortName}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-sky-200" />}
                      </div>
                      <span className={`text-[10px] line-clamp-1 ${isCurrent ? 'text-sky-100 font-medium' : 'text-slate-400'}`}>
                        {form.formulaTag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* ③ 🎯 独家核心推导演练大舞台 (The High-Impact Derivation Stage · 重点极大凸显！) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-sky-400 shadow-xl p-5 sm:p-7 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-sky-100/50 to-transparent pointer-events-none rounded-bl-full" />

            {/* 顶栏信息 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-black shadow-xs">
                  ⚡ 核心推导中
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  【{selectedVerb.kanji}】➔【{currentFormMeta.name}】推导演变轨迹
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                {currentFormMeta.meaningTag}
              </span>
            </div>

            {/* 核心三步流可视化拆解 (3-Stage Symmetrical Pipeline) */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
              
              {/* Step 1: 锁定词干 (3 cols) */}
              <div className="md:col-span-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  STEP 01 · 锁定词干
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {currentDerivation.stem}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  保持不变的词基
                </span>
              </div>

              {/* Arrow 1 */}
              <div className="md:col-span-1 flex justify-center text-sky-400">
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Step 2: 假名段位跃迁 / 音便演变 (4 cols - 核心放大) */}
              <div className="md:col-span-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50/40 to-sky-50 border border-sky-300 text-center space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">
                  STEP 02 · 假名段位跃迁 / 音便
                </span>
                <div className="text-xs sm:text-sm font-black text-sky-950 leading-relaxed px-1">
                  {currentDerivation.stepExplanation}
                </div>
                {currentDerivation.soundEffectTag && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white text-sky-700 border border-sky-300 text-[11px] font-extrabold shadow-xs">
                    ⚡ {currentDerivation.soundEffectTag}
                  </span>
                )}
              </div>

              {/* Arrow 2 */}
              <div className="md:col-span-1 flex justify-center text-sky-400">
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Step 3: 最终变形结果 (3 cols) */}
              <div
                onClick={() => speakJapanese(currentDerivation.result)}
                className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-sky-600 text-white text-center space-y-1.5 shadow-lg cursor-pointer hover:scale-103 transition duration-200 group"
                title="点击朗读变形发音"
              >
                <span className="text-[10px] font-extrabold text-sky-200 uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>STEP 03 · 最终变形</span>
                  <Volume2 className="w-3 h-3 group-hover:animate-pulse" />
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-wide">
                  {currentDerivation.result}
                </div>
                <span className="text-xs text-sky-100 font-bold block truncate">
                  {currentDerivation.meaning}
                </span>
              </div>

            </div>

            {/* 结果大字播报栏 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-400">推导成果：</span>
                <span className="text-xl font-black text-sky-700 font-mono">
                  {currentDerivation.result}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-mono">
                  【{currentDerivation.furigana} · {currentDerivation.romaji}】
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  ➔ 意为：{currentDerivation.meaning}
                </span>
              </div>

              <button
                onClick={() => speakJapanese(currentDerivation.result)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-600 border border-slate-200 text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
              >
                <Volume2 className="w-4 h-4 text-sky-500" />
                <span>播放东京标准音</span>
              </button>
            </div>

            {/* 下排：左右 50:50 严格对称双子卡片 (避坑预警 vs 真题例句) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 左卡 (50%)：考点避坑高能预警 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>JLPT 考点避坑高能预警</span>
                  </div>
                  <p className="text-xs font-medium text-amber-900/90 leading-relaxed pl-6">
                    {currentDerivation.trapNotes || '💡 掌握此类动词的变化规律与接续助词搭配，重点关注长音与促音书写规范，牢记假名跳段法则！'}
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-200/60 text-[10px] text-amber-700 font-bold pl-6">
                  ⚠️ 备考必记 · 谨防混淆
                </div>
              </div>

              {/* 右卡 (50%)：历届真题例句实战 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
                      <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>历届真题语境实战例句</span>
                    </span>
                    <button
                      onClick={() => speakJapanese(currentDerivation.exampleJa)}
                      className="p-1.5 rounded-full bg-white hover:bg-sky-50 text-sky-600 border border-slate-200 shadow-2xs cursor-pointer transition shrink-0"
                      title="朗读真题例句"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug pl-6">
                    {currentDerivation.exampleJa}
                  </p>
                  <p className="text-xs text-slate-600 font-medium pl-6">
                    {currentDerivation.exampleZh}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-bold pl-6">
                  📚 JLPT 原真语境沉浸
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* ④ 📑 当前动词全部 10 大活用形态全览速查矩阵 (5x2 对称排布) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div
              onClick={() => setShowFullMatrix(!showFullMatrix)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-sky-600 transition">
                  【{selectedVerb.kanji}】全部 10 大活用形态速查对照表 (全览速记)
                </h4>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  (辞书形、ます形、て形、た形、ない形、ば形、可能态、被动态、使役态、意志形)
                </span>
              </div>
              <button className="p-1.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition">
                {showFullMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showFullMatrix && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {CONJUGATION_FORMS_META.map(meta => {
                  const detail = selectedVerb.forms[meta.key];
                  const isCurrent = meta.key === selectedFormKey;

                  return (
                    <div
                      key={meta.key}
                      onClick={() => {
                        setSelectedFormKey(meta.key);
                        speakJapanese(detail.result);
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-400/20 shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-700">
                          {meta.shortName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese(detail.result);
                          }}
                          className="text-slate-400 hover:text-sky-600"
                          title="朗读"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-black text-sky-700 font-mono">
                        {detail.result}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight truncate">
                        {detail.meaning}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 模式 2：全景法则宝典 (Global Rules Encyclopedia) */}
      {/* ========================================================================= */}
      {viewMode === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold">
                10 大活用形态宏观法则表：横向对比 1类五段、2类一段、3类不规则的变化规律与音便公式。
              </span>
            </div>
            <button
              onClick={() => setViewMode('workbench')}
              className="px-3 py-1 rounded-xl bg-white text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-50 transition shrink-0 cursor-pointer shadow-2xs"
            >
              返回交互推导工作台 ➔
            </button>
          </div>

          <div className="space-y-3">
            {VERB_CONJUGATION_RULES.map(rule => (
              <div key={rule.formName} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 text-sky-700">
                    {rule.formName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {rule.functionDesc}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">1类动词 (五段)</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{rule.rules.group1}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">2类动词 (一段)</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{rule.rules.group2}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">3类动词 (不规则)</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{rule.rules.group3}</p>
                  </div>
                </div>

                {/* Samples */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-bold text-[11px]">经典演练范例：</span>
                  {rule.sample.map((s, idx) => (
                    <span
                      key={idx}
                      onClick={() => speakJapanese(s.conjugated)}
                      className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold cursor-pointer transition flex items-center gap-1"
                      title="点击朗读变形发音"
                    >
                      <span className="text-slate-400 line-through mr-0.5">{s.dict}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-sky-500" />
                      <span className="font-bold">{s.conjugated}</span>
                      <span className="text-[10px] text-slate-400">({s.meaning})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
