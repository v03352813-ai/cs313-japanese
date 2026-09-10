const fs = require('fs');

// We will load or construct all 66 scenarios in full detail!
const { topikScenarios } = require('./test_topik_count.cjs');

const dailyLifeScenarios = [
  {
    id: 'daily_01',
    title: '仁川机场入境过关与换乘大巴',
    koreanTitle: '인천공항 입국 심사 및 리무진 버스',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '✈️',
    gradient: 'from-blue-600 to-cyan-900',
    description: '入境海关问询目的与停留期，并在航站楼售票处购买前往明洞的机场大巴票。',
    targetSkills: ['入境问答', '大巴买票', '时间与行李询问'],
    systemPrompt: '你是仁川机场大巴售票员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '공항 매표소 직원 (售票员)',
        avatar: '👩🏻‍💼',
        ko: '안녕하세요, 손님! 어디로 가시는 티켓을 발권해 드릴까요?',
        zh: '您好顾客！请问要为您出具去哪里的车票呢？',
        roman: 'Annyeonghaseyo, sonnim! Eodiro gasineun tiket-eul...',
        grammarTip: '考点：-로 가다 (前往某方向)；발권해 드리다 (为您出票)',
        suggestedResponses: ['명동역으로 가는 리무진 버스 한 장 주세요.', '홍대입구역까지 가는 첫차가 몇 시에 출발하나요?']
      }
    ]
  },
  {
    id: 'daily_02',
    title: '弘大网红咖啡厅点单与定制燕麦奶',
    koreanTitle: '홍대 핫플 카페 주문 및 커스텀',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '☕',
    gradient: 'from-amber-600 to-orange-950',
    description: '在首尔网红咖啡店点冰美式/燕麦拿铁、调整甜度与冰量，并使用手机扫码积分。',
    targetSkills: ['点单定制 (얼음 적게/덜 달게)', '外带堂食选择', '支付与积分'],
    systemPrompt: '你是弘大咖啡馆咖啡师兼收银员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '바리스타 (咖啡师)',
        avatar: '🧑🏻‍🍳',
        ko: '주문 도와드리겠습니다! 드시고 가시나요, 아니면 포장이실까요?',
        zh: '为您点餐！请问是在店内享用还是打包外带呢？',
        roman: 'Jumun dowadeurigesseumnida! Deusigo gasinayo...',
        grammarTip: '考点：드시고 가시다 (堂食)；포장하다/테이크아웃 (外带)',
        suggestedResponses: ['아이스 아메리카노 한 잔 포장해 주시고요, 샷 추가해 주세요.', '매장에서 마시고 갈게요. 바닐라 라떼에 우유는 오트밀크로 바꿔주세요.']
      }
    ]
  },
  {
    id: 'daily_03',
    title: '东大门夜市小吃街点餐与 AA 结账',
    koreanTitle: '동대문 야시장 떡볶이 주문 및 더치페이',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🍢',
    gradient: 'from-orange-600 to-red-950',
    description: '在夜市排挡点辣炒年糕、鱼饼汤和米肠，并与韩国老板沟通现金或转账结算。',
    targetSkills: ['夜市小吃点单', '辣度调整 (덜 맵게)', '结账方式 (계좌이체/현금)'],
    systemPrompt: '你是东大门夜市小吃摊阿姨。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '포장마차 이모 (夜市阿姨)',
        avatar: '👵🏻',
        ko: '어서 오세요! 우리 집 떡볶이랑 순대가 아주 맛있어. 뭐 줄까, 학생?',
        zh: '快请进！我们家的炒年糕和米肠非常美味。要来点什么呀，同学？',
        roman: 'Eoseo oseyo! Uri jip tteokbokki-rang sundae-ga...',
        grammarTip: '考点：뭐 줄까? (要给你什么/来点什么)；-이랑/랑 (和/跟)',
        suggestedResponses: ['이모님, 떡볶이 1인분이랑 어묵 2개 주세요. 덜 맵게 해주세요!', '순대 1인분에 내장도 섞어서 주실 수 있나요? 계좌이체 가능한가요?']
      }
    ]
  },
  {
    id: 'daily_04',
    title: '明洞乐天免税店美妆导购与退税办理',
    koreanTitle: '명동 면세점 화장품 쇼핑 및 택스리펀',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '💄',
    gradient: 'from-pink-600 to-rose-950',
    description: '选购韩国护肤品、咨询买赠活动 (1+1)、出示护照并在柜台开具即时退税单。',
    targetSkills: ['美妆功效询问 (미백/보습)', '折扣与赠品 (1+1/사은품)', '退税流程 (택스리펀)'],
    systemPrompt: '你是免税店美妆专柜柜姐。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '면세점 직원 (免税店导购)',
        avatar: '👩🏻‍💼',
        ko: '고객님, 찾으시는 특정 제품이나 고민이신 피부 타입이 있으신가요?',
        zh: '顾客您好，请问有特定寻找的产品或者想要改善的肤质类型吗？',
        roman: 'Gogaeknim, chajeusineun teukjeong jepum-ina...',
        grammarTip: '考点：찾으시는 제품 (您寻找的产品)；피부 타입 (皮肤类型)',
        suggestedResponses: ['건성 피부에 좋은 수분 크림 추천해 주세요. 지금 1+1 행사 중인가요?', '이 제품 구매하면 택스리펀 영수증 바로 발급받을 수 있나요?']
      }
    ]
  },
  {
    id: 'daily_05',
    title: 'GS25 便利店便当加热与 T-Money 充值',
    koreanTitle: '편의점 도시락 데우기 및 티머니 충전',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🏪',
    gradient: 'from-emerald-600 to-teal-950',
    description: '在韩国便利店购买盒饭便当并使用微波炉加热，同时为交通卡充值 2 万韩元。',
    targetSkills: ['便利店日常求助', '交通卡充值 (티머니 충전)', '微波炉加热'],
    systemPrompt: '你是 GS25 便利店晚班店员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '편의점 알바생 (便利店员)',
        avatar: '🧑🏻‍💼',
        ko: '어서오세요! 봉투 필요하신가요? 계산 도와드리겠습니다.',
        zh: '欢迎光临！需要塑料袋吗？我来帮您结算。',
        roman: 'Eoseo-oseyo! Bongtu piryohasin-gayo?...',
        grammarTip: '考点：봉투 (塑料袋/纸袋)；-필요하시다 (是否需要)',
        suggestedResponses: ['봉투는 괜찮고요, 도시락 전자레인지에 몇 초 돌려야 하나요?', '교통카드 충전도 되나요? 이만 원 충전해 주세요.']
      }
    ]
  },
  {
    id: 'daily_06',
    title: '首尔地铁 2 号线换乘求助与问路',
    koreanTitle: '지하철 2호선 환승 및 길 찾기',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🚇',
    gradient: 'from-green-600 to-emerald-950',
    description: '在复杂的新道林/市厅地铁站向站务员询问如何换乘 2 号线内线循环与寻找出口。',
    targetSkills: ['换乘问询 (환승)', '出口指引 (몇 번 출구)', '方向确认 (내선순환)'],
    systemPrompt: '你是首尔地铁站站务员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '역무원 (站务员)',
        avatar: '👮🏻‍♂️',
        ko: '네, 도움이 필요하신가요? 어느 방면으로 가시나요?',
        zh: '您好，需要帮助吗？请问您前往哪个方向？',
        roman: 'Ne, doum-i piryohasin-gayo? Eoneu bangmyeon-euro...',
        grammarTip: '考点：어느 방면 (哪个方向)；-로 가다 (前往)',
        suggestedResponses: ['실례지만 강남역으로 가려면 몇 번 플랫폼에서 타야 하나요?', 'DDP로 가고 싶은데 2호선으로 갈아타는 곳이 어디예요?']
      }
    ]
  },
  {
    id: 'daily_07',
    title: '炭火烤肉店点五花肉与续添生菜小菜',
    koreanTitle: '숯불 삼겹살 주문 및 쌈 채소 리필',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🥩',
    gradient: 'from-red-600 to-amber-950',
    description: '在烤肉店点 2 人份五花肉和冷面，请店员更换烤盘并免费续添生菜蒜瓣。',
    targetSkills: ['烤肉菜单点菜 (삼겹살/목살)', '免费续加 (리필)', '换烤网 (불판 갈아주세요)'],
    systemPrompt: '你是烤肉店服务员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '고깃집 직원 (烤肉店员)',
        avatar: '🧑🏻‍🍳',
        ko: '주문하시겠어요? 첫 주문은 기본 2인분부터 가능하십니다!',
        zh: '请问要点单吗？首次点餐最少需要 2 人份起哦！',
        roman: 'Jumunhasigesseoyo? Cheot jumun-eun gibon...',
        grammarTip: '考点：-부터 가능하시다 (从...起可以)；-인분 (份数)',
        suggestedResponses: ['삼겹살 2인분이랑 된장찌개 하나, 공깃밥 두 개 주세요.', '저기요, 불판이 좀 탄 것 같은데 판 갈아주실 수 있나요? 쌈채소도 리필해 주세요!']
      }
    ]
  },
  {
    id: 'daily_08',
    title: '江南时尚发廊剪发造型与染烫沟通',
    koreanTitle: '강남 미용실 컷트 및 헤어 스타일링',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '💇🏻‍♀️',
    gradient: 'from-purple-600 to-pink-950',
    description: '向韩国发型总监详细描述修剪长度、打薄、八字刘海与染发色板挑选。',
    targetSkills: ['发型设计用语 (기장/숱/사이드뱅)', '染发色调沟通 (애쉬 브라운)', '造型定制'],
    systemPrompt: '你是江南清潭洞知名发型总监。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '헤어 디자이너 원장 (发型总监)',
        avatar: '💇🏻‍♂️',
        ko: '안녕하세요! 오늘 어떤 스타일로 변신하고 싶으신가요? 생각하신 사진이 있으실까요?',
        zh: '您好！今天想打造什么风格的造型呢？有提前准备好的参考照片吗？',
        roman: 'Annyeonghaseyo! Oneul eotteon seutail-ro...',
        grammarTip: '考点：-로 변신하다 (变身/做某种造型)；기장 (头发长度)',
        suggestedResponses: ['기장은 끝에 상한 부분만 2cm 정도 다듬어 주시고요, 숱 좀 쳐주세요.', '자연스러운 사이드뱅이랑 시스루 앞머리로 잘라주세요.']
      }
    ]
  },
  {
    id: 'daily_09',
    title: '新村不动产中介看房与租房合同咨询',
    koreanTitle: '신촌 부동산 원룸 매물 투어 및 계약',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🏠',
    gradient: 'from-amber-600 to-yellow-950',
    description: '向中介咨询大学附近的单身公寓 (One-Room)，了解保证金、月租、管理费包含项目。',
    targetSkills: ['房产术语 (보증금/월세/관리비)', '房屋设施确认 (풀옵션)', '租期与朝向'],
    systemPrompt: '你是新村不动产中介所长。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '부동산 소장님 (中介所长)',
        avatar: '👨🏻‍💼',
        ko: '어서 오세요! 학교 근처로 원룸 찾으시죠? 보증금이랑 월세 예산은 어느 정도로 생각하고 계신가요?',
        zh: '快请进！是在找学校附近的一居室单身公寓吧？保证金和月租预算大概考虑在多少范围呢？',
        roman: 'Eoseo oseyo! Hakgyo geuncheo-ro...',
        grammarTip: '考点：예산 (预算)；풀옵션 (全配家电/家具齐全)',
        suggestedResponses: ['보증금 500에 월세 50만 원 선으로 채광 좋은 남향 방 보고 싶어요.', '관리비에 인터넷이랑 수도세가 포함되어 있는지 궁금합니다.']
      }
    ]
  },
  {
    id: 'daily_10',
    title: '首尔综合医院挂号、就医问诊与药房取药',
    koreanTitle: '서울 대학병원 접수, 진료 및 약국 조제',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🏥',
    gradient: 'from-teal-600 to-slate-950',
    description: '在综合医院前台挂号出示登陆证，向内科医生描述胃痛反酸发烧症状并去药店拿药。',
    targetSkills: ['症状描述 (속이 쓰리다/열이 나다)', '过敏史告知', '服药剂量与频次 (식후 30분)'],
    systemPrompt: '你是综合医院内科主治医生。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '내과 의사 (内科医生)',
        avatar: '👨🏻‍⚕️',
        ko: '어디가 불편해서 오셨나요? 증상이 언제부터 시작되었는지 말씀해 주세요.',
        zh: '哪里不舒服呢？请告诉我症状是从什么时候开始出现的。',
        roman: 'Eodiga bulpyeonhaeseo osyeonnayo?...',
        grammarTip: '考点：어디가 불편하다 (哪里不舒服)；-ㄴ 지 되다 (过了多久)',
        suggestedResponses: ['이틀 전부터 속이 너무 쓰리고 소화가 안 돼요. 어젯밤부터는 미열도 있어요.', '혹시 항생제 부작용이 있어서 그런데 약 처방하실 때 참고해 주실 수 있나요?']
      }
    ]
  },
  {
    id: 'daily_11',
    title: '友利银行开户与办理兼职结算 Check 卡',
    koreanTitle: '우리은행 계좌 개설 및 체크카드 발급',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🏦',
    gradient: 'from-blue-600 to-indigo-950',
    description: '携带外国人登录证与在学证明在银行柜台开立通胀活期账户、开通手机银行。',
    targetSkills: ['金融业务用语 (계좌 개설/통장)', '办卡流程 (체크카드)', '转账限额设置'],
    systemPrompt: '你是友利银行柜面行员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '은행 창구 직원 (银行柜员)',
        avatar: '👩🏻‍💼',
        ko: '안녕하세요, 고객님! 오늘 어떤 금융 업무를 도와드릴까요?',
        zh: '您好顾客！今天有什么金融业务需要协助您办理呢？',
        roman: 'Annyeonghaseyo, gogaeknim! Oneul eotteon...',
        grammarTip: '考点：금융 업무 (金融业务)；통장 (银行存折)',
        suggestedResponses: ['유학생 입출금 통장 개설하고 체크카드도 같이 신청하려고 합니다.', '모바일 뱅킹이랑 해외 송금 기능도 함께 신청하고 싶어요.']
      }
    ]
  },
  {
    id: 'daily_12',
    title: '出入境管理局外国人登录证 (ARC) 预约递交',
    koreanTitle: '출입국관리사무소 외국인등록증(ARC) 신청',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🛂',
    gradient: 'from-slate-700 to-gray-950',
    description: '在首尔出入境管理局窗口递交护照、在学证明、肺结核诊断书办理首次登录证。',
    targetSkills: ['出入境政务术语', '材料补齐 (서류 보완)', '领取方式 (우편 수령)'],
    systemPrompt: '你是出入境管理局签证审批公务员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '출입국 공무원 (出入境公务员)',
        avatar: '👨🏻‍✈️',
        ko: '방문 예약증과 여권, 통합신청서를 보여주시겠습니까?',
        zh: '请出示您的访问预约单、护照以及综合申请表。',
        roman: 'Bangmun yeyakjeung-gwa yeogwon...',
        grammarTip: '考点：-을/를 보여주시다 (请出示)；통합신청서 (综合申请表)',
        suggestedResponses: ['여기 예약증과 재학증명서, 거주지 확인서 원본입니다.', '외국인등록증 발급까지 대략 몇 주 정도 소요되나요? 우편 수령 가능한가요?']
      }
    ]
  },
  {
    id: 'daily_13',
    title: '乐天世界游乐园 Magic Pass 预约与游玩',
    koreanTitle: '롯데월드 어드벤처 매직패스 예약 및 즐기기',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🎡',
    gradient: 'from-pink-600 to-purple-950',
    description: '在乐天世界票务窗口买学生通票，并在园内询问热门过山车排队时间与快速通道。',
    targetSkills: ['游乐园票务与折扣', '排队时间询问 (대기 시간)', '设备限制确认'],
    systemPrompt: '你是乐天世界游乐园引导工作人员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '캐스트 직원 (乐天世界向导)',
        avatar: '🧚🏻‍♀️',
        ko: '환상의 나라 롯데월드에 오신 것을 환영합니다! 어트랙션 안내 도와드릴까요?',
        zh: '欢迎来到幻想乐园乐天世界！需要为您提供游乐设施指引吗？',
        roman: 'Hwansang-ui nara Lotte World-e...',
        grammarTip: '考点：-에 오신 것을 환영하다 (欢迎光临...)；어트랙션 (游乐设施)',
        suggestedResponses: ['아트란티스 타려면 대기 시간이 얼마나 걸리나요?', '매직패스 프리미엄 티켓은 앱에서 어떻게 등록하나요?']
      }
    ]
  },
  {
    id: 'daily_14',
    title: '汉江公园野餐垫租赁与外卖配送点定位',
    koreanTitle: '한강공원 돗자리 대여 및 배달존 치맥',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🍗',
    gradient: 'from-sky-600 to-indigo-950',
    description: '在汝矣岛汉江公园租赁野餐垫和露营灯，用外卖软件定位到 2 号配送区点炸鸡啤酒。',
    targetSkills: ['外卖定位 (배달존 2번)', '炸鸡口味与部位 (순살/반반)', '野餐租赁'],
    systemPrompt: '你是外卖炸鸡店配送骑手。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '배달 기사님 (外卖骑手)',
        avatar: '🛵',
        ko: '여보세요! 주문하신 굽네치킨 배달원입니다. 지금 여의도 한강공원 배달존 2번에 도착했는데 어디 계신가요?',
        zh: '喂您好！我是您订购的贡乃炸鸡外卖员。现在已经到达汝矣岛汉江公园 2 号外卖点，请问您在哪儿呢？',
        roman: 'Yeoboseyo! Jumunhasin baedalwon-imnida...',
        grammarTip: '考点：-에 도착하다 (到达某处)；어디 계시다 (您在何处)',
        suggestedResponses: ['네 기사님! 저 지금 배달존 2번 표지판 바로 앞에 흰색 옷 입고 서 있어요.', '결제는 어플에서 완료했습니다. 영수증 붙은 봉투 전달 부탁드립니다!']
      }
    ]
  },
  {
    id: 'daily_15',
    title: '韩国健身房办卡、私教 PT 咨询与体测',
    koreanTitle: '헬스장 등록 및 인바디 체성분 상담',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🏋🏻‍♂️',
    gradient: 'from-amber-600 to-red-950',
    description: '在首尔连锁健身房咨询 3 个月会员卡、测 InBody 体脂率并商讨减脂增肌训练计划。',
    targetSkills: ['健身用语 (인바디/근육량/체지방)', '更衣柜与运动服租赁', '私教课排期'],
    systemPrompt: '你是健身房高级私人教练 (PT)。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '헬스 트레이너 (健身教练)',
        avatar: '💪🏻',
        ko: '회원님 반갑습니다! 평소 운동 경험이 있으신가요? 다이어트나 근력 증량 중 어떤 목표를 원하시나요?',
        zh: '会员您好！平时有健身运动习惯吗？减脂瘦身和增肌塑形中，您更倾向哪个目标呢？',
        roman: 'Hwoewonnim bangapseumnida! Pyeongso undong...',
        grammarTip: '考点：-중 어떤 것 (两者中哪一个)；근력 증량 (增肌)',
        suggestedResponses: ['체지방을 줄이고 기초체력을 기르고 싶어요. 주 3회 PT 비용이 어떻게 되나요?', '라커룸이랑 운동복 대여료는 회원권에 포함되어 있나요?']
      }
    ]
  },
  {
    id: 'daily_16',
    title: '韩国投币练歌房 (Coin Noraebang) 选歌与加时',
    koreanTitle: '코인노래방 곡 선택 및 보너스 시간',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🎤',
    gradient: 'from-violet-600 to-purple-950',
    description: '在投币 KTV 投币或扫卡、用遥控器搜索热门 K-POP 歌曲编号并调麦克风音量。',
    targetSkills: ['练歌房用语 (예약/취소/간주점프)', '音量与混响调节', '选歌编号'],
    systemPrompt: '你是投币练歌房老板。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '코노 사장님 (练歌房老板)',
        avatar: '👨🏻',
        ko: '빈 방 5번 방으로 들어가시면 됩니다! 카드 결제는 리모컨 아래 단말기에서 바로 가능해요.',
        zh: '空房间 5 号房可以直接进去！刷卡支付在遥控器下方的刷卡机即可完成。',
        roman: 'Bin bang 5-beon bang-euro...',
        grammarTip: '考点：-으로 들어가다 (进入某方向)；단말기 (刷卡终端)',
        suggestedResponses: ['마이크 커버랑 탬버린은 어디에서 가져가면 되나요?', '10곡 결제했는데 혹시 보너스 곡도 넣어주실 수 있나요?']
      }
    ]
  },
  {
    id: 'daily_17',
    title: '韩国 CGV 电影院选座与爆米花套餐',
    koreanTitle: 'CGV 영화관 좌석 예매 및 팝콘 콤보',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🍿',
    gradient: 'from-red-600 to-slate-950',
    description: '在影院前台或自助取票机打印电影票、购买焦糖/芝士爆米花与可乐双人套餐。',
    targetSkills: ['电影票预订 (좌석 선택/자막/더빙)', '爆米花口味更换 (달콤/어니언)', '取票确认'],
    systemPrompt: '你是 CGV 影院卖品部兼票务员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: 'CGV 미소지기 (影院乘务员)',
        avatar: '🧑🏻‍💼',
        ko: '안녕하세요, CGV입니다! 예매 티켓 출력이신가요, 아니면 스낵 주문 도와드릴까요?',
        zh: '您好，这里是 CGV！请问是打印预售票还是为您点零食套餐呢？',
        roman: 'Annyeonghaseyo, CGV-imnida! Yeyae tiket...',
        grammarTip: '考点：출력하다 (打印)；스낵 (小吃零食)',
        suggestedResponses: ['CGV 콤보 하나 주시고요, 팝콘은 반반(달콤한 맛이랑 어니언 맛)으로 변경해 주세요.', '앱으로 예매한 번호가 있는데 티켓 발권기 위치가 어디인가요?']
      }
    ]
  },
  {
    id: 'daily_18',
    title: '韩国邮局寄送 EMS 国际快递与报关单',
    koreanTitle: '우체국 국제특급(EMS) 택배 발송 및 세관 신고',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '📮',
    gradient: 'from-red-600 to-orange-950',
    description: '在韩国邮局购买纸箱打包特产物品，称重计费并填写寄往中国境内的报关单。',
    targetSkills: ['寄件用语 (무게/운임/박스 규격)', '物品报关填写', '单号追踪 (등기번호)'],
    systemPrompt: '你是韩国邮局柜员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '우체국 직원 (邮局员工)',
        avatar: '👩🏻‍💼',
        ko: '중국으로 보내시는 EMS 특급이신가요? 상자 안에 배터리나 화장품 액체류가 포함되어 있나요?',
        zh: '是寄往中国的 EMS 特快专递吗？箱子里面含有电池或化妆品液体类物品吗？',
        roman: 'Jungguk-euro bonaesineun EMS...',
        grammarTip: '考点：-이/가 포함되어 있다 (包含某物)；배송 금지 품목 (违禁品)',
        suggestedResponses: ['의류와 과자류만 들어있습니다. 박스 테이프 빌려주실 수 있나요?', '중국 베이징까지 배송되는 데 보통 며칠 정도 걸리나요?']
      }
    ]
  },
  {
    id: 'daily_19',
    title: 'E-Mart 大型超市自助结账与垃圾分类袋',
    koreanTitle: '이마트 셀프 계산대 및 종량제 봉투 구매',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🛒',
    gradient: 'from-yellow-600 to-amber-950',
    description: '在易买得超市自助结账机扫描条码，购买麻浦区/西大门区指定生活垃圾分类袋。',
    targetSkills: ['超市自助收银', '垃圾袋规格 (종량제 봉투 20L)', '积分与小票'],
    systemPrompt: '你是 E-Mart 自助结账区协助员。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '마트 안내원 (超市引导员)',
        avatar: '👩🏻‍💼',
        ko: '바코드 스캔이 잘 안 되시나요? 제가 도와드리겠습니다. 봉투 필요하신가요?',
        zh: '条形码扫描不顺利吗？我来帮您。请问需要购物袋吗？',
        roman: 'Bakodeu seukaen-i jal an doesinayo?...',
        grammarTip: '考点：-이/가 잘 안 되다 (做某事不太顺畅)；종량제 (按量收费垃圾袋)',
        suggestedResponses: ['마포구 20리터짜리 일반 종량제 쓰레기봉투 한 장 같이 계산해 주세요.', '모바일 신세계 상품권으로도 결제 가능한가요?']
      }
    ]
  },
  {
    id: 'daily_20',
    title: '首尔共享单车“叮铃铃 (따릉이)”租借与故障报修',
    koreanTitle: '서울 공공자전거 따릉이 대여 및 반납',
    category: 'daily_life',
    categoryLabel: '赴韩实用生活',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🚲',
    gradient: 'from-emerald-600 to-green-950',
    description: '使用外国人专属 App 扫描车锁二维码租车，途中遇到刹车异响申请换车与还车。',
    targetSkills: ['共享单车使用 (QR코드 스캔/임시잠금)', '还车确认 (반납 완료)', '故障报修'],
    systemPrompt: '你是首尔公共自行车客服中心语音。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '따릉이 안내센터 (单车客服)',
        avatar: '🚲',
        ko: '따릉이 고객센터입니다. 대여 및 반납 중 어떤 부분에 불편을 겪고 계신가요?',
        zh: '这里是首尔单车站务客服中心。请问在租借或还车过程中遇到了什么困难呢？',
        roman: 'Ttareungi gogaek senteo-imnida...',
        grammarTip: '考点：불편을 겪다 (遭遇不便)；반납하다 (归还)',
        suggestedResponses: ['거치대에 반납 잠금장치를 채웠는데 반납 완료 알림이 안 와요.', '자전거 브레이크에 이상이 있어서 다른 자전거로 재대여하고 싶습니다.']
      }
    ]
  }
];

console.log('Daily Life Scenarios count:', dailyLifeScenarios.length);
module.exports = { dailyLifeScenarios };
