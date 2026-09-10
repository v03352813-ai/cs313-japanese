/**
 * CS313 日语研习社 · 经典动漫与日剧名台词精学剧场规范 (30部全收录)
 * 涵盖 30 部国民级日剧与吉卜力/新海诚动漫高光名场面
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
  genre: string;                 // 题材 (吉卜力·新海诚经典、治愈青春与感动、高分职场与神剧、热血冒险与动漫)
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
  {
    "id": "anime-spirited-away-onigiri",
    "title": "千与千寻",
    "japaneseTitle": "千と千尋の神隠し",
    "sceneTitle": "白龙递给千寻施了魔法的饭团",
    "year": "2001",
    "levelTag": "N4初级",
    "genre": "吉卜力·新海诚经典",
    "category": "吉卜力经典",
    "episode": "花丛名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    "tags": [
      "吉卜力",
      "宫崎骏",
      "催泪名场面",
      "N4核心"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "ハク",
        "role": "白龙",
        "ja": "千尋、これを食べな。ご飯を作ってある。",
        "furigana": "ちひろ、これ を たべな。ごはん を つくって ある。",
        "romaji": "Chihiro, kore o tabena. Gohan o tsukutte aru.",
        "zh": "千寻，吃这个吧。我给你做好了饭团。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "ご飯",
            "furigana": "ごはん",
            "romaji": "gohan",
            "meaning": "米饭 / 饭团",
            "jlptLevel": "N5"
          },
          {
            "word": "作る",
            "furigana": "つくる",
            "romaji": "tsukuru",
            "meaning": "制作 / 烹饪",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～てある：他动词て形+ある，表示某人为了某种目的提前做好了某准备状态。",
        "clozeQuestion": {
          "maskedJa": "千尋、これを____。ご飯を作ってある。",
          "maskedWord": "食べな",
          "options": [
            "食べな",
            "食べるな",
            "食べろ",
            "食べて"
          ],
          "hint": "白龙温柔叮嘱千寻吃下饭团，动词ます形去ます+な 表示亲切的轻微命令/劝诱。"
        }
      },
      {
        "id": 2,
        "speaker": "ハク",
        "role": "白龙",
        "ja": "つらかったろう。さあ、お食べ。元気になるおまじないをかけてあるから。",
        "furigana": "つらかったろう。さあ、おたべ。げんき に なる おまじない を かけて ある から。",
        "romaji": "Tsurakattarou. Saa, otabe. Genki ni naru omajinai o kakete aru kara.",
        "zh": "吃了不少苦吧。来，吃吧。里面施了让你恢复精神的魔法。",
        "timeSec": 4,
        "highlightWords": [
          {
            "word": "辛い",
            "furigana": "つらい",
            "romaji": "tsurai",
            "meaning": "痛苦的；辛苦的",
            "jlptLevel": "N3"
          },
          {
            "word": "お呪い",
            "furigana": "おまじない",
            "romaji": "omajinai",
            "meaning": "护身符；魔法祈愿",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～ろう：形容词过去式推量形，等同于「つらかったでしょう（很辛苦吧）」。"
      }
    ]
  },
  {
    "id": "anime-your-name-twilight",
    "title": "你的名字。",
    "japaneseTitle": "君の名は。",
    "sceneTitle": "分身之时（黄昏之时）陨石坑边缘的相遇",
    "year": "2016",
    "levelTag": "N3中级",
    "genre": "吉卜力·新海诚经典",
    "category": "新海诚唯美",
    "episode": "高潮逢魔之刻",
    "posterBg": "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)",
    "tags": [
      "新海诚",
      "黄昏之时",
      "封神告白",
      "N3高频"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "立花瀧",
        "role": "泷",
        "ja": "大事な人、忘れたくない人、忘れちゃいけない人！誰だ、お前の名前は？！",
        "furigana": "だいじ な ひと、わすれたくない ひと、わすれちゃ いけない ひと！だれ だ、おまえ の なまえ は？！",
        "romaji": "Daiji na hito, wasuretaku nai hito, wasurecha ikenai hito! Dare da, omae no namae wa?!",
        "zh": "重要的人、不想忘记的人、绝不能忘记的人！是谁？你的名字是？！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "大事",
            "furigana": "だいじ",
            "romaji": "daiji",
            "meaning": "重要；珍贵",
            "jlptLevel": "N4"
          },
          {
            "word": "忘れる",
            "furigana": "わすれる",
            "romaji": "wasureru",
            "meaning": "忘记",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～ちゃいけない：口语中「～てはいけない」的亲切简缩形，表示“绝对不能……”。",
        "clozeQuestion": {
          "maskedJa": "大事な人、忘れたくない人、____いけない人！",
          "maskedWord": "忘れちゃ",
          "options": [
            "忘れちゃ",
            "忘れては",
            "忘れない",
            "忘れよう"
          ],
          "hint": "电影最震撼台词，口语表示绝不能忘记「わすれちゃ（忘れちゃいけない）」。"
        }
      },
      {
        "id": 2,
        "speaker": "宮水三葉",
        "role": "三叶",
        "ja": "目が覚めても忘れないようにさ、名前書いておこうよ。",
        "furigana": "め が さめて も わすれない ように さ、なまえ かいて おこう よ。",
        "romaji": "Me ga samete mo wasurenai youni sa, namae kaite okou yo.",
        "zh": "为了即使睡醒也不会忘记，我们把名字写在手上吧。",
        "timeSec": 5,
        "highlightWords": [
          {
            "word": "目が覚める",
            "furigana": "め が さめる",
            "romaji": "me ga sameru",
            "meaning": "醒来 / 睡醒",
            "jlptLevel": "N3"
          },
          {
            "word": "書く",
            "furigana": "かく",
            "romaji": "kaku",
            "meaning": "书写",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～ように：表示目的（为了使……不发生）；～ておく：提前做好某准备动作。"
      }
    ]
  },
  {
    "id": "anime-howls-castle-find",
    "title": "哈尔的移动城堡",
    "japaneseTitle": "ハウルの動く城",
    "sceneTitle": "空中漫步与穿越时空的重逢",
    "year": "2004",
    "levelTag": "N4初级",
    "genre": "吉卜力·新海诚经典",
    "category": "吉卜力浪漫",
    "episode": "空中漫步名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
    "tags": [
      "哈尔",
      "木村拓哉配音",
      "空中漫步",
      "浪漫高光"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "ハウル",
        "role": "哈尔",
        "ja": "やあ、ごめんごめん。探したよ。",
        "furigana": "やあ、ごめん ごめん。さがした よ。",
        "romaji": "Yaa, gomen gomen. Sagashita yo.",
        "zh": "哎呀，抱歉抱歉。终于找到你了。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "探す",
            "furigana": "さがす",
            "romaji": "sagasu",
            "meaning": "寻找",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 探したよ：动词过去式+よ，表现出终于寻找到宿命之人的温柔与释然。"
      },
      {
        "id": 2,
        "speaker": "ハウル",
        "role": "哈尔",
        "ja": "足を止めないで。そのまま歩き続けて。",
        "furigana": "あし を とめないで。そのまま あるき つづけて。",
        "romaji": "Ashi o tomenaide. Sonomama aruki tsudzukete.",
        "zh": "不要停下脚步。就这样继续走下去。",
        "timeSec": 4,
        "highlightWords": [
          {
            "word": "足",
            "furigana": "あし",
            "romaji": "ashi",
            "meaning": "脚 / 步伐",
            "jlptLevel": "N5"
          },
          {
            "word": "続ける",
            "furigana": "つづける",
            "romaji": "tsudukeru",
            "meaning": "持续 / 连续",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～ないで：否定祈使（不要停下）；动词连用形+続けて（继续走下去）。"
      }
    ]
  },
  {
    "id": "anime-totoro-bus-stop",
    "title": "龙猫",
    "japaneseTitle": "となりのトトロ",
    "sceneTitle": "雨夜公交车站与大龙猫的奇妙偶遇",
    "year": "1988",
    "levelTag": "N5入门",
    "genre": "吉卜力·新海诚经典",
    "category": "吉卜力治愈",
    "episode": "雨伞雨夜名场面",
    "posterBg": "linear-gradient(135deg, #059669 0%, #0284C7 100%)",
    "tags": [
      "宫崎骏",
      "童年回忆",
      "大龙猫",
      "N5必刷"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "サツキ",
        "role": "小月",
        "ja": "雨、やまないね。お父さん、遅いね。",
        "furigana": "あめ、やまない ね。おとうさん、おそい ね。",
        "romaji": "Ame, yamanai ne. Otousan, osoi ne.",
        "zh": "雨一直不停呢。爸爸好慢啊。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "雨",
            "furigana": "あめ",
            "romaji": "ame",
            "meaning": "雨",
            "jlptLevel": "N5"
          },
          {
            "word": "止む",
            "furigana": "やむ",
            "romaji": "yamu",
            "meaning": "停止",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～ないね：否定形+终助词ね，寻求对方认同（雨怎么还不停呢）。"
      },
      {
        "id": 2,
        "speaker": "サツキ",
        "role": "小月",
        "ja": "これ、お父さんの傘。貸してあげる。使って！",
        "furigana": "これ、おとうさん の かさ。かして あげる。つかって！",
        "romaji": "Kore, otousan no kasa. Kashite ageru. Tsukatte!",
        "zh": "这是我爸爸的伞。借给你用吧，快打上！",
        "timeSec": 5,
        "highlightWords": [
          {
            "word": "傘",
            "furigana": "かさ",
            "romaji": "kasa",
            "meaning": "雨伞",
            "jlptLevel": "N5"
          },
          {
            "word": "貸す",
            "furigana": "かす",
            "romaji": "kasu",
            "meaning": "借出",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～てあげる：授受动词表达（为对方做某善意动作：借给你）。"
      }
    ]
  },
  {
    "id": "anime-weathering-with-you-sky",
    "title": "天气之子",
    "japaneseTitle": "天気の子",
    "sceneTitle": "帆高飞向云层紧握阳菜：“比起晴天我更要你！”",
    "year": "2019",
    "levelTag": "N3中级",
    "genre": "吉卜力·新海诚经典",
    "category": "新海诚奇幻",
    "episode": "云上追寻名场面",
    "posterBg": "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    "tags": [
      "新海诚",
      "天空追寻",
      "纯爱呐喊",
      "N3重点"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "森嶋帆高",
        "role": "帆高",
        "ja": "天気なんて、狂ったままでいいんだ！陽菜は陽菜のために祈って！",
        "furigana": "てんき なんて、くるった まま で いい んだ！ひな は ひな の ため に いのって！",
        "romaji": "Tenki nante, kurutta mama de iinda! Hina wa Hina no tame ni inotte!",
        "zh": "天气这种东西，就算一直失控疯掉也无所谓！阳菜你要为了自己而祈愿啊！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "狂う",
            "furigana": "くるう",
            "romaji": "kuruu",
            "meaning": "疯狂；失常",
            "jlptLevel": "N3"
          },
          {
            "word": "祈る",
            "furigana": "いのる",
            "romaji": "inoru",
            "meaning": "祈祷；祝愿",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～まま（でいい）：保持某种状态即可；～のために：为了……。"
      }
    ]
  },
  {
    "id": "anime-suzume-door",
    "title": "铃芽之旅",
    "japaneseTitle": "すずめの戸締まり",
    "sceneTitle": "常世草太与铃芽关闭灾厄之门：“我出发了！”",
    "year": "2022",
    "levelTag": "N3中级",
    "genre": "吉卜力·新海诚经典",
    "category": "新海诚治愈",
    "episode": "关门咒文名场面",
    "posterBg": "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
    "tags": [
      "新海诚",
      "废墟关门",
      "希望光芒",
      "N3精听"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "宗像草太",
        "role": "草太",
        "ja": "かけまくも畏き日不見の神よ、謹んでお返し申す！",
        "furigana": "かけまく も かしこき ひみず の かみ よ、つつしんで おかえし もうす！",
        "romaji": "Kakemakumo kashikoki Himizu no kami yo, tsutsushinde okaeshi mousu!",
        "zh": "惶恐敬畏的土地之神啊，谨遵神谕物归原主！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "謹んで",
            "furigana": "つつしんで",
            "romaji": "tsutsushinde",
            "meaning": "恭敬地；谨慎地",
            "jlptLevel": "N1"
          },
          {
            "word": "申す",
            "furigana": "もうす",
            "romaji": "mousu",
            "meaning": "自谦表达说/做",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 お返し申す：最高规格自谦语（お+动词连用形+申す）。"
      }
    ]
  },
  {
    "id": "anime-princess-mononoke-live",
    "title": "幽灵公主",
    "japaneseTitle": "もののけ姫",
    "sceneTitle": "阿席达卡对桑说：“活下去，你很美丽”",
    "year": "1997",
    "levelTag": "N2进阶",
    "genre": "吉卜力·新海诚经典",
    "category": "吉卜力史诗",
    "episode": "森林对峙名场面",
    "posterBg": "linear-gradient(135deg, #047857 0%, #0F172A 100%)",
    "tags": [
      "宫崎骏",
      "自然史诗",
      "阿席达卡",
      "N2核心"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "アシタカ",
        "role": "阿席达卡",
        "ja": "生きろ。そなたは美しい。",
        "furigana": "いきろ。そなた は うつくしい。",
        "romaji": "Ikiro. Sonata wa utsukushii.",
        "zh": "活下去。你很美丽。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "生きる",
            "furigana": "いきる",
            "romaji": "ikiru",
            "meaning": "活着",
            "jlptLevel": "N4"
          },
          {
            "word": "そなた",
            "furigana": "そなた",
            "romaji": "sonata",
            "meaning": "古语代词：你",
            "jlptLevel": "古典"
          }
        ],
        "grammarNotes": "💡 生きろ：动词一段活用命令形（生きる -> 生きろ），铿锵有力的生命赞歌。"
      }
    ]
  },
  {
    "id": "anime-5cm-per-second-sakura",
    "title": "秒速5厘米",
    "japaneseTitle": "秒速5センチメートル",
    "sceneTitle": "樱花落下的速度是每秒5厘米",
    "year": "2007",
    "levelTag": "N3中级",
    "genre": "吉卜力·新海诚经典",
    "category": "新海诚物哀",
    "episode": "铁道樱花名场面",
    "posterBg": "linear-gradient(135deg, #F472B6 0%, #0284C7 100%)",
    "tags": [
      "新海诚",
      "物哀美学",
      "樱花之约",
      "N3精读"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "篠原明里",
        "role": "明里",
        "ja": "ねえ、秒速５センチなんだって。桜の花びらの落ちるスピード。",
        "furigana": "ねえ、びょうそく ご センチ なんだって。さくら の はなびら の おちる スピード。",
        "romaji": "Nee, byousoku go senchi nandatte. Sakura no hanabira no ochiru supiido.",
        "zh": "呐，听说秒速是5厘米哦。樱花花瓣飘落的速度。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "秒速",
            "furigana": "びょうそく",
            "romaji": "byousoku",
            "meaning": "秒速",
            "jlptLevel": "N2"
          },
          {
            "word": "花びら",
            "furigana": "はなびら",
            "romaji": "hanabira",
            "meaning": "花瓣",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～んだって：口语听闻传闻表达，相当于「～と聞いている（听说……）」。"
      }
    ]
  },
  {
    "id": "anime-kikis-delivery-service-fly",
    "title": "魔女宅急便",
    "japaneseTitle": "魔女の宅急便",
    "sceneTitle": "琪琪在海边面包房的独立飞翔物语",
    "year": "1989",
    "levelTag": "N5入门",
    "genre": "治愈青春与感动",
    "category": "吉卜力励志",
    "episode": "飞翔独立名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
    "tags": [
      "吉卜力",
      "成长物语",
      "吉吉黑猫",
      "N5轻松"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "キキ",
        "role": "琪琪",
        "ja": "落ち込むこともあるけれど、私、この街が好きです。",
        "furigana": "おちこむ こと も ある けれど、わたし、この まち が すき です。",
        "romaji": "Ochikomu koto mo aru keredo, watashi, kono machi ga suki desu.",
        "zh": "虽然也有心情低落的时候，但我真的很喜欢这座城市。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "落ち込む",
            "furigana": "おちこむ",
            "romaji": "ochikomu",
            "meaning": "沮丧；消沉",
            "jlptLevel": "N3"
          },
          {
            "word": "好き",
            "furigana": "すき",
            "romaji": "suki",
            "meaning": "喜欢",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～こともある：有时也会……（表示偶尔发生的状态）。"
      }
    ]
  },
  {
    "id": "anime-laputa-castle-balse",
    "title": "天空之城",
    "japaneseTitle": "天空の城ラピュタ",
    "sceneTitle": "毁灭与守护的古老咒语“巴鲁斯”",
    "year": "1986",
    "levelTag": "N4初级",
    "genre": "治愈青春与感动",
    "category": "吉卜力冒险",
    "episode": "神咒名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%)",
    "tags": [
      "宫崎骏",
      "巴鲁斯",
      "久石让",
      "N4必备"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "シータ＆パズー",
        "role": "希达与巴鲁",
        "ja": "土に根をおろし、風と共に生きよう。種と共に冬を越え、鳥と共に春を歌おう。",
        "furigana": "つち に ね を おろし、かぜ と ともに いきよう。たね と ともに ふゆ を こえ、とり と ともに はる を うたおう。",
        "romaji": "Tsuchi ni ne o oroshi, kaze to tomo ni ikiyou. Tane to tomo ni fuyu o koe, tori to tomo ni haru o utaou.",
        "zh": "把根扎在泥土中，与风儿一同生存。与种子一同越冬，与鸟儿一同歌唱春日。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "共に",
            "furigana": "ともに",
            "romaji": "tomoni",
            "meaning": "一同；共同",
            "jlptLevel": "N3"
          },
          {
            "word": "越える",
            "furigana": "こえる",
            "romaji": "koeru",
            "meaning": "越过；度过",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～と共に（とともに）：JLPT N3/N2 核心文法，表示“与……一同”。"
      }
    ]
  },
  {
    "id": "anime-nausicaa-golden-field",
    "title": "风之谷",
    "japaneseTitle": "風の谷のナウシカ",
    "sceneTitle": "娜乌西卡守护王虫平息金色草原",
    "year": "1984",
    "levelTag": "N2进阶",
    "genre": "治愈青春与感动",
    "category": "吉卜力史诗",
    "episode": "金色草原奇迹",
    "posterBg": "linear-gradient(135deg, #EAB308 0%, #0284C7 100%)",
    "tags": [
      "娜乌西卡",
      "自然启示",
      "王虫之怒",
      "N2阅读"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "大ババ",
        "role": "老祖母",
        "ja": "その者、青き衣をまといて、金色の野に降り立つべし。",
        "furigana": "その もの、あおき ころも を まといて、こんじき の の に おりたつ べし。",
        "romaji": "Sono mono, aoki koromo o matoite, konjiki no no ni oritatsu beshi.",
        "zh": "那人身披青色长袍，降临在金色的广袤草原之上。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "衣",
            "furigana": "ころも",
            "romaji": "koromo",
            "meaning": "衣裳 / 袍子",
            "jlptLevel": "古典"
          },
          {
            "word": "降り立つ",
            "furigana": "おりたつ",
            "romaji": "oritatsu",
            "meaning": "降临；踏上",
            "jlptLevel": "N1"
          }
        ],
        "grammarNotes": "💡 ～べし：古语推量与断定助动词，表示“必定会……/理当如此”。"
      }
    ]
  },
  {
    "id": "drama-escape-useful-contract",
    "title": "逃避虽可耻但有用",
    "japaneseTitle": "逃げるは恥だが役に立つ",
    "sceneTitle": "实栗与平匡的契约婚姻与“拥抱日”规则",
    "year": "2016",
    "levelTag": "N3中级",
    "genre": "治愈青春与感动",
    "category": "浪漫职场",
    "episode": "契约拥抱名场面",
    "posterBg": "linear-gradient(135deg, #EC4899 0%, #0284C7 100%)",
    "tags": [
      "新垣结衣",
      "星野源",
      "契约结婚",
      "N3会话"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "森山みくり",
        "role": "实栗",
        "ja": "ハグの日を作りませんか？火曜日をハグの日にしましょう！",
        "furigana": "ハグ の ひ を つくりませんか？かようび を ハグ の ひ に しましょう！",
        "romaji": "Hagu no hi o tsukurimasen ka? Kayoubi o hagu no hi ni shimashou!",
        "zh": "我们要不要定一个“拥抱日”呢？把星期二定为拥抱日吧！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "火曜日",
            "furigana": "かようび",
            "romaji": "kayoubi",
            "meaning": "星期二",
            "jlptLevel": "N5"
          },
          {
            "word": "ハグ",
            "furigana": "はぐ",
            "romaji": "hagu",
            "meaning": "拥抱（Hug）",
            "jlptLevel": "外来语"
          }
        ],
        "grammarNotes": "💡 ～にしましょう：把……定为/选择为……（表示双方商量决定的提议）。"
      }
    ]
  },
  {
    "id": "drama-proposal-operation-hallelujah",
    "title": "求婚大作战",
    "japaneseTitle": "プロポーズ大作戦",
    "sceneTitle": "健三“哈利路亚·机会”奔跑追寻礼的青春誓言",
    "year": "2007",
    "levelTag": "N4初级",
    "genre": "治愈青春与感动",
    "category": "青春奇迹",
    "episode": "时光倒流狂奔",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #6366F1 100%)",
    "tags": [
      "山下智久",
      "长泽雅美",
      "时光奔跑",
      "N4热血"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "岩瀬健",
        "role": "健三",
        "ja": "明日野郎は馬鹿野郎だ！やり直すなら、今しかない！",
        "furigana": "あした やろう は ばか やろう だ！やりなおす なら、いま しかない！",
        "romaji": "Ashita yarou wa baka yarou da! Yarinaosu nara, ima shika nai!",
        "zh": "总说明天再做的人是大混蛋！要想重新来过，只有现在！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "やり直す",
            "furigana": "やりなおす",
            "romaji": "yarinaosu",
            "meaning": "重做 / 重新来过",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～しかない：除……之外别无他法（唯有现在）。"
      }
    ]
  },
  {
    "id": "drama-long-vacation-relax",
    "title": "悠长假期",
    "japaneseTitle": "ロングバケーション",
    "sceneTitle": "濑名对小南说：“不顺的时候，就当作是神赐给你的长假吧”",
    "year": "1996",
    "levelTag": "N3中级",
    "genre": "治愈青春与感动",
    "category": "恋爱神作",
    "episode": "天台长假名言",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #1E293B 100%)",
    "tags": [
      "木村拓哉",
      "山口智子",
      "日剧巅峰",
      "N3金句"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "瀬名秀俊",
        "role": "濑名",
        "ja": "うまくいかない時は神様がくれた長い休暇だと思って、無理に走らないで休めばいい。",
        "furigana": "うまくいかない とき は かみさま が くれた ながい きゅうか だ と おもって、むり に はしらないで やすめば いい。",
        "romaji": "Umaku ikanai toki wa kamisama ga kureta nagai kyuuka da to omotte, muri ni hashiranaide yasumeba ii.",
        "zh": "生活不顺利的时候，就把它当作神赐予的长假，不要勉强奔跑，好好休息就好。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "休暇",
            "furigana": "きゅうか",
            "romaji": "kyuuka",
            "meaning": "假期",
            "jlptLevel": "N3"
          },
          {
            "word": "無理に",
            "furigana": "むりに",
            "romaji": "muri ni",
            "meaning": "勉强地",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～ばいい：表示提出建议“只要……就可以”。"
      }
    ]
  },
  {
    "id": "drama-kodoku-gourmet-hungry",
    "title": "孤独的美食家",
    "japaneseTitle": "孤独のグルメ",
    "sceneTitle": "五郎叔“咚·咚·咚”饥肠辘辘后的地道居酒屋点单",
    "year": "2012",
    "levelTag": "N4初级",
    "genre": "治愈青春与感动",
    "category": "美食治愈",
    "episode": "腹が減った名场面",
    "posterBg": "linear-gradient(135deg, #F59E0B 0%, #0284C7 100%)",
    "tags": [
      "井之头五郎",
      "居酒屋点单",
      "美食治愈",
      "N4实用"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "井之頭五郎",
        "role": "五郎叔",
        "ja": "腹が……減った。よし、店を探そう！",
        "furigana": "はら が……へった。よし、みせ を さがそう！",
        "romaji": "Hara ga... hetta. Yoshi, mise o sagasou!",
        "zh": "肚子……饿了。好，去找家店吃吧！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "腹が減る",
            "furigana": "はら が へる",
            "romaji": "hara ga heru",
            "meaning": "肚子饿（口语男性用语）",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 探そう：动词意志形（寻找吧！下定决心行动）。"
      }
    ]
  },
  {
    "id": "drama-unnatural-win",
    "title": "非自然死亡 (Unnatural)",
    "japaneseTitle": "アンナチュラル",
    "sceneTitle": "三澄美琴关于绝望与生存的救赎名言",
    "year": "2018",
    "levelTag": "N2进阶",
    "genre": "高分职场与神剧",
    "category": "高分日剧神作",
    "episode": "第1集高光",
    "posterBg": "linear-gradient(135deg, #0EA5E9 0%, #1E3A8A 100%)",
    "tags": [
      "石原里美",
      "神级台词",
      "生活救赎",
      "N2必考"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "三澄美琴",
        "role": "美琴 (法医)",
        "ja": "絶望してる暇があったら、うまいもの食べて寝るかな。",
        "furigana": "ぜつぼう してる ひま が あったら、うまい もの たべて ねる かな。",
        "romaji": "Zetsubou shiteru hima ga attara, umai mono tabete neru kana.",
        "zh": "有绝望的闲功夫的话，还不如去吃点好吃的然后睡大觉呢。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "絶望",
            "furigana": "ぜつぼう",
            "romaji": "zetsubou",
            "meaning": "绝望",
            "jlptLevel": "N2"
          },
          {
            "word": "暇",
            "furigana": "ひま",
            "romaji": "hima",
            "meaning": "空闲 / 闲暇",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～たら：假定条件形，表示“如果……的话”。"
      },
      {
        "id": 2,
        "speaker": "三澄美琴",
        "role": "美琴 (法医)",
        "ja": "生きている限り、負けてないんじゃない？",
        "furigana": "いきている かぎり、まけて ない んじゃない？",
        "romaji": "Ikite iru kagiri, makete nain janai?",
        "zh": "只要还活着，就不算输掉吧？",
        "timeSec": 4,
        "highlightWords": [
          {
            "word": "生きる",
            "furigana": "いきる",
            "romaji": "ikiru",
            "meaning": "活着",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～限り（かぎり）：JLPT N2 核心语法，表示“只要在……限度内”。"
      }
    ]
  },
  {
    "id": "drama-hanzawa-naoki-double",
    "title": "半泽直树",
    "japaneseTitle": "半沢直樹",
    "sceneTitle": "加倍奉还！燃爆全网的职场反击誓言",
    "year": "2013",
    "levelTag": "N2进阶",
    "genre": "高分职场与神剧",
    "category": "职场反击神作",
    "episode": "全剧高燃金句",
    "posterBg": "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    "tags": [
      "堺雅人",
      "倍返し",
      "职场名言",
      "经典热血"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "半沢直樹",
        "role": "半泽直树",
        "ja": "やられたらやり返す、倍返しだ！それが私の流儀だ！",
        "furigana": "やられたら やりかえす、ばいがえし だ！それ が わたし の りゅうぎ だ！",
        "romaji": "Yararetara yarikaesu, baigaeshi da! Sore ga watashi no ryuugi da!",
        "zh": "以牙还牙，加倍奉还！这就是我的行事作风！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "倍返し",
            "furigana": "ばいがえし",
            "romaji": "baigaeshi",
            "meaning": "加倍奉还",
            "jlptLevel": "N2"
          }
        ],
        "grammarNotes": "💡 やられたら：动词被动态+たら（如果被算计的话）。"
      }
    ]
  },
  {
    "id": "drama-quartet-cry",
    "title": "四重奏 (Quartet)",
    "japaneseTitle": "カルテット",
    "sceneTitle": "在炸鸡块与大提琴之间关于人生的神级对白",
    "year": "2017",
    "levelTag": "N2进阶",
    "genre": "高分职场与神剧",
    "category": "坂元裕二金句",
    "episode": "名场面对白",
    "posterBg": "linear-gradient(135deg, #0369A1 0%, #1E293B 100%)",
    "tags": [
      "松隆子",
      "满岛光",
      "坂元裕二",
      "金句封神"
    ],
    "isFreePreview": true,
    "dialogues": [
      {
        "id": 1,
        "speaker": "巻真紀",
        "role": "卷真纪",
        "ja": "泣きながらご飯を食べたことがある人は、生きていけます。",
        "furigana": "なきながら ごはん を たべた こと が ある ひと は、いきて いけます。",
        "romaji": "Nakinagara gohan o tabeta koto ga aru hito wa, ikite ikemasu.",
        "zh": "曾经哭着吃过饭的人，是能够坚强生活下去的。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "泣く",
            "furigana": "なく",
            "romaji": "naku",
            "meaning": "哭泣",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～ながら：一边……一边；～たことがある：曾经做过某事。"
      }
    ]
  },
  {
    "id": "drama-juhan-shuttai-passion",
    "title": "重版出来！",
    "japaneseTitle": "重版出来！",
    "sceneTitle": "黑泽心在漫画编辑部的热血元气奋斗",
    "year": "2016",
    "levelTag": "N3中级",
    "genre": "高分职场与神剧",
    "category": "职场燃系",
    "episode": "重版加印名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    "tags": [
      "黑木华",
      "小田切让",
      "漫画出版",
      "N3职场"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "黒沢心",
        "role": "小熊",
        "ja": "私は本気で、この本を重版させたいんです！読者に届けるまで諦めません！",
        "furigana": "わたし は ほんき で、この ほん を じゅうはん させたい んです！どくしゃ に とどける まで あきらめません！",
        "romaji": "Watashi wa honki de, kono hon o juuhan sasetai ndesu! Dokusha ni todokeru made akiramemasen!",
        "zh": "我是真心想让这本书加印重版！在送到读者手中之前，我绝不放弃！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "重版",
            "furigana": "じゅうはん",
            "romaji": "juuhan",
            "meaning": "加印 / 重版",
            "jlptLevel": "N2"
          },
          {
            "word": "届ける",
            "furigana": "とどける",
            "romaji": "todokeru",
            "meaning": "送达 / 送交",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～させたい：动词使役态+たい（想让……加印）；～まで：直到……为止。"
      }
    ]
  },
  {
    "id": "drama-grand-maison-tokyo-stars",
    "title": "东京大饭店",
    "japaneseTitle": "グランメゾン東京",
    "sceneTitle": "尾花夏树冲击米其林三星的料理哲学与团队执着",
    "year": "2019",
    "levelTag": "N2进阶",
    "genre": "高分职场与神剧",
    "category": "职场燃系",
    "episode": "三星之约",
    "posterBg": "linear-gradient(135deg, #0F172A 0%, #0284C7 100%)",
    "tags": [
      "木村拓哉",
      "米其林三星",
      "顶级法餐",
      "N2高级"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "尾花夏樹",
        "role": "尾花",
        "ja": "妥協した一皿を出したら、その瞬間に料理人は終わりだ。",
        "furigana": "だきょう した ひとさら を だしたら、その しゅんかん に りょうりにん は おわり だ。",
        "romaji": "Dakyou shita hitosara o dashitara, sono shunkan ni ryourinin wa owari da.",
        "zh": "一旦端出一盘妥协的菜肴，在那一瞬间，厨师就彻底完蛋了。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "妥協",
            "furigana": "だきょう",
            "romaji": "dakyou",
            "meaning": "妥协",
            "jlptLevel": "N1"
          },
          {
            "word": "瞬間",
            "furigana": "しゅんかん",
            "romaji": "shunkan",
            "meaning": "瞬间",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 ～たら：假定条件；その瞬間に：在那一瞬间。"
      }
    ]
  },
  {
    "id": "anime-conan-truth",
    "title": "名侦探柯南",
    "japaneseTitle": "名探偵コナン",
    "sceneTitle": "“真相永远只有一个！”工藤新一推理宣告",
    "year": "1996",
    "levelTag": "N3中级",
    "genre": "高分职场与神剧",
    "category": "国民推理",
    "episode": "经典定场诗",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #DC2626 100%)",
    "tags": [
      "青山刚昌",
      "推理神作",
      "真相只有一个",
      "N3高频"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "江戸川コナン",
        "role": "柯南",
        "ja": "真実はいつもひとつ！",
        "furigana": "しんじつ は いつも ひとつ！",
        "romaji": "Shinjitsu wa itsumo hitotsu!",
        "zh": "真相永远只有一个！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "真実",
            "furigana": "しんじつ",
            "romaji": "shinjitsu",
            "meaning": "真实 / 真相",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 真実はいつもひとつ：经典名台词，副词「いつも（总是/永远）」+「ひとつ（一个）」。"
      }
    ]
  },
  {
    "id": "anime-spy-family-wakuwaku",
    "title": "间谍过家家",
    "japaneseTitle": "SPY×FAMILY",
    "sceneTitle": "阿尼亚“哇库哇库”与劳埃德黄昏的名校面试",
    "year": "2022",
    "levelTag": "N5入门",
    "genre": "高分职场与神剧",
    "category": "温馨搞笑",
    "episode": "阿尼亚兴奋名场面",
    "posterBg": "linear-gradient(135deg, #F472B6 0%, #0284C7 100%)",
    "tags": [
      "阿尼亚",
      "黄昏",
      "哇库哇库",
      "N5入门"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "アーニャ",
        "role": "阿尼亚",
        "ja": "わくわく！アーニャ、ピーナッツが好き！",
        "furigana": "わくわく！アーニャ、ピーナッツ が すき！",
        "romaji": "Wakuwaku! Aanya, piinattsu ga suki!",
        "zh": "兴奋激动（哇库哇库）！阿尼亚最喜欢花生了！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "わくわく",
            "furigana": "わくわく",
            "romaji": "wakuwaku",
            "meaning": "兴奋满怀；雀跃",
            "jlptLevel": "拟态语"
          }
        ],
        "grammarNotes": "💡 拟态语「わくわく」：形容期待、欢喜而心潮澎湃的心理状态。"
      }
    ]
  },
  {
    "id": "anime-slam-dunk-coach",
    "title": "灌篮高手",
    "japaneseTitle": "SLAM DUNK",
    "sceneTitle": "三井寿双膝跪地泪崩：“安西教练，我想打篮球！”",
    "year": "1993",
    "levelTag": "N4初级",
    "genre": "热血冒险与动漫",
    "category": "青春热血",
    "episode": "经典泪崩名场面",
    "posterBg": "linear-gradient(135deg, #DC2626 0%, #0284C7 100%)",
    "tags": [
      "井上雄彦",
      "三井寿",
      "安西教练",
      "燃哭名言"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "三井寿",
        "role": "三井寿",
        "ja": "安西先生、バスケがしたいです……！",
        "furigana": "あんざい せんせい、バスケ が したい です……！",
        "romaji": "Anzai sensei, basuke ga shitai desu...!",
        "zh": "安西教练，我想打篮球……！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "バスケ",
            "furigana": "ばすけ",
            "romaji": "basuke",
            "meaning": "篮球（Basketball略称）",
            "jlptLevel": "N5"
          },
          {
            "word": "したい",
            "furigana": "したい",
            "romaji": "shitai",
            "meaning": "想要做",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～がしたい：动词想要做某事（希望助动词たい前接格助词が表示对象）。"
      }
    ]
  },
  {
    "id": "anime-attack-on-titan-freedom",
    "title": "进击的巨人",
    "japaneseTitle": "進撃の巨人",
    "sceneTitle": "艾伦关于向往墙外世界与自由的终极呐喊",
    "year": "2013",
    "levelTag": "N3中级",
    "genre": "热血冒险与动漫",
    "category": "奇幻热血",
    "episode": "自由之翼呐喊",
    "posterBg": "linear-gradient(135deg, #1E293B 0%, #0284C7 100%)",
    "tags": [
      "艾伦",
      "调查兵团",
      "为了自由",
      "N3热血"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "エレン",
        "role": "艾伦",
        "ja": "戦わなければ勝てない。戦え、戦え！",
        "furigana": "たたかわなければ かてない。たたかえ、たたかえ！",
        "romaji": "Tatakawanakereba katenai. Tatakae, tatakae!",
        "zh": "不去战斗的话就赢不了。去战斗吧，去战斗！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "戦う",
            "furigana": "たたかう",
            "romaji": "tatakau",
            "meaning": "战斗 / 搏斗",
            "jlptLevel": "N3"
          },
          {
            "word": "勝つ",
            "furigana": "かつ",
            "romaji": "katsu",
            "meaning": "获胜 / 胜利",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 ～なければ……ない：双重否定（如果不……就不能……）；命令形「戦え！」。"
      }
    ]
  },
  {
    "id": "anime-demon-slayer-resolve",
    "title": "鬼灭之刃",
    "japaneseTitle": "鬼滅の刃",
    "sceneTitle": "富冈义勇叱责炭治郎：“生杀予夺的权利绝不要交给他人！”",
    "year": "2019",
    "levelTag": "N3中级",
    "genre": "热血冒险与动漫",
    "category": "热血高能",
    "episode": "雪地初遇义勇",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #6366F1 100%)",
    "tags": [
      "炭治郎",
      "富冈义勇",
      "水之呼吸",
      "N3台词"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "冨岡義勇",
        "role": "义勇 (水柱)",
        "ja": "生殺与奪の権を他人に握らせるな！惨めったらしく蹲るのはやめろ！",
        "furigana": "せいさつよだつ の けん を たにん に にぎらせる な！みじめったらしく うずくまる の は やめろ！",
        "romaji": "Seisatsuyodatsu no ken o tanin ni nigiraseru na! Mijimettarashiku uzukumaru no wa yamero!",
        "zh": "不要把生杀予夺的大权拱手让给他人！不要像个懦夫一样凄惨地蜷缩在雪地里！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "生殺与奪",
            "furigana": "せいさつよだつ",
            "romaji": "seisatsuyodatsu",
            "meaning": "生杀予夺",
            "jlptLevel": "N1"
          },
          {
            "word": "惨め",
            "furigana": "みじめ",
            "romaji": "mijime",
            "meaning": "凄惨 / 悲惨",
            "jlptLevel": "N2"
          }
        ],
        "grammarNotes": "💡 握らせるな：动词使役态+禁止助词な（绝不要让别人握住！）。"
      }
    ]
  },
  {
    "id": "anime-haikyuu-ball-not-dropped",
    "title": "排球少年！！",
    "japaneseTitle": "ハイキュー!!",
    "sceneTitle": "日向翔阳与影山飞雄：“排球这项运动，球还没落地呢！”",
    "year": "2014",
    "levelTag": "N4初级",
    "genre": "热血冒险与动漫",
    "category": "热血运动",
    "episode": "乌野起飞名场面",
    "posterBg": "linear-gradient(135deg, #F97316 0%, #0284C7 100%)",
    "tags": [
      "乌野高中",
      "飞吧",
      "怪人快攻",
      "N4热血"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "日向翔陽",
        "role": "日向",
        "ja": "まだボールは床に落ちてない！まだ負けてない！",
        "furigana": "まだ ボール は ゆか に おちてない！まだ まけてない！",
        "romaji": "Mada booru wa yuka ni ochitenai! Mada maketenai!",
        "zh": "球还没落在地上呢！我们还没有输！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "落ちる",
            "furigana": "おちる",
            "romaji": "ochiru",
            "meaning": "落下",
            "jlptLevel": "N4"
          },
          {
            "word": "床",
            "furigana": "ゆか",
            "romaji": "yuka",
            "meaning": "地板 / 地面",
            "jlptLevel": "N4"
          }
        ],
        "grammarNotes": "💡 まだ～てない：表示动作尚未发生（球还没落地）。"
      }
    ]
  },
  {
    "id": "anime-jujutsu-kaisen-domain",
    "title": "咒术回战",
    "japaneseTitle": "呪術廻戦",
    "sceneTitle": "五条悟摘下眼罩：“领域展开·无量空处”",
    "year": "2020",
    "levelTag": "N2进阶",
    "genre": "热血冒险与动漫",
    "category": "动作奇幻",
    "episode": "无量空处高燃",
    "posterBg": "linear-gradient(135deg, #6366F1 0%, #0284C7 100%)",
    "tags": [
      "五条悟",
      "无量空处",
      "战力天花板",
      "N2帅气"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "五条悟",
        "role": "五条悟",
        "ja": "大丈夫。僕、最強だから。領域展開――「無量空処」。",
        "furigana": "だいじょうぶ。ぼく、さいきょう だから。りょういきてんかい――「むりょうくうしょ」。",
        "romaji": "Daijoubu. Boku, saikyou dakara. Ryouiki tenkai -- \"Muryoukuusho\".",
        "zh": "放心吧。因为我可是最强的。领域展开——“无量空处”。",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "最強",
            "furigana": "さいきょう",
            "romaji": "saikyou",
            "meaning": "最强",
            "jlptLevel": "N3"
          },
          {
            "word": "領域",
            "furigana": "りょういき",
            "romaji": "ryouiki",
            "meaning": "领域",
            "jlptLevel": "N1"
          }
        ],
        "grammarNotes": "💡 ～だから：表示主观原因与强大自信的根据（因为我是最强）。"
      }
    ]
  },
  {
    "id": "anime-one-piece-king",
    "title": "海贼王 (航海王)",
    "japaneseTitle": "ONE PIECE",
    "sceneTitle": "路飞扬帆出海誓言：“我是要成为海贼王的男人！”",
    "year": "1999",
    "levelTag": "N4初级",
    "genre": "热血冒险与动漫",
    "category": "王道热血",
    "episode": "起航宏愿名场面",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #EAB308 100%)",
    "tags": [
      "路飞",
      "草帽一伙",
      "海贼王",
      "N4激情"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "モンキー・D・ルフィ",
        "role": "路飞",
        "ja": "海賊王に、俺はなる！",
        "furigana": "かいぞくおう に、おれ は なる！",
        "romaji": "Kaizokuou ni, ore wa naru!",
        "zh": "我是要成为海贼王的男人！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "海賊",
            "furigana": "かいぞく",
            "romaji": "kaizoku",
            "meaning": "海盗 / 海贼",
            "jlptLevel": "N3"
          },
          {
            "word": "なる",
            "furigana": "なる",
            "romaji": "naru",
            "meaning": "变成 / 成为",
            "jlptLevel": "N5"
          }
        ],
        "grammarNotes": "💡 ～になる：名词+になる，表示身份或状态的变化与最终达成。"
      }
    ]
  },
  {
    "id": "anime-naruto-ninja-way",
    "title": "火影忍者",
    "japaneseTitle": "NARUTO -ナルト-",
    "sceneTitle": "鸣人握拳宣告：“有话直说说到做到，这就是我的忍道！”",
    "year": "2002",
    "levelTag": "N4初级",
    "genre": "热血冒险与动漫",
    "category": "羁绊励志",
    "episode": "火之意志誓言",
    "posterBg": "linear-gradient(135deg, #F97316 0%, #0284C7 100%)",
    "tags": [
      "漩涡鸣人",
      "火之意志",
      "忍道",
      "N4感动"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "うずまきナルト",
        "role": "鸣人",
        "ja": "まっすぐ自分の言葉は曲げねえ。それが俺の忍道だ！",
        "furigana": "まっすぐ じぶん の ことば は まげねえ。それ が おれ の にんどう だ！",
        "romaji": "Massugu jibun no kotoba wa magenee. Sore ga ore no nindou da!",
        "zh": "说到做到绝不食言，这就是我的忍道！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "曲げる",
            "furigana": "まげる",
            "romaji": "mageru",
            "meaning": "弯曲 / 违背誓言",
            "jlptLevel": "N3"
          }
        ],
        "grammarNotes": "💡 曲げねえ：口语男性粗粝否定（曲げない -> 曲げねえ）。"
      }
    ]
  },
  {
    "id": "anime-gintama-soul",
    "title": "银魂",
    "japaneseTitle": "銀魂",
    "sceneTitle": "坂田银时：“天塌下来只要有武士的刀，就什么都能斩断！”",
    "year": "2006",
    "levelTag": "N2进阶",
    "genre": "热血冒险与动漫",
    "category": "无厘头温情",
    "episode": "万事屋武士之魂",
    "posterBg": "linear-gradient(135deg, #0284C7 0%, #64748B 100%)",
    "tags": [
      "坂田银时",
      "万事屋",
      "武士魂",
      "N2毒舌温情"
    ],
    "isFreePreview": false,
    "dialogues": [
      {
        "id": 1,
        "speaker": "坂田銀時",
        "role": "银时",
        "ja": "美しく最後を飾りつける暇があるなら、最後まで美しく生きようじゃねえか。",
        "furigana": "うつくしく さいご を かざりつける ひま が ある なら、さいご まで うつくしく いきよう じゃねえか。",
        "romaji": "Utsukushiku saigo o kazaritsukeru hima ga aru nara, saigo made utsukushiku ikiyou ja nee ka.",
        "zh": "如果有闲功夫把最后点缀得漂漂亮亮，倒不如漂漂亮亮地活到最后啊！",
        "timeSec": 0,
        "highlightWords": [
          {
            "word": "飾りつける",
            "furigana": "かざりつける",
            "romaji": "kazaritsukeru",
            "meaning": "装点 / 装饰",
            "jlptLevel": "N2"
          }
        ],
        "grammarNotes": "💡 ～ようじゃねえか：意志形+じゃねえか（反问劝诱：我们为什么不……呢！）。"
      }
    ]
  }
];

export function getAllAnimeScenes(): AnimeDramaScene[] {
  return ANIME_DRAMA_SCENES;
}
