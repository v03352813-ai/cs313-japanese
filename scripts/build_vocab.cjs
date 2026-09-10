const fs = require('fs');
const path = require('path');

const categories = [
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

const vocabList = [
  // --- 1. TOPIK 1 (初级入门) ---
  { id: 'v-001', word: '안녕하세요', pos: '感叹词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '你好、您好', pron: 'annyeonghaseyo', exampleKo: '선생님, 안녕하세요! 오늘 날씨가 참 좋네요.', exampleZh: '老师，您好！今天天气真好啊。', tips: '基础标准敬语问候。' },
  { id: 'v-002', word: '감사합니다', hanja: '感謝합니다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '非常感谢、谢谢', pron: 'gamsahamnida', exampleKo: '바쁘신 와중에도 도와주셔서 진심으로 감사합니다.', exampleZh: '在百忙之中给予帮助，由衷地感谢您。', tips: '最高格式体敬语。' },
  { id: 'v-003', word: '죄송합니다', hanja: '罪悚합니다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '对不起、非常抱歉', pron: 'joesonghamnida', exampleKo: '약속 시간에 늦어서 정말 죄송합니다.', exampleZh: '约会时间迟到了，真的很抱歉。', tips: '正式致歉用语。' },
  { id: 'v-004', word: '사람', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '人、人们', pron: 'saram', exampleKo: '한국에는 친절하고 따뜻한 사람이 참 많아요.', exampleZh: '韩国有很多亲切热情的人。', tips: '例：중국 사람 (中国人)。' },
  { id: 'v-005', word: '학교', hanja: '學校', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '学校', pron: 'hakgyo', exampleKo: '저는 매일 아침 8시 반에 학교에 갑니다.', exampleZh: '我每天早晨 8 点半去学校。', tips: '搭配：학교에 가다 (去上学)。' },
  { id: 'v-006', word: '공부하다', hanja: '工夫하다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '学习、用功', pron: 'gongbuhada', exampleKo: '도서관에서 친구와 함께 한국어를 열심히 공부해요.', exampleZh: '在图书馆和朋友一起刻苦学习韩语。', tips: '源自汉字“工夫”。' },
  { id: 'v-007', word: '먹다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '吃、喝', pron: 'meokda', exampleKo: '점심으로 매콤하고 맛있는 비빔밥을 먹었어요.', exampleZh: '午饭吃了微辣美味的拌饭。', tips: '敬语为 드시다 / 잡수시다。' },
  { id: 'v-008', word: '가다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '去、前往', pron: 'gada', exampleKo: '주말에 가족들과 함께 제주도로 여행을 가요.', exampleZh: '周末和家人们一起去济州岛旅行。', tips: '反义词为 오다 (来)。' },
  { id: 'v-009', word: '오다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '来、到来', pron: 'oda', exampleKo: '친구가 우리 집에 놀러 오기로 했어요.', exampleZh: '朋友说好来我家玩。', tips: '雨/雪落下也用 오다。' },
  { id: 'v-010', word: '보다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '看、见、视', pron: 'boda', exampleKo: '어제 영화관에서 재미있는 한국 영화를 봤어요.', exampleZh: '昨天在电影院看了一部有趣的韩国电影。', tips: '考试也用 시험을 보다。' },
  { id: 'v-011', word: '물', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '水', pron: 'mul', exampleKo: '목이 마르니까 시원한 물 한 잔만 주세요.', exampleZh: '口渴了，请给我一杯凉水。', tips: '凉水：시원한 물；热水：따뜻한 물。' },
  { id: 'v-012', word: '밥', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '米饭、饭菜', pron: 'bap', exampleKo: '한국 사람들은 아침에 꼭 밥을 챙겨 먹어요.', exampleZh: '韩国人早晨一定会按时吃饭。', tips: '敬语为 진지。' },
  { id: 'v-013', word: '친구', hanja: '親舊', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '朋友、同龄伙伴', pron: 'chingu', exampleKo: '오랜만에 고향 친구를 만나서 즐거운 시간을 보냈어요.', exampleZh: '久违地见到了老家朋友，度过了愉快的时光。', tips: '同龄人为朋友。' },
  { id: 'v-014', word: '선생님', hanja: '先生님', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '老师、先生', pron: 'seonsaengnim', exampleKo: '선생님께서 한국어 문법을 아주 쉽게 설명해 주셨어요.', exampleZh: '老师把韩语语法讲解得非常浅显易懂。', tips: '加 님 表示尊称。' },
  { id: 'v-015', word: '집', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '家、房子', pron: 'jip', exampleKo: '수업이 끝나면 바로 집으로 돌아갈 거예요.', exampleZh: '下课后我打算马上回家。', tips: '敬语为 댁 (宅)。' },
  { id: 'v-016', word: '책', hanja: '冊', pos: '名词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '书本、书籍', pron: 'chaek', exampleKo: '시간이 날 때마다 서점에서 다양한 책을 읽어요.', exampleZh: '每当有空的时候，我都会在书店读各种各样的书。', tips: '量词为 권 (本)。' },
  { id: 'v-017', word: '일하다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '工作、干活', pron: 'ilhada', exampleKo: '저는 평일에는 회사에서 열심히 일해요.', exampleZh: '我平时在公司认真工作。', tips: '名词形式为 일。' },
  { id: 'v-018', word: '사다', pos: '动词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '买、购买', pron: 'sada', exampleKo: '백화점에서 부모님께 드릴 선물을 샀어요.', exampleZh: '在百货商场买了送给父母的礼物。', tips: '反义词为 팔다 (卖)。' },
  { id: 'v-019', word: '크다', pos: '形容词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '大、高大', pron: 'keuda', exampleKo: '이 가방은 크기가 커서 물건이 많이 들어가요.', exampleZh: '这个包容量很大，能装很多东西。', tips: '反义词为 작다 (小)。' },
  { id: 'v-020', word: '작다', pos: '形容词', level: 'TOPIK 1', category: 'TOPIK 1 (初级入门)', meaning: '小、矮小', pron: 'jakda', exampleKo: '신발이 제 발에 좀 작아서 발가락이 아파요.', exampleZh: '鞋子对我脚来说有点小，脚趾头有点疼。', tips: '反义词为 크다。' },

  // --- 2. TOPIK 2 (初级进阶) ---
  { id: 'v-021', word: '약속', hanja: '約束', pos: '名词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '约定、约会', pron: 'yaksok', exampleKo: '오늘 저녁에 친구와 식사 약속이 있어요.', exampleZh: '今天傍晚和朋友有吃饭的约定。', tips: '搭配：약속을 지키다 (守约)。' },
  { id: 'v-022', word: '도착하다', hanja: '到着하다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '到达、抵达', pron: 'dochakhada', exampleKo: '기차가 정시에 서울역에 안전하게 도착했습니다.', exampleZh: '火车准时安全到达了首尔站。', tips: '反义词为 출발하다 (出发)。' },
  { id: 'v-023', word: '준비하다', hanja: '準備하다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '准备、筹备', pron: 'junbihada', exampleKo: '내일 있을 발표 시험을 위해 자료를 꼼꼼히 준비해요.', exampleZh: '为了明天的演讲考试，仔细准备材料。', tips: '考级高频常用词。' },
  { id: 'v-024', word: '이야기하다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '说话、交谈、聊天', pron: 'iyagihada', exampleKo: '카페에서 친구와 여러 가지 주제로 즐겁게 이야기했어요.', exampleZh: '在咖啡厅和朋友就各种话题愉快地交谈。', tips: '缩略口语形式为 얘기하다。' },
  { id: 'v-025', word: '기다리다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '等待、等候', pron: 'gidarida', exampleKo: '정류장에서 20분 동안 버스를 기다렸어요.', exampleZh: '在车站等了 20 分钟公交车。', tips: '常见：잠시만 기다려 주세요。' },
  { id: 'v-026', word: '전화하다', hanja: '電話하다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '打电话', pron: 'jeonhwahada', exampleKo: '집에 도착하자마자 어머니께 전화를 드렸어요.', exampleZh: '一到家就给母亲打了电话。', tips: '敬语为 전화를 드리다。' },
  { id: 'v-027', word: '시작하다', hanja: '始作하다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '开始、着手', pron: 'sijakhada', exampleKo: '새해를 맞이하여 새로운 운동을 시작하기로 결심했어요.', exampleZh: '迎接新年，下决心开始一项新的运动。', tips: '反义词为 끝나다 / 끝내다。' },
  { id: 'v-028', word: '끝나다', pos: '动词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '结束、完毕(自动词)', pron: 'kkeutnada', exampleKo: '오늘 수업은 오후 5시에 모두 끝납니다.', exampleZh: '今天的课程在下午 5 点全部结束。', tips: '他动词为 끝내다。' },
  { id: 'v-029', word: '복잡하다', hanja: '複雜하다', pos: '形容词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '复杂、拥挤', pron: 'bokjaphada', exampleKo: '출퇴근 시간의 지하철은 사람들로 매우 복잡해요.', exampleZh: '上下班高峰期的地铁挤满了人，非常拥挤。', tips: '可指交通拥挤或事情复杂。' },
  { id: 'v-030', word: '편리하다', hanja: '便利하다', pos: '形容词', level: 'TOPIK 2', category: 'TOPIK 2 (初级进阶)', meaning: '便利、方便', pron: 'pyeonrihada', exampleKo: '스마트폰 앱을 이용하면 결제가 아주 편리해요.', exampleZh: '使用手机 App 的话，支付非常便利。', tips: '反义词为 불편하다。' },

  // --- 3. TOPIK 3 (中级核心) ---
  { id: 'v-031', word: '경험', hanja: '經驗', pos: '名词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '经验、经历', pron: 'gyeongheom', exampleKo: '다양한 아르바이트 경험은 사회생활에 큰 도움이 된다.', exampleZh: '丰富的兼职经历对步入社会大有裨益。', tips: '搭配：경험을 쌓다 (积累经验)。' },
  { id: 'v-032', word: '성공하다', hanja: '成功하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '成功', pron: 'seonggonghada', exampleKo: '포기하지 않고 끝까지 도전하여 마침내 시험에 성공했다.', exampleZh: '坚持不放弃并挑战到底，终于在考试中取得成功。', tips: '反义词为 실패하다 (失败)。' },
  { id: 'v-033', word: '발생하다', hanja: '發生하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '发生、产生', pron: 'balsaenghada', exampleKo: '갑작스러운 정전 사고가 발생하여 도시 전체가 어두워졌다.', exampleZh: '突发停电事故，整个城市陷入一片黑暗。', tips: '常与 사고(事故)、문제(问题) 连用。' },
  { id: 'v-034', word: '조사하다', hanja: '調査하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '调查、探究', pron: 'josahada', exampleKo: '소비자들의 구매 성향을 파악하기 위해 설문 조사를 했다.', exampleZh: '为了掌握消费者的购买倾向进行了问卷调查。', tips: 'TOPIK 图表写作 53 题必考词。' },
  { id: 'v-035', word: '증가하다', hanja: '增加하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '增加、增长', pron: 'jeunggajada', exampleKo: '최근 1인 가구의 수가 전년 대비 크게 증가했다.', exampleZh: '最近单人家庭数量相比前一年大幅增加。', tips: '反义词为 감소하다 (减少)。' },
  { id: 'v-036', word: '감소하다', hanja: '減少하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '减少、降低', pron: 'gamsohada', exampleKo: '출산율 저하로 인해 학령인구가 점차 감소하고 있다.', exampleZh: '受生育率低下影响，学龄人口正逐渐减少。', tips: '同义词：줄어들다 (缩减)。' },
  { id: 'v-037', word: '중요성', hanja: '重要性', pos: '名词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '重要性', pron: 'jung-yoseong', exampleKo: '환경 보호의 중요성을 깨닫고 일회용품 사용을 줄여야 한다.', exampleZh: '必须认识到环境保护的重要性，减少一次性用品的使用。', tips: '搭配：중요성을 깨닫다。' },
  { id: 'v-038', word: '해결하다', hanja: '解決하다', pos: '动词', level: 'TOPIK 3', category: 'TOPIK 3 (中级核心)', meaning: '解决、化解', pron: 'haegyeolhada', exampleKo: '대화를 통해 서로의 오해와 갈등을 원만하게 해결했다.', exampleZh: '通过沟通圆满化解了彼此的误会与矛盾。', tips: '搭配：문제를 해결하다。' },

  // --- 4. TOPIK 4 (中级跃升) ---
  { id: 'v-039', word: '영향을 미치다', pos: '动词', level: 'TOPIK 4', category: 'TOPIK 4 (中级跃升)', meaning: '产生影响、施加影响', pron: 'yeonghyang-eul michida', exampleKo: '부모의 독서 습관은 자녀의 언어 발달에 긍정적인 영향을 미친다.', exampleZh: '父母的阅读习惯对子女的语言发展产生积极影响。', tips: 'TOPIK 写作与阅读超高频核心搭配。' },
  { id: 'v-040', word: '원인', hanja: '原因', pos: '名词', level: 'TOPIK 4', category: 'TOPIK 4 (中级跃升)', meaning: '原因、起因', pron: 'weonin', exampleKo: '전문가들은 이번 경제 위기의 근본적인 원인을 다각도로 분석했다.', exampleZh: '专家们从多角度剖析了本次经济危机的根本原因。', tips: '搭配：원인을 규명하다。' },
  { id: 'v-041', word: '바탕으로', pos: '副词', level: 'TOPIK 4', category: 'TOPIK 4 (中级跃升)', meaning: '以...为基础、基于', pron: 'batang-euro', exampleKo: '실제 역사적 사건을 바탕으로 제작된 감동적인 영화이다.', exampleZh: '这是一部以真实历史事件为基础制作的感人电影。', tips: '写作高级过渡句型必备词汇。' },
  { id: 'v-042', word: '극복하다', hanja: '克服하다', pos: '动词', level: 'TOPIK 4', category: 'TOPIK 4 (中级跃升)', meaning: '克服、战胜', pron: 'geukbokhada', exampleKo: '어려운 경제적 위기를 전 국민이 힘을 합쳐 슬기롭게 극복했다.', exampleZh: '全体国民齐心协力智慧地克服了艰难的经济危机。', tips: '搭配：고난을 극복하다。' },
  { id: 'v-043', word: '제공하다', hanja: '提供하다', pos: '动词', level: 'TOPIK 4', category: 'TOPIK 4 (中级跃升)', meaning: '提供、供给', pron: 'jegonghada', exampleKo: '정부는 청년 창업자들에게 다양한 금융 및 공간 지원을 제공한다.', exampleZh: '政府向青年创业者提供多元的金融与场地支持。', tips: '搭配：서비스를 제공하다。' },

  // --- 5. TOPIK 5-6 (高级精通) ---
  { id: 'v-044', word: '패러다임', pos: '名词', level: 'TOPIK 5', category: 'TOPIK 5-6 (高级精通)', meaning: '范式、体系模式 (Paradigm)', pron: 'paereodaim', exampleKo: '디지털 혁명은 산업 전반의 패러다임을 근본적으로 전환시켰다.', exampleZh: '数字革命从根本上转变了整个产业的范式体系。', tips: 'TOPIK 81~100 题社科长文高频词汇。' },
  { id: 'v-045', word: '지속 가능성', pos: '名词', level: 'TOPIK 5', category: 'TOPIK 5-6 (高级精通)', meaning: '可持续性 (Sustainability)', pron: 'jisok ganeungseong', exampleKo: '기업은 단기적 이윤 추구를 넘어 환경적 지속 가능성을 확보해야 한다.', exampleZh: '企业必须超越短期利益追求，确保环境维度的可持续性。', tips: 'ESG 与环保议题常考核心词汇。' },
  { id: 'v-046', word: '양극화', hanja: '兩極化', pos: '名词', level: 'TOPIK 6', category: 'TOPIK 5-6 (高级精通)', meaning: '两极分化、极化现象', pron: 'yanggeukhwa', exampleKo: '소득 격차와 교육 기회의 불평등으로 인한 사회적 양극화가 심각하다.', exampleZh: '因收入差距与教育机会不平等导致的社会两极分化极为严峻。', tips: '社会问题大作文常考论点词汇。' },
  { id: 'v-047', word: '외주화', hanja: '外注化', pos: '名词', level: 'TOPIK 6', category: 'TOPIK 5-6 (高级精通)', meaning: '外包、外部委托化', pron: 'oejuhwa', exampleKo: '위험의 외주화 현상은 비정규직 노동자들의 안전을 위협하는 요소이다.', exampleZh: '风险外包化现象是威胁非正式劳工安全的关键因素。', tips: '劳动保障学术议题必备词。' },
  { id: 'v-048', word: '인식의 지평', pos: '名词', level: 'TOPIK 6', category: 'TOPIK 5-6 (高级精通)', meaning: '认知视界、认识地平线', pron: 'insig-ui jipyeong', exampleKo: '철학적 사유와 인문학적 성찰은 인간 인식의 지평을 무한히 확장한다.', exampleZh: '哲学思辨与人文学省察将无限拓宽人类的认知视界。', tips: '哲学与美学学术大文压轴词汇。' },
  { id: 'v-049', word: '불가피하다', hanja: '不可避하다', pos: '形容词', level: 'TOPIK 5', category: 'TOPIK 5-6 (高级精通)', meaning: '不可避免的、势在必然的', pron: 'bulgapihada', exampleKo: '인구 고령화에 따른 복지 지출의 증가는 재정 부담 측면에서 불가피하다.', exampleZh: '人口老龄化带来的福利支出增加在财政负担层面是不可避免的。', tips: '高级论述文结论段高频形容词。' },

  // --- 6. 日常起居与餐饮 ---
  { id: 'v-050', word: '아메리카노', pos: '名词', level: '场景专题', category: '日常起居与餐饮', meaning: '美式咖啡', pron: 'amerikano', exampleKo: '얼죽아(얼어 죽어도 아이스 아메리카노)라는 말이 유행할 정도로 인기가 많아요.', exampleZh: '人气高到“冻死也要喝冰美式”这句话成为流行的程度。', tips: '搭配：아이스 아메리카노 (冰美式)。' },
  { id: 'v-051', word: '포장하다', hanja: '包裝하다', pos: '动词', level: '场景专题', category: '日常起居与餐饮', meaning: '打包、包装', pron: 'pojanghada', exampleKo: '매장에서 드시겠어요, 아니면 포장해 드릴까요?', exampleZh: '请问是在店内享用，还是帮您打包呢？', tips: '口语中常直接说 테이크아웃 (Takeout)。' },
  { id: 'v-052', word: '진동벨', pos: '名词', level: '场景专题', category: '日常起居与餐饮', meaning: '取餐呼叫器、振动铃', pron: 'jindongbel', exampleKo: '주문하신 음료가 준비되면 진동벨이 울립니다.', exampleZh: '您点的饮品备好后取餐振动铃会响。', tips: '韩国咖啡厅必备生活常识词汇。' },
  { id: 'v-053', word: '영수증', hanja: '領收證', pos: '名词', level: '场景专题', category: '日常起居与餐饮', meaning: '收据、发票', pron: 'yeongsujeung', exampleKo: '결제 후 영수증은 버려 주세요.', exampleZh: '结账后收据请帮我扔掉。', tips: '生活口语极高频词。' },

  // --- 7. 韩国旅游与交通 ---
  { id: 'v-054', word: '환승하다', hanja: '換乘하다', pos: '动词', level: '场景专题', category: '韩国旅游与交通', meaning: '换乘、倒车', pron: 'hwanseunghada', exampleKo: '신도림역에서 지하철 1호선으로 환승해야 해요.', exampleZh: '需要在新道林站换乘地铁 1 号线。', tips: '韩国公交地铁 30 分钟内可免费换乘。' },
  { id: 'v-055', word: '교통카드', pos: '名词', level: '场景专题', category: '韩国旅游与交通', meaning: '交通卡 (T-Money)', pron: 'gyotongkadeu', exampleKo: '편의점에서 교통카드를 2만 원 충전해 주세요.', exampleZh: '请在便利店帮我往交通卡充值 2 万韩元。', tips: '首尔出行必备 T-Money 卡。' },
  { id: 'v-056', word: '출구', hanja: '出口', pos: '名词', level: '场景专题', category: '韩国旅游与交通', meaning: '出口', pron: 'chulgu', exampleKo: '홍대입구역 9번 출구 앞에서 2시에 만나요.', exampleZh: '我们在弘大入口站 9 号出口前 2 点见面。', tips: '反义词为 입구 (入口)。' },

  // --- 8. 免税店与购物 ---
  { id: 'v-057', word: '텍스리펀', pos: '名词', level: '场景专题', category: '免税店与购物', meaning: '退税 (Tax Refund)', pron: 'tekseuripeon', exampleKo: '공항에서 출국하기 전에 즉시 텍스리펀을 받으실 수 있습니다.', exampleZh: '在机场出境前可以立即办理退税。', tips: '购物满额可享受即时或事后退税。' },
  { id: 'v-058', word: '할인 행사', hanja: '割引 行事', pos: '名词', level: '场景专题', category: '免税店与购物', meaning: '打折促销活动', pron: 'harin haengsa', exampleKo: '연말을 맞이하여 전 품목 30% 할인 행사를 진행 중입니다.', exampleZh: '正值年终，全场正开展 30% 的打折促销活动。', tips: '商场常见标语：세일 (Sale)。' },

  // --- 9. 韩企职场与求职 ---
  { id: 'v-059', word: '이력서', hanja: '履歷書', pos: '名词', level: '场景专题', category: '韩企职场与求职', meaning: '简历、履历表', pron: 'iryeokseo', exampleKo: '채용 공고를 확인한 후 온라인으로 이력서를 제출했다.', exampleZh: '确认招聘公告后在网上提交了简历。', tips: '求职信叫 자기소개서 (自介书)。' },
  { id: 'v-060', word: '야근하다', hanja: '夜勤하다', pos: '动词', level: '场景专题', category: '韩企职场与求职', meaning: '加班、上夜班', pron: 'yageunhada', exampleKo: '프로젝트 마감일이 임박해서 어제 팀원들과 늦게까지 야근했다.', exampleZh: '因为项目截止期临近，昨天和团队成员加班到了很晚。', tips: '加班补贴叫 야근수당。' },
  { id: 'v-061', word: '결재를 올리다', pos: '动词', level: '场景专题', category: '韩企职场与求职', meaning: '提请审批、报批', pron: 'gyeoljaereul ollida', exampleKo: '기안서를 작성하여 팀장님께 결재를 올렸습니다.', exampleZh: '撰写了方案书并向组长提报了审批。', tips: '韩企职场公文流转核心术语。' },

  // --- 10. K-Pop追星应援 ---
  { id: 'v-062', word: '최애', hanja: '最愛', pos: '名词', level: '场景专题', category: 'K-Pop追星应援', meaning: '最爱本命偶像 (Bias)', pron: 'choe-ae', exampleKo: '이번 컴백 앨범에서 내 최애 포카가 나왔어!', exampleZh: '这次回归专辑里开出了我本命的小卡！', tips: '第二喜欢叫 차애 (次爱)。' },
  { id: 'v-063', word: '응원봉', hanja: '應援棒', pos: '名词', level: '场景专题', category: 'K-Pop追星应援', meaning: '应援手灯、荧光棒', pron: 'eung-wonbong', exampleKo: '콘서트장에서 중앙 제어 응원봉을 흔들며 열정적으로 환호했다.', exampleZh: '在演唱会现场挥舞着中央场控应援棒热情欢呼。', tips: '各组合拥有独一无二设计的官方手灯。' },
  { id: 'v-064', word: '음원 역주행', pos: '名词', level: '场景专题', category: 'K-Pop追星应援', meaning: '音源逆袭、曲目走红', pron: 'eum-won yeokjuhaeng', exampleKo: 'SNS 입소문을 타고 발매 3개월 만에 음원 차트 역주행에 성공했다.', exampleZh: '乘着社交媒体口碑在发歌3个月后成功实现了音源榜单逆袭。', tips: '形容老歌凭借舞台或话题再度登顶。' },

  // --- 11. 韩剧高频口语 ---
  { id: 'v-065', word: '눈치', pos: '名词', level: '场景专题', category: '韩剧高频口语', meaning: '眼色、察言观色', pron: 'nunchi', exampleKo: '눈치가 빠른 사람은 대화의 미묘한 분위기를 즉시 알아차린다.', exampleZh: '有眼力见的人能立刻察觉出对话中微妙的气氛。', tips: '搭配：눈치를 보다 (看别人眼色)。' },
  { id: 'v-066', word: '썸타다', pos: '动词', level: '场景专题', category: '韩剧高频口语', meaning: '暧昧、处于暧昧期', pron: 'sseomtada', exampleKo: '두 사람은 사귀기 전인데 요즘 한창 썸타는 중이래.', exampleZh: '听说他俩还没正式交往，最近正处于暧昧期呢。', tips: '源自 English Something。' },
  { id: 'v-067', word: '답답하다', pos: '形容词', level: '场景专题', category: '韩剧高频口语', meaning: '憋闷、窝火、心塞', pron: 'dapdaphada', exampleKo: '하고 싶은 말을 제대로 못 해서 가슴이 너무 답답해요.', exampleZh: '想说的话没能好好说出来，心里特别憋屈窝火。', tips: '既可指空气不流通憋闷，也可指心里堵得慌。' },

  // --- 12. 四字成语与俗语 ---
  { id: 'v-068', word: '고진감래', hanja: '苦盡甘來', pos: '名词', level: '场景专题', category: '四字成语与俗语', meaning: '苦尽甘来', pron: 'gojingamrae', exampleKo: '수년간의 피나는 노력 끝에 마침내 합격했으니 이야말로 고진감래다.', exampleZh: '在经历了数年辛酸刻苦的努力后终于合格，这正是苦尽甘来。', tips: '形容历经磨难后迎来美好结局。' },
  { id: 'v-069', word: '시작이 반이다', pos: '名词', level: '场景专题', category: '四字成语与俗语', meaning: '良好的开端是成功的一半', pron: 'sijagi banida', exampleKo: '망설이지 말고 도전하세요. 한국 속담에 시작이 반이라고 하잖아요.', exampleZh: '别犹豫了勇敢挑战吧，韩国俗语说开始就是成功的一半。', tips: '鼓励踏出第一步的国民俗语。' },
  { id: 'v-070', word: '누워서 떡 먹기', pos: '名词', level: '场景专题', category: '四字成语与俗语', meaning: '易如反掌、小菜一碟', pron: 'nuwoseo tteok meokgi', exampleKo: '이 정도 기초 문제는 나한테 누워서 떡 먹기지.', exampleZh: '这种程度的基础题对我来说简直是小菜一碟。', tips: '同义成语：식은 죽 먹기 (吃凉粥)。' },
  { id: 'v-071', word: '티끌 모아 태산', pos: '名词', level: '场景专题', category: '四字成语与俗语', meaning: '积少成多、聚沙成塔', pron: 'tikkeul moa taesan', exampleKo: '매일 단어 10개씩 외우는 것이 작아 보여도 티끌 모아 태산이 된다.', exampleZh: '每天背10个单词看似微不足道，但日积月累就能聚沙成塔。', tips: '强调坚持不懈的俗语。' },
  { id: 'v-072', word: '발이 넓다', pos: '形容词', level: '场景专题', category: '四字成语与俗语', meaning: '人脉广、交际广泛', pron: 'bari neolpda', exampleKo: '그 선배는 발이 넓어서 어느 분야든 아는 사람이 많다.', exampleZh: '那位学长人脉很广，无论在哪个行业都有认识的朋友。', tips: '高频身体惯用语。' },
  { id: 'v-073', word: '귀가 얇다', pos: '形容词', level: '场景专题', category: '四字成语与俗语', meaning: '耳朵软、容易轻信他人言辞', pron: 'gwiga yalpda', exampleKo: '귀가 얇아서 남의 말만 듣고 섣불리 투자했다가 손해를 봤다.', exampleZh: '因为耳朵太软轻信了别人的话草率投资，结果遭受了损失。', tips: '高频身体惯用语。' }
];

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

export const KOREAN_VOCAB_DATA: VocabItem[] =  + JSON.stringify(vocabList, null, 2) + ;\n;

fs.writeFileSync('src/data/korean/vocab.ts', fileHeader, 'utf8');
console.log('Successfully written vocab.ts! Total words:', vocabList.length);
