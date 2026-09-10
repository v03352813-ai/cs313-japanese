export interface GrammarCompareItem {
  id: string;
  title: string;
  category: '因果原因' | '目的意图' | '转折让步' | '假定条件' | '推测预估' | '时间伴随';
  level: '中级核心 (TOPIK 3-4)' | '高级精通 (TOPIK 5-6)';
  description: string;
  grammars: {
    name: string;
    meaning: string;
    condition: string;
    limitation: string;
    exampleKo: string;
    exampleZh: string;
  }[];
  trapWarning: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const GRAMMAR_COMPARE_DATA: GrammarCompareItem[] = [
  {
    id: "gc-01",
    title: "【因果三姐妹】 -느라고 vs -는 바람에 vs -아서/어서",
    category: "因果原因",
    level: "中级核心 (TOPIK 3-4)",
    description: "TOPIK 考卷出现频率最高、最易混淆的因果接续词尾辨析。",
    grammars: [
      {
        name: "-느라고",
        meaning: "因为忙于做某事，而导致负面结果/没能做成另一件事",
        condition: "前后主语必须一致；前句必须是动词且伴随主观意志努力；",
        limitation: "后句必须是消极、负面结果（如累了、迟到了、没买成），绝不能接命令句或共动句！",
        exampleKo: "어제 시험공부를 하느라고 잠을 한숨도 못 잤어요.",
        exampleZh: "昨天因为忙于复习考试，一眼都没能合上。"
      },
      {
        name: "-는 바람에",
        meaning: "因为突发意外/不可抗力因素，导致了意料之外的消极结果",
        condition: "前后主语可以不一致；前句多为不可控突发事件；",
        limitation: "必须接过去时负面消极结果；严禁用于积极好的结果，不能接命令句或建议句！",
        exampleKo: "갑자기 비가 오는 바람에 옷이 다 젖었어요.",
        exampleZh: "因为突然下起雨，衣服全被淋湿了。"
      },
      {
        name: "-아서/어서",
        meaning: "因为...所以...（最通用的自然因果关系）",
        condition: "前后时态只能在后句体现（前句不可接 -았/었-）；",
        limitation: "后句绝不能接命令句 -(으)십시오 或共动句 -(으)ㅂ시다。",
        exampleKo: "날씨가 너무 추워서 감기에 걸렸어요.",
        exampleZh: "因为天气太冷，所以得了感冒。"
      }
    ],
    trapWarning: "考场避坑：只要看到后句是积极好的结果（如 '장학금을 받았다'），绝对不能选 -느라고 和 -는 바람에！",
    quizQuestion: {
      question: "빈칸에 들어갈 알맞은 것을 고르십시오: '어젯밤에 드라마를 (     ) 오늘 아침에 늦잠을 잤다.'",
      options: ["보느라고", "보는 바람에", "보아서", "보려고"],
      correctIndex: 0,
      explanation: "主语是我，'看电视剧'是主观主动行为，导致了'睡过头'的负面结果，前后主语一致，最佳答案为 -느라고。"
    }
  },
  {
    id: "gc-02",
    title: "【目的意图】 -기로 하다 vs -(으)려고 하다 vs -고자 하다",
    category: "目的意图",
    level: "中级核心 (TOPIK 3-4)",
    description: "表达打算、决定、意图时的阶称与决定程度辨析。",
    grammars: [
      {
        name: "-기로 하다",
        meaning: "决定做某事（已经做好了约定或决定）",
        condition: "常以过去时 -기로 했다 形式出现；",
        limitation: "表示已经成型的确定决议或多人商定结果。",
        exampleKo: "올해부터 매일 아침 30분씩 조깅을 하기로 했어요.",
        exampleZh: "决定从今年起每天早晨慢跑30分钟。"
      },
      {
        name: "-(으)려고 하다",
        meaning: "打算/想要做某事（心中计划，尚未完全确定）",
        condition: "主语通常是第一人称或第三人称；",
        limitation: "表达个人主观打算，动作尚未实施。",
        exampleKo: "이번 주말에는 집에서 푹 쉬려고 해요.",
        exampleZh: "这周末打算在家里好好休息。"
      },
      {
        name: "-고자 하다",
        meaning: "想要/旨在做某事（高阶学术/演讲格式体）",
        condition: "TOPIK 54题大作文、官方演讲、公文汇报必备；",
        limitation: "属于最高书面格式，日常口语极少使用。",
        exampleKo: "본 연구는 현대인의 스트레스 원인을 규명하고자 한다.",
        exampleZh: "本研究旨在查明现代人压力的成因。"
      }
    ],
    trapWarning: "写作提分：在 54 题议论文中，将 '-(으)려고 한다' 替换为 '-고자 한다' 可直接提升词汇学术档次！",
    quizQuestion: {
      question: "TOPIK 54번 학술 논술문 작성 시 가장 격식 있는 표현은?",
      options: ["해결책을 마련하고자 한다.", "해결책을 마련하려고 한다.", "해결책을 마련하기로 했다.", "해결책을 마련하고 싶다."],
      correctIndex: 0,
      explanation: "学术论文与社科论述中，-고자 하다 具备最高书面客观性与严谨度。"
    }
  },
  {
    id: "gc-03",
    title: "【转折让步】 -지만 vs -(으)ㄴ/는데 vs -(으)ㅁ에도 불구하고",
    category: "转折让步",
    level: "高级精通 (TOPIK 5-6)",
    description: "从基础转折到高级客观让步的层级演进辨析。",
    grammars: [
      {
        name: "-지만",
        meaning: "虽然...但是...（纯粹强转折对比）",
        condition: "前后两分句语义形成直接对立；",
        limitation: "对立对比最鲜明，适用范围最广。",
        exampleKo: "한국어는 어렵지만 정말 재미있어요.",
        exampleZh: "韩语虽然难，但是非常有趣。"
      },
      {
        name: "-(으)ㄴ/는데",
        meaning: "虽然...但是... / 提示背景情况",
        condition: "既可做轻微转折，也可作引出下文的背景铺垫；",
        limitation: "口语中极高频，转折语气比 -지만 更加柔和委婉。",
        exampleKo: "비가 오는데 우산이 없어서 걱정이에요.",
        exampleZh: "下雨了却没有伞，真让人担心。"
      },
      {
        name: "-(으)ㅁ에도 불구하고",
        meaning: "尽管存在某种不利条件/前提，仍然...",
        condition: "名词/名转化 + 에도 불구하고；",
        limitation: "TOPIK 5~6级阅读长难句与写作高分句型，表示克服极大阻碍。",
        exampleKo: "수많은 역경에도 불구하고 마침내 꿈을 이루어 냈다.",
        exampleZh: "尽管历经重重逆境，最终还是实现了梦想。"
      }
    ],
    trapWarning: "在高级阅读题中，看到 -(으)ㅁ에도 불구하고 之后的内容，往往是文章的核心主题与作者极力赞颂的结论！",
    quizQuestion: {
      question: "다음 중 역경을 딛고 성공한 맥락에 가장 어울리는 고급 문법은?",
      options: ["어려움에도 불구하고", "어려운데", "어려우면서", "어렵기로서니"],
      correctIndex: 0,
      explanation: "克服困难取得成就的情境下，-(으)ㅁ에도 불구하고 具有最强烈的让步与赞誉色彩。"
    }
  },
  {
    id: "gc-04",
    title: "【推测预估】 -(으)ㄹ 것 같다 vs -나 보다 / -(으)ㄴ가 보다 vs -(으)ㄹ 텐데",
    category: "推测预估",
    level: "中级核心 (TOPIK 3-4)",
    description: "基于证据观察、主观感觉、惋惜预期的推测句型辨析。",
    grammars: [
      {
        name: "-(으)ㄹ 것 같다",
        meaning: "好像会... / 似乎...（最通用的个人主观推测或委婉表达）",
        condition: "动词、形容词均可接续（时态可变 -(으)ㄴ/는/(으)ㄹ）；",
        limitation: "多为主观直觉推断，或用于使语气委婉礼貌。",
        exampleKo: "내일은 비가 올 것 같아요.",
        exampleZh: "明天好像要下雨。"
      },
      {
        name: "-나 보다 / -(으)ㄴ가 보다",
        meaning: "看来是...（基于眼前看到的客观线索/证据推导）",
        condition: "动词接 -나 보다，形容词接 -(으)ㄴ가 보다；",
        limitation: "必须有眼见为实的间接线索（如看到大家都撑伞，推断外面在下雨）。",
        exampleKo: "사람들이 우산을 쓴 걸 보니 밖에 비가 오나 봐요.",
        exampleZh: "看到人们撑着伞，看来外面是在下雨呢。"
      },
      {
        name: "-(으)ㄹ 텐데",
        meaning: "按理说应该会... / 预计会...（伴随担忧、建议或惋惜）",
        condition: "-(으)ㄹ 터이다 + -(으)ㄴ데 组合而成；",
        limitation: "后句通常引出对对方的体贴建议或与前句预期的转折。",
        exampleKo: "오늘 많이 피곤할 텐데 일찍 들어가서 쉬세요.",
        exampleZh: "今天应该很累了，快点回去休息吧。"
      }
    ],
    trapWarning: "如果题目中有 '눈으로 보다', '듣다보니' 等明确的观察线索，优先选择基于线索推断的 -나 보다！",
    quizQuestion: {
      question: "'불이 꺼져 있는 것을 보니 모두 (     ).' 에 들어갈 알맞은 말은?",
      options: ["퇴근했나 봐요", "퇴근할 텐데요", "퇴근할 것 같아요", "퇴근하기로 했어요"],
      correctIndex: 0,
      explanation: "看到'灯灭了'这一确凿的客观证据，进行推理判断，应使用 -나 보다。"
    }
  }
];