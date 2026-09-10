const businessWorkScenarios = [
  {
    id: 'biz_01',
    title: '韩国名企求职面试 · 1分钟韩语自我介绍',
    koreanTitle: '한국 대기업 취업 면접 · 1분 자기소개',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '💼',
    gradient: 'from-blue-800 to-indigo-950',
    description: '在三星/LG/现代等韩国大企业面试中，用精炼高级的格式体韩语阐述核心竞争力与岗位契合度。',
    targetSkills: ['商务自我介绍', '格式体敬语 (-ㅂ니다/습니다)', '竞争力展示'],
    systemPrompt: '你是韩国大企业资深主考官。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '인사팀 면접관 (HR面试官)',
        avatar: '👨🏻‍💼',
        ko: '지원자님, 긴장하지 마시고 1분 동안 본인의 핵심 강점과 지원 동기를 간략히 말씀해 주십시오.',
        zh: '应聘者请放松，请在 1 分钟时间内简明扼要地陈述您的核心竞争优势及应聘动机。',
        roman: 'Jiwonja-nim, ginjanghaji masigo...',
        grammarTip: '考点：핵심 강점 (核心强项)；지원 동기 (应聘动机)',
        suggestedResponses: [
          '안녕하십니까! 글로벌 마케팅 직무에 지원한 [이름]입니다. 한중 양국의 문화적 이해와 실무 역량을 바탕으로...',
          '저의 가장 큰 차별점은 시장 데이터 분석력과 원활한 다국어 커뮤니케이션 능력입니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_02',
    title: '面试应对 · 自身缺点与克服经历',
    koreanTitle: '면접 대처 · 성격의 단점 및 극복 사례',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🎯',
    gradient: 'from-blue-800 to-indigo-950',
    description: '回答面试官关于“性格最大缺点”的提问，巧妙转为正面反思与改进实践。',
    targetSkills: ['逆境反思', '克服过程叙述', '真诚态度展现'],
    systemPrompt: '你是严谨的企业面试官。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '면접관 (面试官)',
        avatar: '👩🏻‍💼',
        ko: '업무를 수행하면서 겪었던 본인의 단점이나 실패 경험이 있다면 이를 어떻게 보완하셨습니까?',
        zh: '在开展业务工作中，如果有您发现的自身不足或失败经历，您是如何进行改进弥补的？',
        roman: 'Eommu-reul suhaenghamyeonseo gyeok-eotdeon...',
        grammarTip: '考点：-을/를 보완하다 (补全弥补)；실패 경험 (失败经历)',
        suggestedResponses: [
          '지나치게 완벽을 추구하여 일정이 지연되던 점을 개선하기 위해, 우선순위 매트릭스를 활용하여...',
          '실패를 두려워하기보다는 빠른 피드백을 통해 즉각적인 해결책을 도출하는 긍정적인 자세를 길렀습니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_03',
    title: '职场首日入职破冰与同事初次问候',
    koreanTitle: '입사 첫날 팀원 인사 및 부서 온보딩',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🏢',
    gradient: 'from-indigo-700 to-slate-950',
    description: '第一天入职韩国公司，向部门组长与团队同事做谦逊得体的入职问候。',
    targetSkills: ['职场称谓 (팀장님/대리님)', '谦虚表达', '职场破冰'],
    systemPrompt: '你是热情严谨的部门组长。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '박 팀장님 (朴组长)',
        avatar: '👨🏻‍💼',
        ko: '오늘부터 우리 마케팅팀에서 함께 일하게 된 신입사원입니다! 팀원들에게 간단한 인사 한마디 부탁해요.',
        zh: '这是从今天起在我们市场团队一同共事的新入职员工！请跟团队同事们简单打个招呼吧。',
        roman: 'Oneulbuteo uri maketing tim-eseo...',
        grammarTip: '考点：신입사원 (新员工)；-게 되다 (得以成为...)',
        suggestedResponses: [
          '안녕하십니까! 오늘 새로 입사한 [이름]입니다. 아직 부족한 점이 많지만 팀에 빠르게 기여할 수 있도록 최선을 다하겠습니다.',
          '선배님들께 많이 배우고 겸손한 자세로 성실하게 일하겠습니다. 잘 부탁드립니다!'
        ]
      }
    ]
  },
  {
    id: 'biz_04',
    title: '商务电子邮件与商务电话沟通礼仪',
    koreanTitle: '비즈니스 이메일 작성 및 전화 응대',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '📧',
    gradient: 'from-blue-700 to-slate-900',
    description: '接听韩国合作方业务电话、确认会议日程并在通话后发送规范的商务跟进邮件。',
    targetSkills: ['商务电话常用语 (통화 가능하신가요?)', '邮件格式规范', '确认纪要'],
    systemPrompt: '你是韩国合作企业业务经理。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '김 과장 (金科长)',
        avatar: '👨🏻‍💻',
        ko: '네, ABC상사 김 과장입니다. 보내주신 제안서 잘 검토했는데요, 다음 주 미팅 일정을 조율할 수 있을까요?',
        zh: '您好，我是 ABC 商社的金科长。您发来的提案书我们已认真审阅，请问能协调一下下周的会议日程吗？',
        roman: 'Ne, ABC sangsa Kim gwajang-imnida...',
        grammarTip: '考点：검토하다 (审阅/审查)；일정을 조율하다 (协调日程)',
        suggestedResponses: [
          '네 과장님, 연락 주셔서 감사합니다. 다음 주 화요일 오후 2시 본사 대회의실에서 뵙는 것이 어떠실까요?',
          '통화 내용 바탕으로 회의 안건과 참석자 명단을 메일로 송부드리겠습니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_05',
    title: '跨部门项目推进会议工作进度汇报',
    koreanTitle: '타 부서 협업 주간 업무 진척 보고',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '📊',
    gradient: 'from-slate-800 to-indigo-950',
    description: '在跨部门周例会上，用清晰条理的数据汇报当前产品上线进度及阻碍点 (Bottleneck)。',
    targetSkills: ['结构化汇报 (목표-현황-이슈-대책)', '数据表达', '协作请求'],
    systemPrompt: '你是项目总监 (PMO)。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '프로젝트 총괄이사 (项目总监)',
        avatar: '👩🏻‍💼',
        ko: '이번 주 신규 기능 개발 현황과 일정상 병목이 발생하는 부분이 있다면 공유해 주십시오.',
        zh: '请同步本周新功能开发进度，以及在时间节点上是否存在瓶颈阻碍。',
        roman: 'Ibeon ju singyu gineung gaebal...',
        grammarTip: '考点：병목 현상 (瓶颈现象)；공유해 주십시오 (请予以同步)',
        suggestedResponses: [
          'UI 디자인 작업은 100% 완료되었으며, 서버 API 연동 테스트 과정에서 발생한 버그를 조치 중입니다.',
          '예정된 런칭 일정을 준수하기 위해 QA 인력 추가 배치를 요청드리는 바입니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_06',
    title: '商务宴请与韩国客户祝酒辞文化',
    koreanTitle: '비즈니스 만찬 및 바이어 건배사',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🥂',
    gradient: 'from-amber-700 to-yellow-950',
    description: '在接待韩国重要客户的晚宴上，发表热情的欢迎辞与双方合作共赢的祝酒辞。',
    targetSkills: ['祝酒辞格式 (건배사)', '商务敬酒礼仪', '感谢与愿景表达'],
    systemPrompt: '你是韩国合作方常务理事。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '이 상무 (李常务)',
        avatar: '👴🏻',
        ko: '먼 길 오시느라 고생 많으셨습니다! 오늘 자리를 빛내주셔서 감사드리며, 멋진 건배사 하나 부탁드립니다!',
        zh: '远道而来辛苦了！非常感谢您今日莅临，请您为大家带来一段精彩的祝酒辞吧！',
        roman: 'Meon gil osineura gosaeng...',
        grammarTip: '考点：자리를 빛내주시다 (使宴席蓬荜生辉)；건배사 (祝酒辞)',
        suggestedResponses: [
          '양사의 오랜 신뢰와 성공적인 파트너십을 위하여! "위하여"로 화답해 주시면 감사하겠습니다. 건배!',
          '귀사의 따뜻한 환대에 깊이 감사드리며, 이번 프로젝트의 눈부신 성공을 기원합니다!'
        ]
      }
    ]
  },
  {
    id: 'biz_07',
    title: '向上级领导请假、差旅报销与审批沟通',
    koreanTitle: '연차 휴가 신청 및 출장 경비 결재',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '📝',
    gradient: 'from-blue-700 to-cyan-950',
    description: '向部门主管申请年假、安排工作交接，并提交出差机票发票报销审批单。',
    targetSkills: ['请假用语 (연차/반차)', '工作交接 (업무 인수인계)', '报销申请 (경비 청구)'],
    systemPrompt: '你是部门直接主管。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '직속 팀장 (部门主管)',
        avatar: '👨🏻‍💼',
        ko: '다음 주에 연차 쓰신다고 전자결재 올리셨던데, 진행 중인 업무는 인수인계가 다 되었나요?',
        zh: '听说你在电子审批系统提报了下周休年假，正在推进的工作都交接妥当了吗？',
        roman: 'Daeum ju-e yeoncha sseusindago...',
        grammarTip: '考点：전자결재 (电子审批)；인수인계 (工作交接)',
        suggestedResponses: [
          '네 팀장님, 급한 마케팅 리포트는 이번 주 금요일까지 완료하고 긴급 건은 김 대리님께 공유해 두었습니다.',
          '지난 부산 출장 관련 KTX 영수증과 숙박비 정산서도 결재함에 상신해 두었습니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_08',
    title: '业务合作合同谈判与争取价格折扣',
    koreanTitle: '계약 조건 협상 및 단가 네고(Nego)',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🤝',
    gradient: 'from-slate-700 to-indigo-950',
    description: '与韩国供应商商务谈判，依据采购量要求 10% 的单价折扣并商定付款账期。',
    targetSkills: ['商务谈判策略', '价格交涉 (단가 인하/할인)', '付款条件 (결제 조건)'],
    systemPrompt: '你是韩国原厂销售总监。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '영업총괄 이사 (销售总监)',
        avatar: '👨🏻‍💼',
        ko: '원자재 가격 상승으로 인해 제시해 주신 15% 인하는 어렵습니다. 상호 조율 가능한 마지노선은 어디입니까?',
        zh: '由于原材料成本上涨，您提出的降价 15% 很难实现。双方能够协商达成的底线在哪里呢？',
        roman: 'Wonjajae gagyeok sangseung-euro...',
        grammarTip: '考点：마지노선 (底线/不可退让的限度)；단가 인하 (降低单价)',
        suggestedResponses: [
          '연간 발주 수량을 20% 늘리는 조건으로 공급 단가를 8% 인하해 주시는 방안은 어떠실까요?',
          '납품 대금 지급일을 익월 말 현금 결제로 단축해 드릴 테니 단가 조정을 재고해 주십시오.'
        ]
      }
    ]
  },
  {
    id: 'biz_09',
    title: '产品交付延期向客户致歉与应急方案',
    koreanTitle: '납기 지연 사과 및 비상 대응책 제시',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '⚠️',
    gradient: 'from-amber-800 to-slate-950',
    description: '因系统测试发现严重漏洞需推迟交付，向韩国客户高层正式致歉并提交分阶段应急方案。',
    targetSkills: ['危机公关致歉 (심려를 끼쳐드려)', '事实说明', '替代方案推进'],
    systemPrompt: '你是非常注重交付期限的客户代表。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '고객사 PM (客户负责人)',
        avatar: '👩🏻‍💼',
        ko: '내일이 런칭일인데 갑자기 연기라니 이게 무슨 말씀이십니까? 저희 쪽 손실은 어떻게 책임지실 건가요?',
        zh: '明天就是正式上线日，突然说要延期这是怎么回事？我们这边的损失你们打算如何承担？',
        roman: 'Naeil-i reonching-il-inde gapjagi...',
        grammarTip: '考点：심려를 끼쳐드리다 (给您添忧虑/深表歉意)；손실을 책임지다 (承担损失)',
        suggestedResponses: [
          '예기치 못한 결함으로 심려를 끼쳐드려 고개 숙여 사과드립니다. 핵심 기능만 우선 오픈하여 비즈니스 공백을 막겠습니다.',
          '추가 인력을 투입하여 주말 내 완벽히 수정 완료할 것을 약속드리며, 지연에 따른 보상 방안을 마련하겠습니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_10',
    title: '年终绩效考核面谈与加薪晋升诉求',
    koreanTitle: '연말 인사평가 면담 및 연봉 협상',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '📈',
    gradient: 'from-blue-700 to-purple-950',
    description: '在年终 1:1 面谈中列举具体业务贡献指标 (KPI)，得体提出晋升大理/科长与薪酬调整。',
    targetSkills: ['业绩量化表达', '自我肯定与未来承诺', '薪酬交涉'],
    systemPrompt: '你是负责年终绩效考核的部门总监。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '본부장님 (部门总监)',
        avatar: '👨🏻‍💼',
        ko: '올 한 해 동안 팀의 성과를 위해 정말 수고 많았어요. 스스로 올 한 해 성과를 점수로 매긴다면 몇 점인가요?',
        zh: '这一年为了团队的业绩付出了很多辛苦。如果给您自己这一年的成绩打个分，您会打多少分呢？',
        roman: 'Ol han hae dongan tim-ui seonggwa-reul...',
        grammarTip: '考点：점수를 매기다 (打分/评定分数)；성과 (成果/业绩)',
        suggestedResponses: [
          '목표 매출 대비 120%를 달성하고 신규 바이어 5개사를 유치한 만큼 90점 이상으로 평가하고 싶습니다.',
          '내년도 팀의 핵심 프로젝트를 주도적으로 이끌 수 있도록 대리 승진과 연봉 조정을 긍정적으로 검토해 주시길 희망합니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_11',
    title: '首尔 COEX 国际展会接待外国买家',
    koreanTitle: '코엑스(COEX) 국제 박람회 바이어 상담',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🏛️',
    gradient: 'from-cyan-700 to-blue-950',
    description: '在首尔大型博览会展台接待外国采购商，用流畅韩语介绍新产品特性、技术专利与样品寄送。',
    targetSkills: ['展会专业讲解', '产品卖点推介', '名片互换 (명함 교환)'],
    systemPrompt: '你是前来展位咨询采购的外国买家代表。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '해외 바이어 (海外买家)',
        avatar: '👨🏻‍💼',
        ko: '부스에 전시된 이 신제품의 친환경 소재와 인증 내역에 대해 설명해 주실 수 있나요?',
        zh: '请问可以向我介绍一下展台展示的这款新产品的环保材料及认证详情吗？',
        roman: 'Buseu-e jeonsidoen i sinjepum-ui...',
        grammarTip: '考点：-에 대해 설명하다 (关于...进行说明)；친환경 소재 (环保材质)',
        suggestedResponses: [
          '네, 이 제품은 100% 생분해성 바이오 플라스틱으로 제작되어 유럽 CE 친환경 인증을 획득했습니다.',
          '상세 카탈로그와 샘플을 준비해 두었으니 명함을 주시면 내일 바로 발송해 드리겠습니다.'
        ]
      }
    ]
  },
  {
    id: 'biz_12',
    title: '韩国职场下班“会食 (회식)”互动与祝酒',
    koreanTitle: '퇴근 후 직장 회식 문화 및 분위기 띄우기',
    category: 'business_work',
    categoryLabel: '职场商务面试',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🍻',
    gradient: 'from-amber-600 to-orange-950',
    description: '融入韩国独特的公司下班聚餐文化，得体向领导敬酒 (두 손으로 받기)、活跃气氛。',
    targetSkills: ['酒桌礼仪 (고개 돌려 마시기)', '职场闲聊', '氛围带动'],
    systemPrompt: '你是会食聚餐中兴致高昂的李部长。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '이 부장님 (李部长)',
        avatar: '👨🏻',
        ko: '자자, 다들 이번 분기 고생 많았어! 신입사원, 부장님한테 한 잔 따라봐!',
        zh: '来来来，大家这个季度都辛苦了！新员工，来给部长倒一杯酒！',
        roman: 'Ja ja, dadeul ibeon bungi gosaeng...',
        grammarTip: '考点：술을 따르다 (倒酒)；두 손으로 (用双手)',
        suggestedResponses: [
          '부장님, 올 한 해 많은 지도편달 감사드립니다! 제가 두 손으로 정성껏 한 잔 올리겠습니다.',
          '부장님의 건강과 우리 사업부의 대박을 기원합니다! 다 같이 건배하시죠!'
        ]
      }
    ]
  }
];

module.exports = { businessWorkScenarios };
console.log('Business Scenarios count:', businessWorkScenarios.length);

