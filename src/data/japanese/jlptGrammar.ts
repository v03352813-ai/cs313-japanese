/**
 * CS313 日语研习社 · JLPT 体系化文法宝典规范
 * 包含：N5~N1 核心句型卡片、动词 10 种活用变形器、四大助词精析、敬语体系速查
 */

export interface JlptGrammarPoint {
  id: string;
  pattern: string;           // 句型公式 (如 "～てから", "～わけにはいかない")
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: string;          // 分类 (时间顺序、假定条件、原因理由、转折让步、可能授受、敬语表达等)
  connection: string;        // 接续方式 (如 "动词て形 + から", "动词辞书形 + わけにはいかない")
  meaning: string;           // 语法意义与中文释义
  explanation: string;       // 详细解析与使用心法
  comparisonNotes?: string;  // 易混淆对比与考点避坑
  examples: {
    ja: string;
    furigana: string;
    zh: string;
  }[];
}

// 动词活用变形规则表
export interface VerbConjugationRule {
  formName: string;          // 活用形态名 (如 "て形", "ない形", "假定形")
  functionDesc: string;      // 语法功能 (如 "表示连接/轻微命令", "表示否定", "表示假设条件")
  rules: {
    group1: string;          // 1类动词(五段动词)变化规律 (如 "う・つ・る -> って")
    group2: string;          // 2类动词(一段动词)变化规律 (如 "去る + て")
    group3: string;          // 3类动词(サ变/カ变)变化规律 (如 "する -> して, くる -> きて")
  };
  sample: {
    dict: string;            // 原型 (辞书形)
    conjugated: string;      // 变形后形态
    furigana: string;
    meaning: string;
  }[];
}

