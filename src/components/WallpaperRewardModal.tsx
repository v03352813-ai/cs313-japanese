import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Smartphone, Gift, ZoomIn } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WallpaperRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperRewardModal: React.FC<WallpaperRewardModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const miniProgramCode = '#小程序://一子一木/0JPDrt84ecI5Gwd';

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(miniProgramCode);
    setCopied(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden select-none">
        
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-3.5 sm:px-5 sm:py-4 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-base shadow-inner shrink-0">
              🎁
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight">学员美学福利 · 一子一木壁纸屋</h3>
                <span className="px-2 py-0.2 rounded-full bg-white/20 text-[10px] font-extrabold">
                  免费领取
                </span>
              </div>
              <p className="text-[11px] text-white/90 leading-tight">
                4K 高清治愈壁纸 · iPad 伴学锁屏 · 每日积分抽奖
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Body - Side-by-side Dual Cards (Zero Scrolling) */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Dual Visual Columns: Left Wallpaper Preview + Right High-Res QR Code */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* Left: 4K Wallpaper Preview Card */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-200/90 shadow-xs group bg-slate-100 flex flex-col justify-between min-h-[190px] sm:min-h-[200px]">
              <img 
                src="/images/wallpaper/wallpaper_thumb.jpg" 
                alt="一子一木4K高清壁纸"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              
              <div className="relative z-10 p-2 flex justify-start">
                <span className="text-[10px] bg-amber-500/90 backdrop-blur-xs px-2 py-0.5 rounded-full font-black text-white shadow-xs border border-amber-300/40">
                  ✨ 4K 原图
                </span>
              </div>

              <div className="relative z-10 p-2.5 text-white">
                <p className="text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>韩系伴学锁屏</span>
                </p>
                <p className="text-[10px] text-white/80 leading-tight mt-0.5">
                  手机 / iPad 治愈氛围
                </p>
              </div>
            </div>

            {/* Right: Large High-Res Mini-Program QR Code Card */}
            <div 
              onClick={() => setIsZoomed(true)}
              className="rounded-2xl border-2 border-amber-200/90 bg-gradient-to-b from-amber-50/80 to-orange-50/40 p-2 sm:p-3 flex flex-col items-center justify-between text-center min-h-[180px] sm:min-h-[200px] shadow-xs cursor-pointer group hover:border-orange-400 transition"
              title="点击可放大二维码"
            >
              <div className="flex items-center justify-between w-full px-1 text-[10px] font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-orange-600" />
                  <span>微信长按/扫码</span>
                </span>
                <span className="text-orange-600 font-semibold flex items-center gap-0.5 group-hover:underline">
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>放大</span>
                </span>
              </div>

              {/* Large Sharp QR Code Box (Fluid aspect-square for mobile and desktop) */}
              <div className="w-full max-w-[130px] sm:max-w-[160px] aspect-square p-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden my-0.5">
                <img 
                  src="/images/wallpaper/qrcode.png" 
                  alt="一子一木小程序码"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                />
              </div>

              <span className="text-[10px] text-slate-500 font-medium leading-tight">
                打开微信扫码 (可点击放大)
              </span>
            </div>

          </div>

          {/* Quick Copy Command Line (Integrated Single-Row Layout) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
            <div className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-dashed border-amber-300/80 font-mono text-[11px] text-amber-900 select-all truncate text-center sm:text-left flex items-center justify-between">
              <span className="truncate">{miniProgramCode}</span>
              {copied && <span className="text-[10px] text-emerald-600 font-black shrink-0 ml-1">已复制！</span>}
            </div>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs shadow-orange-500/20 active:scale-98 transition flex items-center justify-center gap-1 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制口令！' : '一键复制口令'}</span>
            </button>
          </div>

          {/* Bottom Incentive Note */}
          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-slate-600 flex items-center gap-2">
            <Gift className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="leading-snug">
              每日在【一子一木】小程序打卡领积分，可<strong>免费兑换无水印原图</strong>并参与惊喜抽大奖！
            </span>
          </div>

        </div>

        {/* Click-to-Zoom Super Large Lightbox Modal */}
        {isZoomed && (
          <div 
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">微信扫码进入【一子一木】</h4>
                <button 
                  onClick={() => setIsZoomed(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-56 h-56 mx-auto p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-md flex items-center justify-center">
                <img 
                  src="/images/wallpaper/qrcode.png" 
                  alt="一子一木小程序码高清放大"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-xs text-slate-500">
                支持手机微信直接对准屏幕扫码或长按识别
              </p>

              <button
                onClick={() => setIsZoomed(false)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                关闭大图
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
