const fs = require('fs');
const path = require('path');

// 完整的 12 大类别海量词汇生成系统
const baseVocab = [];

// 1. TOPIK 1 (初级入门必背 1级)
const t1Words = [
  { word: '안녕하세요', pos: '感叹词', meaning: '你好、您好', pron: 'annyeonghaseyo', ko: '선생님, 안녕하세요! 오늘 날씨가 참 좋네요.', zh: '老师，您好！今天天气真好啊。', tip: '最基础标准敬语问候。' },
  { word: '감사합니다', hanja: '感謝합니다', pos: '动词', meaning: '非常感谢、谢谢', pron: 'gamsahamnida', ko: '바쁘신 와중에도 도와주셔서 진심으로 감사합니다.', zh: '在百忙之中给予帮助，由衷地感谢您。', tip: '最高格式体敬语。' },
  { word: '죄송합니다', hanja: '罪悚합니다', pos: '动词', meaning: '对不起、非常抱歉', pron: 'joesonghamnida', ko: '약속 시간에 늦어서 정말 죄송합니다.', zh: '约会时间迟到了，真的很抱歉。', tip: '正式致歉用语。' },
  { word: '사람', pos: '名词', meaning: '人、人们', pron: 'saram', ko: '한국에는 친절하고 따뜻한 사람이 참 많아요.', zh: '韩国有很多亲切热情的人。', tip: '例：중국 사람 (中国人)。' },
  { word: '학교', hanja: '學校', pos: '名词', meaning: '学校', pron: 'hakgyo', ko: '저는 매일 아침 8시 반에 학교에 갑니다.', zh: '我每天早晨 8 点半去学校。', tip: '搭配：학교에 가다 (去上学)。' },
  { word: '공부하다', hanja: '工夫하다', pos: '动词', meaning: '学习、用功', pron: 'gongbuhada', ko: '도서관에서 친구와 함께 한국어를 열심히 공부해요.', zh: '在图书馆和朋友一起刻苦学习韩语。', tip: '源自汉字“工夫”。' },
  { word: '먹다', pos: '动词', meaning: '吃、喝', pron: 'meokda', ko: '점심으로 매콤하고 맛있는 비빔밥을 먹었어요.', zh: '午饭吃了微辣美味的拌饭。', tip: '敬语为 드시다 / 잡수시다。' },
  { word: '가다', pos: '动词', meaning: '去、前往', pron: 'gada', ko: '주말에 가족들과 함께 제주도로 여행을 가요.', zh: '周末和家人们一起去济州岛旅行。', tip: '反义词为 오다 (来)。' },
  { word: '오다', pos: '动词', meaning: '来、到来', pron: 'oda', ko: '친구가 우리 집에 놀러 오기로 했어요.', zh: '朋友说好来我家玩。', tip: '雨/雪落下也用 오다。' },
  { word: '보다', pos: '动词', meaning: '看、见、视', pron: 'boda', ko: '어제 영화관에서 재미있는 한국 영화를 봤어요.', zh: '昨天在电影院看了一部有趣的韩国电影。', tip: '考试也用 시험을 보다。' },
  { word: '물', pos: '名词', meaning: '水', pron: 'mul', ko: '목이 마르니까 시원한 물 한 잔만 주세요.', zh: '口渴了，请给我一杯凉水。', tip: '凉水：시원한 물；热水：따뜻한 물。' },
  { word: '밥', pos: '名词', meaning: '米饭、饭菜', pron: 'bap', ko: '한국 사람들은 아침에 꼭 밥을 챙겨 먹어요.', zh: '韩国人早晨一定会按时吃饭。', tip: '敬语为 진지。' },
  { word: '친구', hanja: '親舊', pos: '名词', meaning: '朋友、同龄伙伴', pron: 'chingu', ko: '오랜만에 고향 친구를 만나서 즐거운 시간을 보냈어요.', zh: '久违地见到了老家朋友，度过了愉快的时光。', tip: '同龄人为朋友，年长者叫 형/누나/오빠/언니。' },
  { word: '선생님', hanja: '先生님', pos: '名词', meaning: '老师、先生', pron: 'seonsaengnim', ko: '선생님께서 한국어 문법을 아주 쉽게 설명해 주셨어요.', zh: '老师把韩语语法讲解得非常浅显易懂。', tip: '韩国对尊敬的人常加 님。' },
  { word: '집', pos: '名词', meaning: '家、房子', pron: 'jip', ko: '수업이 끝나면 바로 집으로 돌아갈 거예요.', zh: '下课后我打算马上回家。', tip: '敬语为 댁 (宅)。' },
  { word: '책', hanja: '冊', pos: '名词', meaning: '书本、书籍', pron: 'chaek', ko: '시간이 날 때마다 서점에서 다양한 책을 읽어요.', zh: '每当有空的时候，我都会在书店读各种各样的书。', tip: '量词为 권 (本/册)。' },
  { word: '일하다', pos: '动词', meaning: '工作、干活', pron: 'ilhada', ko: '저는 평일에는 회사에서 열심히 일해요.', zh: '我平时在公司认真工作。', tip: '名词形式为 일 (事/工作)。' },
  { word: '사다', pos: '动词', meaning: '买、购买', pron: 'sada', ko: '백화점에서 부모님께 드릴 선물을 샀어요.', zh: '在百货商场买了送给父母的礼物。', tip: '反义词为 팔다 (卖)。' },
  { word: '크다', pos: '形容词', meaning: '大、高大', pron: 'keuda', ko: '이 가방은 크기가 커서 물건이 많이 들어가요.', zh: '这个包容量很大，能装很多东西。', tip: '反义词为 작다 (小)。' },
  { word: '작다', pos: '形容词', meaning: '小、矮小', pron: 'jakda', ko: '신발이 제 발에 좀 작아서 발가락이 아파요.', zh: '鞋子对我脚来说有点小，脚趾头有点疼。', tip: '反义词为 크다。' }
];

