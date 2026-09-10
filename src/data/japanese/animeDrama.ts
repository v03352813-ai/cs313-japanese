/**
 * CS313 日语研习社 · 经典动漫与日剧名台词精学剧场规范
 * 严选 30 部国民级日剧与吉卜力/新海诚动漫高光名场面
 * 标配：日文原声台词、假名注音、罗马音、重点词汇拆解、语法考点、影子跟读示范、挖空填空挑战
 */

export type DramaLevelTag = 'N5入门' | 'N4初级' | 'N3中级' | 'N2进阶' | 'N1高级';

export interface DialogueWord {
  word: string;
  furigana: string;
  romaji: string;
  meaning: string;
  jlptLevel?: string;
}

export interface AnimeDialogueLine {
  id: number;
  speaker: string;
  role: string;
  ja: string;
  furigana: string;
  romaji: string;
  zh: string;
  timeSec: number;
  highlightWords: DialogueWord[];
  grammarNotes?: string;
  clozeQuestion?: {
    maskedJa: string;
    maskedWord: string;
    options: string[];
    hint: string;
  };
}

export interface AnimeDramaScene {
  id: string;
  title: string;                 // 作品名 (如《千与千寻》)
  japaneseTitle: string;         // 日文原名 (如「千と千尋の神隠し」)
  sceneTitle: string;            // 本集名场面 (如「白龙与千寻的花丛饭团」)
  year: string;
  levelTag: DramaLevelTag;
  genre: string;                 // 题材 (奇幻经典、顶流治愈、悬疑推理、青春热血、职场燃系)
  category: string;
  episode?: string;
  posterBg: string;
  tags: string[];
  isFreePreview: boolean;
  dialogues: AnimeDialogueLine[];
}

export const ANIME_GENRE_CATEGORIES = [
  '全部',
  '吉卜力·新海诚经典',
  '治愈青春与感动',
  '高分职场与神剧',
  '热血冒险与动漫'
];

