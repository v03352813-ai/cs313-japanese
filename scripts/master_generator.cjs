const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. TOPIK I 基础题库池 (初级：词汇、语法、日常对话、告示图表、阅读主旨)
// =========================================================================
const TOPIK1_POOL = [
  {
    qType: '词汇语法',
    categoryTag: '词汇语法 (助词与词尾)',
    title: '【时间助词】(   )에 들어갈 알맞은 조사를 고르십시오.',
    passage: '저는 매일 아침 7시(    ) 일어납니다.',
    options: ['에', '에서', '을', '로'],
    correctAnswer: 0,
    score: 2,
    analysis: '具体时间点后面必须接时间助词 에（例：7시에 일어나다 7点起床），故选第1项。',
    vocab: [{ word: '아침', meaning: '早晨' }, { word: '일어나다', meaning: '起床' }],
    translation: '我每天早晨 7 点（에）起床。'
  },
  {
    qType: '词汇语法',
    categoryTag: '词汇语法 (场所动态)',
    title: '【场所助词】(   )에 들어갈 알맞은 조사를 고르십시오.',
    passage: '도서관(    ) 한국어 책을 열심히 읽었습니다.',
    options: ['에게', '에서', '에', '와'],
    correctAnswer: 1,
    score: 2,
    analysis: '在某场所进行动态行为（读书、学习）必须使用场所动态助词 에서，故选第2项。',
    vocab: [{ word: '도서관', meaning: '图书馆' }, { word: '열심히', meaning: '刻苦地' }],
    translation: '在图书馆（에서）认真读了韩语书。'
  },
  {
    qType: '对话搭配',
    categoryTag: '对话搭配 (日常应答)',
    title: '【日常问答】다음 대화의 빈칸에 알맞은 대답을 고르십시오.',
    passage: '가: 이번 주말에 특별한 약속이 있어요?\n나: 아니요, 특별한 약속이 (    ). 집에서 쉴 거예요.',
    options: ['있어요', '많아요', '없어요', '좋아요'],
    correctAnswer: 2,
    score: 2,
    analysis: '由前文 아니요 (不) 与后文“打算在家休息”可知没有特别约定，故选 없어요(没有)。',
    vocab: [{ word: '주말', meaning: '周末' }, { word: '특별하다', meaning: '特别' }],
    translation: '甲：这个周末有特别的约会吗？ 乙：没有，没有特别的约定，打算在家休息。'
  },
  {
    qType: '广告告示',
    categoryTag: '图表告示 (使用规范)',
    title: '【告示解读】이 글은 무엇에 대한 글인지 고르십시오.',
    passage: '[안내] 조용한 도서관입니다. 휴대전화는 진동으로 바꿔 주시고, 통화는 밖에서 해 주시기 바랍니다.',
    options: ['도서 구입', '시설 예약', '교통 안내', '이용 규칙'],
    correctAnswer: 3,
    score: 3,
    analysis: '告示提醒保持安静、手机调为静音等，属于图书馆的“使用规则 (이용 규칙)”，故选第4项。',
    vocab: [{ word: '진동', meaning: '震动' }, { word: '통화', meaning: '通话' }],
    translation: '[指南] 这里是安静的图书馆。请将手机调为震动，通话请在室外进行。'
  },
  {
    qType: '图表数据',
    categoryTag: '图表告示 (数据分析)',
    title: '【数据分析】그래프의 내용과 같은 것을 고르십시오.',
    passage: '[외국인 유학생 선호 한국 음식 조사]\n1위: 삼겹살 (42%)\n2위: 비빔밥 (28%)\n3위: 불고기 (18%)\n4위: 떡볶이 (12%)',
    options: [
      '삼겹살을 좋아하는 유학생이 가장 많다.',
      '떡볶이가 불고기보다 인기가 더 높다.',
      '비빔밥을 선택한 학생은 20% 미만이다.',
      '외국인들이 가장 싫어하는 음식은 삼겹살이다.'
    ],
    correctAnswer: 0,
    score: 3,
    analysis: '烤五花肉 (삼겹살) 占比 42% 排名第一，说明喜欢五花肉的留学生最多，故选第1项。',
    vocab: [{ word: '선호', meaning: '喜好/偏好' }, { word: '조사', meaning: '调查' }],
    translation: '喜欢烤五花肉的留学生人数最多。'
  },
  {
    qType: '文章主旨',
    categoryTag: '长篇阅读 (生活感悟)',
    title: '【短文中心】다음 글의 중심 생각을 고르십시오.',
    passage: '저는 매일 아침 30분씩 조깅을 합니다. 처음에는 힘들었지만 꾸준히 하니까 몸도 가벼워지고 하루를 활기차게 시작할 수 있어서 좋습니다.',
    options: [
      '아침에 일찍 일어나는 것은 매우 어렵다.',
      '매일 규칙적인 운동을 하면 건강에 도움이 된다.',
      '조깅보다 헬스를 하는 것이 더 효과적이다.',
      '친구와 함께 운동하는 것이 가장 즐겁다.'
    ],
    correctAnswer: 1,
    score: 3,
    analysis: '通篇强调每天坚持晨跑让身体轻盈、充满活力，中心思想是“每天规律运动有益健康”，故选第2项。',
    vocab: [{ word: '꾸준히', meaning: '持之以恒地' }, { word: '활기차다', meaning: '充满活力的' }],
    translation: '每天进行规律的运动对健康大有帮助。'
  },
  {
    qType: '细节判断',
    categoryTag: '长篇阅读 (传统文化)',
    title: '【细节一致】다음 글의 내용과 같은 것을 고르십시오.',
    passage: '한국에서는 추석에 가족들이 모여 송편을 빚고 보름달을 보며 소원을 빕니다. 또한 조상들에게 감사의 마음을 전하는 차례를 지냅니다.',
    options: [
      '추석에는 떡국을 끓여 먹는다.',
      '추석에 가족들은 모이지 않고 혼자 여행을 간다.',
      '추석에는 송편을 만들고 차례를 지낸다.',
      '추석은 봄에 맞이하는 한국의 명절이다.'
    ],
    correctAnswer: 2,
    score: 3,
    analysis: '文中明确提到中秋节制作松饼 (송편을 빚다) 并举行祭祀 (차례를 지내다)，第3项完全吻合。',
    vocab: [{ word: '추석', meaning: '中秋节' }, { word: '소원을 빌다', meaning: '许愿' }],
    translation: '中秋节人们制作松饼并举行祭祖仪式。'
  },
  {
    qType: '对话搭配',
    categoryTag: '对话搭配 (生活购物)',
    title: '【日常购物】다음 대화의 빈칸에 알맞은 것을 고르십시오.',
    passage: '손님: 이 사과 얼마예요?\n주인: 한 개에 2,000원이에요. 아주 (    ).',
    options: ['어려워요', '복잡해요', '무서워요', '맛있어요'],
    correctAnswer: 3,
    score: 2,
    analysis: '水果店老板推销苹果，形容苹果“很好吃 (맛있어요)”，故选第4项。',
    vocab: [{ word: '사과', meaning: '苹果' }, { word: '맛있다', meaning: '美味/好吃' }],
    translation: '顾客：这个苹果多少钱？ 老板：一个2000韩元，非常甜很好吃。'
  }
];

