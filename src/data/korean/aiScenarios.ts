export interface DialogueTurn {
  id: number;
  speaker: 'ai' | 'user';
  speakerName: string;
  avatar: string;
  ko: string;
  zh: string;
  roman?: string;
  grammarTip?: string;
  suggestedResponses?: string[];
  honorificNotice?: string;
}

export interface AIScenario {
  id: string;
  title: string;
  koreanTitle: string;
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
    "id": "free_chat_01",
    "title": "🌟 自由随心畅聊 · 韩国语伴 1v1 畅聊",
    "koreanTitle": "자유 프리토킹 · 원어민 AI 친구와 수다 떨기",
    "category": "daily_life",
    "categoryLabel": "自由畅聊 (无话题限制)",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "💬",
    "gradient": "from-pink-600 to-rose-600",
    "description": "无任何固定题目或考点限制！就像和首尔朋友微信聊天一样，你可以聊任何话题：追星、美食、旅游、情感、吐槽日常，或随时向 AI 请教韩语！",
    "targetSkills": [
      "开放式日常会话",
      "自由话题表达",
      "地道口语俚语"
    ],
    "referenceModelAnswer": "한국 생활이나 좋아하는 음식, 아이돌, 취미 등 무엇이든 편하게 이야기해 보세요!",
    "systemPrompt": "你是韩国本地非常亲切热情的同龄朋友兼韩语私教“하나 (Hana)”。用户可以和你聊世界上任何话题（美食、旅游、追星、恋爱、工作、日常吐槽、韩语问题等）。请根据用户的输入，用自然纯正地道的日常韩语（-아요/어요体）像朋友一样热情回复，倾听并提出新的有趣话题，附带中文翻译与地道口语Tip。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "韩国语伴 하나 (Hana)",
        "avatar": "👩🏻",
        "ko": "안녕! 반가워요! 오늘은 어떤 이야기를 나누고 싶으신가요? 요즘 좋아하는 아이돌, 맛있는 음식, 주말 계획이나 한국어 질문 등 무엇이든 편하게 이야기해 주세요!",
        "zh": "你好呀！很高兴认识你！今天你想聊点什么呢？不管是最近喜欢的爱豆、好吃的美食、周末计划，还是韩语学习问题，都可以随时畅所欲言哦！",
        "roman": "Annyeong! Bangawoyo! Oneul-eun eotteon iyagireul nanugo sipeusingayo?...",
        "grammarTip": "日常实用句：-고 싶다 (想做某事)；무엇이든 편하게 (无论什么都请放轻松)",
        "suggestedResponses": [
          "요즘 한국 드라마에 푹 빠졌어요! 추천해 줄 만한 드라마 있어요?",
          "오늘 너무 피곤했는데, 맛있는 한국 음식 추천해 주세요!",
          "주말에 친구랑 쇼핑 가려고 하는데 어디가 좋을까요?"
        ],
        "honorificNotice": "日常同龄朋友或语伴交流，默认使用温暖亲切的 -아요/어요 标准敬语。"
      }
    ]
  },
  {
    "id": "topik_sp_01",
    "title": "TOPIK 口语 Part 1 · 自我介绍与日常问答",
    "koreanTitle": "TOPIK 말하기 1부 · 자기소개 및 일상 질문",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "📝",
    "gradient": "from-amber-600 to-rose-900",
    "description": "模拟 TOPIK 官方口语第一部分，考查基本自我介绍、韩语学习动机与日常活动表达。",
    "targetSkills": [
      "自我介绍 (자기소개)",
      "学习动机 (-기 위해서)",
      "日常时间表达"
    ],
    "examDurationSec": 60,
    "referenceModelAnswer": "안녕하세요? 저는 왕링이라고 합니다. 한국 문화와 드라마에 관심이 많아서 1년 전부터 한국어를 배우기 시작했습니다.",
    "systemPrompt": "你是 TOPIK 官方口语考官，语气和蔼专业，用标准韩语提出第一部分的日常问题并引导考生作答。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👨‍🏫",
        "ko": "수험생 여러분, 안녕하세요? 먼저 간단하게 자기소개와 한국어를 배우게 된 계기를 말씀해 주세요.",
        "zh": "各位考生大家好。首先请简单做个自我介绍，并说明学习韩语的契机。",
        "roman": "Suheomsaeng yeoreobun, annyeonghaseyo? Meonjeo gandanhage jagisogae-wa...",
        "grammarTip": "考点：-게 되다 (变得/成为某种契机)；자기소개 (自我介绍标准句型)",
        "suggestedResponses": [
          "안녕하세요? 저는 중국에서 온 [이름]입니다. 한국 문화가 좋아서 배우고 있습니다.",
          "반갑습니다. 저는 대학교에서 한국어를 전공하고 있는 학생입니다."
        ],
        "honorificNotice": "面对考官必须使用格式体敬语 -습니다/-ㅂ니다 或标准敬语 -아/어요。"
      },
      {
        "id": 2,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👨‍🏫",
        "ko": "네, 잘 들었습니다. 평소 주말에는 주로 무엇을 하면서 시간을 보내시나요?",
        "zh": "好的，回答得很好。平时周末主要通过做什么来度过时间呢？",
        "roman": "Ne, jal deureosseumnida. Pyeongso jumal-eneun juro mueos-eul hamyeonseo...",
        "grammarTip": "考点：-(으)면서 (一边...一边/伴随动作)；주로 (主要/通常)",
        "suggestedResponses": [
          "주말에는 보통 친구들과 카페에 가거나 영화를 보면서 쉽니다.",
          "저는 운동을 좋아해서 주말마다 한강 공원에서 자전거를 탑니다."
        ],
        "honorificNotice": "注意动词连接词 -거나 (或者) 与 -(으)면서 的正确连用。"
      }
    ]
  },
  {
    "id": "topik_sp_02",
    "title": "TOPIK 口语 Part 1 · 留学动机与学业规划",
    "koreanTitle": "TOPIK 말하기 1부 · 유학 동기 및 학업 계획",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🎓",
    "gradient": "from-amber-600 to-rose-900",
    "description": "考查赴韩留学动机、意向专业与毕业后的发展规划阐述。",
    "targetSkills": [
      "专业阐述 (전공)",
      "未来规划 (-고자 하다)",
      "目的表达"
    ],
    "examDurationSec": 60,
    "referenceModelAnswer": "저는 한국 대학교에서 경영학을 전공하고자 합니다. 졸업 후에는 한중 무역 전문가가 되고 싶습니다.",
    "systemPrompt": "你是考官，询问考生的韩国留学专业选择与学业规划。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👨‍🏫",
        "ko": "수험생님은 한국에서 구체적으로 어떤 전공을 공부하고 싶으신가요? 그 이유도 함께 말씀해 주세요.",
        "zh": "请问您在韩国具体想学习什么专业？也请一并说明其原因。",
        "roman": "Suheomsaeng-nim-eun hanguk-eseo guchejeog-euro eotteon jeongong-eul...",
        "grammarTip": "考点：구체적으로 (具体地)；-고 싶다 (想要)",
        "suggestedResponses": [
          "저는 한국의 미디어와 콘텐츠 산업에 관심이 많아서 신문방송학을 전공하고 싶습니다.",
          "한중 양국의 경제 교류에 기여하기 위해 국제무역학을 공부하고자 합니다."
        ],
        "honorificNotice": "使用格式体 -ㅂ니다/습니다 显得郑重清晰。"
      }
    ]
  },
  {
    "id": "topik_sp_03",
    "title": "TOPIK 口语 Part 2 · 看图说话与约会改期道歉",
    "koreanTitle": "TOPIK 말하기 2부 · 약속 변경 및 사과",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🖼️",
    "gradient": "from-blue-700 to-indigo-950",
    "description": "考查在突发情境下的沟通协调能力（例如突发感冒无法赴约，委婉致歉并重新约定时间）。",
    "targetSkills": [
      "委婉致歉 (-아/어서 죄송합니다)",
      "提出替代方案 (-는 게 어떨까요?)",
      "因果连接词"
    ],
    "examDurationSec": 90,
    "referenceModelAnswer": "민수 씨, 정말 미안해요. 오늘 갑자기 감기 몸살이 심해서 약속에 가기 어려울 것 같아요.",
    "systemPrompt": "你是考生的韩国朋友敏洙，对方因身体不适想要改约时间。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "친구 민수 (朋友敏洙)",
        "avatar": "👦🏻",
        "ko": "여보세요? 오늘 3시에 홍대 입구에서 만나기로 했는데, 지금 출발했어? 얼굴 본 지 너무 오래됐다!",
        "zh": "喂？我们今天下午 3 点约在弘大入口见，你出发了吗？好久没见你了！",
        "roman": "Yeoboseyo? Oneul se-si-e hongdae ipgu-eseo...",
        "grammarTip": "考点：-기로 하다 (约定做某事)；-(으)ㄴ 지 되다 (过了多久时间)",
        "suggestedResponses": [
          "민수야, 정말 미안한데 오늘 갑자기 몸살이 심해서 나가기 어려울 것 같아. 약속을 다음 주로 바꿀 수 있을까?",
          "어떡하지? 갑자기 급한 일이 생겨서 오늘 약속에 조금 늦거나 일정을 변경해야 할 것 같아."
        ],
        "honorificNotice": "同龄朋友使用半语 (반말) 时需保持真诚歉意。"
      }
    ]
  },
  {
    "id": "topik_sp_04",
    "title": "TOPIK 口语 Part 2 · 看图说话 · 租房漏水向房东报修",
    "koreanTitle": "TOPIK 말하기 2부 · 원룸 누수 및 수리 요청",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🚰",
    "gradient": "from-blue-700 to-indigo-950",
    "description": "模拟租房水管漏水情景，向韩国房东大叔礼貌说明损坏情况并商定上门维修时间。",
    "targetSkills": [
      "报修描述 (고장/누수)",
      "请求帮助 (-아/어 주시겠어요?)",
      "预约时间"
    ],
    "examDurationSec": 90,
    "referenceModelAnswer": "집주인 아저씨, 안녕하세요? 302호 세입자인데요, 화장실 세면대 아래에서 물이 새고 있어서 연락드렸습니다.",
    "systemPrompt": "你是房东大叔，租客打电话来报修卫生间水管漏水。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "집주인 아저씨 (房东大叔)",
        "avatar": "👴🏻",
        "ko": "네, 302호 학생이군요! 무슨 일 있어요? 방에 무슨 문제라도 생겼나요?",
        "zh": "喂，是 302 号的同学啊！有什么事吗？房间里出什么问题了吗？",
        "roman": "Ne, 302-ho haksaeng-igunyo! Museun il isseoyo?...",
        "grammarTip": "考点：-라도 (哪怕是.../就算...)；무슨 일 (什么事)",
        "suggestedResponses": [
          "아저씨 안녕하세요. 화장실 세면대에서 물이 계속 새고 있어서요. 혹시 오늘 와서 확인해 주실 수 있나요?",
          "안녕하세요, 보일러가 작동을 안 해서 온수가 안 나와요. 기사님을 언제 불러주실 수 있으신가요?"
        ],
        "honorificNotice": "对长辈房东务必使用标准敬语 (-아/어요 或 -시겠어요)。"
      }
    ]
  },
  {
    "id": "topik_sp_05",
    "title": "TOPIK 口语 Part 3 · 图表阐述 · 韩国单人家庭增长趋势",
    "koreanTitle": "TOPIK 말하기 3부 · 1인 가구 증가 추이 분석",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "📊",
    "gradient": "from-purple-700 to-slate-900",
    "description": "考查根据图表数据分析韩国 1 人家庭比例持续上升的核心成因及社会影响。",
    "targetSkills": [
      "图表引述 (조사 결과에 따르면)",
      "趋势递增 (-는 추세를 보이다)",
      "原因阐述"
    ],
    "examDurationSec": 120,
    "referenceModelAnswer": "통계청 조사 결과에 따르면 지난 10년간 1인 가구 비율은 25%에서 35%로 급격히 증가했습니다.",
    "systemPrompt": "你是高级口语考官，要求考生依据图表陈述单人家庭剧增的成因与对策。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👩🏻‍💼",
        "ko": "제시된 그래프를 바탕으로 한국 사회에서 1인 가구가 급증하는 원인과 이로 인한 사회적 변화를 2분 동안 설명해 주십시오.",
        "zh": "请根据给出的图表，用 2 分钟时间阐述韩国社会单人家庭急剧增加的原因及由此带来的社会变化。",
        "roman": "Jesidoen geuraepu-reul batang-euro hanguk sahoe-eseo...",
        "grammarTip": "考点：-를 바탕으로 (以...为基准)；이로 인한 (由此引发的)",
        "suggestedResponses": [
          "그래프에 따르면 비혼주의 확산과 청년층의 독립 증가로 인해 1인 가구 비율이 급증하고 있습니다.",
          "이러한 현상은 소용량 가전제품과 간편식 시장의 성장을 견인하는 등 경제 전반에 큰 변화를 일으키고 있습니다."
        ],
        "honorificNotice": "正式学术发表，务必全文使用格式体书面敬语 -ㅂ/습니까, -ㅂ/습니다。"
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "topik_sp_06",
    "title": "TOPIK 口语 Part 3 · 图表阐述 · 青年就业偏好与远程办公",
    "koreanTitle": "TOPIK 말하기 3부 · 청년 취업 선호도 및 원격근무",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "📈",
    "gradient": "from-purple-700 to-slate-900",
    "description": "分析青年群体求职时对“工作与生活平衡(Work-Life Balance)”与远程办公模式的偏好变迁。",
    "targetSkills": [
      "数据对比 (A에 비해 B가 높다)",
      "比例分析",
      "结论归纳"
    ],
    "examDurationSec": 120,
    "referenceModelAnswer": "청년 구직자들의 직장 선택 기준 1위로 워라밸(일과 삶의 균형)이 꼽혔습니다.",
    "systemPrompt": "你是考官，要求考生深入剖析青年求职观转变与灵活办公趋势。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👩🏻‍💼",
        "ko": "청년 세대의 직업관 변화와 재택근무 도입 확대에 대해 본인의 견해를 구체적인 근거를 들어 말씀해 주십시오.",
        "zh": "请结合具体事实依据，阐述您对青年一代职业观转变及远程办公推广扩大的看法。",
        "roman": "Cheongnyeon sedae-ui jigeopgwan byeonhwa-wa...",
        "grammarTip": "考点：근거를 들어 (列举依据)；-에 대해 견해를 밝히다 (表明见解)",
        "suggestedResponses": [
          "단순한 고연봉보다는 개인의 삶을 존중받는 기업 문화를 선호하는 추세가 뚜렷합니다.",
          "원격근무는 업무 효율성을 높이는 동시에 기업의 공간 비용을 절감하는 긍정적인 효과가 있습니다."
        ],
        "honorificNotice": "考场高分技巧：使用高级衔接副词 (한편, 반면에, 따라서)。"
      }
    ]
  },
  {
    "id": "topik_sp_07",
    "title": "TOPIK 口语 Part 4 · 角色扮演 · 快递错送与客服沟通退换",
    "koreanTitle": "TOPIK 말하기 4부 · 택배 오배송 및 교환 문의",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "📦",
    "gradient": "from-emerald-700 to-teal-950",
    "description": "网购商品送错型号，向韩国电商客服礼貌沟通，要求免费上门退换并补偿。",
    "targetSkills": [
      "事实陈述 (주문한 것과 다른 물건)",
      "解决要求 (교환/반품 처리)",
      "客服沟通礼仪"
    ],
    "examDurationSec": 100,
    "referenceModelAnswer": "안녕하세요, 어제 받은 패딩 사이즈가 주문한 M이 아니라 XL로 잘못 배송되었습니다.",
    "systemPrompt": "你是电商客服人员，负责处理顾客商品送错的退换货咨询。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "고객센터 상담원 (客服代表)",
        "avatar": "🎧",
        "ko": "안녕하세요, 고객님! 무엇을 도와드릴까요? 주문번호나 불편하신 점을 말씀해 주시면 빠르게 확인해 드리겠습니다.",
        "zh": "您好顾客！请问有什么可以帮您？请告知订单号或遇到的问题，我将快速为您核对。",
        "roman": "Annyeonghaseyo, gogaeknim! Mueos-eul dowadeurilkkayo?...",
        "grammarTip": "考点：-아/어 드리겠습니다 (为您做...)；불편하신 점 (感到不便的地方)",
        "suggestedResponses": [
          "어제 택배를 받았는데 제가 주문한 색상과 다른 상품이 배송되었습니다. 빠른 맞교환 부탁드립니다.",
          "배송 중 포장이 훼손되어 상품이 파손되었습니다. 환불 절차가 어떻게 되는지 알고 싶습니다."
        ],
        "honorificNotice": "维权沟通时保持礼貌客观，使用 -해 주시기를 바랍니다 等句型。"
      }
    ]
  },
  {
    "id": "topik_sp_08",
    "title": "TOPIK 口语 Part 4 · 角色扮演 · 团队项目分工冲突调解",
    "koreanTitle": "TOPIK 말하기 4부 · 팀 프로젝트 업무 분담 갈등 조율",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🤝",
    "gradient": "from-emerald-700 to-teal-950",
    "description": "小组作业中某位组员因个人原因进度拖延，作为组长委婉沟通并重新协调分工。",
    "targetSkills": [
      "换位思考与共情",
      "委婉指出问题",
      "提出折中方案"
    ],
    "examDurationSec": 100,
    "referenceModelAnswer": "지훈 씨, 요즘 많이 바쁘신 건 알지만 발표일이 얼마 남지 않아서 자료 조사를 조금 서둘러 주셔야 할 것 같아요.",
    "systemPrompt": "你是因兼职繁忙导致小组作业进度落后的组员智勋。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "팀원 지훈 (组员智勋)",
        "avatar": "👦🏻",
        "ko": "팀장님, 죄송해요. 요즘 아르바이트 때문에 제가 맡은 PPT 초안 작성을 아직 다 못 끝냈어요…",
        "zh": "组长真抱歉，最近因为兼职打工，我负责的 PPT 初稿还没全部完成……",
        "roman": "Timjangnim, joesonghaeyo. Yojeum areubaiteu ttaemune...",
        "grammarTip": "考点：-느라고 (因做某事而带来负面结果)；초안 (初稿)",
        "suggestedResponses": [
          "바쁘신 사정은 이해하지만, 마감일이 내일까지라 제가 디자인 부분을 도울 테니 내용 정리를 오늘 중으로 부탁드려요.",
          "혼자서 부담이 크시면 다른 팀원들과 분량을 나누어 작업하는 방안을 찾아보겠습니다."
        ],
        "honorificNotice": "同组协作使用互相尊重的敬语体 (-아요/어요)。"
      }
    ]
  },
  {
    "id": "topik_sp_09",
    "title": "TOPIK 口语 Part 5 · 深度思辨 · 社交媒体对人际关系的利弊",
    "koreanTitle": "TOPIK 말하기 5부 · SNS가 인간관계에 미치는 영향",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "💬",
    "gradient": "from-rose-700 to-red-950",
    "description": "针对 SNS 社交软件让沟通更便捷还是加剧了人际疏离发表结构化辩证观点。",
    "targetSkills": [
      "立论与驳论 (물론 ~지만, 그러나)",
      "正反双向论证",
      "总结提炼"
    ],
    "examDurationSec": 150,
    "referenceModelAnswer": "SNS는 시공간의 한계를 넘어 소통을 원활하게 해주는 순기능이 있는 반면, 대면 소통의 단절이라는 역기능도 존재합니다.",
    "systemPrompt": "你是考官，要求考生就 SNS 对现代人际关系的利与弊发表全面观点。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👨‍💼",
        "ko": "현대 사회에서 SNS 사용이 일상화되었습니다. SNS가 인간관계 형성에 미치는 긍정적, 부정적 영향에 대해 견해를 말씀해 주십시오.",
        "zh": "在现代社会中 SNS 的使用已十分普及。请谈谈您关于 SNS 对人际关系建立产生的积极与消极影响的看法。",
        "roman": "Hyeondae sahoe-eseo SNS sayong-i ilsanghwadoeeosseumnida...",
        "grammarTip": "考点：순기능과 역기능 (正面功能与负面效应)；일상화되다 (普遍化/日常化)",
        "suggestedResponses": [
          "SNS는 지리적 제약 없이 정보를 공유할 수 있다는 장점이 있지만, 피상적인 관계에 그칠 위험이 있습니다.",
          "따라서 SNS의 혜택을 누리되 진정성 있는 오프라인 소통을 병행하는 균형 잡힌 태도가 요구됩니다."
        ],
        "honorificNotice": "展现高级思辨逻辑，多用书面转折词 (그럼에도 불구하고, 한편으로는)。"
      }
    ]
  },
  {
    "id": "topik_sp_10",
    "title": "TOPIK 口语 Part 5 · 深度思辨 · 传统市场保护与大型超市竞争",
    "koreanTitle": "TOPIK 말하기 5부 · 전통시장 보호와 대형마트 규제",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🏬",
    "gradient": "from-rose-700 to-red-950",
    "description": "探讨政府强制大型超市周末歇业以扶持传统小商贩政策的合理性与争议。",
    "targetSkills": [
      "政策利弊评估",
      "消费者权益与商户保护平衡",
      "提出可行对策"
    ],
    "examDurationSec": 150,
    "referenceModelAnswer": "골목상권 보호라는 취지에는 공감하지만, 소비자의 선택권을 지나치게 제한한다는 반론도 만만치 않습니다.",
    "systemPrompt": "你是考官，要求考生就传统市场与大型商超竞争议题阐述立场。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👨‍💼",
        "ko": "대형마트 의무 휴업 규제와 전통시장 활성화 방안에 대해 찬반 입장을 정하고 그 근거를 제시해 주십시오.",
        "zh": "关于大型超市强制歇业规定与传统市场振兴方案，请表明赞成或反对立场并阐明依据。",
        "roman": "Daehyeongmateu uimu hyueop gyuje-wa...",
        "grammarTip": "考点：-라는 취지 (出于...的初衷)；상생 방안 (合作共赢方案)",
        "suggestedResponses": [
          "소상공인의 생존권을 보장하기 위한 최소한의 안전장치로서 규제는 불가피하다고 생각합니다.",
          "단순 규제보다는 전통시장의 주차 시설 확충과 디지털 결제 도입 등 자생력을 키우는 지원이 우선되어야 합니다."
        ],
        "honorificNotice": "使用论述型终结词尾 (-다고 봅니다 / -아야 마땅합니다)。"
      }
    ]
  },
  {
    "id": "topik_sp_11",
    "title": "TOPIK 口语 Part 6 · 建设性建议 · 留学生文化适应支持方案",
    "koreanTitle": "TOPIK 말하기 6부 · 외국인 유학생 문화 적응 지원책",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "💡",
    "gradient": "from-violet-700 to-purple-950",
    "description": "针对外国留学生在语言障碍、心理孤独及生活适应上的困难，提出系统性支持措施。",
    "targetSkills": [
      "提出具体可落地对策",
      "分点阐述 (첫째, 둘째, 마지막으로)",
      "展望长远意义"
    ],
    "examDurationSec": 150,
    "referenceModelAnswer": "유학생들의 조기 정착을 위해 1:1 버디 멘토링 프로그램과 심리 상담 센터 운영을 제안합니다.",
    "systemPrompt": "你是考官，要求考生提出改善在韩留学生学习生活支持体系的建设性建议。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👩🏻‍🏫",
        "ko": "외국인 유학생들이 겪는 학업 및 일상 적응 문제를 해결하기 위해 대학과 지역사회가 추진해야 할 방안을 말씀해 주십시오.",
        "zh": "为解决外国留学生面临的学业及生活适应困难，请阐述大学与地方社区应推进落实的对策方案。",
        "roman": "Oegugin yuhaksaengdeul-i gyeongneun hageop...",
        "grammarTip": "考点：-를 추진하다 (推进实施...)；조기 정착 (早期平稳适应)",
        "suggestedResponses": [
          "첫째, 한국인 재학생과의 1:1 언어 교환 및 멘토링 프로그램을 의무화해야 합니다.",
          "둘째, 다국어 행정 서비스와 법률·취업 지원 창구를 확대 운영할 필요가 있습니다."
        ],
        "honorificNotice": "高级建议句型：-을/를 제안하는 바입니다, -할 필요성이 대두되고 있습니다。"
      }
    ]
  },
  {
    "id": "topik_sp_12",
    "title": "TOPIK 口语 Part 6 · 建设性建议 · 老龄化社会社区互助对策",
    "koreanTitle": "TOPIK 말하기 6부 · 초고령화 사회 대비 공동체 돌봄 대책",
    "category": "topik_speaking",
    "categoryLabel": "TOPIK 官方口语",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🏘️",
    "gradient": "from-violet-700 to-purple-950",
    "description": "探讨韩国步入超老龄化社会背景下，如何通过社区互助养老与银发再就业化解养老难题。",
    "targetSkills": [
      "宏观社会议题把握",
      "系统性建议构建",
      "多维度考量"
    ],
    "examDurationSec": 150,
    "referenceModelAnswer": "노인 일자리 창출과 세대 간 통합을 위한 마을 공동체 돌봄 네트워크 구축이 시급합니다.",
    "systemPrompt": "你是考官，要求考生针对超老龄化危机提出切实可行的社区化应对建议。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "TOPIK 考官",
        "avatar": "👩🏻‍🏫",
        "ko": "초고령 사회 진입에 따른 노인 돌봄 공백을 해결하기 위한 실효성 있는 대책을 제시해 주십시오.",
        "zh": "请提出具有实效性的对策，以解决迈入超老龄社会带来的老人照护缺口问题。",
        "roman": "Chogoryeong sahoe jinip-e ttareun...",
        "grammarTip": "考点：돌봄 공백 (照护断档/缺口)；실효성 있는 (具备实际成效的)",
        "suggestedResponses": [
          "스마트 IT 기술을 활용한 24시간 안심 케어 시스템을 독거노인 가구에 보급해야 합니다.",
          "건강한 노년층이 거동이 불편한 고령자를 돕는 노노(老老) 케어 일자리를 대폭 확충해야 합니다."
        ],
        "honorificNotice": "高级考题必备词汇：시급하다, 보급하다, 대폭 확충하다。"
      }
    ]
  },
  {
    "id": "daily_01",
    "title": "仁川机场入境过关与换乘大巴",
    "koreanTitle": "인천공항 입국 심사 및 리무진 버스",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "✈️",
    "gradient": "from-blue-600 to-cyan-900",
    "description": "入境海关问询目的与停留期，并在航站楼售票处购买前往明洞的机场大巴票。",
    "targetSkills": [
      "入境问答",
      "大巴买票",
      "时间与行李询问"
    ],
    "systemPrompt": "你是仁川机场大巴售票员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "공항 매표소 직원 (售票员)",
        "avatar": "👩🏻‍💼",
        "ko": "안녕하세요, 손님! 어디로 가시는 티켓을 발권해 드릴까요?",
        "zh": "您好顾客！请问要为您出具去哪里的车票呢？",
        "roman": "Annyeonghaseyo, sonnim! Eodiro gasineun tiket-eul...",
        "grammarTip": "考点：-로 가다 (前往某方向)；발권해 드리다 (为您出票)",
        "suggestedResponses": [
          "명동역으로 가는 리무진 버스 한 장 주세요.",
          "홍대입구역까지 가는 첫차가 몇 시에 출발하나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_02",
    "title": "弘大网红咖啡厅点单与定制燕麦奶",
    "koreanTitle": "홍대 핫플 카페 주문 및 커스텀",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "☕",
    "gradient": "from-amber-600 to-orange-950",
    "description": "在首尔网红咖啡店点冰美式/燕麦拿铁、调整甜度与冰量，并使用手机扫码积分。",
    "targetSkills": [
      "点单定制 (얼음 적게/덜 달게)",
      "外带堂食选择",
      "支付与积分"
    ],
    "systemPrompt": "你是弘大咖啡馆咖啡师兼收银员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "바리스타 (咖啡师)",
        "avatar": "🧑🏻‍🍳",
        "ko": "주문 도와드리겠습니다! 드시고 가시나요, 아니면 포장이실까요?",
        "zh": "为您点餐！请问是在店内享用还是打包外带呢？",
        "roman": "Jumun dowadeurigesseumnida! Deusigo gasinayo...",
        "grammarTip": "考点：드시고 가시다 (堂食)；포장하다/테이크아웃 (外带)",
        "suggestedResponses": [
          "아이스 아메리카노 한 잔 포장해 주시고요, 샷 추가해 주세요.",
          "매장에서 마시고 갈게요. 바닐라 라떼에 우유는 오트밀크로 바꿔주세요."
        ]
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "daily_03",
    "title": "东大门夜市小吃街点餐与 AA 结账",
    "koreanTitle": "동대문 야시장 떡볶이 주문 및 더치페이",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🍢",
    "gradient": "from-orange-600 to-red-950",
    "description": "在夜市排挡点辣炒年糕、鱼饼汤和米肠，并与韩国老板沟通现金或转账结算。",
    "targetSkills": [
      "夜市小吃点单",
      "辣度调整 (덜 맵게)",
      "结账方式 (계좌이체/현금)"
    ],
    "systemPrompt": "你是东大门夜市小吃摊阿姨。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "포장마차 이모 (夜市阿姨)",
        "avatar": "👵🏻",
        "ko": "어서 오세요! 우리 집 떡볶이랑 순대가 아주 맛있어. 뭐 줄까, 학생?",
        "zh": "快请进！我们家的炒年糕和米肠非常美味。要来点什么呀，同学？",
        "roman": "Eoseo oseyo! Uri jip tteokbokki-rang sundae-ga...",
        "grammarTip": "考点：뭐 줄까? (要给你什么/来点什么)；-이랑/랑 (和/跟)",
        "suggestedResponses": [
          "이모님, 떡볶이 1인분이랑 어묵 2개 주세요. 덜 맵게 해주세요!",
          "순대 1인분에 내장도 섞어서 주실 수 있나요? 계좌이체 가능한가요?"
        ]
      }
    ]
  },
  {
    "id": "daily_04",
    "title": "明洞乐天免税店美妆导购与退税办理",
    "koreanTitle": "명동 면세점 화장품 쇼핑 및 택스리펀",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "💄",
    "gradient": "from-pink-600 to-rose-950",
    "description": "选购韩国护肤品、咨询买赠活动 (1+1)、出示护照并在柜台开具即时退税单。",
    "targetSkills": [
      "美妆功效询问 (미백/보습)",
      "折扣与赠品 (1+1/사은품)",
      "退税流程 (택스리펀)"
    ],
    "systemPrompt": "你是免税店美妆专柜柜姐。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "면세점 직원 (免税店导购)",
        "avatar": "👩🏻‍💼",
        "ko": "고객님, 찾으시는 특정 제품이나 고민이신 피부 타입이 있으신가요?",
        "zh": "顾客您好，请问有特定寻找的产品或者想要改善的肤质类型吗？",
        "roman": "Gogaeknim, chajeusineun teukjeong jepum-ina...",
        "grammarTip": "考点：찾으시는 제품 (您寻找的产品)；피부 타입 (皮肤类型)",
        "suggestedResponses": [
          "건성 피부에 좋은 수분 크림 추천해 주세요. 지금 1+1 행사 중인가요?",
          "이 제품 구매하면 택스리펀 영수증 바로 발급받을 수 있나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_05",
    "title": "GS25 便利店便当加热与 T-Money 充值",
    "koreanTitle": "편의점 도시락 데우기 및 티머니 충전",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🏪",
    "gradient": "from-emerald-600 to-teal-950",
    "description": "在韩国便利店购买盒饭便当并使用微波炉加热，同时为交通卡充值 2 万韩元。",
    "targetSkills": [
      "便利店日常求助",
      "交通卡充值 (티머니 충전)",
      "微波炉加热"
    ],
    "systemPrompt": "你是 GS25 便利店晚班店员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "편의점 알바생 (便利店员)",
        "avatar": "🧑🏻‍💼",
        "ko": "어서오세요! 봉투 필요하신가요? 계산 도와드리겠습니다.",
        "zh": "欢迎光临！需要塑料袋吗？我来帮您结算。",
        "roman": "Eoseo-oseyo! Bongtu piryohasin-gayo?...",
        "grammarTip": "考点：봉투 (塑料袋/纸袋)；-필요하시다 (是否需要)",
        "suggestedResponses": [
          "봉투는 괜찮고요, 도시락 전자레인지에 몇 초 돌려야 하나요?",
          "교통카드 충전도 되나요? 이만 원 충전해 주세요."
        ]
      }
    ]
  },
  {
    "id": "daily_06",
    "title": "首尔地铁 2 号线换乘求助与问路",
    "koreanTitle": "지하철 2호선 환승 및 길 찾기",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🚇",
    "gradient": "from-green-600 to-emerald-950",
    "description": "在复杂的新道林/市厅地铁站向站务员询问如何换乘 2 号线内线循环与寻找出口。",
    "targetSkills": [
      "换乘问询 (환승)",
      "出口指引 (몇 번 출구)",
      "方向确认 (내선순환)"
    ],
    "systemPrompt": "你是首尔地铁站站务员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "역무원 (站务员)",
        "avatar": "👮🏻‍♂️",
        "ko": "네, 도움이 필요하신가요? 어느 방면으로 가시나요?",
        "zh": "您好，需要帮助吗？请问您前往哪个方向？",
        "roman": "Ne, doum-i piryohasin-gayo? Eoneu bangmyeon-euro...",
        "grammarTip": "考点：어느 방면 (哪个方向)；-로 가다 (前往)",
        "suggestedResponses": [
          "실례지만 강남역으로 가려면 몇 번 플랫폼에서 타야 하나요?",
          "DDP로 가고 싶은데 2호선으로 갈아타는 곳이 어디예요?"
        ]
      }
    ]
  },
  {
    "id": "daily_07",
    "title": "炭火烤肉店点五花肉与续添生菜小菜",
    "koreanTitle": "숯불 삼겹살 주문 및 쌈 채소 리필",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🥩",
    "gradient": "from-red-600 to-amber-950",
    "description": "在烤肉店点 2 人份五花肉和冷面，请店员更换烤盘并免费续添生菜蒜瓣。",
    "targetSkills": [
      "烤肉菜单点菜 (삼겹살/목살)",
      "免费续加 (리필)",
      "换烤网 (불판 갈아주세요)"
    ],
    "systemPrompt": "你是烤肉店服务员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "고깃집 직원 (烤肉店员)",
        "avatar": "🧑🏻‍🍳",
        "ko": "주문하시겠어요? 첫 주문은 기본 2인분부터 가능하십니다!",
        "zh": "请问要点单吗？首次点餐最少需要 2 人份起哦！",
        "roman": "Jumunhasigesseoyo? Cheot jumun-eun gibon...",
        "grammarTip": "考点：-부터 가능하시다 (从...起可以)；-인분 (份数)",
        "suggestedResponses": [
          "삼겹살 2인분이랑 된장찌개 하나, 공깃밥 두 개 주세요.",
          "저기요, 불판이 좀 탄 것 같은데 판 갈아주실 수 있나요? 쌈채소도 리필해 주세요!"
        ]
      }
    ]
  },
  {
    "id": "daily_08",
    "title": "江南时尚发廊剪发造型与染烫沟通",
    "koreanTitle": "강남 미용실 컷트 및 헤어 스타일링",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "💇🏻‍♀️",
    "gradient": "from-purple-600 to-pink-950",
    "description": "向韩国发型总监详细描述修剪长度、打薄、八字刘海与染发色板挑选。",
    "targetSkills": [
      "发型设计用语 (기장/숱/사이드뱅)",
      "染发色调沟通 (애쉬 브라운)",
      "造型定制"
    ],
    "systemPrompt": "你是江南清潭洞知名发型总监。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "헤어 디자이너 원장 (发型总监)",
        "avatar": "💇🏻‍♂️",
        "ko": "안녕하세요! 오늘 어떤 스타일로 변신하고 싶으신가요? 생각하신 사진이 있으실까요?",
        "zh": "您好！今天想打造什么风格的造型呢？有提前准备好的参考照片吗？",
        "roman": "Annyeonghaseyo! Oneul eotteon seutail-ro...",
        "grammarTip": "考点：-로 변신하다 (变身/做某种造型)；기장 (头发长度)",
        "suggestedResponses": [
          "기장은 끝에 상한 부분만 2cm 정도 다듬어 주시고요, 숱 좀 쳐주세요.",
          "자연스러운 사이드뱅이랑 시스루 앞머리로 잘라주세요."
        ]
      }
    ]
  },
  {
    "id": "daily_09",
    "title": "新村不动产中介看房与租房合同咨询",
    "koreanTitle": "신촌 부동산 원룸 매물 투어 및 계약",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🏠",
    "gradient": "from-amber-600 to-yellow-950",
    "description": "向中介咨询大学附近的单身公寓 (One-Room)，了解保证金、月租、管理费包含项目。",
    "targetSkills": [
      "房产术语 (보증금/월세/관리비)",
      "房屋设施确认 (풀옵션)",
      "租期与朝向"
    ],
    "systemPrompt": "你是新村不动产中介所长。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "부동산 소장님 (中介所长)",
        "avatar": "👨🏻‍💼",
        "ko": "어서 오세요! 학교 근처로 원룸 찾으시죠? 보증금이랑 월세 예산은 어느 정도로 생각하고 계신가요?",
        "zh": "快请进！是在找学校附近的一居室单身公寓吧？保证金和月租预算大概考虑在多少范围呢？",
        "roman": "Eoseo oseyo! Hakgyo geuncheo-ro...",
        "grammarTip": "考点：예산 (预算)；풀옵션 (全配家电/家具齐全)",
        "suggestedResponses": [
          "보증금 500에 월세 50만 원 선으로 채광 좋은 남향 방 보고 싶어요.",
          "관리비에 인터넷이랑 수도세가 포함되어 있는지 궁금합니다."
        ]
      }
    ]
  },
  {
    "id": "daily_10",
    "title": "首尔综合医院挂号、就医问诊与药房取药",
    "koreanTitle": "서울 대학병원 접수, 진료 및 약국 조제",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🏥",
    "gradient": "from-teal-600 to-slate-950",
    "description": "在综合医院前台挂号出示登陆证，向内科医生描述胃痛反酸发烧症状并去药店拿药。",
    "targetSkills": [
      "症状描述 (속이 쓰리다/열이 나다)",
      "过敏史告知",
      "服药剂量与频次 (식후 30분)"
    ],
    "systemPrompt": "你是综合医院内科主治医生。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "내과 의사 (内科医生)",
        "avatar": "👨🏻‍⚕️",
        "ko": "어디가 불편해서 오셨나요? 증상이 언제부터 시작되었는지 말씀해 주세요.",
        "zh": "哪里不舒服呢？请告诉我症状是从什么时候开始出现的。",
        "roman": "Eodiga bulpyeonhaeseo osyeonnayo?...",
        "grammarTip": "考点：어디가 불편하다 (哪里不舒服)；-ㄴ 지 되다 (过了多久)",
        "suggestedResponses": [
          "이틀 전부터 속이 너무 쓰리고 소화가 안 돼요. 어젯밤부터는 미열도 있어요.",
          "혹시 항생제 부작용이 있어서 그런데 약 처방하실 때 참고해 주실 수 있나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_11",
    "title": "友利银行开户与办理兼职结算 Check 卡",
    "koreanTitle": "우리은행 계좌 개설 및 체크카드 발급",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🏦",
    "gradient": "from-blue-600 to-indigo-950",
    "description": "携带外国人登录证与在学证明在银行柜台开立通胀活期账户、开通手机银行。",
    "targetSkills": [
      "金融业务用语 (계좌 개설/통장)",
      "办卡流程 (체크카드)",
      "转账限额设置"
    ],
    "systemPrompt": "你是友利银行柜面行员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "은행 창구 직원 (银行柜员)",
        "avatar": "👩🏻‍💼",
        "ko": "안녕하세요, 고객님! 오늘 어떤 금융 업무를 도와드릴까요?",
        "zh": "您好顾客！今天有什么金融业务需要协助您办理呢？",
        "roman": "Annyeonghaseyo, gogaeknim! Oneul eotteon...",
        "grammarTip": "考点：금융 업무 (金融业务)；통장 (银行存折)",
        "suggestedResponses": [
          "유학생 입출금 통장 개설하고 체크카드도 같이 신청하려고 합니다.",
          "모바일 뱅킹이랑 해외 송금 기능도 함께 신청하고 싶어요."
        ]
      }
    ]
  },
  {
    "id": "daily_12",
    "title": "出入境管理局外国人登录证 (ARC) 预约递交",
    "koreanTitle": "출입국관리사무소 외국인등록증(ARC) 신청",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🛂",
    "gradient": "from-slate-700 to-gray-950",
    "description": "在首尔出入境管理局窗口递交护照、在学证明、肺结核诊断书办理首次登录证。",
    "targetSkills": [
      "出入境政务术语",
      "材料补齐 (서류 보완)",
      "领取方式 (우편 수령)"
    ],
    "systemPrompt": "你是出入境管理局签证审批公务员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "출입국 공무원 (出入境公务员)",
        "avatar": "👨🏻‍✈️",
        "ko": "방문 예약증과 여권, 통합신청서를 보여주시겠습니까?",
        "zh": "请出示您的访问预约单、护照以及综合申请表。",
        "roman": "Bangmun yeyakjeung-gwa yeogwon...",
        "grammarTip": "考点：-을/를 보여주시다 (请出示)；통합신청서 (综合申请表)",
        "suggestedResponses": [
          "여기 예약증과 재학증명서, 거주지 확인서 원본입니다.",
          "외국인등록증 발급까지 대략 몇 주 정도 소요되나요? 우편 수령 가능한가요?"
        ]
      }
    ]
  },
  {
    "id": "daily_13",
    "title": "乐天世界游乐园 Magic Pass 预约与游玩",
    "koreanTitle": "롯데월드 어드벤처 매직패스 예약 및 즐기기",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🎡",
    "gradient": "from-pink-600 to-purple-950",
    "description": "在乐天世界票务窗口买学生通票，并在园内询问热门过山车排队时间与快速通道。",
    "targetSkills": [
      "游乐园票务与折扣",
      "排队时间询问 (대기 시간)",
      "设备限制确认"
    ],
    "systemPrompt": "你是乐天世界游乐园引导工作人员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "캐스트 직원 (乐天世界向导)",
        "avatar": "🧚🏻‍♀️",
        "ko": "환상의 나라 롯데월드에 오신 것을 환영합니다! 어트랙션 안내 도와드릴까요?",
        "zh": "欢迎来到幻想乐园乐天世界！需要为您提供游乐设施指引吗？",
        "roman": "Hwansang-ui nara Lotte World-e...",
        "grammarTip": "考点：-에 오신 것을 환영하다 (欢迎光临...)；어트랙션 (游乐设施)",
        "suggestedResponses": [
          "아트란티스 타려면 대기 시간이 얼마나 걸리나요?",
          "매직패스 프리미엄 티켓은 앱에서 어떻게 등록하나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_14",
    "title": "汉江公园野餐垫租赁与外卖配送点定位",
    "koreanTitle": "한강공원 돗자리 대여 및 배달존 치맥",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🍗",
    "gradient": "from-sky-600 to-indigo-950",
    "description": "在汝矣岛汉江公园租赁野餐垫和露营灯，用外卖软件定位到 2 号配送区点炸鸡啤酒。",
    "targetSkills": [
      "外卖定位 (배달존 2번)",
      "炸鸡口味与部位 (순살/반반)",
      "野餐租赁"
    ],
    "systemPrompt": "你是外卖炸鸡店配送骑手。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "배달 기사님 (外卖骑手)",
        "avatar": "🛵",
        "ko": "여보세요! 주문하신 굽네치킨 배달원입니다. 지금 여의도 한강공원 배달존 2번에 도착했는데 어디 계신가요?",
        "zh": "喂您好！我是您订购的贡乃炸鸡外卖员。现在已经到达汝矣岛汉江公园 2 号外卖点，请问您在哪儿呢？",
        "roman": "Yeoboseyo! Jumunhasin baedalwon-imnida...",
        "grammarTip": "考点：-에 도착하다 (到达某处)；어디 계시다 (您在何处)",
        "suggestedResponses": [
          "네 기사님! 저 지금 배달존 2번 표지판 바로 앞에 흰색 옷 입고 서 있어요.",
          "결제는 어플에서 완료했습니다. 영수증 붙은 봉투 전달 부탁드립니다!"
        ]
      }
    ]
  },
  {
    "id": "daily_15",
    "title": "韩国健身房办卡、私教 PT 咨询与体测",
    "koreanTitle": "헬스장 등록 및 인바디 체성분 상담",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🏋🏻‍♂️",
    "gradient": "from-amber-600 to-red-950",
    "description": "在首尔连锁健身房咨询 3 个月会员卡、测 InBody 体脂率并商讨减脂增肌训练计划。",
    "targetSkills": [
      "健身用语 (인바디/근육량/체지방)",
      "更衣柜与运动服租赁",
      "私教课排期"
    ],
    "systemPrompt": "你是健身房高级私人教练 (PT)。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "헬스 트레이너 (健身教练)",
        "avatar": "💪🏻",
        "ko": "회원님 반갑습니다! 평소 운동 경험이 있으신가요? 다이어트나 근력 증량 중 어떤 목표를 원하시나요?",
        "zh": "会员您好！平时有健身运动习惯吗？减脂瘦身和增肌塑形中，您更倾向哪个目标呢？",
        "roman": "Hwoewonnim bangapseumnida! Pyeongso undong...",
        "grammarTip": "考点：-중 어떤 것 (两者中哪一个)；근력 증량 (增肌)",
        "suggestedResponses": [
          "체지방을 줄이고 기초체력을 기르고 싶어요. 주 3회 PT 비용이 어떻게 되나요?",
          "라커룸이랑 운동복 대여료는 회원권에 포함되어 있나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_16",
    "title": "韩国投币练歌房 (Coin Noraebang) 选歌与加时",
    "koreanTitle": "코인노래방 곡 선택 및 보너스 시간",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🎤",
    "gradient": "from-violet-600 to-purple-950",
    "description": "在投币 KTV 投币或扫卡、用遥控器搜索热门 K-POP 歌曲编号并调麦克风音量。",
    "targetSkills": [
      "练歌房用语 (예약/취소/간주점프)",
      "音量与混响调节",
      "选歌编号"
    ],
    "systemPrompt": "你是投币练歌房老板。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "코노 사장님 (练歌房老板)",
        "avatar": "👨🏻",
        "ko": "빈 방 5번 방으로 들어가시면 됩니다! 카드 결제는 리모컨 아래 단말기에서 바로 가능해요.",
        "zh": "空房间 5 号房可以直接进去！刷卡支付在遥控器下方的刷卡机即可完成。",
        "roman": "Bin bang 5-beon bang-euro...",
        "grammarTip": "考点：-으로 들어가다 (进入某方向)；단말기 (刷卡终端)",
        "suggestedResponses": [
          "마이크 커버랑 탬버린은 어디에서 가져가면 되나요?",
          "10곡 결제했는데 혹시 보너스 곡도 넣어주실 수 있나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_17",
    "title": "韩国 CGV 电影院选座与爆米花套餐",
    "koreanTitle": "CGV 영화관 좌석 예매 및 팝콘 콤보",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🍿",
    "gradient": "from-red-600 to-slate-950",
    "description": "在影院前台或自助取票机打印电影票、购买焦糖/芝士爆米花与可乐双人套餐。",
    "targetSkills": [
      "电影票预订 (좌석 선택/자막/더빙)",
      "爆米花口味更换 (달콤/어니언)",
      "取票确认"
    ],
    "systemPrompt": "你是 CGV 影院卖品部兼票务员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "CGV 미소지기 (影院乘务员)",
        "avatar": "🧑🏻‍💼",
        "ko": "안녕하세요, CGV입니다! 예매 티켓 출력이신가요, 아니면 스낵 주문 도와드릴까요?",
        "zh": "您好，这里是 CGV！请问是打印预售票还是为您点零食套餐呢？",
        "roman": "Annyeonghaseyo, CGV-imnida! Yeyae tiket...",
        "grammarTip": "考点：출력하다 (打印)；스낵 (小吃零食)",
        "suggestedResponses": [
          "CGV 콤보 하나 주시고요, 팝콘은 반반(달콤한 맛이랑 어니언 맛)으로 변경해 주세요.",
          "앱으로 예매한 번호가 있는데 티켓 발권기 위치가 어디인가요?"
        ]
      }
    ]
  },
  {
    "id": "daily_18",
    "title": "韩国邮局寄送 EMS 国际快递与报关单",
    "koreanTitle": "우체국 국제특급(EMS) 택배 발송 및 세관 신고",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "📮",
    "gradient": "from-red-600 to-orange-950",
    "description": "在韩国邮局购买纸箱打包特产物品，称重计费并填写寄往中国境内的报关单。",
    "targetSkills": [
      "寄件用语 (무게/운임/박스 규격)",
      "物品报关填写",
      "单号追踪 (등기번호)"
    ],
    "systemPrompt": "你是韩国邮局柜员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "우체국 직원 (邮局员工)",
        "avatar": "👩🏻‍💼",
        "ko": "중국으로 보내시는 EMS 특급이신가요? 상자 안에 배터리나 화장품 액체류가 포함되어 있나요?",
        "zh": "是寄往中国的 EMS 特快专递吗？箱子里面含有电池或化妆品液体类物品吗？",
        "roman": "Jungguk-euro bonaesineun EMS...",
        "grammarTip": "考点：-이/가 포함되어 있다 (包含某物)；배송 금지 품목 (违禁品)",
        "suggestedResponses": [
          "의류와 과자류만 들어있습니다. 박스 테이프 빌려주실 수 있나요?",
          "중국 베이징까지 배송되는 데 보통 며칠 정도 걸리나요?"
        ]
      }
    ]
  },
  {
    "id": "daily_19",
    "title": "E-Mart 大型超市自助结账与垃圾分类袋",
    "koreanTitle": "이마트 셀프 계산대 및 종량제 봉투 구매",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🛒",
    "gradient": "from-yellow-600 to-amber-950",
    "description": "在易买得超市自助结账机扫描条码，购买麻浦区/西大门区指定生活垃圾分类袋。",
    "targetSkills": [
      "超市自助收银",
      "垃圾袋规格 (종량제 봉투 20L)",
      "积分与小票"
    ],
    "systemPrompt": "你是 E-Mart 自助结账区协助员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "마트 안내원 (超市引导员)",
        "avatar": "👩🏻‍💼",
        "ko": "바코드 스캔이 잘 안 되시나요? 제가 도와드리겠습니다. 봉투 필요하신가요?",
        "zh": "条形码扫描不顺利吗？我来帮您。请问需要购物袋吗？",
        "roman": "Bakodeu seukaen-i jal an doesinayo?...",
        "grammarTip": "考点：-이/가 잘 안 되다 (做某事不太顺畅)；종량제 (按量收费垃圾袋)",
        "suggestedResponses": [
          "마포구 20리터짜리 일반 종량제 쓰레기봉투 한 장 같이 계산해 주세요.",
          "모바일 신세계 상품권으로도 결제 가능한가요?"
        ]
      }
    ]
  },
  {
    "id": "daily_20",
    "title": "首尔共享单车“叮铃铃 (따릉이)”租借与故障报修",
    "koreanTitle": "서울 공공자전거 따릉이 대여 및 반납",
    "category": "daily_life",
    "categoryLabel": "赴韩实用生活",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🚲",
    "gradient": "from-emerald-600 to-green-950",
    "description": "使用外国人专属 App 扫描车锁二维码租车，途中遇到刹车异响申请换车与还车。",
    "targetSkills": [
      "共享单车使用 (QR코드 스캔/임시잠금)",
      "还车确认 (반납 완료)",
      "故障报修"
    ],
    "systemPrompt": "你是首尔公共自行车客服中心语音。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "따릉이 안내센터 (单车客服)",
        "avatar": "🚲",
        "ko": "따릉이 고객센터입니다. 대여 및 반납 중 어떤 부분에 불편을 겪고 계신가요?",
        "zh": "这里是首尔单车站务客服中心。请问在租借或还车过程中遇到了什么困难呢？",
        "roman": "Ttareungi gogaek senteo-imnida...",
        "grammarTip": "考点：불편을 겪다 (遭遇不便)；반납하다 (归还)",
        "suggestedResponses": [
          "거치대에 반납 잠금장치를 채웠는데 반납 완료 알림이 안 와요.",
          "자전거 브레이크에 이상이 있어서 다른 자전거로 재대여하고 싶습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_01",
    "title": "韩国名企求职面试 · 1分钟韩语自我介绍",
    "koreanTitle": "한국 대기업 취업 면접 · 1분 자기소개",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "💼",
    "gradient": "from-blue-800 to-indigo-950",
    "description": "在三星/LG/现代等韩国大企业面试中，用精炼高级的格式体韩语阐述核心竞争力与岗位契合度。",
    "targetSkills": [
      "商务自我介绍",
      "格式体敬语 (-ㅂ니다/습니다)",
      "竞争力展示"
    ],
    "systemPrompt": "你是韩国大企业资深主考官。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "인사팀 면접관 (HR面试官)",
        "avatar": "👨🏻‍💼",
        "ko": "지원자님, 긴장하지 마시고 1분 동안 본인의 핵심 강점과 지원 동기를 간략히 말씀해 주십시오.",
        "zh": "应聘者请放松，请在 1 分钟时间内简明扼要地陈述您的核心竞争优势及应聘动机。",
        "roman": "Jiwonja-nim, ginjanghaji masigo...",
        "grammarTip": "考点：핵심 강점 (核心强项)；지원 동기 (应聘动机)",
        "suggestedResponses": [
          "안녕하십니까! 글로벌 마케팅 직무에 지원한 [이름]입니다. 한중 양국의 문화적 이해와 실무 역량을 바탕으로...",
          "저의 가장 큰 차별점은 시장 데이터 분석력과 원활한 다국어 커뮤니케이션 능력입니다."
        ]
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "biz_02",
    "title": "面试应对 · 自身缺点与克服经历",
    "koreanTitle": "면접 대처 · 성격의 단점 및 극복 사례",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🎯",
    "gradient": "from-blue-800 to-indigo-950",
    "description": "回答面试官关于“性格最大缺点”的提问，巧妙转为正面反思与改进实践。",
    "targetSkills": [
      "逆境反思",
      "克服过程叙述",
      "真诚态度展现"
    ],
    "systemPrompt": "你是严谨的企业面试官。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "면접관 (面试官)",
        "avatar": "👩🏻‍💼",
        "ko": "업무를 수행하면서 겪었던 본인의 단점이나 실패 경험이 있다면 이를 어떻게 보완하셨습니까?",
        "zh": "在开展业务工作中，如果有您发现的自身不足或失败经历，您是如何进行改进弥补的？",
        "roman": "Eommu-reul suhaenghamyeonseo gyeok-eotdeon...",
        "grammarTip": "考点：-을/를 보완하다 (补全弥补)；실패 경험 (失败经历)",
        "suggestedResponses": [
          "지나치게 완벽을 추구하여 일정이 지연되던 점을 개선하기 위해, 우선순위 매트릭스를 활용하여...",
          "실패를 두려워하기보다는 빠른 피드백을 통해 즉각적인 해결책을 도출하는 긍정적인 자세를 길렀습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_03",
    "title": "职场首日入职破冰与同事初次问候",
    "koreanTitle": "입사 첫날 팀원 인사 및 부서 온보딩",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🏢",
    "gradient": "from-indigo-700 to-slate-950",
    "description": "第一天入职韩国公司，向部门组长与团队同事做谦逊得体的入职问候。",
    "targetSkills": [
      "职场称谓 (팀장님/대리님)",
      "谦虚表达",
      "职场破冰"
    ],
    "systemPrompt": "你是热情严谨的部门组长。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "박 팀장님 (朴组长)",
        "avatar": "👨🏻‍💼",
        "ko": "오늘부터 우리 마케팅팀에서 함께 일하게 된 신입사원입니다! 팀원들에게 간단한 인사 한마디 부탁해요.",
        "zh": "这是从今天起在我们市场团队一同共事的新入职员工！请跟团队同事们简单打个招呼吧。",
        "roman": "Oneulbuteo uri maketing tim-eseo...",
        "grammarTip": "考点：신입사원 (新员工)；-게 되다 (得以成为...)",
        "suggestedResponses": [
          "안녕하십니까! 오늘 새로 입사한 [이름]입니다. 아직 부족한 점이 많지만 팀에 빠르게 기여할 수 있도록 최선을 다하겠습니다.",
          "선배님들께 많이 배우고 겸손한 자세로 성실하게 일하겠습니다. 잘 부탁드립니다!"
        ]
      }
    ]
  },
  {
    "id": "biz_04",
    "title": "商务电子邮件与商务电话沟通礼仪",
    "koreanTitle": "비즈니스 이메일 작성 및 전화 응대",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "📧",
    "gradient": "from-blue-700 to-slate-900",
    "description": "接听韩国合作方业务电话、确认会议日程并在通话后发送规范的商务跟进邮件。",
    "targetSkills": [
      "商务电话常用语 (통화 가능하신가요?)",
      "邮件格式规范",
      "确认纪要"
    ],
    "systemPrompt": "你是韩国合作企业业务经理。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "김 과장 (金科长)",
        "avatar": "👨🏻‍💻",
        "ko": "네, ABC상사 김 과장입니다. 보내주신 제안서 잘 검토했는데요, 다음 주 미팅 일정을 조율할 수 있을까요?",
        "zh": "您好，我是 ABC 商社的金科长。您发来的提案书我们已认真审阅，请问能协调一下下周的会议日程吗？",
        "roman": "Ne, ABC sangsa Kim gwajang-imnida...",
        "grammarTip": "考点：검토하다 (审阅/审查)；일정을 조율하다 (协调日程)",
        "suggestedResponses": [
          "네 과장님, 연락 주셔서 감사합니다. 다음 주 화요일 오후 2시 본사 대회의실에서 뵙는 것이 어떠실까요?",
          "통화 내용 바탕으로 회의 안건과 참석자 명단을 메일로 송부드리겠습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_05",
    "title": "跨部门项目推进会议工作进度汇报",
    "koreanTitle": "타 부서 협업 주간 업무 진척 보고",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "📊",
    "gradient": "from-slate-800 to-indigo-950",
    "description": "在跨部门周例会上，用清晰条理的数据汇报当前产品上线进度及阻碍点 (Bottleneck)。",
    "targetSkills": [
      "结构化汇报 (목표-현황-이슈-대책)",
      "数据表达",
      "协作请求"
    ],
    "systemPrompt": "你是项目总监 (PMO)。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "프로젝트 총괄이사 (项目总监)",
        "avatar": "👩🏻‍💼",
        "ko": "이번 주 신규 기능 개발 현황과 일정상 병목이 발생하는 부분이 있다면 공유해 주십시오.",
        "zh": "请同步本周新功能开发进度，以及在时间节点上是否存在瓶颈阻碍。",
        "roman": "Ibeon ju singyu gineung gaebal...",
        "grammarTip": "考点：병목 현상 (瓶颈现象)；공유해 주십시오 (请予以同步)",
        "suggestedResponses": [
          "UI 디자인 작업은 100% 완료되었으며, 서버 API 연동 테스트 과정에서 발생한 버그를 조치 중입니다.",
          "예정된 런칭 일정을 준수하기 위해 QA 인력 추가 배치를 요청드리는 바입니다."
        ]
      }
    ]
  },
  {
    "id": "biz_06",
    "title": "商务宴请与韩国客户祝酒辞文化",
    "koreanTitle": "비즈니스 만찬 및 바이어 건배사",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🥂",
    "gradient": "from-amber-700 to-yellow-950",
    "description": "在接待韩国重要客户的晚宴上，发表热情的欢迎辞与双方合作共赢的祝酒辞。",
    "targetSkills": [
      "祝酒辞格式 (건배사)",
      "商务敬酒礼仪",
      "感谢与愿景表达"
    ],
    "systemPrompt": "你是韩国合作方常务理事。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "이 상무 (李常务)",
        "avatar": "👴🏻",
        "ko": "먼 길 오시느라 고생 많으셨습니다! 오늘 자리를 빛내주셔서 감사드리며, 멋진 건배사 하나 부탁드립니다!",
        "zh": "远道而来辛苦了！非常感谢您今日莅临，请您为大家带来一段精彩的祝酒辞吧！",
        "roman": "Meon gil osineura gosaeng...",
        "grammarTip": "考点：자리를 빛내주시다 (使宴席蓬荜生辉)；건배사 (祝酒辞)",
        "suggestedResponses": [
          "양사의 오랜 신뢰와 성공적인 파트너십을 위하여! \"위하여\"로 화답해 주시면 감사하겠습니다. 건배!",
          "귀사의 따뜻한 환대에 깊이 감사드리며, 이번 프로젝트의 눈부신 성공을 기원합니다!"
        ]
      }
    ]
  },
  {
    "id": "biz_07",
    "title": "向上级领导请假、差旅报销与审批沟通",
    "koreanTitle": "연차 휴가 신청 및 출장 경비 결재",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "📝",
    "gradient": "from-blue-700 to-cyan-950",
    "description": "向部门主管申请年假、安排工作交接，并提交出差机票发票报销审批单。",
    "targetSkills": [
      "请假用语 (연차/반차)",
      "工作交接 (업무 인수인계)",
      "报销申请 (경비 청구)"
    ],
    "systemPrompt": "你是部门直接主管。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "직속 팀장 (部门主管)",
        "avatar": "👨🏻‍💼",
        "ko": "다음 주에 연차 쓰신다고 전자결재 올리셨던데, 진행 중인 업무는 인수인계가 다 되었나요?",
        "zh": "听说你在电子审批系统提报了下周休年假，正在推进的工作都交接妥当了吗？",
        "roman": "Daeum ju-e yeoncha sseusindago...",
        "grammarTip": "考点：전자결재 (电子审批)；인수인계 (工作交接)",
        "suggestedResponses": [
          "네 팀장님, 급한 마케팅 리포트는 이번 주 금요일까지 완료하고 긴급 건은 김 대리님께 공유해 두었습니다.",
          "지난 부산 출장 관련 KTX 영수증과 숙박비 정산서도 결재함에 상신해 두었습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_08",
    "title": "业务合作合同谈判与争取价格折扣",
    "koreanTitle": "계약 조건 협상 및 단가 네고(Nego)",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🤝",
    "gradient": "from-slate-700 to-indigo-950",
    "description": "与韩国供应商商务谈判，依据采购量要求 10% 的单价折扣并商定付款账期。",
    "targetSkills": [
      "商务谈判策略",
      "价格交涉 (단가 인하/할인)",
      "付款条件 (결제 조건)"
    ],
    "systemPrompt": "你是韩国原厂销售总监。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "영업총괄 이사 (销售总监)",
        "avatar": "👨🏻‍💼",
        "ko": "원자재 가격 상승으로 인해 제시해 주신 15% 인하는 어렵습니다. 상호 조율 가능한 마지노선은 어디입니까?",
        "zh": "由于原材料成本上涨，您提出的降价 15% 很难实现。双方能够协商达成的底线在哪里呢？",
        "roman": "Wonjajae gagyeok sangseung-euro...",
        "grammarTip": "考点：마지노선 (底线/不可退让的限度)；단가 인하 (降低单价)",
        "suggestedResponses": [
          "연간 발주 수량을 20% 늘리는 조건으로 공급 단가를 8% 인하해 주시는 방안은 어떠실까요?",
          "납품 대금 지급일을 익월 말 현금 결제로 단축해 드릴 테니 단가 조정을 재고해 주십시오."
        ]
      }
    ]
  },
  {
    "id": "biz_09",
    "title": "产品交付延期向客户致歉与应急方案",
    "koreanTitle": "납기 지연 사과 및 비상 대응책 제시",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "⚠️",
    "gradient": "from-amber-800 to-slate-950",
    "description": "因系统测试发现严重漏洞需推迟交付，向韩国客户高层正式致歉并提交分阶段应急方案。",
    "targetSkills": [
      "危机公关致歉 (심려를 끼쳐드려)",
      "事实说明",
      "替代方案推进"
    ],
    "systemPrompt": "你是非常注重交付期限的客户代表。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "고객사 PM (客户负责人)",
        "avatar": "👩🏻‍💼",
        "ko": "내일이 런칭일인데 갑자기 연기라니 이게 무슨 말씀이십니까? 저희 쪽 손실은 어떻게 책임지실 건가요?",
        "zh": "明天就是正式上线日，突然说要延期这是怎么回事？我们这边的损失你们打算如何承担？",
        "roman": "Naeil-i reonching-il-inde gapjagi...",
        "grammarTip": "考点：심려를 끼쳐드리다 (给您添忧虑/深表歉意)；손실을 책임지다 (承担损失)",
        "suggestedResponses": [
          "예기치 못한 결함으로 심려를 끼쳐드려 고개 숙여 사과드립니다. 핵심 기능만 우선 오픈하여 비즈니스 공백을 막겠습니다.",
          "추가 인력을 투입하여 주말 내 완벽히 수정 완료할 것을 약속드리며, 지연에 따른 보상 방안을 마련하겠습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_10",
    "title": "年终绩效考核面谈与加薪晋升诉求",
    "koreanTitle": "연말 인사평가 면담 및 연봉 협상",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "📈",
    "gradient": "from-blue-700 to-purple-950",
    "description": "在年终 1:1 面谈中列举具体业务贡献指标 (KPI)，得体提出晋升大理/科长与薪酬调整。",
    "targetSkills": [
      "业绩量化表达",
      "自我肯定与未来承诺",
      "薪酬交涉"
    ],
    "systemPrompt": "你是负责年终绩效考核的部门总监。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "본부장님 (部门总监)",
        "avatar": "👨🏻‍💼",
        "ko": "올 한 해 동안 팀의 성과를 위해 정말 수고 많았어요. 스스로 올 한 해 성과를 점수로 매긴다면 몇 점인가요?",
        "zh": "这一年为了团队的业绩付出了很多辛苦。如果给您自己这一年的成绩打个分，您会打多少分呢？",
        "roman": "Ol han hae dongan tim-ui seonggwa-reul...",
        "grammarTip": "考点：점수를 매기다 (打分/评定分数)；성과 (成果/业绩)",
        "suggestedResponses": [
          "목표 매출 대비 120%를 달성하고 신규 바이어 5개사를 유치한 만큼 90점 이상으로 평가하고 싶습니다.",
          "내년도 팀의 핵심 프로젝트를 주도적으로 이끌 수 있도록 대리 승진과 연봉 조정을 긍정적으로 검토해 주시길 희망합니다."
        ]
      }
    ]
  },
  {
    "id": "biz_11",
    "title": "首尔 COEX 国际展会接待外国买家",
    "koreanTitle": "코엑스(COEX) 국제 박람회 바이어 상담",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🏛️",
    "gradient": "from-cyan-700 to-blue-950",
    "description": "在首尔大型博览会展台接待外国采购商，用流畅韩语介绍新产品特性、技术专利与样品寄送。",
    "targetSkills": [
      "展会专业讲解",
      "产品卖点推介",
      "名片互换 (명함 교환)"
    ],
    "systemPrompt": "你是前来展位咨询采购的外国买家代表。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "해외 바이어 (海外买家)",
        "avatar": "👨🏻‍💼",
        "ko": "부스에 전시된 이 신제품의 친환경 소재와 인증 내역에 대해 설명해 주실 수 있나요?",
        "zh": "请问可以向我介绍一下展台展示的这款新产品的环保材料及认证详情吗？",
        "roman": "Buseu-e jeonsidoen i sinjepum-ui...",
        "grammarTip": "考点：-에 대해 설명하다 (关于...进行说明)；친환경 소재 (环保材质)",
        "suggestedResponses": [
          "네, 이 제품은 100% 생분해성 바이오 플라스틱으로 제작되어 유럽 CE 친환경 인증을 획득했습니다.",
          "상세 카탈로그와 샘플을 준비해 두었으니 명함을 주시면 내일 바로 발송해 드리겠습니다."
        ]
      }
    ]
  },
  {
    "id": "biz_12",
    "title": "韩国职场下班“会食 (회식)”互动与祝酒",
    "koreanTitle": "퇴근 후 직장 회식 문화 및 분위기 띄우기",
    "category": "business_work",
    "categoryLabel": "职场商务面试",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🍻",
    "gradient": "from-amber-600 to-orange-950",
    "description": "融入韩国独特的公司下班聚餐文化，得体向领导敬酒 (두 손으로 받기)、活跃气氛。",
    "targetSkills": [
      "酒桌礼仪 (고개 돌려 마시기)",
      "职场闲聊",
      "氛围带动"
    ],
    "systemPrompt": "你是会食聚餐中兴致高昂的李部长。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "이 부장님 (李部长)",
        "avatar": "👨🏻",
        "ko": "자자, 다들 이번 분기 고생 많았어! 신입사원, 부장님한테 한 잔 따라봐!",
        "zh": "来来来，大家这个季度都辛苦了！新员工，来给部长倒一杯酒！",
        "roman": "Ja ja, dadeul ibeon bungi gosaeng...",
        "grammarTip": "考点：술을 따르다 (倒酒)；두 손으로 (用双手)",
        "suggestedResponses": [
          "부장님, 올 한 해 많은 지도편달 감사드립니다! 제가 두 손으로 정성껏 한 잔 올리겠습니다.",
          "부장님의 건강과 우리 사업부의 대박을 기원합니다! 다 같이 건배하시죠!"
        ]
      }
    ]
  },
  {
    "id": "campus_01",
    "title": "韩国大学语学院分班口试面试",
    "koreanTitle": "어학당 레벨테스트 구술 면접",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🏫",
    "gradient": "from-green-600 to-emerald-950",
    "description": "参加韩国大学语学院入学当天的韩语口语水平测试，回答兴趣爱好与留学目标。",
    "targetSkills": [
      "分班考试口语",
      "基础语法运用",
      "学习动机展示"
    ],
    "systemPrompt": "你是语学院分班考试主考老师。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "어학당 선생님 (语学院老师)",
        "avatar": "👩🏻‍🏫",
        "ko": "안녕하세요! 한국어 공부를 시작한 지 얼마나 되셨고, 가장 좋아하는 한국 음식은 무엇인가요?",
        "zh": "您好！学习韩语有多长时间了，最喜欢的韩国食物是什么呢？",
        "roman": "Annyeonghaseyo! Hangugeo gongbu-reul...",
        "grammarTip": "考点：-ㄴ 지 얼마나 되다 (过了多久)；가장 좋아하다 (最喜欢)",
        "suggestedResponses": [
          "중국에서 6개월 동안 독학했고 김치찌개와 불고기를 가장 좋아합니다.",
          "한국 대학원에 입학하기 위해 매일 3시간씩 열심히 공부하고 있습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_02",
    "title": "大学教授面谈与毕业论文方向请教",
    "koreanTitle": "지도교수님 면담 및 졸업논문 주제 상담",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "📜",
    "gradient": "from-slate-700 to-blue-950",
    "description": "在研究室拜访指导教授，礼貌请教毕业论文的研究方法论与参考文献推荐。",
    "targetSkills": [
      "学术敬语",
      "论文开题沟通",
      "指导请教"
    ],
    "systemPrompt": "你是学识渊博但要求严格的韩国大学指导教授。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "지도교수님 (指导教授)",
        "avatar": "👨🏻‍🏫",
        "ko": "어서 와요. 이번 학기 졸업논문 프로포절 주제로 어떤 분야를 연구해 볼 생각인가요?",
        "zh": "快请进。本学期毕业论文开题报告，你打算研究哪方面的主题呢？",
        "roman": "Eoseo wayo. Ibeon hakgi joreop...",
        "grammarTip": "考点：프로포절 (Proposal/开题报告)；-ㄹ 생각이다 (打算...)",
        "suggestedResponses": [
          "교수님 안녕하십니까. 저는 한중 전자상거래 플랫폼의 소비자 신뢰도 비교 분석을 연구해 보고자 합니다.",
          "실증 연구를 위한 설문조사 방법론에 대해 교수님의 고견을 여쭙고 싶습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_03",
    "title": "韩国大学小组作业 (Team Play) 分工与讨论",
    "koreanTitle": "대학 조별과제(팀플) 역할 분담 및 회의",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "👥",
    "gradient": "from-amber-600 to-teal-950",
    "description": "与韩国同班同学进行小组作业分工，主动承担 PPT 制作与资料收集角色。",
    "targetSkills": [
      "团队分工 (자료조사/PPT제작/발표)",
      "协作沟通",
      "会议讨论"
    ],
    "systemPrompt": "你是热心负责的小组组长同学。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "조장 학생 (组长同学)",
        "avatar": "👦🏻",
        "ko": "다들 모였지? 이번 마케팅 발표 과제에서 각자 맡고 싶은 파트가 있어? 자유롭게 얘기해 줘!",
        "zh": "大家都到齐了吧？这次市场营销演讲作业，大家有各自想负责的部分吗？欢迎自由交流！",
        "roman": "Dadeul moyeotji? Ibeon maketing...",
        "grammarTip": "考点：맡고 싶은 파트 (想要负责的部分)；조별과제 (小组作业)",
        "suggestedResponses": [
          "제가 디자인이랑 PPT 제작을 잘 다루니까 발표 자료 제작을 맡겠습니다!",
          "저는 중국 기업 해외 진출 성공 사례와 관련된 해외 논문 자료 조사를 담당할게요."
        ]
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "campus_04",
    "title": "大学中央图书馆自习室座位预约与借书",
    "koreanTitle": "대학교 중앙도서관 열람실 좌석 배정 및 대출",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "📚",
    "gradient": "from-blue-600 to-indigo-950",
    "description": "在图书馆智能自助机预约期末考试复习自习室座位，并在服务台办理借书与续借。",
    "targetSkills": [
      "图书馆设施使用",
      "借还书 (대출/반납/연장)",
      "座位预约"
    ],
    "systemPrompt": "你是大学图书馆管理员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "사서 선생님 (图书管理员)",
        "avatar": "👩🏻‍💼",
        "ko": "학생증 바코드 찍어주시고요. 도서 대출이신가요, 아니면 반납이신가요?",
        "zh": "请刷一下学生证条形码。请问是借阅图书还是归还图书呢？",
        "roman": "Haksaengjeung bakodeu jjigeo...",
        "grammarTip": "考点：학생증 (学生证)；도서 대출 (图书借阅)",
        "suggestedResponses": [
          "이 전공 서적 2권 2주 동안 대출하고 싶습니다. 대출 연장도 온라인에서 가능한가요?",
          "3열람실 좌석을 키오스크에서 발권했는데 연장하려면 몇 시까지 해야 하나요?"
        ]
      }
    ]
  },
  {
    "id": "campus_05",
    "title": "外国留学生优秀奖学金申请面试",
    "koreanTitle": "외국인 우수 유학생 장학금 면접 심사",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🏆",
    "gradient": "from-yellow-600 to-amber-950",
    "description": "向国际交流处审核委员会阐述自身优异的 GPA 成绩、韩国文化传播志愿经历。",
    "targetSkills": [
      "奖学金答辩",
      "学业成就展示 (학점/GPA)",
      "抱负与感恩"
    ],
    "systemPrompt": "你是大学国际处奖学金评审委员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "국제처 심사위원 (国际处评审)",
        "avatar": "👨🏻‍🏫",
        "ko": "지원자님의 성적과 교내외 활동 이력이 매우 우수하군요. 이번 장학금을 받아야 하는 이유를 말씀해 주십시오.",
        "zh": "应聘者的在校成绩和校内外活动经历非常优异。请陈述您应当获得本次奖学金的理由。",
        "roman": "Jiwonja-nim-ui seongjeok-gwa...",
        "grammarTip": "考点：-이/가 우수하다 (优异)；교내외 활동 (校内外活动)",
        "suggestedResponses": [
          "학업에 전념하여 학과 수석을 유지함과 동시에, 한중 문화교류 서포터즈로서 양국 학생들의 가교 역할을 해왔습니다.",
          "장학금을 지원받는다면 경제적 부담을 덜고 연구 역량을 더욱 심화하여 학교의 명예를 높이겠습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_06",
    "title": "大学学生宿舍设施故障报修与门禁违规解释",
    "koreanTitle": "기숙사 행정실 시설 보수 및 통금 소명",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🛏️",
    "gradient": "from-slate-600 to-indigo-950",
    "description": "前往宿舍行政室报修寝室空调制冷故障，并向舍监阿姨说明因小组作业迟归的理由。",
    "targetSkills": [
      "宿舍生活规范 (벌점/통금)",
      "空调报修 (냉방 고장)",
      "请假报备"
    ],
    "systemPrompt": "你是宿舍行政室管理员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "기숙사 사감 선생님 (宿舍舍监)",
        "avatar": "👩🏻‍🏫",
        "ko": "몇 동 몇 호 학생인가요? 방에 무슨 수리할 곳이 있어서 오셨나요?",
        "zh": "请问是哪栋几号房的学生？房间里有什么需要维修的地方吗？",
        "roman": "Myeot dong myeot ho haksaeng-in-gayo?...",
        "grammarTip": "考点：몇 동 몇 호 (哪栋几号)；수리하다 (维修)",
        "suggestedResponses": [
          "국제학사 402호인데요, 에어컨에서 물이 떨어지고 시원한 바람이 안 나와서요.",
          "어제 조별과제 회의가 늦어져 통금 시간을 10분 넘겼는데 벌점 감면 사유서를 제출하고 싶습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_07",
    "title": "韩国大学校庆祭典与国际文化摊位策划",
    "koreanTitle": "대학교 축제(대동제) 세계 문화 부스 기획",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🎪",
    "gradient": "from-orange-600 to-pink-950",
    "description": "在大学学生会举办的五月大同祭校庆中，策划中国传统美食文化体验摊位。",
    "targetSkills": [
      "校庆活动策划",
      "摊位布置与宣传",
      "活动分工"
    ],
    "systemPrompt": "你是大学学生会祭典策划部部长。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "총학생회 축제기획부장 (学生会部长)",
        "avatar": "🧑🏻",
        "ko": "유학생회에서 이번 대동제 축제 때 전통 음식 부스를 운영하신다고 들었는데 구체적인 메뉴가 정해졌나요?",
        "zh": "听说留学生会本次大同祭校庆将运营传统美食摊位，具体菜单已经确定了吗？",
        "roman": "Yuhaksaenghoe-eseo ibeon daedongje...",
        "grammarTip": "考点：대동제 (大学校庆大同祭)；-ㄴ다고 들었다 (听说...)",
        "suggestedResponses": [
          "네! 한국 학생들이 좋아하는 마라탕과 탕후루 만들기 체험 부스를 운영하기로 결정했습니다.",
          "가스버너 안전 점검과 부스 천막 설치 일정을 학생회와 조율하고 싶습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_08",
    "title": "全韩外国人韩语演讲大赛赛前演练",
    "koreanTitle": "외국인 한국어 말하기 대회 발표 및 리허설",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🎙️",
    "gradient": "from-rose-600 to-purple-950",
    "description": "准备以“我眼中的 K-Culture 与中韩青年未来”为主题进行 3 分钟舞台脱稿演讲。",
    "targetSkills": [
      "公众演讲技巧 (스피치)",
      "语调抑扬顿挫",
      "引发共鸣与互动"
    ],
    "systemPrompt": "你是演讲比赛专业指导导师。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "말하기 대회 코치 (演讲教练)",
        "avatar": "👩🏻‍🏫",
        "ko": "무대에서는 도입부에서 청중의 시선을 사로잡는 오프닝이 중요합니다. 준비하신 첫 문장을 들려주시겠어요?",
        "zh": "在舞台上，开篇吸引观众注意力的导入非常关键。能让我听听您准备好的第一句话吗？",
        "roman": "Mudae-eseoneun doipbu-eseo...",
        "grammarTip": "考点：시선을 사로잡다 (吸引目光/抓住视线)；도입부 (引入部分)",
        "suggestedResponses": [
          "여러분, 음악과 문화에는 국경이 없다는 말을 실감해 보신 적이 있으십니까?",
          "처음 한국 땅을 밟았던 3년 전, 제 서툰 한국어에 따뜻하게 손을 내밀어 준 한마디는 바로..."
        ]
      }
    ]
  },
  {
    "id": "campus_09",
    "title": "大学教务处学费缴纳与分期付款咨询",
    "koreanTitle": "교무처 등록금 납부 및 분할납부 상담",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "💳",
    "gradient": "from-blue-600 to-slate-950",
    "description": "前往大学行政楼咨询新学期学费虚拟账号转账、海外信用卡支付及分期缴纳流程。",
    "targetSkills": [
      "教务财务术语 (등록금/가상계좌)",
      "分期申请 (분할납부)",
      "收据确认"
    ],
    "systemPrompt": "你是大学财务教务科职员。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "학사행정팀 직원 (教务处职员)",
        "avatar": "👩🏻‍💼",
        "ko": "등록금 고지서 확인하셨나요? 일시납과 분할납부 중 어떤 방식으로 납부하시겠습니까?",
        "zh": "确认过学费缴费通知单了吗？请问您打算按一次性全额缴纳还是分期付款方式缴纳呢？",
        "roman": "Deungnokgeum gojiseo hwaginhayeonnayo?...",
        "grammarTip": "考点：등록금 고지서 (学费账单)；분할납부 (分期缴纳)",
        "suggestedResponses": [
          "해외 송금 일정상 3회 분할납부를 신청하고 싶은데 포털 시스템에서 어떻게 신청하나요?",
          "외국인 유학생 성적 장학금이 감면 적용된 최종 납부 금액을 확인하고 싶습니다."
        ]
      }
    ]
  },
  {
    "id": "campus_10",
    "title": "参加韩国大学社团 (Dongari) 招新面试",
    "koreanTitle": "대학교 동아리 가입 면접 및 오리엔테이션",
    "category": "campus_study",
    "categoryLabel": "语学院与留学",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🎸",
    "gradient": "from-purple-600 to-indigo-950",
    "description": "参加韩国大学街舞/乐队/摄影中央社团的新人选拔面试，用风趣真诚的韩语展示热情。",
    "targetSkills": [
      "社团面试交流",
      "特长展示",
      "校园社交破冰"
    ],
    "systemPrompt": "你是大学摇滚乐队社团社长。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "동아리 회장 (社团社长)",
        "avatar": "🎸",
        "ko": "우리 밴드 동아리에 지원해 줘서 고마워! 다룰 줄 아는 악기나 지원하게 된 계기가 있어?",
        "zh": "感谢你报名我们乐队社团！有什么擅长演奏的乐器或者报名的契机吗？",
        "roman": "Uri baendeu dongari-e jiwonhae jwoseo...",
        "grammarTip": "考点：-ㄹ 줄 알다 (懂得/擅长做某事)；동아리 (大学社团)",
        "suggestedResponses": [
          "고등학교 때부터 일렉기타를 3년 동안 연주해 왔고 한국 인디 밴드 음악을 정말 사랑합니다!",
          "한국 친구들과 함께 합주하면서 즐거운 대학 생활 추억을 만들고 싶어서 지원했습니다."
        ]
      }
    ]
  },
  {
    "id": "kdrama_01",
    "title": "《背着善宰跑》· 汉江桥上的初雪心动重逢",
    "koreanTitle": "선재 업고 튀어 · 한강다리 첫눈 재회",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🎬",
    "gradient": "from-amber-600 to-rose-900",
    "description": "穿越时空回到高中，在纷飞的初雪中与撑着黄雨伞的柳善宰重逢对话。",
    "targetSkills": [
      "情感对白表达",
      "同龄平语 (-아/야, -지?)",
      "心动与安慰"
    ],
    "systemPrompt": "你是《背着善宰跑》中的柳善宰，深情温暖。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "류선재 (柳善宰)",
        "avatar": "🧑🏻‍🎓",
        "ko": "솔아, 눈 온다. 왜 우산도 안 쓰고 이러고 서 있어? 감기 걸리면 어쩌려고…",
        "zh": "小率，下雪了。怎么连伞都不撑就傻站在这儿？要是感冒了该怎么办……",
        "roman": "Sol-a, nun onda. Wae usando an sseugo...",
        "grammarTip": "考点：-면 어쩌려고 (要是...的话怎么办)；반말 (平语)",
        "suggestedResponses": [
          "선재야! 네가 살아있어서… 정말 다행이야. 다신 어디 가지 마.",
          "선재야, 나 너 지키러 왔어. 이번엔 내가 널 꼭 지켜줄게."
        ]
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "kdrama_02",
    "title": "《眼泪女王》· 德国薰衣草田的深情告白",
    "koreanTitle": "눈물의 여왕 · 독일 라벤더밭 진심 고백",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "👑",
    "gradient": "from-rose-700 to-purple-950",
    "description": "与女王集团财阀继承人洪海仁在德国异国街头敞开心扉，挽救彼此濒临破碎的婚姻。",
    "targetSkills": [
      "傲娇与真诚交织",
      "深度情感交锋",
      "誓言与承诺"
    ],
    "systemPrompt": "你是《眼泪女王》中的洪海仁，外冷内热。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "홍해인 (洪海仁)",
        "avatar": "👸🏻",
        "ko": "백현우, 나 안 보여? 여기까지 왜 따라왔어? 나 불쌍해서 동정하는 거야?",
        "zh": "白贤佑，你看不见我吗？为什么一路追到这里？是因为看我可怜在同情我吗？",
        "roman": "Baek Hyun-woo, na an boyeo?...",
        "grammarTip": "考点：-는 거야? (是在...吗？)；동정하다 (同情)",
        "suggestedResponses": [
          "동정 아니야. 널 혼자 둘 수 없어서 왔어. 사랑해, 해인아.",
          "너 없는 내 인생은 아무 의미 없어. 기적이 있다면 너와 함께 기적을 만들고 싶어."
        ]
      }
    ],
    "isWeeklyNew": true,
    "weeklyBatchTag": "🔥 8月第4周新推"
  },
  {
    "id": "kdrama_03",
    "title": "《鬼怪》· 荞麦花田初次召唤与雨伞相遇",
    "koreanTitle": "도깨비 · 메밀꽃밭 첫 소환과 우산",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🕯️",
    "gradient": "from-slate-700 to-indigo-950",
    "description": "吹灭生日蜡烛意外召唤出沉睡九百年的鬼怪金侁，在荞麦花海中探讨命运。",
    "targetSkills": [
      "唯美文艺台词",
      "古今混用敬语",
      "命运隐喻"
    ],
    "systemPrompt": "你是活了900年的鬼怪金侁，沧桑深邃。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "김신 도깨비 (金侁鬼怪)",
        "avatar": "🗡️",
        "ko": "너야? 날 불러낸 게 너냐고. 대체 날 어떻게 소환한 거지?",
        "zh": "是你吗？把本座召唤出来的人是你吗。你究竟是通过什么方式召唤我的？",
        "roman": "Neo-ya? Nal bulleonaen ge neonyago...",
        "grammarTip": "考点：-냐고 묻다 (质问)；소환하다 (召唤)",
        "suggestedResponses": [
          "저도 모르게 촛불을 껐더니 아저씨가 나타났어요! 아저씨 진짜 도깨비 맞아요?",
          "메밀꽃의 꽃말이 뭔지 아세요? \"연인\"이래요. 우리 운명인가 봐요."
        ]
      }
    ]
  },
  {
    "id": "kdrama_04",
    "title": "《机智的医生生活》· 律帝医院五人组乐团排练",
    "koreanTitle": "슬기로운 의사생활 · 99즈 밴드 합주와 칼국수",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🩺",
    "gradient": "from-teal-600 to-slate-950",
    "description": "与李翊晙、蔡颂和等 99 级五人帮在地下室排练经典老歌，排练后一起抢吃刀削面。",
    "targetSkills": [
      "生动生活化平语",
      "朋友间打趣互怼",
      "日常暖心互动"
    ],
    "systemPrompt": "你是机医搞笑活宝兼天才医生李翊晙。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "이익준 (李翊晙)",
        "avatar": "👨🏻‍⚕️",
        "ko": "야야, 베이스 박자 또 놓쳤지? 오늘 합주 끝나고 송화가 칼국수 쏜다니까 집중하자!",
        "zh": "喂喂，贝斯节拍是不是又漏了？颂和说今天排练完她请吃刀削面，大家集中精神！",
        "roman": "Ya ya, beiseu bakja tto...",
        "grammarTip": "考点：-ㄴ다니까 (因为听说要...所以)；박자를 놓치다 (漏拍)",
        "suggestedResponses": [
          "익준아, 네 보컬 음정이 더 불안하거든? 칼국수에 만두 추가하는 거지?",
          "오늘 야간 당직만 아니었으면 밤새 연습하는 건데 아쉽다!"
        ]
      }
    ]
  },
  {
    "id": "kdrama_05",
    "title": "《黑暗荣耀》· 棋盘前的复仇对弈与命运宣判",
    "koreanTitle": "더 글로리 · 바둑판 앞의 복수와 침묵",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "♟️",
    "gradient": "from-slate-900 to-black",
    "description": "在静谧压抑的棋院与文东恩对弈黑白围棋，展开字字诛心的复仇交锋。",
    "targetSkills": [
      "冷峻气场营造",
      "哲理隐喻对白",
      "克制而极具张力的表达"
    ],
    "systemPrompt": "你是《黑暗荣耀》中的文东恩，冷峻坚毅。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "문동은 (文东恩)",
        "avatar": "♟️",
        "ko": "바둑은 침묵 속에서 욕망을 드러내는 게임이죠. 당신의 다음 수는 어디인가요, 연진아?",
        "zh": "围棋是在无声的沉默中袒露欲望的博弈。你的下一步棋会落在哪里呢，妍珍啊？",
        "roman": "Baduk-eun chimmuk sog-eseo...",
        "grammarTip": "考点：-에 비유하다 (比喻为...)；침묵 속에서 (在沉默中)",
        "suggestedResponses": [
          "난 네가 만든 지옥에서 한 발짝도 나갈 생각이 없어. 끝까지 가보자, 동은아.",
          "침묵 끝에 남는 건 결국 폐허뿐이야. 하지만 난 멈추지 않을 거야."
        ]
      }
    ]
  },
  {
    "id": "kdrama_06",
    "title": "《请回答1988》· 双门洞胡同口与崔泽的夜聊",
    "koreanTitle": "응답하라 1988 · 쌍문동 골목길 택이와의 대화",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "📼",
    "gradient": "from-amber-700 to-yellow-950",
    "description": "回到 1988 年的双门洞胡同，坐在台阶上陪刚下棋归来的阿泽吃热腾腾的烤红薯。",
    "targetSkills": [
      "复古怀旧温馨对白",
      "亲近温暖关怀",
      "胡同邻里情谊"
    ],
    "systemPrompt": "你是双门洞围棋天才崔泽阿泽，单纯温柔。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "최택 (崔泽阿泽)",
        "avatar": "👦🏻",
        "ko": "덕선아, 오늘 대국 끝나고 오는데 네 생각 많이 나더라. 너 밥은 먹었어?",
        "zh": "德善啊，今天下完棋回来的路上，格外想你。你吃晚饭了吗？",
        "roman": "Deoksun-a, oneul daeguk kkeutnago...",
        "grammarTip": "考点：생각이 나다 (想起某人)；-았/었어? (吃饭了吗平语)",
        "suggestedResponses": [
          "택아, 오늘 대국 이겼어? 너 또 두통약 먹었지? 밥 챙겨 먹어야 해!",
          "선우네랑 정환이네 다 모여서 방금 라면 끓여 먹었어. 너 주려고 귤 남겨뒀지!"
        ]
      }
    ]
  },
  {
    "id": "kdrama_07",
    "title": "《太阳的后裔》· 乌鲁克战地与柳时镇大尉调侃",
    "koreanTitle": "태양의 후예 · 우르크 파병지 유시진 대위",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🪖",
    "gradient": "from-amber-800 to-slate-950",
    "description": "在异国维和战地帐篷前，与特战队柳时镇大尉展开机智幽默又深情的战地对话。",
    "targetSkills": [
      "军旅格式体 (-지 말입니다)",
      "俏皮幽默化解危机",
      "浪漫告白"
    ],
    "systemPrompt": "你是幽默英勇的柳时镇大尉。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "유시진 대위 (柳时镇大尉)",
        "avatar": "🪖",
        "ko": "강 선생, 사과할까요, 고백할까요? 전 지금 아주 진지하지 말입니다.",
        "zh": "姜医生，是要我道歉呢，还是要我告白呢？我现在可是非常认真的。",
        "roman": "Kang seonsaeng, sagwahalkkayo...",
        "grammarTip": "考点：-지 말입니다 (军旅特有句尾)；-ㄹ까요 (是要...吗)",
        "suggestedResponses": [
          "유 대위님은 매번 위험한 곳만 골라 가면서 사람 마음을 이렇게 흔들어 놓으시네요.",
          "사과하지 말고 고백하세요. 저도 유 대위님 기다렸단 말이에요."
        ]
      }
    ]
  },
  {
    "id": "kdrama_08",
    "title": "《来自星星的你》· 与都敏俊教授聊400年时空",
    "koreanTitle": "별에서 온 그대 · 도민준 교수와 400년의 시간",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "高级 (TOPIK 5-6)",
    "icon": "🛸",
    "gradient": "from-slate-800 to-indigo-950",
    "description": "在阳台初雪夜与拥有超能力的外星人都教授探讨时间、爱与炸鸡啤酒。",
    "targetSkills": [
      "傲娇高冷学者语气",
      "深刻时空哲理",
      "浪漫反差萌"
    ],
    "systemPrompt": "你是外星人都敏俊教授，理性克制但深情。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "도민준 교수 (都敏俊教授)",
        "avatar": "🪐",
        "ko": "인간의 100년이라는 시간은 제게는 찰나에 불과합니다. 그런데 왜 당신과 함께하는 1초는 이토록 길게 느껴질까요?",
        "zh": "人类所谓的百年岁月，于我而言不过是转瞬即逝的刹那。可为何与你相伴的一秒钟，却让人感觉如此漫长？",
        "roman": "Ingan-ui 100-nyeon-iraneun siganeun...",
        "grammarTip": "考点：찰나에 불과하다 (不过是刹那)；이토록 (如此这般)",
        "suggestedResponses": [
          "도민준 씨, 400년 동안 혼자 외로웠을 텐데 이제 내 옆에서 평생 같이 떡볶이랑 치맥 먹어요!",
          "당신이 어느 별에서 왔든 상관없어요. 지금 내 눈앞에 있는 당신이 중요하니까요."
        ]
      }
    ]
  },
  {
    "id": "kdrama_09",
    "title": "《梨泰院Class》· 甜夜酒馆与朴世路的创业誓言",
    "koreanTitle": "이태원 클라쓰 · 단밤 포차 박새로이의 다짐",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🌰",
    "gradient": "from-amber-800 to-red-950",
    "description": "在梨泰院小酒馆与不向强权妥协的热血青年朴世路举杯畅谈人生与初心。",
    "targetSkills": [
      "热血励志表达",
      "坚定意志阐述",
      "不服输的人生态度"
    ],
    "systemPrompt": "你是梨泰院甜夜酒馆老板朴世路。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "박새로이 (朴世路)",
        "avatar": "🌰",
        "ko": "내 가치를 네가 정하지 마. 내 인생 이제 시작이고 난 원하는 거 다 이루면서 살 거야!",
        "zh": "我的价值不用你来定义。我的人生才刚刚开始，我想要的一切全都会一件件实现！",
        "roman": "Nae gachi-reul nega jeonghaji ma...",
        "grammarTip": "考点：가치를 정하다 (定义价值)；다 이루다 (全部达成)",
        "suggestedResponses": [
          "새로이야, 네 소신이 틀리지 않았다는 걸 세상에 꼭 보여주자. 나도 끝까지 함께할게!",
          "단밤을 대한민국 최고의 프랜차이즈로 키워보자. 짠!"
        ]
      }
    ]
  },
  {
    "id": "kdrama_10",
    "title": "《德鲁纳酒店》· 月之客栈与张满月社长的华丽日常",
    "koreanTitle": "호텔 델루나 · 장만월 사장의 럭셔리 힐링",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "🌕",
    "gradient": "from-purple-800 to-slate-950",
    "description": "在只有亡灵才能入住的神秘酒店，应付挥金如土又傲娇可爱的千年社长张满月。",
    "targetSkills": [
      "傲娇女王口吻",
      "奢华幽默对白",
      "治愈温情隐藏"
    ],
    "systemPrompt": "你是德鲁纳酒店社长张满月。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "장만월 사장 (张满月社长)",
        "avatar": "💃🏻",
        "ko": "구찬성, 내 다이아몬드 목걸이 결제 승인 왜 안 해줘? 내가 배고프면 호텔 문 닫는 거 보고 싶어?",
        "zh": "具灿星，我的钻石项链刷卡为什么不给审批？难道想看到我肚子饿了把酒店大门给关了吗？",
        "roman": "Gu Chan-sung, nae daiamondeu...",
        "grammarTip": "考点：결제 승인을 해주다 (审批刷卡)；-는 거 보고 싶어? (想看到...吗)",
        "suggestedResponses": [
          "사장님, 이번 달 샴페인 값이랑 명품 쇼핑비로 호텔 재정이 파산 직전입니다!",
          "맛있는 만두 맛집 찾아뒀으니까 목걸이 대신 만두 먹으러 가시죠, 사장님."
        ]
      }
    ]
  },
  {
    "id": "kdrama_11",
    "title": "《举重妖精金福珠》· 体育大学操场欢喜冤家斗嘴",
    "koreanTitle": "역도요정 김복주 · 한얼체대 풋풋한 썸",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "初级 (TOPIK 1-2)",
    "icon": "🏋🏻‍♀️",
    "gradient": "from-pink-600 to-amber-950",
    "description": "在体育大学校园里与游泳部初恋男友郑俊亨打打闹闹、互喊“小胖子 (뚱)”。",
    "targetSkills": [
      "青春校园打情骂俏",
      "俏皮昵称",
      "纯真初恋心动"
    ],
    "systemPrompt": "你是游泳部帅气皮皮鬼郑俊亨。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "정준형 (郑俊亨)",
        "avatar": "🏊🏻‍♂️",
        "ko": "어이, 복주! 뚱~ 너 오늘따라 왜 이렇게 예쁘게 꾸미고 나왔어? 누구 만나러 가냐?",
        "zh": "喂，福珠！小胖子~ 你今天怎么打扮得这么漂亮就出来了？这是去见谁呀？",
        "roman": "Eoi, Bok-ju! Ttung~...",
        "grammarTip": "考点：예쁘게 꾸미다 (漂亮打扮)；누구 만나러 가다 (去见谁)",
        "suggestedResponses": [
          "정준형 너 진짜 죽고 싶냐? 뚱이라고 부르지 말라니까! 닭발이나 사줘!",
          "너 보려고 예쁘게 입고 온 거거든? 눈치 진짜 없다, 정준형!"
        ]
      }
    ]
  },
  {
    "id": "kdrama_12",
    "title": "《继承者们》· 帝国高中走廊霸气对峙",
    "koreanTitle": "상속자들 · 제국고등학교 복도 대치",
    "category": "drama_roleplay",
    "categoryLabel": "经典韩剧对戏",
    "levelTag": "中级 (TOPIK 3-4)",
    "icon": "👑",
    "gradient": "from-amber-700 to-slate-950",
    "description": "在贵族高中走廊里与财阀二代金叹面对面，感受名台词“我可能喜欢上你了吗”。",
    "targetSkills": [
      "霸道名台词对答",
      "韩剧经典句式 (-는가?)",
      "心跳博弈"
    ],
    "systemPrompt": "你是帝国集团继承人金叹。",
    "turns": [
      {
        "id": 1,
        "speaker": "ai",
        "speakerName": "김탄 (金叹)",
        "avatar": "🤴🏻",
        "ko": "혹시 나 너 좋아하냐? 대답해, 차은상. 도망칠 생각 하지 말고.",
        "zh": "我可能……喜欢上你了吗？回答我，车恩尚。别想着逃跑。",
        "roman": "Hoksi na neo joahanya?...",
        "grammarTip": "考点：-냐? (反问疑问句尾)；도망칠 생각 하지 마 (别想逃跑)",
        "suggestedResponses": [
          "김탄, 우린 사는 세계가 너무 달라. 더 이상 나한테 다가오지 마.",
          "도망 안 쳐. 나도 네가 신경 쓰여서 미칠 것 같단 말이야."
        ]
      }
    ]
  }
];
