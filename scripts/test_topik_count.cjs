const fs = require('fs');

const topikScenarios = [
  {
    id: 'topik_sp_01',
    title: 'TOPIK 口语 Part 1 · 自我介绍与日常问答',
    koreanTitle: 'TOPIK 말하기 1부 · 자기소개 및 일상 질문',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '📝',
    gradient: 'from-amber-600 to-rose-900',
    description: '模拟 TOPIK 官方口语第一部分，考查基本自我介绍、韩语学习动机与日常活动表达。',
    targetSkills: ['自我介绍 (자기소개)', '学习动机 (-기 위해서)', '日常时间表达'],
    examDurationSec: 60,
    referenceModelAnswer: '안녕하세요? 저는 왕링이라고 합니다. 한국 문화와 드라마에 관심이 많아서 1년 전부터 한국어를 배우기 시작했습니다.',
    systemPrompt: '你是 TOPIK 官方口语考官，语气和蔼专业，用标准韩语提出第一部分的日常问题并引导考生作答。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👨‍🏫',
        ko: '수험생 여러분, 안녕하세요? 먼저 간단하게 자기소개와 한국어를 배우게 된 계기를 말씀해 주세요.',
        zh: '各位考生大家好。首先请简单做个自我介绍，并说明学习韩语的契机。',
        roman: 'Suheomsaeng yeoreobun, annyeonghaseyo? Meonjeo gandanhage jagisogae-wa...',
        grammarTip: '考点：-게 되다 (变得/成为某种契机)；자기소개 (自我介绍标准句型)',
        suggestedResponses: [
          '안녕하세요? 저는 중국에서 온 [이름]입니다. 한국 문화가 좋아서 배우고 있습니다.',
          '반갑습니다. 저는 대학교에서 한국어를 전공하고 있는 학생입니다.'
        ],
        honorificNotice: '面对考官必须使用格式体敬语 -습니다/-ㅂ니다 或标准敬语 -아/어요。'
      },
      {
        id: 2,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👨‍🏫',
        ko: '네, 잘 들었습니다. 평소 주말에는 주로 무엇을 하면서 시간을 보내시나요?',
        zh: '好的，回答得很好。平时周末主要通过做什么来度过时间呢？',
        roman: 'Ne, jal deureosseumnida. Pyeongso jumal-eneun juro mueos-eul hamyeonseo...',
        grammarTip: '考点：-(으)면서 (一边...一边/伴随动作)；주로 (主要/通常)',
        suggestedResponses: [
          '주말에는 보통 친구들과 카페에 가거나 영화를 보면서 쉽니다.',
          '저는 운동을 좋아해서 주말마다 한강 공원에서 자전거를 탑니다.'
        ],
        honorificNotice: '注意动词连接词 -거나 (或者) 与 -(으)면서 的正确连用。'
      }
    ]
  },
  {
    id: 'topik_sp_02',
    title: 'TOPIK 口语 Part 1 · 留学动机与学业规划',
    koreanTitle: 'TOPIK 말하기 1부 · 유학 동기 및 학업 계획',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🎓',
    gradient: 'from-amber-600 to-rose-900',
    description: '考查赴韩留学动机、意向专业与毕业后的发展规划阐述。',
    targetSkills: ['专业阐述 (전공)', '未来规划 (-고자 하다)', '目的表达'],
    examDurationSec: 60,
    referenceModelAnswer: '저는 한국 대학교에서 경영학을 전공하고자 합니다. 졸업 후에는 한중 무역 전문가가 되고 싶습니다.',
    systemPrompt: '你是考官，询问考生的韩国留学专业选择与学业规划。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👨‍🏫',
        ko: '수험생님은 한국에서 구체적으로 어떤 전공을 공부하고 싶으신가요? 그 이유도 함께 말씀해 주세요.',
        zh: '请问您在韩国具体想学习什么专业？也请一并说明其原因。',
        roman: 'Suheomsaeng-nim-eun hanguk-eseo guchejeog-euro eotteon jeongong-eul...',
        grammarTip: '考点：구체적으로 (具体地)；-고 싶다 (想要)',
        suggestedResponses: [
          '저는 한국의 미디어와 콘텐츠 산업에 관심이 많아서 신문방송학을 전공하고 싶습니다.',
          '한중 양국의 경제 교류에 기여하기 위해 국제무역학을 공부하고자 합니다.'
        ],
        honorificNotice: '使用格式体 -ㅂ니다/습니다 显得郑重清晰。'
      }
    ]
  },
  {
    id: 'topik_sp_03',
    title: 'TOPIK 口语 Part 2 · 看图说话与约会改期道歉',
    koreanTitle: 'TOPIK 말하기 2부 · 약속 변경 및 사과',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🖼️',
    gradient: 'from-blue-700 to-indigo-950',
    description: '考查在突发情境下的沟通协调能力（例如突发感冒无法赴约，委婉致歉并重新约定时间）。',
    targetSkills: ['委婉致歉 (-아/어서 죄송합니다)', '提出替代方案 (-는 게 어떨까요?)', '因果连接词'],
    examDurationSec: 90,
    referenceModelAnswer: '민수 씨, 정말 미안해요. 오늘 갑자기 감기 몸살이 심해서 약속에 가기 어려울 것 같아요.',
    systemPrompt: '你是考生的韩国朋友敏洙，对方因身体不适想要改约时间。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '친구 민수 (朋友敏洙)',
        avatar: '👦🏻',
        ko: '여보세요? 오늘 3시에 홍대 입구에서 만나기로 했는데, 지금 출발했어? 얼굴 본 지 너무 오래됐다!',
        zh: '喂？我们今天下午 3 点约在弘大入口见，你出发了吗？好久没见你了！',
        roman: 'Yeoboseyo? Oneul se-si-e hongdae ipgu-eseo...',
        grammarTip: '考点：-기로 하다 (约定做某事)；-(으)ㄴ 지 되다 (过了多久时间)',
        suggestedResponses: [
          '민수야, 정말 미안한데 오늘 갑자기 몸살이 심해서 나가기 어려울 것 같아. 약속을 다음 주로 바꿀 수 있을까?',
          '어떡하지? 갑자기 급한 일이 생겨서 오늘 약속에 조금 늦거나 일정을 변경해야 할 것 같아.'
        ],
        honorificNotice: '同龄朋友使用半语 (반말) 时需保持真诚歉意。'
      }
    ]
  },
  {
    id: 'topik_sp_04',
    title: 'TOPIK 口语 Part 2 · 看图说话 · 租房漏水向房东报修',
    koreanTitle: 'TOPIK 말하기 2부 · 원룸 누수 및 수리 요청',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🚰',
    gradient: 'from-blue-700 to-indigo-950',
    description: '模拟租房水管漏水情景，向韩国房东大叔礼貌说明损坏情况并商定上门维修时间。',
    targetSkills: ['报修描述 (고장/누수)', '请求帮助 (-아/어 주시겠어요?)', '预约时间'],
    examDurationSec: 90,
    referenceModelAnswer: '집주인 아저씨, 안녕하세요? 302호 세입자인데요, 화장실 세면대 아래에서 물이 새고 있어서 연락드렸습니다.',
    systemPrompt: '你是房东大叔，租客打电话来报修卫生间水管漏水。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '집주인 아저씨 (房东大叔)',
        avatar: '👴🏻',
        ko: '네, 302호 학생이군요! 무슨 일 있어요? 방에 무슨 문제라도 생겼나요?',
        zh: '喂，是 302 号的同学啊！有什么事吗？房间里出什么问题了吗？',
        roman: 'Ne, 302-ho haksaeng-igunyo! Museun il isseoyo?...',
        grammarTip: '考点：-라도 (哪怕是.../就算...)；무슨 일 (什么事)',
        suggestedResponses: [
          '아저씨 안녕하세요. 화장실 세면대에서 물이 계속 새고 있어서요. 혹시 오늘 와서 확인해 주실 수 있나요?',
          '안녕하세요, 보일러가 작동을 안 해서 온수가 안 나와요. 기사님을 언제 불러주실 수 있으신가요?'
        ],
        honorificNotice: '对长辈房东务必使用标准敬语 (-아/어요 或 -시겠어요)。'
      }
    ]
  },
  {
    id: 'topik_sp_05',
    title: 'TOPIK 口语 Part 3 · 图表阐述 · 韩国单人家庭增长趋势',
    koreanTitle: 'TOPIK 말하기 3부 · 1인 가구 증가 추이 분석',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '📊',
    gradient: 'from-purple-700 to-slate-900',
    description: '考查根据图表数据分析韩国 1 人家庭比例持续上升的核心成因及社会影响。',
    targetSkills: ['图表引述 (조사 결과에 따르면)', '趋势递增 (-는 추세를 보이다)', '原因阐述'],
    examDurationSec: 120,
    referenceModelAnswer: '통계청 조사 결과에 따르면 지난 10년간 1인 가구 비율은 25%에서 35%로 급격히 증가했습니다.',
    systemPrompt: '你是高级口语考官，要求考生依据图表陈述单人家庭剧增的成因与对策。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👩🏻‍💼',
        ko: '제시된 그래프를 바탕으로 한국 사회에서 1인 가구가 급증하는 원인과 이로 인한 사회적 변화를 2분 동안 설명해 주십시오.',
        zh: '请根据给出的图表，用 2 分钟时间阐述韩国社会单人家庭急剧增加的原因及由此带来的社会变化。',
        roman: 'Jesidoen geuraepu-reul batang-euro hanguk sahoe-eseo...',
        grammarTip: '考点：-를 바탕으로 (以...为基准)；이로 인한 (由此引发的)',
        suggestedResponses: [
          '그래프에 따르면 비혼주의 확산과 청년층의 독립 증가로 인해 1인 가구 비율이 급증하고 있습니다.',
          '이러한 현상은 소용량 가전제품과 간편식 시장의 성장을 견인하는 등 경제 전반에 큰 변화를 일으키고 있습니다.'
        ],
        honorificNotice: '正式学术发表，务必全文使用格式体书面敬语 -ㅂ/습니까, -ㅂ/습니다。'
      }
    ]
  },
  {
    id: 'topik_sp_06',
    title: 'TOPIK 口语 Part 3 · 图表阐述 · 青年就业偏好与远程办公',
    koreanTitle: 'TOPIK 말하기 3부 · 청년 취업 선호도 및 원격근무',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '📈',
    gradient: 'from-purple-700 to-slate-900',
    description: '分析青年群体求职时对“工作与生活平衡(Work-Life Balance)”与远程办公模式的偏好变迁。',
    targetSkills: ['数据对比 (A에 비해 B가 높다)', '比例分析', '结论归纳'],
    examDurationSec: 120,
    referenceModelAnswer: '청년 구직자들의 직장 선택 기준 1위로 워라밸(일과 삶의 균형)이 꼽혔습니다.',
    systemPrompt: '你是考官，要求考生深入剖析青年求职观转变与灵活办公趋势。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👩🏻‍💼',
        ko: '청년 세대의 직업관 변화와 재택근무 도입 확대에 대해 본인의 견해를 구체적인 근거를 들어 말씀해 주십시오.',
        zh: '请结合具体事实依据，阐述您对青年一代职业观转变及远程办公推广扩大的看法。',
        roman: 'Cheongnyeon sedae-ui jigeopgwan byeonhwa-wa...',
        grammarTip: '考点：근거를 들어 (列举依据)；-에 대해 견해를 밝히다 (表明见解)',
        suggestedResponses: [
          '단순한 고연봉보다는 개인의 삶을 존중받는 기업 문화를 선호하는 추세가 뚜렷합니다.',
          '원격근무는 업무 효율성을 높이는 동시에 기업의 공간 비용을 절감하는 긍정적인 효과가 있습니다.'
        ],
        honorificNotice: '考场高分技巧：使用高级衔接副词 (한편, 반면에, 따라서)。'
      }
    ]
  },
  {
    id: 'topik_sp_07',
    title: 'TOPIK 口语 Part 4 · 角色扮演 · 快递错送与客服沟通退换',
    koreanTitle: 'TOPIK 말하기 4부 · 택배 오배송 및 교환 문의',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '📦',
    gradient: 'from-emerald-700 to-teal-950',
    description: '网购商品送错型号，向韩国电商客服礼貌沟通，要求免费上门退换并补偿。',
    targetSkills: ['事实陈述 (주문한 것과 다른 물건)', '解决要求 (교환/반품 처리)', '客服沟通礼仪'],
    examDurationSec: 100,
    referenceModelAnswer: '안녕하세요, 어제 받은 패딩 사이즈가 주문한 M이 아니라 XL로 잘못 배송되었습니다.',
    systemPrompt: '你是电商客服人员，负责处理顾客商品送错的退换货咨询。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '고객센터 상담원 (客服代表)',
        avatar: '🎧',
        ko: '안녕하세요, 고객님! 무엇을 도와드릴까요? 주문번호나 불편하신 점을 말씀해 주시면 빠르게 확인해 드리겠습니다.',
        zh: '您好顾客！请问有什么可以帮您？请告知订单号或遇到的问题，我将快速为您核对。',
        roman: 'Annyeonghaseyo, gogaeknim! Mueos-eul dowadeurilkkayo?...',
        grammarTip: '考点：-아/어 드리겠습니다 (为您做...)；불편하신 점 (感到不便的地方)',
        suggestedResponses: [
          '어제 택배를 받았는데 제가 주문한 색상과 다른 상품이 배송되었습니다. 빠른 맞교환 부탁드립니다.',
          '배송 중 포장이 훼손되어 상품이 파손되었습니다. 환불 절차가 어떻게 되는지 알고 싶습니다.'
        ],
        honorificNotice: '维权沟通时保持礼貌客观，使用 -해 주시기를 바랍니다 等句型。'
      }
    ]
  },
  {
    id: 'topik_sp_08',
    title: 'TOPIK 口语 Part 4 · 角色扮演 · 团队项目分工冲突调解',
    koreanTitle: 'TOPIK 말하기 4부 · 팀 프로젝트 업무 분담 갈등 조율',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🤝',
    gradient: 'from-emerald-700 to-teal-950',
    description: '小组作业中某位组员因个人原因进度拖延，作为组长委婉沟通并重新协调分工。',
    targetSkills: ['换位思考与共情', '委婉指出问题', '提出折中方案'],
    examDurationSec: 100,
    referenceModelAnswer: '지훈 씨, 요즘 많이 바쁘신 건 알지만 발표일이 얼마 남지 않아서 자료 조사를 조금 서둘러 주셔야 할 것 같아요.',
    systemPrompt: '你是因兼职繁忙导致小组作业进度落后的组员智勋。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '팀원 지훈 (组员智勋)',
        avatar: '👦🏻',
        ko: '팀장님, 죄송해요. 요즘 아르바이트 때문에 제가 맡은 PPT 초안 작성을 아직 다 못 끝냈어요…',
        zh: '组长真抱歉，最近因为兼职打工，我负责的 PPT 初稿还没全部完成……',
        roman: 'Timjangnim, joesonghaeyo. Yojeum areubaiteu ttaemune...',
        grammarTip: '考点：-느라고 (因做某事而带来负面结果)；초안 (初稿)',
        suggestedResponses: [
          '바쁘신 사정은 이해하지만, 마감일이 내일까지라 제가 디자인 부분을 도울 테니 내용 정리를 오늘 중으로 부탁드려요.',
          '혼자서 부담이 크시면 다른 팀원들과 분량을 나누어 작업하는 방안을 찾아보겠습니다.'
        ],
        honorificNotice: '同组协作使用互相尊重的敬语体 (-아요/어요)。'
      }
    ]
  },
  {
    id: 'topik_sp_09',
    title: 'TOPIK 口语 Part 5 · 深度思辨 · 社交媒体对人际关系的利弊',
    koreanTitle: 'TOPIK 말하기 5부 · SNS가 인간관계에 미치는 영향',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '💬',
    gradient: 'from-rose-700 to-red-950',
    description: '针对 SNS 社交软件让沟通更便捷还是加剧了人际疏离发表结构化辩证观点。',
    targetSkills: ['立论与驳论 (물론 ~지만, 그러나)', '正反双向论证', '总结提炼'],
    examDurationSec: 150,
    referenceModelAnswer: 'SNS는 시공간의 한계를 넘어 소통을 원활하게 해주는 순기능이 있는 반면, 대면 소통의 단절이라는 역기능도 존재합니다.',
    systemPrompt: '你是考官，要求考生就 SNS 对现代人际关系的利与弊发表全面观点。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👨‍💼',
        ko: '현대 사회에서 SNS 사용이 일상화되었습니다. SNS가 인간관계 형성에 미치는 긍정적, 부정적 영향에 대해 견해를 말씀해 주십시오.',
        zh: '在现代社会中 SNS 的使用已十分普及。请谈谈您关于 SNS 对人际关系建立产生的积极与消极影响的看法。',
        roman: 'Hyeondae sahoe-eseo SNS sayong-i ilsanghwadoeeosseumnida...',
        grammarTip: '考点：순기능과 역기능 (正面功能与负面效应)；일상화되다 (普遍化/日常化)',
        suggestedResponses: [
          'SNS는 지리적 제약 없이 정보를 공유할 수 있다는 장점이 있지만, 피상적인 관계에 그칠 위험이 있습니다.',
          '따라서 SNS의 혜택을 누리되 진정성 있는 오프라인 소통을 병행하는 균형 잡힌 태도가 요구됩니다.'
        ],
        honorificNotice: '展现高级思辨逻辑，多用书面转折词 (그럼에도 불구하고, 한편으로는)。'
      }
    ]
  },
  {
    id: 'topik_sp_10',
    title: 'TOPIK 口语 Part 5 · 深度思辨 · 传统市场保护与大型超市竞争',
    koreanTitle: 'TOPIK 말하기 5부 · 전통시장 보호와 대형마트 규제',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🏬',
    gradient: 'from-rose-700 to-red-950',
    description: '探讨政府强制大型超市周末歇业以扶持传统小商贩政策的合理性与争议。',
    targetSkills: ['政策利弊评估', '消费者权益与商户保护平衡', '提出可行对策'],
    examDurationSec: 150,
    referenceModelAnswer: '골목상권 보호라는 취지에는 공감하지만, 소비자의 선택권을 지나치게 제한한다는 반론도 만만치 않습니다.',
    systemPrompt: '你是考官，要求考生就传统市场与大型商超竞争议题阐述立场。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👨‍💼',
        ko: '대형마트 의무 휴업 규제와 전통시장 활성화 방안에 대해 찬반 입장을 정하고 그 근거를 제시해 주십시오.',
        zh: '关于大型超市强制歇业规定与传统市场振兴方案，请表明赞成或反对立场并阐明依据。',
        roman: 'Daehyeongmateu uimu hyueop gyuje-wa...',
        grammarTip: '考点：-라는 취지 (出于...的初衷)；상생 방안 (合作共赢方案)',
        suggestedResponses: [
          '소상공인의 생존권을 보장하기 위한 최소한의 안전장치로서 규제는 불가피하다고 생각합니다.',
          '단순 규제보다는 전통시장의 주차 시설 확충과 디지털 결제 도입 등 자생력을 키우는 지원이 우선되어야 합니다.'
        ],
        honorificNotice: '使用论述型终结词尾 (-다고 봅니다 / -아야 마땅합니다)。'
      }
    ]
  },
  {
    id: 'topik_sp_11',
    title: 'TOPIK 口语 Part 6 · 建设性建议 · 留学生文化适应支持方案',
    koreanTitle: 'TOPIK 말하기 6부 · 외국인 유학생 문화 적응 지원책',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '💡',
    gradient: 'from-violet-700 to-purple-950',
    description: '针对外国留学生在语言障碍、心理孤独及生活适应上的困难，提出系统性支持措施。',
    targetSkills: ['提出具体可落地对策', '分点阐述 (첫째, 둘째, 마지막으로)', '展望长远意义'],
    examDurationSec: 150,
    referenceModelAnswer: '유학생들의 조기 정착을 위해 1:1 버디 멘토링 프로그램과 심리 상담 센터 운영을 제안합니다.',
    systemPrompt: '你是考官，要求考生提出改善在韩留学生学习生活支持体系的建设性建议。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👩🏻‍🏫',
        ko: '외국인 유학생들이 겪는 학업 및 일상 적응 문제를 해결하기 위해 대학과 지역사회가 추진해야 할 방안을 말씀해 주십시오.',
        zh: '为解决外国留学生面临的学业及生活适应困难，请阐述大学与地方社区应推进落实的对策方案。',
        roman: 'Oegugin yuhaksaengdeul-i gyeongneun hageop...',
        grammarTip: '考点：-를 추진하다 (推进实施...)；조기 정착 (早期平稳适应)',
        suggestedResponses: [
          '첫째, 한국인 재학생과의 1:1 언어 교환 및 멘토링 프로그램을 의무화해야 합니다.',
          '둘째, 다국어 행정 서비스와 법률·취업 지원 창구를 확대 운영할 필요가 있습니다.'
        ],
        honorificNotice: '高级建议句型：-을/를 제안하는 바입니다, -할 필요성이 대두되고 있습니다。'
      }
    ]
  },
  {
    id: 'topik_sp_12',
    title: 'TOPIK 口语 Part 6 · 建设性建议 · 老龄化社会社区互助对策',
    koreanTitle: 'TOPIK 말하기 6부 · 초고령화 사회 대비 공동체 돌봄 대책',
    category: 'topik_speaking',
    categoryLabel: 'TOPIK 官方口语',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🏘️',
    gradient: 'from-violet-700 to-purple-950',
    description: '探讨韩国步入超老龄化社会背景下，如何通过社区互助养老与银发再就业化解养老难题。',
    targetSkills: ['宏观社会议题把握', '系统性建议构建', '多维度考量'],
    examDurationSec: 150,
    referenceModelAnswer: '노인 일자리 창출과 세대 간 통합을 위한 마을 공동체 돌봄 네트워크 구축이 시급합니다.',
    systemPrompt: '你是考官，要求考生针对超老龄化危机提出切实可行的社区化应对建议。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'TOPIK 考官',
        avatar: '👩🏻‍🏫',
        ko: '초고령 사회 진입에 따른 노인 돌봄 공백을 해결하기 위한 실효성 있는 대책을 제시해 주십시오.',
        zh: '请提出具有实效性的对策，以解决迈入超老龄社会带来的老人照护缺口问题。',
        roman: 'Chogoryeong sahoe jinip-e ttareun...',
        grammarTip: '考点：돌봄 공백 (照护断档/缺口)；실효성 있는 (具备实际成效的)',
        suggestedResponses: [
          '스마트 IT 기술을 활용한 24시간 안심 케어 시스템을 독거노인 가구에 보급해야 합니다.',
          '건강한 노년층이 거동이 불편한 고령자를 돕는 노노(老老) 케어 일자리를 대폭 확충해야 합니다.'
        ],
        honorificNotice: '高级考题必备词汇：시급하다, 보급하다, 대폭 확충하다。'
      }
    ]
  }
];

console.log('Topik Scenarios count:', topikScenarios.length);
module.exports = { topikScenarios };
