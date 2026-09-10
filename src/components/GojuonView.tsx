import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Lightbulb,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SEION_ROWS, 
  DAKUON_ROWS, 
  YOUON_ROWS, 
  KanaItem 
} from '../data/japanese/gojuon';
import { speakJapanese } from '../utils/speech';

export const GojuonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seion' | 'dakuon' | 'youon' | 'rules'>('seion');
  const [displayScript, setDisplayScript] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(() => SEION_ROWS[0].items[0]);
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [quizQuestion, setQuizQuestion] = useState<{ target: KanaItem; options: KanaItem[] } | null>(null);
  const [quizResult, setQuizResult] = useState<{ selectedId: string; isCorrect: boolean } | null>(null);
  const [streak, setStreak] = useState<number>(0);

  const handlePlaySound = (kana: KanaItem) => {
    setSelectedKana(kana);
    speakJapanese(kana.audioText);
  };

  // 生成听音辨字挑战
  const startNewQuiz = () => {
    const allKana = SEION_ROWS.flatMap(r => r.items.filter((i): i is KanaItem => i !== null));
    const randomTarget = allKana[Math.floor(Math.random() * allKana.length)];
    const distractors: KanaItem[] = [];
    while (distractors.length < 3) {
      const candidate = allKana[Math.floor(Math.random() * allKana.length)];
      if (candidate.id !== randomTarget.id && !distractors.some(d => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }
    const options = [randomTarget, ...distractors].sort(() => Math.random() - 0.5);
    setQuizQuestion({ target: randomTarget, options });
    setQuizResult(null);
    speakJapanese(randomTarget.audioText);
  };

  const handleSelectQuizOption = (opt: KanaItem) => {
    if (!quizQuestion || quizResult) return;
    const isCorrect = opt.id === quizQuestion.target.id;
    setQuizResult({ selectedId: opt.id, isCorrect });

    if (isCorrect) {
      setStreak(prev => prev + 1);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => {
        startNewQuiz();
      }, 1200);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Header & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
              🌸 零基础入门工坊
            </span>
            <span className="text-xs font-semibold text-slate-400">
              标准东京腔真人发音
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            五十音图速记与发音工坊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            清音·浊音·拗音全面覆盖，平片假名一键对照，汉字象形起源速记，摆脱死记硬背！
          </p>
        </div>

        {/* Script Switcher & Quiz Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Hiragana vs Katakana Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setDisplayScript('hiragana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                displayScript === 'hiragana'
                  ? 'bg-white text-sky-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              平假名 (あ)
            </button>
            <button
              onClick={() => setDisplayScript('katakana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                displayScript === 'katakana'
                  ? 'bg-white text-sky-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              片假名 (ア)
            </button>
          </div>

          <button
            onClick={() => {
              if (!practiceMode) startNewQuiz();
              setPracticeMode(!practiceMode);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
              practiceMode
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{practiceMode ? '返回图表' : '听音识假名挑战'}</span>
          </button>
        </div>
      </div>

      {/* 2. Practice Quiz Mode */}
      {practiceMode && quizQuestion && (
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 rounded-3xl border border-sky-200 p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-xs font-bold text-sky-700 bg-white px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
              🎯 听音选假名
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>连对 {streak} 题</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => speakJapanese(quizQuestion.target.audioText)}
              className="w-20 h-20 rounded-3xl bg-sky-600 hover:bg-sky-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-600/30 hover:scale-105 active:scale-95 transition cursor-pointer"
              title="重听发音"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <p className="text-xs text-slate-500 font-medium">
              点击上方喇叭重听发音，选出正确的假名
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {quizQuestion.options.map(opt => {
              const isSelected = quizResult?.selectedId === opt.id;
              const isTarget = opt.id === quizQuestion.target.id;
              let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 text-slate-800';

              if (quizResult) {
                if (isTarget) btnStyle = 'bg-emerald-500 border-emerald-500 text-white font-black shadow-md';
                else if (isSelected) btnStyle = 'bg-rose-500 border-rose-500 text-white font-black';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={quizResult !== null}
                  className={`p-4 rounded-2xl border text-center transition cursor-pointer ${btnStyle}`}
                >
                  <span className="text-3xl font-black block">
                    {displayScript === 'hiragana' ? opt.hiragana : opt.katakana}
                  </span>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">
                    {opt.romaji}
                  </span>
                </button>
              );
            })}
          </div>

          {quizResult && (
            <div className="pt-2">
              <p className={`text-sm font-bold ${quizResult.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                {quizResult.isCorrect ? '🎉 作答正确！太棒了！' : `⚠️ 正确答案是「${quizQuestion.target.hiragana} (${quizQuestion.target.romaji})」`}
              </p>
              <button
                onClick={startNewQuiz}
                className="mt-3 px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition cursor-pointer"
              >
                下一题 ➡️
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Main Chart & Kana Inspector Area */}
      {!practiceMode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center: 50-Sound Interactive Grid (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
            
            {/* Category Tabs: Seion / Dakuon / Youon / Rules */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('seion')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'seion'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                清音 (46音)
              </button>
              <button
                onClick={() => setActiveTab('dakuon')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'dakuon'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                浊音·半浊音 (25音)
              </button>
              <button
                onClick={() => setActiveTab('youon')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'youon'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                拗音 (33音)
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                音变规则 (促音/长音)
              </button>
            </div>

            {/* Sub-Header Column Labels (a / i / u / e / o) */}
            {(activeTab === 'seion' || activeTab === 'dakuon') && (
              <div className="grid grid-cols-6 text-center text-xs font-bold text-slate-400 py-1 bg-slate-50/80 rounded-xl">
                <span>行 / 段</span>
                <span>a段</span>
                <span>i段</span>
                <span>u段</span>
                <span>e段</span>
                <span>o段</span>
              </div>
            )}

            {/* TAB 1: 清音表格 */}
            {activeTab === 'seion' && (
              <div className="space-y-2">
                {SEION_ROWS.map(row => (
                  <div key={row.rowName} className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400 text-center truncate">
                      {row.rowName.split(' ')[0]}
                    </span>
                    {row.items.map((kana, idx) => {
                      if (!kana) {
                        return <div key={idx} className="h-14 rounded-2xl bg-slate-50/50" />;
                      }
                      const isSelected = selectedKana?.id === kana.id;
                      return (
                        <button
                          key={kana.id}
                          onClick={() => handlePlaySound(kana)}
                          className={`h-14 sm:h-16 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center relative group cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30 text-sky-700 shadow-xs'
                              : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/80 text-slate-800'
                          }`}
                        >
                          <span className="text-xl sm:text-2xl font-black">
                            {displayScript === 'hiragana' ? kana.hiragana : kana.katakana}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {kana.romaji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: 浊音与半浊音表格 */}
            {activeTab === 'dakuon' && (
              <div className="space-y-2">
                {DAKUON_ROWS.map(row => (
                  <div key={row.rowName} className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400 text-center truncate">
                      {row.rowName.split(' ')[0]}
                    </span>
                    {row.items.map((kana, idx) => {
                      if (!kana) return <div key={idx} className="h-14 rounded-2xl bg-slate-50/50" />;
                      const isSelected = selectedKana?.id === kana.id;
                      return (
                        <button
                          key={kana.id}
                          onClick={() => handlePlaySound(kana)}
                          className={`h-14 sm:h-16 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30 text-sky-700 shadow-xs'
                              : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/80 text-slate-800'
                          }`}
                        >
                          <span className="text-xl sm:text-2xl font-black">
                            {displayScript === 'hiragana' ? kana.hiragana : kana.katakana}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {kana.romaji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: 拗音表格 */}
            {activeTab === 'youon' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {YOUON_ROWS.map(group => (
                  <div key={group.group} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-sky-700 block">
                      {group.group}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {group.items.map(item => (
                        <button
                          key={item.romaji}
                          onClick={() => speakJapanese(item.audioText)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xs transition text-center cursor-pointer"
                        >
                          <span className="text-lg font-black block text-slate-800">
                            {displayScript === 'hiragana' ? item.hiragana : item.katakana}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {item.romaji}
                          </span>
                          <span className="text-[9px] text-slate-500 truncate block mt-0.5">
                            {item.zh}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: 音变规则速查 (促音/长音/拨音) */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1.5">
                  <h3 className="font-bold text-sky-900 text-sm flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-sky-600" />
                    <span>促音 (っ / ッ)：短促停顿一拍的艺术</span>
                  </h3>
                  <p>
                    小写的「っ」本身不发音，在发音器官准备发下一个辅音前<strong>停顿一拍</strong>。如「切符 (きっぷ / ki-ppu)」车票、「雑誌 (ざっし / za-sshi)」杂志。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
                  <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-indigo-600" />
                    <span>长音 (ー / 伸ばす音)：拉长一拍的区别</span>
                  </h3>
                  <p>
                    平假名长音：あ段加あ、い段加い、う段加う、え段加え/い、お段加お/う。片假名长音统一用长音横杠「ー」。长音发满两拍，意思大不同！如「おばさん (阿姨)」vs「おばあさん (奶奶)」。
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right: Selected Kana Deep Dive Inspector (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-5 sticky top-24">
            {selectedKana ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {selectedKana.row} · {selectedKana.col}
                  </span>
                  <button
                    onClick={() => speakJapanese(selectedKana.audioText)}
                    className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition cursor-pointer"
                    title="播放发音"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Big Kana Displays */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-4xl font-black text-slate-900 block">
                      {selectedKana.hiragana}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      平假名
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-4xl font-black text-slate-900 block">
                      {selectedKana.katakana}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      片假名
                    </span>
                  </div>
                </div>

                {/* Origin (汉字源头) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">
                    📜 汉字起源：
                  </span>
                  <p className="text-amber-950 font-medium">
                    平假名源自 <span className="font-bold underline">{selectedKana.origin.hiragana}</span>
                  </p>
                  <p className="text-amber-950 font-medium">
                    片假名源自 <span className="font-bold underline">{selectedKana.origin.katakana}</span>
                  </p>
                </div>

                {/* Mnemonic (象形速记口诀) */}
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs space-y-1">
                  <span className="font-bold text-sky-900 block">
                    💡 趣味速记口诀：
                  </span>
                  <p className="text-sky-950 leading-relaxed font-medium">
                    {selectedKana.mnemonic}
                  </p>
                </div>

                {/* Example Word */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-600 block">
                    📚 真题代表词汇：
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {selectedKana.example.word}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {selectedKana.example.hiragana}
                      </p>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                      {selectedKana.example.zh}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                点击左侧假名卡片查看深度解析与发音
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export const PhoneticsView = GojuonView;
