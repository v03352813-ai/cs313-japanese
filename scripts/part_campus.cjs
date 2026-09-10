const campusStudyScenarios = [
  {
    id: 'campus_01',
    title: '韩国大学语学院分班口试面试',
    koreanTitle: '어학당 레벨테스트 구술 면접',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🏫',
    gradient: 'from-green-600 to-emerald-950',
    description: '参加韩国大学语学院入学当天的韩语口语水平测试，回答兴趣爱好与留学目标。',
    targetSkills: ['分班考试口语', '基础语法运用', '学习动机展示'],
    systemPrompt: '你是语学院分班考试主考老师。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '어학당 선생님 (语学院老师)',
        avatar: '👩🏻‍🏫',
        ko: '안녕하세요! 한국어 공부를 시작한 지 얼마나 되셨고, 가장 좋아하는 한국 음식은 무엇인가요?',
        zh: '您好！学习韩语有多长时间了，最喜欢的韩国食物是什么呢？',
        roman: 'Annyeonghaseyo! Hangugeo gongbu-reul...',
        grammarTip: '考点：-ㄴ 지 얼마나 되다 (过了多久)；가장 좋아하다 (最喜欢)',
        suggestedResponses: [
          '중국에서 6개월 동안 독학했고 김치찌개와 불고기를 가장 좋아합니다.',
          '한국 대학원에 입학하기 위해 매일 3시간씩 열심히 공부하고 있습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_02',
    title: '大学教授面谈与毕业论文方向请教',
    koreanTitle: '지도교수님 면담 및 졸업논문 주제 상담',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '📜',
    gradient: 'from-slate-700 to-blue-950',
    description: '在研究室拜访指导教授，礼貌请教毕业论文的研究方法论与参考文献推荐。',
    targetSkills: ['学术敬语', '论文开题沟通', '指导请教'],
    systemPrompt: '你是学识渊博但要求严格的韩国大学指导教授。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '지도교수님 (指导教授)',
        avatar: '👨🏻‍🏫',
        ko: '어서 와요. 이번 학기 졸업논문 프로포절 주제로 어떤 분야를 연구해 볼 생각인가요?',
        zh: '快请进。本学期毕业论文开题报告，你打算研究哪方面的主题呢？',
        roman: 'Eoseo wayo. Ibeon hakgi joreop...',
        grammarTip: '考点：프로포절 (Proposal/开题报告)；-ㄹ 생각이다 (打算...)',
        suggestedResponses: [
          '교수님 안녕하십니까. 저는 한중 전자상거래 플랫폼의 소비자 신뢰도 비교 분석을 연구해 보고자 합니다.',
          '실증 연구를 위한 설문조사 방법론에 대해 교수님의 고견을 여쭙고 싶습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_03',
    title: '韩国大学小组作业 (Team Play) 分工与讨论',
    koreanTitle: '대학 조별과제(팀플) 역할 분담 및 회의',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '👥',
    gradient: 'from-amber-600 to-teal-950',
    description: '与韩国同班同学进行小组作业分工，主动承担 PPT 制作与资料收集角色。',
    targetSkills: ['团队分工 (자료조사/PPT제작/발표)', '协作沟通', '会议讨论'],
    systemPrompt: '你是热心负责的小组组长同学。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '조장 학생 (组长同学)',
        avatar: '👦🏻',
        ko: '다들 모였지? 이번 마케팅 발표 과제에서 각자 맡고 싶은 파트가 있어? 자유롭게 얘기해 줘!',
        zh: '大家都到齐了吧？这次市场营销演讲作业，大家有各自想负责的部分吗？欢迎自由交流！',
        roman: 'Dadeul moyeotji? Ibeon maketing...',
        grammarTip: '考点：맡고 싶은 파트 (想要负责的部分)；조별과제 (小组作业)',
        suggestedResponses: [
          '제가 디자인이랑 PPT 제작을 잘 다루니까 발표 자료 제작을 맡겠습니다!',
          '저는 중국 기업 해외 진출 성공 사례와 관련된 해외 논문 자료 조사를 담당할게요.'
        ]
      }
    ]
  },
  {
    id: 'campus_04',
    title: '大学中央图书馆自习室座位预约与借书',
    koreanTitle: '대학교 중앙도서관 열람실 좌석 배정 및 대출',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '📚',
    gradient: 'from-blue-600 to-indigo-950',
    description: '在图书馆智能自助机预约期末考试复习自习室座位，并在服务台办理借书与续借。',
    targetSkills: ['图书馆设施使用', '借还书 (대출/반납/연장)', '座位预约'],
    systemPrompt: '你是大学图书馆管理员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '사서 선생님 (图书管理员)',
        avatar: '👩🏻‍💼',
        ko: '학생증 바코드 찍어주시고요. 도서 대출이신가요, 아니면 반납이신가요?',
        zh: '请刷一下学生证条形码。请问是借阅图书还是归还图书呢？',
        roman: 'Haksaengjeung bakodeu jjigeo...',
        grammarTip: '考点：학생증 (学生证)；도서 대출 (图书借阅)',
        suggestedResponses: [
          '이 전공 서적 2권 2주 동안 대출하고 싶습니다. 대출 연장도 온라인에서 가능한가요?',
          '3열람실 좌석을 키오스크에서 발권했는데 연장하려면 몇 시까지 해야 하나요?'
        ]
      }
    ]
  },
  {
    id: 'campus_05',
    title: '外国留学生优秀奖学金申请面试',
    koreanTitle: '외국인 우수 유학생 장학금 면접 심사',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🏆',
    gradient: 'from-yellow-600 to-amber-950',
    description: '向国际交流处审核委员会阐述自身优异的 GPA 成绩、韩国文化传播志愿经历。',
    targetSkills: ['奖学金答辩', '学业成就展示 (학점/GPA)', '抱负与感恩'],
    systemPrompt: '你是大学国际处奖学金评审委员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '국제처 심사위원 (国际处评审)',
        avatar: '👨🏻‍🏫',
        ko: '지원자님의 성적과 교내외 활동 이력이 매우 우수하군요. 이번 장학금을 받아야 하는 이유를 말씀해 주십시오.',
        zh: '应聘者的在校成绩和校内外活动经历非常优异。请陈述您应当获得本次奖学金的理由。',
        roman: 'Jiwonja-nim-ui seongjeok-gwa...',
        grammarTip: '考点：-이/가 우수하다 (优异)；교내외 활동 (校内外活动)',
        suggestedResponses: [
          '학업에 전념하여 학과 수석을 유지함과 동시에, 한중 문화교류 서포터즈로서 양국 학생들의 가교 역할을 해왔습니다.',
          '장학금을 지원받는다면 경제적 부담을 덜고 연구 역량을 더욱 심화하여 학교의 명예를 높이겠습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_06',
    title: '大学学生宿舍设施故障报修与门禁违规解释',
    koreanTitle: '기숙사 행정실 시설 보수 및 통금 소명',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🛏️',
    gradient: 'from-slate-600 to-indigo-950',
    description: '前往宿舍行政室报修寝室空调制冷故障，并向舍监阿姨说明因小组作业迟归的理由。',
    targetSkills: ['宿舍生活规范 (벌점/통금)', '空调报修 (냉방 고장)', '请假报备'],
    systemPrompt: '你是宿舍行政室管理员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '기숙사 사감 선생님 (宿舍舍监)',
        avatar: '👩🏻‍🏫',
        ko: '몇 동 몇 호 학생인가요? 방에 무슨 수리할 곳이 있어서 오셨나요?',
        zh: '请问是哪栋几号房的学生？房间里有什么需要维修的地方吗？',
        roman: 'Myeot dong myeot ho haksaeng-in-gayo?...',
        grammarTip: '考点：몇 동 몇 호 (哪栋几号)；수리하다 (维修)',
        suggestedResponses: [
          '국제학사 402호인데요, 에어컨에서 물이 떨어지고 시원한 바람이 안 나와서요.',
          '어제 조별과제 회의가 늦어져 통금 시간을 10분 넘겼는데 벌점 감면 사유서를 제출하고 싶습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_07',
    title: '韩国大学校庆祭典与国际文化摊位策划',
    koreanTitle: '대학교 축제(대동제) 세계 문화 부스 기획',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🎪',
    gradient: 'from-orange-600 to-pink-950',
    description: '在大学学生会举办的五月大同祭校庆中，策划中国传统美食文化体验摊位。',
    targetSkills: ['校庆活动策划', '摊位布置与宣传', '活动分工'],
    systemPrompt: '你是大学学生会祭典策划部部长。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '총학생회 축제기획부장 (学生会部长)',
        avatar: '🧑🏻',
        ko: '유학생회에서 이번 대동제 축제 때 전통 음식 부스를 운영하신다고 들었는데 구체적인 메뉴가 정해졌나요?',
        zh: '听说留学生会本次大同祭校庆将运营传统美食摊位，具体菜单已经确定了吗？',
        roman: 'Yuhaksaenghoe-eseo ibeon daedongje...',
        grammarTip: '考点：대동제 (大学校庆大同祭)；-ㄴ다고 들었다 (听说...)',
        suggestedResponses: [
          '네! 한국 학생들이 좋아하는 마라탕과 탕후루 만들기 체험 부스를 운영하기로 결정했습니다.',
          '가스버너 안전 점검과 부스 천막 설치 일정을 학생회와 조율하고 싶습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_08',
    title: '全韩外国人韩语演讲大赛赛前演练',
    koreanTitle: '외국인 한국어 말하기 대회 발표 및 리허설',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🎙️',
    gradient: 'from-rose-600 to-purple-950',
    description: '准备以“我眼中的 K-Culture 与中韩青年未来”为主题进行 3 分钟舞台脱稿演讲。',
    targetSkills: ['公众演讲技巧 (스피치)', '语调抑扬顿挫', '引发共鸣与互动'],
    systemPrompt: '你是演讲比赛专业指导导师。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '말하기 대회 코치 (演讲教练)',
        avatar: '👩🏻‍🏫',
        ko: '무대에서는 도입부에서 청중의 시선을 사로잡는 오프닝이 중요합니다. 준비하신 첫 문장을 들려주시겠어요?',
        zh: '在舞台上，开篇吸引观众注意力的导入非常关键。能让我听听您准备好的第一句话吗？',
        roman: 'Mudae-eseoneun doipbu-eseo...',
        grammarTip: '考点：시선을 사로잡다 (吸引目光/抓住视线)；도입부 (引入部分)',
        suggestedResponses: [
          '여러분, 음악과 문화에는 국경이 없다는 말을 실감해 보신 적이 있으십니까?',
          '처음 한국 땅을 밟았던 3년 전, 제 서툰 한국어에 따뜻하게 손을 내밀어 준 한마디는 바로...'
        ]
      }
    ]
  },
  {
    id: 'campus_09',
    title: '大学教务处学费缴纳与分期付款咨询',
    koreanTitle: '교무처 등록금 납부 및 분할납부 상담',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '💳',
    gradient: 'from-blue-600 to-slate-950',
    description: '前往大学行政楼咨询新学期学费虚拟账号转账、海外信用卡支付及分期缴纳流程。',
    targetSkills: ['教务财务术语 (등록금/가상계좌)', '分期申请 (분할납부)', '收据确认'],
    systemPrompt: '你是大学财务教务科职员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '학사행정팀 직원 (教务处职员)',
        avatar: '👩🏻‍💼',
        ko: '등록금 고지서 확인하셨나요? 일시납과 분할납부 중 어떤 방식으로 납부하시겠습니까?',
        zh: '确认过学费缴费通知单了吗？请问您打算按一次性全额缴纳还是分期付款方式缴纳呢？',
        roman: 'Deungnokgeum gojiseo hwaginhayeonnayo?...',
        grammarTip: '考点：등록금 고지서 (学费账单)；분할납부 (分期缴纳)',
        suggestedResponses: [
          '해외 송금 일정상 3회 분할납부를 신청하고 싶은데 포털 시스템에서 어떻게 신청하나요?',
          '외국인 유학생 성적 장학금이 감면 적용된 최종 납부 금액을 확인하고 싶습니다.'
        ]
      }
    ]
  },
  {
    id: 'campus_10',
    title: '参加韩国大学社团 (Dongari) 招新面试',
    koreanTitle: '대학교 동아리 가입 면접 및 오리엔테이션',
    category: 'campus_study',
    categoryLabel: '语学院与留学',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🎸',
    gradient: 'from-purple-600 to-indigo-950',
    description: '参加韩国大学街舞/乐队/摄影中央社团的新人选拔面试，用风趣真诚的韩语展示热情。',
    targetSkills: ['社团面试交流', '特长展示', '校园社交破冰'],
    systemPrompt: '你是大学摇滚乐队社团社长。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '동아리 회장 (社团社长)',
        avatar: '🎸',
        ko: '우리 밴드 동아리에 지원해 줘서 고마워! 다룰 줄 아는 악기나 지원하게 된 계기가 있어?',
        zh: '感谢你报名我们乐队社团！有什么擅长演奏的乐器或者报名的契机吗？',
        roman: 'Uri baendeu dongari-e jiwonhae jwoseo...',
        grammarTip: '考点：-ㄹ 줄 알다 (懂得/擅长做某事)；동아리 (大学社团)',
        suggestedResponses: [
          '고등학교 때부터 일렉기타를 3년 동안 연주해 왔고 한국 인디 밴드 음악을 정말 사랑합니다!',
          '한국 친구들과 함께 합주하면서 즐거운 대학 생활 추억을 만들고 싶어서 지원했습니다.'
        ]
      }
    ]
  }
];

module.exports = { campusStudyScenarios };
console.log('Campus Study Scenarios count:', campusStudyScenarios.length);
