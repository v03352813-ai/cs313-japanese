export interface DramaDialogueLine {
  id: number;
  speaker: string;
  role: string;
  avatarColor: string;
  ko: string;
  zh: string;
  roman: string;
  timeSec: number;
  durationSec: number;
  highlightWords?: { word: string; meaning: string }[];
  grammarNotes?: string;
  clozeQuestion?: {
    maskedKo: string;
    maskedWord: string;
    options: string[];
    hint: string;
  };
}

export type KDramaCategoryType = '国民口碑神剧' | '顶流心动爱情' | '职场与社会实战' | '高能高光名场面';
export type DramaLevelTag = '初级' | '中级' | '高级';

export interface KDramaScene {
  id: string;
  dramaTitle: string;
  koreanDramaTitle: string;
  category: KDramaCategoryType;
  genre: string;
  difficulty: '初级入门 (TOPIK 1-2)' | '中级进阶 (TOPIK 3-4)' | '中高级精通 (TOPIK 5-6)';
  levelTag: DramaLevelTag;
  cardIndex?: number;
  sceneTitle: string;
  episode: string;
  durationSeconds: number;
  localVideoFile?: string;
  videoUrl?: string;
  bilibiliBvid?: string;
  bilibiliCid?: string;
  posterUrl: string;
  stillUrl: string;
  bgGradient: string;
  isFreePreview: boolean;
  summary: string;
  culturalInsight: string;
  dialogues: DramaDialogueLine[];
  isCustom?: boolean;
}

export const DRAMA_GENRE_CATEGORIES = [
  '全部',
  '🏆 国民口碑神剧',
  '💖 顶流心动爱情',
  '💼 职场与社会实战',
  '🔥 高能高光名场面'
];

export const DRAMA_DIFFICULTY_LEVELS = [
  '全部难度',
  '🌱 初级 (TOPIK 1-2)',
  '🌿 中级 (TOPIK 3-4)',
  '🌲 高级 (TOPIK 5-6)'
];

