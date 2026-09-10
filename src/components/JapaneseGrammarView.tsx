import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Volume2, 
  GitCompare, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Compass
} from 'lucide-react';
import { 
  JLPT_GRAMMAR_POINTS, 
  VERB_CONJUGATION_RULES, 
  PARTICLE_COMPARISONS, 
  JlptGrammarPoint 
} from '../data/japanese/jlptGrammar';
import { speakJapanese } from '../utils/speech';

interface JapaneseGrammarViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

export const JapaneseGrammarView: React.FC<JapaneseGrammarViewProps> = ({ isVip = false, onOpenVipModal }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'conjugation' | 'particles'>('library');
  const [selectedLevel, setSelectedLevel] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['jp-g-n5-01', 'jp-g-n4-01']);

  const filteredPoints = JLPT_GRAMMAR_POINTS.filter(p => {
    const matchesLevel = selectedLevel === '全部' || p.level === selectedLevel;
    const matchesSearch = !searchQuery.trim() ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.connection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              💡 体系化文法宝典
            </span>
            <span className="text-xs text-slate-400 font-medium">
              420+ 核心考点 · 动词10大活用变形 · 四大助词辨析
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JLPT 体系文法与动词活用
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            接续公式拆解 + 真实考题例句，彻底攻克动词变形与 は/が 助词难题！
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'library' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
            }`}
          >
            句型库
          </button>
          <button
            onClick={() => setActiveTab('conjugation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'conjugation' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
            }`}
          >
            动词10大变形
          </button>
          <button
            onClick={() => setActiveTab('particles')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'particles' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'
            }`}
          >
            四大助词辨析
          </button>
        </div>
      </div>

      {/* TAB 1: 句型库 */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          
          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['全部', 'N5', 'N4', 'N3', 'N2', 'N1'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索句型公式或中文释义..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          {/* Grammar Cards List */}
          <div className="space-y-3">
            {filteredPoints.map((p) => {
              const isExpanded = expandedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-sky-300"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(p.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                        {p.level}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans">
                            {p.pattern}
                          </h3>
                          <span className="text-xs font-bold text-slate-400">
                            [{p.category}]
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {p.meaning}
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-slate-100 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/40 space-y-4 text-xs">
                      
                      {/* Connection Formula */}
                      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-sky-950 flex items-center gap-2">
                        <span className="font-bold text-sky-900 shrink-0">🔗 接续方式：</span>
                        <span className="font-mono font-bold">{p.connection}</span>
                      </div>

                      {/* Detailed Explanation */}
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {p.explanation}
                      </p>

                      {p.comparisonNotes && (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-950">
                          <span className="font-bold text-amber-900">⚠️ 考点避坑：</span>
                          <span>{p.comparisonNotes}</span>
                        </div>
                      )}

                      {/* Examples */}
                      <div className="space-y-2 pt-1">
                        <span className="font-bold text-slate-700 block">📚 经典真题例句：</span>
                        {p.examples.map((ex, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-sm text-slate-900">{ex.ja}</p>
                              <button
                                onClick={() => speakJapanese(ex.ja)}
                                className="p-1 text-sky-600 hover:text-sky-700 cursor-pointer"
                                title="播放发音"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">{ex.furigana}</p>
                            <p className="text-xs text-slate-600">{ex.zh}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: 动词 10 大活用变形规则 */}
      {activeTab === 'conjugation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
            <span className="font-bold text-sky-900 text-sm block">
              ⚡ 日语动词活用核心秘籍：3大动词分类
            </span>
            <p>
              • <strong>1类动词 (五段动词)</strong>：词尾非「る」，或词尾是「る」但倒数第二个假名在「あ/う/お段」。(如: 書く, 泳ぐ, 飲む, 買う, 帰る)<br />
              • <strong>2类动词 (一段动词)</strong>：词尾是「る」，且倒数第二个假名在「い段」或「え段」。(如: 食べる, 見る)<br />
              • <strong>3类动词 (不规则)</strong>：只有两个：<strong>する (サ变)</strong> 和 <strong>来る (くる/カ变)</strong>。
            </p>
          </div>

          <div className="space-y-3">
            {VERB_CONJUGATION_RULES.map(rule => (
              <div key={rule.formName} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 text-sky-700">
                    {rule.formName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {rule.functionDesc}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">1类动词 (五段)</span>
                    <p className="text-slate-600 text-[11px]">{rule.rules.group1}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">2类动词 (一段)</span>
                    <p className="text-slate-600 text-[11px]">{rule.rules.group2}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700 block">3类动词 (不规则)</span>
                    <p className="text-slate-600 text-[11px]">{rule.rules.group3}</p>
                  </div>
                </div>

                {/* Samples */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-bold text-[11px]">代表范例：</span>
                  {rule.sample.map((s, idx) => (
                    <span
                      key={idx}
                      onClick={() => speakJapanese(s.conjugated)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold cursor-pointer transition flex items-center gap-1"
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

      {/* TAB 3: 四大助词辨析 */}
      {activeTab === 'particles' && (
        <div className="space-y-4">
          {PARTICLE_COMPARISONS.map(comp => (
            <div key={comp.title} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">{comp.title}</span>
                <span className="text-xs text-slate-400 font-medium">({comp.summary})</span>
              </div>

              <div className="space-y-2">
                {comp.points.map((pt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                    <span className="font-bold text-sky-700 block">⚡ {pt.aspect}：</span>
                    <p className="text-slate-700 leading-relaxed">{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export const GrammarView = JapaneseGrammarView;
