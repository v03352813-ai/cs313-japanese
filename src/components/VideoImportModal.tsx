import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Film, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Upload, 
  ExternalLink, 
  Layers, 
  Eye, 
  Volume2, 
  HelpCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  KDramaScene, 
  KDramaCategoryType, 
  DramaLevelTag,
  DramaDialogueLine,
  saveCustomDramaScene, 
  deleteCustomDramaScene, 
  getCustomDramaScenes,
  exportDramaScenesToJson,
  importDramaScenesFromJson
} from '../data/korean/kdrama';

interface VideoImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSceneSaved: (newSceneId?: string) => void;
}

type ModalTab = 'ai_generate' | 'video_link' | 'cloud_manage';

const QUICK_PRESETS = [
  {
    dramaTitle: '背着善宰跑',
    koreanDramaTitle: '선재 업고 튀어',
    category: '顶流心动爱情' as KDramaCategoryType,
    levelTag: '初级' as DramaLevelTag,
    genre: '奇幻穿越 / 救赎高甜',
    sceneTitle: '善宰撑伞守护小率的名场面',
    episode: '第 1 集 高甜名场面',
    posterUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    stillUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
    summary: '任率刚回到过去，在大雪中善宰为小率撑起黄伞的宿命相遇。',
    culturalInsight: '“우산(雨伞)”在韩语浪漫语境中是象征“守护与心动”的核心意象。',
    dialogues: [
      {
        id: 1,
        speaker: '류선재 (柳善宰)',
        role: '男主角',
        avatarColor: 'bg-blue-600',
        ko: '눈 오는데 왜 혼자 이러고 있어? 우산 같이 쓰자.',
        zh: '下着雪呢怎么一个人在这儿？一起撑这把伞吧。',
        roman: 'Nun oneunde wae honja ireogo isseo? Usan gachi sseuja.',
        timeSec: 1,
        durationSec: 5,
        highlightWords: [
          { word: '눈 오다', meaning: '下雪' },
          { word: '우산', meaning: '雨伞' },
          { word: '쓰다', meaning: '撑伞/使用' }
        ],
        grammarNotes: '动词 + -는데 (转折背景说明) + -자 (共动句尾：我们一起...吧)',
        clozeQuestion: {
          maskedKo: '눈 오는데 왜 혼자 이러고 있어? (      ) 같이 쓰자.',
          maskedWord: '우산',
          options: ['우산', '모자', '장갑', '가방'],
          hint: '名词：“雨伞”（우산）。'
        }
      }
    ]
  },
  {
    dramaTitle: '眼泪女王',
    koreanDramaTitle: '눈물의 여왕',
    category: '顶流心动爱情' as KDramaCategoryType,
    levelTag: '中级' as DramaLevelTag,
    genre: '财阀都市 / 破镜重圆',
    sceneTitle: '德国薰衣草花田真情告白',
    episode: '第 6 集 名场面',
    posterUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    stillUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
    summary: '白贤佑飞越重洋在薰衣草花田中向洪海仁表明真心，双向奔赴名场面。',
    culturalInsight: '韩语中 -더라도 (即使/哪怕...) 让步连接词尾表达至死不渝的决心。',
    dialogues: [
      {
        id: 1,
        speaker: '백현우 (白贤佑)',
        role: '男主角',
        avatarColor: 'bg-slate-700',
        ko: '내가 어디 안 가고 네 곁에 있을게. 그러니까 포기하지 마.',
        zh: '我哪儿也不去，就守在你身边。所以千万别放弃。',
        roman: 'Naega eodi an gago ne gyeote isseulge. Geureonikka pogihaji ma.',
        timeSec: 1,
        durationSec: 5,
        highlightWords: [
          { word: '곁', meaning: '身旁、身边' },
          { word: '포기하다', meaning: '放弃' }
        ],
        grammarNotes: '动词 + -지 마 (非敬语禁止命令：不要...)',
        clozeQuestion: {
          maskedKo: '내가 어디 안 가고 네 곁에 있을게. 그러니까 (      ) 마.',
          maskedWord: '포기하지',
          options: ['포기하지', '도망가지', '걱정하지', '울지'],
          hint: '动词“放弃”（포기하다）。'
        }
      }
    ]
  },
  {
    dramaTitle: '金秘书为何那样',
    koreanDramaTitle: '김비서가 왜 그럴까',
    category: '顶流心动爱情' as KDramaCategoryType,
    levelTag: '初级' as DramaLevelTag,
    genre: '爆笑甜宠 / 财阀职场',
    sceneTitle: '副会长直球告白：“跟我谈恋爱吧”',
    episode: '第 6 集 高甜名场面',
    posterUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    stillUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
    summary: '傲娇副会长李英俊向金微笑秘书敞开心扉直球告白的经典爆笑高甜场面。',
    culturalInsight: '霸总直球表白中极高频使用 -자 (共动句尾：我们...吧)。',
    dialogues: [
      {
        id: 1,
        speaker: '이영준 (李英俊)',
        role: '副会长',
        avatarColor: 'bg-indigo-600',
        ko: '김 비서, 나 이제 김 비서 마음 흔들 생각 없어. 나랑 연애하자.',
        zh: '金秘书，我不想再让你动摇了。从现在起，跟我谈恋爱吧。',
        roman: 'Kim biseo, na ije Kim biseo maeum heundeul saenggak eopseo. Narang yeonaehaja.',
        timeSec: 1,
        durationSec: 5,
        highlightWords: [
          { word: '흔들다', meaning: '动摇、摇晃' },
          { word: '연애하다', meaning: '谈恋爱' }
        ],
        grammarNotes: '动词 + -자 (非敬语共动句尾：我们一起...吧)',
        clozeQuestion: {
          maskedKo: '김 비서, 나랑 (      ).',
          maskedWord: '연애하자',
          options: ['연애하자', '일하자', '헤어지자', '싸우자'],
          hint: '动词“谈恋爱”（연애하다）。'
        }
      }
    ]
  }
];