export const DRAMA_CATEGORY_META: Record<KDramaCategoryType, { label: string; icon: string; desc: string; badgeColor: string }> = {
  '国民口碑神剧': {
    label: '国民口碑神剧',
    icon: '🏆',
    desc: '现象级韩剧 · 口碑封神',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  '顶流心动爱情': {
    label: '顶流心动爱情',
    icon: '💖',
    desc: '心动告白 · 高甜浪漫对白',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  '职场与社会实战': {
    label: '职场与社会实战',
    icon: '💼',
    desc: 'TOPIK高频 · 职场实战社交',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  '高能高光名场面': {
    label: '高能高光名场面',
    icon: '🔥',
    desc: '情绪张力 · 霸气高光反击',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  }
};

export const K_DRAMA_SCENES: KDramaScene[] = [
  {
    "id": "drama-king-the-land-01",
    "dramaTitle": "欢迎来到王之国",
    "koreanDramaTitle": "킹더랜드",
    "category": "国民口碑神剧",
    "genre": "温情治愈 / 人生感悟",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "奶奶对嗣朗的温情开导：“人生只有一次，去真正做你想做的事吧”",
    "episode": "高光温情名场面",
    "durationSeconds": 19,
    "localVideoFile": "king_the_land_01.mp4",
    "videoUrl": "/videos/king_the_land_01.mp4",
    "posterUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-800 via-rose-950 to-black",
    "isFreePreview": true,
    "summary": "千嗣朗面临人生与职场抉择时，奶奶温柔开导她不用看别人眼色，勇敢去追求真正想做的事情，走错路大不了回头，掉下悬崖再爬上来的经典治愈名场面。",
    "culturalInsight": "韩国长辈在家庭中常以“돌아서 가다（掉头/绕道）”、“기어 올라가다（爬上来）”等朴素坚韧的词汇给予晚辈对抗高压社会的底气与温暖。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "한 번 사는 인생인데",
        "zh": "人生只有一次",
        "roman": "Han beon saneun insaeng-inde",
        "timeSec": 0,
        "durationSec": 2,
        "highlightWords": [
          {
            "word": "한 번",
            "meaning": "一次"
          },
          {
            "word": "인생",
            "meaning": "人生"
          }
        ],
        "grammarNotes": "动词 + -(으)ㄴ/는 (定语接续修饰名词) + -(이)ㄴ데 (背景说明)",
        "clozeQuestion": {
          "maskedKo": "한 번 사는 (      )인데",
          "maskedWord": "인생",
          "options": [
            "인생",
            "시간",
            "순간",
            "세상"
          ],
          "hint": "核心名词：“人生”（인생）。"
        }
      },
      {
        "id": 2,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "진짜 너 하고 싶은 거 해.",
        "zh": "就去做你真正想做的事吧。",
        "roman": "Jinjja neo hago sipeun geo hae.",
        "timeSec": 2,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "진짜",
            "meaning": "真正 / 真的"
          },
          {
            "word": "-고 싶다",
            "meaning": "想做某事"
          }
        ],
        "grammarNotes": "动词词干 + -고 싶다 (表示主观意愿：想要做某事)",
        "clozeQuestion": {
          "maskedKo": "진짜 너 (      ) 거 해.",
          "maskedWord": "하고 싶은",
          "options": [
            "하고 싶은",
            "보고 싶은",
            "듣고 싶은",
            "가고 싶은"
          ],
          "hint": "惯用句型：“想要做”（하고 싶다）。"
        }
      },
      {
        "id": 3,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "누구 눈치 볼 것도 없고 망설일 것도 없어.",
        "zh": "不用看别人的眼色，也不用瞻前顾后。",
        "roman": "Nugu nunchi bol geotdo eopgo mangseoril geotdo eopseo.",
        "timeSec": 5,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "눈치를 보다",
            "meaning": "看眼色 / 察言观色"
          },
          {
            "word": "망설이다",
            "meaning": "犹豫 / 踌躇"
          }
        ],
        "grammarNotes": "-(으)ㄹ 것도 없다 (根本没有必要做某事 / 无需做某事)",
        "clozeQuestion": {
          "maskedKo": "누구 (      ) 볼 것도 없고 망설일 것도 없어.",
          "maskedWord": "눈치",
          "options": [
            "눈치",
            "얼굴",
            "마음",
            "소리"
          ],
          "hint": "高频成语：“眼色/察言观色”（눈치）。"
        }
      },
      {
        "id": 4,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "너 하고 싶은 거 다 해.",
        "zh": "你想做什么就都去做。",
        "roman": "Neo hago sipeun geo da hae.",
        "timeSec": 9,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "다",
            "meaning": "全部 / 都 / 尽情"
          }
        ],
        "grammarNotes": "副词 다 (全部 / 尽情去做)",
        "clozeQuestion": {
          "maskedKo": "너 하고 싶은 거 (      ) 해.",
          "maskedWord": "다",
          "options": [
            "다",
            "덜",
            "더",
            "안"
          ],
          "hint": "副词：“全部/都”（다）。"
        }
      },
      {
        "id": 5,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "길이 아니면 돌아서 가는 거고.",
        "zh": "如果发现走错路，大不了就回头。",
        "roman": "Giri animyeon doraseo ganeun geogo.",
        "timeSec": 12,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "돌아서 가다",
            "meaning": "掉头 / 绕道返回"
          },
          {
            "word": "길",
            "meaning": "道路 / 方向"
          }
        ],
        "grammarNotes": "-(으)면 (条件连词：如果/要是...) + -는 거고 (就是这样做的)",
        "clozeQuestion": {
          "maskedKo": "길이 아니면 (      ) 가는 거고.",
          "maskedWord": "돌아서",
          "options": [
            "돌아서",
            "뛰어서",
            "멈춰서",
            "서둘러서"
          ],
          "hint": "动词短语：“掉头/回头”（돌아서 가다）。"
        }
      },
      {
        "id": 6,
        "speaker": "차순희 (车顺喜)",
        "role": "奶奶",
        "avatarColor": "bg-amber-700",
        "ko": "낭떠러지면 다시 기어 올라가면 되니까.",
        "zh": "要是掉下悬崖，那就再爬上来就行了。",
        "roman": "Nangtteoreojimyeon dasi gieo ollagamyeon doenikka.",
        "timeSec": 15,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "낭떠러지",
            "meaning": "悬崖 / 绝壁"
          },
          {
            "word": "기어 올라가다",
            "meaning": "爬上来"
          },
          {
            "word": "다시",
            "meaning": "再次 / 重新"
          }
        ],
        "grammarNotes": "-(으)면 되다 (只要...就行了) + -(으)니까 (表原因：因为...)",
        "clozeQuestion": {
          "maskedKo": "(      )면 다시 기어 올라가면 되니까.",
          "maskedWord": "낭떠러지",
          "options": [
            "낭떠러지",
            "바다",
            "하늘",
            "어둠"
          ],
          "hint": "名词：“悬崖/绝壁”（낭떠러지）。"
        }
      }
    ]
  },
  {
    "id": "drama-king-the-land-02",
    "dramaTitle": "名场面励志独白",
    "koreanDramaTitle": "인생 명대사",
    "category": "高能高光名场面",
    "genre": "职场金句 / 独立自省",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "女主角清醒金句：“不要吝啬自己的心意，随心所欲地生活吧”",
    "episode": "经典高光独白",
    "durationSeconds": 40,
    "localVideoFile": "king_the_land_02.mp4",
    "videoUrl": "/videos/king_the_land_02.mp4",
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-indigo-950 via-slate-900 to-black",
    "isFreePreview": true,
    "summary": "女主角向年轻朋友分享人生感悟：年轻时总是谨小慎微、害怕受伤，后来才明白不要吝啬自己的心意，在不触犯法律的前提下多去体验各种经历，毫无后悔地生活。",
    "culturalInsight": "韩语中“막 살다（随性/随心所欲地活）”打破了传统东亚社会对年轻人的严苛束缚，成为当代年轻人极具共鸣的清醒生活哲学。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "여러분, 막 사세요.",
        "zh": "朋友们，请随心所欲的生活吧。",
        "roman": "Yeoreobun, mak saseyo.",
        "timeSec": 0,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "여러분",
            "meaning": "各位 / 朋友们"
          },
          {
            "word": "막 살다",
            "meaning": "随心所欲地生活 / 随性生活"
          }
        ],
        "grammarNotes": "副词 막 (随性/任性) + 动词 -(으)세요 (敬语祈使句：请做...)",
        "clozeQuestion": {
          "maskedKo": "여러분, (      ) 사세요.",
          "maskedWord": "막",
          "options": [
            "막",
            "꼭",
            "늘",
            "더"
          ],
          "hint": "副词：“随性/随心所欲”（막）。"
        }
      },
      {
        "id": 2,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "생각해보면 나는 20대 때 너무 사리면서 살았던 거 같아.",
        "zh": "回过头来想想，我20岁的时候活得太畏首畏尾了。",
        "roman": "Saenggakhaebomyeon naneun isipdae ttae neomu sarimyeonseo saratdeon geo gata.",
        "timeSec": 5,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "생각해보면",
            "meaning": "回想起来"
          },
          {
            "word": "사리다",
            "meaning": "谨小慎微 / 畏首畏尾"
          },
          {
            "word": "-ㄴ 것 같다",
            "meaning": "好像 / 觉得"
          }
        ],
        "grammarNotes": "-면서 (伴随状态：一边...一边...) + -았/었던 것 같다 (对过去经验的回顾与推测)",
        "clozeQuestion": {
          "maskedKo": "생각해보면 나는 20대 때 너무 (      ) 살았던 거 같아.",
          "maskedWord": "사리면서",
          "options": [
            "사리면서",
            "웃으면서",
            "울면서",
            "달리면서"
          ],
          "hint": "动词：“谨慎/顾忌/畏首畏尾”（몸을 사리다）。"
        }
      },
      {
        "id": 3,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "마음도 많이 사리고, 다칠까 봐 너무 겁먹었어.",
        "zh": "内心也非常谨慎，很害怕会受到伤害。",
        "roman": "Maeumdo mani sarigo, dachilkka bwa neomu geommeogeosseo.",
        "timeSec": 11,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "다치다",
            "meaning": "受伤"
          },
          {
            "word": "겁먹다",
            "meaning": "害怕 / 畏缩"
          }
        ],
        "grammarNotes": "-(으)ㄹ까 봐 (担心害怕某种负面情况发生：害怕/担心...)",
        "clozeQuestion": {
          "maskedKo": "마음도 많이 사리고, (      ) 봐 너무 겁먹었어.",
          "maskedWord": "다칠까",
          "options": [
            "다칠까",
            "갈까",
            "볼까",
            "알까"
          ],
          "hint": "动词：“受伤”（다치다）。"
        }
      },
      {
        "id": 4,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "근데 그게 지나고 보니까 그렇게 후회가 되더라고요. 좀 더 막 살걸.",
        "zh": "但是后来发现非常后悔。早知道应该随性一点生活的。",
        "roman": "Geunde geuge jinago bonikka geureoke huhoega doedeoragoyo. Jom deo mak salgeol.",
        "timeSec": 17,
        "durationSec": 6,
        "highlightWords": [
          {
            "word": "지나고 보다",
            "meaning": "事后回看"
          },
          {
            "word": "후회",
            "meaning": "后悔"
          },
          {
            "word": "-(으)ㄹ걸",
            "meaning": "早知道就..."
          }
        ],
        "grammarNotes": "-(으)ㄹ걸 (终结词尾：表示对过去遗憾后悔的语气)",
        "clozeQuestion": {
          "maskedKo": "근데 그게 지나고 보니까 그렇게 (      )가 되더라고요.",
          "maskedWord": "후회",
          "options": [
            "후회",
            "기쁨",
            "걱정",
            "위로"
          ],
          "hint": "名词：“后悔”（후회）。"
        }
      },
      {
        "id": 5,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "법에 저촉되지 않는 선에서 막 사세요.",
        "zh": "在不触碰法律的前提下，请随心所欲的生活。",
        "roman": "Beobe jeochokdoeji anneun seoneseon mak saseyo.",
        "timeSec": 24,
        "durationSec": 8,
        "highlightWords": [
          {
            "word": "저촉되다",
            "meaning": "触碰 / 抵触"
          },
          {
            "word": "선",
            "meaning": "底线 / 边界"
          }
        ],
        "grammarNotes": "-지 않는 선에서 (在不...的范围/底线内)",
        "clozeQuestion": {
          "maskedKo": "법에 (      ) 않는 선에서 막 사세요.",
          "maskedWord": "저촉되지",
          "options": [
            "저촉되지",
            "어울리지",
            "지나치지",
            "벗어나지"
          ],
          "hint": "汉字词动词：“触犯/抵触”（저촉되다）。"
        }
      },
      {
        "id": 6,
        "speaker": "정선 (政善)",
        "role": "女主角",
        "avatarColor": "bg-purple-700",
        "ko": "마음도 아끼지 말고 이것저것 경험도 많이 해보고, 후회 없이.",
        "zh": "不要吝啬自己的心意，多去体会各种各样的经历，毫无后悔地活着。",
        "roman": "Maeumdo akkiji malgo igeotjeogeot gyeongheomdo mani haebogo, huhoe eopsi.",
        "timeSec": 33,
        "durationSec": 7,
        "highlightWords": [
          {
            "word": "아끼다",
            "meaning": "吝惜 / 爱惜"
          },
          {
            "word": "이것저것",
            "meaning": "各种各样"
          },
          {
            "word": "후회 없이",
            "meaning": "毫不后悔地"
          }
        ],
        "grammarNotes": "-지 말고 (否定连接：不要做A而做B) + -아/어 보다 (尝试做...)",
        "clozeQuestion": {
          "maskedKo": "마음도 (      ) 말고 이것저것 경험도 많이 해보고, 후회 없이.",
          "maskedWord": "아끼지",
          "options": [
            "아끼지",
            "버리지",
            "숨기지",
            "속이지"
          ],
          "hint": "动词：“吝啬/爱惜”（아끼다）。"
        }
      }
    ]
  },
  {
    "id": "drama-queen-of-tears",
    "dramaTitle": "眼泪女王",
    "koreanDramaTitle": "눈물의 여왕",
    "category": "顶流心动爱情",
    "genre": "财阀都市 / 破镜重圆",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "德国薰衣草花田真情告白：“我哪儿也不去，就守在你身边”",
    "episode": "第 6 集 名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-purple-950 via-rose-950 to-black",
    "isFreePreview": true,
    "summary": "白贤佑（金秀贤 饰）飞越重洋来到德国无忧宫，在薰衣草花田中向洪海仁（金智媛 饰）表明真心，两人解开多年心结的名场面。",
    "culturalInsight": "韩语中“곁에 있다（守在身边）”是浪漫关系中最高阶的陪伴承诺，蕴含生死相随的深情厚意。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "백현우 (白贤佑)",
        "role": "男主角",
        "avatarColor": "bg-indigo-600",
        "ko": "내가 어디 안 가고 네 곁에 있을게. 그러니까 포기하지 마.",
        "zh": "我哪儿也不去，就守在你身边。所以千万别放弃。",
        "roman": "Naega eodi an gago ne gyeote isseulge. Geureonikka pogihaji ma.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "곁",
            "meaning": "身边 / 身旁"
          },
          {
            "word": "포기하다",
            "meaning": "放弃"
          }
        ],
        "grammarNotes": "动词 + -(으)ㄹ게 (承诺语气：我将会...) + -지 마 (非敬语禁止句)",
        "clozeQuestion": {
          "maskedKo": "내가 어디 안 가고 네 (      )에 있을게.",
          "maskedWord": "곁",
          "options": [
            "곁",
            "손",
            "눈",
            "길"
          ],
          "hint": "空间名词：“身旁/身边”（곁）。"
        }
      },
      {
        "id": 2,
        "speaker": "홍해인 (洪海仁)",
        "role": "女主角",
        "avatarColor": "bg-rose-600",
        "ko": "나 진짜 살고 싶어졌어. 당신이랑 같이, 오래오래.",
        "zh": "我现在真的很想活下去了。想和你一起，长长久久地活下去。",
        "roman": "Na jinjja salgo sipeojyeosseo. Dangsini-rang gachi, orae-orae.",
        "timeSec": 6,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "살다",
            "meaning": "活 / 生活"
          },
          {
            "word": "오래오래",
            "meaning": "长长久久 / 很久"
          }
        ],
        "grammarNotes": "-아/어지다 (状态变化：变得...) + -고 싶다 (想要...)",
        "clozeQuestion": {
          "maskedKo": "당신이랑 같이, (      ).",
          "maskedWord": "오래오래",
          "options": [
            "오래오래",
            "빨리빨리",
            "조용히",
            "따로"
          ],
          "hint": "副词叠词：“长长久久”（오래오래）。"
        }
      }
    ]
  },
  {
    "id": "drama-goblin",
    "dramaTitle": "孤单又灿烂的神-鬼怪",
    "koreanDramaTitle": "쓸쓸하고 찬란하神 - 도깨비",
    "category": "国民口碑神剧",
    "genre": "奇幻浪漫 / 宿命深情",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "枫叶国荞麦花田初雪告白：“跟你在一起的所有时间都很耀眼”",
    "episode": "第 4 集 名场面",
    "durationSeconds": 42,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-900 via-stone-900 to-black",
    "isFreePreview": true,
    "summary": "鬼怪金侁（孔刘 饰）在初雪降临之际向池恩倬（金高银 饰）深情朗诵初恋独白，全网播放量破十亿的封神对白。",
    "culturalInsight": "“눈부셨다（曾如此耀眼）”在韩语文学表达中常用来高度赞叹一段不可复刻的璀璨青春与宿命之恋。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "김신 (金侁)",
        "role": "鬼怪",
        "avatarColor": "bg-emerald-800",
        "ko": "너와 함께한 시간 모두 눈부셨다. 날이 좋아서, 날이 좋지 않아서, 날이 적당해서.",
        "zh": "跟你在一起的所有时间都很耀眼。因为天气好，因为天气不好，因为天气刚刚好。",
        "roman": "Neowa hamkkehan sigan modu nunbusyeotda. Nari joaseo, nari jochi anaseo, nari jeokdanghaeseo.",
        "timeSec": 0,
        "durationSec": 6,
        "highlightWords": [
          {
            "word": "눈부시다",
            "meaning": "耀眼 / 灿烂"
          },
          {
            "word": "적당하다",
            "meaning": "恰当 / 合适"
          }
        ],
        "grammarNotes": "形容词 + -아서/어서 (因果连词：因为...所以...)",
        "clozeQuestion": {
          "maskedKo": "너와 함께한 시간 모두 (      ).",
          "maskedWord": "눈부셨다",
          "options": [
            "눈부셨다",
            "어두웠다",
            "슬펐다",
            "무서웠다"
          ],
          "hint": "经典名句形容词：“耀眼灿烂”（눈부시다）。"
        }
      },
      {
        "id": 2,
        "speaker": "김신 (金侁)",
        "role": "鬼怪",
        "avatarColor": "bg-emerald-800",
        "ko": "모든 날이 좋았다. 그리고 무슨 일이 일어나도 네 잘못이 아니다.",
        "zh": "每一天，都很美好。而且无论发生什么事，都不是你的错。",
        "roman": "Modeun nari joatda. Geurigo museun iri ireonado ne jalmosi anida.",
        "timeSec": 7,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "일어나다",
            "meaning": "发生 / 起来"
          },
          {
            "word": "잘못",
            "meaning": "过错 / 失误"
          }
        ],
        "grammarNotes": "-아/어도 (让步状语：即使/无论...也...)",
        "clozeQuestion": {
          "maskedKo": "무슨 일이 일어나도 네 (      )이 아니다.",
          "maskedWord": "잘못",
          "options": [
            "잘못",
            "생각",
            "선물",
            "시간"
          ],
          "hint": "名词：“过错/错误”（잘못）。"
        }
      }
    ]
  },
  {
    "id": "drama-crash-landing-on-you",
    "dramaTitle": "爱的迫降",
    "koreanDramaTitle": "사랑의 불시착",
    "category": "顶流心动爱情",
    "genre": "跨界浪漫 / 宿命相守",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "三八线分界线跨步拥抱：“哪怕再跨过这道线，我也一定要找到你”",
    "episode": "第 16 集 终极名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-teal-950 via-slate-900 to-black",
    "isFreePreview": true,
    "summary": "李政赫（玄彬 饰）与尹世理（孙艺珍 饰）在军事分界线最后的告别与跨越拥抱，全网爆泪的高光名场面。",
    "culturalInsight": "在韩语语境中，“한 걸음（一步）”常被赋予突破心理防线与现实阻碍的崇高象征意义。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "리정혁 (李政赫)",
        "role": "男主角",
        "avatarColor": "bg-emerald-700",
        "ko": "한 걸음 정도는 괜찮겠지. 당신을 보기 위해서라면.",
        "zh": "哪怕跨出这一步也没关系吧。只要是为了能见到你。",
        "roman": "Han georeum jeongdoneun gwaenchanketji. Dangsineul bogi wihaeseoramyeon.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "한 걸음",
            "meaning": "一步"
          },
          {
            "word": "위해서라면",
            "meaning": "只要是为了..."
          }
        ],
        "grammarNotes": "名词 + -을/를 위해 (为了...) + -(이)라면 (假设条件句)",
        "clozeQuestion": {
          "maskedKo": "한 (      ) 정도는 괜찮겠지.",
          "maskedWord": "걸음",
          "options": [
            "걸음",
            "순간",
            "마음",
            "사람"
          ],
          "hint": "量词：“步/脚步”（걸음）。"
        }
      },
      {
        "id": 2,
        "speaker": "윤세리 (尹世理)",
        "role": "女主角",
        "avatarColor": "bg-rose-500",
        "ko": "우린 다시 만날 수 있을 거예요. 기도하면 꼭 그렇게 될 테니까.",
        "zh": "我们一定会再次相遇的。只要去祈祷，就一定会如愿以偿。",
        "roman": "Urin dasi mannal su isseul geoyeyo. Gidohamyeon kkok geureoke doel tenikka.",
        "timeSec": 6,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "기도하다",
            "meaning": "祈祷"
          },
          {
            "word": "꼭",
            "meaning": "一定 / 务必"
          }
        ],
        "grammarNotes": "-(으)ㄹ 수 있다 (能力可能：能够/可以...) + -(으)ㄹ 테니까 (表意图承诺)",
        "clozeQuestion": {
          "maskedKo": "우린 다시 (      ) 수 있을 거예요.",
          "maskedWord": "만날",
          "options": [
            "만날",
            "떠날",
            "잊을",
            "멈출"
          ],
          "hint": "动词：“相见/相遇”（만나다）。"
        }
      }
    ]
  },
  {
    "id": "drama-hospital-playlist",
    "dramaTitle": "机智的医生生活",
    "koreanDramaTitle": "슬기로운 의사생활",
    "category": "国民口碑神剧",
    "genre": "温情治愈 / 职场群像",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "五人帮雨夜吃烤肉：“吃顿热腾腾的饭，就是最好的治愈”",
    "episode": "第 1 季 经典名场面",
    "durationSeconds": 35,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-800 via-orange-950 to-black",
    "isFreePreview": true,
    "summary": "律帝医院五人帮在忙碌一天后聚在小馆子里吃烤肉，互相调侃打气的温馨名场面。",
    "culturalInsight": "在韩国文化中，“밥 먹자（一起吃饭吧）”不仅是问候，更是最真挚深厚的情感维系与治愈剂。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "이익준 (李翊晙)",
        "role": "肝胆胰外科教授",
        "avatarColor": "bg-blue-600",
        "ko": "오늘 하루도 수고 많았다. 맛있는 거 많이 먹고 힘내자!",
        "zh": "今天一天大家也都辛苦了。多吃点好吃的，加把劲！",
        "roman": "Oneul harudo sugo manatda. Masinneun geo mani meokgo himnaeja!",
        "timeSec": 0,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "수고하다",
            "meaning": "辛苦 / 付出辛劳"
          },
          {
            "word": "힘내다",
            "meaning": "加油 / 振作"
          }
        ],
        "grammarNotes": "动词 + -자 (非敬语共动句尾：我们一起...吧)",
        "clozeQuestion": {
          "maskedKo": "오늘 하루도 (      ) 많았다.",
          "maskedWord": "수고",
          "options": [
            "수고",
            "생각",
            "걱정",
            "시간"
          ],
          "hint": "经典职场致谢词：“辛苦”（수고）。"
        }
      },
      {
        "id": 2,
        "speaker": "채송화 (蔡颂和)",
        "role": "神经外科教授",
        "avatarColor": "bg-emerald-600",
        "ko": "그래, 별일 아니야. 내일은 내일의 태양이 뜰 테니까.",
        "zh": "是啊，没什么大不了的。明天的太阳照样会升起。",
        "roman": "Geurae, byeoril aniya. Naeireun naeirui taeyangi tteul tenikka.",
        "timeSec": 5,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "별일 아니다",
            "meaning": "没什么大不了"
          },
          {
            "word": "태양",
            "meaning": "太阳"
          }
        ],
        "grammarNotes": "名词 + 이/가 아니다 (否定判断：不是...)",
        "clozeQuestion": {
          "maskedKo": "그래, (      ) 아니야. 힘내!",
          "maskedWord": "별일",
          "options": [
            "별일",
            "큰일",
            "비밀",
            "숙제"
          ],
          "hint": "惯用短语：“不是什么大事”（별일 아니다）。"
        }
      }
    ]
  },
  {
    "id": "drama-hotel-del-luna",
    "dramaTitle": "德鲁纳酒店",
    "koreanDramaTitle": "호텔 델루나",
    "category": "高能高光名场面",
    "genre": "奇幻霸气 / 宿命救赎",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "张满月霸气持枪护夫：“动我的人，你做好付出代价的准备了吗”",
    "episode": "第 8 集 高光名场面",
    "durationSeconds": 36,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-violet-950 via-purple-900 to-black",
    "isFreePreview": true,
    "summary": "张满月社长（IU 李知恩 饰）身着华丽复古长裙霸气登场，为保护具灿星（吕珍九 饰）展开凌厉反击的高能场面。",
    "culturalInsight": "张满月标志性的傲娇霸气敬语体系（-시오 / -ㅂ니다 结合居高临下的语气）极具女王风范。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "장만월 (张满月)",
        "role": "酒店社长",
        "avatarColor": "bg-purple-600",
        "ko": "내 호텔 직원 건드리지 마. 내가 너를 가만두지 않을 테니까.",
        "zh": "别碰我的酒店员工。否则我绝对不会放过你。",
        "roman": "Nae hotel jikwon geondeuriji ma. Naega neoreul gamanduji aneul tenikka.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "건드리다",
            "meaning": "招惹 / 触碰"
          },
          {
            "word": "가만두다",
            "meaning": "放过 / 饶恕"
          }
        ],
        "grammarNotes": "动词 + -지 않다 (长否定式：不...) + -(으)ㄹ 테니까 (警告语气)",
        "clozeQuestion": {
          "maskedKo": "내 호텔 직원 (      ) 마.",
          "maskedWord": "건드리지",
          "options": [
            "건드리지",
            "바라보지",
            "칭찬하지",
            "기다리지"
          ],
          "hint": "动词：“招惹触碰”（건드리다）。"
        }
      }
    ]
  },
  {
    "id": "drama-my-liberation-notes",
    "dramaTitle": "我的解放日志",
    "koreanDramaTitle": "나의 해방일지",
    "category": "国民口碑神剧",
    "genre": "现实主义 / 深度救赎",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "廉美贞对具氏直球要求：“不要只说喜欢我，崇拜我吧”",
    "episode": "第 2 集 封神名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-950 via-stone-900 to-black",
    "isFreePreview": true,
    "summary": "廉美贞（金智媛 饰）在夕阳下的乡间小路向神秘沉默的具氏（孙锡久 饰）提出“추앙해요（崇拜我吧）”的震撼告白。",
    "culturalInsight": "“추앙하다（崇拜/推崇）”原本是古老庄严的书面语，本剧中用于男女关系，表达了超越世俗爱情的无条件支持与心灵填满。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "염미정 (廉美贞)",
        "role": "女主角",
        "avatarColor": "bg-amber-600",
        "ko": "사랑으론 안 돼. 날 추앙해요. 난 한 번도 채워진 적이 없어.",
        "zh": "光是爱还不够。崇拜我吧。我这一生，从未曾被填满过。",
        "roman": "Sarang-euron an dwae. Nal chuanghaeyo. Nan han beondo chaewojin jeogi eopseo.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "추앙하다",
            "meaning": "崇拜 / 推崇"
          },
          {
            "word": "채워지다",
            "meaning": "被填满 / 得到充实"
          }
        ],
        "grammarNotes": "-(으)ㄴ 적이 없다 (经验否定：从未经历过做某事)",
        "clozeQuestion": {
          "maskedKo": "사랑으론 안 돼. 날 (      )해요.",
          "maskedWord": "추앙",
          "options": [
            "추앙",
            "사랑",
            "칭찬",
            "기억"
          ],
          "hint": "全剧核心高光词：“崇拜”（추앙）。"
        }
      },
      {
        "id": 2,
        "speaker": "구씨 (具氏)",
        "role": "男主角",
        "avatarColor": "bg-stone-700",
        "ko": "봄이 오면, 너도 나도 다른 사람이 되어 있을 거야.",
        "zh": "等春天来了，你和我，都会变成全新的人。",
        "roman": "Bomi omyeon, neodo nado dareun sarami doeeo isseul geoya.",
        "timeSec": 6,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "봄",
            "meaning": "春天"
          },
          {
            "word": "되어 있다",
            "meaning": "处于...的状态"
          }
        ],
        "grammarNotes": "-(으)면 (条件句：当...的时候) + -아/어 있다 (持续状态)",
        "clozeQuestion": {
          "maskedKo": "(      )이 오면, 너도 나도 다른 사람이 되어 있을 거야.",
          "maskedWord": "봄",
          "options": [
            "봄",
            "겨울",
            "가을",
            "여름"
          ],
          "hint": "季节名词：“春天”（봄）。"
        }
      }
    ]
  },
  {
    "id": "drama-the-heirs",
    "dramaTitle": "继承者们",
    "koreanDramaTitle": "상속자들",
    "category": "顶流心动爱情",
    "genre": "财阀校园 / 顶流高甜",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "电影院昏暗灯光告白：“我，可能喜欢上你了吗？”",
    "episode": "第 2 集 名场面",
    "durationSeconds": 32,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-blue-950 via-indigo-950 to-black",
    "isFreePreview": true,
    "summary": "金叹（李敏镐 饰）在电影院里凝视车恩尚（朴信惠 饰），问出风靡全网的经典名句“혹시 나 너 좋아하냐?”。",
    "culturalInsight": "金编剧独创的疑问式告白句法“혹시 나 너 좋아하냐?”以反问自己来表达傲娇且无法自拔的心动。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "김탄 (金叹)",
        "role": "男主角",
        "avatarColor": "bg-blue-600",
        "ko": "혹시 나, 너 좋아하냐?",
        "zh": "我，难道可能喜欢上你了吗？",
        "roman": "Hoksi na, neo joahanya?",
        "timeSec": 0,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "혹시",
            "meaning": "或许 / 难道"
          },
          {
            "word": "좋아하다",
            "meaning": "喜欢"
          }
        ],
        "grammarNotes": "副词 혹시 (难道/可能) + -냐 (非敬语疑问句尾)",
        "clozeQuestion": {
          "maskedKo": "(      ) 나, 너 좋아하냐?",
          "maskedWord": "혹시",
          "options": [
            "혹시",
            "벌써",
            "다시",
            "절대"
          ],
          "hint": "语气副词：“难道/或许”（혹시）。"
        }
      }
    ]
  },
  {
    "id": "drama-my-love-from-the-star",
    "dramaTitle": "来自星星的你",
    "koreanDramaTitle": "별에서 온 그대",
    "category": "顶流心动爱情",
    "genre": "外星奇幻 / 顶流甜宠",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "雪夜超能力时间暂停之吻：“哪怕只有一瞬间，我也想守住你”",
    "episode": "第 11 集 名场面",
    "durationSeconds": 40,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-slate-950 via-cyan-950 to-black",
    "isFreePreview": true,
    "summary": "都敏俊（金秀贤 饰）使用超能力冻结漫天飞雪的时间，悄然走向千颂伊（全智贤 饰）留下深情一吻的传世名场面。",
    "culturalInsight": "韩剧中初雪（첫눈）象征着“任何谎言都会被原谅，所有真心都会实现”的唯美浪漫图腾。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "도민준 (都敏俊)",
        "role": "男主角",
        "avatarColor": "bg-cyan-700",
        "ko": "내가 너를 얼마나 사랑하는지, 너는 영원히 모를 거야.",
        "zh": "我究竟有多深爱着你，你可能永远也不会知道。",
        "roman": "Naega neoreul eolmana saranghaneunji, neoneun yeong-wonhi moreul geoya.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "얼마나",
            "meaning": "多么 / 几许"
          },
          {
            "word": "영원히",
            "meaning": "永远 / 永久"
          }
        ],
        "grammarNotes": "疑问副词 + -는지 (间接疑问句接续：究竟多么...)",
        "clozeQuestion": {
          "maskedKo": "내가 너를 얼마나 사랑하는지, 너는 (      ) 모를 거야.",
          "maskedWord": "영원히",
          "options": [
            "영원히",
            "천천히",
            "조용히",
            "당장"
          ],
          "hint": "时间副词：“永远”（영원히）。"
        }
      }
    ]
  },
  {
    "id": "drama-be-melodramatic",
    "dramaTitle": "浪漫的体质",
    "koreanDramaTitle": "멜로가 체질",
    "category": "职场与社会实战",
    "genre": "毒舌治愈 / 三十岁群像",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "三十岁的人生和解：“抱抱现在的自己吧，你已经做得很好了”",
    "episode": "第 16 集 治愈名场面",
    "durationSeconds": 36,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-rose-950 via-orange-950 to-black",
    "isFreePreview": true,
    "summary": "三个同居的三十岁都市女性在餐桌前举杯谈心，用毒舌而温暖的台词击中当代成年人的心酸与释怀。",
    "culturalInsight": "“수고했어（辛苦了/干得漂亮）”是韩国职场与日常生活中给予他人情绪价值最高频的词汇。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "임진주 (林真珠)",
        "role": "电视剧编剧",
        "avatarColor": "bg-rose-500",
        "ko": "그냥 오늘을 잘 버틴 나 자신에게 박수를 보내주자.",
        "zh": "就为今天也好好撑过来的自己，送上一份掌声吧。",
        "roman": "Geunyang oneureul jal beotin na jasinege baksureul bonaejuja.",
        "timeSec": 0,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "버티다",
            "meaning": "坚撑 / 挺住"
          },
          {
            "word": "박수",
            "meaning": "掌声 / 拍手"
          }
        ],
        "grammarNotes": "动词 + -아/어 주다 (为某人做某事) + -자 (共动句尾)",
        "clozeQuestion": {
          "maskedKo": "그냥 오늘을 잘 (      ) 나 자신에게 박수를 보내주자.",
          "maskedWord": "버틴",
          "options": [
            "버틴",
            "떠난",
            "웃은",
            "달린"
          ],
          "hint": "动词过去定语：“坚持挺住”（버티다）。"
        }
      }
    ]
  },
  {
    "id": "drama-attorney-woo",
    "dramaTitle": "非常律师禹英禑",
    "koreanDramaTitle": "이상한 변호사 우영우",
    "category": "国民口碑神剧",
    "genre": "律政职场 / 暖心成长",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "禹英禑标志性倒装自我介绍：“正着念倒着念都一样的禹英禑”",
    "episode": "第 1 集 招牌名场面",
    "durationSeconds": 30,
    "posterUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-blue-900 via-sky-950 to-black",
    "isFreePreview": true,
    "summary": "患有自闭症谱系障碍的天才新人律师禹英禑（朴恩斌 饰）初入大型律所时纯真可爱的经典自我介绍。",
    "culturalInsight": "韩语中的“회문（回文/倒读词）”如 기러기、토마토、스위스 等发音工整且富有趣味性。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "우영우 (禹英禑)",
        "role": "新人律师",
        "avatarColor": "bg-sky-500",
        "ko": "제 이름은 똑바로 읽어도 거꾸로 읽어도 우영우입니다. 기러기, 토마토, 스위스, 인도인, 별똥별, 우영우.",
        "zh": "我的名字不管是正着读还是倒着读都是禹英禑。野雁、西红柿、瑞士、印度人、流星、禹英禑。",
        "roman": "Je ireumeun ttokbaro ilgeodo geokkuro ilgeodo U Yeong-u-imnida.",
        "timeSec": 0,
        "durationSec": 6,
        "highlightWords": [
          {
            "word": "똑바로",
            "meaning": "笔直地 / 正向地"
          },
          {
            "word": "거꾸로",
            "meaning": "倒着 / 逆向地"
          }
        ],
        "grammarNotes": "动词 + -아/어도 (让步连词：即使...也...)",
        "clozeQuestion": {
          "maskedKo": "제 이름은 똑바로 읽어도 (      ) 읽어도 우영우입니다.",
          "maskedWord": "거꾸로",
          "options": [
            "거꾸로",
            "천천히",
            "크게",
            "다시"
          ],
          "hint": "副词：“倒着/反向”（거꾸로）。"
        }
      }
    ]
  },
  {
    "id": "drama-twenty-five-twenty-one",
    "dramaTitle": "二十五，二十一",
    "koreanDramaTitle": "스물다섯 스물하나",
    "category": "顶流心动爱情",
    "genre": "青春热血 / 时代初恋",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "隧道口的青春奔跑告白：“无论你在哪里，我的应援都会抵达”",
    "episode": "第 9 集 名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-950 via-red-950 to-black",
    "isFreePreview": true,
    "summary": "击剑少女罗希度（金泰梨 饰）与记者白易辰（南柱赫 饰）在时代变迁中互相照亮、彼此成就的青春绝美告白。",
    "culturalInsight": "“응원（应援/加油）”在韩国青年文化中象征着给予对方无条件信任与精神力量的崇高仪式。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "백이진 (白易辰)",
        "role": "男主角",
        "avatarColor": "bg-red-700",
        "ko": "네가 어디에 있든, 내 응원이 닿게 할게. 내가 가서 닿을게.",
        "zh": "无论你在哪里，我都会让我的应援传达给你。我会奔向你，直到触及你。",
        "roman": "Nega eodie itdeun, nae eung-woni datge halge. Naega gaseo daeulge.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "응원",
            "meaning": "应援 / 支持"
          },
          {
            "word": "닿다",
            "meaning": "到达 / 触及"
          }
        ],
        "grammarNotes": "疑问词 + -든(지) (无论...都) + -게 하다 (使动用法：使之...)",
        "clozeQuestion": {
          "maskedKo": "네가 어디에 있든, 내 (      )이 닿게 할게.",
          "maskedWord": "응원",
          "options": [
            "응원",
            "선물",
            "편지",
            "눈물"
          ],
          "hint": "名词：“应援支持”（응원）。"
        }
      }
    ]
  },
  {
    "id": "drama-itaewon-class",
    "dramaTitle": "梨泰院CLASS",
    "koreanDramaTitle": "이태원 클라쓰",
    "category": "高能高光名场面",
    "genre": "热血创业 / 霸气反击",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "朴世路绝不妥协宣言：“我的生活由我做主，我的价值由我决定”",
    "episode": "第 3 集 高光名场面",
    "durationSeconds": 36,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-orange-950 via-zinc-950 to-black",
    "isFreePreview": true,
    "summary": "朴世路（朴叙俊 饰）在强权资本压迫面前绝不下跪妥协，誓言在梨泰院开创属于自己的甜夜商业帝国。",
    "culturalInsight": "“소신（信念/操守）”体现了韩国青年文化中绝不对不公与权贵低头的倔强与执着。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "박새로이 (朴世路)",
        "role": "男主角",
        "avatarColor": "bg-orange-600",
        "ko": "내 가치를 네가 매기지 마. 내 인생은 이제 시작이고, 난 원하는 거 다 이룰 거야.",
        "zh": "我的价值不用你来评估。我的人生才刚开始，我想要的一切我都会实现。",
        "roman": "Nae gachireul nega maegiji ma. Nae insaeng-eun ije sijagigo, nan wonhaneun geo da irul geoya.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "가치",
            "meaning": "价值"
          },
          {
            "word": "매기다",
            "meaning": "评估 / 标价"
          },
          {
            "word": "이루다",
            "meaning": "实现 / 达成"
          }
        ],
        "grammarNotes": "动词 + -지 마 (禁止祈使) + -(으)ㄹ 거야 (坚定意志将来时)",
        "clozeQuestion": {
          "maskedKo": "내 (      )를 네가 매기지 마.",
          "maskedWord": "가치",
          "options": [
            "가치",
            "시간",
            "얼굴",
            "친구"
          ],
          "hint": "抽象名词：“价值”（가치）。"
        }
      }
    ]
  },
  {
    "id": "drama-misaeng",
    "dramaTitle": "未生",
    "koreanDramaTitle": "미생",
    "category": "职场与社会实战",
    "genre": "真实职场 / 社畜共鸣",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "吴次长对新人的职场开解：“撑下去，那就是通往完全胜利的路”",
    "episode": "第 4 集 经典名场面",
    "durationSeconds": 40,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-blue-950 via-slate-900 to-black",
    "isFreePreview": true,
    "summary": "贸易综合商社实习生张克莱（任时完 饰）在职场迷茫之际，吴次长用围棋哲理解释职场生存法则的封神对白。",
    "culturalInsight": "“미생（未生）”是围棋术语，指棋子尚未完全活定，但只要坚持下下去，每一步都蕴藏着扭转生机的无限可能。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "오상식 (吴相植)",
        "role": "次长",
        "avatarColor": "bg-slate-700",
        "ko": "버틴다는 건, 어떻게든 완생으로 나아간다는 뜻이야.",
        "zh": "坚持撑下去，就意味着无论如何都在向着“完全活透”的人生迈进。",
        "roman": "Beotindaneun geon, eotteokedeun wansaeng-euro na-agandaneun tteusiya.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "버티다",
            "meaning": "坚持 / 撑住"
          },
          {
            "word": "완생",
            "meaning": "完生 / 活透"
          }
        ],
        "grammarNotes": "动词 + -ㄴ/는다는 것은 (间接引用名词化：所谓做某事就是...)",
        "clozeQuestion": {
          "maskedKo": "(      )다는 건, 어떻게든 완생으로 나아간다는 뜻이야.",
          "maskedWord": "버틴",
          "options": [
            "버틴",
            "도망친",
            "포기한",
            "잊은"
          ],
          "hint": "核心动词：“坚持挺住”（버티다）。"
        }
      }
    ]
  },
  {
    "id": "drama-descendants-of-the-sun",
    "dramaTitle": "太阳的后裔",
    "koreanDramaTitle": "태양의 후예",
    "category": "顶流心动爱情",
    "genre": "军旅深情 / 战地浪漫",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "电影院里的心动试探：“我出生以来现在最心动”",
    "episode": "第 4 集 名场面",
    "durationSeconds": 45,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-orange-800 via-stone-900 to-black",
    "isFreePreview": true,
    "summary": "柳时镇与姜暮烟在电影院熄灯前的经典心动对话，全网播放量破亿的名场面。",
    "culturalInsight": "韩语中使用 -기 바로 전 (恰好在...之前) 生动刻画了心跳加速的微妙心理时机。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "유시진 (柳时镇)",
        "role": "男主角",
        "avatarColor": "bg-teal-600",
        "ko": "난 태어나서 지금이 제일 설레요. 미인이랑 같이 있는데 불 꺼지기 바로 전.",
        "zh": "我打出生以来现在最心动了。和美人坐在一起，电影院熄灯前的这一刻。",
        "roman": "Nan taeonaseo jigeumi jeil seolleyo. Mi-in-irang gachi inneunde bul kkeojigi baro jeon.",
        "timeSec": 1,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "설레다",
            "meaning": "心动 / 悸动"
          },
          {
            "word": "미인",
            "meaning": "美人 / 美女"
          },
          {
            "word": "불 꺼지다",
            "meaning": "熄灯 / 灭灯"
          }
        ],
        "grammarNotes": "动词 + -기 바로 전 (在做某事恰好之前的一刻)",
        "clozeQuestion": {
          "maskedKo": "난 태어나서 지금이 제일 (      ). 미인이랑 같이 있는데 불 꺼지기 바로 전.",
          "maskedWord": "설레요",
          "options": [
            "설레요",
            "슬퍼요",
            "무서워요",
            "추워요"
          ],
          "hint": "形容词“心动悸动”（설레다）。"
        }
      },
      {
        "id": 2,
        "speaker": "강모연 (姜暮烟)",
        "role": "女主角",
        "avatarColor": "bg-rose-500",
        "ko": "노인과 미인과 아이는 보호해야 한다는 게 내 원칙이라서요.",
        "zh": "保护老人、美女和小孩是我的原则。",
        "roman": "No-in-gwa mi-in-gwa a-ineun bohohaeya handaneun ge nae wonchigiraseoyo.",
        "timeSec": 7,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "보호하다",
            "meaning": "保护"
          },
          {
            "word": "원칙",
            "meaning": "原则"
          }
        ],
        "grammarNotes": "-해야 한다는 것 (必须做某事的规定引用)",
        "clozeQuestion": {
          "maskedKo": "노인과 미인과 아이는 (      ) 한다는 게 내 원칙이라서요.",
          "maskedWord": "보호해야",
          "options": [
            "보호해야",
            "무시해야",
            "기다려야",
            "떠나야"
          ],
          "hint": "动词“保护”（보호하다）。"
        }
      }
    ]
  },
  {
    "id": "drama-reply-1988",
    "dramaTitle": "请回答 1988",
    "koreanDramaTitle": "응답하라 1988",
    "category": "国民口碑神剧",
    "genre": "青春治愈 / 邻里温暖",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "双门洞胡同雨夜守护：“给你伞，早点回家”",
    "episode": "第 3 集 温情名场面",
    "durationSeconds": 45,
    "posterUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-700 via-orange-800 to-stone-900",
    "isFreePreview": true,
    "summary": "双门洞胡同深夜，正焕在雨夜的胡同口默默等候并递上一把伞的经典心动场面。",
    "culturalInsight": "在韩国文化中，在胡同口“默默等候并递一把伞”是极具代表性的青涩心动表达方式。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "성덕선 (成德善)",
        "role": "女主角",
        "avatarColor": "bg-orange-500",
        "ko": "야, 김정환! 너 여기서 뭐 하냐?",
        "zh": "喂，金正焕！你在这儿干嘛呢？",
        "roman": "Ya, Kim Jeong-hwan! Neo yeogiseo mwo hanya?",
        "timeSec": 1,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "야",
            "meaning": "喂（同辈呼唤）"
          },
          {
            "word": "여기서",
            "meaning": "在这儿"
          },
          {
            "word": "뭐 하냐",
            "meaning": "干嘛呢"
          }
        ],
        "grammarNotes": "疑问代词 + -냐 (同龄同辈间的非敬语疑问句尾)",
        "clozeQuestion": {
          "maskedKo": "야, 김정환! 너 (      ) 뭐 하냐?",
          "maskedWord": "여기서",
          "options": [
            "여기서",
            "집에서",
            "학교에서",
            "가게에서"
          ],
          "hint": "指代当前站立的胡同位置。"
        }
      },
      {
        "id": 2,
        "speaker": "김정환 (金正焕)",
        "role": "男主角",
        "avatarColor": "bg-blue-600",
        "ko": "너 주려고. 일찍 다녀.",
        "zh": "给你伞的。以后早点回家。",
        "roman": "Neo juryeogo. Iljjik danyeo.",
        "timeSec": 6,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "주려고",
            "meaning": "为了给你"
          },
          {
            "word": "일찍",
            "meaning": "早点"
          }
        ],
        "grammarNotes": "-(으)려고 (动词接续：表示意图目的)",
        "clozeQuestion": {
          "maskedKo": "너 주려고. (      ) 다녀.",
          "maskedWord": "일찍",
          "options": [
            "일찍",
            "늦게",
            "혼자",
            "천천히"
          ],
          "hint": "叮嘱不要太晚回家。"
        }
      }
    ]
  },
  {
    "id": "drama-the-glory",
    "dramaTitle": "黑暗荣耀",
    "koreanDramaTitle": "더 글로리",
    "category": "高能高光名场面",
    "genre": "高能复仇 / 霸气反击",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "体育馆鼓掌：“妍珍啊，你真帅气！”",
    "episode": "第 1 季 经典高光",
    "durationSeconds": 40,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-stone-950 via-slate-900 to-black",
    "isFreePreview": true,
    "summary": "文东恩在体育馆校友表彰大会上为朴妍珍鼓掌并展开终极复仇宣战的名场面。",
    "culturalInsight": "全剧贯穿的“연진아 (妍珍啊)”呼格在看似平静中蕴含着极强的情绪爆发力。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "문동은 (文东恩)",
        "role": "女主角",
        "avatarColor": "bg-slate-900",
        "ko": "멋지다, 연진아! 브라보! 박연진, 멋있다!",
        "zh": "真棒啊，妍珍！太精彩了！朴妍珍，真帅气啊！",
        "roman": "Meotjida, Yeonjin-a! Beurabo! Bak Yeon-jin, meositda!",
        "timeSec": 1,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "멋지다 / 멋있다",
            "meaning": "帅气、精彩"
          },
          {
            "word": "-아/야",
            "meaning": "呼格助词"
          }
        ],
        "grammarNotes": "形容词基本阶感叹句尾 -다 (在此处表达反讽赞叹)",
        "clozeQuestion": {
          "maskedKo": "(      ), 연진아! 브라보! 박연진, 멋있다!",
          "maskedWord": "멋지다",
          "options": [
            "멋지다",
            "예쁘다",
            "슬프다",
            "무섭다"
          ],
          "hint": "反讽经典名句：“真精彩/真帅气”（멋지다）。"
        }
      }
    ]
  },
  {
    "id": "drama-lovely-runner-face",
    "dramaTitle": "背着善宰跑",
    "koreanDramaTitle": "선재 업고 튀어",
    "category": "顶流心动爱情",
    "genre": "奇幻穿越 / 救赎高甜",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "cardIndex": 0,
    "sceneTitle": "善宰撑伞名场面：“下着雪呢，一起撑这把伞吧”",
    "episode": "第 1 集 高甜名场面",
    "durationSeconds": 32,
    "videoUrl": "/videos/lovely_runner_01.mp4",
    "posterUrl": "/images/frame_0825.jpg",
    "stillUrl": "/images/frame_0825.jpg",
    "bgGradient": "from-purple-900 via-indigo-950 to-black",
    "isFreePreview": true,
    "summary": "任率刚回到过去，在大雪中善宰为小率撑起黄伞的宿命相遇。",
    "culturalInsight": "“우산(雨伞)”在韩语浪漫语境中是象征“守护与心动”的核心意象。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "류선재 (柳善宰)",
        "role": "男主角",
        "avatarColor": "bg-blue-600",
        "ko": "눈 오는데 왜 혼자 이러고 있어? 우산 같이 쓰자.",
        "zh": "下着雪呢怎么一个人在这儿？一起撑这把伞吧。",
        "roman": "Nun oneunde wae honja ireogo isseo? Usan gachi sseuja.",
        "timeSec": 1,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "눈 오다",
            "meaning": "下雪"
          },
          {
            "word": "우산",
            "meaning": "雨伞"
          },
          {
            "word": "쓰다",
            "meaning": "撑伞/使用"
          }
        ],
        "grammarNotes": "动词 + -는데 (转折背景) + -자 (共动句尾：我们一起...吧)",
        "clozeQuestion": {
          "maskedKo": "눈 오는데 왜 혼자 이러고 있어? (      ) 같이 쓰자.",
          "maskedWord": "우산",
          "options": [
            "우산",
            "모자",
            "장갑",
            "가방"
          ],
          "hint": "名词：“雨伞”（우산）。"
        }
      }
    ]
  },
  {
    "id": "drama-weightlifting-fairy",
    "dramaTitle": "举重妖精金福珠",
    "koreanDramaTitle": "역도요정 김복주",
    "category": "顶流心动爱情",
    "genre": "青春校园 / 直球心动",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "经典撩妹开场白：“请问，你喜欢梅西吗？”",
    "episode": "第 1 集 名场面",
    "durationSeconds": 30,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-pink-950 via-rose-950 to-black",
    "isFreePreview": true,
    "summary": "兰熙传授给金福珠（李圣经 饰）的风靡全网直球撩汉名言：“搭讪男生一定要问他喜不喜欢梅西”。",
    "culturalInsight": "“메시 좋아하세요?（喜欢梅西吗）”已成为韩国年轻一代网络社交与破冰交友的标志性流行语。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "김복주 (金福珠)",
        "role": "女主角",
        "avatarColor": "bg-pink-500",
        "ko": "혹시... 메시 좋아하세요?",
        "zh": "请问... 你喜欢梅西吗？",
        "roman": "Hoksi... Mesi joahaseyo?",
        "timeSec": 0,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "혹시",
            "meaning": "或许 / 请问"
          },
          {
            "word": "좋아하다",
            "meaning": "喜欢"
          }
        ],
        "grammarNotes": "副词 혹시 (委婉客气搭话) + -(으)세요 (敬语疑问)",
        "clozeQuestion": {
          "maskedKo": "혹시... 메시 (      )?",
          "maskedWord": "좋아하세요",
          "options": [
            "좋아하세요",
            "싫어하세요",
            "아세요",
            "보세요"
          ],
          "hint": "动词敬语：“喜欢吗”（좋아하다）。"
        }
      }
    ]
  },
  {
    "id": "drama-strong-woman",
    "dramaTitle": "大力女子都奉顺",
    "koreanDramaTitle": "힘쎈여자 도봉순",
    "category": "顶流心动爱情",
    "genre": "奇幻甜宠 / 直球告白",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "安代表真挚直球：“能不能也喜欢我一下？我就站在你眼前”",
    "episode": "第 12 集 高甜名场面",
    "durationSeconds": 35,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-pink-900 via-purple-950 to-black",
    "isFreePreview": true,
    "summary": "安敏赫（朴炯植 饰）向都奉顺（朴宝英 饰）坦白暗恋心事，温柔请求她将视线转向自己的高甜瞬间。",
    "culturalInsight": "“나 좀 봐줘（看看我吧）”在韩语中是极具撒娇与深情恳切意味的双重表达。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "안민혁 (安敏赫)",
        "role": "男主角",
        "avatarColor": "bg-indigo-600",
        "ko": "짝사랑 빨리 끝내. 그리고 나 좀 좋아해 줘.",
        "zh": "赶紧结束你的单恋吧。然后，也试着喜欢喜欢我吧。",
        "roman": "Jjaksarang ppalli kkeunnae. Geurigo na jom joahae jwo.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "짝사랑",
            "meaning": "单恋 / 暗恋"
          },
          {
            "word": "끝내다",
            "meaning": "结束 / 告终"
          }
        ],
        "grammarNotes": "副词 빨리 (快点) + -아/어 주达 (为我做某事)",
        "clozeQuestion": {
          "maskedKo": "(      ) 빨리 끝내. 그리고 나 좀 좋아해 줘.",
          "maskedWord": "짝사랑",
          "options": [
            "짝사랑",
            "첫사랑",
            "비밀",
            "숙제"
          ],
          "hint": "名词：“暗恋单恋”（짝사랑）。"
        }
      }
    ]
  },
  {
    "id": "drama-fight-for-my-way",
    "dramaTitle": "三流之路",
    "koreanDramaTitle": "쌈 마이웨이",
    "category": "国民口碑神剧",
    "genre": "青梅竹马 / 爆笑治愈",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "崔爱拉经典撒娇名场面：“爱拉不是装漂亮，是天生就漂亮”",
    "episode": "第 3 集 封神名场面",
    "durationSeconds": 32,
    "posterUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-900 via-rose-950 to-black",
    "isFreePreview": true,
    "summary": "崔爱拉（金智媛 饰）用第三人称可爱撒娇回击高东万（朴叙俊 饰），引发全韩国模仿热潮的传奇名场面。",
    "culturalInsight": "韩语中用自己的名字代替“我（나/저）”来说话是典型的“애교（撒娇）”句式，语气可爱甜美。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "최애라 (崔爱拉)",
        "role": "女主角",
        "avatarColor": "bg-rose-500",
        "ko": "애라는 예쁜 척하는 게 아니라, 그냥 예쁘게 태어난 곤데!",
        "zh": "爱拉才不是故意装漂亮呢，明明是天生就长得这么漂亮嘛！",
        "roman": "Aera-neun yeppeun cheokhaneun ge anira, geunyang yeppeuge taeonan gonde!",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "-는 척하다",
            "meaning": "假装 / 装作"
          },
          {
            "word": "태어나다",
            "meaning": "出生 / 天生"
          }
        ],
        "grammarNotes": "形容词 + -(으)ㄴ 척하다 (假装...样子) + -ㄴ 게 아니라 (不是A而是B)",
        "clozeQuestion": {
          "maskedKo": "애라는 예쁜 (      ) 게 아니라, 그냥 예쁘게 태어난 곤데!",
          "maskedWord": "척하는",
          "options": [
            "척하는",
            "말하는",
            "보는",
            "사는"
          ],
          "hint": "语法：“假装装作”（-는 척하다）。"
        }
      }
    ]
  },
  {
    "id": "drama-our-beloved-summer",
    "dramaTitle": "那年，我们的夏天",
    "koreanDramaTitle": "그 해 우리는",
    "category": "顶流心动爱情",
    "genre": "初恋重逢 / 细腻酸甜",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "雨中小屋真心坦白：“只要你回头，我就会一直在”",
    "episode": "第 11 集 名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-emerald-950 via-teal-950 to-black",
    "isFreePreview": true,
    "summary": "崔雄（崔宇植 饰）与国延秀（金多美 饰）在雨后的小酒馆重新敞开心扉，解开跨越十年的误会与深情。",
    "culturalInsight": "“다시 사랑하자（我们重新相爱吧）”表达了韩国年轻人对于珍视之人破镜重圆的真挚渴望。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "최웅 (崔雄)",
        "role": "男主角",
        "avatarColor": "bg-emerald-700",
        "ko": "내가 계속 돌아올 테니까, 너는 그냥 거기 있어 주기만 해.",
        "zh": "我会一直回到你身边的，所以你只要留在那里等我就好。",
        "roman": "Naega gyesok doraol tenikka, neoneun geunyang geogi isseo jugiman hae.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "계속",
            "meaning": "继续 / 一直"
          },
          {
            "word": "돌아오다",
            "meaning": "回来 / 归来"
          }
        ],
        "grammarNotes": "-(으)ㄹ 테니까 (表承诺意图) + -기만 하다 (只要做某事就行)",
        "clozeQuestion": {
          "maskedKo": "내가 (      ) 돌아올 테니까, 너는 그냥 거기 있어 줘.",
          "maskedWord": "계속",
          "options": [
            "계속",
            "가끔",
            "절대",
            "일찍"
          ],
          "hint": "副词：“一直/不断”（계속）。"
        }
      }
    ]
  },
  {
    "id": "drama-stranger",
    "dramaTitle": "秘密森林",
    "koreanDramaTitle": "비밀의 숲",
    "category": "高能高光名场面",
    "genre": "悬疑律政 / 极致反腐",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "黄始木检察官法庭陈词：“沉默只会让黑暗继续滋生”",
    "episode": "第 16 集 封神名场面",
    "durationSeconds": 40,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-slate-950 via-zinc-900 to-black",
    "isFreePreview": true,
    "summary": "失去情感感知的模范检察官黄始木（曹承佑 饰）在发布会上揭露腐败内幕的震撼独白。",
    "culturalInsight": "“침묵（沉默）”在韩国司法与社会批判作品中，常被作为纵容体制不公的象征。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "황시목 (黄始木)",
        "role": "检察官",
        "avatarColor": "bg-slate-800",
        "ko": "침묵하는 자는 모두 공범입니다. 진실은 결코 사라지지 않습니다.",
        "zh": "保持沉默的人皆为共犯。真相永远不会泯灭。",
        "roman": "Chimmukhaneun janeun modu gongbeom-imnida. Jinsireun gyeolko sarajiji anseumnida.",
        "timeSec": 0,
        "durationSec": 6,
        "highlightWords": [
          {
            "word": "침묵하다",
            "meaning": "沉默"
          },
          {
            "word": "공범",
            "meaning": "共犯"
          },
          {
            "word": "결코",
            "meaning": "决然 / 绝对"
          }
        ],
        "grammarNotes": "动词 + -는 자 (定语从句：...的人) + 결코 ... -지 않다 (绝不...)",
        "clozeQuestion": {
          "maskedKo": "(      )하는 자는 모두 공범입니다.",
          "maskedWord": "침묵",
          "options": [
            "침묵",
            "노력",
            "기도",
            "용서"
          ],
          "hint": "汉字词：“沉默”（침묵）。"
        }
      }
    ]
  },
  {
    "id": "drama-signal",
    "dramaTitle": "Signal 信号",
    "koreanDramaTitle": "시그널",
    "category": "高能高光名场面",
    "genre": "时空悬疑 / 正义执念",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "跨时空对讲机呼叫：“过去是可以改变的，只要绝不放弃”",
    "episode": "第 1 集 名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-zinc-950 via-neutral-900 to-black",
    "isFreePreview": true,
    "summary": "李材韩刑警（赵震雄 饰）通过古旧对讲机向未来传达坚定信念，跨越数十年的正义回响。",
    "culturalInsight": "“포기하지 않는다（绝不放弃）”是韩国刑侦与励志剧中最具感染力的精神内核。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "이재한 (李材韩)",
        "role": "刑警",
        "avatarColor": "bg-amber-800",
        "ko": "포기하지 않으면 됩니다. 포기하지 않으면 희망은 있어요.",
        "zh": "只要不放弃就行。只要不放弃，希望就一直都在。",
        "roman": "Pogihaji aneumyeon doemnida. Pogihaji aneumyeon huimang-eun isseoyo.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "포기하다",
            "meaning": "放弃"
          },
          {
            "word": "희망",
            "meaning": "希望"
          }
        ],
        "grammarNotes": "-지 않으면 되다 (只要不...就行) + -(으)면 (条件句)",
        "clozeQuestion": {
          "maskedKo": "포기하지 않으면 (      )은 있어요.",
          "maskedWord": "희망",
          "options": [
            "희망",
            "걱정",
            "위험",
            "시간"
          ],
          "hint": "名词：“希望”（희망）。"
        }
      }
    ]
  },
  {
    "id": "drama-masters-sun",
    "dramaTitle": "主君的太阳",
    "koreanDramaTitle": "주군의 태양",
    "category": "顶流心动爱情",
    "genre": "惊悚浪漫 / 傲娇霸总",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "朱中元张开双臂护妻：“你的专属防空洞来了，躲进来吧”",
    "episode": "第 7 集 高甜名场面",
    "durationSeconds": 35,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-950 via-yellow-950 to-black",
    "isFreePreview": true,
    "summary": "朱中元社长（苏志燮 饰）在太恭实（孔晓振 饰）被恐惧包围时，一把将她拉入怀中充当“防空洞”的经典名场面。",
    "culturalInsight": "“방공호（防空洞）”比喻在危难与恐惧中提供绝对安全感的避风港。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "주중원 (朱中元)",
        "role": "社长",
        "avatarColor": "bg-amber-700",
        "ko": "방공호 왔다. 숨어.",
        "zh": "防空洞来了。躲进来吧。",
        "roman": "Banggongho watda. Sumeo.",
        "timeSec": 0,
        "durationSec": 3,
        "highlightWords": [
          {
            "word": "방공호",
            "meaning": "防空洞 / 避难所"
          },
          {
            "word": "숨다",
            "meaning": "隐藏 / 躲藏"
          }
        ],
        "grammarNotes": "动词 + 过去形 았다/었다 (口语简短宣告：...来了) + 命令形",
        "clozeQuestion": {
          "maskedKo": "(      ) 왔다. 숨어.",
          "maskedWord": "방공호",
          "options": [
            "방공호",
            "선물",
            "친구",
            "손님"
          ],
          "hint": "比喻名词：“防空洞”（방공호）。"
        }
      }
    ]
  },
  {
    "id": "drama-w-two-worlds",
    "dramaTitle": "W-两个世界",
    "koreanDramaTitle": "더블유",
    "category": "顶流心动爱情",
    "genre": "跨次元奇幻 / 烧脑悬疑",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "姜哲突破漫画次元告白：“你是我人生的钥匙”",
    "episode": "第 8 集 名场面",
    "durationSeconds": 36,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-blue-950 via-purple-950 to-black",
    "isFreePreview": true,
    "summary": "漫画男主角姜哲（李钟硕 饰）向现实世界的外科医生吴妍珠（韩孝周 饰）真情告白的名场面。",
    "culturalInsight": "“인생의 키（人生的钥匙）”代表解开宿命谜团与生命意义的核心存在。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "강철 (姜哲)",
        "role": "男主角",
        "avatarColor": "bg-blue-600",
        "ko": "당신이 내 인생의 유일한 키예요. 날 여기서 구해 줘요.",
        "zh": "你是我人生中唯一的钥匙。请将我从这里拯救出来吧。",
        "roman": "Dangsini nae insaeng-ui yuilhan kiyeyo. Nal yeogiseo guhae jwoyo.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "유일하다",
            "meaning": "唯一 / 仅有"
          },
          {
            "word": "구하다",
            "meaning": "拯救 / 救助"
          }
        ],
        "grammarNotes": "名词 + -(이)예요 (敬语判断：是...) + -아/어 주다 (为我做...)",
        "clozeQuestion": {
          "maskedKo": "당신이 내 인생의 (      ) 키예요.",
          "maskedWord": "유일한",
          "options": [
            "유일한",
            "특별한",
            "작은",
            "새로운"
          ],
          "hint": "冠形词：“唯一的”（유일하다）。"
        }
      }
    ]
  },
  {
    "id": "drama-its-okay-to-not-be-okay",
    "dramaTitle": "虽然是精神病但没关系",
    "koreanDramaTitle": "사이코지만 괜찮아",
    "category": "国民口碑神剧",
    "genre": "暗黑童话 / 相互救赎",
    "difficulty": "中级进阶 (TOPIK 3-4)",
    "levelTag": "中级",
    "sceneTitle": "蝴蝶拥抱法自我平复：“如果情绪失控，就这样轻轻拍拍自己”",
    "episode": "第 2 集 治愈名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-violet-950 via-stone-900 to-black",
    "isFreePreview": true,
    "summary": "精神病院护工文钢太（金秀贤 饰）教童话作家高文英（徐睿知 饰）使用“蝴蝶拥抱法（나비 포옹법）”抚平内心创伤的经典治愈名场面。",
    "culturalInsight": "“나비 포옹법（蝴蝶拥抱法）”是心理治疗中广泛应用的自我安抚与创伤平复技术。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "문강태 (文钢太)",
        "role": "护工",
        "avatarColor": "bg-teal-700",
        "ko": "숨을 깊게 쉬고, 양팔을 교차해서 스스로를 토닥여 봐.",
        "zh": "深吸一口气，双手交叉，试着轻轻拍拍自己吧。",
        "roman": "Sumeul gipge swigo, yangpareul gyocha-haeseo seuseuroreul todagyeo bwa.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "스스로",
            "meaning": "自己 / 亲自"
          },
          {
            "word": "토닥이다",
            "meaning": "抚拍 / 安抚"
          }
        ],
        "grammarNotes": "动词 + -고 (顺承连接) + -아/어 보다 (尝试做某事)",
        "clozeQuestion": {
          "maskedKo": "양팔을 교차해서 스스로를 (      ) 봐.",
          "maskedWord": "토닥여",
          "options": [
            "토닥여",
            "바라봐",
            "가르쳐",
            "안아"
          ],
          "hint": "动词：“轻轻抚拍”（토닥이다）。"
        }
      }
    ]
  },
  {
    "id": "drama-business-proposal",
    "dramaTitle": "社内相亲",
    "koreanDramaTitle": "사내맞선",
    "category": "顶流心动爱情",
    "genre": "欢喜冤家 / 霸总甜宠",
    "difficulty": "初级入门 (TOPIK 1-2)",
    "levelTag": "初级",
    "sceneTitle": "姜社长自信直球告白：“我对你各方面都很擅长，结婚吧”",
    "episode": "第 2 集 爆笑名场面",
    "durationSeconds": 32,
    "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-amber-800 via-rose-900 to-black",
    "isFreePreview": true,
    "summary": "霸道社长姜泰武（安孝燮 饰）在相亲后对申夏莉（金世正 饰）展开势在必得的高能求婚攻势。",
    "culturalInsight": "“다방면에서 잘합니다（在各方面都很擅长）”是韩剧中高智商自恋男主角的经典自信人设语言。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "강태무 (姜泰武)",
        "role": "社长",
        "avatarColor": "bg-amber-600",
        "ko": "나, 다방면으로 다 잘합니다. 우리 결혼합시다.",
        "zh": "我，在各方面都很擅长。我们结婚吧。",
        "roman": "Na, dabangmyeon-euro da jalhamnida. Uri gyeolhonhapsida.",
        "timeSec": 0,
        "durationSec": 4,
        "highlightWords": [
          {
            "word": "다방면",
            "meaning": "多方面 / 各领域"
          },
          {
            "word": "결혼하다",
            "meaning": "结婚"
          }
        ],
        "grammarNotes": "副词 다 + 잘하다 (做得好/擅长) + -(으)ㅂ시다 (敬语共动句尾：我们一起...吧)",
        "clozeQuestion": {
          "maskedKo": "나, 다방면으로 다 잘합니다. 우리 (      )합시다.",
          "maskedWord": "결혼",
          "options": [
            "결혼",
            "식사",
            "운동",
            "여행"
          ],
          "hint": "名词：“结婚”（결혼）。"
        }
      }
    ]
  },
  {
    "id": "drama-juvenile-justice",
    "dramaTitle": "少年法庭",
    "koreanDramaTitle": "소년심판",
    "category": "高能高光名场面",
    "genre": "律政正义 / 霸气审判",
    "difficulty": "中高级精通 (TOPIK 5-6)",
    "levelTag": "高级",
    "sceneTitle": "沈恩锡法官霸气审判：“我对少年犯，深恶痛绝”",
    "episode": "第 1 集 封神名场面",
    "durationSeconds": 38,
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    "stillUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    "bgGradient": "from-slate-950 via-zinc-950 to-black",
    "isFreePreview": true,
    "summary": "冷酷严谨的精英法官沈恩锡（金憓秀 饰）在法庭上给心存侥幸的未成年罪犯当头棒喝的震撼宣判。",
    "culturalInsight": "“혐오합니다（深恶痛绝/极其厌恶）”在庄严法庭陈述中，展现了对犯罪本身绝不姑息的司法威严。",
    "dialogues": [
      {
        "id": 1,
        "speaker": "심은석 (沈恩锡)",
        "role": "法官",
        "avatarColor": "bg-zinc-800",
        "ko": "저는 소년범을 혐오합니다. 법이 얼마나 무서운지 보여줄 겁니다.",
        "zh": "我对少年犯深恶痛绝。我会让你们知道，法律究竟有多么严苛可畏。",
        "roman": "Jeoneun sonyeonbeom-eul hyeom-ohamnida. Beobi eolmana museounji boyeojul geomnida.",
        "timeSec": 0,
        "durationSec": 5,
        "highlightWords": [
          {
            "word": "소년범",
            "meaning": "少年犯"
          },
          {
            "word": "혐오하다",
            "meaning": "厌恶 / 痛恨"
          },
          {
            "word": "무섭다",
            "meaning": "可怕 / 严厉"
          }
        ],
        "grammarNotes": "疑问副词 얼마나 + -는지 (间接疑问从句) + -(으)ㄹ 겁니다 (坚定将来时)",
        "clozeQuestion": {
          "maskedKo": "저는 소년범을 (      )합니다.",
          "maskedWord": "혐오",
          "options": [
            "혐오",
            "사랑",
            "칭찬",
            "환영"
          ],
          "hint": "汉字词：“痛恨厌恶”（혐오）。"
        }
      }
    ]
  }
];