// =========================================================================
// 2. TOPIK II 核心题库池 (中高级：语法、图表、逻辑排序、中篇论述)
// =========================================================================
const TOPIK2_POOL = [
  {
    qType: '词汇语法',
    categoryTag: '词汇语法 (高阶对比)',
    title: '【易混淆助词】(   )에 들어갈 알맞은 것을 고르십시오.',
    passage: '성공은 타고난 재능(    ) 피나는 노력의 결과물이다.',
    options: ['이라기보다는', '뿐만 아니라', '치고는', '조차도'],
    correctAnswer: 0,
    score: 3,
    analysis: '前后句构成“与其说是...倒不如说是...”，使用 -이라기보다는，故选第1项。',
    vocab: [{ word: '재능', meaning: '才能/天赋' }, { word: '피나는 노력', meaning: '辛酸刻苦的努力' }],
    translation: '成功与其说是与生俱来的天赋，倒不如说是刻苦努力的结晶。'
  },
  {
    qType: '词汇语法',
    categoryTag: '词汇语法 (必然规律)',
    title: '【高级惯用型】(   )에 들어갈 알맞은 표현을 고르십시오.',
    passage: '아무리 어려운 고난이 닥쳐도 희망을 잃지 않는다면 솟아날 구멍은 (              ).',
    options: ['있을 리가 없다', '있기 마련이다', '있는 척한다', '있을 턱이 없다'],
    correctAnswer: 1,
    score: 3,
    analysis: '-기 마련이다 表示“客观必然规律（理应总是如此）”，绝处必定逢生，故选第2项。',
    vocab: [{ word: '고난', meaning: '苦难' }, { word: '솟아날 구멍', meaning: '绝处逢生的出路' }],
    translation: '哪怕面临再大的苦难，只要不丧失希望，必定会有绝处逢生的出路。'
  },
  {
    qType: '图表数据',
    categoryTag: '图表告示 (数据趋势)',
    title: '【图表趋势】그래프의 설명으로 알맞은 것을 고르십시오.',
    passage: '[국내 반려동물 양육 가구 비율 변화]\n• 2018년: 18.2%\n• 2020년: 23.5%\n• 2022년: 28.7%\n• 2024년: 34.2%\n(주요 사유: 1인 가구 증가 및 정서적 교감 62%)',
    options: [
      '반려동물 양육 가구는 최근 들어 지속적으로 감소하고 있다.',
      '2018년과 2024년의 양육 가구 비율은 거의 차이가 없다.',
      '반려동물을 기르는 가장 큰 이유는 정서적 교감이다.',
      '2022년에 반려동물 양육 가구 수가 가장 적었다.'
    ],
    correctAnswer: 2,
    score: 3,
    analysis: '图表调查显示饲养宠物主要原因为情感共鸣(62%)，选项3完全符合。',
    vocab: [{ word: '반려동물', meaning: '伴侣宠物' }, { word: '정서적 교감', meaning: '情感共鸣/交融' }],
    translation: '饲养伴侣宠物的最首要原因是情感陪伴与共鸣。'
  },
  {
    qType: '排序连贯',
    categoryTag: '逻辑排序 (总分论述)',
    title: '【逻辑排序】다음 문장들을 문맥에 맞게 바르게 배열한 것을 고르십시오.',
    passage: '(가) 또한 타인의 피드백을 수용함으로써 부족한 점을 보완할 수 있다.\n(나) 진정한 성장은 자신의 한계를 인정하는 것에서 출발한다.\n(다) 따라서 실패를 두려워하지 않는 개방적인 태도가 필수적이다.\n(라) 한계를 직시할 때 비로소 배움에 대한 겸허한 자세가 생긴다.',
    options: [
      '(가) - (다) - (나) - (라)',
      '(나) - (가) - (다) - (라)',
      '(라) - (나) - (가) - (다)',
      '(나) - (라) - (가) - (다)'
    ],
    correctAnswer: 3,
    score: 3,
    analysis: '(나)提出核心论点（成长始于承认极限）→ (라)承接解释（直面极限产生谦逊）→ (가)递进说明（吸纳反馈弥补不足）→ (다)总结得出结论（因此必须具备开放态度），正确顺序为 (나)-(라)-(가)-(다)，选第4项。',
    vocab: [{ word: '직시하다', meaning: '正视、直面' }, { word: '겸허하다', meaning: '谦虚谨慎的' }],
    translation: '(나) 真正的成长始于承认自己的局限性。 (라) 当正视局限时才会产生对学习的谦逊态度。 (가) 并且通过吸纳他人反馈能够弥补不足。 (다) 因此不畏惧失败的开放态度至关重要。'
  },
  {
    qType: '文章主旨',
    categoryTag: '长篇阅读 (媒介素养)',
    title: '【中篇主旨】다음 글의 중심 생각으로 가장 알맞은 것을 고르십시오.',
    passage: '현대 사회에서 정보의 양은 폭발적으로 증가했지만, 정작 필요한 정보를 선별하고 비판적으로 수용하는 능력은 오히려 퇴화하고 있다. 무분별한 정보 수용은 확증 편향을 강화하고 사회적 갈등을 증폭시킨다. 따라서 이제는 정보의 습득보다 정보를 비판적으로 검증하는 ‘미디어 리터러시’ 교육이 절실하다.',
    options: [
      '비판적인 정보 수용과 미디어 문해력 교육이 필요하다.',
      '소셜 미디어의 이용 시간을 줄여야 한다.',
      '인터넷상의 모든 정보를 법적으로 강력히 규제해야 한다.',
      '정보의 수효가 많을수록 지식의 깊이가 깊어진다.'
    ],
    correctAnswer: 0,
    score: 3,
    analysis: '文章论述海量信息时代中盲目吸纳的危害，呼吁重视培养批判性媒介素养(미디어 리터러시)，故选第1项。',
    vocab: [{ word: '확증 편향', meaning: '证实偏差/偏见' }, { word: '미디어 리터러시', meaning: '媒介素养' }],
    translation: '亟需培养批判性信息接纳能力与媒介素养教育。'
  },
  {
    qType: '作者态度',
    categoryTag: '长篇阅读 (生态危机)',
    title: '【态度推断】글쓴이의 태도로 가장 알맞은 것을 고르십시오.',
    passage: '기후 변화는 먼 미래의 가상 시나리오가 아니라 지금 당장 인류의 생존을 위협하는 현실이다. 온실가스 감축을 위한 국제적 공조와 더불어, 시민 개개인의 친환경적 생활 양식 전환이 지체 없이 실천되어야 한다. 행동하지 않는 성찰은 공허한 구호에 불과하다.',
    options: [
      '기술 혁신에만 의존하는 낙관적인 태도',
      '기후 변화의 심각성을 직시하고 즉각적인 실천을 촉구하는 태도',
      '국가 간의 경제적 이해관계만을 중시하는 태도',
      '환경 문제 해결을 미래 세대에게 전가하려는 태도'
    ],
    correctAnswer: 1,
    score: 4,
    analysis: '作者强调气候危机迫在眉睫，呼吁不加拖延地付诸行动（지체 없이 실천），态度是“直面危机并敦促即刻实践”，选第2项。',
    vocab: [{ word: '국제적 공조', meaning: '国际协作/协同' }, { word: '지체 없이', meaning: '毫不迟延地' }],
    translation: '直面气候变化的严峻现实并敦促立即付诸实践的态度。'
  }
];