export const VideoImportModal: React.FC<VideoImportModalProps> = ({
  isOpen,
  onClose,
  onSceneSaved
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('ai_generate');
  
  // Form State
  const [dramaTitle, setDramaTitle] = useState('背着善宰跑');
  const [koreanDramaTitle, setKoreanDramaTitle] = useState('선재 업고 튀어');
  const [sceneTitle, setSceneTitle] = useState('善宰撑伞守护小率的名场面');
  const [category, setCategory] = useState<KDramaCategoryType>('顶流心动爱情');
  const [levelTag, setLevelTag] = useState<DramaLevelTag>('初级');
  const [genre, setGenre] = useState('奇幻穿越 / 救赎高甜');
  const [episode, setEpisode] = useState('第 1 集 高甜名场面');
  const [videoUrl, setVideoUrl] = useState('/videos/kdrama_sample.mp4');
  const [bilibiliBvid, setBilibiliBvid] = useState('BV1wm421a71E');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop');
  const [stillUrl, setStillUrl] = useState('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop');
  const [summary, setSummary] = useState('大雪中善宰为小率撑起黄伞的宿命相遇，韩剧浪漫名场面。');
  const [culturalInsight, setCulturalInsight] = useState('“우산(雨伞)”在韩语浪漫语境中象征守护与心动的核心意象。');

  // Single Dialogue Line Form
  const [speaker, setSpeaker] = useState('류선재 (柳善宰)');
  const [role, setRole] = useState('男主角');
  const [koText, setKoText] = useState('눈 오는데 왜 혼자 이러고 있어? 우산 같이 쓰자.');
  const [zhText, setZhText] = useState('下着雪呢怎么一个人在这儿？一起撑这把伞吧。');
  const [romanText, setRomanText] = useState('Nun oneunde wae honja ireogo isseo? Usan gachi sseuja.');
  const [grammarNotes, setGrammarNotes] = useState('动词 + -는데 (背景说明) + -자 (共动句尾)');
  const [maskedWord, setMaskedWord] = useState('우산');

  // Custom scenes for management tab
  const [customScenes, setCustomScenes] = useState<KDramaScene[]>(() => getCustomDramaScenes());
  const [importJsonText, setImportJsonText] = useState('');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (p: typeof QUICK_PRESETS[0]) => {
    setDramaTitle(p.dramaTitle);
    setKoreanDramaTitle(p.koreanDramaTitle);
    setCategory(p.category);
    setLevelTag(p.levelTag);
    setGenre(p.genre);
    setSceneTitle(p.sceneTitle);
    setEpisode(p.episode);
    setPosterUrl(p.posterUrl);
    setStillUrl(p.stillUrl);
    setSummary(p.summary);
    setCulturalInsight(p.culturalInsight);

    if (p.dialogues && p.dialogues[0]) {
      const d = p.dialogues[0];
      setSpeaker(d.speaker);
      setRole(d.role);
      setKoText(d.ko);
      setZhText(d.zh);
      setRomanText(d.roman);
      setGrammarNotes(d.grammarNotes || '');
      setMaskedWord(d.clozeQuestion?.maskedWord || '');
    }
  };

  const handleSaveScene = () => {
    const newId = `custom-drama-${Date.now()}`;
    const newScene: KDramaScene = {
      id: newId,
      dramaTitle: dramaTitle.trim() || '韩剧名场面',
      koreanDramaTitle: koreanDramaTitle.trim() || '한국 드라마',
      category,
      levelTag,
      genre: genre.trim() || '经典名场面',
      difficulty: levelTag === '初级' ? '初级入门 (TOPIK 1-2)' : levelTag === '中级' ? '中级进阶 (TOPIK 3-4)' : '中高级精通 (TOPIK 5-6)',
      sceneTitle: sceneTitle.trim() || '名台词精析',
      episode: episode.trim() || '经典名场面',
      durationSeconds: 30,
      videoUrl: videoUrl.trim() || undefined,
      bilibiliBvid: bilibiliBvid.trim() || undefined,
      posterUrl: posterUrl.trim() || '/images/frame_0825.jpg',
      stillUrl: stillUrl.trim() || '/images/frame_0825.jpg',
      bgGradient: 'from-orange-950 via-slate-900 to-black',
      isFreePreview: true,
      summary: summary.trim(),
      culturalInsight: culturalInsight.trim(),
      isCustom: true,
      dialogues: [
        {
          id: 1,
          speaker: speaker.trim() || '主角',
          role: role.trim() || '主角',
          avatarColor: 'bg-orange-500',
          ko: koText.trim(),
          zh: zhText.trim(),
          roman: romanText.trim(),
          timeSec: 1,
          durationSec: 5,
          highlightWords: maskedWord ? [{ word: maskedWord, meaning: '核心词汇/考点' }] : undefined,
          grammarNotes: grammarNotes.trim() || undefined,
          clozeQuestion: maskedWord ? {
            maskedKo: koText.replace(maskedWord, '(      )'),
            maskedWord: maskedWord,
            options: [maskedWord, '친구', '사랑', '기억'],
            hint: `重点考察词汇：“${maskedWord}”`
          } : undefined
        }
      ]
    };

    saveCustomDramaScene(newScene);
    setCustomScenes(getCustomDramaScenes());

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSceneSaved(newId);
    onClose();
  };

  const handleDeleteCustom = (id: string) => {
    deleteCustomDramaScene(id);
    setCustomScenes(getCustomDramaScenes());
    onSceneSaved();
  };

  const handleExportJson = () => {
    const json = exportDramaScenesToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kdrama_scenes_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const ok = importDramaScenesFromJson(importJsonText);
    if (ok) {
      setSyncMessage('🎉 成功导入并同步场景数据库！');
      setCustomScenes(getCustomDramaScenes());
      onSceneSaved();
      setTimeout(() => setSyncMessage(null), 3000);
    } else {
      setSyncMessage('❌ JSON 格式有误，请核对后再试。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-orange-500 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>全自动视频入库与更新管理中心</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold border border-orange-200">
                  一键热更新
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                支持视频直链/B站绑定 · AI 自动对齐台词与考点 · 100% 保证原画画面流
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ai_generate')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'ai_generate'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 智能生成 / 快速入库</span>
          </button>

          <button
            onClick={() => setActiveTab('video_link')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'video_link'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>视频流媒体与画质配置</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud_manage')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'cloud_manage'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>云端库同步与备份 ({customScenes.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: AI 智能生成 */}
          {activeTab === 'ai_generate' && (
            <div className="space-y-5">
              
              {/* Quick Presets Carousel */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">
                  ⚡ 一键载入热门名场面预置模板（点击秒级填充）：
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {QUICK_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleApplyPreset(p)}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-orange-50/80 hover:border-orange-300 text-left transition flex flex-col justify-between space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 group-hover:text-orange-600">
                          《{p.dramaTitle}》
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 font-bold">
                          {p.levelTag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {p.sceneTitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drama Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">韩剧中文名</label>
                  <input
                    type="text"
                    value={dramaTitle}
                    onChange={(e) => setDramaTitle(e.target.value)}
                    placeholder="如：背着善宰跑"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">韩文原名</label>
                  <input
                    type="text"
                    value={koreanDramaTitle}
                    onChange={(e) => setKoreanDramaTitle(e.target.value)}
                    placeholder="如：선재 업고 튀어"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">名台词场景标题 (画廊主标题)</label>
                  <input
                    type="text"
                    value={sceneTitle}
                    onChange={(e) => setSceneTitle(e.target.value)}
                    placeholder="如：为什么一见到我就哭？"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">题材分类</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as KDramaCategoryType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                    >
                      <option value="顶流心动爱情">顶流心动爱情</option>
                      <option value="国民口碑神剧">国民口碑神剧</option>
                      <option value="职场与社会实用">职场与社会实用</option>
                      <option value="高能高光名场面">高能高光名场面</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">难度评级</label>
                    <select
                      value={levelTag}
                      onChange={(e) => setLevelTag(e.target.value as DramaLevelTag)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                    >
                      <option value="初级">🌱 初级 (TOPIK 1-2)</option>
                      <option value="中级">🌿 中级 (TOPIK 3-4)</option>
                      <option value="高级">🌳 高级 (TOPIK 5-6)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dialogue Parsing Form */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-950 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-orange-600" />
                    <span>名场面中韩双语台词对白：</span>
                  </span>
                  <span className="text-[11px] text-orange-700">自动同步到精读 / 跟读 / 填空 3 步闭环</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">角色名与扮演者</label>
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) => setSpeaker(e.target.value)}
                      placeholder="如：류선재 (柳善宰)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">考点挖空生词</label>
                    <input
                      type="text"
                      value={maskedWord}
                      onChange={(e) => setMaskedWord(e.target.value)}
                      placeholder="如：우산 (填空测验挖空词)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">韩文原声台词</label>
                  <textarea
                    rows={2}
                    value={koText}
                    onChange={(e) => setKoText(e.target.value)}
                    placeholder="输入韩语对白句子..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">中文精翻</label>
                  <input
                    type="text"
                    value={zhText}
                    onChange={(e) => setZhText(e.target.value)}
                    placeholder="输入准确中文翻译..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">语法解析备注</label>
                  <input
                    type="text"
                    value={grammarNotes}
                    onChange={(e) => setGrammarNotes(e.target.value)}
                    placeholder="如：动词 + -는데 (转折背景说明) + -자 (共动句尾)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 视频流媒体与画质配置 */}
          {activeTab === 'video_link' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                <strong className="block font-bold">💡 确保 100% 有画面的三大保障机制：</strong>
                <p>1. <strong>在线 MP4 / WebM 直链</strong>：填写 CDN 视频直链，直接调用原生 HTML5 极速流播放器。</p>
                <p>2. <strong>B站高清嵌入 (BV号)</strong>：填写 B 站名场面 BV 号，支持自动分秒定位与原画播放。</p>
                <p>3. <strong>动态声波画卷引擎</strong>：若未指定视频，自动调用高清剧照镜头推拉与声波跳动画卷，杜绝黑屏。</p>
              </div>

              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>本地 MP4 视频文件或网络视频直链</span>
                    <span className="text-[11px] text-orange-600">支持本地即选即播与直链</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="如：/videos/kdrama_sample.mp4 或 https://cdn.example.com/scene.mp4"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                    />
                    <label className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1.5 shrink-0 transition shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>选择本地视频</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            const blobUrl = URL.createObjectURL(file);
                            setVideoUrl(blobUrl);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bilibili 视频 BV 号 (备选画中画嵌入)</label>
                  <input
                    type="text"
                    value={bilibiliBvid}
                    onChange={(e) => setBilibiliBvid(e.target.value)}
                    placeholder="如：BV1wm421a71E"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">卡片封面海报 (Poster URL)</label>
                    <input
                      type="text"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">舞台高清剧照 (Still URL)</label>
                    <input
                      type="text"
                      value={stillUrl}
                      onChange={(e) => setStillUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Video Live Preview Box */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-black text-white space-y-2">
                <span className="font-bold text-slate-400 block text-[11px]">
                  🖥️ 实时画面流预览测试：
                </span>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={stillUrl || posterUrl}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 云端库同步与备份 */}
          {activeTab === 'cloud_manage' && (
            <div className="space-y-4">
              
              {syncMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{syncMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  当前自建与热更新场景库 (共 {customScenes.length} 条)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出备份 JSON</span>
                  </button>
                </div>
              </div>

              {customScenes.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 space-y-1">
                  <p className="font-bold">暂无自建剧集，默认加载官方精选库（22+ 名场面）</p>
                  <p className="text-[11px]">可在第一页填写剧目信息后点击“一键入库并上线”快速添加！</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {customScenes.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <strong className="text-slate-800 truncate">《{s.dramaTitle}》</strong>
                        <span className="text-slate-500 truncate">- {s.sceneTitle}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 font-bold">
                          {s.levelTag || '初级'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteCustom(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="删除该条"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* JSON Paste Area */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-bold text-slate-700 block">
                  📥 从云端批量导入/同步 JSON 数据：
                </label>
                <textarea
                  rows={3}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="在此粘贴导出的 JSON 字符串并点击导入..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleImportJson}
                    className="px-4 py-1.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>执行导入同步</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>自动持久化到本地/云端 · 刷新即刻生效</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
            >
              取消
            </button>
            <button
              onClick={handleSaveScene}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>一键入库并上线发布</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
