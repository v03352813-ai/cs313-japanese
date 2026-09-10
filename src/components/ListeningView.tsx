import React, { useState, useEffect, useMemo } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Lock, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { KOREAN_LISTENING_DATA, LISTENING_CATEGORIES } from '../data/korean/listening';
import type { ListeningLesson, ListeningSentence } from '../data/korean/listening';
import { speakKorean, stopSpeaking } from '../utils/speech';

interface ListeningViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  
  // Subtitle visibility toggles
  const [showKo, setShowKo] = useState<boolean>(true);
  const [showRoman, setShowRoman] = useState<boolean>(true);
  const [showZh, setShowZh] = useState<boolean>(true);

  // User quiz answers state: { [questionId]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    if (selectedCategory === '全部') return KOREAN_LISTENING_DATA;
    return KOREAN_LISTENING_DATA.filter(l => l.category === selectedCategory);
  }, [selectedCategory]);

  const lesson: ListeningLesson = filteredLessons[currentLessonIndex] || KOREAN_LISTENING_DATA[0];
  const isLocked = !isVip && !lesson.isFreePreview;

  // Stop audio on unmount or lesson change
  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
    setActiveSentenceIndex(0);
    setUserAnswers({});
    setShowQuizResults(false);
  }, [currentLessonIndex, selectedCategory]);

  const playSentence = async (index: number) => {
    if (isLocked) {
      onOpenVipModal(`🔒【${lesson.title}】听力精听课程为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可享受母语原声无限制播放！`);
      return;
    }
    setActiveSentenceIndex(index);
    setIsPlaying(true);
    const sentence = lesson.sentences[index];
    if (sentence) {
      await speakKorean(sentence.ko, playbackRate);
    }
    setIsPlaying(false);
  };

  const playAllSequentially = async () => {
    if (isLocked) {
      onOpenVipModal(`🔒【${lesson.title}】听力精听课程为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可享受母语原声无限制播放！`);
      return;
    }
    setIsPlaying(true);
    for (let i = activeSentenceIndex; i < lesson.sentences.length; i++) {
      setActiveSentenceIndex(i);
      await speakKorean(lesson.sentences[i].ko, playbackRate);
      // Brief pause between sentences
      await new Promise(r => setTimeout(r, 600));
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      playAllSequentially();
    }
  };

  const handleSelectOption = (questionId: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optIdx }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* 顶部轻量步骤导引条 */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-black">
                听力精听工坊
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                TOPIK 分类场景原声精听 & 随堂自测
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              涵盖日常生活、大学学术、职场商务 · 逐句精听点读与随堂测验
            </p>
          </div>
        </div>

        {/* 字幕显示快捷开关 */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-end md:self-auto shrink-0 text-xs">
          <button
            onClick={() => setShowKo(!showKo)}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              showKo ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {showKo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>韩文</span>
          </button>
          <button
            onClick={() => setShowRoman(!showRoman)}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              showRoman ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {showRoman ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>罗马音</span>
          </button>
          <button
            onClick={() => setShowZh(!showZh)}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              showZh ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {showZh ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>中文</span>
          </button>
        </div>
      </div>

      {/* 场景分类 + 课文下拉切换器 (紧凑集成，首屏即见播放器与台词) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* 场景分类 Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">精听场景:</span>
            {LISTENING_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentLessonIndex(0);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 下拉式课文切换器 */}
          <div className="flex items-center gap-2 flex-1 min-w-0 sm:max-w-md justify-end">
            <span className="text-xs font-bold text-slate-700 shrink-0">切换课文:</span>
            <div className="relative flex-1 min-w-0">
              <select
                value={currentLessonIndex}
                onChange={(e) => {
                  const targetIdx = Number(e.target.value);
                  const targetLesson = filteredLessons[targetIdx];
                  const isLessonLocked = !isVip && !targetLesson?.isFreePreview;
                  if (isLessonLocked) {
                    onOpenVipModal(`🔒【${targetLesson?.title}】精听课程为 VIP 会员专享！升级 VIP 终身卡（仅 ¥49.9），即可解锁全部听力剧场！`);
                    return;
                  }
                  setCurrentLessonIndex(targetIdx);
                }}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer appearance-none truncate shadow-2xs"
              >
                {filteredLessons.map((l, idx) => {
                  const isLessonLocked = !isVip && !l.isFreePreview;
                  const status = isLessonLocked ? '🔒 [VIP] ' : '✓ ';
                  return (
                    <option key={l.id} value={idx}>
                      {status}[{idx + 1}/{filteredLessons.length}] {l.title} ({l.badge})
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Player & Sentence Stream */}
      {isLocked ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-orange-200 shadow-xl text-center space-y-4 max-w-xl mx-auto my-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">【{lesson.title}】为 VIP 专属听力精学课程</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            该课程包含 {lesson.sentences.length} 句母语原声对话、逐句慢速复读、听力挖空与随堂理解测试。免费学员仅可体验第 1 篇体验课。升级 VIP 终身卡（仅 ¥49.9），立即解锁全部精听课程！
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenVipModal(`🔒【${lesson.title}】听力精听课程为 VIP 专属！升级 VIP 终身卡（仅 ¥49.9），即可畅听全部课程！`)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              立即升级 VIP 解锁全部听力 (¥49.9)
            </button>
            <button
              onClick={() => setCurrentLessonIndex(0)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              返回免费体验课
            </button>
          </div>
        </div>
      ) : lesson ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Sentences stream (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Active Lesson Header Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200/60">
                      {lesson.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                      {lesson.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                    {lesson.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    场景：{lesson.scenario}
                  </p>
                </div>
              </div>

              {/* Audio Control Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 hover:scale-105 active:scale-95 transition shadow-md shadow-orange-500/20"
                    title={isPlaying ? '暂停' : '连贯朗读整篇'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  <button
                    onClick={() => playSentence(activeSentenceIndex)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition"
                    title="单句复读"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Rate Selector */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                        playbackRate === rate ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentences List */}
            <div className="space-y-3">
              {lesson.sentences.map((sent, idx) => {
                const isActive = activeSentenceIndex === idx;
                return (
                  <div
                    key={sent.id}
                    onClick={() => playSentence(idx)}
                    className={`p-5 rounded-3xl border transition cursor-pointer select-none relative overflow-hidden ${
                      isActive
                        ? 'bg-orange-50/70 border-orange-300 shadow-sm'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          {sent.speaker}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSentence(idx);
                          }}
                          className={`p-1.5 rounded-lg transition ${
                            isActive ? 'text-orange-600 bg-white' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Korean Text */}
                      {showKo && (
                        <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                          {sent.ko}
                        </p>
                      )}

                      {/* Romanization */}
                      {showRoman && (
                        <p className="text-xs font-mono text-slate-400">
                          {sent.roman}
                        </p>
                      )}

                      {/* Chinese Translation */}
                      {showZh && (
                        <p className="text-xs sm:text-sm font-medium text-slate-600">
                          {sent.zh}
                        </p>
                      )}

                      {/* Key Vocabulary & Grammar Badges */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        {sent.keyVocab.map((v, vIdx) => (
                          <span 
                            key={vIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                          >
                            <strong className="text-orange-600">{v.word}</strong>: {v.meaning}
                          </span>
                        ))}
                        {sent.grammarPoint && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                            📌 {sent.grammarPoint}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Comprehension Quiz (1 span) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-500 text-white">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  随堂精听理解测试
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                完成逐句精听后，测试你对对话细节与主旨的捕捉能力。
              </p>

              {/* Questions List */}
              <div className="space-y-4">
                {lesson.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-xs font-bold text-slate-800">
                      Q{qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        const isCorrect = showQuizResults && optIdx === q.correctIndex;
                        const isWrong = showQuizResults && isSelected && optIdx !== q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-start gap-2 border ${
                              isCorrect 
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                : isWrong
                                ? 'bg-rose-100 border-rose-300 text-rose-900'
                                : isSelected
                                ? 'bg-orange-500 text-white border-orange-500 font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-bold shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Analysis Box */}
                    {showQuizResults && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <p className="font-bold text-slate-800">
                          {userAnswers[q.id] === q.correctIndex ? '✅ 回答正确' : '❌ 选错了'}
                        </p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          解析：{q.analysis}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowQuizResults(!showQuizResults)}
                className="w-full py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
              >
                {showQuizResults ? '重置作答' : '提交并查看答案解析'}
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl text-center border border-slate-200">
          <p className="text-slate-500">该分类下暂无精听课程</p>
        </div>
      )}

      {/* Free User Listening VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【首课精听 · 免费体验】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），即可解锁全部 <strong>生活/职场/考级原声剧场</strong>、逐句 0.75x~1.5x 倍速精读与随堂自测！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal('🔒 开通 VIP 终身卡（仅 ¥49.9），即可解锁全部听力剧场、逐句慢速复读与听力自测题！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部精听课程 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};