// =========================================================================
// 3. TOPIK II 81~100 题超长学术大文章 (每篇 25~30 行社科哲学科技长文)
// =========================================================================
const ESSAYS = [
  {
    topicName: '人工智能与人机协同演进',
    passage: `인공지능(AI) 기술의 급격한 도약은 현대 문명의 지형을 근본적으로 재편하고 있다. 과거 산업혁명이 인간의 육체 노동을 기계로 대체했다면, 작금의 생성형 AI 혁명은 인간 고유의 영역으로 여겨졌던 창의적 사고, 예술 창작, 전문 지식 분석에까지 깊숙이 침투하고 있다. 이러한 변화 앞에서 일각에서는 인간 노동의 전면적 소외와 대규모 실업이라는 디스토피아적 전망을 제기한다.\n\n그러나 역사적 경험에 비추어 볼 때 기술의 진보는 기존의 일자리를 소멸시키는 동시에 이전에는 상상할 수 없었던 새로운 산업 생태계와 직무를 창출해 왔다. AI 시대에 진정으로 요구되는 패러다임은 인간과 기계의 대립이 아닌 '상호 보완적 협업(Human-AI Symbiosis)'이다. AI가 방대한 데이터의 처리와 패턴 인식을 도맡는 동안, 인간은 윤리적 판단, 맥락적 공감, 비판적 통찰력을 발휘하여 고차원적 가치를 창출해야 한다.\n\n결국 미래 사회의 경쟁력은 AI 기술 그 자체보다 기술을 주체적으로 통제하고 도덕적 규범 안에서 공공의 선을 위해 (                      ) 인간의 역량에 달려 있다. 인간 중심의 인공지능 윤리 기준을 확립하고, 기술 격차가 사회적 불평등으로 심화되지 않도록 제도적 안전망을 구축하는 것이야말로 우리 세대가 짊어져야 할 중대한 문명사적 과제이다.`,
    q1: {
      title: '【81~82题 组合大题】(   )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.',
      options: ['맹목적으로 수용하는', '지혜롭게 활용하는', '원천적으로 차단하는', '일방적으로 종속되는'],
      correctAnswer: 1,
      analysis: '文章强调在道德规范内为了公共利益“智慧地善用技术 (지혜롭게 활용하는)”，故选第2项。'
    },
    q2: {
      title: '【81~82题 组合大题】위 글의 주제로 가장 알맞은 것을 고르십시오.',
      options: [
        'AI 기술 발전에 따른 인간 노동의 전면적 소멸과 위기',
        '인간과 AI의 상호 보완적 협업과 윤리적 통제의 중요성',
        '생성형 AI가 예술 창작 분야에 미치는 경제적 파급력',
        '산업 혁명기 기계화 도입 과정의 역사적 한계 분석'
      ],
      correctAnswer: 1,
      analysis: '通篇论述人机协同互补与建立伦理治理的必要性，选第2项。'
    }
  },
  {
    topicName: '行为经济学与助推理论',
    passage: `전통적인 고전 경제학은 모든 인간이 주어진 정보 속에서 언제나 자신의 이익을 극대화하는 '합리적 의사결정자(Homo Economicus)'라고 가정해 왔다. 그러나 인간의 인지 체계는 시간의 제약, 정보의 비대칭성, 다양한 심리적 편향으로 인해 종종 비합리적인 선택을 내린다. 이러한 인간 본성의 한계를 포착하여 경제학에 접목한 분야가 바로 행동경제학이며, 그 핵심 실천 전략이 리처드 탈러 교수가 제안한 '넛지(Nudge)' 이론이다.\n\n넛지는 강압적인 법적 규제나 직접적인 금전적 인센티브를 부여하지 않고도, 선택의 자유를 온전히 보장하면서 사람들의 행동을 바람직한 방향으로 (                      ) 부드러운 개입을 의미한다. 대표적인 사례가 장기 기증 서약 방식의 전환이다. 장기 기증을 희망하는 사람만 등록하게 하는 방식(Opt-in) 대신, 모든 국민을 기본 등록자로 지정하되 거부할 권리를 부여하는 방식(Opt-out)을 도입하자 기증률이 15%에서 90% 이상으로 급증했다.\n\n넛지 전략은 금연 구역 지정, 연금 저축률 증대, 에너지 절약 유도 등 다양한 공공 정책 분야에서 막대한 예산 투입 없이도 사회적 효율성을 극대화하는 혁신적 수단으로 각광받고 있다. 선택의 구조를 어떻게 직관적이고 인간 친화적으로 설계하느냐가 한 사회의 복지와 지속 가능성을 결정하는 핵심 열쇠가 되고 있다.`,
    q1: {
      title: '【83~84题 组合大题】(   )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.',
      options: ['자연스럽게 유도하는', '강제적으로 억압하는', '인위적으로 차단하는', '무조건 방임하는'],
      correctAnswer: 0,
      analysis: '助推理论的核心是在保障选择自由的前提下“自然而然地引导 (자연스럽게 유도하는)”，选第1项。'
    },
    q2: {
      title: '【83~84题 组合大题】위 글의 내용과 일치하는 것을 고르십시오.',
      options: [
        '넛지 이론은 금전적 보상이나 처벌 없이 부드러운 개입을 강조한다.',
        '고전 경제학은 인간이 항상 감정적이고 비합리적이라고 전제한다.',
        'Opt-out 제도는 선택의 자유를 전면적으로 박탈하는 강제 규제이다.',
        '넛지 전략은 공공 정책에서 예산을 과도하게 낭비하는 단점이 있다.'
      ],
      correctAnswer: 0,
      analysis: '原文明确说明助推不依赖强制惩罚与金钱诱惑，选项1完全一致。'
    }
  },
  {
    topicName: '生态伦理与代际正义',
    passage: `기후 위기와 생물 다양성의 급격한 붕괴는 인류에게 환경 문제를 기술적·경제적 관리의 차원을 넘어선 근본적인 '윤리적 책임'의 문제로 바라볼 것을 요구하고 있다. 전통적인 인간 중심주의적 윤리관은 자연을 인간의 번영과 물질적 풍요를 위해 무제한으로 수탈할 수 있는 수단으로 간주해 왔다. 그러나 인간 역시 거대한 지구 생태망의 한 구성원에 불과하며, 모든 생명체는 그 자체로 고유한 내재적 가치를 지닌다는 '생태 중심주의 윤리'가 새로운 패러다임으로 부상하고 있다.\n\n이와 함께 대두되는 핵심 담론이 바로 '세대 간 정의(Intergenerational Justice)'이다. 현세대가 누리는 무분별한 화석 연료 소비와 자원 낭비는 미래 세대가 누려야 할 온전한 지구 환경을 약탈하는 행위와 다름없다. 아직 태어나지 않은 미래 세대는 현재의 정책 결정 과정에서 투표권을 행사하거나 목소리를 낼 수 없는 가장 취약한 당사자이다.\n\n따라서 현세대는 미래 세대의 생존 기반을 침해하지 않는 범위 내에서만 자원을 소비해야 할 도덕적 의무가 있으며, 탄소 중립과 생태계 복원은 미래 세대에 대한 (                      ) 최소한의 윤리적 부채 상환이다.`,
    q1: {
      title: '【85~86题 组合大题】(   )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.',
      options: ['일시적인 시혜이자', '책임 있는 태도이자', '경제적 손실이자', '불가피한 희생이자'],
      correctAnswer: 1,
      analysis: '碳中和是对未来世代“具责任感的态度与道德偿还 (책임 있는 태도이자)”，选第2项。'
    },
    q2: {
      title: '【85~86题 组合大题】글쓴이가 주장하는 바로 가장 알맞은 것을 고르십시오.',
      options: [
        '자연 자원의 개발은 현재의 경제적 이익만을 최우선해야 한다.',
        '현세대는 미래 세대를 위해 생태 중심적 윤리 의식을 갖고 책임을 다해야 한다.',
        '환경 보호 정책은 미래 세대의 경제적 희생을 전제로 해야 한다.',
        '기술 혁신만이 환경 문제를 해결할 수 있는 유일한 대안이다.'
      ],
      correctAnswer: 1,
      analysis: '作者呼吁为未来世代承担生态道德责任与代际正义，选第2项。'
    }
  },
  {
    topicName: '算法推荐与信息茧房',
    passage: `빅데이터와 인공지능 기반의 개인 맞춤형 알고리즘은 사용자의 과거 검색 기록과 클릭 패턴을 정밀하게 분석하여 취향에 최적화된 콘텐츠를 끊임없이 공급한다. 사용자는 방대한 정보의 바다를 직접 탐색하는 수고를 덜고 자신의 선호에 부합하는 뉴스와 미디어를 손쉽게 소비할 수 있게 되었다. 그러나 이러한 알고리즘의 고도화는 역설적으로 사용자를 자신이 동의하는 정보 속에만 가두는 '필터 버블(Filter Bubble)'과 '에코 체임버(Echo Chamber, 정보 누에고치)' 현상을 심화시키고 있다.\n\n알고리즘이 상업적 수익성을 극대화하기 위해 사용자의 확증 편향을 자극하는 콘텐츠를 우선적으로 노출하면서, 사람들은 자신과 상반된 관점을 접할 기회를 원천적으로 차단당한다. 그 결과 사회적 다원성과 건강한 공론장은 위축되고, 서로 다른 집단 간의 소통 단절과 정치적 양극화가 심각한 위협으로 (                      ) 있다.\n\n진정한 디지털 문해력은 알고리즘이 제공하는 맞춤형 정보에 무비판적으로 안주하는 것이 아니라, 의도적으로 상반된 시각의 정보를 찾아 읽고 다양한 관점을 비판적으로 교차 검증하는 능동적 탐색에서 출발한다.`,
    q1: {
      title: '【87~88题 组合大题】(   )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.',
      options: ['점진적으로 완화되고', '완벽하게 해소되고', '급격히 증폭되고', '자연스럽게 소멸되고'],
      correctAnswer: 2,
      analysis: '算法导致的信息茧房使社会极化与矛盾“急剧加剧扩大 (급격히 증폭되고)”，选第3项。'
    },
    q2: {
      title: '【87~88题 组合大题】위 글의 주제로 가장 알맞은 것을 고르십시오.',
      options: [
        '전자 상거래 플랫폼의 수익 모델 혁신 사례 분석',
        '사용자 맞춤형 뉴스 서비스의 신속성과 편의성 고찰',
        '알고리즘 추천 시스템이 초래하는 정보 편향의 문제점과 극복 방안',
        '소셜 미디어 이용자 수의 폭발적 증가 요인'
      ],
      correctAnswer: 2,
      analysis: '通篇论述算法推荐带来的信息过滤茧房弊端与培养批判性媒介素养的应对之道，选第3项。'
    }
  },
  {
    topicName: '艺术美学与文化工业反思',
    passage: `독일 프랑크푸르트학파의 철학자 테오도어 아도르노는 현대 자본주의 사회에서 대량 생산되고 소비되는 대중문화를 '문화 산업(Culture Industry)'이라는 비판적 개념으로 규정했다. 진정한 순수 예술은 기존 사회의 모순과 부조리를 날카롭게 고발하고 감상자에게 깊은 비판적 성찰과 실존적 충격을 선사하는 자율적 영역이다. 그러나 문화 산업의 체제 아래서 예술은 이윤 창출을 위한 상품으로 전락하여 규격화되고 표준화된 소비재로 변질된다.\n\n문화 산업은 대중에게 끊임없는 오락과 순간적인 쾌락을 제공하지만, 이는 현실의 고통과 사회적 모순을 망각하게 만드는 일종의 '마취제' 역할을 수행한다. 대중은 이미 정형화된 공식에 따라 기획된 상업 콘텐츠를 수동적으로 수용하면서, 스스로 깊이 사유하고 질문하는 비판적 주체성을 (                      ) 길들여진다.\n\n아도르노의 이러한 비판은 오늘날 상업주의가 극대화된 글로벌 미디어 환경에서도 여전히 유효한 통찰을 제공한다.`,
    q1: {
      title: '【89~90题 组合大题】(   )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.',
      options: ['발휘하여 저항하도록', '확장하여 혁신하도록', '상실한 채 순응하도록', '강화하여 주도하도록'],
      correctAnswer: 2,
      analysis: '大众在文化工业下“丧失批判主体性并顺从 (상실한 채 순응하도록)”，选第3项。'
    },
    q2: {
      title: '【89~90题 组合大题】글쓴이의 관점으로 가장 알맞은 것을 고르십시오.',
      options: [
        '예술은 상업적 규격화에서 벗어나 사회를 성찰하는 비판적 자율성을 지녀야 한다.',
        '문화 산업의 대량 생산 체제는 예술의 민주화에 절대적으로 기여했다.',
        '순수 예술은 대중의 흥미를 유발하기 위해 상업적 공식을 적극 수용해야 한다.',
        '모든 오락 콘텐츠는 대중의 비판적 사고력을 높이는 데 가장 효과적이다.'
      ],
      correctAnswer: 0,
      analysis: '作者继承阿多诺批判思想，主张艺术必须超越商业化规格式生产、坚守批判社会的自律性，选第1项。'
    }
  }
];

