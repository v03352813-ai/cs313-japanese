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
  RotateCcw,
  Zap,
  CheckCircle2,
  HelpCircle
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
      {/* 模式 1：交互推导工作台 (Interactive Workbench) */}
      {/* ========================================================================= */}
      {viewMode === 'workbench' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* 左侧栏 (4 cols): 动词库选择器 */}
          <div className="lg:col-span-4 space-y-3">
            {/* 搜索与分类 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-3.5 space-y-3">
              {/* 搜索输入框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索动词 (如 書く, 食べる, 飲む)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition"
                />
              </div>

              {/* 动词分类药丸过滤 */}
              <div className="flex items-center gap-1 flex-wrap text-xs">
                {[
                  { key: 'all', label: '全部动词' },
                  { key: 'group1_godan', label: '1类五段' },
                  { key: 'group2_ichidan', label: '2类一段' },
                  { key: 'group3_irregular', label: '3类不规则' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedGroup(tab.key as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      selectedGroup === tab.key
                        ? 'bg-sky-500 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 动词列表 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-2 space-y-1.5 max-h-[520px] overflow-y-auto">
              {filteredVerbs.map(verb => {
                const isSelected = selectedVerb.id === verb.id;
                const isLocked = !isVip && !verb.isFree;

                return (
                  <button
                    key={verb.id}
                    onClick={() => handleSelectVerb(verb)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-500/30'
                        : 'hover:bg-slate-50 border border-transparent text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {verb.kanji}
                        </span>
                        <span className={`text-xs font-mono ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                          {verb.hiragana}
                        </span>
                        {verb.specialFeatureBadge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {verb.specialFeatureBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={isSelected ? 'text-sky-100 font-medium' : 'text-slate-500'}>
                          {verb.meaning}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {verb.groupLabel.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isLocked ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> VIP
                        </span>
                      ) : (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-white text-sky-700 font-black' : 'text-slate-400'
                        }`}>
                          {verb.jlptLevel}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧栏 (8 cols): 交互推导演练主舞台 */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 动词详情标头卡 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {selectedVerb.kanji}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-sky-600 font-mono">
                    [{selectedVerb.hiragana} · {selectedVerb.romaji}]
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                    {selectedVerb.groupLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                    JLPT {selectedVerb.jlptLevel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  基础释义：<strong>{selectedVerb.meaning}</strong>
                  {selectedVerb.specialFeatureBadge && (
                    <span className="ml-2 text-amber-600 font-bold">
                      • {selectedVerb.specialFeatureBadge}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakJapanese(selectedVerb.kanji)}
                  className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="朗读辞书形原形"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>朗读原形</span>
                </button>
              </div>
            </div>

            {/* 10 大活用形态切换条 (Tabs) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-3 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  选择目标活用变形形态（点击即刻触发推导）
                </span>
                <span className="text-[11px] text-sky-600 font-bold">
                  当前形态：{currentFormMeta.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {CONJUGATION_FORMS_META.map(form => {
                  const isCurrent = form.key === selectedFormKey;
                  return (
                    <button
                      key={form.key}
                      onClick={() => {
                        setSelectedFormKey(form.key);
                        speakJapanese(selectedVerb.forms[form.key].result);
                      }}
                      className={`p-2.5 rounded-2xl text-left transition cursor-pointer flex flex-col justify-between gap-1 border ${
                        isCurrent
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {form.shortName}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-sky-100" />}
                      </div>
                      <span className={`text-[10px] line-clamp-1 ${isCurrent ? 'text-sky-100' : 'text-slate-400'}`}>
                        {form.formulaTag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 🎯 独家核心推导演练舞台 (The Visual Derivation Pipeline Stage) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-3xl border-2 border-sky-400/70 shadow-md p-5 sm:p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-100/60 to-transparent pointer-events-none rounded-bl-full" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-black">
                    推导进行中
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    【{selectedVerb.kanji}】➔【{currentFormMeta.name}】动态推导全过程
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {currentFormMeta.meaningTag}
                </span>
              </div>

              {/* 4 步可视化拆解推导流 (Visual Derivation Pipeline) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Step 1: 锁定词干 (Stem) */}
                <div className="sm:col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    第 1 步 · 锁定词干
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">
                    {currentDerivation.stem}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    保持不变的词基
                  </span>
                </div>

                {/* Arrow 1 */}
                <div className="sm:col-span-1 flex justify-center text-sky-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 2: 词尾跃迁/音便规则 (Transition Rule) */}
                <div className="sm:col-span-4 p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-center space-y-1">
                  <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">
                    第 2 步 · 假名段位跃迁 / 音便
                  </span>
                  <div className="text-xs font-black text-sky-950 leading-relaxed px-1">
                    {currentDerivation.stepExplanation}
                  </div>
                  {currentDerivation.soundEffectTag && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200 text-[10px] font-extrabold shadow-2xs">
                      ⚡ {currentDerivation.soundEffectTag}
                    </span>
                  )}
                </div>

                {/* Arrow 2 */}
                <div className="sm:col-span-1 flex justify-center text-sky-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 3: 最终变形结果 (Final Result) */}
                <div
                  onClick={() => speakJapanese(currentDerivation.result)}
                  className="sm:col-span-3 p-3.5 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-center space-y-1 shadow-md cursor-pointer hover:scale-102 transition duration-200 group"
                  title="点击朗读变形后发音"
                >
                  <span className="text-[10px] font-extrabold text-sky-200 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>最终变形</span>
                    <Volume2 className="w-3 h-3 group-hover:animate-pulse" />
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    {currentDerivation.result}
                  </div>
                  <span className="text-[11px] text-sky-100 font-bold block">
                    {currentDerivation.meaning}
                  </span>
                </div>

              </div>

              {/* 变形后全拼读与释义 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-400">推导形态：</span>
                  <span className="text-base font-black text-sky-700">
                    {currentDerivation.result}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    【{currentDerivation.furigana} · {currentDerivation.romaji}】
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    ➔ 释义：{currentDerivation.meaning}
                  </span>
                </div>

                <button
                  onClick={() => speakJapanese(currentDerivation.result)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-600 border border-slate-200 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>播放东京腔原声</span>
                </button>
              </div>

              {/* 考点避坑提示 (如果有) */}
              {currentDerivation.trapNotes && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>JLPT 考点避坑高能预警：</span>
                  </div>
                  <p className="text-xs font-medium text-amber-900/90 leading-relaxed pl-5">
                    {currentDerivation.trapNotes}
                  </p>
                </div>
              )}

              {/* 经典真题例句实战 */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  历届真题语境实战例句
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-base font-black text-slate-900 tracking-wide">
                      {currentDerivation.exampleJa}
                    </p>
                    <button
                      onClick={() => speakJapanese(currentDerivation.exampleJa)}
                      className="p-1.5 rounded-full bg-slate-50 hover:bg-sky-50 text-sky-600 border border-slate-200 shadow-2xs cursor-pointer transition shrink-0"
                      title="朗读真题例句"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentDerivation.exampleZh}
                  </p>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* 📑 当前动词全部 10 大变形全览矩阵 (Cheat Sheet Matrix) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div
                onClick={() => setShowFullMatrix(!showFullMatrix)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-sky-600 transition">
                    【{selectedVerb.kanji}】全部 10 大活用形态全览对照表
                  </h4>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    (涵盖辞书形、ます形、て形、た形、ない形、ば形、可能态、被动态、使役态、意志形)
                  </span>
                </div>
                <button className="p-1.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition">
                  {showFullMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showFullMatrix && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
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
                            ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-400/20'
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
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {detail.meaning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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
