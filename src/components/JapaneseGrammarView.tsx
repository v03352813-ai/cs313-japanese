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
  X
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
  const [viewMode, setViewMode] = useState<'focused' | 'list'>('focused');
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState<number>(0);
  const [expandedIds, setExpandedIds] = useState<string[]>(['jp-g-n5-01']);

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
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
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
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-5 animate-in fade-in duration-200">
                  
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