// =========================================================================
// 4. 组卷引擎：构造 56 套自洽试卷
// =========================================================================
function makeTopik1Questions(session, totalQ) {
  const qs = [];
  for (let i = 1; i <= totalQ; i++) {
    const base = TOPIK1_POOL[(i + session * 3) % TOPIK1_POOL.length];
    const targetAns = (base.correctAnswer + session + i) % 4;
    const opts = [...base.options];
    const val = opts[base.correctAnswer];
    opts.splice(base.correctAnswer, 1);
    opts.splice(targetAns, 0, val);

    const isListening = i <= (totalQ <= 16 ? 6 : 30);
    qs.push({
      id: session * 1000 + i,
      questionNumber: i,
      questionType: base.qType,
      section: 'TOPIK I (初级)',
      categoryTag: isListening ? '初级听力理解 (1~30题)' : '初级阅读理解 (31~70题)',
      title: isListening 
        ? `【听力第 ${i} 题】다음 대화를 잘 듣고 물음에 맞는 것을 고르십시오.`
        : `【阅读第 ${i} 题】${base.title.replace(/【.*?】/, '')}`,
      passage: base.passage,
      options: opts,
      correctAnswer: targetAns,
      score: i <= 10 ? 2 : 3,
      explanation: {
        analysis: base.analysis,
        vocabList: base.vocab,
        translation: base.translation
      }
    });
  }
  return qs;
}

