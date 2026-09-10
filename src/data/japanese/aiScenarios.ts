/**
 * CS313 日语研习社 · AI 智能日语口语对练情景库
 * 覆盖：
 * 1. 自由随心畅聊 (东京语伴 1v1)
 * 2. 居酒屋地道点单
 * 3. 罗森便利店日常实战
 * 4. 秋叶原二次元谷子店购物
 * 5. 浅草寺与银座电车换乘问路
 * 6. 日企商务面试与敬语实操
 * 7. 经典动漫《千与千寻》汤屋名场面对戏
 * 8. JLPT 实用学术面谈与留学研究计划书
 */

export interface DialogueTurn {
  id: number;
  speaker: 'ai' | 'user';
  speakerName: string;
  avatar: string;
  ko: string; // 保持字段兼容性，存储日语原文
  jp: string;
  zh: string;
  roman?: string;
  grammarTip?: string;
  suggestedResponses?: string[];
  honorificNotice?: string;
}

export interface AIScenario {
  id: string;
  title: string;
  koreanTitle: string; // 存日文副标题
  category: 'jlpt_speaking' | 'daily_life' | 'business_work' | 'campus_study' | 'drama_roleplay';
  categoryLabel: string;
  levelTag: '初级 (N5~N4)' | '中级 (N3~N2)' | '高级 (N1)';
  icon: string;
  gradient: string;
  description: string;
  targetSkills: string[];
  systemPrompt: string;
  turns: DialogueTurn[];
  referenceModelAnswer?: string;
  examDurationSec?: number;
  isWeeklyNew?: boolean;
  weeklyBatchTag?: string;
}

