import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Clapperboard, 
  Volume2, 
  Sparkles, 
  Flame, 
  Lock, 
  Mic, 
  BookOpen, 
  HelpCircle, 
  RotateCcw, 
  Layers, 
  Play, 
  Pause, 
  Film, 
  Repeat,
  Eye,
  EyeOff,
  Gauge,
  Plus,
  Tv,
  Search,
  CheckCircle2,
  Video,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Bookmark,
  Share2,
  Headphones,
  List,
  LayoutGrid,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  KDramaScene, 
  DramaDialogueLine,
  DRAMA_GENRE_CATEGORIES, 
  DRAMA_DIFFICULTY_LEVELS,
  DRAMA_CATEGORY_META,
  K_DRAMA_SCENES,
  getAllDramaScenes,
  DramaLevelTag
} from '../data/korean/kdrama';
import { speakKorean, stopSpeaking } from '../utils/speech';
import { VideoImportModal } from './VideoImportModal';
import { DramaThumbnail } from './DramaThumbnail';
import { CinematicVideoCanvas, VideoEngineMode } from './CinematicVideoCanvas';

interface KDramaViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
  initialSceneId?: string;
}

type PracticeMode = 'breakdown' | 'shadowing' | 'quiz';
type SubtitleDisplayMode = 'bilingual' | 'korean_only' | 'hidden';

