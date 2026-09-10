/**
 * CS313 日语研习社 · AI 智能日语口语对练情景库
 * 覆盖：
 * 1. 自由随心畅聊 (东京语伴 1v1)
 * 2. 居酒屋地道点单
 * 3. 秋叶原谷子店购物
 * 4. 日企商务敬语面试
 * 5. 浅草寺旅游问路
 * 6. 动漫展与推し活交流
 */

export interface DialogueTurn {
  id: number;
  speaker: 'ai' | 'user';
  speakerName: string;
  avatar: string;
  ko: string; // 保持 ko 兼容外部组件，同时作为日语文本存储
  jp?: string;
  zh: string;
  roman?: string;
  grammarTip?: string;
  suggestedResponses?: string[];
  honorificNotice?: string;
}

export interface AIScenario {
  id: string;
  title: string;
  koreanTitle: string; // 兼容旧属性，存日文标题
  category: 'topik_speaking' | 'daily_life' | 'business_work' | 'campus_study' | 'drama_roleplay';
  categoryLabel: string;
  levelTag: '初级 (TOPIK 1-2)' | '中级 (TOPIK 3-4)' | '高级 (TOPIK 5-6)';
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
    categoryLabel: '自由畅聊 (无话题限制)',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '💬',
    gradient: 'from-pink-600 to-rose-600',
    description: '无任何固定题目限制！就像和东京的朋友在 LINE 聊天一样，你可以聊任何话题：动漫、美食、旅游、追星、吐槽日常，或随时向 AI 请教日语！',
    targetSkills: ['开放式日常会话', '自由话题表达', '地道东京腔口语'],
    referenceModelAnswer: '日本の生活や好きなアニメ、美味しい日本料理など、何でも気軽に話してくださいね！',
    systemPrompt: '你是住在东京、非常亲切热情的同龄朋友兼日语私教“花子（Hanako）”。用户可以和你聊世界上任何话题（动漫、美食、旅游、日剧、日常吐槽、日语问题等）。请根据用户的输入，用自然纯正地道的东京腔日常日语（丁寧体/口语）像朋友一样热情回复，倾听并提出新的有趣话题，附带中文翻译与地道口语Tip。',
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
    categoryLabel: '日本生活实战',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🍺',
    gradient: 'from-amber-600 to-orange-600',
    description: '走进新宿巷子里的居酒屋！从喊「すみません！」召唤店员，到「とりあえず生で！」「お通し」「お会計」，体验最地道的深夜食堂氛围！',
    targetSkills: ['居酒屋高频点单', '召唤店员礼仪', '账单结账用语'],
    systemPrompt: '你是东京新宿一家热闹居酒屋的热情店员“健太（Kenta）”。接待顾客入座、推荐今日特色烤鸡肉串与生啤，并解答客人的各种点单需求，态度爽朗热情。',
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
    id: 'jp_akihabara_01',
    title: '🛍️ 秋叶原谷子店 · 免税与限定版手办',
    koreanTitle: '秋葉原ホビーショップ · 免税手続きと限定フィギュア',
    category: 'daily_life',
    categoryLabel: '二次元购物实战',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🎮',
    gradient: 'from-indigo-600 to-purple-600',
    description: '在秋叶原动漫手办店淘限定周边！向店员询问库存、免税政策（Tax-Free）、展柜开锁与包装保护。',
    targetSkills: ['购物咨询', '免税退税表达', '商品细节确认'],
    systemPrompt: '你是秋叶原知名手办二次元周边店的店员“アスカ（Asuka）”。帮助顾客寻找手办、介绍免税条件（满5000日元出示护照）并引导结账。',
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
    id: 'jp_business_interview_01',
    title: '💼 日企商务面试 · 志望动机与敬语对答',
    koreanTitle: '日系企業面接 · 志望動機と自己PRの敬語実戦',
    category: 'business_work',
    categoryLabel: '职场与考级口试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '👔',
    gradient: 'from-blue-600 to-slate-800',
    description: '模拟日本知名商社的真实面试场面！熟练使用「〜と存じます」「拝見いたしました」，阐明志望动机与个人优势。',
    targetSkills: ['商务自谦语与尊敬语', '日企应聘逻辑', '清晰逻辑表达'],
    systemPrompt: '你是日本东京某著名跨国企业的人事主管“佐藤部长（Sato）”。主持正式的入职面试，严格考察应聘者的敬语规范、逻辑严谨度与志望动机。',
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
  }
];
