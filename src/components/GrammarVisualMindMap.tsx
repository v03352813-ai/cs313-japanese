import React, { useState, useRef } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

interface MindMapNode {
  id: string;
  label: string;
  subLabel?: string;
  grammarId?: string; // If set, clicking will jump to card
  color: 'orange' | 'amber' | 'slate' | 'emerald';
  children?: MindMapNode[];
}

const MIND_MAP_TREE_DATA: MindMapNode = {
  id: 'root',
  label: '🇰🇷 韩语核心语法全景体系',
  subLabel: 'TOPIK I & II (68大必考点全景大树)',
  color: 'orange',
  children: [
    // Branch 1: 助词体系 (조사)
    {
      id: 'branch-particles',
      label: '① 助词体系 (조사)',
      subLabel: '名词后粘着，决定句子成分与语气',
      color: 'orange',
      children: [
        {
          id: 'sub-case-particles',
          label: '主格·宾格·时空格',
          color: 'orange',
          children: [
            { id: 'leaf-g001', label: '은/는', subLabel: '主题与对比', grammarId: 'g-001', color: 'orange' },
            { id: 'leaf-g002', label: '이/가', subLabel: '主格焦点', grammarId: 'g-002', color: 'orange' },
            { id: 'leaf-g003', label: '을/를', subLabel: '宾格对象', grammarId: 'g-003', color: 'orange' },
            { id: 'leaf-g004', label: '에 / 에서', subLabel: '时空与场所', grammarId: 'g-004', color: 'orange' },
            { id: 'leaf-g005', label: '에게/한테/께', subLabel: '给予对象', grammarId: 'g-005', color: 'orange' },
            { id: 'leaf-g006', label: '(으)로', subLabel: '工具与方向', grammarId: 'g-006', color: 'orange' }
          ]
        },
        {
          id: 'sub-aux-particles',
          label: '副助词·限定与让步',
          color: 'orange',
          children: [
            { id: 'leaf-g007', label: '과/와·하고·(이)랑', subLabel: '并列与伴随', grammarId: 'g-007', color: 'orange' },
            { id: 'leaf-g008', label: '만 / 밖에', subLabel: '唯一与否定限定', grammarId: 'g-008', color: 'orange' },
            { id: 'leaf-g009', label: '부터 / 까지', subLabel: '时空起止', grammarId: 'g-009', color: 'orange' },
            { id: 'leaf-g010', label: '조차 / 마저', subLabel: '极端让步排斥', grammarId: 'g-010', color: 'orange' }
          ]
        }
      ]
    },

    // Branch 2: 终结词尾与日常口语 (종결어미 & 구어표현)
    {
      id: 'branch-endings',
      label: '② 终结词尾与口语日常 (종결어미)',
      subLabel: '句末形态变位，决定敬语级别、语气态度与高频口语',
      color: 'amber',
      children: [
        {
          id: 'sub-formal-endings',
          label: '日常敬语与格式体',
          color: 'amber',
          children: [
            { id: 'leaf-g011', label: '-아/어요', subLabel: '日常非格式体', grammarId: 'g-011', color: 'amber' },
            { id: 'leaf-g012', label: '-(스)ㅂ니다/니까', subLabel: '庄重格式体', grammarId: 'g-012', color: 'amber' }
          ]
        },
        {
          id: 'sub-mood-endings',
          label: '意图·疑问·感叹·后悔',
          color: 'amber',
          children: [
            { id: 'leaf-g013', label: '-(으)ㄹ게요', subLabel: '说话人即时承诺', grammarId: 'g-013', color: 'amber' },
            { id: 'leaf-g014', label: '-(으)ㄹ까요?', subLabel: '征求意见与推测', grammarId: 'g-014', color: 'amber' },
            { id: 'leaf-g015', label: '-잖아요', subLabel: '提醒已知事实', grammarId: 'g-015', color: 'amber' },
            { id: 'leaf-g016', label: '-군요 / -네요', subLabel: '领悟与直观感叹', grammarId: 'g-016', color: 'amber' },
            { id: 'leaf-g017', label: '-(으)ㄹ걸 그랬다', subLabel: '过去后悔与惋惜', grammarId: 'g-017', color: 'amber' }
          ]
        },
        {
          id: 'sub-spoken-endings',
          label: '🔥 生活日常高频口语语气',
          color: 'amber',
          children: [
            { id: 'leaf-g-sp01', label: '-(으)ㄹ래요?', subLabel: '口语邀约·要不要一起', grammarId: 'g-014', color: 'amber' },
            { id: 'leaf-g-sp02', label: '-더라고(요)', subLabel: '亲历回想·我当时发现', grammarId: 'g-016', color: 'amber' },
            { id: 'leaf-g-sp03', label: '-거든(요)', subLabel: '口语解释·那是因为嘛', grammarId: 'g-047', color: 'amber' },
            { id: 'leaf-g-sp04', label: '-(으)ㄹ 테니까', subLabel: '分工承诺·我来做所以你', grammarId: 'g-041', color: 'amber' },
            { id: 'leaf-g-sp05', label: '-다니 / -(이)라니', subLabel: '不可思议·居然竟然', grammarId: 'g-058', color: 'amber' }
          ]
        }
      ]
    },

    // Branch 3: 连接词尾与逻辑复句 (연결어미)
    {
      id: 'branch-connectives',
      label: '③ 连接词尾与复句 (연결어미)',
      subLabel: '前后句连接，主从复句与逻辑关联',
      color: 'slate',
      children: [
        {
          id: 'sub-sequence',
          label: '顺承·并列·时间紧接',
          color: 'slate',
          children: [
            { id: 'leaf-g018', label: '-고', subLabel: '并列与时间先后', grammarId: 'g-018', color: 'slate' },
            { id: 'leaf-g019', label: '-(으)며', subLabel: '书面体兼有顺承', grammarId: 'g-019', color: 'slate' },
            { id: 'leaf-g020', label: '-(으)면서', subLabel: '同时进行/前后矛盾', grammarId: 'g-020', color: 'slate' },
            { id: 'leaf-g021', label: '-자마자', subLabel: '紧接一...就...', grammarId: 'g-021', color: 'slate' },
            { id: 'leaf-g022', label: '-았/었다가', subLabel: '动作完成后转向', grammarId: 'g-022', color: 'slate' }
          ]
        },
        {
          id: 'sub-cause',
          label: '原因·因果逻辑辨析',
          color: 'slate',
          children: [
            { id: 'leaf-g023', label: '-아서/어서', subLabel: '客观因果与紧密承接', grammarId: 'g-023', color: 'slate' },
            { id: 'leaf-g024', label: '-(으)니까', subLabel: '主观理由与新发现', grammarId: 'g-024', color: 'slate' },
            { id: 'leaf-g025', label: '-(으)므로', subLabel: '正式公文权威因果', grammarId: 'g-025', color: 'slate' },
            { id: 'leaf-g026', label: '-느라고', subLabel: '做前事耽误消极后果', grammarId: 'g-026', color: 'slate' },
            { id: 'leaf-g027', label: '-(으)ㄴ/는 바람에', subLabel: '突发外部意外导致消极', grammarId: 'g-027', color: 'slate' },
            { id: 'leaf-g028', label: '-기 때문에 / -탓에 / -덕분에', subLabel: '客观原因 / 怪罪 / 多亏', grammarId: 'g-028', color: 'slate' }
          ]
        },
        {
          id: 'sub-contrast',
          label: '转折·让步·对比',
          color: 'slate',
          children: [
            { id: 'leaf-g031', label: '-지만 / -(으)나', subLabel: '通用与书面转折', grammarId: 'g-031', color: 'slate' },
            { id: 'leaf-g033', label: '-(으)ㄴ/는데', subLabel: '背景铺垫与提示', grammarId: 'g-033', color: 'slate' },
            { id: 'leaf-g034', label: '-(으)ㄴ/는데도', subLabel: '明知却反常让步', grammarId: 'g-034', color: 'slate' },
            { id: 'leaf-g035', label: '-아/어도 / -(으)ㄹ지라도', subLabel: '极端假设哪怕...也', grammarId: 'g-035', color: 'slate' },
            { id: 'leaf-g037', label: '-(으)ㄴ/는 반면에 / 대신에', subLabel: '两面性对比与替代补偿', grammarId: 'g-037', color: 'slate' }
          ]
        },
        {
          id: 'sub-condition-purpose',
          label: '假设·条件·意图目的',
          color: 'slate',
          children: [
            { id: 'leaf-g045', label: '-(으)면 / -(으)려면', subLabel: '充分条件与意图假设', grammarId: 'g-045', color: 'slate' },
            { id: 'leaf-g047', label: '-거든 / -아/어야', subLabel: '条件提示与充要条件', grammarId: 'g-047', color: 'slate' },
            { id: 'leaf-g049', label: '-다 보면 / -았/었더라면', subLabel: '持续自现与后悔假设', grammarId: 'g-049', color: 'slate' },
            { id: 'leaf-g051', label: '-고 싶다 / -(으)려고', subLabel: '主观愿望与动作打算', grammarId: 'g-051', color: 'slate' },
            { id: 'leaf-g054', label: '-도록 (하다) / -기 위해', subLabel: '促使达成与庄重目的', grammarId: 'g-054', color: 'slate' }
          ]
        }
      ]
    },

    // Branch 4: 引语与高级文法 (간접화법 & 고급구문)
    {
      id: 'branch-advanced',
      label: '④ 引语与高级文法 (고급문법)',
      subLabel: '转述传闻、推测可能与 TOPIK 5-6级 大作文句型',
      color: 'emerald',
      children: [
        {
          id: 'sub-reported-speech',
          label: '间接引语 4 大金刚',
          color: 'emerald',
          children: [
            { id: 'leaf-g058', label: '-다고 하다 (-대요)', subLabel: '陈述转述 (听说/据说)', grammarId: 'g-058', color: 'emerald' },
            { id: 'leaf-g059', label: '-냐고 하다 (-냬요)', subLabel: '疑问转述 (询问)', grammarId: 'g-059', color: 'emerald' },
            { id: 'leaf-g060', label: '-(으)라고 하다 (-래요)', subLabel: '祈使命令转述 (叫/让做)', grammarId: 'g-060', color: 'emerald' },
            { id: 'leaf-g061', label: '-자고 하다 (-재요)', subLabel: '共动建议转述 (提议一起)', grammarId: 'g-061', color: 'emerald' }
          ]
        },
        {
          id: 'sub-conjecture',
          label: '推测与客观可能',
          color: 'emerald',
          children: [
            { id: 'leaf-g039', label: '-(으)ㄹ 수 있다/없다', subLabel: '能力与客观可能', grammarId: 'g-039', color: 'emerald' },
            { id: 'leaf-g040', label: '-(으)ㄹ 것 같다', subLabel: '委婉主观估量', grammarId: 'g-040', color: 'emerald' },
            { id: 'leaf-g041', label: '-(으)ㄹ 텐데', subLabel: '强烈推测与背景提示', grammarId: 'g-041', color: 'emerald' },
            { id: 'leaf-g044', label: '-(으)ㄹ 리 만무하다', subLabel: '斩钉截铁绝对绝无可能', grammarId: 'g-044', color: 'emerald' }
          ]
        },
        {
          id: 'sub-advanced-patterns',
          label: 'TOPIK 5~6级 学术论文高分文法',
          color: 'emerald',
          children: [
            { id: 'leaf-g062', label: '-(으)ㄹ 따름이다', subLabel: '仅仅/只是...而已', grammarId: 'g-062', color: 'emerald' },
            { id: 'leaf-g063', label: '-기 십상이다', subLabel: '极易/十常八九不良后果', grammarId: 'g-063', color: 'emerald' },
            { id: 'leaf-g064', label: '-(으)ㄹ 뿐만 아니라', subLabel: '不仅...而且...递进', grammarId: 'g-064', color: 'emerald' },
            { id: 'leaf-g065', label: '-(으)ㄹ수록', subLabel: '越...就越...程度递增', grammarId: 'g-065', color: 'emerald' },
            { id: 'leaf-g066', label: '-기 마련이다', subLabel: '必然规律/理所当然', grammarId: 'g-066', color: 'emerald' },
            { id: 'leaf-g067', label: '-은/는 고사하고', subLabel: '别说...连最基本的都', grammarId: 'g-067', color: 'emerald' },
            { id: 'leaf-g068', label: '-(으)로 미루어 보아', subLabel: '由此推断/从...来看', grammarId: 'g-068', color: 'emerald' }
          ]
        }
      ]
    }
  ]
};