export const KDramaView: React.FC<KDramaViewProps> = ({ 
  isVip, 
  onOpenVipModal,
  initialSceneId 
}) => {
  // Scene Data State (supports live updates from storage)
  const [allScenes, setAllScenes] = useState<KDramaScene[]>(() => getAllDramaScenes());
  const [selectedGenre, setSelectedGenre] = useState<string>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部难度');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(() => {
    if (initialSceneId) return initialSceneId;
    return allScenes[0]?.id || 'drama-lovely-runner-face';
  });

  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('breakdown');
  const [viewMode, setViewMode] = useState<'list' | 'slider' | 'grid'>('list');
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Reset list expand when filter changes
  useEffect(() => {
    setIsListExpanded(false);
  }, [selectedGenre, selectedDifficulty, searchQuery]);

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setSliderProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
        setCanScrollLeft(scrollLeft > 15);
        setCanScrollRight(scrollLeft < maxScroll - 15);
      }
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Video Player Engines (Native Video / Bilibili / Cinematic Stage)
  const [videoEngine, setVideoEngine] = useState<VideoEngineMode>('video');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentSec, setVideoCurrentSec] = useState<number>(0);
  const [videoSpeed, setVideoSpeed] = useState<number>(1.0);
  const [subtitleMode, setSubtitleMode] = useState<SubtitleDisplayMode>('bilingual');
  const [savedVocabWords, setSavedVocabWords] = useState<string[]>([]);
  const [customVideoBlobs, setCustomVideoBlobs] = useState<Record<string, { blobUrl: string; fileName: string }>>({});

  // Sequential speech playback timer for stage mode
  const [isAutoPlayingAll, setIsAutoPlayingAll] = useState<boolean>(false);
  const autoPlayIndexRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<any>(null);

  // Quiz mode state: { [lineId]: selectedOption }
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Top player container ref for smooth scrolling
  const playerTopRef = useRef<HTMLDivElement>(null);

  // Sync with incoming initialSceneId when navigating from homepage
  useEffect(() => {
    if (initialSceneId) {
      setSelectedSceneId(initialSceneId);
    }
  }, [initialSceneId]);

  // Free user safety check: non-VIP cannot stay on locked scenes
  useEffect(() => {
    const currentScene = allScenes.find(s => s.id === selectedSceneId);
    if (!isVip && currentScene && !currentScene.isFreePreview) {
      setSelectedSceneId('drama-lovely-runner-face');
    }
  }, [isVip, allScenes, selectedSceneId]);

  // Reload scenes when updated
  const refreshScenes = (newSceneId?: string) => {
    const updated = getAllDramaScenes();
    setAllScenes(updated);
    if (newSceneId) {
      setSelectedSceneId(newSceneId);
    }
  };

  // Filtered scenes by category, difficulty & search
  const filteredScenes = useMemo(() => {
    return allScenes.filter(s => {
      if (!s) return false;
      // Category filter
      if (selectedGenre !== '全部') {
        const cleanCat = selectedGenre.replace(/^[^\s]+\s*/, '');
        if (s.category !== cleanCat && (!s.genre || !s.genre.includes(cleanCat))) {
          return false;
        }
      }
      // Difficulty filter
      if (selectedDifficulty !== '全部难度') {
        const cleanLevel = selectedDifficulty.includes('初级') ? '初级' : selectedDifficulty.includes('中级') ? '中级' : '高级';
        if (s.levelTag !== cleanLevel && (!s.difficulty || !s.difficulty.includes(cleanLevel))) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (s.dramaTitle || '').toLowerCase().includes(q) || (s.koreanDramaTitle || '').toLowerCase().includes(q);
        const matchScene = (s.sceneTitle || '').toLowerCase().includes(q) || (s.summary || '').toLowerCase().includes(q);
        const matchDialogue = (s.dialogues || []).some(d => (d.ko || '').includes(q) || (d.zh || '').includes(q));
        if (!matchTitle && !matchScene && !matchDialogue) {
          return false;
        }
      }
      return true;
    });
  }, [allScenes, selectedGenre, selectedDifficulty, searchQuery]);

  const scene: KDramaScene = useMemo(() => {
    const found = allScenes.find(s => s && s.id === selectedSceneId);
    if (found) return found;
    if (filteredScenes && filteredScenes.length > 0) return filteredScenes[0];
    if (allScenes && allScenes.length > 0) return allScenes[0];
    return K_DRAMA_SCENES[0];
  }, [allScenes, selectedSceneId, filteredScenes]);

  const isLocked = !isVip && scene && !scene.isFreePreview;

  // Find currently active spoken line based on video current second or activeLineId
  const currentSpokenLine = useMemo(() => {
    const dialogues = scene?.dialogues || [];
    if (dialogues.length === 0) return null;
    if (activeLineId !== null) {
      const found = dialogues.find(d => d.id === activeLineId);
      if (found) return found;
    }
    return dialogues.find(
      d => videoCurrentSec >= d.timeSec && videoCurrentSec < (d.timeSec + d.durationSec)
    ) || dialogues[0] || null;
  }, [scene, videoCurrentSec, activeLineId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);

  // Handle switching drama scene
  useEffect(() => {
    stopSpeaking();
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlayingAll(false);
    setIsVideoPlaying(false);
    setVideoCurrentSec(0);
    setActiveLineId(null);
    setQuizAnswers({});
    setShowQuizResult(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [selectedSceneId]);

  const handleSelectSceneFromGallery = (targetSceneId: string) => {
    const targetScene = allScenes.find(s => s.id === targetSceneId);
    if (!isVip && targetScene && !targetScene.isFreePreview) {
      onOpenVipModal(`🔒《${targetScene.dramaTitle}》(${targetScene.sceneTitle})为 VIP 会员专属经典原声剧场！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部 30 部韩剧名场面沉浸台词磨耳朵！`);
      return;
    }
    setSelectedSceneId(targetSceneId);
    if (playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const togglePlayVideo = () => {
    if (isLocked) {
      onOpenVipModal(`🔒《${scene.dramaTitle}》为 VIP 专属经典原声剧场！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部 30 部经典韩剧名场面！`);
      return;
    }

    if (!scene) return;
    const activeVideoSrc = customVideoBlobs[scene.id]?.blobUrl || scene.videoUrl;
    
    if (activeVideoSrc && videoRef.current) {
      stopSpeaking();
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsVideoPlaying(true);
        }).catch((err) => {
          console.warn('Video playback restricted, falling back to audio playback', err);
          handleStartAudioSequence();
        });
      }
    } else {
      // Stage Audio Sequence Mode (Works seamlessly for all 30 scenes)
      handleStartAudioSequence();
    }
  };

  // Smart sequential TTS playback for the whole scene
  const handleStartAudioSequence = () => {
    if (isAutoPlayingAll) {
      stopSpeaking();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      setIsAutoPlayingAll(false);
      return;
    }

    setIsAutoPlayingAll(true);
    autoPlayIndexRef.current = 0;
    playNextSequentialLine();
  };

  const playNextSequentialLine = () => {
    const dialogues = scene?.dialogues || [];
    if (autoPlayIndexRef.current >= dialogues.length) {
      setIsAutoPlayingAll(false);
      setActiveLineId(null);
      return;
    }

    const line = dialogues[autoPlayIndexRef.current];
    if (!line) return;
    setActiveLineId(line.id);
    setVideoCurrentSec(line.timeSec);
    speakKorean(line.ko, videoSpeed);

    const speechTimeMs = Math.max(3000, Math.min(8000, (line.ko.length * 280 + 1200) / videoSpeed));
    autoPlayTimerRef.current = setTimeout(() => {
      autoPlayIndexRef.current += 1;
      playNextSequentialLine();
    }, speechTimeMs);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && scene) {
      const cur = videoRef.current.currentTime;
      setVideoCurrentSec(cur);
      const dialogues = scene.dialogues || [];
      const matched = dialogues.find(
        d => cur >= d.timeSec && cur < (d.timeSec + d.durationSec)
      );
      if (matched && matched.id !== activeLineId) {
        setActiveLineId(matched.id);
      }
    }
  };

  const playSingleLine = (lineId: number, text: string, timeSec?: number) => {
    if (isLocked) {
      onOpenVipModal(`🔒《${scene.dramaTitle}》为 VIP 专属经典原声剧场！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部 30 部韩剧名场面！`);
      return;
    }
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlayingAll(false);
    setActiveLineId(lineId);

    if (videoEngine === 'video' && videoRef.current) {
      stopSpeaking();
      if (timeSec !== undefined) {
        videoRef.current.currentTime = timeSec;
      }
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        speakKorean(text, videoSpeed);
      });
    } else {
      speakKorean(text, videoSpeed);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setVideoSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleSaveWord = (word: string) => {
    setSavedVocabWords(prev => 
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const handleSelectQuizOption = (lineId: number, option: string) => {
    setQuizAnswers(prev => ({ ...prev, [lineId]: option }));
  };

  const handleCheckQuiz = () => {
    setShowQuizResult(true);
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.7 }
    });
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResult(false);
  };

  const categoryMeta = (scene?.category && DRAMA_CATEGORY_META[scene.category]) 
    ? DRAMA_CATEGORY_META[scene.category] 
    : (DRAMA_CATEGORY_META['国民口碑神剧'] || { label: '国民口碑神剧', icon: '🏆', desc: '经典韩剧', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' });

  const getLevelBadgeClass = (tag?: DramaLevelTag | string) => {
    switch(tag) {
      case '初级':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case '中级':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case '高级':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200/80';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-5 sm:p-6 rounded-3xl border border-orange-100/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-500 text-white shadow-xs">
              <Headphones className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              影视原声 · 名台词听力精练研习室
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
            30 部热播经典韩剧名台词磨耳朵，逐句精听盲听、掌握重点词汇与 TOPIK 核心语法！
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Automatic Import & Update Center Trigger */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>自动视频入库与更新</span>
          </button>

          {/* Practice Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setPracticeMode('breakdown')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                practiceMode === 'breakdown'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>精读拆解</span>
            </button>
            
            <button
              onClick={() => setPracticeMode('shadowing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                practiceMode === 'shadowing'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>影子跟读</span>
            </button>

            <button
              onClick={() => setPracticeMode('quiz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                practiceMode === 'quiz'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>台词填空</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- 沉浸式影视原声精练工作台 (纯净原生影视画卷视窗) --- */}
      {/* ========================================================================= */}
      <div ref={playerTopRef} className="space-y-4">
        
        {scene && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white relative group">
            
            {/* Top Video Header Bar */}
            <div className="p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-orange-500 text-white font-bold text-[10px] flex items-center gap-1">
                  <Film className="w-3 h-3" /> 影视原声
                </span>
                <span className="font-bold text-white tracking-wide">
                  《{scene.dramaTitle}》· {scene.sceneTitle}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getLevelBadgeClass(scene.levelTag)}`}>
                  {scene.levelTag || '初级'}
                </span>
              </div>

              {/* Controls: Subtitle & Speed Switchers */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Subtitle Toggle */}
                <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[11px]">
                  <button
                    onClick={() => setSubtitleMode(subtitleMode === 'bilingual' ? 'korean_only' : subtitleMode === 'korean_only' ? 'hidden' : 'bilingual')}
                    className="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-slate-700 text-amber-300 hover:text-white"
                    title="切换字幕显示模式"
                  >
                    {subtitleMode === 'hidden' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{subtitleMode === 'bilingual' ? '双语字幕' : subtitleMode === 'korean_only' ? '仅韩文' : '隐藏字幕 (盲听)'}</span>
                  </button>
                </div>

                {/* Playback Speed Selector */}
                <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[11px]">
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition ${
                        videoSpeed === speed ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Video / Visual Learning Screen (60fps Cinematic Motion Video Canvas) */}
            <CinematicVideoCanvas
              cardIndex={scene.cardIndex}
              stillUrl={scene.stillUrl}
              posterUrl={scene.posterUrl}
              videoUrl={scene.videoUrl}
              bilibiliBvid={scene.bilibiliBvid}
              dramaTitle={scene.dramaTitle}
              koreanTitle={scene.koreanDramaTitle}
              sceneTitle={scene.sceneTitle}
              levelTag={scene.levelTag}
              genre={scene.genre}
              durationSeconds={scene.durationSeconds}
              dialogues={scene.dialogues}
              isPlaying={isVideoPlaying || isAutoPlayingAll}
              onTogglePlay={togglePlayVideo}
              currentLine={currentSpokenLine}
              subtitleMode={subtitleMode}
              videoSpeed={videoSpeed}
              videoEngine={videoEngine}
              onEngineChange={(eng) => {
                setVideoEngine(eng);
                stopSpeaking();
                if (videoRef.current) {
                  videoRef.current.pause();
                  setIsVideoPlaying(false);
                }
              }}
              videoRef={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setIsVideoPlaying(false);
                setIsAutoPlayingAll(false);
              }}
              onPlayStateChange={(playing) => setIsVideoPlaying(playing)}
              customVideoBlobUrl={customVideoBlobs[scene.id]?.blobUrl}
              onCustomVideoLoaded={(blobUrl, fileName) => {
                setCustomVideoBlobs(prev => ({
                  ...prev,
                  [scene.id]: { blobUrl, fileName }
                }));
              }}
            />

            {/* Bottom Player Toolbar */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayVideo}
                  className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                    isVideoPlaying || isAutoPlayingAll
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-orange-500 text-white shadow-xs'
                  }`}
                >
                  {isVideoPlaying || isAutoPlayingAll ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>暂停播放</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>播放全段原声</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (currentSpokenLine) {
                      playSingleLine(currentSpokenLine.id, currentSpokenLine.ko, currentSpokenLine.timeSec);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold flex items-center gap-1.5 transition"
                  title="单句循环跟读"
                >
                  <Repeat className="w-3.5 h-3.5 text-orange-400" />
                  <span>复读当前句</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>{categoryMeta.label} · 难度：{scene.difficulty}</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* --- 核心精学模式 (Breakdown / Shadowing / Quiz) --- */}
      {/* ========================================================================= */}
      {scene && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-6">
          
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Cultural Insight Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>剧集文化背景与地道口语潜台词深度剖析</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                {scene.culturalInsight}
              </p>
            </div>

            {/* MODE 1: 精读精析模式 */}
            {practiceMode === 'breakdown' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>剧集原声对白逐句精析与重点语法</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    点击任意对白即可原声跟读
                  </span>
                </div>

                <div className="space-y-3">
                  {scene.dialogues.map((line) => {
                    const isLineActive = activeLineId === line.id;
                    return (
                      <div
                        key={line.id}
                        onClick={() => playSingleLine(line.id, line.ko, line.timeSec)}
                        className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                          isLineActive
                            ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Speaker & Audio Trigger */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${line.avatarColor}`}>
                              {line.speaker}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({line.role})
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSingleLine(line.id, line.ko, line.timeSec);
                            }}
                            className="p-1.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition"
                            title="朗读该句"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Korean Text */}
                        <div className="space-y-1">
                          <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            {line.ko}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {line.roman}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-700">
                            {line.zh}
                          </p>
                        </div>

                        {/* Highlighted Words */}
                        {line.highlightWords && line.highlightWords.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                            {line.highlightWords.map((w, wIdx) => {
                              const isSaved = savedVocabWords.includes(w.word);
                              return (
                                <button
                                  key={wIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSaveWord(w.word);
                                  }}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                                    isSaved 
                                      ? 'bg-orange-500 text-white shadow-xs' 
                                      : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700'
                                  }`}
                                  title="点击一键收藏到生词本"
                                >
                                  <Bookmark className="w-3 h-3" />
                                  <strong>{w.word}</strong>: {w.meaning}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Grammar Point */}
                        {line.grammarNotes && (
                          <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/50 text-xs text-orange-950 space-y-0.5">
                            <span className="font-bold text-orange-700">💡 语法考点：</span>
                            <span>{line.grammarNotes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODE 2: 影子跟读模式 */}
            {practiceMode === 'shadowing' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-orange-800">
                    <Mic className="w-4 h-4 text-orange-600" />
                    <span>影子跟读法 (Shadowing Practice)</span>
                  </div>
                  <p>
                    点击单句发音按钮，听完后立即模仿韩国演员的语调、停顿与情绪连读进行复述，快速建立韩语本能语感！
                  </p>
                </div>

                <div className="space-y-3">
                  {scene.dialogues.map((line) => (
                    <div
                      key={line.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {line.speaker} ({line.role})
                        </span>
                        
                        <button
                          onClick={() => playSingleLine(line.id, line.ko, line.timeSec)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-orange-600 transition shadow-xs"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 听原声示范
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900">
                          {line.ko}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {line.roman}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {line.zh}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 3: 台词填空模式 */}
            {practiceMode === 'quiz' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>原声台词挖空填空挑战</span>
                  </div>
                  <p>
                    根据剧情语境与语音提示，选择填入最符合韩语语法的正确词汇，巩固核心词汇与助词！
                  </p>
                </div>

                <div className="space-y-4">
                  {scene.dialogues.map((line, idx) => {
                    const quiz = line.clozeQuestion;
                    if (!quiz) return null;
                    const userSelected = quizAnswers[line.id];
                    const isCorrect = userSelected === quiz.maskedWord;

                    return (
                      <div
                        key={line.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">
                            第 {idx + 1} 题 · {line.speaker} 的台词
                          </span>
                          <button
                            onClick={() => speakKorean(line.ko)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> 听原句
                          </button>
                        </div>

                        {/* Masked Korean Question */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-base font-bold text-slate-900 leading-relaxed">
                            {quiz.maskedKo}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            中文翻译：{line.zh}
                          </p>
                        </div>

                        {/* Option Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          {quiz.options.map((opt, optIdx) => {
                            const isThisOption = userSelected === opt;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizOption(line.id, opt)}
                                className={`p-2.5 rounded-xl text-xs font-semibold transition border text-left ${
                                  isThisOption
                                    ? showQuizResult
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                        : 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                                      : 'bg-orange-500 border-orange-500 text-white font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Result & Hint */}
                        {showQuizResult && (
                          <div className={`p-3 rounded-xl text-xs ${
                            isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
                          }`}>
                            <p className="font-bold">
                              {isCorrect ? '🎉 作答正确！' : `⚠️ 正确答案：${quiz.maskedWord}`}
                            </p>
                            <p className="mt-0.5 text-slate-600">
                              解析提示：{quiz.hint}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                    >
                      重置作答
                    </button>
                    <button
                      onClick={handleCheckQuiz}
                      className="px-6 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition shadow-sm"
                    >
                      提交并查看结果
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- 🌟 截图 1:1 还原: 4 列高颜值名场面画廊 (Gallery Grid View) --- */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        
        {/* Gallery Header & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>韩剧学韩语</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                共 {filteredScenes.length} 个经典片段
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              经典韩剧高光对白精析，掌握重点词汇与语法考点，告别死记硬背！
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle: List (Default, vertical scroll) vs Slider vs Grid */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="列表视图 (手机习惯上下滑动，精选展示+可展开)"
              >
                <List className="w-3.5 h-3.5" />
                <span>列表</span>
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white text-orange-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="横向滑块视图 (左右横滑，单行不占高度)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>滑块</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="画廊卡片视图"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>卡片</span>
              </button>
            </div>

            {/* Quick Slider Arrow Controls in Toolbar (when slider mode active) */}
            {viewMode === 'slider' && (
              <div className="hidden sm:flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <button
                  onClick={() => scrollSlider('left')}
                  disabled={!canScrollLeft}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="向前滑动"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  disabled={!canScrollRight}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="向后滑动"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索剧名、名台词或语法..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Chips (Genre & Difficulty) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {DRAMA_DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Genre Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {DRAMA_GENRE_CATEGORIES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* --- 模式 1: 沉浸式横向滑块视图 (Slider View - 默认，彻底杜绝页面过长) --- */}
        {viewMode === 'slider' && (
          <div className="space-y-3 relative">
            {/* Left & Right floating buttons on desktop */}
            {canScrollLeft && (
              <button
                onClick={() => scrollSlider('left')}
                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:scale-110 active:scale-95 transition cursor-pointer"
                title="向前滑动"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollSlider('right')}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:scale-110 active:scale-95 transition cursor-pointer"
                title="向后滑动"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Horizontal Swipeable Track */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 no-scrollbar select-none"
            >
              {filteredScenes.map((s) => {
                const isSelected = s.id === selectedSceneId;
                const isSceneLocked = !isVip && !s.isFreePreview;
                const firstDialogue = s.dialogues?.[0];

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSceneFromGallery(s.id)}
                    className={`w-[305px] sm:w-[340px] shrink-0 snap-start bg-white rounded-2xl border transition-all duration-200 p-3.5 cursor-pointer relative flex flex-col justify-between hover:border-orange-400 hover:shadow-lg ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20 shadow-xs'
                        : 'border-slate-200/90 shadow-2xs hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Top Row: Mini Thumbnail + Titles */}
                    <div className="flex items-start gap-3">
                      <div className="relative w-24 h-16 sm:w-26 sm:h-17 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
                        <DramaThumbnail
                          dramaTitle={s.dramaTitle}
                          koreanDramaTitle={s.koreanDramaTitle}
                          sceneTitle={s.sceneTitle}
                          levelTag={s.levelTag}
                          category={s.category}
                          className="w-full h-full group-hover:scale-105 transition duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-orange-500 text-white text-[9px] font-black shadow-md flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            <span>精选</span>
                          </div>
                        )}
                        {isSceneLocked && (
                          <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded-md bg-black/75 text-amber-300 text-[9px] font-bold border border-amber-400/40 shadow-xs flex items-center gap-0.5">
                            <Lock className="w-2 h-2 text-amber-400" />
                            <span>VIP</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            《{s.dramaTitle}》
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getLevelBadgeClass(s.levelTag)}`}>
                            {s.levelTag || '初级'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{s.koreanDramaTitle}</p>
                        <p className="text-xs font-bold text-slate-700 line-clamp-1 mt-0.5">{s.sceneTitle}</p>
                      </div>
                    </div>

                    {/* Middle Quote Preview Snippet */}
                    {firstDialogue && (
                      <div className="mt-2.5 bg-slate-50/90 hover:bg-orange-50/40 p-2 rounded-xl border border-slate-100 text-xs space-y-0.5">
                        <p className="font-semibold text-slate-800 truncate text-[11px] font-sans">
                          “{firstDialogue.ko}”
                        </p>
                        <p className="text-slate-500 text-[10px] truncate">
                          {firstDialogue.zh}
                        </p>
                      </div>
                    )}

                    {/* Bottom Row: Info & Trigger */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {s.dialogues.length} 句原声 · {s.episode || '第1集'}
                      </span>

                      {isSelected ? (
                        <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                          <span>正在精学</span>
                        </span>
                      ) : isSceneLocked ? (
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" />
                          <span>VIP 专享</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-orange-600 flex items-center gap-0.5 hover:text-orange-700">
                          <span>点击精学</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Interactive Progress Slider Bar (滑块进度指示器) */}
            <div className="flex items-center justify-between gap-4 pt-1 px-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
                <span>左右滑动浏览全部 {filteredScenes.length} 部剧目 (仅占单行高度)</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Custom Progress Track & Thumb */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickRatio = (e.clientX - rect.left) / rect.width;
                    if (sliderRef.current) {
                      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
                      sliderRef.current.scrollTo({ left: maxScroll * clickRatio, behavior: 'smooth' });
                    }
                  }}
                  className="w-24 sm:w-36 h-2 bg-slate-200/80 rounded-full relative overflow-hidden cursor-pointer"
                  title="点击滑块条快速跳转"
                >
                  <div 
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-150"
                    style={{ 
                      width: '28%', 
                      left: `${sliderProgress * 72}%` 
                    }}
                  />
                </div>

                {/* Small Arrow Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollSlider('left')}
                    disabled={!canScrollLeft}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="向左滑"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollSlider('right')}
                    disabled={!canScrollRight}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="向右滑"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 模式 1: 原生上下滑动列表视图 (List View - 默认精选 6 部 + 一键展开，自然流畅不冗长) --- */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {(isListExpanded ? filteredScenes : filteredScenes.slice(0, 6)).map((s) => {
              const isSelected = s.id === selectedSceneId;
              const isSceneLocked = !isVip && !s.isFreePreview;
              const firstDialogue = s.dialogues?.[0];
              const highlightWords = firstDialogue?.highlightWords || [];

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSceneFromGallery(s.id)}
                  className={`group bg-white rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-400 hover:shadow-md ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20 shadow-xs'
                      : 'border-slate-200/90 shadow-2xs hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left: Compact Visual Thumbnail Box */}
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="relative w-28 sm:w-36 md:w-44 aspect-16/10 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs group-hover:shadow-xs transition">
                      <DramaThumbnail
                        dramaTitle={s.dramaTitle}
                        koreanDramaTitle={s.koreanDramaTitle}
                        sceneTitle={s.sceneTitle}
                        levelTag={s.levelTag}
                        category={s.category}
                        className="w-full h-full group-hover:scale-105 transition duration-300"
                      />
                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 bg-black/30 backdrop-blur-xs">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/50">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>精学中</span>
                        </div>
                      )}
                      {isSceneLocked && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-bold border border-amber-400/40 shadow-sm flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span>VIP</span>
                        </div>
                      )}
                    </div>

                    {/* Mobile-only Header Row */}
                    <div className="sm:hidden flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-slate-900 group-hover:text-orange-600 truncate">《{s.dramaTitle}》</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getLevelBadgeClass(s.levelTag)}`}>
                          {s.levelTag || '初级'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{s.sceneTitle}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{s.koreanDramaTitle}</p>
                    </div>
                  </div>

                  {/* Middle: Rich Learning Content Area (Airy & Typographically Structured) */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full sm:w-auto">
                    {/* Meta Tags Row (Desktop/Tablet) */}
                    <div className="hidden sm:flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-orange-600 transition">
                        《{s.dramaTitle}》
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {s.koreanDramaTitle}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getLevelBadgeClass(s.levelTag)}`}>
                        {s.levelTag || '初级'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {s.episode || '第1集'}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden md:inline">
                        {s.genre}
                      </span>
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-medium hidden lg:inline">
                        {s.category}
                      </span>
                    </div>

                    {/* Scene Title (Desktop/Tablet) */}
                    <div className="hidden sm:block">
                      <h3 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition line-clamp-1">
                        {s.sceneTitle}
                      </h3>
                    </div>

                    {/* High-Value Korean Golden Quote Snippet */}
                    {firstDialogue && (
                      <div className="bg-slate-50/80 hover:bg-orange-50/40 p-2 sm:p-2.5 rounded-xl border border-slate-100/90 transition text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 shrink-0">
                            {firstDialogue.speaker || '名对白'}
                          </span>
                          <span className="font-semibold text-slate-800 truncate font-sans text-xs sm:text-sm">
                            “{firstDialogue.ko}”
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] sm:text-xs truncate pl-1">
                          {firstDialogue.zh}
                        </p>
                      </div>
                    )}

                    {/* Sub Meta Info: Dialogues Count & High Frequency Key Words */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-500">
                        <Film className="w-3.5 h-3.5 text-orange-500" />
                        <span>{s.dialogues.length} 句原声台词</span>
                      </span>
                      {highlightWords.length > 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 text-slate-500">
                          <span className="text-orange-500 font-bold">考点词:</span>
                          <span className="truncate max-w-[280px]">
                            {highlightWords.map(w => w.word).join(' · ')}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Button & State */}
                  <div className="shrink-0 flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>正在精学</span>
                      </div>
                    ) : isSceneLocked ? (
                      <button
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>VIP 专享</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 text-xs font-bold transition shadow-2xs group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 cursor-pointer"
                      >
                        <span>进入精学</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 展开/收起全部剧目按钮：默认展示前 6 部，解决太长太累问题，又保留自然上下滑动习惯 */}
            {filteredScenes.length > 6 && (
              <div className="pt-2">
                {!isListExpanded ? (
                  <button
                    onClick={() => setIsListExpanded(true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200/80 text-orange-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-2xs hover:shadow-xs group cursor-pointer"
                  >
                    <span>向下展开查看全部 {filteredScenes.length} 部剧目 (剩余 {filteredScenes.length - 6} 部)</span>
                    <ChevronDown className="w-4 h-4 text-orange-600 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsListExpanded(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-2xs cursor-pointer"
                  >
                    <span>收起列表 (返回精选 6 部)</span>
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- 模式 2: 4 列高颜值名场面画廊 (Card Grid View) --- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredScenes.map((s) => {
              const isSelected = s.id === selectedSceneId;
              const isSceneLocked = !isVip && !s.isFreePreview;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSceneFromGallery(s.id)}
                  className={`group/card bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] relative ${
                    isSelected 
                      ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md' 
                      : 'border-slate-200/90 shadow-xs'
                  }`}
                >
                  {/* 1. Top Image Banner (16:10 Themed Poster) */}
                  <div className="relative w-full aspect-16/10 overflow-hidden">
                    <DramaThumbnail
                      dramaTitle={s.dramaTitle}
                      koreanDramaTitle={s.koreanDramaTitle}
                      sceneTitle={s.sceneTitle}
                      levelTag={s.levelTag}
                      category={s.category}
                      className="w-full h-full group-hover/card:scale-105 transition duration-500"
                    />
                    
                    {/* Play Trigger Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition duration-300 bg-black/30 backdrop-blur-xs">
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/50 scale-90 group-hover/card:scale-100 transition">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-black shadow-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>正在精学</span>
                      </div>
                    )}

                    {isSceneLocked && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-bold border border-amber-400/40 shadow-lg flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        <span>VIP专享</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Bottom Content Box (Headline, Badge, Drama) */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-orange-600">
                          《{s.dramaTitle}》
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getLevelBadgeClass(s.levelTag)}`}>
                          {s.levelTag || '初级'}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover/card:text-orange-600 transition line-clamp-1 leading-snug">
                        {s.sceneTitle}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-slate-500 truncate">{s.genre}</span>
                      <span className="font-mono text-[10px] text-orange-500 font-bold">▶ 点击精学</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Empty Search Result Fallback */}
        {filteredScenes.length === 0 && (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">没有找到匹配的韩剧片段</p>
            <p className="text-xs text-slate-400">请尝试更换搜索关键词或重置分类难度筛选</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('全部');
                setSelectedDifficulty('全部难度');
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              重置筛选条件
            </button>
          </div>
        )}

      </div>

      {/* Free User KDrama VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【《背着善宰跑》名台词 · 免费体验】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），立即解锁全部 <strong>30 部经典热播韩剧</strong>（《请回答1988》《鬼怪》《泪之女王》等）名台词精练、视频逐句盲听与口语跟读！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁全站 30 部韩剧原声名台词剧场与口语跟读！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部 30 部韩剧名场面 (¥49.9)</span>
          </button>
        </div>
      )}

      {/* Video Import & Management Modal */}
      <VideoImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSceneSaved={refreshScenes}
      />

    </div>
  );
};