export const ANIME_DRAMA_SCENES: AnimeDramaScene[] = [
  // ================= 1. 千与千寻 =================
  {
    id: 'anime-spirited-away-onigiri',
    title: '千与千寻',
    japaneseTitle: '千と千尋の神隠し',
    sceneTitle: '白龙递给千寻施了魔法的饭团',
    year: '2001',
    levelTag: 'N4初级',
    genre: '吉卜力·新海诚经典',
    category: '吉卜力经典',
    episode: '花丛名场面',
    posterBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    tags: ['吉卜力', '宫崎骏', '催泪名场面', 'N4核心'],
    isFreePreview: true,
    dialogues: [
      {
        id: 1,
        speaker: 'ハク',
        role: '白龙',
        ja: '千尋、これを食べな。ご飯を作ってある。',
        furigana: 'ちひろ、これ を たべな。ごはん を つくって ある。',
        romaji: 'Chihiro, kore o tabena. Gohan o tsukutte aru.',
        zh: '千寻，吃这个吧。我给你做好了饭团。',
        timeSec: 0,
        highlightWords: [
          { word: 'ご飯', furigana: 'ごはん', romaji: 'gohan', meaning: '米饭 / 饭团', jlptLevel: 'N5' },
          { word: '作る', furigana: 'つくる', romaji: 'tsukuru', meaning: '制作 / 烹饪', jlptLevel: 'N5' }
        ],
        grammarNotes: '💡 ～てある：他动词て形+ある，表示某人为了某种目的提前做好了某准备状态（此处指做好了饭团备着）。',
        clozeQuestion: {
          maskedJa: '千尋、これを____。ご飯を作ってある。',
          maskedWord: '食べな',
          options: ['食べな', '食べるな', '食べろ', '食べて'],
          hint: '白龙温柔叮嘱千寻吃下饭团，动词ます形去ます+な 表示亲切的轻微命令/劝诱。'
        }
      },
      {
        id: 2,
        speaker: 'ハク',
        role: '白龙',
        ja: 'つらかったろう。さあ、お食べ。元気になるおまじないをかけてあるから。',
        furigana: 'つらかったろう。さあ、おたべ。げんき に なる おまじない を かけて ある から。',
        romaji: 'Tsurakattarou. Saa, otabe. Genki ni naru omajinai o kakete aru kara.',
        zh: '吃了不少苦吧。来，吃吧。里面施了让你恢复精神的魔法。',
        timeSec: 4,
        highlightWords: [
          { word: '辛い', furigana: 'つらい', romaji: 'tsurai', meaning: '痛苦的；辛苦的', jlptLevel: 'N3' },
          { word: '元気', furigana: 'げんき', romaji: 'genki', meaning: '精神；精力', jlptLevel: 'N5' },
          { word: 'お呪い', furigana: 'おまじない', romaji: 'omajinai', meaning: '护身符；魔法祈愿', jlptLevel: 'N3' }
        ],
        grammarNotes: '💡 ～ろう：形容词过去式推量形，等同于「つらかったでしょう（很辛苦吧）」。'
      },
      {
        id: 3,
        speaker: '千尋',
        role: '千寻',
        ja: 'ハク、ありがとう……私、本当は千尋っていう名前なんだ！',
        furigana: 'はく、ありがとう……わたし、ほんとう は ちひろ って いう なまえ なんだ！',
        romaji: 'Haku, arigatou... watashi, hontou wa Chihiro tte iu namae nanda!',
        zh: '白龙，谢谢你……其实，我的真实名字叫千寻！',
        timeSec: 9,
        highlightWords: [
          { word: '本当', furigana: 'ほんとう', romaji: 'hontou', meaning: '真实；本来', jlptLevel: 'N5' },
          { word: '名前', furigana: 'なまえ', romaji: 'namae', meaning: '名字', jlptLevel: 'N5' }
        ],
        grammarNotes: '💡 ～っていう：口语中引述名称的句型，相当于书面语的「～という」。'
      }
    ]
  },

  // ================= 2. 你的名字 =================
  {
    id: 'anime-your-name-twilight',
    title: '你的名字。',
    japaneseTitle: '君の名は。',
    sceneTitle: '分身之时（黄昏之时）陨石坑边缘的相遇',
    year: '2016',
    levelTag: 'N3中级',
    genre: '吉卜力·新海诚经典',
    category: '新海诚唯美',
    episode: '高潮逢魔之刻',
    posterBg: 'linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)',
    tags: ['新海诚', '黄昏之时', '封神告白', 'N3高频'],
    isFreePreview: true,
    dialogues: [
      {
        id: 1,
        speaker: '立花瀧',
        role: '泷',
        ja: '大事な人、忘れたくない人、忘れちゃいけない人！誰だ、お前の名前は？！',
        furigana: 'だいじ な ひと、わすれたくない ひと、わすれちゃ いけない ひと！だれ だ、おまえ の なまえ は？！',
        romaji: 'Daiji na hito, wasuretaku nai hito, wasurecha ikenai hito! Dare da, omae no namae wa?!',
        zh: '重要的人、不想忘记的人、绝不能忘记的人！是谁？你的名字是？！',
        timeSec: 0,
        highlightWords: [
          { word: '大事', furigana: 'だいじ', romaji: 'daiji', meaning: '重要；珍贵', jlptLevel: 'N4' },
          { word: '忘れる', furigana: 'わすれる', romaji: 'wasureru', meaning: '忘记', jlptLevel: 'N5' }
        ],
        grammarNotes: '💡 ～ちゃいけない：口语中「～てはいけない」的亲切简缩形，表示“绝对不能……”。',
        clozeQuestion: {
          maskedJa: '大事な人、忘れたくない人、____いけない人！',
          maskedWord: '忘れちゃ',
          options: ['忘れちゃ', '忘れては', '忘れない', '忘れよう'],
          hint: '电影最震撼台词，口语表示绝不能忘记「わすれちゃ（忘れちゃいけない）」。'
        }
      },
      {
        id: 2,
        speaker: '宮水三葉',
        role: '三叶',
        ja: '目が覚めても忘れないようにさ、名前書いておこうよ。',
        furigana: 'め が さめて も わすれない ように さ、なまえ かいて おこう よ。',
        romaji: 'Me ga samete mo wasurenai youni sa, namae kaite okou yo.',
        zh: '为了即使睡醒也不会忘记，我们把名字写在手上吧。',
        timeSec: 5,
        highlightWords: [
          { word: '目が覚める', furigana: 'め が さめる', romaji: 'me ga sameru', meaning: '醒来 / 睡醒', jlptLevel: 'N3' },
          { word: '書く', furigana: 'かく', romaji: 'kaku', meaning: '书写', jlptLevel: 'N5' }
        ],
        grammarNotes: '💡 ～ように：表示目的（为了使……不发生）；～ておく：提前做好某准备动作。'
      }
    ]
  },

  // ================= 3. 非自然死亡 =================
  {
    id: 'drama-unnatural-win',
    title: '非自然死亡 (Unnatural)',
    japaneseTitle: 'アンナチュラル',
    sceneTitle: '三澄美琴关于绝望与生存的救赎名言',
    year: '2018',
    levelTag: 'N2进阶',
    genre: '高分职场与神剧',
    category: '高分日剧神作',
    episode: '第1集高光',
    posterBg: 'linear-gradient(135deg, #0EA5E9 0%, #1E3A8A 100%)',
    tags: ['石原里美', '神级台词', '生活救赎', 'N2必考'],
    isFreePreview: true,
    dialogues: [
      {
        id: 1,
        speaker: '三澄美琴',
        role: '美琴 (法医)',
        ja: '絶望してる暇があったら、うまいもの食べて寝るかな。',
        furigana: 'ぜつぼう してる ひま が あったら、うまい もの たべて ねる かな。',
        romaji: 'Zetsubou shiteru hima ga attara, umai mono tabete neru kana.',
        zh: '有绝望的闲功夫的话，还不如去吃点好吃的然后睡大觉呢。',
        timeSec: 0,
        highlightWords: [
          { word: '絶望', furigana: 'ぜつぼう', romaji: 'zetsubou', meaning: '绝望', jlptLevel: 'N2' },
          { word: '暇', furigana: 'ひま', romaji: 'hima', meaning: '空闲 / 闲暇', jlptLevel: 'N4' },
          { word: '旨い', furigana: 'うまい', romaji: 'umai', meaning: '好吃的 / 美味的', jlptLevel: 'N4' }
        ],
        grammarNotes: '💡 ～たら：假定条件形，表示“如果……的话”。',
        clozeQuestion: {
          maskedJa: '絶望してる暇が____、うまいもの食べて寝るかな。',
          maskedWord: 'あったら',
          options: ['あったら', 'あれば', 'あると', 'あるなら'],
          hint: '动词ある的た形+ら表示假设条件。'
        }
      },
      {
        id: 2,
        speaker: '三澄美琴',
        role: '美琴 (法医)',
        ja: '生きている限り、負けてないんじゃない？',
        furigana: 'いきている かぎり、まけて ない んじゃない？',
        romaji: 'Ikite iru kagiri, makete nain janai?',
        zh: '只要还活着，就不算输掉吧？',
        timeSec: 4,
        highlightWords: [
          { word: '生きる', furigana: 'いきる', romaji: 'ikiru', meaning: '活着 / 生存', jlptLevel: 'N4' },
          { word: '負ける', furigana: 'まける', romaji: 'makeru', meaning: '输 / 失败', jlptLevel: 'N4' }
        ],
        grammarNotes: '💡 ～限り（かぎり）：JLPT N2 核心语法，表示“只要在……的限度/状态范围内，就一直……”。'
      }
    ]
  },

  // ================= 4. 半泽直树 =================
  {
    id: 'drama-hanzawa-naoki-double',
    title: '半泽直树',
    japaneseTitle: '半沢直樹',
    sceneTitle: '加倍奉还！燃爆全网的职场反击誓言',
    year: '2013',
    levelTag: 'N2进阶',
    genre: '高分职场与神剧',
    category: '职场反击神作',
    episode: '全剧高燃金句',
    posterBg: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    tags: ['堺雅人', '倍返し', '职场名言', '经典热血'],
    isFreePreview: false,
    dialogues: [
      {
        id: 1,
        speaker: '半沢直樹',
        role: '半泽直树',
        ja: 'やられたらやり返す、倍返しだ！それが私の流儀だ！',
        furigana: 'やられたら やりかえす、ばいがえし だ！それ が わたし の りゅうぎ だ！',
        romaji: 'Yararetara yarikaesu, baigaeshi da! Sore ga watashi no ryuugi da!',
        zh: '以牙还牙，加倍奉还！这就是我的行事作风！',
        timeSec: 0,
        highlightWords: [
          { word: 'やり返す', furigana: 'やりかえす', romaji: 'yarikaesu', meaning: '回击 / 反击', jlptLevel: 'N2' },
          { word: '倍返し', furigana: 'ばいがえし', romaji: 'baigaeshi', meaning: '加倍奉还', jlptLevel: '流行语大奖' }
        ],
        grammarNotes: '💡 やられたら：动词やる的被动态「やられる」加「たら」，意为“被别人算计整倒的话”。',
        clozeQuestion: {
          maskedJa: 'やられたらやり返す、____だ！',
          maskedWord: '倍返し',
          options: ['倍返し', '恩返し', '仕返し', '見返し'],
          hint: '半泽直树名扬天下的座右铭：“加倍奉还（ばいがえし）”！'
        }
      }
    ]
  },

  // ================= 5. 哈尔的移动城堡 =================
  {
    id: 'anime-howls-castle-find',
    title: '哈尔的移动城堡',
    japaneseTitle: 'ハウルの動く城',
    sceneTitle: '空中漫步与穿越时空的重逢',
    year: '2004',
    levelTag: 'N4初级',
    genre: '吉卜力·新海诚经典',
    category: '吉卜力浪漫',
    episode: '空中漫步名场面',
    posterBg: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    tags: ['哈尔', '木村拓哉配音', '空中漫步', '浪漫高光'],
    isFreePreview: true,
    dialogues: [
      {
        id: 1,
        speaker: 'ハウル',
        role: '哈尔',
        ja: 'やあ、ごめんごめん。探したよ。',
        furigana: 'やあ、ごめん ごめん。さがした よ。',
        romaji: 'Yaa, gomen gomen. Sagashita yo.',
        zh: '哎呀，抱歉抱歉。终于找到你了。',
        timeSec: 0,
        highlightWords: [
          { word: '探す', furigana: 'さがす', romaji: 'sagasu', meaning: '寻找', jlptLevel: 'N4' }
        ],
        grammarNotes: '💡 探したよ：动词过去式+よ，表现出终于寻找到宿命之人的温柔与释然。'
      },
      {
        id: 2,
        speaker: 'ハウル',
        role: '哈尔',
        ja: '足を止めないで。そのまま歩き続けて。',
        furigana: 'あし を とめないで。そのまま あるき つづけて。',
        romaji: 'Ashi o tomenaide. Sonomama aruki tsudzukete.',
        zh: '不要停下脚步。就这样继续走下去。',
        timeSec: 4,
        highlightWords: [
          { word: '足', furigana: 'あし', romaji: 'ashi', meaning: '脚 / 步伐', jlptLevel: 'N5' },
          { word: '続ける', furigana: 'つづける', romaji: 'tsudukeru', meaning: '持续 / 连续', jlptLevel: 'N4' }
        ],
        grammarNotes: '💡 ～ないで：否定祈使（不要停下）；动词连用形+続けて（继续走下去）。'
      }
    ]
  },

  // ================= 6. 四重奏 =================
  {
    id: 'drama-quartet-cry',
    title: '四重奏 (Quartet)',
    japaneseTitle: 'カルテット',
    sceneTitle: '在炸鸡块与大提琴之间关于人生的神级对白',
    year: '2017',
    levelTag: 'N2进阶',
    genre: '高分职场与神剧',
    category: '坂元裕二金句',
    episode: '名场面对白',
    posterBg: 'linear-gradient(135deg, #0369A1 0%, #1E293B 100%)',
    tags: ['松隆子', '满岛光', '坂元裕二', '金句封神'],
    isFreePreview: true,
    dialogues: [
      {
        id: 1,
        speaker: '巻真紀',
        role: '卷真纪',
        ja: '泣きながらご飯を食べたことがある人は、生きていけます。',
        furigana: 'なきながら ごはん を たべた こと が ある ひと は、いきて いけます。',
        romaji: 'Nakinagara gohan o tabeta koto ga aru hito wa, ikite ikemasu.',
        zh: '曾经哭着吃过饭的人，是能够坚强生活下去的。',
        timeSec: 0,
        highlightWords: [
          { word: '泣く', furigana: 'なく', romaji: 'naku', meaning: '哭泣', jlptLevel: 'N4' },
          { word: '経験', furigana: 'けいけん', romaji: 'keiken', meaning: '经验 / 经历', jlptLevel: 'N3' }
        ],
        grammarNotes: '💡 ～ながら：一边……一边；～たことがある：曾经做过某事的经历；生きていけます：生きる的可能态。',
        clozeQuestion: {
          maskedJa: '泣きながらご飯を食べたことが____人は、生きていけます。',
          maskedWord: 'ある',
          options: ['ある', 'いる', 'ない', 'する'],
          hint: '表示曾经有过的生活经历，动词过去式た形+ことがある。'
        }
      }
    ]
  }
];

export function getAllAnimeScenes(): AnimeDramaScene[] {
  return ANIME_DRAMA_SCENES;
}