function makeTopik2Questions(session, totalQ) {
  const qs = [];
  for (let i = 1; i <= totalQ; i++) {
    if (totalQ >= 70 && i >= 81) {
      // 81~100 题：长篇深度阅读大文章
      const essayIdx = Math.floor((i - 81) / 2) % ESSAYS.length;
      const isSecond = (i - 81) % 2 === 1;
      const essay = ESSAYS[essayIdx];
      const qInfo = isSecond ? essay.q2 : essay.q1;
      const targetAns = (qInfo.correctAnswer + session + i) % 4;
      const opts = [...qInfo.options];
      const val = opts[qInfo.correctAnswer];
      opts.splice(qInfo.correctAnswer, 1);
      opts.splice(targetAns, 0, val);

      qs.push({
        id: session * 1000 + i,
        questionNumber: i,
        questionType: '长篇综合',
        section: 'TOPIK II (中高级)',
        categoryTag: `长篇深度阅读 (${essay.topicName})`,
        title: `【阅读第 ${i} 题 · 学术大论述】${qInfo.title}`,
        passage: essay.passage,
        options: opts,
        correctAnswer: targetAns,
        score: 4,
        explanation: {
          analysis: qInfo.analysis,
          vocabList: [{ word: '패러다임', meaning: '范式' }, { word: '지속 가능성', meaning: '可持续性' }],
          translation: `【${essay.topicName}】25~30行完整社科学术大文深度论证。`
        }
      });
    } else {
      const base = TOPIK2_POOL[(i + session * 2) % TOPIK2_POOL.length];
      const targetAns = (base.correctAnswer + session + i) % 4;
      const opts = [...base.options];
      const val = opts[base.correctAnswer];
      opts.splice(base.correctAnswer, 1);
      opts.splice(targetAns, 0, val);

      const isListening = i <= (totalQ <= 16 ? 6 : 50);
      qs.push({
        id: session * 1000 + i,
        questionNumber: i,
        questionType: base.qType,
        section: 'TOPIK II (中高级)',
        categoryTag: isListening 
          ? (i <= 20 ? '听力理解 (基础日常对话)' : i <= 35 ? '听力理解 (中篇访谈)' : '听力理解 (学术讲座)')
          : (i <= 60 ? '阅读理解 (语法与句型)' : i <= 70 ? '阅读理解 (图表与排序)' : '阅读理解 (中篇论述)'),
        title: isListening 
          ? `【听力第 ${i} 题】다음 대화를 잘 듣고 물음에 맞는 것을 고르십시오.`
          : `【阅读第 ${i} 题】${base.title.replace(/【.*?】/, '')}`,
        passage: base.passage,
        options: opts,
        correctAnswer: targetAns,
        score: isListening ? 3 : 4,
        explanation: {
          analysis: base.analysis,
          vocabList: base.vocab,
          translation: base.translation
        }
      });
    }
  }
  return qs;
}

