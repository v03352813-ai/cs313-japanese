import React, { useState } from 'react';
import { 
  Headphones, 
  Volume2, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Lock,
  ChevronRight,
  HelpCircle,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakJapanese } from '../utils/speech';

interface JapaneseListeningViewProps {
  isVip: boolean;
  onOpenVipModal: (reason?: string) => void;
}

interface ListeningItem {
  id: string;
  section: '课题理解' | '要点理解' | '概要理解' | '即时应答';
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  title: string;
  dialogue: { speaker: string; text: string; zh: string }[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  clozeWords: string[]; // 挖空重点词
  isFreePreview: boolean;
}

const LISTENING_DATA: ListeningItem[] = [
  {
    id: 'listen-n2-01',
    section: '课题理解',
    level: 'N2',
    title: '会社での打ち合わせ（公司业务接洽）',
    dialogue: [
      { speaker: '男', text: '田中さん、明日のプレゼンの準備、どこまで進んでる？', zh: '田中，明天演示文稿的准备进行到哪里了？' },
      { speaker: '女', text: 'スライドの修正は終わりました。ただ、配布用の資料の印刷がまだなんです。', zh: '幻灯片的修改已经完成了。只是分发用的资料还没打印。' },
      { speaker: '男', text: 'そうか。じゃあ、印刷は僕がやっておくから、田中さんは会場のプロジェクターの動作確認をお願いできるかな。', zh: '这样啊。那打印的事情我来做，田中你能去确认一下会场投影仪的运作吗？' },
      { speaker: '女', text: 'わかりました。すぐ確認してきます！', zh: '明白了。我马上就去确认！' }
    ],
    question: '女の人は、このあとまず何をしますか。',
    options: [
      '1. スライドを修正する',
      '2. 配布資料を印刷する',
      '3. プロジェクターの動作を確認する',
      '4. 会議の参加者に連絡する'
    ],
    correctAnswer: 2,
    explanation: '男士提出「印刷は僕がやっておくから（打印由我来做）」并要求女士「会場のプロジェクターの動作確認をお願いできるかな」，女士回答「すぐ確認してきます」，因此女士首先要做的是确认投影仪运作（选项3）。',
    clozeWords: ['プレゼン', '配布用', 'プロジェクター', '動作確認'],
    isFreePreview: true
  },
  {
    id: 'listen-n2-02',
    section: '即时应答',
    level: 'N2',
    title: '日常敬语交际（即时应答）',
    dialogue: [
      { speaker: '上司', text: '昨日の企画書、もう目を通してくれた？', zh: '昨天的企划书，你已经看过了吗？' }
    ],
    question: '最も適当な返事はどれですか。',
    options: [
      '1. ええ、拝見いたしました。',
      '2. はい、お目にかかりました。',
      '3. いいえ、ご覧になりませんでした。',
      '4. ええ、見せていらっしゃいました。'
    ],
    correctAnswer: 0,
    explanation: '看自己阅览上司的资料属于自谦语，使用「拝見する（はいけんする）」。选项2「お目にかかる」意为“会面、拜见”，选项3和4使用了尊敬语用于自己，不合礼仪。',
    clozeWords: ['企画書', '目を通す', '拝見する'],
    isFreePreview: true
  },
  {
    id: 'listen-n1-01',
    section: '要点理解',
    level: 'N1',
    title: '大学の講義：都市環境と緑化政策',
    dialogue: [
      { speaker: '教授', text: '屋上緑化の推進において、自治体が最も重視すべきなのは、単に緑の面積を増やすことではなく、その後の維持管理コストの抑制と、地域の生態系に配慮した植生選定であります。', zh: '在推进屋顶绿化过程中，地方政府最应重视的，并非单纯扩大绿化面积，而是后续维护管理成本的控制，以及兼顾地区生态系统的植被选定。' }
    ],
    question: '教授が最も重要だと述べている点は何ですか。',
    options: [
      '1. 緑化面積の急速な拡大',
      '2. 維持管理コストの抑制と適切な植生選定',
      '3. 住民によるボランティア活動の推進',
      '4. 外来植物の積極的な導入'
    ],
    correctAnswer: 1,
    explanation: '教授明确指出「最も重視すべきなのは〜維持管理コストの抑制と、地域の生態系に配慮した植生選定であります」，直接对应选项2。',
    clozeWords: ['屋上緑化', '維持管理コスト', '生態系', '植生選定'],
    isFreePreview: false
  },
  {
    id: 'listen-n3-01',
    section: '课题理解',
    level: 'N3',
    title: '留学生のアルバイト相談',
    dialogue: [
      { speaker: '店長', text: '李さん、金曜日のシフト、急に人が足りなくなっちゃって。18時から入れないかな？', zh: '小李，周五的排班突然缺人。下午6点能来上班吗？' },
      { speaker: '李', text: '金曜日は19時まで大学の授業があるんです。19時半からなら入れますが…', zh: '周五到晚上7点都有大学的课。要是7点半开始的话我可以来…' },
      { speaker: '店長', text: 'あ、そうか！じゃあ19時半からお願いできる？助かるよ！', zh: '啊这样啊！那能从7点半开始来吗？太帮大忙了！' }
    ],
    question: '李さんは金曜日、何時から働きますか。',
    options: [
      '1. 18時',
      '2. 18時半',
      '3. 19時',
      '4. 19時半'
    ],
    correctAnswer: 3,
    explanation: '小李说明因为上课原因19点半才能到，店长同意「じゃあ19時半からお願いできる？」，因此是 19 点半开始上班（选项4）。',
    clozeWords: ['シフト', '足りない', '授業'],
    isFreePreview: true
  }
];

export const JapaneseListeningView: React.FC<JapaneseListeningViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedId, setSelectedId] = useState<string>('listen-n2-01');
  const [showScript, setShowScript] = useState<boolean>(false);
  const [showZh, setShowZh] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const currentItem = LISTENING_DATA.find(item => item.id === selectedId) || LISTENING_DATA[0];

  const handlePlayAudio = () => {
    const fullText = currentItem.dialogue.map(d => `${d.speaker}：${d.text}`).join('。') + '。' + currentItem.question;
    speakJapanese(fullText, audioSpeed);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentItem.correctAnswer) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-black flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> JLPT 听解精听研习工坊
            </span>
            <span className="text-xs text-teal-100 font-bold">
              纯正东京腔原声 · 课题理解 / 即时应答
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            JLPT 听解真题原声盲听与逐句精炼
          </h2>
          <p className="text-xs text-teal-100 font-medium">
            告别“听懂了但选不对”！支持盲听磨耳朵、日文脚本对照、挖空精听与即时应答技巧拆解。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={handlePlayAudio}
            className="px-5 py-2.5 rounded-2xl bg-white text-teal-700 font-black text-xs hover:bg-teal-50 transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>播放原声音频 ({audioSpeed}x)</span>
          </button>
        </div>
      </div>

      {/* Item Selector & Speed Pills */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Paper Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {LISTENING_DATA.map((item) => {
            const isLocked = !isVip && !item.isFreePreview;
            const isSelected = item.id === selectedId;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isLocked) {
                    onOpenVipModal(`🔒【${item.title}】为 VIP 会员专享听解原声材料！升级终身 VIP 即可畅听全部真题听解！`);
                    return;
                  }
                  setSelectedId(item.id);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
                <span>{item.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500">
                  {item.level} · {item.section}
                </span>
              </button>
            );
          })}
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-slate-400 font-bold mr-1">语速:</span>
          {[0.8, 1.0, 1.2].map((s) => (
            <button
              key={s}
              onClick={() => setAudioSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                audioSpeed === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 7 Cols: Dialogue Script / Blind Audio Player */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          
          {/* Controls row */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                {currentItem.section}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                难度: {currentItem.level}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScript(prev => !prev)}
                className="text-xs text-slate-600 hover:text-teal-600 flex items-center gap-1 font-bold cursor-pointer"
              >
                {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showScript ? '隐藏日文脚本' : '查看日文脚本'}</span>
              </button>

              {showScript && (
                <button
                  onClick={() => setShowZh(prev => !prev)}
                  className="text-xs text-slate-600 hover:text-teal-600 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>{showZh ? '隐藏中文' : '显示中文'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Dialogue Content */}
          {showScript ? (
            <div className="space-y-3">
              {currentItem.dialogue.map((line, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-teal-700">{line.speaker}：</span>
                      <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                        {line.text}
                      </p>
                    </div>
                    <button
                      onClick={() => speakJapanese(line.text, audioSpeed)}
                      className="p-1 rounded-lg text-slate-400 hover:text-teal-600 transition cursor-pointer"
                      title="单句复读"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {showZh && (
                    <p className="text-xs text-slate-500 font-medium pl-6 border-l-2 border-slate-200">
                      {line.zh}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-slate-50/70 rounded-3xl border border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                <Headphones className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">当前处于【盲听磨耳朵模式】</p>
                <p className="text-xs text-slate-400">点击右上角“查看日文脚本”即可随时显示字幕对照</p>
              </div>
              <button
                onClick={handlePlayAudio}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>播放原声 ({audioSpeed}x)</span>
              </button>
            </div>
          )}

          {/* Cloze Keywords */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>本题核心听解高频考词：</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {currentItem.clozeWords.map((w, i) => (
                <button
                  key={i}
                  onClick={() => speakJapanese(w)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-xs font-bold text-teal-800 hover:bg-teal-100 transition flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-teal-600" />
                  <span>{w}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Question & Options */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              问题 QUESTION
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
              {currentItem.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentItem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentItem.correctAnswer === idx;

              let style = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
              if (isSelected) {
                style = 'bg-teal-50 border-teal-500 text-teal-900 font-bold';
              }
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-150 flex items-center justify-between gap-2 text-xs sm:text-sm cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>听解解题思路解析：</span>
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {currentItem.explanation}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// 兼容别名以防外部导入断裂
export const TopikWritingView = JapaneseListeningView;
export const ListeningView = JapaneseListeningView;
