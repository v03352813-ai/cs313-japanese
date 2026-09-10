import React, { useState, useMemo } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Volume2, 
  GitCompare, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Network,
  Compass,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { KOREAN_GRAMMAR_DATA, GRAMMAR_CATEGORIES } from '../data/korean/grammar';
import type { GrammarItem } from '../data/korean/grammar';
import { speakKorean } from '../utils/speech';
import { GrammarVisualMindMap } from './GrammarVisualMindMap';
import { GRAMMAR_COMPARE_DATA, type GrammarCompareItem } from '../data/korean/grammarComparison';

interface GrammarViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({ isVip, onOpenVipModal }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'comparison'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['g-001', 'g-004', 'g-011', 'g-018', 'g-023', 'g-031']);
  const [showMindMap, setShowMindMap] = useState<boolean>(false);
  const [isFullOverviewOpen, setIsFullOverviewOpen] = useState<boolean>(false);
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [modalActivePillar, setModalActivePillar] = useState<string>('全部');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const filteredGrammar = useMemo(() => {
    return KOREAN_GRAMMAR_DATA.filter((item) => {
      const matchCat = 
        selectedCategory === '全部' || 
        item.category === selectedCategory || 
        item.level === selectedCategory ||
        (item.tags && item.tags.includes(selectedCategory));
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.meaning.toLowerCase().includes(query) ||
        item.structure.toLowerCase().includes(query) ||
        item.explanation.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(filteredGrammar.map(g => g.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const scrollToGrammar = (grammarId: string) => {
    // 1. Reset filter so target item is 100% visible
    setSelectedCategory('全部');
    setSearchQuery('');
    setIsFullOverviewOpen(false);

    // 2. Expand target item
    setExpandedIds(prev => Array.from(new Set([...prev, grammarId])));

    // 3. Smoothly scroll into view with highlighting pulse
    setTimeout(() => {
      const element = document.getElementById(grammarId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-orange-400/50');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-orange-400/50');
        }, 1800);
      }
    }, 120);
  };

  // Grouped data for Full System Overview Modal
  const modalFilteredItems = useMemo(() => {
    return KOREAN_GRAMMAR_DATA.filter((item) => {
      const matchPillar = 
        modalActivePillar === '全部' || 
        item.category === modalActivePillar || 
        (item.tags && item.tags.includes(modalActivePillar));
      const q = modalSearchQuery.trim().toLowerCase();
      const matchQ = !q || 
        item.title.toLowerCase().includes(q) || 
        item.meaning.toLowerCase().includes(q) ||
        item.structure.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q);
      return matchPillar && matchQ;
    });
  }, [modalActivePillar, modalSearchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* 顶部轻量步骤导引条 */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            <BookOpenCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-black">
                语法考点库
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                TOPIK 体系化语法宝典 · 考点速查与深度辨析
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              涵盖初/中/高级 68 大核心语法树 + 接续公式 + 相似语法深度辨析
            </p>
          </div>
        </div>

        {/* 顶部右侧快捷开关 */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setShowMindMap(!showMindMap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs border cursor-pointer ${
              showMindMap
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>{showMindMap ? '收起导图' : '全景思维导图'}</span>
          </button>

          <button
            onClick={() => setIsFullOverviewOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>全体系通览 (68点)</span>
          </button>

          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs">
            <button
              onClick={expandAll}
              className="px-2.5 py-1 rounded-lg font-bold text-slate-700 hover:text-orange-600 transition cursor-pointer"
            >
              展开全卡
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1 rounded-lg font-bold text-slate-700 hover:text-orange-600 transition cursor-pointer"
            >
              折叠
            </button>
          </div>
        </div>
      </div>

      {/* Tab Switcher: 体系语法库 vs 易混语法深度对比 */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeTab === 'library'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>体系化核心语法宝典 (68大考点树)</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GitCompare className="w-4 h-4 text-orange-500" />
          <span>TOPIK 核心易混语法深度对比矩阵 (高分提分利器)</span>
        </button>
      </div>

      {/* Mode 1: Comparison Matrix View */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-orange-50/70 p-3.5 sm:p-4 rounded-2xl border border-orange-200 text-xs text-slate-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>🎯 考官最爱考的易混淆语法深度对照：精准拆解主语一致性、时态接续限制与消极/积极结果差异！</span>
            <span className="text-[11px] text-orange-700 font-medium shrink-0">每组均配备考场避坑警示与实战速练</span>
          </div>

          <div className="space-y-6">
            {GRAMMAR_COMPARE_DATA.map((item, idx) => {
              const selectedOpt = quizAnswers[item.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === item.quizQuestion.correctIndex;
              const isFreePreview = idx === 0;
              const isLocked = !isVip && !isFreePreview;

              return (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5 relative">
                  
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-black border border-orange-200">
                        {item.level}
                      </span>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>{item.title}</span>
                        {isFreePreview && (
                          <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                            免费体验
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 text-amber-600" /> VIP专享
                          </span>
                        )}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.description}</span>
                  </div>

                  {isLocked ? (
                    <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">该组易混淆矩阵为 VIP 专属高分提分模块</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          开通 VIP 即可解锁【{item.title}】的 3 维语法接续限制、考官避坑警示及考点自测题
                        </p>
                      </div>
                      <button
                        onClick={() => onOpenVipModal(`🔒【${item.title}】语法对比矩阵为 VIP 专属高分模块！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部易混语法对比、避坑警示与考点自测！`)}
                        className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md transition active:scale-98 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>立即解锁全部语法对比矩阵 (¥49.9)</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Side-by-Side Comparison Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.grammars.map((g, gIdx) => (
                      <div key={gIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-black text-orange-600 font-mono">{g.name}</span>
                            <button
                              onClick={() => speakKorean(g.exampleKo)}
                              className="p-1.5 rounded-lg bg-white text-slate-500 hover:text-orange-600 transition shadow-2xs cursor-pointer"
                              title="朗读例句"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-black text-slate-800">{g.meaning}</p>
                          <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                            <p><strong className="text-slate-700">📌 接续条件：</strong>{g.condition}</p>
                            <p><strong className="text-red-600">⚠️ 严格限制：</strong>{g.limitation}</p>
                          </div>
                        </div>

                        {/* Example */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 space-y-1">
                          <p className="text-xs font-bold text-slate-900 leading-relaxed">{g.exampleKo}</p>
                          <p className="text-[11px] text-slate-500">{g.exampleZh}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Examiner Trap Warning */}
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item.trapWarning}</span>
                  </div>

                  {/* Interactive Mini Quiz */}
                  <div className="bg-slate-50 border border-slate-200/90 text-slate-900 p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                      考点即学即练 (点击选项测试)
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{item.quizQuestion.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.quizQuestion.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let btnStyle = 'bg-white text-slate-700 hover:bg-orange-50/60 border-slate-200 hover:border-orange-300';
                        if (isAnswered) {
                          if (optIdx === item.quizQuestion.correctIndex) {
                            btnStyle = 'bg-emerald-500 text-white font-black border-emerald-500';
                          } else if (isChosen) {
                            btnStyle = 'bg-red-500 text-white font-bold border-red-500';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [item.id]: optIdx }))}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition text-left cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{optIdx + 1}. {opt}</span>
                            {isAnswered && optIdx === item.quizQuestion.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${
                        isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {isCorrect ? '🎉 回答正确！' : '❌ 回答错误！'}
                        <p className="font-normal text-[11px] text-slate-600 mt-1">{item.quizQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Standard Library View */}
      {activeTab === 'library' && (
        <>
          {/* --- 全景韩语语法可视化思维导图 (Visual Tree Graph Mind Map) --- */}
          {showMindMap && (
            <GrammarVisualMindMap
              onSelectGrammar={scrollToGrammar}
              onOpenFullOverview={() => setIsFullOverviewOpen(true)}
            />
          )}

          {/* Filter and Search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索语法名称（如 은/는, -아서/어서, -느라고）、接续公式或中文含义..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              {GRAMMAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20 font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Grammar Cards List (Only in Library mode) */}
      {activeTab === 'library' && (
      <div className="space-y-4">
        {filteredGrammar.length > 0 ? (
          filteredGrammar.map((item) => {
            const isExpanded = expandedIds.includes(item.id);
            const levelColor = 
              item.level === '初级' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              item.level === '中级' ? 'bg-orange-50 text-orange-700 border-orange-200' :
              'bg-slate-100 text-slate-800 border-slate-200';

            return (
              <div 
                id={item.id}
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition hover:border-slate-300"
              >
                {/* Card Header (Clickable) */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-slate-50/50 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${levelColor}`}>
                        {item.level}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {item.category}
                      </span>
                      {item.tags && item.tags.filter(t => t !== item.category && t !== item.level).map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-medium border border-orange-100">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                    </h2>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <span className="font-semibold text-slate-700">接续公式：</span>
                      <code className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/50 font-mono text-xs font-semibold">
                        {item.structure}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Card Body (Collapsible) */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                    
                    {/* Meaning & Explanation */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">语法含义与详解</h4>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.meaning}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>

                    {/* Example Sentences */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">地道生活例句</h4>
                      <div className="space-y-2">
                        {item.examples.map((ex, idx) => (
                          <div 
                            key={idx}
                            className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 group"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {ex.ko}
                              </p>
                              <p className="text-xs text-slate-500">
                                {ex.zh}
                              </p>
                            </div>
                            <button
                              onClick={() => speakKorean(ex.ko)}
                              className="p-2 rounded-xl text-slate-400 group-hover:text-orange-600 group-hover:bg-orange-50 transition shrink-0"
                              title="朗读例句"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Diff Check Box (If available) */}
                    {item.diffCheck && (
                      <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <GitCompare className="w-4 h-4 text-amber-600" />
                          <span>易混淆辨析：对比【{item.diffCheck.compareWith}】</span>
                        </div>
                        <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                          {item.diffCheck.difference}
                        </p>
                      </div>
                    )}

                    {/* Tips (If available) */}
                    {item.tips && (
                      <div className="flex items-start gap-2 bg-orange-50/60 p-3 rounded-xl border border-orange-200/60 text-xs text-orange-900">
                        <Lightbulb className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{item.tips}</span>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-slate-500 font-medium">未找到符合条件的语法点</p>
            <button
              onClick={() => { setSelectedCategory('全部'); setSearchQuery(''); }}
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>
      )}

      {/* --- 全体系通览知识大纲 Modal (Full System Grammar Overview Modal) --- */}
      {isFullOverviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-orange-50/60 to-amber-50/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>韩语全体系核心语法大纲 (全景 68 考点)</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-extrabold">
                      TOPIK I & II
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">点击任意知识点，即刻跳转主页面平滑定位并展开深度详解</p>
                </div>
              </div>

              <button
                onClick={() => setIsFullOverviewOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition border border-transparent hover:border-slate-200 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-filter & Search */}
            <div className="p-4 sm:px-6 border-b border-slate-100 space-y-3 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="在全体系中快速检索语法名称、公式或中文释义..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['全部', '助词篇', '终结词尾', '连接词尾', '原因/因果', '转折/让步', '推测/可能', '假定/条件', '意图/目的', '间接引语', '高级句型'].map((pil) => (
                  <button
                    key={pil}
                    onClick={() => setModalActivePillar(pil)}
                    className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      modalActivePillar === pil
                        ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20 font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {pil}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Scrollable Grid of 68 points */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modalFilteredItems.map((item) => {
                  const levelBg = 
                    item.level === '初级' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.level === '中级' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-slate-100 text-slate-800 border-slate-200';

                  return (
                    <div
                      key={item.id}
                      onClick={() => scrollToGrammar(item.id)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition cursor-pointer group flex flex-col justify-between space-y-2 select-none active:scale-98"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${levelBg}`}>
                            {item.level}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.category}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center justify-between">
                          <span>{item.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition" />
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.meaning}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <code className="text-orange-700 bg-orange-50/80 px-1.5 py-0.5 rounded truncate max-w-[180px]">
                          {item.structure}
                        </code>
                        <span className="text-orange-600 font-semibold shrink-0">点击详解</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {modalFilteredItems.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  未匹配到相关语法考点
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>当前已呈现 {modalFilteredItems.length} 个考点（共 68 个）</span>
              <button
                onClick={() => setIsFullOverviewOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Free User Grammar VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【初级核心语法与因果对比 · 免费体验】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），即可解锁全套 <strong>70+ 核心考纲语法宝典</strong>、全景考点思维导图与考官避坑对比矩阵！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁全套 68 大核心考纲语法宝典、全景考点思维导图与易混语法三维对比矩阵！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部语法宝典 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};
