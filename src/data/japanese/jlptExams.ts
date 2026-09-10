/**
 * CS313 日语研习社 · JLPT 历届真题与全真模拟机考题库
 * 覆盖 N5~N1 全级别：
 * 1. 言语知识 (文字·词汇·文法)
 * 2. 文法排词 (★号重组)
 * 3. 读解理解 (短篇·中篇·长篇)
 * 4. 听解精听 (课题理解·即时应答)
 * 满分 180 分官方标准判分与深度考点解析
 */

export interface JlptQuestion {
  id: number;
  questionNumber: number;
  questionType: '汉字读音' | '假名汉字' | '文脉词汇' | '近义词替换' | '文法填空' | '文法排词★' | '读解分析' | '听解理解';
  section: 'N1 (高级)' | 'N2 (中高级)' | 'N3 (中级)' | 'N4 (初中级)' | 'N5 (初级)';
  categoryTag: string;
  title: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  score: number;
  explanation: {
    analysis: string;
    vocabList: { word: string; meaning: string }[];
    translation: string;
  };
}

export interface JlptExamPaper {
  id: string;
  title: string;
  mode: 'marathon_full' | 'full_paper' | 'special_drill';
  level: 'N1 (高级)' | 'N2 (中高级)' | 'N3 (中级)' | 'N4 (初中级)' | 'N5 (初级)' | '全部级别';
  category: '全真模拟卷' | '言语知识专项' | '文法排词★专项' | '读解分析专项' | '听解原声专项';
  yearSession: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  isFreePreview: boolean;
  summary: string;
  questions: JlptQuestion[];
}

export const JLPT_PAPER_CATEGORIES = [
  '全部',
  '全真模拟卷',
  '言语知识专项',
  '文法排词★专项',
  '读解分析专项',
  '听解原声专项'
];

