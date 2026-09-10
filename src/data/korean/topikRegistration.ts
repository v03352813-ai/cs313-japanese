export interface TopikSessionInfo {
  sessionNum: number;
  title: string;
  targetDateStr: string;
  examDate?: string;
  registerPeriod?: string;
  registerStartStr: string;
  registerEndStr: string;
  ticketPrintStr: string;
  scoreQueryStr: string;
  fee: string;
  status?: 'upcoming' | 'registering' | 'ended';
  countdownDays?: number;
  badge?: string;
  officialUrl: string;
  officialName: string;
}

export interface RegistrationStep {
  step: string;
  stepIndex?: number | string;
  title: string;
  timeframe: string;
  dateStr?: string;
  tips: string;
  desc?: string;
  iconType: 'user' | 'target' | 'credit-card' | 'printer' | 'calendar' | 'award';
  icon?: string;
  status?: 'upcoming' | 'registering' | 'finished' | 'active';
  tag?: string;
  details?: string[];
  warning?: string;
}

export interface SnatchTip {
  tag: string;
  title: string;
  desc: string;
  detail?: string;
  strategy?: string;
}

export interface PassCut {
  grade: string;
  level?: string;
  min: number;
  score?: string;
  desc: string;
  req?: string;
  targetAudience?: string;
  badgeColor?: string;
}

export interface ScoringRule {
  id: 'topik1' | 'topik2';
  level: string;
  name: string;
  totalScore: number;
  maxScore: number;
  sections: string;
  timing: string;
  passCuts: PassCut[];
  structure: {
    section: string;
    questions: string;
    score: number;
    duration: string;
  }[];
  tips: string[];
}

export interface TestCenterRegion {
  province: string;
  region?: string;
  cities?: string;
  spots?: string;
  centers: string[];
  features?: string;
}

