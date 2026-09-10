const fs = require('fs');
const path = require('path');

const vocabData = [
  // ==========================================
  // --- 1. TOPIK 1 (初级入门必背 1级) ---
  // ==========================================
  {
    id: 'v-001',
    word: '안녕하세요',
    pronunciation: 'annyeonghaseyo',
    pos: '感叹词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '你好、您好（最基础敬语打招呼）',
    exampleKo: '선생님, 안녕하세요! 오늘 날씨가 참 좋네요.',
    exampleZh: '老师，您好！今天天气真好啊。',
    tips: '由 안녕(安宁/平安) + 하세요(请做/是) 组合而成。同辈平语为 안녕。'
  },
  {
    id: 'v-002',
    word: '감사합니다',
    hanja: '感謝합니다',
    pronunciation: 'gamsahamnida',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '非常感谢、谢谢（正式最高格式体）',
    exampleKo: '바쁘신 와중에도 도와주셔서 진심으로 감사합니다.',
    exampleZh: '在百忙之中给予帮助，由衷地感谢您。',
    tips: '正式场合首选用词；非格式体常用 고마워요。'
  },
  {
    id: 'v-003',
    word: '죄송합니다',
    hanja: '罪悚합니다',
    pronunciation: 'joesonghamnida',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '对不起、非常抱歉（正式最高道歉语）',
    exampleKo: '약속 시간에 늦어서 정말 죄송합니다.',
    exampleZh: '约会时间迟到了，真的很抱歉。',
    tips: '对长辈和上司用 죄송합니다；朋友间口语可用 미안해요。'
  },
  {
    id: 'v-004',
    word: '사람',
    pronunciation: 'saram',
    pos: '名词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '人、人们',
    exampleKo: '한국에는 친절하고 따뜻한 사람이 참 많아요.',
    exampleZh: '韩国有很多亲切热情的人。',
    tips: '国籍表达：国家名 + 사람（例：중국 사람 中国人）。'
  },
  {
    id: 'v-005',
    word: '학교',
    hanja: '學校',
    pronunciation: 'hakgyo',
    pos: '名词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '学校',
    exampleKo: '저는 매일 아침 8시 반에 학교에 갑니다.',
    exampleZh: '我每天早晨 8 点半去学校。',
    tips: '搭配动词：학교에 다니다（上学）、학교를 졸업하다（毕业）。'
  },
  {
    id: 'v-006',
    word: '공부하다',
    hanja: '工夫하다',
    pronunciation: 'gongbuhada',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '学习、用功',
    exampleKo: '도서관에서 친구와 함께 한국어를 열심히 공부해요.',
    exampleZh: '在图书馆和朋友一起刻苦学习韩语。',
    tips: '源自汉字“工夫”，即下功夫学习。'
  },
  {
    id: 'v-007',
    word: '먹다',
    pronunciation: 'meokda',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '吃、喝、服药',
    exampleKo: '점심으로 매콤하고 맛있는 비빔밥을 먹었어요.',
    exampleZh: '午饭吃了微辣美味的拌饭。',
    tips: '敬语词汇为 드시다 / 잡수시다。'
  },
  {
    id: 'v-008',
    word: '가다',
    pronunciation: 'gada',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '去、前往',
    exampleKo: '주말에 명동으로 쇼핑하러 갈 거예요.',
    exampleZh: '周末打算去明洞购物。',
    tips: '反义词：오다（来）。目的地助词用 에（例：집에 가다 回家）。'
  },
  {
    id: 'v-009',
    word: '보다',
    pronunciation: 'boda',
    pos: '动词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '看、观看、参加考试',
    exampleKo: '주말에 넷플릭스로 인기 한국 드라마를 봤어요.',
    exampleZh: '周末在网飞上看了热门韩剧。',
    tips: '“参加考试”在韩文里也是 시험을 보다。'
  },
  {
    id: 'v-010',
    word: '친구',
    hanja: '親舊',
    pronunciation: 'chingu',
    pos: '名词',
    level: 'TOPIK 1',
    category: 'TOPIK 1 (初级入门)',
    meaning: '朋友（同龄人）',
    exampleKo: '오랜만에 고향 친구를 만나서 즐거운 시간을 보냈다.',
    exampleZh: '久违地见到了老家朋友，度过了愉快的时光。',
    tips: '在韩国严格意义上 친구 仅指同龄朋友，年长者叫 선배/형/누나/오빠/언니。'
  },

  // ==========================================
  // --- 2. TOPIK 2 (初级进阶 2级) ---
  // ==========================================
  {
    id: 'v-011',
    word: '준비하다',
    hanja: '準備하다',
    pronunciation: 'junbihada',
    pos: '动词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '准备、筹备',
    exampleKo: '다음 주에 있을 토픽 시험을 철저히 준비하고 있습니다.',
    exampleZh: '正在彻底准备下周将要举行的 TOPIK 考试。',
    tips: '搭配：시험을 준비하다（备考）、이사를 준비하다（准备搬家）。'
  },
  {
    id: 'v-012',
    word: '약속',
    hanja: '約束',
    pronunciation: 'yaksok',
    pos: '名词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '约定、聚会、约会',
    exampleKo: '이번 주 금요일 저녁에 친구와 식사 약속이 있어요.',
    exampleZh: '这周五晚上和朋友有聚餐约定。',
    tips: '搭配：약속을 지키다（守约）、약속을 어기다（违约/失约）。'
  },
  {
    id: 'v-013',
    word: '취미',
    hanja: '趣味',
    pronunciation: 'chwimi',
    pos: '名词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '爱好、兴趣',
    exampleKo: '제 취미는 주말마다 한강에서 자전거를 타는 것입니다.',
    exampleZh: '我的爱好是每个周末在汉江边骑自行车。',
    tips: 'TOPIK I 听力第一大题个人信息介绍高频考点。'
  },
  {
    id: 'v-014',
    word: '건강',
    hanja: '健康',
    pronunciation: 'geongang',
    pos: '名词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '健康',
    exampleKo: '규칙적인 운동과 균형 잡힌 식사는 건강에 매우 좋다.',
    exampleZh: '规律的运动与均衡的饮食对健康非常有益。',
    tips: '衍生词：건강하다（形容词：健康）。'
  },
  {
    id: 'v-015',
    word: '도착하다',
    hanja: '到着하다',
    pronunciation: 'dochakhada',
    pos: '动词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '到达、抵达',
    exampleKo: '비행기가 예정된 시간보다 10분 일찍 도착했습니다.',
    exampleZh: '飞机比预计时间提前10分钟到达了。',
    tips: '反义词：출발하다（出发）。'
  },
  {
    id: 'v-016',
    word: '이용하다',
    hanja: '利用하다',
    pronunciation: 'iyonghada',
    pos: '动词',
    level: 'TOPIK 2',
    category: 'TOPIK 2 (初级进阶)',
    meaning: '利用、使用（交通工具/设施）',
    exampleKo: '출퇴근 시간에는 버스보다 지하철을 이용하는 편이 빠르다.',
    exampleZh: '上下班高峰期比起公交车，坐地铁要更快。',
    tips: '常用于公共交通与服务设施（지하철을 이용하다）。'
  },

  // ==========================================
  // --- 3. TOPIK 3 (中级核心 3级) ---
  // ==========================================
  {
    id: 'v-017',
    word: '경험',
    hanja: '經驗',
    pronunciation: 'gyeongheom',
    pos: '名词',
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: '经验、阅历',
    exampleKo: '다양한 아르바이트 경험은 나중에 취업할 때 큰 도움이 된다.',
    exampleZh: '多样的兼职经验对日后就业有很大帮助。',
    tips: '搭配：경험을 쌓다（积累经验）。'
  },
  {
    id: 'v-018',
    word: '노력하다',
    hanja: '努力하다',
    pronunciation: 'noryeokhada',
    pos: '动词',
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: '努力、付出辛劳',
    exampleKo: '꿈을 이루기 위해 포기하지 않고 끊임없이 노력해야 한다.',
    exampleZh: '为了实现梦想，必须坚持不懈地努力。',
    tips: '搭配：노력을 기울이다（倾注努力）。'
  },
  {
    id: 'v-019',
    word: '성공',
    hanja: '成功',
    pronunciation: 'seonggong',
    pos: '名词',
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: '成功',
    exampleKo: '실패는 성공으로 가는 과정에서 겪는 소중한 밑거름이다.',
    exampleZh: '失败是走向成功过程中经历的宝贵养分。',
    tips: '反义词：실패（失败）。动词：성공하다。'
  },
  {
    id: 'v-020',
    word: '선택하다',
    hanja: '選擇하다',
    pronunciation: 'seontaekhada',
    pos: '动词',
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: '选择、挑拣、抉择',
    exampleKo: '인생의 중요한 갈림길에서 자신의 길을 신중히 선택했다.',
    exampleZh: '在人生的重要十字路口，审慎地选择了自己的道路。',
    tips: '名词：선택（选择）。'
  },
  {
    id: 'v-021',
    word: '환경',
    hanja: '環境',
    pronunciation: 'hwangyeong',
    pos: '名词',
    level: 'TOPIK 3',
    category: 'TOPIK 3 (中级核心)',
    meaning: '环境（自然环境/社会环境）',
    exampleKo: '미래 세대를 위해 환경 보호에 적극적으로 동참해야 합니다.',
    exampleZh: '为了子孙后代，必须积极参与环境保护。',
    tips: 'TOPIK 53/54 题社会与环保大作文核心词。'
  },

  // ==========================================
  // --- 4. TOPIK 4 (中级跃升 4级) ---
  // ==========================================
  {
    id: 'v-022',
    word: '원인',
    hanja: '原因',
    pronunciation: 'wonin',
    pos: '名词',
    level: 'TOPIK 4',
    category: 'TOPIK 4 (中级跃升)',
    meaning: '原因、根源',
    exampleKo: '전문가들은 이번 사건의 근본적인 원인을 면밀히 분석 중이다.',
    exampleZh: '专家们正在严密分析本次事件的根本原因。',
    tips: '反义词：결과（结果）。'
  },
  {
    id: 'v-023',
    word: '효과',
    hanja: '效果',
    pronunciation: 'hyogwa',
    pos: '名词',
    level: 'TOPIK 4',
    category: 'TOPIK 4 (中级跃升)',
    meaning: '效果、效用',
    exampleKo: '새로 도입된 정책이 물가 안정에 긍정적인 효과를 냈다.',
    exampleZh: '新引入的政策在稳定物价方面取得了积极效果。',
    tips: '搭配：효과가 나타나다（见效）、효과를 거두다（收获效果）。'
  },
  {
    id: 'v-024',
    word: '극복하다',
    hanja: '克服하다',
    pronunciation: 'geukbokhada',
    pos: '动词',
    level: 'TOPIK 4',
    category: 'TOPIK 4 (中级跃升)',
    meaning: '克服、战胜困难',
    exampleKo: '우리 국민은 단합된 힘으로 국가적 위기를 슬기롭게 극복했다.',
    exampleZh: '我国国民以团结的力量智慧地克服了国家危机。',
    tips: 'TOPIK 议论文论述意志品质极高频动词。'
  },
  {
    id: 'v-025',
    word: '발전하다',
    hanja: '發展하다',
    pronunciation: 'baljeonhada',
    pos: '动词',
    level: 'TOPIK 4',
    category: 'TOPIK 4 (中级跃升)',
    meaning: '发展、进步、跃升',
    exampleKo: '인공지능 기술은 눈부신 속도로 발전하며 세상을 바꾸고 있다.',
    exampleZh: '人工智能技术正以惊人的速度发展并改变着世界。',
    tips: '搭配：경제가 발전하다（经济发展）。'
  },

  // ==========================================
  // --- 5. TOPIK 5-6 (高级精通 5-6级) ---
  // ==========================================
  {
    id: 'v-026',
    word: '불가피하다',
    hanja: '不可避하다',
    pronunciation: 'bulgapihada',
    pos: '形容词',
    level: 'TOPIK 5',
    category: 'TOPIK 5-6 (高级精通)',
    meaning: '不可避免的、势在必行的',
    exampleKo: '저출산 고령화 심화로 인한 노동력 감소는 불가피한 현실이다.',
    exampleZh: '由于低生育率与老龄化加剧带来的劳动力减少是不可避免的现实。',
    tips: 'TOPIK 54 题社论高阶议论文高级修辞。'
  },
  {
    id: 'v-027',
    word: '창출하다',
    hanja: '創出하다',
    pronunciation: 'changchulhada',
    pos: '动词',
    level: 'TOPIK 6',
    category: 'TOPIK 5-6 (高级精通)',
    meaning: '创出、创造出（就业/经济价值）',
    exampleKo: '신성장 동력 산업을 집중 육성하여 청년 일자리를 대거 창출해야 한다.',
    exampleZh: '应集中培育新增长动力产业，大量创造青年就业岗位。',
    tips: '固定搭配：일자리를 창출하다（创造工作岗位）、가치를 창출하다。'
  },
  {
    id: 'v-028',
    word: '기여하다',
    hanja: '寄與하다',
    pronunciation: 'giyeohada',
    pos: '动词',
    level: 'TOPIK 5',
    category: 'TOPIK 5-6 (高级精通)',
    meaning: '贡献、出力',
    exampleKo: '그 과학자의 획기적인 발견은 인류 의학 발전에 크게 기여했다.',
    exampleZh: '那位科学家的划时代发现对人类医学的发展做出了巨大贡献。',
    tips: '搭配：~에 기여하다（为…做出贡献）。'
  },
  {
    id: 'v-029',
    word: '심각하다',
    hanja: '深刻하다',
    pronunciation: 'simgakhada',
    pos: '形容词',
    level: 'TOPIK 5',
    category: 'TOPIK 5-6 (高级精通)',
    meaning: '严峻的、严重的',
    exampleKo: '청년 실업 문제와 빈부격차는 매우 심각한 사회적 과제이다.',
    exampleZh: '青年失业问题与贫富差距是极其严重的社会课题。',
    tips: '同义词：중대하다（重大）。'
  },

  // ==========================================
  // --- 6. 日常起居与餐饮 (日常生活场景) ---
  // ==========================================
  {
    id: 'v-030',
    word: '배달',
    hanja: '配達',
    pronunciation: 'baedal',
    pos: '名词',
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: '外卖、外送、送货',
    exampleKo: '오늘 저녁에는 피곤해서 배달 앱으로 치킨을 시켜 먹었어요.',
    exampleZh: '今天晚上因为太累，就用外卖 App 点了炸鸡吃。',
    tips: '韩国拥有强大的外卖文化（배달의 민족）。搭配：배달을 시키다（叫外卖）。'
  },
  {
    id: 'v-031',
    word: '주문하다',
    hanja: '注文하다',
    pronunciation: 'jumunhada',
    pos: '动词',
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: '点单、点菜、订购',
    exampleKo: '사장님, 여기 아이스 아메리카노 두 잔 주문할게요.',
    exampleZh: '老板，这里点两杯冰美式。',
    tips: '在餐厅或咖啡厅点单必用。'
  },
  {
    id: 'v-032',
    word: '반찬',
    hanja: '飯饌',
    pronunciation: 'banchan',
    pos: '名词',
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: '小菜、下饭菜',
    exampleKo: '한국 식당에서는 김치와 나물 같은 기본 반찬이 무료로 리필된다.',
    exampleZh: '在韩国餐厅里，泡菜和凉拌菜等基本小菜都是免费续加的。',
    tips: '搭配：반찬 리필（续加小菜）。'
  },
  {
    id: 'v-033',
    word: '설거지',
    pronunciation: 'seolgeoji',
    pos: '名词',
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: '洗碗、洗餐具',
    exampleKo: '식사가 끝난 후에 동생과 역할을 나누어 설거지를 했다.',
    exampleZh: '吃完饭后我和弟弟分工洗了碗。',
    tips: '搭配：설거지를 하다（洗碗）。'
  },
  {
    id: 'v-034',
    word: '분리수거',
    hanja: '分離收去',
    pronunciation: 'bullisugeo',
    pos: '名词',
    level: '场景专题',
    category: '日常起居与餐饮',
    meaning: '垃圾分类回收',
    exampleKo: '한국에서는 플라스틱, 유리, 캔을 철저히 분리수거해야 합니다.',
    exampleZh: '在韩国必须对塑料、玻璃、易拉罐进行彻底的分类回收。',
    tips: '在韩生活必考常识！韩国垃圾分类制度非常严格。'
  },

  // ==========================================
  // --- 7. 韩国旅游与交通 ---
  // ==========================================
  {
    id: 'v-035',
    word: '환승',
    hanja: '換乘',
    pronunciation: 'hwanseung',
    pos: '名词',
    level: '场景专题',
    category: '韩国旅游与交通',
    meaning: '换乘、倒车',
    exampleKo: '지하철 2호선에서 4호선으로 환승하려면 동대문역사문화공원역에서 내리세요.',
    exampleZh: '若想从地铁2号线换乘到4号线，请在东大门历史文化公园站下车。',
    tips: '韩国交通卡享受“환승 할인（换乘优惠）”。'
  },
  {
    id: 'v-036',
    word: '교통카드',
    pronunciation: 'gyotongkadeu',
    pos: '名词',
    level: '场景专题',
    category: '韩国旅游与交通',
    meaning: '交通卡 (T-Money 等)',
    exampleKo: '편의점에서 교통카드를 구매하고 2만 원을 충전했어요.',
    exampleZh: '在便利店购买了交通卡并充值了2万韩元。',
    tips: '搭配：교통카드를 충전하다（给交通卡充值）。'
  },
  {
    id: 'v-037',
    word: '출구',
    hanja: '出口',
    pronunciation: 'chulgu',
    pos: '名词',
    level: '场景专题',
    category: '韩国旅游与交通',
    meaning: '出口（地铁站/商场）',
    exampleKo: '홍대입구역 9번 출구 앞에서 친구와 3시에 만나기로 했다.',
    exampleZh: '约好下午3点在弘大入口站9号出口前和朋友碰面。',
    tips: '反义词：입구（入口）。'
  },
  {
    id: 'v-038',
    word: '탑승구',
    hanja: '搭乘口',
    pronunciation: 'tapseunggu',
    pos: '名词',
    level: '场景专题',
    category: '韩国旅游与交通',
    meaning: '登机口、登船口',
    exampleKo: '인천공항 제1터미널 25번 탑승구로 30분 전까지 가셔야 합니다.',
    exampleZh: '您需要在30分钟前前往仁川机场第一航站楼25号登机口。',
    tips: '机场旅游极高频用词。'
  },

  // ==========================================
  // --- 8. 免税店与购物 ---
  // ==========================================
  {
    id: 'v-039',
    word: '면세점',
    hanja: '免稅店',
    pronunciation: 'myeonsejeom',
    pos: '名词',
    level: '场景专题',
    category: '免税店与购物',
    meaning: '免税店',
    exampleKo: '출국하기 전에 시내 면세점에 들러 한국 화장품을 샀어요.',
    exampleZh: '出国前顺道去了趟市内免税店买了韩国化妆品。',
    tips: '包括市内免税店与机场免税店。'
  },
  {
    id: 'v-040',
    word: '할인',
    hanja: '割引',
    pronunciation: 'harin',
    pos: '名词',
    level: '场景专题',
    category: '免税店与购物',
    meaning: '打折、优惠、折扣',
    exampleKo: '백화점 정기 세일 기간이라서 30% 할인을 받았습니다.',
    exampleZh: '因为是百货商场定期打折期，所以享受了七折优惠。',
    tips: '搭配：할인 행사（打折促销活动）、할인 쿠폰（优惠券）。'
  },
  {
    id: 'v-041',
    word: '환불',
    hanja: '拂戻/還拂',
    pronunciation: 'hwanbul',
    pos: '名词',
    level: '场景专题',
    category: '免税店与购物',
    meaning: '退款、退钱',
    exampleKo: '영수증과 결제 카드를 지참하시면 7일 이내에 환불이 가능합니다.',
    exampleZh: '若携带小票和支付银行卡，可在7天之内办理退款。',
    tips: '搭配：환불을 받다（获得退款）、교환하다（换货）。'
  },
  {
    id: 'v-042',
    word: '영수증',
    hanja: '領收證',
    pronunciation: 'yeongsujeung',
    pos: '名词',
    level: '场景专题',
    category: '免税店与购物',
    meaning: '小票、发票、收据',
    exampleKo: '결제 후 직원이 “영수증 버려드릴까요?”라고 물어보았다.',
    exampleZh: '结账后店员询问我：“需要帮您把小票扔掉吗？”',
    tips: '韩国结账时店员高频口语句。'
  },
  {
    id: 'v-043',
    word: '세금환급',
    hanja: '稅金還給',
    pronunciation: 'segeumhwangeup',
    pos: '名词',
    level: '场景专题',
    category: '免税店与购物',
    meaning: '退税 (Tax Refund)',
    exampleKo: '외국인 관광객은 공항 무인 키오스크에서 즉시 세금환급을 받을 수 있다.',
    exampleZh: '外国游客可以在机场自助机上即时办理退税。',
    tips: 'Tax Free / Tax Refund 韩国购物必备词汇。'
  },

  // ==========================================
  // --- 9. 韩企职场与求职 ---
  // ==========================================
  {
    id: 'v-044',
    word: '이력서',
    hanja: '履歷書',
    pronunciation: 'iryeokseo',
    pos: '名词',
    level: '场景专题',
    category: '韩企职场与求职',
    meaning: '个人简历、履历表',
    exampleKo: '하반기 공채에 지원하기 위해 이력서와 자기소개서를 꼼꼼히 작성했다.',
    exampleZh: '为了应聘下半年公开招聘，仔细认真地撰写了简历和自我介绍。',
    tips: '常搭配 자기소개서（自我介绍信）。'
  },
  {
    id: 'v-045',
    word: '면접',
    hanja: '面接',
    pronunciation: 'myeonjeop',
    pos: '名词',
    level: '场景专题',
    category: '韩企职场与求职',
    meaning: '面试',
    exampleKo: '최종 임원 면접을 앞두고 예상 질문에 대한 답변을 연습했다.',
    exampleZh: '在最终高管面试前，针对预测问题进行了模拟练习。',
    tips: '搭配：면접을 보다（参加面试）。'
  },
  {
    id: 'v-046',
    word: '출근 / 퇴근',
    hanja: '出勤 / 退勤',
    pronunciation: 'chulgeun / toegeun',
    pos: '名词',
    level: '场景专题',
    category: '韩企职场与求职',
    meaning: '上班 / 下班',
    exampleKo: '저희 회사는 오전 9시에 출근해서 오후 6시에 칼퇴근합니다.',
    exampleZh: '我们公司上午9点上班，下午6点准时准点下班。',
    tips: '“准时下班”口语叫 칼퇴근（如刀切般准时下班）。'
  },
  {
    id: 'v-047',
    word: '야근',
    hanja: '夜勤',
    pronunciation: 'yageun',
    pos: '名词',
    level: '场景专题',
    category: '韩企职场与求职',
    meaning: '加班、夜班',
    exampleKo: '프로젝트 마감일이 촉박해서 이번 주 내내 야근을 해야 했다.',
    exampleZh: '因为项目截止日期临近，这周整整加了一整周的班。',
    tips: '搭配：야근을 하다（加班）。'
  },

  // ==========================================
  // --- 10. K-Pop追星应援 ---
  // ==========================================
  {
    id: 'v-048',
    word: '최애',
    hanja: '最愛',
    pronunciation: 'choeae',
    pos: '名词',
    level: '场景专题',
    category: 'K-Pop追星应援',
    meaning: '本命、最爱成员 (Bias)',
    exampleKo: '우리 그룹에서 제 최애 멤버는 비주얼과 메인보컬을 맡고 있어요.',
    exampleZh: '在我们团里我的本命成员担当门面和主唱。',
    tips: '第二喜欢的叫 차애（次爱）。'
  },
  {
    id: 'v-049',
    word: '덕질',
    pronunciation: 'deokjil',
    pos: '名词',
    level: '场景专题',
    category: 'K-Pop追星应援',
    meaning: '追星、嗑爱豆、钻研狂热爱好',
    exampleKo: '힘든 유학 생활 속에서 아이돌 덕질은 제게 가장 큰 힐링이에요.',
    exampleZh: '在艰苦的留学生活中，追星是我最大的治愈良药。',
    tips: '动词为 덕질하다。源自“오타쿠/오덕후(御宅族)”。'
  },
  {
    id: 'v-050',
    word: '응원봉',
    hanja: '應援棒',
    pronunciation: 'eungwonbong',
    pos: '名词',
    level: '场景专题',
    category: 'K-Pop追星应援',
    meaning: '应援棒、手灯 (Lightstick)',
    exampleKo: '콘서트장에서 중앙 제어로 반짝이는 수만 개의 응원봉이 장관을 이루었다.',
    exampleZh: '在演唱会场馆内，中控闪烁的数万支手灯汇成了壮观的海洋。',
    tips: '各团手灯均有专属爱称（如阿米棒、爱丽棒等）。'
  },
  {
    id: 'v-051',
    word: '컴백',
    pronunciation: 'keombaek',
    pos: '名词',
    level: '场景专题',
    category: 'K-Pop追星应援',
    meaning: '回归、发新歌 (Comeback)',
    exampleKo: '좋아하는 가수가 1년 만에 정규 앨범으로 컴백한다는 소식을 들었다.',
    exampleZh: '听到了喜欢的歌手时隔1年携正规专辑回归的消息。',
    tips: '搭配：컴백 무대（回归舞台）。'
  },

  // ==========================================
  // --- 11. 韩剧高频口语 ---
  // ==========================================
  {
    id: 'v-052',
    word: '대박',
    pronunciation: 'daebak',
    pos: '感叹词',
    level: '场景专题',
    category: '韩剧高频口语',
    meaning: '绝了！太棒了！难以置信！',
    exampleKo: '와, 이번 시험에서 만점을 받았다니 완전 대박이다!',
    exampleZh: '哇，这次考试竟然拿了满分，真是太神了！',
    tips: '原意为“大财/大发”，现为韩流国民赞叹词。'
  },
  {
    id: 'v-053',
    word: '설레다',
    pronunciation: 'seolleda',
    pos: '动词',
    level: '场景专题',
    category: '韩剧高频口语',
    meaning: '心动、小鹿乱撞、激动忐忑',
    exampleKo: '첫 데이트를 앞두고 가슴이 콩닥콩닥 설레어서 잠이 안 왔다.',
    exampleZh: '在初次约会前心里小鹿乱撞兴奋得睡不着觉。',
    tips: '韩剧罗曼史最高频形容词/动词。'
  },
  {
    id: 'v-054',
    word: '어떡해',
    pronunciation: 'eotteokhae',
    pos: '感叹词',
    level: '场景专题',
    category: '韩剧高频口语',
    meaning: '怎么办呀、如何是好',
    exampleKo: '지갑을 지하철에 두고 내렸는데 어떡해?',
    exampleZh: '钱包落在地铁上了，可怎么办呀？',
    tips: '由 어떻게 해(如何做) 缩略而成。'
  },
  {
    id: 'v-055',
    word: '심쿵',
    pronunciation: 'simkung',
    pos: '名词',
    level: '场景专题',
    category: '韩剧高频口语',
    meaning: '瞬间心动、怦然心跳',
    exampleKo: '주인공이 다정하게 미소 짓는 순간 제대로 심쿵했어요.',
    exampleZh: '男主角温柔微笑的那一瞬间，彻底让我心动破防了。',
    tips: '심장이 쿵쾅쿵쾅거리다（心脏咚咚跳）的缩写。'
  },

  // ==========================================
  // --- 12. 四字成语与俗语 ---
  // ==========================================
  {
    id: 'v-056',
    word: '일석이조',
    hanja: '一石二鳥',
    pronunciation: 'ilseogijo',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '一石二鸟、一举两得',
    exampleKo: '자전거로 출퇴근하면 교통비도 아끼고 건강도 챙기니 일석이조다.',
    exampleZh: '骑自行车上下班既省了交通费又锻炼了身体，真是一举两得。',
    tips: 'TOPIK II 阅读第 21~22 题俗语成语极高频考题。'
  },
  {
    id: 'v-057',
    word: '작심삼일',
    hanja: '作心三日',
    pronunciation: 'jaksimsamil',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '三分钟热度、下决心只能维持三天',
    exampleKo: '새해 계획이 작심삼일로 끝나지 않도록 매일 실천해야 한다.',
    exampleZh: '为了不让新年计划沦为三分钟热度，每天都必须付诸实践。',
    tips: '讽刺没有毅力的人下决心不能持久。'
  },
  {
    id: 'v-058',
    word: '고진감래',
    hanja: '苦盡甘來',
    pronunciation: 'gojingamrae',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '苦尽甘来',
    exampleKo: '수년간의 피나는 노력 끝에 마침내 합격했으니 이야말로 고진감래다.',
    exampleZh: '在经历了数年辛酸刻苦的努力后终于合格，这正是苦尽甘来。',
    tips: '形容历经磨难后终于迎来美好结局。'
  },
  {
    id: 'v-059',
    word: '시작이 반이다',
    pronunciation: 'sijagi banida',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '良好的开端是成功的一半（万事开头难）',
    exampleKo: '망설이지 말고 도전하세요. 한국 속담에 시작이 반이라고 하잖아요.',
    exampleZh: '别犹豫了勇敢挑战吧，韩国俗语不是说“开始就是成功的一半”嘛。',
    tips: '鼓励他人踏出第一步的韩国国民俗语。'
  },
  {
    id: 'v-060',
    word: '누워서 떡 먹기',
    pronunciation: 'nuwoseo tteok meokgi',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '易如反掌、小菜一碟（躺着吃年糕）',
    exampleKo: '이 정도 기초 문제는 나한테 누워서 떡 먹기지.',
    exampleZh: '这种程度的基础题对我来说简直是小菜一碟。',
    tips: '同义成语：식은 죽 먹기（吃凉粥）。'
  },
  {
    id: 'v-061',
    word: '티끌 모아 태산',
    pronunciation: 'tikkeul moa taesan',
    pos: '名词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '积少成多、聚沙成塔（微尘聚成泰山）',
    exampleKo: '매일 단어 10개씩 외우는 것이 작아 보여도 티끌 모아 태산이 된다.',
    exampleZh: '每天背10个单词看似微不足道，但日积月累就能聚沙成塔。',
    tips: '用于强调日积月累持之以恒的重要性。'
  },
  {
    id: 'v-062',
    word: '발이 넓다',
    pronunciation: 'bari neolpda',
    pos: '形容词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '人脉广、交际广泛（脚宽）',
    exampleKo: '그 선배는 발이 넓어서 어느 분야든 아는 사람이 많다.',
    exampleZh: '那位学长人脉很广，无论在哪个行业都有认识的朋友。',
    tips: '韩语高频身体惯用语之一。'
  },
  {
    id: 'v-063',
    word: '귀가 얇다',
    pronunciation: 'gwiga yalpda',
    pos: '形容词',
    level: '场景专题',
    category: '四字成语与俗语',
    meaning: '耳朵软、容易轻信他人言辞（耳朵薄）',
    exampleKo: '귀가 얇아서 남의 말만 듣고 섣불리 투자했다가 손해를 봤다.',
    exampleZh: '因为耳朵太软轻信了别人的话草率投资，结果遭受了损失。',
    tips: '韩语高频身体惯用语之一。'
  }
];

const header = `export interface VocabItem {
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

export const KOREAN_VOCAB_DATA: VocabItem[] = `;

const finalCode = header + JSON.stringify(vocabData, null, 2) + ';\n';
const targetFile = path.resolve(__dirname, '../src/data/korean/vocab.ts');
fs.writeFileSync(targetFile, finalCode, 'utf8');
console.log('Successfully generated full vocab database! Total entries:', vocabData.length);
