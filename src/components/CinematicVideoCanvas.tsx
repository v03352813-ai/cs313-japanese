import React, { useRef } from 'react';
import { DramaDialogueLine } from '../data/korean/kdrama';
import { 
  Play, 
  Maximize2, 
  Sparkles, 
  Headphones,
  Volume2
} from 'lucide-react';

export type VideoEngineMode = 'video' | 'bilibili' | 'stage';

interface CinematicVideoCanvasProps {
  cardIndex?: number;
  stillUrl?: string;
  posterUrl?: string;
  videoUrl?: string;
  bilibiliBvid?: string;
  dramaTitle: string;
  koreanTitle: string;
  sceneTitle: string;
  levelTag: string;
  genre: string;
  durationSeconds: number;
  dialogues: DramaDialogueLine[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentLine: DramaDialogueLine | null;
  subtitleMode: 'bilingual' | 'korean_only' | 'hidden';
  videoSpeed: number;
  videoEngine?: string;
  onEngineChange?: (engine: any) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onTimeUpdate?: () => void;
  onEnded?: () => void;
  onPlayStateChange?: (playing: boolean) => void;
  customVideoBlobUrl?: string | null;
  onCustomVideoLoaded?: (blobUrl: string, fileName: string) => void;
}

export const CinematicVideoCanvas: React.FC<CinematicVideoCanvasProps> = ({
  dramaTitle,
  koreanTitle,
  sceneTitle,
  isPlaying,
  onTogglePlay,
  currentLine,
  subtitleMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video sm:aspect-16/9 min-h-[380px] max-h-[560px] bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl flex items-center justify-center overflow-hidden select-none group/player transition-all duration-300 shadow-2xl border border-white/10"
    >
      {/* Ambient Glowing Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-slate-950/40 to-black/80 pointer-events-none" />
      
      {/* Background Korean Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <span className="text-8xl sm:text-9xl font-black tracking-widest text-white whitespace-nowrap font-serif">
          {koreanTitle || '한국 드라마'}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* --- TOP CONTROL BAR --- */}
      {/* ========================================================================= */}
      <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Headphones className="w-3.5 h-3.5 text-orange-400" />
            <span>影视原声 · 名台词精听研习</span>
          </span>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition shadow-md"
            title="全屏沉浸精听"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- CENTER AUDIO VISUALIZER / PLAY BUTTON --- */}
      {/* ========================================================================= */}
      <div 
        onClick={onTogglePlay}
        className="relative z-20 flex flex-col items-center justify-center gap-4 cursor-pointer group/center py-8"
      >
        {isPlaying ? (
          /* Live Equalizer Wave Animation */
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/80 animate-pulse">
              <Volume2 className="w-10 h-10" />
            </div>
            
            <div className="flex items-center gap-1.5">
              {[18, 36, 26, 44, 30, 22, 40, 24, 38, 16, 28, 42, 20].map((h, i) => (
                <span 
                  key={i} 
                  className="w-1.5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-300 rounded-full animate-pulse shadow-lg shadow-orange-500/50" 
                  style={{ 
                    height: `${h}px`, 
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: '0.6s'
                  }} 
                />
              ))}
            </div>

            <span className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/15 shadow-xl">
              🔊 正在原声精听 · 点击暂停
            </span>
          </div>
        ) : (
          /* Center Play Button */
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/90 group-hover/center:scale-110 transition duration-300">
              <Play className="w-9 h-9 fill-current ml-1" />
            </div>
            <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/15 shadow-xl group-hover/center:bg-black transition">
              ▶ 点击播放原声与逐句精读
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* --- FLOATING LOWER-THIRD SUBTITLE GLASS BAR --- */}
      {/* ========================================================================= */}
      {currentLine && subtitleMode !== 'hidden' && (
        <div className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-8 sm:right-8 z-20 bg-black/85 backdrop-blur-xl px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl border border-white/15 shadow-2xl space-y-1 text-center transition-all duration-300 pointer-events-none ${
          isPlaying ? 'opacity-100 translate-y-0' : 'opacity-90'
        }`}>
          {/* Character Tag */}
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${currentLine.avatarColor || 'bg-orange-500'}`}>
              {currentLine.speaker} ({currentLine.role})
            </span>
          </div>

          {/* Korean Dialogue Headline */}
          <p className="text-base sm:text-xl font-bold text-white tracking-wide drop-shadow-md leading-snug">
            {currentLine.ko}
          </p>

          {/* Chinese Translation Line */}
          {subtitleMode === 'bilingual' && (
            <p className="text-xs sm:text-sm font-medium text-amber-300 drop-shadow-sm">
              {currentLine.zh}
            </p>
          )}

          {/* Romanized Line */}
          {currentLine.roman && (
            <p className="text-[10px] text-slate-400 font-mono italic">
              {currentLine.roman}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
