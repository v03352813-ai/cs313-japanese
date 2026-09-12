/**
 * 日本语教育学·音声学专攻 教研数据库
 * 1. 片假名多胞胎混淆诊疗室 (Confusing Katakana Pairs)
 * 2. 特殊音拍 (Mora) 与高低音调核 (Pitch Accent) 数据库
 * 3. 黄金助词大辨析 (は vs が, に vs で)
 */

export interface KatakanaTwinItem {
  kana: string;
  romaji: string;
  hiragana: string;
  origin: string; // 汉字字源
  directionRule: string; // 起笔与走向口诀
  strokeCount: number;
  mnemonic: string; // 速记口诀
  words: {
    word: string;
    kanaText: string;
    meaning: string;
    romaji: string;
  }[];
}

export interface KatakanaTwinGroup {
  id: string;
  title: string;
  subtitle: string;
  coreDifference: string;
  items: KatakanaTwinItem[];
}

export const KATAKANA_TWIN_GROUPS: KatakanaTwinGroup[] = [
  {
    id: 'shi-vs-tsu',
    title: '死敌第 1 组：シ (shi) vs ツ (tsu)',
    subtitle: '全国日语自学者的第一噩梦',
    coreDifference: 'シ是近乎竖直平行的两点+【从下往上提】；ツ是横向并列的两点+【从上往下顺撇】！',
    items: [
      {
        kana: 'シ',
        romaji: 'shi',
        hiragana: 'し',
        origin: '源自汉字「之」的草书水旁（三点水）',
        directionRule: '两点几乎垂直上下排列，第三笔从左下往右上【用力挑起/提笔】↗',
        strokeCount: 3,
        mnemonic: '姑娘抬头看星星（视线朝上），仰头一笑【シ (shi)】！',
        words: [
          { word: 'シャツ', kanaText: 'シャツ', meaning: '衬衫 (shirt)', romaji: 'shatsu' },
          { word: 'タクシー', kanaText: 'タクシー', meaning: '出租车 (taxi)', romaji: 'takushii' },
          { word: 'システム', kanaText: 'システム', meaning: '系统 (system)', romaji: 'shisutemu' }
        ]
      },
      {
        kana: 'ツ',
        romaji: 'tsu',
        hiragana: 'つ',
        origin: '源自汉字「川」的草书',
        directionRule: '两点横向并列左右排开，第三笔从右上往左下【顺势撇下】↙',
        strokeCount: 3,
        mnemonic: '川水顺流往下淌，水滴飞溅往下跌【ツ (tsu)】！',
        words: [
          { word: 'ツアー', kanaText: 'ツアー', meaning: '旅游观光 (tour)', romaji: 'tsuaa' },
          { word: 'スーツ', kanaText: 'スーツ', meaning: '西装套装 (suit)', romaji: 'suutsu' },
          { word: 'ブーツ', kanaText: 'ブーツ', meaning: '靴子 (boots)', romaji: 'buutsu' }
        ]
      }
    ]
  },
  {
    id: 'so-vs-n',
    title: '死敌第 2 组：ソ (so) vs ン (n)',
    subtitle: '外来语菜单最易认错的孪生兄弟',
    coreDifference: 'ソ是单点在左上+【从上往下斜撇】；ン是单点在左侧+【从下往上挑笔】！',
    items: [
      {
        kana: 'ソ',
        romaji: 'so',
        hiragana: 'そ',
        origin: '源自汉字「曾」的前两笔（八字头）',
        directionRule: '第一点横卧在左上，第二笔从右上往左下【自上而下撇出】↙',
        strokeCount: 2,
        mnemonic: '曾祖父倒立扫地（扫帚向下扫），【ソ (so)】向下一撇！',
        words: [
          { word: 'ソフト', kanaText: 'ソフト', meaning: '软件 / 冰淇淋 (soft)', romaji: 'sofuto' },
          { word: 'ソース', kanaText: 'ソース', meaning: '酱汁 (sauce)', romaji: 'soosu' },
          { word: 'ソファー', kanaText: 'ソファー', meaning: '沙发 (sofa)', romaji: 'sofaa' }
        ]
      },
      {
        kana: 'ン',
        romaji: 'n',
        hiragana: 'ん',
        origin: '源自汉字「尔」的草书起笔',
        directionRule: '第一点竖立在左边，第二笔从左下往右上【自下而上提笔】↗',
        strokeCount: 2,
        mnemonic: '小人点头答应“嗯嗯嗯”，下巴一翘往上扬【ン (n)】！',
        words: [
          { word: 'パン', kanaText: 'パン', meaning: '面包 (pain/pan)', romaji: 'pan' },
          { word: 'マンション', kanaText: 'マンション', meaning: '高级公寓 (mansion)', romaji: 'manshon' },
          { word: 'レッスン', kanaText: 'レッスン', meaning: '课程 (lesson)', romaji: 'ressun' }
        ]
      }
    ]
  },
  {
    id: 'u-wa-ku',
    title: '死敌第 3 组：ウ (u) vs ワ (wa) vs ク (ku)',
    subtitle: '宝盖头三兄弟的精细切分',
    coreDifference: 'ウ头顶必须有【小冲天辫一点】；ワ头顶光溜溜；ク左边是斜长撇！',
    items: [
      {
        kana: 'ウ',
        romaji: 'u',
        hiragana: 'う',
        origin: '源自汉字「宇」的宝盖头',
        directionRule: '先在正中央点一竖点，再写横折钩，头顶必有点！',
        strokeCount: 3,
        mnemonic: '宇宙飞船头顶带有天线【ウ (u)】！',
        words: [
          { word: 'ウイスキー', kanaText: 'ウイスキー', meaning: '威士忌 (whisky)', romaji: 'uisukii' },
          { word: 'ウェブ', kanaText: 'ウェブ', meaning: '万维网 (web)', romaji: 'webu' }
        ]
      },
      {
        kana: 'ワ',
        romaji: 'wa',
        hiragana: 'わ',
        origin: '源自汉字「和」的草书右侧',
        directionRule: '左侧短竖，紧接横折弯钩，头顶平整绝无点！',
        strokeCount: 2,
        mnemonic: '哇(wa)的一声脱下帽子，光头无点【ワ (wa)】！',
        words: [
          { word: 'ワイン', kanaText: 'ワイン', meaning: '红酒 (wine)', romaji: 'wain' },
          { word: 'ワイシャツ', kanaText: 'ワイシャツ', meaning: '白衬衫 (Y-shirt)', romaji: 'waishatsu' }
        ]
      },
      {
        kana: 'ク',
        romaji: 'ku',
        hiragana: 'く',
        origin: '源自汉字「久」的前两笔',
        directionRule: '第一笔是左上方短撇，第二笔横折撇，无宝盖头！',
        strokeCount: 2,
        mnemonic: '肚子饿得咕咕叫(ku)，弯腰折叠成【ク (ku)】！',
        words: [
          { word: 'クラス', kanaText: 'クラス', meaning: '班级 (class)', romaji: 'kurasu' },
          { word: 'クリーム', kanaText: 'クリーム', meaning: '奶油 (cream)', romaji: 'kuriimu' }
        ]
      }
    ]
  },
  {
    id: 'nu-vs-su',
    title: '死敌第 4 组：ヌ (nu) vs ス (su)',
    subtitle: '叉叉腿与收腰角的微距对决',
    coreDifference: 'ヌ右下方【有交叉出头短捺】；ス右下方【折角向左撇出，绝不出头】！',
    items: [
      {
        kana: 'ヌ',
        romaji: 'nu',
        hiragana: 'ぬ',
        origin: '源自汉字「奴」的右半边「又」',
        directionRule: '横撇之后，右侧斜捺穿过中腰交叉而出，酷似「又」！',
        strokeCount: 2,
        mnemonic: '女奴隶双腿交叉站立，右腿伸出一条小尾巴【ヌ (nu)】！',
        words: [
          { word: 'カヌー', kanaText: 'カヌー', meaning: '皮划艇 (canoe)', romaji: 'kanuu' },
          { word: 'ヌードル', kanaText: 'ヌードル', meaning: '面条 (noodle)', romaji: 'nuudoru' }
        ]
      },
      {
        kana: 'ス',
        romaji: 'su',
        hiragana: 'す',
        origin: '源自汉字「须」的三撇',
        directionRule: '横折之后，第二笔从中腰向左下方撇出，末端利落收刀！',
        strokeCount: 2,
        mnemonic: '滑雪板(ski)顺坡滑下，清爽干净无拖尾【ス (su)】！',
        words: [
          { word: 'スポーツ', kanaText: 'スポーツ', meaning: '体育运动 (sports)', romaji: 'supootsu' },
          { word: 'ストレス', kanaText: 'ストレス', meaning: '压力 (stress)', romaji: 'sutoresu' }
        ]
      }
    ]
  }
];

