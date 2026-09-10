/**
 * CS313 日语研习社 · JLPT 官方权威考试日程与考点全景指南
 * 覆盖：每年 7 月 & 12 月全球大考日程、教育部考试院报名抢位避坑指南、全国考点分布与 180 分制算分神器
 */

export interface JlptScheduleItem {
  id: string;
  name: string;                   // 如 "2026年 第1回 JLPT (7月大考)"
  examDate: string;               // 2026-07-05
  registrationStart: string;      // 2026-03-15
  registrationEnd: string;        // 2026-03-27
  resultsDate: string;            // 2026-08-20
  status: 'upcoming' | 'registering' | 'completed';
  isOfficial: boolean;
  notes: string;
}

export interface TestCenterRegion {
  region: string;
  isHot: boolean; // 是否属于秒光考区
  hotLevel: '超火爆秒光' | '较热门' | '考位充裕可捡漏';
  cities: string[];
  tips: string;
}

export const JLPT_EXAM_SCHEDULE: JlptScheduleItem[] = [
  {
    id: 'jlpt-2026-07',
    name: '2026年 第1回 日本语能力测试 (7月全球大考)',
    examDate: '2026-07-05',
    registrationStart: '2026-03-12',
    registrationEnd: '2026-03-25',
    resultsDate: '2026-08-20',
    status: 'upcoming',
    isOfficial: true,
    notes: '全国 31 省市统一开考，N1/N2 报名预计提前开通，请备好电子证件照。'
  },
  {
    id: 'jlpt-2026-12',
    name: '2026年 第2回 日本语能力测试 (12月全球大考)',
    examDate: '2026-12-06',
    registrationStart: '2026-08-20',
    registrationEnd: '2026-09-02',
    resultsDate: '2027-01-25',
    status: 'upcoming',
    isOfficial: true,
    notes: '秋季升学与赴日签证黄金场次，北上广考位极度紧俏。'
  },
  {
    id: 'jlpt-2027-07',
    name: '2027年 第1回 日本语能力测试 (7月大考)',
    examDate: '2027-07-04',
    registrationStart: '2027-03-15',
    registrationEnd: '2027-03-26',
    resultsDate: '2027-08-20',
    status: 'upcoming',
    isOfficial: true,
    notes: '2027 夏季统考预估日程。'
  }
];

export const JLPT_TEST_CENTERS: TestCenterRegion[] = [
  {
    region: '华东热区 (江浙沪)',
    isHot: true,
    hotLevel: '超火爆秒光',
    cities: ['上海 (上外、华东师大、同济)', '杭州 (浙大、浙江工大)', '南京 (南大、南师大)', '苏州 (苏大)', '宁波'],
    tips: 'N1/N2 开放报名后通常 3~5 分钟内考位抢空！建议首选有线千兆宽带+多设备登录，若没抢到可火速改报安徽或江西考点。'
  },
  {
    region: '华北热区 (京津冀)',
    isHot: true,
    hotLevel: '超火爆秒光',
    cities: ['北京 (北外、北二外、北大、清华、北语)', '天津 (天外、南开)', '石家庄 (河北师大)', '保定'],
    tips: '北京考位极度紧俏，系统常在第 1 分钟拥堵。务必提前 10 分钟登录教育部考试网并完成验证码预加载。'
  },
  {
    region: '华南大湾区 (粤港澳)',
    isHot: true,
    hotLevel: '超火爆秒光',
    cities: ['广州 (广外、中大、华工)', '深圳 (深大)', '珠海 (中大珠海校区)', '海口 (海南大学)'],
    tips: '广深两地大厂求职与赴日留学考生众多，建议提前绑定微信/支付宝快捷支付。'
  },
  {
    region: '华中/西南/西北/东北 (捡漏友好区)',
    isHot: false,
    hotLevel: '考位充裕可捡漏',
    cities: ['武汉 (武大、华科)', '成都 (川大、川外)', '重庆 (川外、重师大)', '西安 (西外、陕师大)', '沈阳', '大连 (大外)', '哈尔滨', '合肥', '南昌'],
    tips: '大连与武汉考场容量较大，如果沿海一线城市未抢到考位，周边高铁 1~2 小时城市是绝佳的跨城抢位备份方案！'
  }
];

export const JLPT_SCORING_CRITERIA = [
  {
    level: 'N1 高级',
    totalPass: 100,
    maxScore: 180,
    sections: [
      { name: '言语知识 (文字·词汇·文法)', passScore: 19, max: 60 },
      { name: '读解 (阅读)', passScore: 19, max: 60 },
      { name: '听解 (听力)', passScore: 19, max: 60 }
    ],
    summary: '总分达到 100 分以上，且三项单项得分均不低于 19 分方为合格（任一单项低于 19 分即视为不合格）。'
  },
  {
    level: 'N2 进阶',
    totalPass: 90,
    maxScore: 180,
    sections: [
      { name: '言语知识 (文字·词汇·文法)', passScore: 19, max: 60 },
      { name: '读解 (阅读)', passScore: 19, max: 60 },
      { name: '听解 (听力)', passScore: 19, max: 60 }
    ],
    summary: '日企求职与日本大学升学基准线！总分达到 90 分以上且单项各不低于 19 分即及格。'
  },
  {
    level: 'N3 中级',
    totalPass: 95,
    maxScore: 180,
    sections: [
      { name: '言语知识 (文字·词汇·文法)', passScore: 19, max: 60 },
      { name: '读解 (阅读)', passScore: 19, max: 60 },
      { name: '听解 (听力)', passScore: 19, max: 60 }
    ],
    summary: '日常交流与无障碍自由行门槛，总分达到 95 分以上且三项均达标。'
  },
  {
    level: 'N4/N5 初级',
    totalPass: 90,
    maxScore: 180,
    sections: [
      { name: '言语知识·读解 (合卷)', passScore: 38, max: 120 },
      { name: '听解', passScore: 19, max: 60 }
    ],
    summary: 'N4 需 90 分合格（言语知识+读解 ≥ 38 分，听解 ≥ 19 分）；N5 需 80 分合格。'
  }
];
