/**
 * CS313 日语研习社 · JLPT 核心高频词库规范
 * 包含：N5 (零基础入门), N4 (初级进阶), N3 (中级跨越), N2 (升学求职黄金线), N1 (高级精通)
 * 标配：日文汉字、平假名注音、罗马音、音调核 (Pitch ①②③)、词性、中文释义、真题高频例句
 */

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface JlptWord {
  id: string;
  kanji: string;        // 汉字表记 (如 "学校", "桜", "食べる")
  furigana: string;     // 平假名注音 (如 "がっこう", "さくら", "たべる")
  romaji: string;       // 罗马字 (如 "gakkou")
  pitch: number;        // 音调核 (0型:平板调, 1型:头高调, 2型:中高调等)
  level: JlptLevel;     // JLPT 等级
  pos: string;          // 词性 (名·动1·动2·动3·形1·形2·副·接)
  meaning: string;      // 中文精准释义
  example: {
    ja: string;         // 日文例句
    furigana: string;   // 例句假名
    zh: string;         // 例句中文
  };
  tags: string[];       // 标签: 高频必考, 动词变形重点, 生活常用等
}

export const JLPT_CORE_VOCABULARY: JlptWord[] = [
  // ========================== N5 基础核心高频词 ==========================
  {
    id: 'jp-n5-001',
    kanji: '私',
    furigana: 'わたし',
    romaji: 'watashi',
    pitch: 0,
    level: 'N5',
    pos: '代词',
    meaning: '我 (日常男女通用礼貌自称)',
    example: {
      ja: '私は田中です。どうぞよろしくお願いします。',
      furigana: 'わたし は たなか です。どうぞ よろしく おねがいします。',
      zh: '我是田中。请多关照。'
    },
    tags: ['基础必备', '零基础高频']
  },
  {
    id: 'jp-n5-002',
    kanji: '先生',
    furigana: 'せんせい',
    romaji: 'sensei',
    pitch: 3,
    level: 'N5',
    pos: '名词',
    meaning: '老师；医生；律师 (尊称)',
    example: {
      ja: '日本語の先生はとても優しいです。',
      furigana: 'にほんご の せんせい は とても やさしい です。',
      zh: '日语老师非常温柔。'
    },
    tags: ['高频必考', '学校生活']
  },
  {
    id: 'jp-n5-003',
    kanji: '学校',
    furigana: 'がっこう',
    romaji: 'gakkou',
    pitch: 0,
    level: 'N5',
    pos: '名词',
    meaning: '学校',
    example: {
      ja: '毎朝八時に学校へ行きます。',
      furigana: 'まいあさ はちじ に がっこう へ いきます。',
      zh: '每天早晨八点去学校。'
    },
    tags: ['基础必备', '促音高频']
  },
  {
    id: 'jp-n5-004',
    kanji: '食べる',
    furigana: 'たべる',
    romaji: 'taberu',
    pitch: 2,
    level: 'N5',
    pos: '2类动词(一段)',
    meaning: '吃',
    example: {
      ja: '一緒に美味しいラーメンを食べましょう！',
      furigana: 'いっしょ に おいしい らーめん を たべましょう！',
      zh: '一起去吃好吃的拉面吧！'
    },
    tags: ['核心动词', '一段活用']
  },
  {
    id: 'jp-n5-005',
    kanji: '飲む',
    furigana: 'のむ',
    romaji: 'nomu',
    pitch: 1,
    level: 'N5',
    pos: '1类动词(五段)',
    meaning: '喝；吞服(药)',
    example: {
      ja: '冷たい水を一杯飲みました。',
      furigana: 'つめたい みず を いっぱい のみました。',
      zh: '喝了一杯凉水。'
    },
    tags: ['核心动词', '五段活用']
  },
  {
    id: 'jp-n5-006',
    kanji: '行く',
    furigana: 'いく',
    romaji: 'iku',
    pitch: 0,
    level: 'N5',
    pos: '1类动词(五段)',
    meaning: '去 / 前往 (特殊促音变)',
    example: {
      ja: '明日友達と東京へ行きます。',
      furigana: 'あした ともだち と とうきょう へ いきます。',
      zh: '明天和朋友去东京。'
    },
    tags: ['核心动词', '促音变特例']
  },
  {
    id: 'jp-n5-007',
    kanji: '来る',
    furigana: 'くる',
    romaji: 'kuru',
    pitch: 1,
    level: 'N5',
    pos: '3类动词(カ变)',
    meaning: '来 / 到来',
    example: {
      ja: '春が来ると、桜が咲きます。',
      furigana: 'はる が くると、さくら が さきます。',
      zh: '春天一来，樱花就会盛开。'
    },
    tags: ['核心动词', 'カ变活用']
  },
  {
    id: 'jp-n5-008',
    kanji: 'する',
    furigana: 'する',
    romaji: 'suru',
    pitch: 0,
    level: 'N5',
    pos: '3类动词(サ变)',
    meaning: '做 / 干 / 从事',
    example: {
      ja: '今晩日本語の勉強をします。',
      furigana: 'こんばん にほんご の べんきょう を します。',
      zh: '今晚要学习日语。'
    },
    tags: ['核心动词', 'サ变活用']
  },
  {
    id: 'jp-n5-009',
    kanji: '桜',
    furigana: 'さくら',
    romaji: 'sakura',
    pitch: 0,
    level: 'N5',
    pos: '名词',
    meaning: '樱花',
    example: {
      ja: '上野公園の桜はとても有名です。',
      furigana: 'うえのこうえん の さくら は とても ゆうめい です。',
      zh: '上野公园的樱花非常有名。'
    },
    tags: ['日本文化', '日常高频']
  },
  {
    id: 'jp-n5-010',
    kanji: '富士山',
    furigana: 'ふじさん',
    romaji: 'fujisan',
    pitch: 1,
    level: 'N5',
    pos: '专有名词',
    meaning: '富士山 (日本象征)',
    example: {
      ja: '新幹線から綺麗な富士山が見えました。',
      furigana: 'しんかんせん から きれい な ふじさん が みえました。',
      zh: '从新干线上看到了美丽的富士山。'
    },
    tags: ['日本地理', '高频必考']
  },

  // ========================== N4 进阶高频词 ==========================
  {
    id: 'jp-n4-001',
    kanji: '約束',
    furigana: 'やくそく',
    romaji: 'yakusoku',
    pitch: 0,
    level: 'N4',
    pos: '名·サ变动词',
    meaning: '约定；诺言；约定时间',
    example: {
      ja: '友達と六時に会う約束をしました。',
      furigana: 'ともだち と ろくじ に あう やくそく を しました。',
      zh: '和朋友约好了六点见面。'
    },
    tags: ['日常高频', '动词接续']
  },
  {
    id: 'jp-n4-002',
    kanji: '準備',
    furigana: 'じゅんび',
    romaji: 'junbi',
    pitch: 1,
    level: 'N4',
    pos: '名·サ变动词',
    meaning: '准备 / 预备',
    example: {
      ja: '旅行の荷物の準備はもう終わりましたか。',
      furigana: 'りょこう の にもつ の じゅんび は もう おわりましたか。',
      zh: '旅行行李的准备工作已经做好了吗？'
    },
    tags: ['高频必考', '拗音词汇']
  },
  {
    id: 'jp-n4-003',
    kanji: '連絡',
    furigana: 'れんらく',
    romaji: 'renraku',
    pitch: 0,
    level: 'N4',
    pos: '名·サ变动词',
    meaning: '联络；联系；通知',
    example: {
      ja: '駅に着いたらすぐに電話で連絡してください。',
      furigana: 'えき に ついたら すぐに でんわ で れんらく してください。',
      zh: '到了车站请立刻打电话联系我。'
    },
    tags: ['高频必考', '日常沟通']
  },
  {
    id: 'jp-n4-004',
    kanji: '手伝う',
    furigana: 'てつだう',
    romaji: 'tetsudau',
    pitch: 3,
    level: 'N4',
    pos: '1类动词(五段)',
    meaning: '帮忙；协助',
    example: {
      ja: '母の料理を少し手伝いました。',
      furigana: 'はは の りょうり を すこし てつだいました。',
      zh: '帮妈妈做了一会儿饭。'
    },
    tags: ['授受动词搭配', '真题高频']
  },
  {
    id: 'jp-n4-005',
    kanji: '珍しい',
    furigana: 'めずらしい',
    romaji: 'mezurashii',
    pitch: 4,
    level: 'N4',
    pos: '1类形容词(い形)',
    meaning: '罕见的；稀奇珍贵的',
    example: {
      ja: 'これは日本ではとても珍しい果物です。',
      furigana: 'これ は にほん では とても めずらしい くだもの です。',
      zh: '这在日本是非常少见的水果。'
    },
    tags: ['形容词重点', '阅读常客']
  },

  // ========================== N3 中级核心高频词 ==========================
  {
    id: 'jp-n3-001',
    kanji: '環境',
    furigana: 'かんきょう',
    romaji: 'kankyou',
    pitch: 0,
    level: 'N3',
    pos: '名词',
    meaning: '环境 (自然环境/生活环境)',
    example: {
      ja: '地球の自然環境を守る活動に参加しました。',
      furigana: 'ちきゅう の しぜん かんきょう を まもる かつどう に さんか しました。',
      zh: '参加了保护地球自然环境的公益活动。'
    },
    tags: ['读解高频', '社会话题']
  },
  {
    id: 'jp-n3-002',
    kanji: '経験',
    furigana: 'けいけん',
    romaji: 'keiken',
    pitch: 0,
    level: 'N3',
    pos: '名·サ变动词',
    meaning: '经验 / 经历',
    example: {
      ja: '留学で様々な素晴らしい経験ができました。',
      furigana: 'りゅうがく で さまざまな すばらしい けいけん が できました。',
      zh: '在留学中获得了各种精彩的人生经历。'
    },
    tags: ['求职面试', '听解核心']
  },
  {
    id: 'jp-n3-003',
    kanji: '複雑',
    furigana: 'ふくざつ',
    romaji: 'fukuzatsu',
    pitch: 0,
    level: 'N3',
    pos: '2类形容词(な形)',
    meaning: '复杂；纷繁复杂',
    example: {
      ja: '東京の地下鉄路線図はとても複雑です。',
      furigana: 'とうきょう の ちかてつ ろせんず は とても ふくざつ です。',
      zh: '东京的地铁线路图非常复杂。'
    },
    tags: ['な形容词', '真题必考']
  },
  {
    id: 'jp-n3-004',
    kanji: '確かめる',
    furigana: 'たしかめる',
    romaji: 'tashikameru',
    pitch: 4,
    level: 'N3',
    pos: '2类动词(一段)',
    meaning: '查明；弄清；确认',
    example: {
      ja: '出発する前にもう一度チケットを確かめてください。',
      furigana: 'しゅっぱつ する まえに もういちど ちけっと を たしかめて ください。',
      zh: '出发前请再次确认车票。'
    },
    tags: ['核心动词', '听解陷阱词']
  },

  // ========================== N2 进阶商务/日企高频词 ==========================
  {
    id: 'jp-n2-001',
    kanji: '担当',
    furigana: 'たんとう',
    romaji: 'tantou',
    pitch: 0,
    level: 'N2',
    pos: '名·サ变动词',
    meaning: '负责；担当 (商务常用)',
    example: {
      ja: '今回のプロジェクトを担当することになりました。',
      furigana: 'こんかい の ぷろじぇくと を たんとう する こと に なりました。',
      zh: '我决定负责本次的项目。'
    },
    tags: ['商务日语', '日企必备']
  },
  {
    id: 'jp-n2-002',
    kanji: '遠慮',
    furigana: 'えんりょ',
    romaji: 'enryo',
    pitch: 1,
    level: 'N2',
    pos: '名·サ变动词',
    meaning: '客气；顾虑；谢绝',
    example: {
      ja: 'どうぞご遠慮なくお召し上がりください。',
      furigana: 'どうぞ ごえんりょ なく おめしあがり ください。',
      zh: '请千万别客气，请用吧。'
    },
    tags: ['日本社交文化', '敬语高频']
  },
  {
    id: 'jp-n2-003',
    kanji: '思いやり',
    furigana: 'おもいやり',
    romaji: 'omoiyari',
    pitch: 0,
    level: 'N2',
    pos: '名词',
    meaning: '体贴；关怀；设身处地为人着想',
    example: {
      ja: '相手に対する思いやりの心が何よりも大切です。',
      furigana: 'あいて に たいする おもいやり の こころ が なによりも たいせつ です。',
      zh: '对对方的体贴关怀之心比什么都重要。'
    },
    tags: ['阅读情感词', '真题金句']
  },
  {
    id: 'jp-n2-004',
    kanji: '影響',
    furigana: 'えいきょう',
    romaji: 'eikyou',
    pitch: 0,
    level: 'N2',
    pos: '名·サ变动词',
    meaning: '影响；波及',
    example: {
      ja: '台風の影響で本日の新幹線は運休となります。',
      furigana: 'たいふう の えいきょう で ほんじつ の しんかんせん は うんきゅう と なります。',
      zh: '受台风影响，今天的新干线停止运行。'
    },
    tags: ['社会新闻', '读解第一题']
  },

  // ========================== N1 高级精通词 ==========================
  {
    id: 'jp-n1-001',
    kanji: '把握',
    furigana: 'はあく',
    romaji: 'haaku',
    pitch: 0,
    level: 'N1',
    pos: '名·サ变动词',
    meaning: '掌握；领会；确切理解',
    example: {
      ja: '現場の正確な状況を迅速に把握しなければならない。',
      furigana: 'げんば の せいかくな じょうきょう を じんそくに はあく しなければ ならない。',
      zh: '必须迅速准确地掌握现场的真实状况。'
    },
    tags: ['N1核心词', '社论高频']
  },
  {
    id: 'jp-n1-002',
    kanji: '曖昧',
    furigana: 'あいまい',
    romaji: 'aimai',
    pitch: 0,
    level: 'N1',
    pos: '2类形容词(な形)',
    meaning: '含糊不清；模棱两可',
    example: {
      ja: '曖昧な返事はビジネス上の誤解を招く恐れがある。',
      furigana: 'あいまい な へんじ は びじねす じょう の ごかい を まねく おそれ が ある。',
      zh: '含糊的答复有可能导致商业上的误解。'
    },
    tags: ['日本文化思维', '真题必考']
  },
  {
    id: 'jp-n1-003',
    kanji: '著しい',
    furigana: 'いちじるしい',
    romaji: 'ichijirushii',
    pitch: 5,
    level: 'N1',
    pos: '1类形容词(い形)',
    meaning: '显著的；极其明显的',
    example: {
      ja: '近年、AI技術の発展には著しいものがある。',
      furigana: 'きんねん、えーあいてくのろじー の はってん には いちじるしい もの が ある。',
      zh: '近年来，AI技术的发展取得了显著成果。'
    },
    tags: ['书面学术', '读解核心']
  }
];

export const JLPT_LEVEL_LABELS: Record<JlptLevel, { label: string; desc: string; badgeClass: string }> = {
  N5: { label: 'N5 入门起步', desc: '假名与日常简短会话，适合零基础学员', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  N4: { label: 'N4 初级进阶', desc: '基础词汇与生活场景，能理解基础慢速日语', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  N3: { label: 'N3 中级桥梁', desc: '日常话题流畅交流，动漫生肉看懂50%', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  N2: { label: 'N2 黄金准绳', desc: '赴日留学与日企求职硬门槛，无字幕追番', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  N1: { label: 'N1 高级精通', desc: '母语级深层理解，商业报刊社论精读', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' }
};