export interface SpecialMoraItem {
  id: string;
  name: string;
  symbol: string;
  concept: string;
  goldenRule: string;
  rhythmBeat: string; // 节拍感
  contrastPairs: {
    wrongOrBase: string;
    wrongBeats: number;
    wrongMeaning: string;
    correctOrTarget: string;
    correctBeats: number;
    correctMeaning: string;
    audioTarget: string;
    explanation: string;
  }[];
}

export const SPECIAL_MORA_DATA: SpecialMoraItem[] = [
  {
    id: 'sokuon',
    name: '促音 (Sokuon)',
    symbol: 'っ / ッ',
    concept: '肌肉刹车·静止一整拍的艺术',
    goldenRule: '小「っ」本身不发声！发音器官提前就位，声带闭合强行截断气流，足足憋满一整拍！',
    rhythmBeat: '● (音) - ⏸ (刹车一拍) - ● (音)',
    contrastPairs: [
      {
        wrongOrBase: 'きて (kite)',
        wrongBeats: 2,
        wrongMeaning: '来 (2拍)',
        correctOrTarget: 'きって (kitte)',
        correctBeats: 3,
        correctMeaning: '邮票 (3拍: ki - t - te)',
        audioTarget: 'きって',
        explanation: '中途没有停顿就是普通的“来”；停顿一拍就是“邮票”！'
      },
      {
        wrongOrBase: 'さか (saka)',
        wrongBeats: 2,
        wrongMeaning: '斜坡 (2拍)',
        correctOrTarget: 'さっか (sakka)',
        correctBeats: 3,
        correctMeaning: '作家 (3拍: sa - k - ka)',
        audioTarget: 'さっか',
        explanation: '舌根卡死在软腭处憋满一拍后再爆破ka，才是作家！'
      }
    ]
  },
  {
    id: 'chouon',
    name: '长音 (Chouon)',
    symbol: 'ー / 伸ばす音',
    concept: '饱满拉长·足足发满两拍',
    goldenRule: '长音绝对不是声音升高或重读，而是【音调保持平稳，时间足足拖长一倍】！',
    rhythmBeat: '● (原音) ➔ 〰️ (拖满等长一拍)',
    contrastPairs: [
      {
        wrongOrBase: 'おばさん (obasan)',
        wrongBeats: 4,
        wrongMeaning: '阿姨 / 大妈 (4拍)',
        correctOrTarget: 'おばあさん (obaasan)',
        correctBeats: 5,
        correctMeaning: '老奶奶 (5拍: o-ba-a-sa-n)',
        audioTarget: 'おばあさん',
        explanation: '对年轻女性叫obaasan会被狠狠瞪眼！多拖一拍差了一辈！'
      },
      {
        wrongOrBase: 'ゆき (yuki)',
        wrongBeats: 2,
        wrongMeaning: '白雪 (2拍)',
        correctOrTarget: 'ゆうき (yuuki)',
        correctBeats: 3,
        correctMeaning: '勇气 (3拍: yu-u-ki)',
        audioTarget: 'ゆうき',
        explanation: 'u音拉长一拍，从冰冷的白雪跃迁为内心的勇气！'
      }
    ]
  },
  {
    id: 'hatsuon',
    name: '拨音 (Hatsuon)',
    symbol: 'ん / ン',
    concept: '口腔环境音变·3种自然同化发音',
    goldenRule: '很多中国学员以为「ん」就是中文后鼻音eng，大错特错！它会随着后面紧接的辅音，在口腔自然同化为 [m]、[n] 或 [ŋ]！',
    rhythmBeat: '自成一整拍·鼻咽腔共鸣',
    contrastPairs: [
      {
        wrongOrBase: '[m] 双唇闭合',
        wrongBeats: 1,
        wrongMeaning: '在 m / b / p 前',
        correctOrTarget: '散歩 (さんぽ / sampo)',
        correctBeats: 3,
        correctMeaning: '散步 (双唇自然紧闭)',
        audioTarget: 'さんぽ',
        explanation: '因为随后的【ぽ (po)】是双唇音，舌头和嘴唇顺理成章提前闭紧！'
      },
      {
        wrongOrBase: '[n] 舌尖抵上齿龈',
        wrongBeats: 1,
        wrongMeaning: '在 t / d / n 前',
        correctOrTarget: '反対 (はんたい / hantai)',
        correctBeats: 4,
        correctMeaning: '反对 (舌尖贴紧上牙龈)',
        audioTarget: 'はんたい',
        explanation: '因为随后的【た (ta)】是齿龈音，舌尖提前抵住上齿龈阻绝气流！'
      },
      {
        wrongOrBase: '[ŋ] 舌根抵软腭 (后鼻音)',
        wrongBeats: 1,
        wrongMeaning: '在 k / g 前或词尾',
        correctOrTarget: '天気 (てんき / teŋki)',
        correctBeats: 3,
        correctMeaning: '天气 (舌根自然贴上颚)',
        audioTarget: 'てんき',
        explanation: '随后的【き (ki)】在软腭发音，后鼻腔共鸣后顺势吐出ki！'
      }
    ]
  }
];