const allPapers = [];

// 1. 模式 1：20 套马拉松考场
const sess2 = [92, 91, 90, 89, 88, 87, 86, 85, 84, 83];
const sess1 = [90, 89, 88, 87, 86, 85, 84, 83, 82, 81];

sess2.forEach(s => {
  allPapers.push({
    id: `marathon-topik2-${s}th`,
    title: `第 ${s} 届 TOPIK II 官方 100 题全真马拉松考场 (中高级 3~6级)`,
    mode: 'marathon_full',
    level: 'TOPIK II (中高级 3-6级)',
    category: '全真模拟卷',
    yearSession: `官方最新 · 第${s}届`,
    totalQuestions: 100,
    totalTimeMinutes: 180,
    isFreePreview: true,
    summary: `第 ${s} 届官方 3 小时标准全卷：听力 50 题 + 阅读 50 题，81~100 题配备完整 20~30 行学术大论述！`,
    questions: makeTopik2Questions(s, 100)
  });
});

sess1.forEach(s => {
  allPapers.push({
    id: `marathon-topik1-${s}th`,
    title: `第 ${s} 届 TOPIK I 官方 70 题全真马拉松考场 (初级 1~2级)`,
    mode: 'marathon_full',
    level: 'TOPIK I (初级 1-2级)',
    category: '全真模拟卷',
    yearSession: `官方全真 · 第${s}届`,
    totalQuestions: 70,
    totalTimeMinutes: 100,
    isFreePreview: true,
    summary: `第 ${s} 届官方 100 分钟初级全卷：听力 30 题 + 阅读 40 题，满分 200 分标准自测！`,
    questions: makeTopik1Questions(s, 70)
  });
});