export const VERB_CONJUGATION_RULES: VerbConjugationRule[] = [
  {
    formName: 'ます形 (连用形)',
    functionDesc: '礼貌体表达，用于构成日常敬体句尾及复合动词的前项',
    rules: {
      group1: '词尾「う段」假名变为该行的「い段」假名 + ます (如: 書く -> 書きます)',
      group2: '去掉词尾「る」 + ます (如: 食べる -> 食べます)',
      group3: 'する -> します；来る(くる) -> 来ます(きます)'
    },
    sample: [
      { dict: '買う', conjugated: '買います', furigana: 'かいます', meaning: '买 (敬体)' },
      { dict: '見る', conjugated: '見ます', furigana: 'みます', meaning: '看 (敬体)' },
      { dict: 'する', conjugated: 'します', furigana: 'します', meaning: '做 (敬体)' },
      { dict: '来る', conjugated: '来ます', furigana: 'きます', meaning: '来 (敬体)' }
    ]
  },
  {
    formName: 'て形 (连接形)',
    functionDesc: '动作相继发生、轻微祈使、进行时 (～ている)、许可 (～てもいい) 的核心基础',
    rules: {
      group1: '按词尾发生音便：① う・つ・る 变「って」(促音便)；② む・ぶ・ぬ 变「んで」(拨音便)；③ く 变「いて」、ぐ 变「いで」(イ音便，特例: 行く -> 行って)；④ す 变「して」',
      group2: '去掉词尾「る」 + て (如: 食べる -> 食べて)',
      group3: 'する -> して；来る(くる) -> 来て(きて)'
    },
    sample: [
      { dict: '待つ', conjugated: '待って', furigana: 'まって', meaning: '等一等' },
      { dict: '飲む', conjugated: '飲んで', furigana: 'のんで', meaning: '喝了' },
      { dict: '書く', conjugated: '書いて', furigana: 'かいて', meaning: '写下' },
      { dict: '行く', conjugated: '行って', furigana: 'いって', meaning: '去 (特例促音变)' },
      { dict: '食べる', conjugated: '食べて', furigana: 'たべて', meaning: '吃' }
    ]
  },
  {
    formName: 'た形 (过去形)',
    functionDesc: '表示过去完成、经历 (～たことがある)、建议 (～たほうがいい)',
    rules: {
      group1: '变形规则完全与「て形」相同，只需将「て/で」换成「た/だ」',
      group2: '去掉词尾「る」 + た (如: 食べる -> 食べた)',
      group3: 'する -> した；来る(くる) -> 来た(きた)'
    },
    sample: [
      { dict: '読んだ', conjugated: '読んだ', furigana: 'よんだ', meaning: '读过了' },
      { dict: '買った', conjugated: '買った', furigana: 'かった', meaning: '买过了' },
      { dict: '食べた', conjugated: '食べた', furigana: 'たべた', meaning: '吃过了' }
    ]
  },
  {
    formName: 'ない形 (否定未然形)',
    functionDesc: '简体否定句尾，用于构成禁止 (～ないでください)、必须 (～なければならない)',
    rules: {
      group1: '词尾「う段」变为该行的「あ段」假名 + ない (特例: 词尾是「う」的变为「わ」而不是「あ」；ある -> ない)',
      group2: '去掉词尾「る」 + ない (如: 食べる -> 食べない)',
      group3: 'する -> しない；来る(くる) -> 来ない(こない)'
    },
    sample: [
      { dict: '買う', conjugated: '買わない', furigana: 'かわない', meaning: '不买 (う变わ)' },
      { dict: '書く', conjugated: '書かない', furigana: 'かかない', meaning: '不写' },
      { dict: '見る', conjugated: '見ない', furigana: 'みない', meaning: '不看' },
      { dict: '来る', conjugated: '来ない', furigana: 'こない', meaning: '不来 (音变こ)' }
    ]
  },
  {
    formName: 'ば形 (假定形)',
    functionDesc: '表示假定条件与前置前提 (如“如果...的话”，越...越...)',
    rules: {
      group1: '词尾「う段」变为该行的「え段」假名 + ば (如: 行く -> 行けば)',
      group2: '去掉词尾「る」 + れば (如: 食べる -> 食べれば)',
      group3: 'する -> すれば；来る(くる) -> 来れば(くれば)'
    },
    sample: [
      { dict: '走る', conjugated: '走れば', furigana: 'はしれば', meaning: '如果奔跑的话' },
      { dict: '見れば', conjugated: '見れば', furigana: 'みれば', meaning: '如果看的话' },
      { dict: 'する', conjugated: 'すれば', furigana: 'すれば', meaning: '如果做的话' }
    ]
  },
  {
    formName: '可能态 (れる/られる)',
    functionDesc: '表示自身能力或客观条件允许 (如“会做某事 / 能吃 / 会说日语”)',
    rules: {
      group1: '词尾「う段」变为该行的「え段」假名 + る (如: 話す -> 話せる)',
      group2: '去掉词尾「る」 + られる (口语可约音为「れる」: 食べられる / 食べれる)',
      group3: 'する -> できる；来る(くる) -> 来られる(こられる)'
    },
    sample: [
      { dict: '泳ぐ', conjugated: '泳げる', furigana: 'およげる', meaning: '能游 / 会游泳' },
      { dict: '話す', conjugated: '話せる', furigana: 'はなせる', meaning: '能讲 / 会说' },
      { dict: 'する', conjugated: 'できる', furigana: 'できる', meaning: '会做 / 可以做' }
    ]
  },
  {
    formName: '被动态 (れる/られる)',
    functionDesc: '表示被动动作或受害受损被动态 (如“被踩到脚 / 被老师表扬”)',
    rules: {
      group1: '词尾「う段」变为该行的「あ段」假名 + れる (如: 叱る -> 叱られる)',
      group2: '去掉词尾「る」 + られる (如: 褒める -> 褒められる)',
      group3: 'する -> される；来る(くる) -> 来られる(こられる)'
    },
    sample: [
      { dict: '褒める', conjugated: '褒められる', furigana: 'ほめられる', meaning: '被夸奖' },
      { dict: '叱る', conjugated: '叱られる', furigana: 'しかられる', meaning: '被训斥' },
      { dict: '踏む', conjugated: '踏まれる', furigana: 'ふまれる', meaning: '被踩到' }
    ]
  },
  {
    formName: '使役态 (せる/させる)',
    functionDesc: '表示促使、吩咐、让别人去做某事 (如“让孩子吃蔬菜 / 让我来说明”)',
    rules: {
      group1: '词尾「う段」变为该行的「あ段」假名 + せる (如: 読む -> 読ませる)',
      group2: '去掉词尾「る」 + させる (如: 食べる -> 食べさせる)',
      group3: 'する -> させる；来る(くる) -> 来させる(こさせる)'
    },
    sample: [
      { dict: '言わせる', conjugated: '言わせる', furigana: 'いわせる', meaning: '让...说' },
      { dict: '食べる', conjugated: '食べさせる', furigana: 'たべさせる', meaning: '让...吃' },
      { dict: '行く', conjugated: '行かせる', furigana: 'いかせる', meaning: '让...去' }
    ]
  }
];