export interface PitchAccentItem {
  id: string;
  typePattern: '⓪型 (平板型)' | '①型 (头高型)' | '②型 (尾高/中高型)' | '③型 (中高型)';
  patternDesc: string;
  contour: string; // 高低音阶示意图: "低 ➔ 高-高-高..."
  ruleSummary: string;
  examples: {
    word: string;
    kana: string;
    meaning: string;
    audio: string;
    particlePitch: string; // 接助词时音高变化
  }[];
}

export const PITCH_ACCENT_DATA: PitchAccentItem[] = [
  {
    id: 'pitch-0',
    typePattern: '⓪型 (平板型)',
    patternDesc: '第一拍低，第二拍起高，并一直保持高音连贯流入后续助词',
    contour: '低 ➔ 高-高-高 (助词继续保持高)',
    ruleSummary: '现代日语中占比超过 50% 的核心调型，听感如平静湖面',
    examples: [
      { word: '桜 (さくら)', kana: 'さくら', meaning: '樱花', audio: 'さくら', particlePitch: 'さくらが [低-高-高-高]' },
      { word: '飴 (あめ)', kana: 'あめ', meaning: '糖果', audio: 'あめ', particlePitch: 'あめが [低-高-高]' },
      { word: '水 (みず)', kana: 'みず', meaning: '清水 / 水', audio: 'みず', particlePitch: 'みずが [低-高-高]' }
    ]
  },
  {
    id: 'pitch-1',
    typePattern: '①型 (头高型)',
    patternDesc: '第一拍极高，第二拍起骤然下坠至低音，后续助词皆低',
    contour: '高 ➔ 低-低-低 (断崖式下跌)',
    ruleSummary: '声调核在第 1 拍，如击鼓先重后轻',
    examples: [
      { word: '雨 (あめ)', kana: 'あめ', meaning: '雨水 (与糖果飴完全相反!)', audio: 'あめ', particlePitch: 'あめが [高-低-低]' },
      { word: '箸 (はし)', kana: 'はし', meaning: '筷子', audio: 'はし', particlePitch: 'はしが [高-低-低]' },
      { word: '本 (ほん)', kana: 'ほん', meaning: '书籍', audio: 'ほん', particlePitch: 'ほんが [高-低-低]' }
    ]
  },
  {
    id: 'pitch-2',
    typePattern: '②型 (尾高/中高型)',
    patternDesc: '第一拍低，第二拍高，第三拍起下坠（两音节词在助词处下坠）',
    contour: '低 ➔ 高 ➔ 低',
    ruleSummary: '声调核在第 2 拍，两拍词单独读像0型，但接助词立刻暴露下坠！',
    examples: [
      { word: '橋 (はし)', kana: 'はし', meaning: '桥梁', audio: 'はし', particlePitch: 'はしが [低-高-低] (助词低)' },
      { word: '猫 (ねこ)', kana: 'ねこ', meaning: '猫咪', audio: 'ねこ', particlePitch: 'ねこが [低-高-低]' },
      { word: '海 (うみ)', kana: 'うみ', meaning: '大海', audio: 'うみ', particlePitch: 'うみが [低-高-低]' }
    ]
  }
];