interface GrammarVisualMindMapProps {
  onSelectGrammar: (grammarId: string) => void;
  onOpenFullOverview: () => void;
}

export const GrammarVisualMindMap: React.FC<GrammarVisualMindMapProps> = ({
  onSelectGrammar,
  onOpenFullOverview
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [collapsedBranchIds, setCollapsedBranchIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedBranchIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const expandAllBranches = () => {
    setCollapsedBranchIds([]);
  };

  const collapseAllBranches = () => {
    const allBranchIds = ['branch-particles', 'branch-endings', 'branch-connectives', 'branch-advanced', 'sub-case-particles', 'sub-aux-particles', 'sub-formal-endings', 'sub-mood-endings', 'sub-sequence', 'sub-cause', 'sub-contrast', 'sub-condition-purpose', 'sub-reported-speech', 'sub-conjecture', 'sub-advanced-patterns'];
    setCollapsedBranchIds(allBranchIds);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(130, Math.max(70, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-5 overflow-hidden relative">
      
      {/* Background Grid Pattern & Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }} 
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>韩语全景语法可视化思维导图 (Visual Tree Graph)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold">
                SVG 树状拓扑图
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              点按各级分支可自由展开/收折，点击叶子节点秒级跳转卡片并高亮发光定位
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-1">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="缩小视图"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-slate-300 select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="放大视图"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition ml-0.5"
              title="重置缩放"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-1 text-xs">
            <button
              onClick={expandAllBranches}
              className="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              展开全部
            </button>
            <button
              onClick={collapseAllBranches}
              className="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              收起分支
            </button>
          </div>

          {/* Full Overview Modal Trigger */}
          <button
            onClick={onOpenFullOverview}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>大纲大表</span>
          </button>
        </div>
      </div>

      {/* --- Main Interactive Tree Canvas with Complete Root-to-Branches Connector Lines --- */}
      <div 
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden pb-4 pt-2 no-scrollbar"
      >
        <div 
          className="min-w-[920px] sm:min-w-[1050px] flex items-stretch gap-0 transition-transform duration-200 origin-top-left relative"
          style={{ transform: 'scale(' + (zoomLevel / 100) + ')' }}
        >
          
          {/* 1. Central Root Node (中心总根节点 - 垂直居中) */}
          <div className="shrink-0 flex flex-col items-center justify-center my-auto z-10 w-[200px] sm:w-[220px]">
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white shadow-2xl shadow-orange-500/30 border border-orange-400/40 text-center w-full space-y-1.5 select-none ring-4 ring-orange-500/20 relative">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-md shadow-inner">
                🌳
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                {MIND_MAP_TREE_DATA.label}
              </h2>
              <p className="text-[10px] text-orange-100 font-medium opacity-90 leading-tight">
                {MIND_MAP_TREE_DATA.subLabel}
              </p>
              <div className="pt-1">
                <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold inline-block">
                  4 大主干 · 68 考点
                </span>
              </div>

              {/* Root Node Right Branch Port Anchor Dot */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md shadow-amber-400/50 ring-4 ring-amber-400/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* 2. Middle Connector Gutter (纯净间距与根节点水平引出线) */}
          <div className="shrink-0 w-10 sm:w-12 relative flex items-center justify-center self-stretch pointer-events-none">
            {/* Horizontal Stem Line emerging from Root Node */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-full shadow-md shadow-orange-500/40" />
            
            {/* Junction Central Glowing Dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-slate-900 shadow-lg shadow-amber-300/50 ring-4 ring-orange-500/40 z-20" />
          </div>

          {/* 3. 4 Primary Branches Container with Exact-Terminating Tree Spine Lines */}
          <div className="flex-1 space-y-6 relative">
            {MIND_MAP_TREE_DATA.children?.map((branch, branchIdx, arr) => {
              const isBranchCollapsed = collapsedBranchIds.includes(branch.id);
              const isFirst = branchIdx === 0;
              const isLast = branchIdx === arr.length - 1;
              
              const themeStyles = 
                branch.color === 'orange' ? {
                  border: 'border-orange-500/40',
                  bg: 'bg-orange-950/40 hover:bg-orange-950/60',
                  headerBg: 'from-orange-500/30 to-amber-500/20',
                  pill: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                  nodeBg: 'bg-orange-950/70 hover:bg-orange-500/20 text-orange-100 hover:text-white border-orange-500/30 hover:border-orange-400',
                  badge: 'bg-orange-500 text-white',
                  stemColor: 'border-orange-500/40 group-hover/sub:border-orange-400',
                  branchLine: 'bg-orange-500',
                  spineSegment: 'from-orange-500 to-amber-500',
                  dot: 'bg-orange-400',
                  dotRing: 'ring-orange-500/30'
                } :
                branch.color === 'amber' ? {
                  border: 'border-amber-500/40',
                  bg: 'bg-amber-950/40 hover:bg-amber-950/60',
                  headerBg: 'from-amber-500/30 to-orange-500/20',
                  pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  nodeBg: 'bg-amber-950/70 hover:bg-amber-500/20 text-amber-100 hover:text-white border-amber-500/30 hover:border-amber-400',
                  badge: 'bg-amber-500 text-white',
                  stemColor: 'border-amber-500/40 group-hover/sub:border-amber-400',
                  branchLine: 'bg-amber-500',
                  spineSegment: 'from-amber-500 to-slate-500',
                  dot: 'bg-amber-400',
                  dotRing: 'ring-amber-500/30'
                } :
                branch.color === 'slate' ? {
                  border: 'border-slate-600/40',
                  bg: 'bg-slate-900/60 hover:bg-slate-900/80',
                  headerBg: 'from-slate-700/30 to-slate-800/20',
                  pill: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
                  nodeBg: 'bg-slate-950/70 hover:bg-slate-800/40 text-slate-200 hover:text-white border-slate-700/40 hover:border-slate-500',
                  badge: 'bg-slate-600 text-white',
                  stemColor: 'border-slate-600/40 group-hover/sub:border-slate-400',
                  branchLine: 'bg-slate-500',
                  spineSegment: 'from-slate-500 to-emerald-500',
                  dot: 'bg-slate-400',
                  dotRing: 'ring-slate-500/30'
                } : {
                  border: 'border-emerald-500/40',
                  bg: 'bg-emerald-950/40 hover:bg-emerald-950/60',
                  headerBg: 'from-emerald-500/30 to-emerald-600/20',
                  pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  nodeBg: 'bg-emerald-950/70 hover:bg-emerald-500/20 text-emerald-100 hover:text-white border-emerald-500/30 hover:border-emerald-400',
                  badge: 'bg-emerald-500 text-white',
                  stemColor: 'border-emerald-500/40 group-hover/sub:border-emerald-400',
                  branchLine: 'bg-emerald-500',
                  spineSegment: 'from-emerald-500 to-emerald-400',
                  dot: 'bg-emerald-400',
                  dotRing: 'ring-emerald-500/30'
                };

              return (
                <div 
                  key={branch.id}
                  className={`rounded-2xl border ${themeStyles.border} ${themeStyles.bg} transition-all duration-300 shadow-lg relative`}
                >
                  {/* Vertical Tree Spine Segment (精准停留在最后一个主干处，下方绝不多出任何线条) */}
                  <div 
                    className={`absolute -left-5 sm:-left-6 w-1 bg-gradient-to-b ${themeStyles.spineSegment} pointer-events-none z-0 ${
                      isFirst 
                        ? 'top-7 -bottom-6 rounded-t-full' 
                        : isLast 
                          ? '-top-6 h-[calc(1.5rem+1.75rem)] rounded-b-full' 
                          : '-top-6 -bottom-6'
                    }`} 
                  />

                  {/* Left Entrance Horizontal Branch Line connecting to Tree Spine */}
                  <div className="absolute -left-5 sm:-left-6 top-7 w-5 sm:w-6 flex items-center pointer-events-none z-10">
                    <div className={`w-full h-1 ${themeStyles.branchLine} rounded-full shadow-xs`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${themeStyles.dot} -mr-1 ring-4 ${themeStyles.dotRing} shrink-0`} />
                  </div>

                  {/* Primary Branch Header (Click to collapse/expand) */}
                  <div 
                    onClick={(e) => toggleCollapse(branch.id, e)}
                    className={`p-3.5 sm:p-4 bg-gradient-to-r ${themeStyles.headerBg} flex items-center justify-between cursor-pointer select-none transition hover:opacity-90 rounded-t-2xl`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="p-1 rounded-lg bg-white/10 text-white transition">
                        {isBranchCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                          <span>{branch.label}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full border ${themeStyles.pill}`}>
                            {branch.children?.reduce((acc, c) => acc + (c.children?.length || 0), 0)} 个核心考点
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          {branch.subLabel}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      {isBranchCollapsed ? '点击展开分支' : '点击收起'}
                    </span>
                  </div>

                  {/* Secondary Branches & Leaf Nodes with Mind Map Line Connectors */}
                  {!isBranchCollapsed && (
                    <div className="p-4 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {branch.children?.map((subCat) => {
                          return (
                            <div 
                              key={subCat.id}
                              className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/90 shadow-md space-y-3 flex flex-col justify-between group/sub"
                            >
                              {/* Subcategory Header Label */}
                              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${themeStyles.dot} ring-4 ${themeStyles.dotRing}`} />
                                  <span className="text-xs font-bold text-slate-100">{subCat.label}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
                                  {subCat.children?.length || 0} 考点
                                </span>
                              </div>

                              {/* Mind Map Tree Branch Connector Line & Nodes (Vertically Centered) */}
                              <div className={`flex-1 flex flex-col justify-center my-auto py-1 pl-3.5 relative border-l-2 border-dashed ${themeStyles.stemColor} space-y-2 transition-colors`}>
                                {subCat.children?.map((leaf) => (
                                  <div key={leaf.id} className="relative flex items-center">
                                    {/* Mind Map Horizontal Branch Connector Line */}
                                    <div className={`absolute -left-3.5 w-3.5 h-0.5 ${themeStyles.branchLine}`} />
                                    
                                    {/* Leaf Node Button */}
                                    <button
                                      onClick={() => leaf.grammarId && onSelectGrammar(leaf.grammarId)}
                                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer shadow-xs active:scale-[0.98] group/leaf ${themeStyles.nodeBg}`}
                                      title={`点击跳转查看：${leaf.label} (${leaf.subLabel || ''})`}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-bold text-white tracking-wide shrink-0">{leaf.label}</span>
                                        {leaf.subLabel && (
                                          <span className="text-[11px] text-slate-400 group-hover/leaf:text-slate-200 truncate font-normal">
                                            · {leaf.subLabel}
                                          </span>
                                        )}
                                      </div>
                                      <ArrowRight className="w-3 h-3 text-slate-500 opacity-0 group-hover/leaf:opacity-100 group-hover/leaf:text-white group-hover/leaf:translate-x-0.5 transition shrink-0" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom Hint Footer */}
      <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>全体系覆盖：助词篇 (10) · 终结词尾 (7) · 逻辑复句 (25) · 间接引语 (4) · TOPIK高级句型 (22)</span>
        </div>
        <span className="text-slate-500">点击任意绿色/橙色/蓝色语法气泡即可直达卡片</span>
      </div>

    </div>
  );
};