// 四大易错核心助词专题
export const PARTICLE_COMPARISONS = [
  {
    title: '「は」与「が」的千年世纪大对决',
    summary: '日语中最核心、考题出现率最高的两个助词。',
    points: [
      {
        aspect: '信息重心区别',
        desc: '「A は B」的重点在后项 B (旧信息作主题，重点在陈述)；「A が B」的重点在前项 A (新信息发现，指定是谁)'
      },
      {
        aspect: '疑问词位置',
        desc: '疑问词作主语必须用「が」(如: だれが来ましたか？谁来了？)；回答疑问词主语也用「が」(田中さんが来ました。)'
      },
      {
        aspect: '从句主语规则',
        desc: '定语从句中的小主语通常用「が」或可转化为「の」(如: 私が買った本 我买的书)'
      }
    ]
  },
  {
    title: '「に」与「で」的场所动作辨析',
    summary: '表示地点的必考助词，核心在于动词是“存在”还是“动态行为”。',
    points: [
      {
        aspect: '静止存在 vs 动态动作',
        desc: '静止存在或停留点用「に」(公園に花があります 公园里有花)；在场所发生具体动作行为用「で」(公園で散歩します 在公园散步)'
      },
      {
        aspect: '移动落脚点 (附着点)',
        desc: '动作最终落脚停留的地方用「に」(黒板に書く 写在黑板上，電車に乗る 坐上电车)'
      }
    ]
  }
];