export interface ParticleContrastItem {
  id: string;
  title: string;
  pairName: string;
  conceptMnemonic: string;
  leftItem: {
    particle: string;
    role: string;
    focusMetaphor: string;
    formula: string;
    exampleJa: string;
    exampleZh: string;
    why: string;
  };
  rightItem: {
    particle: string;
    role: string;
    focusMetaphor: string;
    formula: string;
    exampleJa: string;
    exampleZh: string;
    why: string;
  };
  classicShowdown: {
    title: string;
    explanation: string;
    sentence1: string;
    sentence1Meaning: string;
    sentence2: string;
    sentence2Meaning: string;
  };
}

export const GOLDEN_PARTICLE_CONTRASTS: ParticleContrastItem[] = [
  {
    id: 'wa-vs-ga',
    title: '世纪终极对决：は (wa) vs が (ga)',
    pairName: 'は (主题大舞台) vs が (主格聚光灯)',
    conceptMnemonic: 'は字掌管整台戏，重在后面新情报；が字强打聚光灯，重在前面锁定谁！',
    leftItem: {
      particle: 'は',
      role: '提示话题 (Topic)',
      focusMetaphor: '🎪 大舞台幕布拉开：至于……',
      formula: '已知信息 は 【核心未知情报】',
      exampleJa: '私は 田中裕子です。',
      exampleZh: '我是 田中裕子。',
      why: '“我”是已知的主题，说话人真正想传达的重点在后半句“我是田中裕子”。'
    },
    rightItem: {
      particle: 'が',
      role: '主格焦点 (Subject Focus)',
      focusMetaphor: '🔦 聚光灯突然照下：正是……！',
      formula: '【排他焦点】 が 动作/状态',
      exampleJa: '私が 田中裕子です。',
      exampleZh: '（谁是田中？）我才是田中裕子！',
      why: '用が强调排他性，重点在前半句“不是别人，正是我田中”。回答未知疑问词！'
    },
    classicShowdown: {
      title: '🐘 语言学经典：象鼻句 (象は 鼻が 長い)',
      explanation: '一句话同时出现 は 与 が 时的绝妙分工！',
      sentence1: '象は (大舞台背景：至于大象嘛)',
      sentence1Meaning: '确立全句宏观大话题',
      sentence2: '鼻が 長い (聚光灯细节：具体是鼻子很长)',
      sentence2Meaning: '聚焦大象的具体局部特征'
    }
  },
  {
    id: 'ni-vs-de',
    title: '场所行为对决：に (ni) vs で (de)',
    pairName: 'に (静态归着点) vs で (动态舞台/手段)',
    conceptMnemonic: '有人有物安静在用【に】；活动动作发生地、交通工具手段用【で】！',
    leftItem: {
      particle: 'に',
      role: '静态存在场所 / 动作归着点',
      focusMetaphor: '📌 图钉钉在坐标点上',
      formula: '场所 に います/あります (人/物存在)',
      exampleJa: '教室に 先生が います。',
      exampleZh: '教室里有老师。(静态存在)',
      why: '人在教室里呆着，没有动态做某事；或者“電車に乗る(登上电车)”作为动作归宿。'
    },
    rightItem: {
      particle: 'で',
      role: '动态活动场所 / 工具与手段',
      focusMetaphor: '🎬 动作片开机的舞台现场',
      formula: '场所 で 动作动词 (学习/吃饭/跑)',
      exampleJa: '教室で 日本語を 勉強します。',
      exampleZh: '在教室里学习日语。(动态活动)',
      why: '教室不再是静态呆着的地方，而是作为“学习”这个动作发生施展的动态舞台！'
    },
    classicShowdown: {
      title: '🚃 交通工具经典对比：電車に乗る vs 電車で行く',
      explanation: '同样的电车，配不同助词表达完全不同的语法角色！',
      sentence1: '電車に乗る (に = 归着点)',
      sentence1Meaning: '物理动作：把身体移入电车，坐上电车',
      sentence2: '電車で行く (で = 交通手段)',
      sentence2Meaning: '出行方式：乘电车去（以电车作为代步工具）'
    }
  }
];