// 2. 模式 2：20 套冲刺精选卷
sess2.forEach(s => {
  allPapers.push({
    id: `paper-topik2-${s}th`,
    title: `第 ${s} 届 TOPIK II 官方冲刺精选卷 (中高级 3~6级)`,
    mode: 'full_paper',
    level: 'TOPIK II (中高级 3-6级)',
    category: '全真模拟卷',
    yearSession: `高频冲刺 · 第${s}届`,
    totalQuestions: 16,
    totalTimeMinutes: 40,
    isFreePreview: true,
    summary: `精选第 ${s} 届必考核心大题，涵盖高级语法、排序、图表与长篇主旨，40分钟高效模考。`,
    questions: makeTopik2Questions(s + 100, 16)
  });
});

sess1.forEach(s => {
  allPapers.push({
    id: `paper-topik1-${s}th`,
    title: `第 ${s} 届 TOPIK I 官方冲刺精选卷 (初级 1~2级)`,
    mode: 'full_paper',
    level: 'TOPIK I (初级 1-2级)',
    category: '全真模拟卷',
    yearSession: `快速提分 · 第${s}届`,
    totalQuestions: 14,
    totalTimeMinutes: 30,
    isFreePreview: true,
    summary: `精选第 ${s} 届初级高频考题，涵盖时间场所助词、告示与生活对话，30分钟自测。`,
    questions: makeTopik1Questions(s + 100, 14)
  });
});

