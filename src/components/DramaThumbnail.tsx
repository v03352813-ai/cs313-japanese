import React from 'react';

interface DramaThumbnailProps {
  cardIndex?: number;
  dramaTitle?: string;
  koreanDramaTitle?: string;
  sceneTitle?: string;
  category?: string;
  genre?: string;
  levelTag?: string;
  actionText?: string;
  showLevelTag?: boolean;
  bgGradient?: string;
  fallbackUrl?: string;
  alt?: string;
  className?: string;
}

// 统一采用站内 4 大经典色系（暖橙、琥珀金、翡翠绿、深石板/白）构建明亮轻盈的高级视觉卡片
const DRAMA_THEMES: Record<string, {
  bg: string;
  border: string;
  icon: string;
  titleColor: string;
  badgeBg: string;
  dotColor: string;
}> = {
  // 1. 暖橙色系 (浪漫喜剧 / 治愈甜暖 / 青春日常)
  '欢迎来到王之国': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '👑',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '请回答 1988': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '📻',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '社内相亲': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '💍',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '大力女子都奉顺': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '💖',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '三流之路': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '🥊',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '浪漫的体质': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '🥂',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '梨泰院CLASS': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '🔥',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '举重妖精金福珠': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '🎀',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },

  // 2. 翡翠绿系 (励志独白 / 治愈人生)
  '名场面励志独白': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '✨',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '太阳的后裔': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🎖️',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '我的解放日志': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🌾',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '二十五，二十一': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🤺',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '主君的太阳': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '☀️',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  'Signal 信号': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '📡',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '德鲁纳酒店': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🌙',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },

  // 3. 琥珀金与翡翠绿系 (奇幻深情 / 自然唯美 / 医疗职场)
  '孤单又灿烂的神-鬼怪': {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🗡️',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '那年，我们的夏天': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '🍃',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '爱的迫降': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '🪂',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '机智的医生生活': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '🩺',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '虽然是精神病但没关系': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '🦋',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },

  // 4. 浅灰/纯白深石板典雅系 (财阀豪门 / 悬疑职场 / 高概念名作)
  '眼泪女王': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '💎',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '未生': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '💼',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '秘密森林': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '🌲',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '黑暗荣耀': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '♟️',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '非常律师禹英禑': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '🐳',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '继承者们': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '🏰',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '来自星星的你': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '⭐',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '少年法庭': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '⚖️',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  'W-两个世界': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-50',
    border: 'border-slate-200/90',
    icon: '📖',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-700 border-slate-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  },
  '背着善宰跑': {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/60',
    border: 'border-orange-200/90',
    icon: '☂️',
    titleColor: 'text-orange-700',
    badgeBg: 'bg-white/95 text-orange-700 border-orange-200 shadow-2xs',
    dotColor: 'bg-orange-500'
  }
};

export const DramaThumbnail: React.FC<DramaThumbnailProps> = ({
  dramaTitle = '',
  koreanDramaTitle = '',
  sceneTitle = '',
  genre = '',
  levelTag = '',
  actionText = '',
  showLevelTag = false,
  className = "w-full h-full"
}) => {
  // 根据剧名精准匹配高定视觉主题
  const titleStr = typeof dramaTitle === 'string' ? dramaTitle : '';
  const themeKey = Object.keys(DRAMA_THEMES).find(k => titleStr && (titleStr.includes(k) || k.includes(titleStr))) || '欢迎来到王之国';
  const theme = DRAMA_THEMES[themeKey] || DRAMA_THEMES['欢迎来到王之国'];

  const shouldRenderLevel = levelTag && (actionText || showLevelTag);

  return (
    <div className={`relative w-full h-full ${theme.bg} flex flex-col justify-between p-3.5 sm:p-4 select-none overflow-hidden ${className}`}>
      
      {/* Background Korean Typography Watermark */}
      <div className="absolute -right-2 -bottom-2 pointer-events-none opacity-5 select-none">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 whitespace-nowrap tracking-wider">
          {koreanDramaTitle || '드라마'}
        </span>
      </div>

      {/* Top Meta Tag Row */}
      <div className="relative z-10 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-white/95 shadow-2xs border border-slate-200/60 flex items-center justify-center text-xs shrink-0">
            {theme.icon}
          </div>
          {koreanDramaTitle && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border truncate max-w-[110px] sm:max-w-[140px] ${theme.badgeBg}`}>
              {koreanDramaTitle}
            </span>
          )}
        </div>
        {shouldRenderLevel && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border shrink-0 ${
            levelTag.includes('初级') 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-2xs' 
              : levelTag.includes('中级')
              ? 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs'
              : 'bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
          }`}>
            {levelTag}
          </span>
        )}
      </div>

      {/* Center Drama Title & Artwork */}
      <div className="relative z-10 space-y-1 my-auto py-1.5">
        <p className={`text-xs sm:text-sm font-black tracking-wide truncate ${theme.titleColor}`}>
          《{dramaTitle}》
        </p>
        <p className="text-slate-700 font-medium text-[11px] sm:text-xs leading-snug line-clamp-2">
          "{sceneTitle}"
        </p>
      </div>

      {/* Bottom Audio/Study Indicator */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
        <span className="flex items-center gap-1 font-medium truncate max-w-[62%] sm:max-w-[68%]">
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} shrink-0 animate-pulse`} />
          <span className="truncate">{genre || '原声精听 & 考点'}</span>
        </span>
        {actionText ? (
          <span className={`font-bold text-[10px] flex items-center gap-0.5 ${theme.titleColor} group-hover/card:translate-x-0.5 transition shrink-0`}>
            {actionText}
          </span>
        ) : (
          <span className="font-mono text-slate-400 font-semibold text-[8px] sm:text-[9px] shrink-0">
            高光名场面
          </span>
        )}
      </div>

    </div>
  );
};