t1Words.forEach((item, idx) => {
  baseVocab.push({
    id: -t1-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 2. TOPIK 2 (初级进阶 2级)
const t2Words = [
  { word: '약속', hanja: '約束', pos: '名词', meaning: '约定、约会', pron: 'yaksok', ko: '오늘 저녁에 친구와 식사 약속이 있어요.', zh: '今天傍晚和朋友有吃饭的约定。', tip: '搭配：약속을 지키다 (守约)、약속을 어기다 (违约)。' },
  { word: '도착하다', hanja: '到着하다', pos: '动词', meaning: '到达、抵达', pron: 'dochakhada', ko: '기차가 정시에 서울역에 안전하게 도착했습니다.', zh: '火车准时安全到达了首尔站。', tip: '反义词为 출발하다 (出发)。' },
  { word: '준비하다', hanja: '準備하다', pos: '动词', meaning: '准备、筹备', pron: 'junbihada', ko: '내일 있을 발표 시험을 위해 자료를 꼼꼼히 준비해요.', zh: '为了明天的演讲考试，仔细准备材料。', tip: '考级高频常用词。' },
  { word: '이야기하다', pos: '动词', meaning: '说话、交谈、聊天', pron: 'iyagihada', ko: '카페에서 친구와 여러 가지 주제로 즐겁게 이야기했어요.', zh: '在咖啡厅和朋友就各种话题愉快地交谈。', tip: '缩略口语形式为 얘기하다。' },
  { word: '기다리다', pos: '动词', meaning: '等待、等候', pron: 'gidarida', ko: '정류장에서 20분 동안 버스를 기다렸어요.', zh: '在车站等了 20 分钟公交车。', tip: '常见句型：잠시만 기다려 주세요 (请稍等)。' },
  { word: '전화하다', hanja: '電話하다', pos: '动词', meaning: '打电话', pron: 'jeonhwahada', ko: '집에 도착하자마자 어머니께 전화를 드렸어요.', zh: '一到家就给母亲打了电话。', tip: '敬语给长辈打电话用 전화를 드리다。' },
  { word: '시작하다', hanja: '始作하다', pos: '动词', meaning: '开始、着手', pron: 'sijakhada', ko: '새해를 맞이하여 새로운 운동을 시작하기로 결심했어요.', zh: '迎接新年，下决心开始一项新的运动。', tip: '反义词为 끝나다 / 끝내다 (结束)。' },
  { word: '끝나다', pos: '动词', meaning: '结束、完毕(自动词)', pron: 'kkeutnada', ko: '오늘 수업은 오후 5시에 모두 끝납니다.', zh: '今天的课程在下午 5 点全部结束。', tip: '他动词形式为 끝내다 (把...结束)。' },
  { word: '복잡하다', hanja: '複雜하다', pos: '形容词', meaning: '复杂、拥挤', pron: 'bokjaphada', ko: '출퇴근 시간의 지하철은 사람들로 매우 복잡해요.', zh: '上下班高峰期的地铁挤满了人，非常拥挤。', tip: '既可指路线/交通拥挤，也可指思维/情况复杂。' },
  { word: '편리하다', hanja: '便利하다', pos: '形容词', meaning: '便利、方便', pron: 'pyeonrihada', ko: '스마트폰 앱을 이용하면 결제가 아주 편리해요.', zh: '使用手机 App 的话，支付非常便利。', tip: '反义词为 불편하다 (不便)。' }
];

t2Words.forEach((item, idx) => {
  baseVocab.push({
    id: -t2-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 3. TOPIK 3 (中级核心 3级)
const t3Words = [
  { word: '경험', hanja: '經驗', pos: '名词', meaning: '经验、经历', pron: 'gyeongheom', ko: '다양한 아르바이트 경험은 사회생활에 큰 도움이 된다.', zh: '丰富的兼职经历对步入社会大有裨益。', tip: '搭配：경험을 쌓다 (积累经验)。' },
  { word: '성공하다', hanja: '成功하다', pos: '动词', meaning: '成功', pron: 'seonggonghada', ko: '포기하지 않고 끝까지 도전하여 마침내 시험에 성공했다.', zh: '坚持不放弃并挑战到底，终于在考试中取得成功。', tip: '反义词为 실패하다 (失败)。' },
  { word: '발생하다', hanja: '發生하다', pos: '动词', meaning: '发生、产生', pron: 'balsaenghada', ko: '갑작스러운 정전 사고가 발생하여 도시 전체가 어두워졌다.', zh: '突发停电事故，整个城市陷入一片黑暗。', tip: '常与 사고(事故)、문제(问题) 连用。' },
  { word: '조사하다', hanja: '調査하다', pos: '动词', meaning: '调查、探究', pron: 'josahada', ko: '소비자들의 구매 성향을 파악하기 위해 설문 조사를 했다.', zh: '为了掌握消费者的购买倾向进行了问卷调查。', tip: 'TOPIK 图表写作 53 题必考词。' },
  { word: '증가하다', hanja: '增加하다', pos: '动词', meaning: '增加、增长', pron: 'jeunggajada', ko: '최근 1인 가구의 수가 전년 대비 크게 증가했다.', zh: '最近单人家庭数量相比前一年大幅增加。', tip: '反义词为 감소하다 (减少)。' },
  { word: '감소하다', hanja: '減少하다', pos: '动词', meaning: '减少、降低', pron: 'gamsohada', ko: '출산율 저하로 인해 학령인구가 점차 감소하고 있다.', zh: '受生育率低下影响，学龄人口正逐渐减少。', tip: '同义词：줄어들다 (缩减)。' },
  { word: '중요성', hanja: '重要性', pos: '名词', meaning: '重要性', pron: 'jung-yoseong', ko: '환경 보호의 중요성을 깨닫고 일회용품 사용을 줄여야 한다.', zh: '必须认识到环境保护的重要性，减少一次性用品的使用。', tip: '搭配：중요성을 깨닫다 (意识到重要性)。' },
  { word: '해결하다', hanja: '解決하다', pos: '动词', meaning: '解决、化解', pron: 'haegyeolhada', ko: '대화를 통해 서로의 오해와 갈등을 원만하게 해결했다.', zh: '通过沟通圆满化解了彼此的误会与矛盾。', tip: '搭配：문제를 해결하다 (解决问题)。' }
];

t3Words.forEach((item, idx) => {
  baseVocab.push({
    id: -t3-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 4. TOPIK 4 (中级跃升 4级)
const t4Words = [
  { word: '영향을 미치다', pos: '动词', meaning: '产生影响、施加影响', pron: 'yeonghyang-eul michida', ko: '부모의 독서 습관은 자녀의 언어 발달에 긍정적인 영향을 미친다.', zh: '父母的阅读习惯对子女的语言发展产生积极影响。', tip: 'TOPIK 写作与阅读超高频核心搭配。' },
  { word: '원인', hanja: '原因', pos: '名词', meaning: '原因、起因', pron: 'weonin', ko: '전문가들은 이번 경제 위기의 근본적인 원인을 다각도로 분석했다.', zh: '专家们从多角度剖析了本次经济危机的根本原因。', tip: '搭配：원인을 규명하다 (查明原因)。' },
  { word: '바탕으로', pos: '副词', meaning: '以...为基础、基于', pron: 'batang-euro', ko: '실제 역사적 사건을 바탕으로 제작된 감동적인 영화이다.', zh: '这是一部以真实历史事件为基础制作的感人电影。', tip: '写作高级过渡句型必备词汇。' },
  { word: '극복하다', hanja: '克服하다', pos: '动词', meaning: '克服、战胜', pron: 'geukbokhada', ko: '어려운 경제적 위기를 전 국민이 힘을 합쳐 슬기롭게 극복했다.', zh: '全体国民齐心协力智慧地克服了艰难的经济危机。', tip: '搭配：고난을 극복하다 (克服苦难)。' },
  { word: '제공하다', hanja: '提供하다', pos: '动词', meaning: '提供、供给', pron: 'jegonghada', ko: '정부는 청년 창업자들에게 다양한 금융 및 공간 지원을 제공한다.', zh: '政府向青年创业者提供多元的金融与场地支持。', tip: '搭配：서비스를 제공하다 (提供服务)。' }
];

t4Words.forEach((item, idx) => {
  baseVocab.push({
    id: -t4-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: 'TOPIK 4',
    category: 'TOPIK 4 (中级跃升)',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 5. TOPIK 5-6 (高级精通 5~6级)
const t56Words = [
  { word: '패러다임', pos: '名词', meaning: '范式、体系模式 (Paradigm)', pron: 'paereodaim', ko: '디지털 혁명은 산업 전반의 패러다임을 근본적으로 전환시켰다.', zh: '数字革命从根本上转变了整个产业的范式体系。', tip: 'TOPIK 81~100 题社科长文高频词汇。' },
  { word: '지속 가능성', pos: '名词', meaning: '可持续性 (Sustainability)', pron: 'jisok ganeungseong', ko: '기업은 단기적 이윤 추구를 넘어 환경적 지속 가능성을 확보해야 한다.', zh: '企业必须超越短期利益追求，确保环境维度的可持续性。', tip: 'ESG 与环保议题常考核心词汇。' },
  { word: '양극화', hanja: '兩極化', pos: '名词', meaning: '两极分化、极化现象', pron: 'yanggeukhwa', ko: '소득 격차와 교육 기회의 불평등으로 인한 사회적 양극화가 심각하다.', zh: '因收入差距与教育机会不平等导致的社会两极分化极为严峻。', tip: '社会问题大作文常考论点词汇。' },
  { word: '외주화', hanja: '外注化', pos: '名词', meaning: '外包、外部委托化', pron: 'oejuhwa', ko: '위험의 외주화 현상은 비정규직 노동자들의 안전을 위협하는 요소이다.', zh: '风险外包化现象是威胁非正式劳工安全的关键因素。', tip: '劳动保障学术议题必备词。' },
  { word: '인식의 지평', pos: '名词', meaning: '认知视界、认识地平线', pron: 'insig-ui jipyeong', ko: '철학적 사유와 인문학적 성찰은 인간 인식의 지평을 무한히 확장한다.', zh: '哲学思辨与人文学省察将无限拓宽人类的认知视界。', tip: '哲学与美学学术大文压轴词汇。' },
  { word: '불가피하다', hanja: '不可避하다', pos: '形容词', meaning: '不可避免的、势在必然的', pron: 'bulgapihada', ko: '인구 고령화에 따른 복지 지출의 증가는 재정 부담 측면에서 불가피하다.', zh: '人口老龄化带来的福利支出增加在财政负担层面是不可避免的。', tip: '高级论述文结论段高频形容词。' }
];

t56Words.forEach((item, idx) => {
  baseVocab.push({
    id: -t56-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: 'TOPIK 5-6 (高级精通)' ? 'TOPIK 5' : 'TOPIK 6',
    category: 'TOPIK 5-6 (高级精通)',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 6. 日常起居与餐饮
const dailyWords = [
  { word: '아메리카노', pos: '名词', meaning: '美式咖啡', pron: 'amerikano', ko: '얼죽아(얼어 죽어도 아이스 아메리카노)라는 말이 유행할 정도로 인기가 많아요.', zh: '人气高到“冻死也要喝冰美式”这句话成为流行的程度。', tip: '搭配：아이스 아메리카노 (冰美式)。' },
  { word: '포장하다', hanja: '包裝하다', pos: '动词', meaning: '打包、包装', pron: 'pojanghada', ko: '매장에서 드시겠어요, 아니면 포장해 드릴까요?', zh: '请问是在店内享用，还是帮您打包呢？', tip: '口语中常直接说 테이크아웃 (Takeout)。' },
  { word: '진동벨', pos: '名词', meaning: '取餐呼叫器、振动铃', pron: 'jindongbel', ko: '주문하신 음료가 준비되면 진동벨이 울립니다.', zh: '您点的饮品备好后取餐振动铃会响。', tip: '韩国咖啡厅必备生活常识词汇。' },
  { word: '영수증', hanja: '領收證', pos: '名词', meaning: '收据、发票', pron: 'yeongsujeung', ko: '결제 후 영수증은 버려 주세요.', zh: '结账后收据请帮我扔掉。', tip: '生活口语极高频词。' }
];

dailyWords.forEach((item, idx) => {
  baseVocab.push({
    id: -daily-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 7. 韩国旅游与交通
const travelWords = [
  { word: '환승하다', hanja: '換乘하다', pos: '动词', meaning: '换乘、倒车', pron: 'hwanseunghada', ko: '신도림역에서 지하철 1호선으로 환승해야 해요.', zh: '需要在新道林站换乘地铁 1 号线。', tip: '韩国公交地铁 30 分钟内可免费换乘。' },
  { word: '교통카드', pos: '名词', meaning: '交通卡 (T-Money)', pron: 'gyotongkadeu', ko: '편의점에서 교통카드를 2만 원 충전해 주세요.', zh: '请在便利店帮我往交通卡充值 2 万韩元。', tip: '首尔出行必备 T-Money 卡。' },
  { word: '출구', hanja: '出口', pos: '名词', meaning: '出口', pron: 'chulgu', ko: '홍대입구역 9번 출구 앞에서 2시에 만나요.', zh: '我们在弘大入口站 9 号出口前 2 点见面。', tip: '反义词为 입구 (入口)。' }
];

travelWords.forEach((item, idx) => {
  baseVocab.push({
    id: -travel-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '韩国旅游与交通',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 8. 免税店与购物
const shopWords = [
  { word: '텍스리펀', pos: '名词', meaning: '退税 (Tax Refund)', pron: 'tekseuripeon', ko: '공항에서 출국하기 전에 즉시 텍스리펀을 받으실 수 있습니다.', zh: '在机场出境前可以立即办理退税。', tip: '购物满额可享受即时或事后退税。' },
  { word: '할인 행사', hanja: '割引 行事', pos: '名词', meaning: '打折促销活动', pron: 'harin haengsa', ko: '연말을 맞이하여 전 품목 30% 할인 행사를 진행 중입니다.', zh: '正值年终，全场正开展 30% 的打折促销活动。', tip: '商场常见标语：세일 (Sale)。' }
];

shopWords.forEach((item, idx) => {
  baseVocab.push({
    id: -shop-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '免税店与购物',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 9. 韩企职场与求职
const bizWords = [
  { word: '이력서', hanja: '履歷書', pos: '名词', meaning: '简历、履历表', pron: 'iryeokseo', ko: '채용 공고를 확인한 후 온라인으로 이력서를 제출했다.', zh: '确认招聘公告后在网上提交了简历。', tip: '求职信叫 자기소개서 (自介书)。' },
  { word: '야근하다', hanja: '夜勤하다', pos: '动词', meaning: '加班、上夜班', pron: 'yageunhada', ko: '프로젝트 마감일이 임박해서 어제 팀원들과 늦게까지 야근했다.', zh: '因为项目截止期临近，昨天和团队成员加班到了很晚。', tip: '加班补贴叫 야근수당。' },
  { word: '결재를 올리다', pos: '动词', meaning: '提请审批、报批', pron: 'gyeoljaereul ollida', ko: '기안서를 작성하여 팀장님께 결재를 올렸습니다.', zh: '撰写了方案书并向组长提报了审批。', tip: '韩企职场公文流转核心术语。' }
];

bizWords.forEach((item, idx) => {
  baseVocab.push({
    id: -biz-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '韩企职场与求职',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 10. K-Pop 追星应援
const kpopWords = [
  { word: '최애', hanja: '最愛', pos: '名词', meaning: '最爱本命偶像 (Bias)', pron: 'choe-ae', ko: '이번 컴백 앨범에서 내 최애 포카가 나왔어!', zh: '这次回归专辑里开出了我本命的小卡！', tip: '第二喜欢叫 차애 (次爱)。' },
  { word: '응원봉', hanja: '應援棒', pos: '名词', meaning: '应援手灯、荧光棒', pron: 'eung-wonbong', ko: '콘서트장에서 중앙 제어 응원봉을 흔들며 열정적으로 환호했다.', zh: '在演唱会现场挥舞着中央场控应援棒热情欢呼。', tip: '各组合拥有独一无二设计的官方手灯。' },
  { word: '음원 역주행', pos: '名词', meaning: '音源逆袭、曲目走红', pron: 'eum-won yeokjuhaeng', ko: 'SNS 입소문을 타고 발매 3개월 만에 음원 차트 역주행에 성공했다.', zh: '乘着社交媒体口碑在发歌3个月后成功实现了音源榜单逆袭。', tip: '形容老歌凭借舞台或话题再度登顶。' }
];

kpopWords.forEach((item, idx) => {
  baseVocab.push({
    id: -kpop-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: 'K-Pop追星应援',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 11. 韩剧高频口语
const dramaWords = [
  { word: '눈치', pos: '名词', meaning: '眼色、察言观色', pron: 'nunchi', ko: '눈치가 빠른 사람은 대화의 미묘한 분위기를 즉시 알아차린다.', zh: '有眼力见的人能立刻察觉出对话中微妙的气氛。', tip: '搭配：눈치를 보다 (看别人眼色)。' },
  { word: '썸타다', pos: '动词', meaning: '暧昧、处于暧昧期', pron: 'sseomtada', ko: '두 사람은 사귀기 전인데 요즘 한창 썸타는 중이래.', zh: '听说他俩还没正式交往，最近正处于暧昧期呢。', tip: '源自 English Something。' },
  { word: '답답하다', pos: '形容词', meaning: '憋闷、窝火、心塞', pron: 'dapdaphada', ko: '하고 싶은 말을 제대로 못 해서 가슴이 너무 답답해요.', zh: '想说的话没能好好说出来，心里特别憋屈窝火。', tip: '既可指空气不流通憋闷，也可指心里堵得慌。' }
];

dramaWords.forEach((item, idx) => {
  baseVocab.push({
    id: -drama-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '韩剧高频口语',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

// 12. 四字成语与俗语
const idiomWords = [
  { word: '고진감래', hanja: '苦盡甘來', pos: '名词', meaning: '苦尽甘来', pron: 'gojingamrae', ko: '수년간의 피나는 노력 끝에 마침내 합격했으니 이야말로 고진감래다.', zh: '在经历了数年辛酸刻苦的努力后终于合格，这正是苦尽甘来。', tip: '形容历经磨难后迎来美好结局。' },
  { word: '시작이 반이다', pos: '名词', meaning: '良好的开端是成功的一半', pron: 'sijagi banida', ko: '망설이지 말고 도전하세요. 한국 속담에 시작이 반이라고 하잖아요.', zh: '别犹豫了勇敢挑战吧，韩国俗语说开始就是成功的一半。', tip: '鼓励踏出第一步的国民俗语。' },
  { word: '누워서 떡 먹기', pos: '名词', meaning: '易如反掌、小菜一碟', pron: 'nuwoseo tteok meokgi', ko: '이 정도 기초 문제는 나한테 누워서 떡 먹기지.', zh: '这种程度的基础题对我来说简直是小菜一碟。', tip: '同义成语：식은 죽 먹기 (吃凉粥)。' },
  { word: '티끌 모아 태산', pos: '名词', meaning: '积少成多、聚沙成塔', pron: 'tikkeul moa taesan', ko: '매일 단어 10개씩 외우는 것이 작아 보여도 티끌 모아 태산이 된다.', zh: '每天背10个单词看似微不足道，但日积月累就能聚沙成塔。', tip: '强调坚持不懈的俗语。' },
  { word: '발이 넓다', pos: '形容词', meaning: '人脉广、交际广泛', pron: 'bari neolpda', ko: '그 선배는 발이 넓어서 어느 분야든 아는 사람이 많다.', zh: '那位学长人脉很广，无论在哪个行业都有认识的朋友。', tip: '高频身体惯用语。' },
  { word: '귀가 얇다', pos: '形容词', meaning: '耳朵软、容易轻信他人言辞', pron: 'gwiga yalpda', ko: '귀가 얇아서 남의 말만 듣고 섣불리 투자했다가 손해를 봤다.', zh: '因为耳朵太软轻信了别人的话草率投资，结果遭受了损失。', tip: '高频身体惯用语。' }
];

idiomWords.forEach((item, idx) => {
  baseVocab.push({
    id: -idiom-,
    word: item.word,
    hanja: item.hanja,
    pronunciation: item.pron,
    pos: item.pos,
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: item.meaning,
    exampleKo: item.ko,
    exampleZh: item.zh,
    tips: item.tip
  });
});

const fileHeader = export interface VocabItem {
  id: string;
  word: string;
  hanja?: string;
  pronunciation: string;
  pos: '名词' | '动词' | '形容词' | '副词' | '数词' | '代词' | '冠词' | '感叹词';
  level: 'TOPIK 1' | 'TOPIK 2' | 'TOPIK 3' | 'TOPIK 4' | 'TOPIK 5' | 'TOPIK 6' | '场景专题';
  category: string;
  meaning: string;
  exampleKo: string;
  exampleZh: string;
  tips?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export const VOCAB_CATEGORIES = [
  '全部',
  'TOPIK 1 (初级入门)',
  'TOPIK 2 (初级进阶)',
  'TOPIK 3 (中级核心)',
  'TOPIK 4 (中级跃升)',
  'TOPIK 5-6 (高级精通)',
  '日常起居与餐饮',
  '韩国旅游与交通',
  '免税店与购物',
  '韩企职场与求职',
  'K-Pop追星应援',
  '韩剧高频口语',
  '四字成语与俗语'
];

export const KOREAN_VOCAB_DATA: VocabItem[] =  + JSON.stringify(baseVocab, null, 2) + ;\n;

fs.writeFileSync('src/data/korean/vocab.ts', fileHeader, 'utf8');
console.log('Successfully generated full vocab database! Total words:', baseVocab.length);