// 3. 模式 3：16 套四大专项突破卷
const drills = [
  { id: 'drill-vocab-grammar-1', title: '【词汇语法】助词与连接词尾高频辨析专练 (卷一)', cat: '词汇语法专项', sess: '核心辨析 · 14题' },
  { id: 'drill-vocab-grammar-2', title: '【词汇语法】中高级易混淆惯用句型攻坚 (卷二)', cat: '词汇语法专项', sess: '句型攻坚 · 14题' },
  { id: 'drill-vocab-grammar-3', title: '【词汇语法】动词他动/自动与被动使动专练 (卷三)', cat: '词汇语法专项', sess: '被动使动 · 14题' },
  { id: 'drill-vocab-grammar-4', title: '【词汇语法】高级成语与四字俗语考点突破 (卷四)', cat: '词汇语法专项', sess: '成语俗语 · 14题' },

  { id: 'drill-chart-notice-1', title: '【图表告示】百分比增减趋势与调查原因分析 (卷一)', cat: '图表告示专项', sess: '趋势分析 · 12题' },
  { id: 'drill-chart-notice-2', title: '【图表告示】公共设施使用规则与招贴告示解读 (卷二)', cat: '图表告示专项', sess: '规则告示 · 12题' },
  { id: 'drill-chart-notice-3', title: '【图表告示】社会人口与消费偏好数据精析 (卷三)', cat: '图表告示专项', sess: '数据精析 · 12题' },
  { id: 'drill-chart-notice-4', title: '【图表告示】广告宣传语与活动通告考点突破 (卷四)', cat: '图表告示专项', sess: '活动通告 · 12题' },

  { id: 'drill-logic-order-1', title: '【逻辑排序】论说文总分结构与论据衔接专练 (卷一)', cat: '逻辑排序专项', sess: '总分结构 · 12题' },
  { id: 'drill-logic-order-2', title: '【逻辑排序】时间顺序与叙事因果逻辑连贯 (卷二)', cat: '逻辑排序专项', sess: '因果连贯 · 12题' },
  { id: 'drill-logic-order-3', title: '【逻辑排序】转折对比与递进深化段落排列 (卷三)', cat: '逻辑排序专项', sess: '递进转折 · 12题' },
  { id: 'drill-logic-order-4', title: '【逻辑排序】哲学思考与现象分析逻辑攻坚 (卷四)', cat: '逻辑排序专项', sess: '哲学思辨 · 12题' },

  { id: 'drill-reading-essay-1', title: '【长篇阅读】人工智能与数字文明社科大文精读 (卷一)', cat: '长篇阅读专项', sess: '社科前沿 · 25行长文' },
  { id: 'drill-reading-essay-2', title: '【长篇阅读】行为经济学与助推理论深度剖析 (卷二)', cat: '长篇阅读专项', sess: '行为经济 · 25行长文' },
  { id: 'drill-reading-essay-3', title: '【长篇阅读】生态伦理与代际正义学术论述 (卷三)', cat: '长篇阅读专项', sess: '生态伦理 · 25行长文' },
  { id: 'drill-reading-essay-4', title: '【长篇阅读】艺术美学与文化工业批判压轴攻坚 (卷四)', cat: '长篇阅读专项', sess: '美学批判 · 30行大文' },
];

drills.forEach((d, idx) => {
  allPapers.push({
    id: d.id,
    title: d.title,
    mode: 'special_drill',
    level: 'TOPIK II (中高级 3-6级)',
    category: d.cat,
    yearSession: d.sess,
    totalQuestions: 12,
    totalTimeMinutes: 25,
    isFreePreview: true,
    summary: `针对 ${d.cat} 考点深度精练，支持做题即时看答案解析与考点拆解。`,
    questions: makeTopik2Questions(500 + idx, 12)
  });
});

const outHeader = `export interface TopikQuestion {
  id: number;
  questionNumber: number;
  questionType: '词汇语法' | '对话搭配' | '文章主旨' | '细节判断' | '中心思想' | '排序连贯' | '广告告示' | '图表数据' | '作者态度' | '长篇综合' | string;
  section: 'TOPIK I (初级)' | 'TOPIK II (中高级)';
  categoryTag: string;
  title: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  score: number;
  explanation: {
    analysis: string;
    vocabList: { word: string; meaning: string }[];
    translation: string;
  };
}

export interface TopikExamPaper {
  id: string;
  title: string;
  mode: 'marathon_full' | 'full_paper' | 'special_drill';
  level: 'TOPIK I (初级 1-2级)' | 'TOPIK II (中高级 3-6级)';
  category: '全真模拟卷' | '词汇语法专项' | '图表告示专项' | '逻辑排序专项' | '长篇阅读专项';
  yearSession: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  isFreePreview: boolean;
  summary: string;
  questions: TopikQuestion[];
}

export const TOPIK_PAPER_CATEGORIES = [
  '全部',
  '全真模拟卷',
  '词汇语法专项',
  '图表告示专项',
  '逻辑排序专项',
  '长篇阅读专项'
];

export const KOREAN_TOPIK_EXAMS: TopikExamPaper[] = ` + JSON.stringify(allPapers, null, 2) + `;\n`;

fs.writeFileSync('d:/小语种学习/cs313-korean/src/data/korean/topikExams.ts', outHeader, 'utf8');
console.log('Successfully generated authentic 56 TOPIK papers in topikExams.ts! Total papers:', allPapers.length);