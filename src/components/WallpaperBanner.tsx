import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WallpaperBannerProps {
  onOpenWallpaperModal?: () => void;
  className?: string;
}

export const WallpaperBanner: React.FC<WallpaperBannerProps> = ({
  onOpenWallpaperModal,
  className = ''
}) => {
  return (
    <div
      onClick={onOpenWallpaperModal}
      className={`group relative bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-teal-500/10 rounded-3xl p-5 sm:p-6 border border-sky-200/80 shadow-md shadow-sky-500/5 hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer overflow-hidden space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Thumbnail & Text */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-sky-300/80 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/images/wallpaper/wallpaper_thumb.jpg" 
              alt="一子一木4K高清壁纸" 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] text-sky-300 font-extrabold px-1.5 py-0.2 rounded-md">
              4K原图
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-[10px] font-extrabold shadow-2xs">
                🎁 学员美学福利
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-600 transition">
                一子一木 4K 伴学治愈壁纸屋
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              精选日系清爽氛围感手机/iPad 高清学习壁纸 · 免费下载 · 每日打卡参与微信小程序积分抽大奖！
            </p>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-sky-800/80 font-mono">
              <span className="bg-white/80 px-2 py-0.5 rounded-md border border-sky-200/60 font-semibold">
                #小程序://一子一木/0JPDrt84ecI5Gwd
              </span>
              <span>微信扫码 / 口令秒开</span>
            </div>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenWallpaperModal) onOpenWallpaperModal();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-1.5 group-hover:translate-x-0.5 cursor-pointer"
          >
            <span>🎁 免费领取壁纸 / 抽奖</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