export const TOPIK_REGISTRATION_DATA = {
  // 年度考期核心动态
  upcomingSession: {
    sessionNum: 99,
    title: '2026年下半年第 99 届 TOPIK 中国大陆地区考试',
    targetDateStr: '2026-10-18',
    examDate: '2026年10月18日 (周日)',
    registerPeriod: '2026年7月中旬开放注册与抢位',
    registerStartStr: '2026-07-15 14:00',
    registerEndStr: '2026-07-28 14:00',
    ticketPrintStr: '2026-10-12 14:00',
    scoreQueryStr: '2026-11-26 15:00',
    fee: 'TOPIK I: 400元 / TOPIK II: 400元',
    status: 'upcoming' as const,
    countdownDays: 38,
    badge: '官方下半年大考',
    officialUrl: 'https://topik.neea.edu.cn',
    officialName: '教育部教育考试院 TOPIK 报名官网'
  },

  // 6大关键报考全流程
  timelineSteps: [
    {
      step: '01',
      stepIndex: '01',
      title: '注册个人信息 & 上传电子证件照',
      timeframe: '报名开放前 3~7 天',
      dateStr: '报名开放前 3~7 天提前完成',
      tips: '提前在教育部教育考试院官网实名注册，备好白底标准电子证件照，切勿等到开放抢位当天注册。',
      desc: '提前在教育部教育考试院官网实名注册，备好白底标准电子证件照，切勿等到开放抢位当天注册。',
      iconType: 'user',
      icon: 'user',
      status: 'upcoming',
      tag: '提前准备',
      details: [
        '必须提前在教育考试院官网注册账号并实名认证',
        '照片规格：白底免冠证件彩照（3cm×4cm），JPG格式且文件小于100KB',
        '开考当天服务器访问拥堵，现场注册易因验证码延迟错失抢位黄金时间'
      ],
      warning: '姓名拼音及证件号码必须与身份证/护照 100% 一致！'
    },
    {
      step: '02',
      stepIndex: '02',
      title: '准点抢占考位 (第一阶段)',
      timeframe: '考前约 3 个月 14:00 准时开抢',
      dateStr: '通常在7月中旬 14:00 准时开放',
      tips: '北上广深及高校热门考点开放 30 秒内秒光！务必提前确定 1~2 个备选考场，不要犹豫。',
      desc: '北上广深及高校热门考点开放 30 秒内秒光！务必提前确定 1~2 个备选考场，不要犹豫。',
      iconType: 'target',
      icon: 'target',
      status: 'upcoming',
      tag: '秒杀核心',
      details: [
        '13:55 提前登录系统，保持会话活跃（避免登录超时掉线）',
        '14:00 准时刷新考点列表，快速勾选心仪考点并立即点击预定',
        '若首选考点满额，不要死磕，立刻切换到同城或周边高铁 1 小时直达备选考点'
      ],
      warning: '同一考生每届考试 TOPIK I 与 TOPIK II 各仅限预定一个考位。'
    },
    {
      step: '03',
      stepIndex: '03',
      title: '24小时内网上缴费锁定考位 (第二阶段)',
      timeframe: '预定考位后 24 小时内',
      dateStr: '预定成功后 24 小时倒计时内',
      tips: '考位锁定后须在 24 小时内完成在线支付（支持支付宝/网银），超时考位将自动释放回池。',
      desc: '考位锁定后须在 24 小时内完成在线支付（支持支付宝/网银），超时考位将自动释放回池。',
      iconType: 'credit-card',
      icon: 'credit-card',
      status: 'upcoming',
      tag: '支付锁位',
      details: [
        '考试费用：TOPIK I 报名费 400 元，TOPIK II 报名费 400 元',
        '支持支付宝、微信支付或各主流商业银行网银',
        '缴费成功后务必确认报名状态变更为【已缴费/报名成功】并截屏留存交易单号'
      ],
      warning: '超过 24 小时未缴费的预订考位会被系统强制自动取消并释放！'
    },
    {
      step: '04',
      stepIndex: '04',
      title: '打印准考证',
      timeframe: '考前 1 周开放打印',
      dateStr: '考前一周周一 14:00 至考试当天',
      tips: '登录官网自行黑白或彩色打印准考证，多打印 2 份备用，考试当天凭身份证+准考证入场。',
      desc: '登录官网自行黑白或彩色打印准考证，多打印 2 份备用，考试当天凭身份证+准考证入场。',
      iconType: 'printer',
      icon: 'printer',
      status: 'upcoming',
      tag: '准考凭证',
      details: [
        '黑白或彩色打印均可，保持条形码与照片清晰无涂改',
        '建议至少打印 2~3 份，一份随身携带、一份放包内备用',
        '仔细阅读准考证上的具体考场楼栋、教室编号及防疫入校须知'
      ],
      warning: '考生须携带与报名完全一致的有效二代居民身份证原件！'
    },
    {
      step: '05',
      stepIndex: '05',
      title: '全真大考日',
      timeframe: '周日上午 TOPIK I / 下午 TOPIK II',
      dateStr: '2026年10月18日 (周日) 全天',
      tips: 'TOPIK I 上午 09:20 截止入场，TOPIK II 下午 12:20 截止入场。考场发双头专用电脑阅卷笔。',
      desc: 'TOPIK I 上午 09:20 截止入场，TOPIK II 下午 12:20 截止入场。考场发双头专用电脑阅卷笔。',
      iconType: 'calendar',
      icon: 'calendar',
      status: 'upcoming',
      tag: '决胜时刻',
      details: [
        '初级 TOPIK I：上午 09:20 截止入场，09:40~11:20 考试 (听力40m+阅读60m，共100m)',
        '中高级 TOPIK II：下午 12:20 截止入场，第一部分 12:50~14:40 (听力60m+写作50m)，第二部分 15:10~16:20 (阅读70m)',
        '考场统一下发韩国原装专用双头笔（粗头涂卡、细头写作），自备修正带和有效证件即可'
      ],
      warning: '严禁携带手机、智能手表等电子通讯设备进入座位，迟到严禁入场！'
    },
    {
      step: '06',
      stepIndex: '06',
      title: '官方成绩与电子证书查询',
      timeframe: '考后约 5~6 周',
      dateStr: '考后约 5~6 周下午 15:00',
      tips: '教育部考试院及韩国官网同步开放查分，免费下载打印官方终身电子成绩单（可直接用于留学申校与日企韩企求职）。',
      desc: '教育部考试院及韩国官网同步开放查分，免费下载打印官方终身电子成绩单（可直接用于留学申校与日企韩企求职）。',
      iconType: 'award',
      icon: 'award',
      status: 'upcoming',
      tag: '官方证书',
      details: [
        'NEEA 官网与韩国官网 (topik.go.kr) 同步开放成绩查询',
        '官方电子成绩证明 (Certificate) 支持无限次免费彩色下载打印',
        '证书有效期限为 2 年（自成绩公布之日起计算），获全球名校与跨国企业官方认可'
      ],
      warning: '若需申请韩国大学本科/硕博奖学金，请留意各校材料提交截止时间！'
    }
  ] as RegistrationStep[],

  // 抢考位 4 大避坑黄金法则
  snatchTips: [
    {
      tag: '设备网速',
      title: '多端登录与网络延迟优化',
      desc: '建议使用电脑端 Chrome 或 Edge 极速模式，避开校园网高峰拥堵，优先使用电信/联通有线宽带或手机 5G 个人热点。',
      detail: '建议使用电脑端 Chrome 或 Edge 极速模式，避开校园网高峰拥堵，优先使用电信/联通有线宽带或手机 5G 个人热点。提前 10 分钟登录教育部考试院网站，每隔 2 分钟点击其他页面维持 Session 会话不过期。',
      strategy: '提前测试网速延迟，关闭多余后台应用与迅雷/BT下载工具。'
    },
    {
      tag: '备选梯队',
      title: '预设 A/B/C 三级考点梯队',
      desc: '热门考点（如北外、上外、川外、广外）极易 30 秒秒光，务必提前准备好同城二志愿或邻省高铁 1 小时内可达的备选考场。',
      detail: '热门考点（如北外、上外、川外、广外）极易 30 秒秒光，务必提前准备好同城二志愿或邻省高铁 1 小时内可达的备选考场。首选考位一出现已满，不要犹豫死磕，零点几秒内立即切换到第二志愿。',
      strategy: '提前列出周边城市考场清单（如南京-上海、广州-深圳、北京-天津），方便瞬时切换。'
    },
    {
      tag: '漏网捡漏',
      title: '紧盯 24h / 48h 捡漏黄金周期',
      desc: '大量考生在抢定考位后因未及时在 24 小时内网上缴费，系统会在开报后第 24 小时和第 48 小时整点批量释放被锁定的考位。',
      detail: '大量考生在抢定考位后因未及时在 24 小时内网上缴费，系统会在开报后第 24 小时和第 48 小时整点批量释放被锁定的考位。在开报次日与第三日的 14:00~15:00 守在电脑前多频次刷新，捡漏成功率超过 35%。',
      strategy: '捡漏时心态放平，准备好已登录账号和快速验证手段，随刷随点。'
    },
    {
      tag: '证件规范',
      title: '身份证有效期与信息核查',
      desc: '务必确认二代居民身份证在考试当天仍处于有效期内；未成年人或即将到期者须提前补办或申请临时身份证。',
      detail: '务必确认二代居民身份证在考试当天仍处于有效期内；未成年人或即将到期者须提前补办或申请临时身份证。注册时填写的姓名拼音大小写须与护照完全一致，以免后续韩国留学签发 COE 产生姓名不匹配纠纷。',
      strategy: '证件信息一旦缴费锁定不可擅自更改，提交前务必仔细检查每一个拼音字母。'
    }
  ] as SnatchTip[],

  // 评分标准与及格线红线 (同时支持数组与对象索引访问)
  scoringRules: [
    {
      id: 'topik1',
      level: 'TOPIK I (初级)',
      name: '初级能力认定 (1~2级)',
      totalScore: 200,
      maxScore: 200,
      sections: '听力 (100分) + 阅读 (100分)',
      timing: '考试总时长 100 分钟 (不含休息，合卷考试)',
      passCuts: [
        { 
          grade: '1级', 
          level: '1级', 
          min: 80, 
          score: '80分 ~ 139分', 
          desc: '达到 80 分即可获 1 级',
          req: '达到 80 分即可获 1 级证书',
          targetAudience: '具备基础自我介绍、日常问候、买东西、点餐等生存韩语沟通能力。',
          badgeColor: 'bg-blue-500'
        },
        { 
          grade: '2级', 
          level: '2级', 
          min: 140, 
          score: '140分 ~ 200分', 
          desc: '达到 140 分即可获 2 级',
          req: '达到 140 分即可获 2 级证书',
          targetAudience: '能在邮局、银行、交通等公共设施进行日常事务交流，掌握约 1500~2000 核心词汇。',
          badgeColor: 'bg-cyan-600'
        }
      ],
      structure: [
        { section: '听力 (듣기)', questions: '30 题', score: 100, duration: '40 分钟' },
        { section: '阅读 (읽기)', questions: '30 题', score: 100, duration: '60 分钟' }
      ],
      tips: [
        'TOPIK I 不设写作部分，全部为 4 选 1 单选题涂卡。',
        '没有单科及格线限制！只要听力+阅读总分达到 80 分即过 1 级，达到 140 分即过 2 级。'
      ]
    },
    {
      id: 'topik2',
      level: 'TOPIK II (中高级)',
      name: '中高级能力认定 (3~6级)',
      totalScore: 300,
      maxScore: 300,
      sections: '听力 (100分) + 写作 (100分) + 阅读 (100分)',
      timing: '第一部分 110 分钟 (听力+写作) / 第二部分 70 分钟 (阅读)',
      passCuts: [
        { 
          grade: '3级', 
          level: '3级', 
          min: 120, 
          score: '120分 ~ 149分', 
          desc: '达 120 分 (中级门槛，赴韩本科录取最低资格线)',
          req: '达 120 分 (赴韩本科录取门槛)',
          targetAudience: '日常生活无障碍，能利用韩语表达思想，韩国本科大学专业申请最低语言门槛。',
          badgeColor: 'bg-emerald-600'
        },
        { 
          grade: '4级', 
          level: '4级', 
          min: 150, 
          score: '150分 ~ 189分', 
          desc: '达 150 分 (赴韩研究生、名牌大学本科标准线)',
          req: '达 150 分 (名校本科与研究生申请线)',
          targetAudience: '能阅读韩国报刊，理解社会一般性议题，能够流利听懂并参与大学专业课程学习。',
          badgeColor: 'bg-amber-600'
        },
        { 
          grade: '5级', 
          level: '5级', 
          min: 190, 
          score: '190分 ~ 229分', 
          desc: '达 190 分 (高级高分，韩国名牌大学奖学金申请线)',
          req: '达 190 分 (名校奖学金与跨国韩企线)',
          targetAudience: '能在专业学术研究或特定职业领域中熟练自如运用韩语，大型跨国韩企核心优势。',
          badgeColor: 'bg-orange-600'
        },
        { 
          grade: '6级', 
          level: '6级', 
          min: 230, 
          score: '230分 ~ 300分', 
          desc: '达 230 分 (最高精通级，母语者水平与翻译水准)',
          req: '达 230 分 (最高精通级/母语水准)',
          targetAudience: '达到最高级精通级，无障碍从事高难度商务同声传译、高端学术研究、法律论辩。',
          badgeColor: 'bg-rose-600'
        }
      ],
      structure: [
        { section: '听力 (듣기)', questions: '50 题', score: 100, duration: '60 分钟' },
        { section: '写作 (쓰기)', questions: '4 题 (2填空+1小作文+1大作文)', score: 100, duration: '50 分钟' },
        { section: '阅读 (읽기)', questions: '50 题', score: 100, duration: '70 分钟' }
      ],
      tips: [
        '重要规则：TOPIK II 依然不设单科及格线！即使写作零分，只要总分满 120 同样获发 3 级证书。',
        '写作题构成：51~52 题为上下文短句填空（各10分）；53 题为200~300字图表说明文（30分）；54 题为600~700字社会议论文（50分）。'
      ]
    }
  ] as (ScoringRule[] & {
    topik1: PassCut[];
    topik2: PassCut[];
  }),

  // 全国核心考点分布速览
  keyRegions: [
    { 
      province: '北京', 
      region: '北京', 
      cities: '华北主考区', 
      spots: '北京外国语大学、北京语言大学、首都师范大学',
      centers: ['北京外国语大学', '北京语言大学', '首都师范大学'] 
    },
    { 
      province: '上海', 
      region: '上海', 
      cities: '华东主考区', 
      spots: '上海外国语大学、华东师范大学、上海师范大学',
      centers: ['上海外国语大学', '华东师范大学', '上海师范大学'] 
    },
    { 
      province: '广东', 
      region: '广东', 
      cities: '华南核心区', 
      spots: '广东外语外贸大学、深圳大学、中山大学',
      centers: ['广东外语外贸大学', '深圳大学', '中山大学'] 
    },
    { 
      province: '江苏/浙江', 
      region: '江苏 / 浙江', 
      cities: '江浙沪高校圈', 
      spots: '南京大学、浙江大学、苏州大学、浙江越秀外国语学院',
      centers: ['南京大学', '浙江大学', '苏州大学', '浙江越秀外国语学院'] 
    },
    { 
      province: '山东/辽宁', 
      region: '山东 / 辽宁', 
      cities: '环渤海对韩要地', 
      spots: '山东大学(威海)、青岛大学、中国海洋大学、大连外国语大学、辽宁师范大学',
      centers: ['山东大学(威海)', '青岛大学', '中国海洋大学', '大连外国语大学', '辽宁师范大学'] 
    },
    { 
      province: '四川/重庆/湖北', 
      region: '西南 / 华中', 
      cities: '成渝与两湖中心', 
      spots: '四川外国语大学、四川大学、武汉大学、华中师范大学',
      centers: ['四川外国语大学', '四川大学', '武汉大学', '华中师范大学'] 
    },
    { 
      province: '吉林/黑龙江', 
      region: '东北核心', 
      cities: '中韩人文高地', 
      spots: '延边大学、吉林大学、黑龙江大学、哈尔滨师范大学',
      centers: ['延边大学', '吉林大学', '黑龙江大学', '哈尔滨师范大学'] 
    },
    { 
      province: '陕西/河南/福建', 
      region: '中西部与海西', 
      cities: '枢纽考区', 
      spots: '西安外国语大学、郑州大学、厦门大学、福建师范大学',
      centers: ['西安外国语大学', '郑州大学', '厦门大学', '福建师范大学'] 
    }
  ] as TestCenterRegion[]
};

// 注入属性兼容性支持
(TOPIK_REGISTRATION_DATA.scoringRules as any).topik1 = TOPIK_REGISTRATION_DATA.scoringRules[0].passCuts;
(TOPIK_REGISTRATION_DATA.scoringRules as any).topik2 = TOPIK_REGISTRATION_DATA.scoringRules[1].passCuts;

