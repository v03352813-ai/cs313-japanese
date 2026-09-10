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

// 统一采用日式和风与现代审美 4 大经典色系（富士天青、吉卜力青翠、琥珀暖金、深靛蓝）
const ANIME_THEMES: Record<string, {
  bg: string;
  border: string;
  icon: string;
  titleColor: string;
  badgeBg: string;
  dotColor: string;
}> = {
  // 1. 富士天青 / 奇幻治愈 (吉卜力 / 新海诚)
  '千与千寻': {
    bg: 'bg-gradient-to-br from-sky-50 via-indigo-50/40 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '🏮',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '你的名字': {
    bg: 'bg-gradient-to-br from-sky-50 via-indigo-50/40 to-indigo-100/60',
    border: 'border-indigo-200/90',
    icon: '☄️',
    titleColor: 'text-indigo-800',
    badgeBg: 'bg-white/95 text-indigo-700 border-indigo-200 shadow-2xs',
    dotColor: 'bg-indigo-500'
  },
  '哈尔的移动城堡': {
    bg: 'bg-gradient-to-br from-sky-50 via-blue-50/40 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '🏰',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '天空之城': {
    bg: 'bg-gradient-to-br from-sky-50 via-teal-50/40 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '🕊️',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '天气之子': {
    bg: 'bg-gradient-to-br from-sky-50 via-indigo-50/30 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '☀️',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '铃芽之旅': {
    bg: 'bg-gradient-to-br from-sky-50 via-indigo-50/40 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '🚪',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },

  // 2. 翡翠与竹青 (自然纯粹 / 热血羁绊)
  '龙猫': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '🌱',
    titleColor: 'text-emerald-800',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '鬼灭之刃': {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-emerald-100/60',
    border: 'border-emerald-200/90',
    icon: '⚔️',
    titleColor: 'text-emerald-800',
    badgeBg: 'bg-white/95 text-emerald-700 border-emerald-200 shadow-2xs',
    dotColor: 'bg-emerald-500'
  },
  '灌篮高手': {
    bg: 'bg-gradient-to-br from-amber-50 via-rose-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🏀',
    titleColor: 'text-amber-900',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '进击的巨人': {
    bg: 'bg-gradient-to-br from-slate-100 via-stone-50 to-slate-200/50',
    border: 'border-slate-300/90',
    icon: '🛡️',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-800 border-slate-300 shadow-2xs',
    dotColor: 'bg-slate-600'
  },

  // 3. 经典日剧系列 (法医 / 职场 / 人生)
  '非自然死亡': {
    bg: 'bg-gradient-to-br from-indigo-50 via-sky-50/30 to-indigo-100/60',
    border: 'border-indigo-200/90',
    icon: '🔬',
    titleColor: 'text-indigo-900',
    badgeBg: 'bg-white/95 text-indigo-700 border-indigo-200 shadow-2xs',
    dotColor: 'bg-indigo-500'
  },
  '半泽直树': {
    bg: 'bg-gradient-to-br from-slate-100 via-sky-50/30 to-slate-200/50',
    border: 'border-slate-300/90',
    icon: '💼',
    titleColor: 'text-slate-900',
    badgeBg: 'bg-white/95 text-slate-800 border-slate-300 shadow-2xs',
    dotColor: 'bg-sky-600'
  },
  '孤独的美食家': {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '🍱',
    titleColor: 'text-amber-900',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
  },
  '悠长假期': {
    bg: 'bg-gradient-to-br from-sky-50 via-amber-50/30 to-sky-100/60',
    border: 'border-sky-200/90',
    icon: '🎹',
    titleColor: 'text-sky-800',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '情书': {
    bg: 'bg-gradient-to-br from-sky-50 via-indigo-50/20 to-sky-100/50',
    border: 'border-sky-200/80',
    icon: '❄️',
    titleColor: 'text-sky-900',
    badgeBg: 'bg-white/95 text-sky-700 border-sky-200 shadow-2xs',
    dotColor: 'bg-sky-500'
  },
  '东京爱情故事': {
    bg: 'bg-gradient-to-br from-indigo-50 via-sky-50/40 to-indigo-100/60',
    border: 'border-indigo-200/90',
    icon: '🗼',
    titleColor: 'text-indigo-900',
    badgeBg: 'bg-white/95 text-indigo-700 border-indigo-200 shadow-2xs',
    dotColor: 'bg-indigo-500'
  },
  '逃避虽可耻但有用': {
    bg: 'bg-gradient-to-br from-amber-50 via-sky-50/30 to-amber-100/60',
    border: 'border-amber-200/90',
    icon: '☕',
    titleColor: 'text-amber-900',
    badgeBg: 'bg-white/95 text-amber-800 border-amber-200 shadow-2xs',
    dotColor: 'bg-amber-500'
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
  // 根据动漫日剧名精准匹配日式高定视觉主题
  const titleStr = typeof dramaTitle === 'string' ? dramaTitle : '';
  const themeKey = Object.keys(ANIME_THEMES).find(k => titleStr && (titleStr.includes(k) || k.includes(titleStr))) || '千与千寻';
  const theme = ANIME_THEMES[themeKey] || ANIME_THEMES['千与千寻'];

  const shouldRenderLevel = levelTag && (actionText || showLevelTag);

  return (
    <div className={`relative w-full h-full ${theme.bg} flex flex-col justify-between p-3.5 sm:p-4 select-none overflow-hidden ${className}`}>
      
      {/* Background Japanese Typography Watermark */}
      <div className="absolute -right-2 -bottom-2 pointer-events-none opacity-5 select-none">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 whitespace-nowrap tracking-wider">
          {koreanDramaTitle || 'アニメ'}
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

      {/* Center Anime Title & Artwork */}
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