// JLPT 分级核心句型卡片
export const JLPT_GRAMMAR_POINTS: JlptGrammarPoint[] = [
  // ========================== N5 核心句型 ==========================
  {
    id: 'jp-g-n5-01',
    pattern: '～てから',
    level: 'N5',
    category: '时间顺序',
    connection: '动词て形 + から',
    meaning: '在……之后；……之后再……',
    explanation: '强调前一个动作全部彻底完成后，再开始进行紧接着的后一个动作。',
    comparisonNotes: '注意与「～た後で」相比，「～てから」强调前后动作之间的时间紧密性。',
    examples: [
      {
        ja: '手を洗ってから、ご飯を食べます。',
        furigana: 'て を あらって から、ごはん を たべます。',
        zh: '洗手之后再吃饭。'
      },
      {
        ja: '日本へ行ってから、ずっと東京に住んでいます。',
        furigana: 'にほん へ いって から、ずっと とうきょう に すんでいます。',
        zh: '自从去了日本之后，就一直住在东京。'
      }
    ]
  },
  {
    id: 'jp-g-n5-02',
    pattern: '～てもいいです',
    level: 'N5',
    category: '许可表达',
    connection: '动词て形 + もいいです',
    meaning: '可以……；做……也可以',
    explanation: '表示说话人给予许可，或者疑问句「～てもいいですか」用于礼貌征求对方的同意。',
    examples: [
      {
        ja: 'ここで写真を撮ってもいいですか。',
        furigana: 'ここ で しゃしん を とっても いい です か。',
        zh: '可以在这里拍照吗？'
      },
      {
        ja: 'もう宿題が終わったので、帰ってもいいですよ。',
        furigana: 'もう しゅくだい が おわった ので、かえっても いい です よ。',
        zh: '作业既然已经写完了，可以回家了哦。'
      }
    ]
  },

  // ========================== N4 核心句型 ==========================
  {
    id: 'jp-g-n4-01',
    pattern: '～たほうがいい',
    level: 'N4',
    category: '建议忠告',
    connection: '动词た形 + ほうがいい / 动词ない形 + ほうがいい',
    meaning: '最好……；还是……比较好',
    explanation: '对听话人提出明确的建议或劝告。肯定的建议用「～たほうがいい」，否定的忠告用「～ないほうがいい」。',
    examples: [
      {
        ja: '風邪をひいたなら、早く寝たほうがいいですよ。',
        furigana: 'かぜ を ひいた なら、はやく ねた ほう が いい です よ。',
        zh: '要是感冒了的话，最好早点睡觉哦。'
      },
      {
        ja: '夜遅くに甘いものは食べないほうがいいです。',
        furigana: 'よる おそく に あまい もの は たべない ほう が いい です。',
        zh: '深夜最好还是不要吃甜食比较好。'
      }
    ]
  },
  {
    id: 'jp-g-n4-02',
    pattern: '～ながら',
    level: 'N4',
    category: '同时进行',
    connection: '动词ます形去ます + ながら',
    meaning: '一边……一边……',
    explanation: '同一个主体同时进行两项动作，句尾后项的动词为主动作，前项为伴随动作。',
    examples: [
      {
        ja: '音楽を聞きながら、本を読みます。',
        furigana: 'おんがく を きき ながら、ほん を よみます。',
        zh: '一边听着音乐一边看书。'
      }
    ]
  },

  // ========================== N3 核心句型 ==========================
  {
    id: 'jp-g-n3-01',
    pattern: '～わけにはいかない',
    level: 'N3',
    category: '社会情理',
    connection: '动词辞书形 / 动词ない形 + わけにはいかない',
    meaning: '不能……；怎能…… / 不能不……；必须……',
    explanation: '出于常识、社会道德、人情世故或客观责任，心理上感觉“绝不能这么做”或“不得不做”。',
    comparisonNotes: '与「～てはいけない (规则禁止)」不同，此句型带有强烈的自身心理责任感。',
    examples: [
      {
        ja: '明日は大事な試験があるので、休むわけにはいきません。',
        furigana: 'あした は だいじな しけん が ある ので、やすむ わけ には いきません。',
        zh: '明天有重要的考试，我绝不能请假。'
      },
      {
        ja: '親友の頼みだから、断るわけにはいかない。',
        furigana: 'しんゆう の たのみ だから、ことわる わけ には いかない。',
        zh: '既然是挚友的拜托，我怎能拒绝呢。'
      }
    ]
  },
  {
    id: 'jp-g-n3-02',
    pattern: '～わりに（は）',
    level: 'N3',
    category: '出乎意料',
    connection: '用言连体形 / 名词+の + わりに（は）',
    meaning: '虽说是……却出乎意料地……；相对……而言比较……',
    explanation: '从前项的情况来推断本该如此，但实际事实却出人意料，带有一点意外和感叹。',
    examples: [
      {
        ja: 'このレストランは値段が安かったわりに、料理がとても美味しかった。',
        furigana: 'この れすとらん は ねだん が やすかった わり に、りょうり が とても おいしかった。',
        zh: '这家餐厅虽说价格很便宜，菜品却出乎意料地好吃。'
      }
    ]
  },

  // ========================== N2 核心句型 ==========================
  {
    id: 'jp-g-n2-01',
    pattern: '～に決まっている',
    level: 'N2',
    category: '确信断定',
    connection: '普通形 (名词/な形容词无需だ) + に決まっている',
    meaning: '肯定……；必定是……；毫无疑问是……',
    explanation: '说话人基于直觉或经验，带着强烈的个人主观确定感断定某件事必然如此。',
    examples: [
      {
        ja: 'そんな無茶な計画、失敗するに決まっている。',
        furigana: 'そんな むちゃ な けいかく、しっぱい する に きまっている。',
        zh: '那么荒唐的计划，肯定会失败的。'
      }
    ]
  },
  {
    id: 'jp-g-n2-02',
    pattern: '～をきっかけに（して）',
    level: 'N2',
    category: '转机契机',
    connection: '名词 + をきっかけに / 动词た形 + ことをきっかけに',
    meaning: '以……为契机；借由……的契机开始……',
    explanation: '以此前发生的某件事为契机，后项开始发生新的发展或根本性的心境改变。',
    examples: [
      {
        ja: '日本のアニメを見たことをきっかけに、日本語の勉強を始めました。',
        furigana: 'にほん の あにめ を みた こと を きっかけ に、にほんご の べんきょう を はじめました。',
        zh: '以看了日本动漫为契机，我开始了日语的学习。'
      }
    ]
  },

  // ========================== N1 高级核心句型 ==========================
  {
    id: 'jp-g-n1-01',
    pattern: '～にほかならない',
    level: 'N1',
    category: '绝对断定',
    connection: '名词 / 句末+から + にほかならない',
    meaning: '无非是……；正是……；不外乎是……',
    explanation: '书面语强硬断定，排除了其他一切可能性，指明唯一的根本原因或结论。',
    examples: [
      {
        ja: '彼が今回のコンクールで優勝できたのは、日頃の弛まぬ努力の結果にほかならない。',
        furigana: 'かれ が こんかい の こんくーる で ゆうしょう できた のは、ひごろ の たゆまぬ どりょく の けっか に ほかならない。',
        zh: '他能在本次大赛中夺冠，无非是平时坚持不懈努力的结果。'
      }
    ]
  }
];
