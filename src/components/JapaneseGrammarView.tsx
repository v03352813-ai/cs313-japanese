import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Volume2, 
  GitCompare, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Compass,
  CreditCard,
  List,
  Network,
  X
} from 'lucide-react';
import { 
  JLPT_GRAMMAR_POINTS, 
  VERB_CONJUGATION_RULES, 
  PARTICLE_COMPARISONS, 
  JlptGrammarPoint 
} from '../data/japanese/jlptGrammar';
import { speakJapanese } from '../utils/speech';
import { JapaneseGrammarVisualMindMap } from './JapaneseGrammarVisualMindMap';
import { JapaneseVerbConjugator } from './JapaneseVerbConjugator';

interface JapaneseGrammarViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
  initialTab?: 'library' | 'conjugation' | 'particles';
}

export const JapaneseGrammarView: React.FC<JapaneseGrammarViewProps> = ({ isVip = false, onOpenVipModal, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'conjugation' | 'particles'>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sub = urlParams.get('sub') || urlParams.get('tab');
      if (sub === 'conjugation' || sub === 'particles') return sub;
      if (window.location.hash.includes('conjugation')) return 'conjugation';
    }
    return 'library';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [selectedLevel, setSelectedLevel] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'focused' | 'list'>('focused');
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState<number>(0);
  const [expandedIds, setExpandedIds] = useState<string[]>(['jp-g-n5-01']);
  const [showMindMap, setShowMindMap] = useState<boolean>(true);
  const [isFullOverviewOpen, setIsFullOverviewOpen] = useState<boolean>(false);
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [modalActiveCategory, setModalActiveCategory] = useState<string>('全部');

  const filteredPoints = useMemo(() => {
    return JLPT_GRAMMAR_POINTS.filter(p => {
      const matchesLevel = selectedLevel === '全部' || p.level === selectedLevel;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        p.pattern.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.connection.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q);
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchQuery]);

  // 当前聚焦的单条语法卡片
  const activePoint = useMemo(() => {
    if (filteredPoints.length === 0) return null;
    return filteredPoints[currentGrammarIndex] || filteredPoints[0];
  }, [filteredPoints, currentGrammarIndex]);

  // 当筛选条件改变时重置索引
  useEffect(() => {
    if (currentGrammarIndex >= filteredPoints.length && filteredPoints.length > 0) {
      setCurrentGrammarIndex(0);
    }
  }, [filteredPoints.length, currentGrammarIndex]);

  const handlePrev = () => {
    if (filteredPoints.length <= 1) return;
    setCurrentGrammarIndex(prev => (prev > 0 ? prev - 1 : filteredPoints.length - 1));
  };

  const handleNext = () => {
    if (filteredPoints.length <= 1) return;
    setCurrentGrammarIndex(prev => (prev < filteredPoints.length - 1 ? prev + 1 : 0));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const expandAll = () => {
    setExpandedIds(filteredPoints.map(p => p.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const scrollToGrammar = (grammarId: string) => {
    setActiveTab('library');
    setSelectedLevel('全部');
    setSearchQuery('');
    setIsFullOverviewOpen(false);

    const targetIdx = JLPT_GRAMMAR_POINTS.findIndex(g => g.id === grammarId);
    if (targetIdx !== -1) {
      setCurrentGrammarIndex(targetIdx);
    }
    setExpandedIds([grammarId]);

    setTimeout(() => {
      const element = document.getElementById(grammarId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-sky-400/50');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-sky-400/50');
        }, 2000);
      }
    }, 150);
  };

  const modalFilteredPoints = useMemo(() => {
    return JLPT_GRAMMAR_POINTS.filter((p) => {
      const matchCat = 
        modalActiveCategory === '全部' || 
        p.category === modalActiveCategory || 
        p.level === modalActiveCategory;
      const q = modalSearchQuery.trim().toLowerCase();
      const matchQ = !q ||
        p.pattern.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.connection.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [modalActiveCategory, modalSearchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              💡 体系化文法宝典
            </span>
            <span className="text-xs text-slate-400 font-medium">
              72 权威核心考点大树 · 动词10大活用变形 · 四大助词深度辨析 · 全景思维导图
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JLPT 体系文法与动词活用
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            接续公式拆解 + 真实考题例句，彻底攻克动词变形与 は/が 助词难题！
          </p>
        </div>

        {/* Right Action Controls: Mindmap + Overview + Tab Switchers */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowMindMap(!showMindMap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs border cursor-pointer ${
              showMindMap
                ? 'bg-sky-500 text-white border-sky-600 shadow-sky-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>{showMindMap ? '收起导图' : '全景思维导图'}</span>
          </button>

          <button
            onClick={() => setIsFullOverviewOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>全体系通览 (72点)</span>
          </button>

          {/* Tab Switchers */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'library' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              句型库
            </button>
            <button
              onClick={() => setActiveTab('conjugation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'conjugation' ? 'bg-sky-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'conjugation' ? 'text-amber-200' : 'text-sky-500'}`} />
              <span>动词变形演练器</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
                activeTab === 'conjugation' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
              }`}>
                自研
              </span>
            </button>
            <button
              onClick={() => setActiveTab('particles')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'particles' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              四大助词辨析
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: 句型库 */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          
          {/* --- 全景日本语语法可视化思维导图 (Visual Tree Graph Mind Map) --- */}
          {showMindMap && (
            <JapaneseGrammarVisualMindMap
              onSelectGrammar={scrollToGrammar}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setTimeout(() => {
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }, 50);
              }}
              onOpenFullOverview={() => setIsFullOverviewOpen(true)}
            />
          )}

          {/* 🎯 下拉式快捷控制与直达工具栏 (全面采用下拉方式解决页面过长问题) */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3.5">
            
            {/* Top row: 搜索框 + 视图模式切换 (单条精读 1屏 vs 手风琴折叠列表) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索日语句型公式（如 〜てから, 〜なければならない）、接续或含义..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setViewMode('focused')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'focused'
                      ? 'bg-white text-sky-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="聚焦单张卡片精学，页面刚好一屏，绝不冗长"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>单条精读 (1屏)</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-sky-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="紧凑折叠列表，点击展开手风琴"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>手风琴列表</span>
                </button>
              </div>
            </div>

            {/* Bottom row: 双下拉选择器（级别下拉框 + 语法点直达下拉框） */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center">
              
              {/* 下拉框 1: 级别选择 */}
              <div className="sm:col-span-5 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>分级难度:</span>
                </span>
                <div className="relative flex-1 min-w-0">
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentGrammarIndex(0);
                    }}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    <option value="全部">全部级别 (420+ 考点全库)</option>
                    <option value="N5">🌱 JLPT N5 入门基础句型</option>
                    <option value="N4">🌿 JLPT N4 初级核心句型</option>
                    <option value="N3">🌲 JLPT N3 中级必考句型</option>
                    <option value="N2">🌳 JLPT N2 进阶高频句型</option>
                    <option value="N1">👑 JLPT N1 高级深度考点</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 下拉框 2: 语法点直达下拉选择器 */}
              <div className="sm:col-span-7 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
                  <BookOpenCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>考点直达:</span>
                </span>
                <div className="relative flex-1 min-w-0">
                  <select
                    value={activePoint?.id || ''}
                    onChange={(e) => {
                      const targetId = e.target.value;
                      const targetIdx = filteredPoints.findIndex(p => p.id === targetId);
                      if (targetIdx !== -1) {
                        setCurrentGrammarIndex(targetIdx);
                        setExpandedIds([targetId]);
                      }
                    }}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
                  >
                    {filteredPoints.map((item, idx) => (
                      <option key={item.id} value={item.id}>
                        {String(idx + 1).padStart(2, '0')}. {item.pattern} 【{item.level} · {item.category}】 - {item.meaning}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 模式 A：单条精读 (1屏沉浸闪卡模式) */}
          {/* ========================================================================= */}
          {viewMode === 'focused' && (
            <div>
              {activePoint ? (
                <div id={activePoint.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-5 animate-in fade-in duration-200 transition-all">
                  
                  {/* Top Header: 考点标头 + 快捷翻页控制器 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-black px-3 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 shrink-0 shadow-2xs">
                        {activePoint.level}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans truncate">
                            {activePoint.pattern}
                          </h2>
                          <button
                            onClick={() => speakJapanese(activePoint.pattern)}
                            className="p-1.5 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200/80 transition cursor-pointer shrink-0"
                            title="朗读句型"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-bold mt-0.5">
                          【{activePoint.category}】 {activePoint.meaning}
                        </p>
                      </div>
                    </div>

                    {/* Prev / Next Pagination Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                      <button
                        onClick={handlePrev}
                        disabled={filteredPoints.length <= 1}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 flex items-center gap-1 transition disabled:opacity-40 cursor-pointer shadow-2xs"
                        title="上一个考点"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>上一条</span>
                      </button>

                      <span className="text-xs font-mono font-black text-slate-600 px-2">
                        <span className="text-sky-600">{currentGrammarIndex + 1}</span> / {filteredPoints.length}
                      </span>

                      <button
                        onClick={handleNext}
                        disabled={filteredPoints.length <= 1}
                        className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black flex items-center gap-1 transition disabled:opacity-40 cursor-pointer shadow-xs"
                        title="下一个考点"
                      >
                        <span>下一条</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 接续方式公式框 */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-sky-950 flex items-start gap-2.5">
                    <span className="font-black text-sky-900 shrink-0 text-xs sm:text-sm pt-0.5">🔗 接续公式：</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-sky-900 leading-relaxed">
                      {activePoint.connection}
                    </span>
                  </div>

                  {/* 核心用法精析 */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      💡 核心用法精析
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      {activePoint.explanation}
                    </p>
                  </div>

                  {/* 考点避坑提示（如果有） */}
                  {activePoint.comparisonNotes && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-950 flex items-start gap-2 text-xs">
                      <span className="font-bold text-amber-900 shrink-0">⚠️ 考点避坑：</span>
                      <span className="leading-relaxed font-medium">{activePoint.comparisonNotes}</span>
                    </div>
                  )}

                  {/* 经典例句精读区 */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      📚 经典真题例句（配备东京腔真人发音）
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {activePoint.examples.map((ex, idx) => (
                        <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 hover:bg-slate-50 border border-slate-200/80 transition space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-black text-sm sm:text-base text-slate-900 tracking-wide">
                              {ex.ja}
                            </p>
                            <button
                              onClick={() => speakJapanese(ex.ja)}
                              className="p-1.5 rounded-full bg-white hover:bg-sky-50 text-sky-600 border border-slate-200 shadow-2xs cursor-pointer transition shrink-0"
                              title="朗读例句"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {ex.furigana}
                          </p>
                          <p className="text-xs text-slate-600 font-medium">
                            {ex.zh}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Bar: 快捷导航 */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>快捷掌握：直接使用上方下拉菜单秒切考点</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                      >
                        切换为手风琴全览列表 →
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <p className="text-sm font-bold text-slate-600">未找到符合条件的语法点</p>
                  <button
                    onClick={() => {
                      setSelectedLevel('全部');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    重置筛选条件
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 模式 B：手风琴折叠列表 */}
          {/* ========================================================================= */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              
              {/* List Header Toolbar */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>共找到 <strong className="text-sky-700 font-bold">{filteredPoints.length}</strong> 个文法考点</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAll}
                    className="px-2.5 py-1 rounded-lg font-bold text-slate-700 hover:text-sky-600 bg-slate-100 transition cursor-pointer"
                  >
                    展开全卡
                  </button>
                  <button
                    onClick={collapseAll}
                    className="px-2.5 py-1 rounded-lg font-bold text-slate-700 hover:text-sky-600 bg-slate-100 transition cursor-pointer"
                  >
                    全部折叠
                  </button>
                </div>
              </div>

              {filteredPoints.map((p) => {
                const isExpanded = expandedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    id={p.id}
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
          )}

        </div>
      )}

      {/* TAB 2: 独家研发 · 动词 10 大活用变形可视化演练推导工作台 */}
      {activeTab === 'conjugation' && (
        <JapaneseVerbConjugator
          isVip={isVip}
          onOpenVipModal={onOpenVipModal}
        />
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

      {/* ========================================================================= */}
      {/* 4. 全体系文法考点总览大表 Modal (Full Overview Modal) */}
      {/* ========================================================================= */}
      {isFullOverviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>日本语全景文法考点总览 (72核心考点大表)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-extrabold">
                      N5~N1 权威体系
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    涵盖品词基石、动词10大变形、核心格助词与逻辑复句大树 · 支持即时检索与一键定位
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFullOverviewOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition border border-transparent hover:border-slate-200 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div className="p-4 sm:px-6 border-b border-slate-100 space-y-3 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="在全体系中快速检索句型公式、含义或接续法则..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['全部', '助词体系', '动词活用', '时间顺序', '假定条件', '原因理由', '转折让步', '授受体系', '敬语规约', '建议忠告', '社会情理', '确信断定'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModalActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      modalActiveCategory === cat
                        ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/20 font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Scrollable Grid of Grammar Cards */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modalFilteredPoints.map((item) => {
                  const levelBg = 
                    item.level === 'N5' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.level === 'N4' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    item.level === 'N3' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    item.level === 'N2' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <div
                      key={item.id}
                      onClick={() => scrollToGrammar(item.id)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-400 hover:shadow-md hover:shadow-sky-500/5 transition cursor-pointer group flex flex-col justify-between space-y-2 select-none active:scale-98"
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

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition flex items-center justify-between">
                          <span>{item.pattern}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition" />
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                          {item.meaning}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <code className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded truncate max-w-[180px] border border-sky-100">
                          {item.connection}
                        </code>
                        <span className="text-sky-600 font-bold shrink-0">点击查看</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {modalFilteredPoints.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-sm">
                  未匹配到相关日语文法考点
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>当前已呈现 {modalFilteredPoints.length} 个考点（共 {JLPT_GRAMMAR_POINTS.length} 个）</span>
              <button
                onClick={() => setIsFullOverviewOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export const GrammarView = JapaneseGrammarView;
