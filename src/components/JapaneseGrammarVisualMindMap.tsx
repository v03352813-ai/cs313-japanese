import React, { useState, useRef } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  ArrowRight
} from 'lucide-react';

export interface JapaneseMindMapNode {
  id: string;
  label: string;
  subLabel?: string;
  grammarId?: string; // If set, clicking will jump to card
  tabTarget?: 'library' | 'conjugation' | 'particles';
  color: 'sky' | 'indigo' | 'slate' | 'emerald' | 'amber';
  children?: JapaneseMindMapNode[];
}

export const JAPANESE_MIND_MAP_TREE_DATA: JapaneseMindMapNode = {
  id: 'root',
  label: '🇯🇵 日本语核心文法全景思维导图',
  subLabel: '学校文法 & 日本語教育文法 (JLPT N5~N1 72核心考点全景大树)',
  color: 'sky',
  children: [
    // ==================== 主干 1: 品词体系与词类基石 ====================
    {
      id: 'branch-pos',
      label: '① 品词体系与体言用言 (自立語 & 付属語)',
      subLabel: '日语词汇划分基石，决定句子成分、活用可能与接续法则',
      color: 'sky',
      children: [
        {
          id: 'sub-taigen',
          label: '体言 (无词尾活用)',
          color: 'sky',
          children: [
            { id: 'leaf-pos-noun', label: '普通名词 (名詞)', subLabel: '事象主体 · 独立充当主谓宾', tabTarget: 'library', color: 'sky' },
            { id: 'leaf-pos-pronoun', label: '代名词 (代名詞)', subLabel: '指示代词 こ・そ・あ・ど 与人称', tabTarget: 'library', color: 'sky' },
            { id: 'leaf-pos-numeral', label: '数词·量词 (数詞)', subLabel: '一本/二枚/三匹 计数规则', tabTarget: 'library', color: 'sky' }
          ]
        },
        {
          id: 'sub-yougen',
          label: '用言 (三大谓语词类 · 发生活用)',
          color: 'sky',
          children: [
            { id: 'leaf-pos-verb', label: '动词 (動詞)', subLabel: '五段·一段·サ变·カ变 四大类别', tabTarget: 'conjugation', color: 'sky' },
            { id: 'leaf-pos-i-adj', label: 'い形容词 (形容詞)', subLabel: '词尾「い」接续修饰与结句', tabTarget: 'conjugation', color: 'sky' },
            { id: 'leaf-pos-na-adj', label: 'な形容词 (形容動詞)', subLabel: '词干+な修饰体言、词干+だ结句', tabTarget: 'conjugation', color: 'sky' }
          ]
        },
        {
          id: 'sub-modifiers',
          label: '修饰与连结词类',
          color: 'sky',
          children: [
            { id: 'leaf-pos-rentaishi', label: '连体词 (連体詞)', subLabel: 'この/その/あらゆる 仅修饰体言', tabTarget: 'library', color: 'sky' },
            { id: 'leaf-pos-fukushi', label: '副词 (副詞)', subLabel: '修饰用言 · 拟声拟态词 (ドキドキ)', tabTarget: 'library', color: 'sky' },
            { id: 'leaf-pos-setsuzokushi', label: '接续词 (接続詞)', subLabel: 'だから/しかし/そして 句间连结', tabTarget: 'library', color: 'sky' },
            { id: 'leaf-pos-kandoushi', label: '感动词 (感動詞)', subLabel: 'はい/いいえ/ああ 独立感叹呼应', tabTarget: 'library', color: 'sky' }
          ]
        }
      ]
    },

    // ==================== 主干 2: 动词活用与时态语态 ====================
    {
      id: 'branch-verbs',
      label: '② 动词活用与时态语态 (活用形 & 派生態)',
      subLabel: '日语动词六大基本形与核心派生态，接续与时态变化的灵魂',
      color: 'indigo',
      children: [
        {
          id: 'sub-conjugation-forms',
          label: '六大基本活用形 (学校文法)',
          color: 'indigo',
          children: [
            { id: 'leaf-v-mizen', label: '未然形', subLabel: '接否定「ない」/ 意志「う・よう」', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-renyou', label: '连用形', subLabel: '接礼貌「ます」/「て」/「た」', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-shuushi', label: '终止形', subLabel: '原型辞书形结句 · 直接终结', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-rentai', label: '连体形', subLabel: '修饰体言 · 接「ので/のに」', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-katei', label: '假定形', subLabel: '接「ば」构成假定假设条件', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-meirei', label: '命令形', subLabel: '直接口令命令语气', tabTarget: 'conjugation', color: 'indigo' }
          ]
        },
        {
          id: 'sub-functional-forms',
          label: '四大高频功能形态',
          color: 'indigo',
          children: [
            { id: 'leaf-v-te-form', label: 'て形 (连接形)', subLabel: '动作相继发生 / 祈使 / 进行时', grammarId: 'jp-g-v-teiru', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-ta-form', label: 'た形 (过去完了形)', subLabel: '动作彻底完成 / 过去时态 / 经历', grammarId: 'jp-g-n4-01', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-nai-form', label: 'ない形 (否定形)', subLabel: '未然否定 / 必须 / 不必许可', grammarId: 'jp-g-v-nakereba', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-jisho-form', label: '辞书形 (原型)', subLabel: '词典词头 / 名词化 / 能够能力', grammarId: 'jp-g-time-mae-ni', tabTarget: 'conjugation', color: 'indigo' }
          ]
        },
        {
          id: 'sub-voice-aspects',
          label: '四大核心动词语态 (态变)',
          color: 'indigo',
          children: [
            { id: 'leaf-v-passive', label: '受身形 (被动态)', subLabel: '被动遭受 · 间接受害被动', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-causative', label: '使役形 (使役态)', subLabel: '指使 / 准许他人做某事', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-caus-pass', label: '使役受身 (被迫态)', subLabel: '被迫无奈不得不做某事', tabTarget: 'conjugation', color: 'indigo' },
            { id: 'leaf-v-potential', label: '可能形 (可能态)', subLabel: '主体自身能力 / 客观环境许可', tabTarget: 'conjugation', color: 'indigo' }
          ]
        }
      ]
    },

    // ==================== 主干 3: 助词粘着与语气体系 ====================
    {
      id: 'branch-particles',
      label: '③ 助词粘着与语气体系 (助詞 & 終助詞)',
      subLabel: '黏着在自立语后，决定句子成分、逻辑关系与句末交际语气',
      color: 'emerald',
      children: [
        {
          id: 'sub-case-particles',
          label: '九大核心格助词 (格关系之骨)',
          color: 'emerald',
          children: [
            { id: 'leaf-p-ga', label: 'が', subLabel: '主格焦点 · 客观现象从句主语', grammarId: 'jp-g-part-ga', tabTarget: 'particles', color: 'emerald' },
            { id: 'leaf-p-wo', label: 'を', subLabel: '宾格对象 · 移动离开经过场所', grammarId: 'jp-g-part-wo', color: 'emerald' },
            { id: 'leaf-p-ni', label: 'に', subLabel: '时空点 · 静止场所 · 动作归着点', grammarId: 'jp-g-part-ni', tabTarget: 'particles', color: 'emerald' },
            { id: 'leaf-p-de', label: 'で', subLabel: '动作场所 · 工具手段 · 客观原因', grammarId: 'jp-g-part-de', tabTarget: 'particles', color: 'emerald' },
            { id: 'leaf-p-he', label: 'へ', subLabel: '移动方向与朝向', grammarId: 'jp-g-part-he', color: 'emerald' },
            { id: 'leaf-p-to', label: 'と', subLabel: '伴随 · 完全列举 · 思考引用', grammarId: 'jp-g-part-to', color: 'emerald' },
            { id: 'leaf-p-kara-made', label: 'から～まで', subLabel: '时空起止范围', grammarId: 'jp-g-part-kara-made', color: 'emerald' }
          ]
        },
        {
          id: 'sub-topic-particles',
          label: '提示副助词 (情感与限定语气)',
          color: 'emerald',
          children: [
            { id: 'leaf-p-wa', label: 'は', subLabel: '全句主题提示 · 对比强调', grammarId: 'jp-g-part-wa', tabTarget: 'particles', color: 'emerald' },
            { id: 'leaf-p-mo', label: 'も', subLabel: '兼提也 · 极端强调连...都', grammarId: 'jp-g-part-mo', color: 'emerald' },
            { id: 'leaf-p-shika', label: 'しか～ない', subLabel: '否定限定 · 除此别无选择', grammarId: 'jp-g-part-shika', color: 'emerald' },
            { id: 'leaf-p-dake', label: 'だけ / ばかり', subLabel: '纯客观限定 vs 净是光是生厌', grammarId: 'jp-g-part-dake-bakari', color: 'emerald' }
          ]
        },
        {
          id: 'sub-final-particles',
          label: '终助词 (句末交际语气)',
          color: 'emerald',
          children: [
            { id: 'leaf-p-ne', label: 'ね', subLabel: '征求认同 · 寻求对方共鸣确认', grammarId: 'jp-g-end-ne', color: 'emerald' },
            { id: 'leaf-p-yo', label: 'よ', subLabel: '告知不知事实 · 坚定主张强调', grammarId: 'jp-g-end-yo', color: 'emerald' },
            { id: 'leaf-p-zo', label: 'な / ぞ / ぜ', subLabel: '男性粗犷语气 · 警示与感叹', tabTarget: 'library', color: 'emerald' }
          ]
        }
      ]
    },

    // ==================== 主干 4: JLPT 逻辑复句与句型大树 ====================
    {
      id: 'branch-patterns',
      label: '④ JLPT 逻辑复句与核心句型 (文型 & 敬語大树)',
      subLabel: '复合主从句逻辑关联、授受恩惠传递与日本社会交际法则',
      color: 'amber',
      children: [
        {
          id: 'sub-conditions',
          label: '四大假定条件 (深度辨析)',
          color: 'amber',
          children: [
            { id: 'leaf-c-to', label: '～と', subLabel: '自然恒常必然 · 机械操作 · 新发现', grammarId: 'jp-g-cond-to', color: 'amber' },
            { id: 'leaf-c-ba', label: '～ば', subLabel: '书面一般假定 · 只要...就...', grammarId: 'jp-g-cond-ba', color: 'amber' },
            { id: 'leaf-c-tara', label: '～たら', subLabel: '口语万能假定 · 做完之后相继发生', grammarId: 'jp-g-cond-tara', color: 'amber' },
            { id: 'leaf-c-nara', label: '～なら', subLabel: '承接对方话题 · 提出针对性建议劝告', grammarId: 'jp-g-cond-nara', color: 'amber' }
          ]
        },
        {
          id: 'sub-cause-contrast',
          label: '因果理由与转折让步',
          color: 'amber',
          children: [
            { id: 'leaf-p-kara-cause', label: '～から', subLabel: '主观原因 · 强调个人意志借口理由', grammarId: 'jp-g-cause-kara', color: 'amber' },
            { id: 'leaf-p-node', label: '～ので', subLabel: '客观礼貌 · 顺理成章自然委婉', grammarId: 'jp-g-cause-node', color: 'amber' },
            { id: 'leaf-p-tameni', label: '～ために', subLabel: '为了目的 / 客观消极原因造成危害', grammarId: 'jp-g-cause-tameni', color: 'amber' },
            { id: 'leaf-p-seide', label: '～せいで / ～おかげで', subLabel: '消极怪罪都怪 vs 积极托福多亏', grammarId: 'jp-g-cause-seide', color: 'amber' },
            { id: 'leaf-p-noni', label: '～のに', subLabel: '反常让步 · 明明...却...反常遗憾', grammarId: 'jp-g-rev-noni', color: 'amber' },
            { id: 'leaf-p-temo', label: '～ても', subLabel: '逆接让步假设 · 哪怕...也绝不改变', grammarId: 'jp-g-rev-temo', color: 'amber' },
            { id: 'leaf-p-monono', label: '～ものの', subLabel: '书面转折 · 虽说确实...然而事实上...', grammarId: 'jp-g-rev-monono', color: 'amber' }
          ]
        },
        {
          id: 'sub-giving-honorific',
          label: '授受恩惠与敬语规约',
          color: 'amber',
          children: [
            { id: 'leaf-g-ageru', label: '～てあげる', subLabel: '施惠 · 我或我方为他人提供动作恩惠', grammarId: 'jp-g-give-ageru', color: 'amber' },
            { id: 'leaf-g-kureru', label: '～てくれる', subLabel: '蒙惠 · 他人为我或我方主动施惠感念', grammarId: 'jp-g-give-kureru', color: 'amber' },
            { id: 'leaf-g-morau', label: '～てもらう', subLabel: '受惠 · 拜托请求他人获恩惠', grammarId: 'jp-g-give-morau', color: 'amber' },
            { id: 'leaf-h-sonkei', label: 'お/ご～になる', subLabel: '尊敬语 · 抬高对方长辈客户动作', grammarId: 'jp-g-kei-sonkei', color: 'amber' },
            { id: 'leaf-h-kenjou', label: 'お/ご～する', subLabel: '谦让语 · 压低自身动作奉献对方', grammarId: 'jp-g-kei-kenjou', color: 'amber' }
          ]
        }
      ]
    }
  ]
};

interface JapaneseGrammarVisualMindMapProps {
  onSelectGrammar: (grammarId: string) => void;
  onSelectTab?: (tab: 'library' | 'conjugation' | 'particles') => void;
  onOpenFullOverview: () => void;
}

export const JapaneseGrammarVisualMindMap: React.FC<JapaneseGrammarVisualMindMapProps> = ({
  onSelectGrammar,
  onSelectTab,
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
    const allBranchIds = [
      'branch-pos', 'branch-verbs', 'branch-particles', 'branch-patterns',
      'sub-taigen', 'sub-yougen', 'sub-modifiers',
      'sub-conjugation-forms', 'sub-functional-forms', 'sub-voice-aspects',
      'sub-case-particles', 'sub-topic-particles', 'sub-final-particles',
      'sub-conditions', 'sub-cause-contrast', 'sub-giving-honorific'
    ];
    setCollapsedBranchIds(allBranchIds);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(130, Math.max(70, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const handleLeafClick = (leaf: JapaneseMindMapNode) => {
    if (leaf.tabTarget && onSelectTab) {
      onSelectTab(leaf.tabTarget);
    }
    if (leaf.grammarId) {
      onSelectGrammar(leaf.grammarId);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-5 overflow-hidden relative">
      
      {/* Background Grid Pattern & Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px), radial-gradient(#6366f1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }} 
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
              <span>日本语全景文法可视化思维导图 (Visual Tree Graph)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-extrabold">
                SVG 树状拓扑图
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              点按各级主干自由展开/收折，点击叶子节点秒级穿梭卡片/变形表并高亮定位
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-1">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="缩小视图"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-slate-300 select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="放大视图"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition ml-0.5 cursor-pointer"
              title="重置缩放"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-1 text-xs">
            <button
              onClick={expandAllBranches}
              className="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              展开全部
            </button>
            <button
              onClick={collapseAllBranches}
              className="px-2.5 py-1 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              收起分支
            </button>
          </div>

          {/* Full Overview Modal Trigger */}
          <button
            onClick={onOpenFullOverview}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
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
          className="min-w-[920px] sm:min-w-[1080px] flex items-stretch gap-0 transition-transform duration-200 origin-top-left relative"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          
          {/* 1. Central Root Node (中心总根节点 - 垂直居中) */}
          <div className="shrink-0 flex flex-col items-center justify-center my-auto z-10 w-[200px] sm:w-[230px]">
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-600 to-sky-700 text-white shadow-2xl shadow-sky-500/30 border border-sky-400/40 text-center w-full space-y-1.5 select-none ring-4 ring-sky-500/20 relative">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-md shadow-inner">
                🌳
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                {JAPANESE_MIND_MAP_TREE_DATA.label}
              </h2>
              <p className="text-[10px] text-sky-100 font-medium opacity-90 leading-tight">
                {JAPANESE_MIND_MAP_TREE_DATA.subLabel}
              </p>
              <div className="pt-1">
                <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold inline-block">
                  4 大主干 · 72 考点
                </span>
              </div>

              {/* Root Node Right Branch Port Anchor Dot */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-400 border-2 border-slate-900 shadow-md shadow-sky-400/50 ring-4 ring-sky-400/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* 2. Middle Connector Gutter (纯净间距与根节点水平引出线) */}
          <div className="shrink-0 w-10 sm:w-12 relative flex items-center justify-center self-stretch pointer-events-none">
            {/* Horizontal Stem Line emerging from Root Node */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-500 rounded-full shadow-md shadow-sky-500/40" />
            
            {/* Junction Central Glowing Dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-sky-300 border-2 border-slate-900 shadow-lg shadow-sky-300/50 ring-4 ring-sky-500/40 z-20" />
          </div>

          {/* 3. 4 Primary Branches Container with Exact-Terminating Tree Spine Lines */}
          <div className="flex-1 space-y-6 relative">
            {JAPANESE_MIND_MAP_TREE_DATA.children?.map((branch, branchIdx, arr) => {
              const isBranchCollapsed = collapsedBranchIds.includes(branch.id);
              const isFirst = branchIdx === 0;
              const isLast = branchIdx === arr.length - 1;
              
              const themeStyles = 
                branch.color === 'sky' ? {
                  border: 'border-sky-500/40',
                  bg: 'bg-sky-950/40 hover:bg-sky-950/60',
                  headerBg: 'from-sky-500/30 to-indigo-500/20',
                  pill: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                  nodeBg: 'bg-sky-950/70 hover:bg-sky-500/20 text-sky-100 hover:text-white border-sky-500/30 hover:border-sky-400',
                  badge: 'bg-sky-500 text-white',
                  stemColor: 'border-sky-500/40 group-hover/sub:border-sky-400',
                  branchLine: 'bg-sky-500',
                  spineSegment: 'from-sky-500 to-indigo-500',
                  dot: 'bg-sky-400',
                  dotRing: 'ring-sky-500/30'
                } :
                branch.color === 'indigo' ? {
                  border: 'border-indigo-500/40',
                  bg: 'bg-indigo-950/40 hover:bg-indigo-950/60',
                  headerBg: 'from-indigo-500/30 to-sky-500/20',
                  pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                  nodeBg: 'bg-indigo-950/70 hover:bg-indigo-500/20 text-indigo-100 hover:text-white border-indigo-500/30 hover:border-indigo-400',
                  badge: 'bg-indigo-500 text-white',
                  stemColor: 'border-indigo-500/40 group-hover/sub:border-indigo-400',
                  branchLine: 'bg-indigo-500',
                  spineSegment: 'from-indigo-500 to-emerald-500',
                  dot: 'bg-indigo-400',
                  dotRing: 'ring-indigo-500/30'
                } :
                branch.color === 'emerald' ? {
                  border: 'border-emerald-500/40',
                  bg: 'bg-emerald-950/40 hover:bg-emerald-950/60',
                  headerBg: 'from-emerald-500/30 to-teal-500/20',
                  pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  nodeBg: 'bg-emerald-950/70 hover:bg-emerald-500/20 text-emerald-100 hover:text-white border-emerald-500/30 hover:border-emerald-400',
                  badge: 'bg-emerald-500 text-white',
                  stemColor: 'border-emerald-500/40 group-hover/sub:border-emerald-400',
                  branchLine: 'bg-emerald-500',
                  spineSegment: 'from-emerald-500 to-amber-500',
                  dot: 'bg-emerald-400',
                  dotRing: 'ring-emerald-500/30'
                } : {
                  border: 'border-amber-500/40',
                  bg: 'bg-amber-950/40 hover:bg-amber-950/60',
                  headerBg: 'from-amber-500/30 to-orange-500/20',
                  pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  nodeBg: 'bg-amber-950/70 hover:bg-amber-500/20 text-amber-100 hover:text-white border-amber-500/30 hover:border-amber-400',
                  badge: 'bg-amber-500 text-white',
                  stemColor: 'border-amber-500/40 group-hover/sub:border-amber-400',
                  branchLine: 'bg-amber-500',
                  spineSegment: 'from-amber-500 to-amber-400',
                  dot: 'bg-amber-400',
                  dotRing: 'ring-amber-500/30'
                };

              return (
                <div 
                  key={branch.id}
                  className={`rounded-2xl border ${themeStyles.border} ${themeStyles.bg} transition-all duration-300 shadow-lg relative`}
                >
                  {/* Vertical Tree Spine Segment (精准停留在最后一个主干处) */}
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
                        <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 flex-wrap">
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

                              {/* Mind Map Tree Branch Connector Line & Nodes */}
                              <div className={`flex-1 flex flex-col justify-center my-auto py-1 pl-3.5 relative border-l-2 border-dashed ${themeStyles.stemColor} space-y-2 transition-colors`}>
                                {subCat.children?.map((leaf) => (
                                  <div key={leaf.id} className="relative flex items-center">
                                    {/* Mind Map Horizontal Branch Connector Line */}
                                    <div className={`absolute -left-3.5 w-3.5 h-0.5 ${themeStyles.branchLine}`} />
                                    
                                    {/* Leaf Node Button */}
                                    <button
                                      onClick={() => handleLeafClick(leaf)}
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
      <div className="relative z-10 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>全体系覆盖：品词基石 (10) · 动词活用与态 (14) · 助词与终助语气 (14) · 假定/因果/转折/授受/敬语 (34)</span>
        </div>
        <span className="text-slate-500">点击任意知识气泡即可直达语法卡片或变形矩阵</span>
      </div>

    </div>
  );
};