// =========================================================================
// --- 本地持久化与云端热更新 API ---
// =========================================================================

const CUSTOM_DRAMA_SCENES_KEY = 'cs313_custom_drama_scenes';

export function getCustomDramaScenes(): KDramaScene[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DRAMA_SCENES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(s => s && s.id && s.dramaTitle && Array.isArray(s.dialogues) && s.dialogues.length > 0);
  } catch (e) {
    console.error('Failed to load custom scenes from localStorage', e);
    return [];
  }
}

export function getAllDramaScenes(): KDramaScene[] {
  const custom = getCustomDramaScenes();
  return [...custom, ...K_DRAMA_SCENES];
}

export function saveCustomDramaScene(scene: KDramaScene): void {
  const current = getCustomDramaScenes();
  const filtered = current.filter(s => s.id !== scene.id);
  const updated = [{ ...scene, isCustom: true }, ...filtered];
  localStorage.setItem(CUSTOM_DRAMA_SCENES_KEY, JSON.stringify(updated));
}

export function deleteCustomDramaScene(sceneId: string): void {
  const current = getCustomDramaScenes();
  const updated = current.filter(s => s.id !== sceneId);
  localStorage.setItem(CUSTOM_DRAMA_SCENES_KEY, JSON.stringify(updated));
}

export function exportDramaScenesToJson(): string {
  const all = getAllDramaScenes();
  return JSON.stringify(all, null, 2);
}

export function importDramaScenesFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      localStorage.setItem(CUSTOM_DRAMA_SCENES_KEY, JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to import drama scenes from JSON', e);
    return false;
  }
}