export const AI_SCENARIOS_DATA: AIScenario[] = [
  {
    id: 'jp_free_chat_01',
    title: '🌟 自由随心畅聊 · 东京语伴 1v1 畅聊',
    koreanTitle: 'フリートーキング · ネイティブAI花子とおしゃべり',
    category: 'daily_life',
    categoryLabel: '自由畅聊',
    levelTag: '初级 (N5~N4)',
    icon: '💬',
    gradient: 'from-sky-500 to-indigo-600',
    description: '无任何固定题目限制！就像和东京的朋友在 LINE 聊天一样，你可以聊任何话题：动漫、美食、旅游、日剧、日常吐槽，或随时向 AI 请教日语！',
    targetSkills: ['开放式日常会话', '自由话题表达', '地道东京腔口语'],
    referenceModelAnswer: '日本の生活や好きなアニメ、美味しい日本料理など、何でも気軽に話してくださいね！',
    systemPrompt: '你是住在东京、非常亲切热情的同龄朋友兼日语私教“花子（Hanako）”。用户可以和你聊世界上任何话题（动漫、美食、旅游、日剧、日常吐槽、日语语法等）。请根据用户的输入，用自然纯正地道的东京腔日常日语（丁寧体/口语）像朋友一样热情回复，倾听并提出新的有趣话题，附带中文翻译与地道口语Tip。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '东京语伴 花子 (Hanako)',
        avatar: '👩🏻',
        ko: 'こんにちは！はじめまして！今日はどんなお話をしましょうか？最近ハマっているアニメや好きな日本料理、旅行の予定など、何でも気軽に話してくださいね！',
        jp: 'こんにちは！はじめまして！今日はどんなお話をしましょうか？最近ハマっているアニメや好きな日本料理、旅行の予定など、何でも気軽に話してくださいね！',
        zh: '你好呀！初次见面！今天想聊点什么呢？不管是最近沉迷的动漫、喜欢的日本美食、旅行计划，还是日语学习问题，都可以随时畅所欲言哦！',
        roman: 'Konnichiwa! Hajimemashite! Kyou wa donna ohanashi o shimashou ka?...',
        grammarTip: '日常实用句：〜にハマっている（沉迷于/热衷于某事）；何でも気軽に（无论什么都请放轻松）',
        suggestedResponses: [
          'こんにちは！最近日本のアニメにハマっています。（你好！最近沉迷日本动漫。）',
          '東京で一番おすすめのラーメン屋さんはどこですか？（东京最推荐的拉面店是哪家？）',
          '敬語の使い方が難しくて、教えてほしいです。（敬语用法有点难，想请教你。）'
        ]
      }
    ]
  },
  {
    id: 'jp_izakaya_01',
    title: '🍺 居酒屋地道点单 · 「とりあえず生！」',
    koreanTitle: '居酒屋での注文 · 定番メニューとお会計',
    category: 'daily_life',
    categoryLabel: '生活实用',
    levelTag: '初级 (N5~N4)',
    icon: '🍺',
    gradient: 'from-amber-500 to-sky-600',
    description: '走进新宿巷子里的居酒屋！从喊「すみません！」召唤店员，到「とりあえず生で！」「お通し」「お会計」，体验最地道的深夜食堂氛围！',
    targetSkills: ['居酒屋高频点单', '召唤店员礼仪', '账单结账用语'],
    systemPrompt: '你是东京新宿一家热闹居酒屋的热情店员“健太（Kenta）”。接待顾客入座、推荐今日特色烤鸡肉串与生啤，并解答客人的各种点单需求，态度爽朗热情。',
    isWeeklyNew: true,
    weeklyBatchTag: '本周新推',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '居酒屋店员 健太',
        avatar: '👨🏻‍🍳',
        ko: 'いらっしゃいませ！カウンター席へどうぞ！まずはお飲み物からお伺いしましょうか？本日のおすすめは冷えた生ビールと焼き鳥の盛り合わせです！',
        jp: 'いらっしゃいませ！カウンター席へどうぞ！まずはお飲み物からお伺いしましょうか？本日のおすすめは冷えた生ビールと焼き鳥の盛り合わせです！',
        zh: '欢迎光临！请坐吧台位置！请问先来点什么喝的呢？今天推荐冰镇生啤酒和烤鸡肉串拼盘！',
        roman: 'Irasshaimase! Kauntaa seki e douzo! Mazu wa onomimono kara oukagai shimashou ka?...',
        grammarTip: '居酒屋金句：とりあえず生（なま）で！（先来杯生啤！）；〜の盛り合わせ（拼盘）',
        suggestedResponses: [
          'とりあえず生ビール一つお願いします！（先来一杯生啤酒！）',
          'ウーロン茶と、焼き鳥の塩を5本ください。（请来一杯乌龙茶和5串盐烤鸡肉串。）',
          'おすすめの料理は何がありますか？（有什么推荐的菜肴吗？）'
        ]
      }
    ]
  },
  {
    id: 'jp_convenience_01',
    title: '🏪 罗森便利店 · 便当加热与塑料袋确认',
    koreanTitle: 'コンビニ実戦 · 温めとお会計のスムーズな会話',
    category: 'daily_life',
    categoryLabel: '生活实用',
    levelTag: '初级 (N5~N4)',
    icon: '🏪',
    gradient: 'from-teal-500 to-sky-600',
    description: '走进日本便利店！店员问「お弁当温めますか？」「レジ袋はご利用ですか？」，如何秒回自然得体？告别手足无措！',
    targetSkills: ['便利店日常问答', '加热与打包表达', '小票与积分卡应对'],
    systemPrompt: '你是日本罗森（LAWSON）便利店店员“田中”。收银时询问顾客是否需要加热便当、是否需要塑料袋、确认付款方式（Suica、现金或信用卡）。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '便利店店员 田中',
        avatar: '👦🏻',
        ko: 'いらっしゃいませ！お弁当ですね。こちら温めますか？あと、レジ袋はご利用になりますでしょうか？',
        jp: 'いらっしゃいませ！お弁当ですね。こちら温めますか？あと、レジ袋はご利用になりますでしょうか？',
        zh: '欢迎光临！这是一份便当对吧。请问需要帮您加热吗？另外，请问需要塑料袋吗？',
        roman: 'Irasshaimase! Obentou desu ne. Kochira atatamemasu ka?...',
        grammarTip: '高频场景句：温める（あたためる：加热）；レジ袋（塑料购物袋）；大丈夫です（不用了/没关系）',
        suggestedResponses: [
          'はい、温めてください。袋は大丈夫です。（好的，请加热。塑料袋不用了。）',
          '温めはそのままでいいです。小さい袋を一枚ください。（不用加热。请给我一个小袋子。）',
          'Suica（スイカ）で払えますか？（可以用西瓜卡支付吗？）'
        ]
      }
    ]
  },
  {
    id: 'jp_akihabara_01',
    title: '🛍️ 秋叶原谷子店 · 免税与限定版手办',
    koreanTitle: '秋葉原ホビーショップ · 免税手続きと限定フィギュア',
    category: 'daily_life',
    categoryLabel: '生活实用',
    levelTag: '中级 (N3~N2)',
    icon: '🎮',
    gradient: 'from-indigo-600 to-purple-600',
    description: '在秋叶原动漫手办店淘限定周边！向店员询问库存、免税政策（Tax-Free）、展柜开锁与包装保护。',
    targetSkills: ['购物咨询', '免税退税表达', '商品细节确认'],
    systemPrompt: '你是秋叶原知名手办二次元周边店的店员“アスカ（Asuka）”。帮助顾客寻找手办、介绍免税条件（满5000日元出示护照）并引导结账。',
    isWeeklyNew: true,
    weeklyBatchTag: '本周新推',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '秋叶原店员 アスカ',
        avatar: '👩🏻‍💼',
        ko: 'いらっしゃいませ！何かお探しのフィギュアやグッズはございますか？ショーケース内の商品もご覧いただけますので、お気軽にお声がけくださいね！',
        jp: 'いらっしゃいませ！何かお探しのフィギュアやグッズはございますか？ショーケース内の商品もご覧いただけますので、お気軽にお声がけくださいね！',
        zh: '欢迎光临！请问在找什么手办或周边周边吗？展柜内的商品也可以取出来看，请随时叫我哦！',
        roman: 'Irasshaimase! Nanika osagashi no figyua ya guzzu wa gozaimasu ka?...',
        grammarTip: 'お探し（敬语）+ ございます（あります的自谦客气语）；お声がけください（请向我搭话）',
        suggestedResponses: [
          'このショーケースのフィギュアを見せてもらえますか？（能让我看一下这个展柜里的手办吗？）',
          '免税（Tax-Free）の手続きはできますか？（可以办理免税手续吗？）',
          'この作品の他のキャラクターのグッズもありますか？（这部作品其他角色的周边也有吗？）'
        ]
      }
    ]
  },
  {
    id: 'jp_asakusa_01',
    title: '⛩️ 浅草寺与银座 · 电车换乘与问路实战',
    koreanTitle: '浅草・銀座での道案内 · 地下鉄の乗り換え',
    category: 'daily_life',
    categoryLabel: '生活实用',
    levelTag: '初级 (N5~N4)',
    icon: '🚇',
    gradient: 'from-sky-600 to-teal-600',
    description: '在错综复杂的东京地下铁迷宫中问路！如何向车站工作人员询问前往浅草雷门或银座的正确站台与出口？',
    targetSkills: ['车站站台询问', '换乘路线确认', '出口与方向指示'],
    systemPrompt: '你是东京地铁银座线车站的值班站务员“高桥”。面对外国游客耐心细致地指引方向、告知乘坐几号车厢以及几号出口距离雷门最近。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '站务员 高桥',
        avatar: '👨🏻‍✈️',
        ko: 'はい、駅員室です。何かお困りですか？浅草方面への乗り換えでしょうか？',
        jp: 'はい、駅員室です。何かお困りですか？浅草方面への乗り換えでしょうか？',
        zh: '您好，这里是车站值班室。请问有什么可以帮您的吗？是要去浅草方向换乘吗？',
        roman: 'Hai, ekiinshitsu desu. Nanika okomari desu ka?...',
        grammarTip: '问路礼貌开场：すみません、〜へ行きたいんですが…（不好意思，我想去...）',
        suggestedResponses: [
          'すみません、浅草寺の雷門に行くには何番出口がいいですか？（请问去浅草寺雷门走几号出口比较好？）',
          '銀座線から丸ノ内線への乗り換えはどこですか？（请问从银座线换乘丸之内线在哪里？）',
          '切符の買い方を教えていただけますか？（能教我一下怎么买票吗？）'
        ]
      }
    ]
  },
  {
    id: 'jp_business_interview_01',
    title: '💼 日企商务面试 · 志望动机与敬语对答',
    koreanTitle: '日系企業面接 · 志望動機と自己PRの敬語実戦',
    category: 'business_work',
    categoryLabel: '职场与面试',
    levelTag: '高级 (N1)',
    icon: '👔',
    gradient: 'from-blue-600 to-slate-800',
    description: '模拟日本知名商社的正式面试场面！熟练使用「〜と存じます」「拝见いたしました」，阐明志望动机与个人优势。',
    targetSkills: ['商务自谦语与尊敬语', '日企应聘逻辑', '清晰条理表达'],
    systemPrompt: '你是日本东京某著名跨国企业的人事主管“佐藤部长（Sato）”。主持正式的入职面试，严格考察应聘者的敬语规范、逻辑严谨度与志望动机。',
    isWeeklyNew: true,
    weeklyBatchTag: '本周新推',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '人事主管 佐藤部長',
        avatar: '👨🏻‍💼',
        ko: '本日はお忙しい中、弊社の面接にお越しいただき、誠にありがとうございます。ではまず、自己紹介と弊社を志望された動機について簡潔にお聞かせいただけますでしょうか。',
        jp: '本日はお忙しい中、弊社の面接にお越しいただき、誠にありがとうございます。ではまず、自己紹介と弊社を志望された動機について簡潔にお聞かせいただけますでしょうか。',
        zh: '非常感谢您在百忙之中莅临本公司的面试。那么首先，能否请您简要介绍一下自己，并说明应聘本公司的志望动机呢？',
        roman: 'Honjitsu wa oisogashii naka, heisha no mensetsu ni okoshi itadaki...',
        grammarTip: '商务规范：弊社（へいしゃ：敝公司）；お越しいただき（承蒙光临）；〜お聞かせいただけますでしょうか（能否请您讲一讲）',
        suggestedResponses: [
          '初めまして、李と申します。本日はよろしくお願い申し上げます。（初次见面，我叫小李。今天请多多关照。）',
          '御社のグローバルな事業展開に魅力を感じ、応募いたしました。（我深深被贵公司的全球化事业展开所吸引，因此提交了应聘。）'
        ]
      }
    ]
  },
  {
    id: 'jp_anime_spirited_away',
    title: '🏮《千与千寻》名场面 · 汤屋求职与钱婆婆的契约',
    koreanTitle: '『千と千尋の神隠し』· 油屋での契約と名セリフ',
    category: 'drama_roleplay',
    categoryLabel: '动漫对戏',
    levelTag: '中级 (N3~N2)',
    icon: '🎭',
    gradient: 'from-amber-600 to-red-600',
    description: '穿越至吉卜力神隐世界！面对性格威严的汤婆婆与钱婆婆，坚定说出「ここで働かせてください！」，体验动漫配音沉浸感！',
    targetSkills: ['使役表达', '动漫情绪演绎', '经典角色配音'],
    systemPrompt: '你是经典吉卜力动漫《千与千寻》中的神明汤屋主人“汤婆婆”。态度严厉但信守神明契约。用户想要在汤屋打工，你需要考验TA的决心。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '汤屋主人 汤婆婆',
        avatar: '👵🏻',
        ko: 'なんだい、お前は！人間の子供が迷い込んでくる場所じゃないんだよ！さっさと元の世界へお帰り！',
        jp: 'なんだい、お前は！人間の子供が迷い込んでくる場所じゃないんだよ！さっさと元の世界へお帰り！',
        zh: '怎么回事，你是谁啊！这里可不是人类小屁孩能闯进来的地方！赶紧给我回原来的世界去！',
        roman: 'Nandai, omae wa! Ningen no kodomo ga mayoikonde kuru basho ja nain da yo!...',
        grammarTip: '经典名台词接续：〜させてください（请让我做...，使役连用形 + てください）',
        suggestedResponses: [
          'ここで働かせてください！（请让我在这里工作！）',
          'お願いです！ここで働きたいんです！（求求您了！我想在这里工作！）'
        ]
      }
    ]
  },
  {
    id: 'jp_jlpt_speaking_01',
    title: '🎯 JLPT 实用学术面谈 · 研究生导师面试',
    koreanTitle: '大学院教授面談 · 研究計画書のプレゼン',
    category: 'jlpt_speaking',
    categoryLabel: 'JLPT实用会话',
    levelTag: '高级 (N1)',
    icon: '🎓',
    gradient: 'from-indigo-600 to-sky-700',
    description: '面对东京大学/京都大学研究生导师山本教授！如何用严谨的学术日语表达先行研究、问题意识与未来研究方向？',
    targetSkills: ['学术逻辑答辩', '先行研究分析', '教授导师答辩'],
    systemPrompt: '你是东京某国立大学大学院的教授“山本先生”。面试申请报考研究生的中国留学生，针对其提交的研究计划书，提出专业的问题意识考察。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '大学院教授 山本先生',
        avatar: '👨🏻‍🏫',
        ko: '李さん、研究計画書を拝見しました。日中比較文化論に関する着眼点は非常に興味深いですね。具体的に、どのような先行研究を参考にされたのでしょうか？',
        jp: '李さん、研究計画書を拝見しました。日中比較文化論に関する着眼点は非常に興味深いですね。具体的に、どのような先行研究を参考にされたのでしょうか？',
        zh: '李同学，我看了你的研究计划书。关于日中比较文化论的切入点非常耐人寻味。具体而言，你是参考了哪些先行研究呢？',
        roman: 'Ri-san, kenkyuu keikakusho o haiken shimashita...',
        grammarTip: '学术探讨常用：〜に着目する（着眼于...）；〜を参考に（以...为参考）',
        suggestedResponses: [
          'はい、佐藤教授の2022年の論文をもとに、若年層の消費動向に着目しました。（是的，以佐藤教授2022年的论文为基础，着眼于年轻群体的消费趋势。）',
          'これまでの先行研究では言及されていなかった課題を明らかにしたいと考えております。（我想查明此前先行研究中尚未提及的课题。）'
        ]
      }
    ]
  }
];
