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

const KANA_ELEVATOR_FAMILIES: Record<string, { family: string; kanas: Record<number, { kana: string; romaji: string }> }> = {
  'く': {
    family: 'か行',
    kanas: {
      1: { kana: 'か', romaji: 'ka' },
      2: { kana: 'き', romaji: 'ki' },
      3: { kana: 'く', romaji: 'ku' },
      4: { kana: 'け', romaji: 'ke' },
      5: { kana: 'こ', romaji: 'ko' }
    }
  },
  'ぐ': {
    family: 'が行',
    kanas: {
      1: { kana: 'が', romaji: 'ga' },
      2: { kana: 'ぎ', romaji: 'gi' },
      3: { kana: 'ぐ', romaji: 'gu' },
      4: { kana: 'げ', romaji: 'ge' },
      5: { kana: 'ご', romaji: 'go' }
    }
  },
  'す': {
    family: 'さ行',
    kanas: {
      1: { kana: 'さ', romaji: 'sa' },
      2: { kana: 'し', romaji: 'shi' },
      3: { kana: 'す', romaji: 'su' },
      4: { kana: 'せ', romaji: 'se' },
      5: { kana: 'そ', romaji: 'so' }
    }
  },
  'つ': {
    family: 'た行',
    kanas: {
      1: { kana: 'た', romaji: 'ta' },
      2: { kana: 'ち', romaji: 'chi' },
      3: { kana: 'つ', romaji: 'tsu' },
      4: { kana: 'て', romaji: 'te' },
      5: { kana: 'と', romaji: 'to' }
    }
  },
  'ぬ': {
    family: 'な行',
    kanas: {
      1: { kana: 'な', romaji: 'na' },
      2: { kana: 'に', romaji: 'ni' },
      3: { kana: 'ぬ', romaji: 'nu' },
      4: { kana: 'ね', romaji: 'ne' },
      5: { kana: 'の', romaji: 'no' }
    }
  },
  'ぶ': {
    family: 'ば行',
    kanas: {
      1: { kana: 'ば', romaji: 'ba' },
      2: { kana: 'び', romaji: 'bi' },
      3: { kana: 'ぶ', romaji: 'bu' },
      4: { kana: 'べ', romaji: 'be' },
      5: { kana: 'ぼ', romaji: 'bo' }
    }
  },
  'む': {
    family: 'ま行',
    kanas: {
      1: { kana: 'ま', romaji: 'ma' },
      2: { kana: 'み', romaji: 'mi' },
      3: { kana: 'む', romaji: 'mu' },
      4: { kana: 'め', romaji: 'me' },
      5: { kana: 'も', romaji: 'mo' }
    }
  },
  'る': {
    family: 'ら行',
    kanas: {
      1: { kana: 'ら', romaji: 'ra' },
      2: { kana: 'り', romaji: 'ri' },
      3: { kana: 'る', romaji: 'ru' },
      4: { kana: 'れ', romaji: 're' },
      5: { kana: 'ろ', romaji: 'ro' }
    }
  },
  'う': {
    family: 'あ行',
    kanas: {
      1: { kana: 'わ', romaji: 'wa' },
      2: { kana: 'い', romaji: 'i' },
      3: { kana: 'う', romaji: 'u' },
      4: { kana: 'え', romaji: 'e' },
      5: { kana: 'お', romaji: 'o' }
    }
  }
};