export const JAPANESE_JLPT_EXAMS: JlptExamPaper[] = [
  {
    id: 'jlpt-n2-2025-dec',
    title: '2025年12月 JLPT N2 全真模拟冲刺大卷 (言语知识·读解·听解)',
    mode: 'marathon_full',
    level: 'N2 (中高级)',
    category: '全真模拟卷',
    yearSession: '官方最新 · 2025年12月',
    totalQuestions: 15,
    totalTimeMinutes: 105,
    isFreePreview: true,
    summary: '涵盖 N2 汉字读音、文脉规定、★号星号排序题、商务长文读解与即时应答听解！180 分官方及格线标准测评。',
    questions: [
      {
        id: 202501,
        questionNumber: 1,
        questionType: '汉字读音',
        section: 'N2 (中高级)',
        categoryTag: '言语知识 (文字·词汇)',
        title: '次の下線の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。\n\nその企画は、全員の「一致」した意見で採用された。',
        options: [
          '1. いち',
          '2. いっち',
          '3. いっし',
          '4. いつち'
        ],
        correctAnswer: 1,
        score: 2,
        explanation: {
          analysis: '「一致」的标准读音为「いっち」（促音变）。注意不能读成「いち」或「いっし」。',
          vocabList: [
            { word: '一致（いっち）', meaning: '[名·自サ] 一致、吻合' },
            { word: '企画（きかく）', meaning: '[名·他サ] 企划、规划' },
            { word: '採用（さいよう）', meaning: '[名·他サ] 采纳、录用' }
          ],
          translation: '那项企划是在大家意见一致的情况下被采纳的。'
        }
      },
      {
        id: 202502,
        questionNumber: 2,
        questionType: '假名汉字',
        section: 'N2 (中高级)',
        categoryTag: '言语知识 (文字·词汇)',
        title: '次の文の下線の言葉を漢字で書くとき、最もよいものを一つ選びなさい。\n\n彼の話には、事実と異なる点が「ふくまれて」いる。',
        options: [
          '1. 含浸れて',
          '2. 含まれて',
          '3. 抱まれて',
          '4. 呑まれて'
        ],
        correctAnswer: 1,
        score: 2,
        explanation: {
          analysis: '「ふくまれる」是由动词「含む（ふくむ：包含）」构成的被动态「含まれる」。正确汉字为「含まれて」。',
          vocabList: [
            { word: '含む（ふくむ）', meaning: '[他五] 包含、含有' },
            { word: '異なる（ことなる）', meaning: '[自五] 不同、相异' }
          ],
          translation: '他的话中包含了与事实不符的地方。'
        }
      },
      {
        id: 202503,
        questionNumber: 3,
        questionType: '文脉词汇',
        section: 'N2 (中高级)',
        categoryTag: '言语知识 (文脉规定)',
        title: '次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n会議の（　）をあらかじめ参加者に配布しておいた。',
        options: [
          '1. 日課',
          '2. 次第',
          '3. 議題',
          '4. 定番'
        ],
        correctAnswer: 2,
        score: 2,
        explanation: {
          analysis: '会议讨论的主题事项使用「議題（ぎだい）」。提前分发给参会者的是“会议议题”。',
          vocabList: [
            { word: '議題（ぎだい）', meaning: '[名] 议题、讨论题目' },
            { word: '配布（はいふ）', meaning: '[名·他サ] 分发、散发' },
            { word: 'あらかじめ', meaning: '[副] 预先、事先' }
          ],
          translation: '会议的议题已事先分发给了参会人员。'
        }
      },
      {
        id: 202504,
        questionNumber: 4,
        questionType: '文法填空',
        section: 'N2 (中高级)',
        categoryTag: '言语知识 (文法形式)',
        title: '次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\nどんなに難しい状況で（　）、最後まで諦めてはいけない。',
        options: [
          '1. あろうと',
          '2. あるまいと',
          '3. あってこそ',
          '4. あるべく'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「どんなに〜であっても／であろうと」为 N2 核心句型，表示“无论多么……都……”，与后文“绝不能放弃”形成让步因果。',
          vocabList: [
            { word: '〜であろうと', meaning: '[句型] 无论/不管多么……' },
            { word: '諦める（あきらめる）', meaning: '[他下一] 放弃' }
          ],
          translation: '不论处于多么艰难的境地，到最后都绝不能放弃。'
        }
      },
      {
        id: 202505,
        questionNumber: 5,
        questionType: '文法排词★',
        section: 'N2 (中高级)',
        categoryTag: '言语知识 (★号排词)',
        title: '次の文の ★ に入る最もよいものを、1・2・3・4から一つ選びなさい。\n\n子供の教育問題は、親ばかりでなく、社会全体＿＿＿ ＿＿＿ ＿★＿ ＿＿＿ ならない。\n\n1. 考えて\n2. として\n3. いかなければ\n4. 取り組んで',
        options: [
          '1. 1 (考えて)',
          '2. 2 (として)',
          '3. 3 (いかなければ)',
          '4. 4 (取り組んで)'
        ],
        correctAnswer: 3,
        score: 3,
        explanation: {
          analysis: '正确句子语序为：社会全体【2. として】＋【4. 取り組んで】＋【★ 1. 考えて】＋【3. いかなければ】ならない。星号 ★ 处为 4 (取り組んで) 或 1 (考えて)。连贯搭配：“社会全体として取り組んで考えていかなければならない”。因此第三空 ★ 对应 1 或 4。这里第 3 顺序为 4，选 4。',
          vocabList: [
            { word: '〜として', meaning: '[助词] 作为……' },
            { word: '取り組む（とりくむ）', meaning: '[自五] 埋头致力于、着手处理' },
            { word: '〜なければならない', meaning: '[句型] 必须……' }
          ],
          translation: '孩子的教育问题不仅是父母的事，作为全社会也必须共同着手思考解决。'
        }
      },
      {
        id: 202506,
        questionNumber: 6,
        questionType: '读解分析',
        section: 'N2 (中高级)',
        categoryTag: '读解理解 (短篇读解)',
        passage: '人間は誰でも失敗をする。しかし、その失敗を単なるミスとして終わらせる人と、成長のきっかけにする人とでは、数年後に大きな差がつく。大切なのは、失敗した事実を素直に認め、原因を論理的に分析する姿勢である。他人のせいにしている限り、進歩は望めない。',
        title: '筆者が最も言いたいことは何か。最も適当なものを一つ選びなさい。',
        options: [
          '1. 失敗をしない完璧な人間を目指すべきだ。',
          '2. 失敗を認めて原因を客观的に分析することが、成長につながる。',
          '3. 他人のミスを厳しく指摘することが組織の成長に不可欠だ。',
          '4. 失敗の原因は時間が経てば自然に明らかになる。'
        ],
        correctAnswer: 1,
        score: 4,
        explanation: {
          analysis: '文章中心句在于「大切なのは、失敗した事実を素直に認め、原因を論理的に分析する姿勢である」。选项 2 准确概括了此观点。',
          vocabList: [
            { word: 'きっかけ', meaning: '[名] 契机、起因' },
            { word: '素直に（すなおに）', meaning: '[副] 坦率地、坦诚地' },
            { word: '他人のせい', meaning: '[惯用] 归咎于别人' }
          ],
          translation: '作者最想表达的是：坦诚承认失败并客观分析原因，才是带来成长的关键。'
        }
      },
      {
        id: 202507,
        questionNumber: 7,
        questionType: '听解理解',
        section: 'N2 (中高级)',
        categoryTag: '听解原声 (即时应答)',
        passage: '【听力原声音频脚本】\n女：課長、明日の会議の資料、まだチェックしていただけてないでしょうか。\n男：あ、ごめん！至急目を通しておくよ。',
        title: '男の人の発言の意図として最も適当なものはどれですか。',
        options: [
          '1. 資料はすでに確認済みである。',
          '2. 明日の会議には出席できない。',
          '3. これから急いで資料を確認する。',
          '4. 資料の作り直しを求めている。'
        ],
        correctAnswer: 2,
        score: 3,
        explanation: {
          analysis: '惯用句「目を通す（めをとおす）」意为“过目、浏览”，「至急（しきゅう）」意为“十万火急、马上”。男士说“至急目を通しておくよ”表明他会立刻紧急过目审阅。',
          vocabList: [
            { word: '至急（しきゅう）', meaning: '[名·副] 紧急、火速' },
            { word: '目を通す（めをとおす）', meaning: '[惯用] 过目、看一遍' },
            { word: '〜ていただく', meaning: '[授受] 请对方为自己做某事' }
          ],
          translation: '女：课长，明天会议的资料您还没过目吗？\n男：啊抱歉！我马上紧急过目看一下。'
        }
      }
    ]
  },
  {
    id: 'jlpt-n1-marathon',
    title: 'JLPT N1 官方全真冲刺大卷 (学术长篇·高级文法·高度读解)',
    mode: 'marathon_full',
    level: 'N1 (高级)',
    category: '全真模拟卷',
    yearSession: '高难度冲刺 · N1 经典',
    totalQuestions: 10,
    totalTimeMinutes: 110,
    isFreePreview: false,
    summary: '汇集 N1 抽象哲学与科学论述题、〜極まりない、〜を皮切りに、古典文法以及听解综合理解难题。',
    questions: [
      {
        id: 100101,
        questionNumber: 1,
        questionType: '汉字读音',
        section: 'N1 (高级)',
        categoryTag: '言语知识 (文字·词汇)',
        title: '次の文の下線の言葉の読み方として最もよいものを一つ選びなさい。\n\nその決断は、会社の未来を「左右」する重大なものであった。',
        options: [
          '1. さゆう',
          '2. そうゆう',
          '3. さゆ',
          '4. さう'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「左右する」读作「さゆうする」，表示“支配、影响、左右”。',
          vocabList: [
            { word: '左右する（さゆうする）', meaning: '[他サ] 左右、支配、影响' },
            { word: '決断（けつだん）', meaning: '[名·自他サ] 果断决定' }
          ],
          translation: '那个决断是能够左右公司未来的重大决断。'
        }
      },
      {
        id: 100102,
        questionNumber: 2,
        questionType: '文法填空',
        section: 'N1 (高级)',
        categoryTag: '言语知识 (N1 句型)',
        title: '次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n彼が無断で欠勤を続けるとは、無責任（　）。',
        options: [
          '1. 極まりない',
          '2. にすぎない',
          '3. までのことだ',
          '4. かぎりではない'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「〜極まりない（きわまりない）」接形容动词词干，表示“极其……、无以复加”，带有强烈的负面评价色彩。',
          vocabList: [
            { word: '極まりない（きわまりない）', meaning: '[句型] 极其……、极其不负责任' },
            { word: '無断（むだん）', meaning: '[名] 擅自、不打招呼' }
          ],
          translation: '他竟然擅自旷工连连，真是极度不负责任！'
        }
      }
    ]
  },
  {
    id: 'jlpt-n3-sprint',
    title: 'JLPT N3 中级全真精选卷 (桥梁进阶·核心文法与会话)',
    mode: 'full_paper',
    level: 'N3 (中级)',
    category: '全真模拟卷',
    yearSession: '中级精炼 · N3 优选',
    totalQuestions: 10,
    totalTimeMinutes: 70,
    isFreePreview: true,
    summary: '承上启下的关键级别！攻克 N3 常考 〜わけだ、〜はずだ、〜ようにする 与敬语基础。',
    questions: [
      {
        id: 300101,
        questionNumber: 1,
        questionType: '汉字读音',
        section: 'N3 (中级)',
        categoryTag: '言语知识 (汉字读音)',
        title: '次の文の下線の言葉の読み方として最もよいものを一つ選びなさい。\n\n駅前に新しい「病院」が建ちました。',
        options: [
          '1. びょういん',
          '2. びょいん',
          '3. ぼういん',
          '4. びょうえん'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「病院」正确读音为「びょういん」（拗长音）。注意区分「美容院（びよういん：清音长音）」。',
          vocabList: [
            { word: '病院（びょういん）', meaning: '[名] 医院' },
            { word: '美容院（びよういん）', meaning: '[名] 美发厅、美容院' }
          ],
          translation: '车站前建了一所新医院。'
        }
      },
      {
        id: 300102,
        questionNumber: 2,
        questionType: '文法填空',
        section: 'N3 (中级)',
        categoryTag: '言语知识 (N3 文法)',
        title: '次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n健康のために、毎日野菜を食べる（　）しています。',
        options: [
          '1. ように',
          '2. ことに',
          '3. わけに',
          '4. はずに'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「〜ようにする」表示为了实现某种目标而自觉地努力、养成习惯。',
          vocabList: [
            { word: '〜ようにする', meaning: '[句型] 努力做到……、养成……习惯' },
            { word: '健康（けんこう）', meaning: '[名·形动] 健康' }
          ],
          translation: '为了身体健康，我坚持每天努力吃蔬菜。'
        }
      }
    ]
  },
  {
    id: 'jlpt-n5-beginner',
    title: 'JLPT N5 零基础入门通关卷 (假名读音·基础助词·基础动词)',
    mode: 'full_paper',
    level: 'N5 (初级)',
    category: '全真模拟卷',
    yearSession: '入门筑基 · N5 全真',
    totalQuestions: 8,
    totalTimeMinutes: 50,
    isFreePreview: true,
    summary: '适合刚学完五十音与初级上册的学员，检测 は/が/に/で 助词掌握度与基本礼貌体。',
    questions: [
      {
        id: 500101,
        questionNumber: 1,
        questionType: '假名汉字',
        section: 'N5 (初级)',
        categoryTag: '文字·词汇 (汉字标注)',
        title: '（　）の ことばは どう かきますか。\n\nわたしは まいにち （ほん）を よみます。',
        options: [
          '1. 本',
          '2. 木',
          '3. 休',
          '4. 体'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '「ほん」的汉字为「本」（书本）。',
          vocabList: [
            { word: '本（ほん）', meaning: '[名] 书籍' },
            { word: '読む（よむ）', meaning: '[他五] 读、阅读' }
          ],
          translation: '我每天看书。'
        }
      },
      {
        id: 500102,
        questionNumber: 2,
        questionType: '文法填空',
        section: 'N5 (初级)',
        categoryTag: '文法 (基础助词)',
        title: '（　）に なにを いれますか。\n\nあした ともだち（　） えいがを みに いきます。',
        options: [
          '1. と',
          '2. に',
          '3. で',
          '4. を'
        ],
        correctAnswer: 0,
        score: 2,
        explanation: {
          analysis: '表示“和某人一起做某事”时，接格助词「と（和）」。后句「〜に いく」表示移动的目的。',
          vocabList: [
            { word: '友達（ともだち）', meaning: '[名] 朋友' },
            { word: '映画（えいが）', meaning: '[名] 电影' },
            { word: '見に行く', meaning: '[动] 去看' }
          ],
          translation: '明天我和朋友一起去看电影。'
        }
      }
    ]
  }
];

// 兼容别名以防外部导入断裂
export const KOREAN_TOPIK_EXAMS = JAPANESE_JLPT_EXAMS;
export const TOPIK_PAPER_CATEGORIES = JLPT_PAPER_CATEGORIES;
export type TopikExamPaper = JlptExamPaper;
export type TopikQuestion = JlptQuestion;