const FORM_FLOOR_MAP: Record<ConjugationFormKey, { targetFloor?: number; floorName: string; elevatorHint: string }> = {
  dict: { targetFloor: 3, floorName: '3 楼 (u段)', elevatorHint: '原形停留 3 楼 (u段)' },
  masu: { targetFloor: 2, floorName: '2 楼 (い段)', elevatorHint: '🛗 降2楼(い段)+ます' },
  te: { elevatorHint: '音便 (促/拨/イ便)' },
  ta: { elevatorHint: '过去完成 (同て形)' },
  nai: { targetFloor: 1, floorName: '1 楼 (あ段)', elevatorHint: '🛗 降1楼(あ段)+ない' },
  ba: { targetFloor: 4, floorName: '4 楼 (え段)', elevatorHint: '🛗 升4楼(え段)+ば' },
  potential: { targetFloor: 4, floorName: '4 楼 (え段)', elevatorHint: '🛗 升4楼(え段)+る' },
  passive: { targetFloor: 1, floorName: '1 楼 (あ段)', elevatorHint: '🛗 降1楼(あ段)+れる' },
  causative: { targetFloor: 1, floorName: '1 楼 (あ段)', elevatorHint: '🛗 降1楼(あ段)+せる' },
  volitional: { targetFloor: 5, floorName: '5 楼 (お段)', elevatorHint: '🛗 升5楼(お段)+う' },
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
  const [showElevatorGuide, setShowElevatorGuide] = useState<boolean>(true);
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
      {/* 🛗 独家自研 · 动词活用推导中心 & 坐电梯法则速查 */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/20 rounded-3xl p-5 sm:p-6 border border-sky-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/70 flex items-center justify-center text-base shadow-2xs">
                🛗
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>动词活用推导 ·【坐电梯法则】速查指南</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-bold text-xs shadow-2xs">
                独家自研教学法 · 1分钟秒懂
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              <strong className="text-sky-700">核心心法：</strong>所有日语动词原形，尾巴全住在 <strong>3 楼（u段）</strong>！所谓变形，就是词尾坐电梯上下楼，再贴个新尾巴！
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {/* 视图切换 */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
              <button
                onClick={() => setViewMode('workbench')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'rules'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>全景法则宝典</span>
              </button>
            </div>

            {/* 收起 / 展开 说明 */}
            <button
              onClick={() => setShowElevatorGuide(!showElevatorGuide)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer border border-slate-200/80 shadow-2xs"
            >
              {showElevatorGuide ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              <span>{showElevatorGuide ? '收起法则' : '展开法则'}</span>
            </button>
          </div>
        </div>

        {showElevatorGuide && (
          <div className="space-y-3 pt-3 border-t border-sky-100 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-amber-300 hover:shadow-xs transition">
                <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                  <span>🏢 1. 为什么叫【坐电梯】？</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  看五十音图的纵向 5 个假名（あ/い/う/え/お），就像一栋 <strong className="text-slate-900">5 层的电梯楼</strong>！
                  查字典的原形词尾（如 <strong className="text-slate-800">書く、飲む、話す</strong>），其尾巴<strong className="text-amber-800 font-bold">全都住在 3 楼（u段）</strong>，这是所有变形的始发站。
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-sky-300 hover:shadow-xs transition">
                <div className="flex items-center gap-2 font-black text-sm text-sky-900">
                  <span>🛗 2. 去哪一层变什么形态？</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1 font-medium leading-relaxed">
                  <li>• <strong className="text-sky-700 font-bold">升4楼 (え段) + る</strong> ➔ 【可能态：能写/会喝】</li>
                  <li>• <strong className="text-rose-700 font-bold">降1楼 (あ段) + ない</strong> ➔ 【否定形：不写/不喝】</li>
                  <li>• <strong className="text-purple-700 font-bold">降1楼 (あ段) + れる</strong> ➔ 【被动态：被写/被喝】</li>
                  <li>• <strong className="text-indigo-700 font-bold">升5楼 (お段) + う</strong> ➔ 【意志形：写吧/喝吧】</li>
                  <li>• <strong className="text-teal-700 font-bold">降2楼 (い段) + ます</strong> ➔ 【礼貌形：敬语客气】</li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-300 hover:shadow-xs transition">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                  <span>🪄 3. 一段动词与不规则</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  • <strong className="text-emerald-800 font-bold">一段动词（食べる/見る）</strong>：最省心！<strong className="text-slate-900">不坐电梯</strong>，直接摘掉尾巴「る」，贴上对应新尾巴！<br />
                  • <strong className="text-purple-800 font-bold">不规则（する/来る）</strong>：超级变色龙，全语系就这两个，直接当独立单词熟记。
                </p>
              </div>
            </div>

            {/* Card 4: 常驻五段动词 て形 / た形 音便速记歌 (全网自学最有效口诀) */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/90 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>🎵 考试终极通关秘籍：五段动词【て形 / た形 音便速记歌】</span>
                </div>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  考级必考铁律
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="font-black text-amber-800 block">う・つ・る ➔ って</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">買う➔買って / 待つ➔待って</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="font-black text-amber-800 block">む・ぶ・ぬ ➔ んで</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">飲む➔飲んで / 遊ぶ➔遊んで</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="font-black text-amber-800 block">く ➔ いて</span>
                  <span className="text-[10px] text-rose-500 font-bold mt-0.5 block">書く➔書いて (特例: 行く➔行って)</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="font-black text-amber-800 block">ぐ ➔ いде</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">急ぐ➔急いで</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs col-span-2 sm:col-span-1">
                  <span className="font-black text-amber-800 block">す ➔ して</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">話す➔話して</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
                        {FORM_FLOOR_MAP[form.key]?.elevatorHint || form.formulaTag}
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
                  STEP 02 · 假名段位跃迁 (🛗 坐电梯)
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

            {/* ========================================================================= */}
            {/* 🛗 【坐电梯法则】实时推演舱 (The Interactive Elevator Visualizer) */}
            {/* ========================================================================= */}
            {(() => {
              const endingChar = selectedVerb.forms.dict.originalEnding;
              const currentFamily = endingChar ? KANA_ELEVATOR_FAMILIES[endingChar] : undefined;
              const currentFloorMeta = FORM_FLOOR_MAP[selectedFormKey];

              if (selectedVerb.group === 'group1_godan' && currentFamily && currentFloorMeta) {
                return (
                  <div className="bg-gradient-to-r from-sky-50/90 via-indigo-50/50 to-sky-50/90 rounded-2xl p-4 sm:p-5 border border-sky-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-sky-500 text-white font-black text-xs">
                          🛗
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          【坐电梯法则】现场推演：动词尾巴「{endingChar}」的 5 楼升降轨迹
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>点击任意楼层假名即时收听标准音</span>
                      </div>
                    </div>

                    {/* 5 层电梯水平指示轨道 */}
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {[1, 2, 3, 4, 5].map((flNum) => {
                        const kanaItem = currentFamily.kanas[flNum];
                        const isStart = flNum === 3;
                        const isTarget = flNum === currentFloorMeta.targetFloor;
                        const danName = flNum === 1 ? 'あ段' : flNum === 2 ? 'い段' : flNum === 3 ? 'う段' : flNum === 4 ? 'え段' : 'お段';

                        return (
                          <button
                            key={flNum}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(kanaItem.kana);
                            }}
                            className={`p-2 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer relative flex flex-col items-center justify-between gap-1 group/fl ${
                              isTarget
                                ? 'bg-gradient-to-b from-sky-500 to-indigo-600 text-white border-transparent shadow-md ring-2 ring-sky-300 scale-103 z-10'
                                : isStart
                                ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-2xs hover:bg-amber-100'
                                : 'bg-white hover:bg-slate-100/90 border-slate-200 text-slate-700'
                            }`}
                            title={`点击朗读: ${kanaItem.kana}`}
                          >
                            {isTarget && (
                              <span className="absolute -top-2.5 px-2 py-0.2 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] shadow-xs animate-bounce">
                                🎯 到达 {flNum}F
                              </span>
                            )}
                            {isStart && !isTarget && (
                              <span className="absolute -top-2 px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold text-[8px] shadow-2xs">
                                🚪 起点 3F
                              </span>
                            )}

                            <div className="text-[10px] font-extrabold opacity-80">
                              {flNum}F · {danName}
                            </div>
                            <div className="text-lg sm:text-2xl font-black font-mono my-0.5">
                              {kanaItem.kana}
                            </div>
                            <div className={`text-[10px] font-mono ${isTarget ? 'text-sky-100' : 'text-slate-400'}`}>
                              {kanaItem.romaji}
                            </div>
                            <div className={`text-[9px] truncate w-full font-bold pt-1 border-t ${
                              isTarget ? 'border-white/20 text-sky-100' : 'border-slate-100 text-slate-500'
                            }`}>
                              {flNum === 1 ? '否定/被动' : flNum === 2 ? 'ます形' : flNum === 3 ? '辞书原形' : flNum === 4 ? '可能/假定' : '意志形'}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* 底部电梯调度解说 */}
                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sky-700">🛗 电梯轨迹：</span>
                        <span>原形尾巴「{endingChar}」住在 <strong>3楼 (u段)</strong></span>
                        {currentFloorMeta.targetFloor ? (
                          currentFloorMeta.targetFloor === 3 ? (
                            <span>➔ 原形起点，停留在 3 楼。</span>
                          ) : currentFloorMeta.targetFloor > 3 ? (
                            <span>➔ 坐电梯<strong>向上升到 {currentFloorMeta.targetFloor} 楼 ({currentFloorMeta.floorName})「<strong className="text-sky-600 font-mono">{currentFamily.kanas[currentFloorMeta.targetFloor].kana}</strong>」</strong>，再接后缀「<strong className="text-indigo-600">{currentDerivation.connectionEnding || '无'}</strong>」！</span>
                          ) : (
                            <span>➔ 坐电梯<strong>向下降到 {currentFloorMeta.targetFloor} 楼 ({currentFloorMeta.floorName})「<strong className="text-sky-600 font-mono">{currentFamily.kanas[currentFloorMeta.targetFloor].kana}</strong>」</strong>，再接后缀「<strong className="text-indigo-600">{currentDerivation.connectionEnding || '无'}</strong>」！</span>
                          )
                        ) : (
                          <span>➔ {currentFormMeta.shortName}（发生特殊音便，不走常规楼层，直接发生音便脱落/变音）。</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        所属家族：{currentFamily.family}
                      </span>
                    </div>
                  </div>
                );
              }

              if (selectedVerb.group === 'group2_ichidan') {
                return (
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-600 text-white font-black text-xs">
                        🪄
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                        一段动词专属法则：【不坐电梯，直接摘掉尾巴「る」！】
                      </h4>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-700 font-medium flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400 line-through">{selectedVerb.kanji}</span>
                        <span>➔</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">摘掉「る」留词干「{currentDerivation.stem}」</span>
                        <span>➔</span>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">贴上新后缀「{currentDerivation.connectionEnding || '无'}」</span>
                        <span>➔</span>
                        <span className="text-emerald-700 font-black font-mono text-sm">{currentDerivation.result}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        比五段简单 10 倍！
                      </span>
                    </div>
                  </div>
                );
              }

              if (selectedVerb.group === 'group3_irregular') {
                return (
                  <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-purple-600 text-white font-black text-xs">
                        🦎
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-purple-950">
                        3类不规则动词：【特殊变色龙，全语系就两个】
                      </h4>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-purple-100 text-xs text-slate-700 font-medium flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500">{selectedVerb.kanji}</span>
                        <span>➔ 当前异化为 ➔</span>
                        <span className="text-purple-700 font-black font-mono text-sm">{currentDerivation.result}</span>
                        <span className="text-slate-400 font-mono">({currentDerivation.furigana})</span>
                      </div>
                      <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">
                        作为特例独立熟记
                      </span>
                    </div>
                  </div>
                );
              }

              return null;
            })()}

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
