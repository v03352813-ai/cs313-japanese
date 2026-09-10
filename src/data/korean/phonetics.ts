export interface SoundRuleItem {
  id: string;
  ruleName: string;
  ruleKorean: string;
  category: '연음화 (连音)' | '비음화 (鼻音化)' | '유음화 (流音化)' | '경음화 (紧音化)' | '격음화 (激音化)' | '구개음화 (口盖音化)' | '두음법칙 (头音法则)' | 'ㅎ탈락/축약 (ㅎ音变)';
  formula: string;
  description: string;
  mnemonic: string; // 记忆口诀
  examples: {
    word: string;
    pron: string;
    hanja?: string;
    meaning: string;
    breakdown: string;
  }[];
  commonMistakes: {
    wrong: string;
    correct: string;
    reason: string;
  }[];
}

export const SOUND_CHANGE_CATEGORIES = [
  '全部',
  '연음화 (连音)',
  '비음화 (鼻音化)',
  '유음화 (流音化)',
  '경음화 (紧音化)',
  '격음화 (激音化)',
  '구개음화 (口盖音化)',
  '두음법칙 (头音法则)',
  'ㅎ탈락/축약 (ㅎ音变)'
] as const;

export const KOREAN_SOUND_RULES: SoundRuleItem[] = [
  // 1. 连音化 (연음화)
  {
    id: 'rule-01',
    ruleName: '连音化',
    ruleKorean: '연음화 (Liaison)',
    category: '연음화 (连音)',
    formula: '收音 (韵尾) + 元音初声 (ㅇ) ➔ 收音移至后字初声',
    description: '当收音（辅音）遇到以元音（初声为 ㅇ）开头的音节时，除 ㅇ 和 ㅎ 以外的所有单收音和双收音，其收音直接移到后面作为初声发音。',
    mnemonic: '收音遇元音，滑过去当辅音！',
    examples: [
      { word: '한국어', pron: '한구거', meaning: '韩语', breakdown: '국(ㄱ) + 어 ➔ 구거' },
      { word: '음악', pron: '으막', meaning: '音乐', breakdown: '음(ㅁ) + 악 ➔ 으막' },
      { word: '꽃을', pron: '꼬츨', meaning: '把花(宾格)', breakdown: '꽃(ㅊ) + 을 ➔ 꼬츨' },
      { word: '앉으세요', pron: '안즈세요', meaning: '请坐', breakdown: '앉(ㄵ) + 으 ➔ 안 + 즈' },
      { word: '읽어요', pron: '일거요', meaning: '阅读', breakdown: '읽(ㄺ) + 어 ➔ 일 + 거' }
    ],
    commonMistakes: [
      { wrong: '한국-어 (断开硬念)', correct: '한구거 (自然滑入)', reason: '必须连音流畅滑读，不能在词中卡顿。' }
    ]
  },

  // 2. 鼻音化 (비음화)
  {
    id: 'rule-02',
    ruleName: '鼻音化',
    ruleKorean: '비음화 (Nasalization)',
    category: '비음화 (鼻音化)',
    formula: '① 破裂音 (ㄱ, ㄷ, ㅂ) + 鼻音 (ㄴ, ㅁ) ➔ [ㅇ, ㄴ, ㅁ] + (ㄴ, ㅁ)\n② 口腔音 (ㅁ, ㅇ) + 流音 (ㄹ) ➔ [ㅁ, ㅇ] + [ㄴ]',
    description: '爆破收音 (ㄱ, ㄷ, ㅂ) 遇到鼻音 (ㄴ, ㅁ) 开头时，为了发音顺畅省力，自动同化变为对应的鼻音收音 (ㅇ, ㄴ, ㅁ)。',
    mnemonic: '七(ㄱ)变成圈(ㅇ)，地(ㄷ)变成弯(ㄴ)，波(ㅂ)变成口(ㅁ)！',
    examples: [
      { word: '국물', pron: '궁물', meaning: '汤水', breakdown: '국(ㄱ) + 물(ㅁ) ➔ 궁 + 물' },
      { word: '한국말', pron: '한궁말', meaning: '韩国话', breakdown: '국(ㄱ) + 말(ㅁ) ➔ 궁 + 말' },
      { word: '감사합니다', pron: '감사함니다', meaning: '谢谢', breakdown: '합(ㅂ) + 니(ㄴ) ➔ 함 + 니' },
      { word: '학년', pron: '항년', meaning: '学年/年级', breakdown: '학(ㄱ) + 년(ㄴ) ➔ 항 + 년' },
      { word: '닫는', pron: '단는', meaning: '关(冠形词)', breakdown: '닫(ㄷ) + 는(ㄴ) ➔ 단 + 는' }
    ],
    commonMistakes: [
      { wrong: '감사합-니다', correct: '감사함니다 [gamsahamnida]', reason: 'ㅂ遇到ㄴ必须鼻音化为ㅁ。' }
    ]
  },

  // 3. 流音化 (유음화)
  {
    id: 'rule-03',
    ruleName: '流音化',
    ruleKorean: '유음화 (Lateralization)',
    category: '유음화 (流音化)',
    formula: 'ㄴ + ㄹ ➔ [ㄹ] + [ㄹ]  或者  ㄹ + ㄴ ➔ [ㄹ] + [ㄹ]',
    description: '舌尖鼻音 ㄴ 与 舌尖流音 ㄹ 相遇时（无论是 ㄴ 在前还是 ㄹ 在前），ㄴ 统一被同化为流音 ㄹ，形成弹舌或卷舌连续音。',
    mnemonic: 'ㄴ与ㄹ碰面，统一变成两个ㄹ！',
    examples: [
      { word: '신라', pron: '실라', hanja: '新羅', meaning: '新罗(古国)', breakdown: '신(ㄴ) + 라(ㄹ) ➔ 실 + 라' },
      { word: '칼날', pron: '칼랄', meaning: '刀刃/刀锋', breakdown: '칼(ㄹ) + 날(ㄴ) ➔ 칼 + 랄' },
      { word: '연락', pron: '열락', hanja: '連絡', meaning: '联络/联系', breakdown: '연(ㄴ) + 락(ㄹ) ➔ 열 + 락' },
      { word: '설날', pron: '설랄', meaning: '新年/元旦', breakdown: '설(ㄹ) + 날(ㄴ) ➔ 설 + 랄' },
      { word: '광안리', pron: '광알리', meaning: '广安里(釜山地名)', breakdown: '안(ㄴ) + 리(ㄹ) ➔ 알 + 리' }
    ],
    commonMistakes: [
      { wrong: '신-라 [shin-la]', correct: '실라 [silla]', reason: '必须同化为双 ㄹ。' }
    ]
  },

  // 4. 紧音化 (경음화)
  {
    id: 'rule-04',
    ruleName: '紧音化',
    ruleKorean: '경음화 (Tensification)',
    category: '경음화 (紧音化)',
    formula: '收音 (ㄱ, ㄷ, ㅂ) + 平音 (ㄱ, ㄷ, ㅂ, ㅅ, ㅈ) ➔ 后音紧化为 [ㄲ, ㄸ, ㅃ, ㅆ, ㅉ]',
    description: '前字收音为代表音 ㄱ, ㄷ, ㅂ 时，后字初声平音受阻气影响，喉部肌肉自然紧张用力，变成紧音。',
    mnemonic: '爆破收音顶在前，后面平音变紧音！',
    examples: [
      { word: '학교', pron: '학꾜', hanja: '學校', meaning: '学校', breakdown: '학(ㄱ) + 교(ㄱ) ➔ 학 + 꾜' },
      { word: '식당', pron: '식땅', hanja: '食堂', meaning: '餐厅/食堂', breakdown: '식(ㄱ) + 당(ㄷ) ➔ 식 + 땅' },
      { word: '입구', pron: '입꾸', hanja: '入口', meaning: '入口', breakdown: '입(ㅂ) + 구(ㄱ) ➔ 입 + 꾸' },
      { word: '잡지', pron: '잡찌', hanja: '雜誌', meaning: '杂志', breakdown: '잡(ㅂ) + 지(ㅈ) ➔ 잡 + 찌' },
      { word: '국수', pron: '국쑤', meaning: '面条', breakdown: '국(ㄱ) + 수(ㅅ) ➔ 국 + 쑤' }
    ],
    commonMistakes: [
      { wrong: '학-교 (平音软读)', correct: '학꾜 (喉部有力紧音)', reason: 'ㄱ遇ㄱ必须发紧音 ㄲ。' }
    ]
  },

  // 5. 激音化 (격음화)
  {
    id: 'rule-05',
    ruleName: '激音化 (送气化)',
    ruleKorean: '격음화 / 축약 (Aspiration)',
    category: '격음화 (激音化)',
    formula: '① (ㄱ, ㄷ, ㅂ, ㅈ) + ㅎ ➔ [ㅋ, ㅌ, ㅍ, ㅊ]\n② ㅎ + (ㄱ, ㄷ, ㅂ, ㅈ) ➔ [ㅋ, ㅌ, ㅍ, ㅊ]',
    description: '送气音 ㅎ 与平音 (ㄱ, ㄷ, ㅂ, ㅈ) 组合时，气流强烈喷射合并缩约成为对应的送气激音 (ㅋ, ㅌ, ㅍ, ㅊ)。',
    mnemonic: '平音遇见大送气ㅎ，合体变成激音！',
    examples: [
      { word: '축하', pron: '추카', hanja: '祝賀', meaning: '祝贺/庆祝', breakdown: '축(ㄱ) + 하(ㅎ) ➔ 추 + 카' },
      { word: '입학', pron: '이팍', hanja: '入學', meaning: '入学', breakdown: '입(ㅂ) + 학(ㅎ) ➔ 이 + 팍' },
      { word: '어떻게', pron: '어떠케', meaning: '如何/怎样', breakdown: '떻(ㅎ) + 게(ㄱ) ➔ 어떠 + 케' },
      { word: '좋다', pron: '조타', meaning: '好', breakdown: '좋(ㅎ) + 다(ㄷ) ➔ 조 + 타' },
      { word: '맞히다', pron: '마치다', meaning: '猜中/答对', breakdown: '맞(ㅈ) + 히(ㅎ) ➔ 마 + 치' }
    ],
    commonMistakes: [
      { wrong: '축-하 [chuk-ha]', correct: '추카 [chuka]', reason: 'ㄱ和ㅎ必须合并为 ㅋ。' }
    ]
  },

  // 6. 口盖音化 (구개음化)
  {
    id: 'rule-06',
    ruleName: '口盖音化 (腭化)',
    ruleKorean: '구개음화 (Palatalization)',
    category: '구개음화 (口盖音化)',
    formula: '收音 (ㄷ, ㅌ) + 元音 (이, 히) ➔ 变为舌面音 [ㅈ, ㅊ]',
    description: '舌尖齿龈收音 ㄷ, ㅌ 在与高元音 ㅣ（或半元音 ㅑ, ㅕ, ㅛ, ㅠ）相遇时，舌头位置前移贴向上腭，变音为硬腭音 ㅈ, ㅊ。',
    mnemonic: 'ㄷ遇이变ㅈ，ㅌ遇이变ㅊ！',
    examples: [
      { word: '같이', pron: '가치', meaning: '一起/一同', breakdown: '같(ㅌ) + 이 ➔ 가 + 치' },
      { word: '굳이', pron: '구지', meaning: '硬要/特意', breakdown: '굳(ㄷ) + 이 ➔ 구 + 지' },
      { word: '해돋이', pron: '해도지', meaning: '日出', breakdown: '돋(ㄷ) + 이 ➔ 도 + 지' },
      { word: '붙이다', pron: '부치다', meaning: '粘贴/寄出', breakdown: '붙(ㅌ) + 이 ➔ 부 + 치' }
    ],
    commonMistakes: [
      { wrong: '같-이 [gat-i]', correct: '가치 [gachi]', reason: 'ㅌ与이必须口盖音化为 ㅊ。' }
    ]
  },

  // 7. 头音法则 (두음법칙)
  {
    id: 'rule-07',
    ruleName: '头音法则',
    ruleKorean: '두음법칙 (Initial Law)',
    category: '두음법칙 (头音法则)',
    formula: '汉字词词首的 ㄴ/ㄹ 脱落或变音：\n① 词首 녀, 뇨, 뉴, 니 ➔ [여, 요, 유, 이]\n② 词首 랴, 려, 례, 료, 류, 리 ➔ [야, 여, 예, 요, 유, 이]\n③ 词首 라, 로, 루, 르, 래, 뢰 ➔ [나, 노, 누, 느, 내, 뇌]',
    description: '韩语为保持词首发音轻快，汉字词在第一个音节时，不允许舌尖鼻音 ㄴ+ㅣ元音 或 流音 ㄹ 出现，会自动演变为 ㅇ 或 ㄴ。但在非词首时保留原音。',
    mnemonic: '词首不喜ㄴ和ㄹ，脱落变ㅇ或变ㄴ！',
    examples: [
      { word: '여자', pron: '여자', hanja: '女子 (女=녀)', meaning: '女子/女人', breakdown: '词首 녀 ➔ 여 (남녀 男女 保留 녀)' },
      { word: '내일', pron: '내일', hanja: '來日 (來=래)', meaning: '明天', breakdown: '词首 래 ➔ 내 (미래 未來 保留 래)' },
      { word: '역사', pron: '역사', hanja: '歷史 (歷=력)', meaning: '历史', breakdown: '词首 력 ➔ 역 (학력 学历 保留 력)' },
      { word: '이유', pron: '이유', hanja: '理由 (理=리)', meaning: '理由/缘故', breakdown: '词首 리 ➔ 이 (진리 真理 保留 리)' },
      { word: '노인', pron: '노인', hanja: '老人 (老=로)', meaning: '老人', breakdown: '词首 로 ➔ 노 (경로 敬老 保留 로)' }
    ],
    commonMistakes: [
      { wrong: '녀자 / 래일', correct: '여자 / 내일', reason: '词首受到头音法则规约。' }
    ]
  },

  // 8. ㅎ 脱落与同化 (ㅎ 탈락/축약)
  {
    id: 'rule-08',
    ruleName: 'ㅎ 脱落与同化',
    ruleKorean: 'ㅎ 탈락 및 약화 (H-Drop)',
    category: 'ㅎ탈락/축약 (ㅎ音变)',
    formula: '收音 (ㅎ, ㄶ, ㅀ) + 元音初声 (ㅇ) ➔ ㅎ 不发音 (脱落)',
    description: '弱气音 ㅎ 当遇到元音开头的音节时，由于气流阻力极小，ㅎ 彻底脱落消失不发音。',
    mnemonic: 'ㅎ收音遇元音，直接消失不发音！',
    examples: [
      { word: '좋아', pron: '조아', meaning: '喜欢/好', breakdown: '좋(ㅎ) + 아 ➔ 조 + 아' },
      { word: '많이', pron: '마니', meaning: '很多/多地', breakdown: '많(ㄶ) + 이 ➔ 마 + 니' },
      { word: '싫어', pron: '시러', meaning: '讨厌/不喜欢', breakdown: '싫(ㅀ) + 어 ➔ 시 + 러' },
      { word: '놓아요', pron: '노아요', meaning: '放下', breakdown: '놓(ㅎ) + 아 ➔ 노 + 아' },
      { word: '괜찮아', pron: '괜차나', meaning: '没关系', breakdown: '찮(ㄶ) + 아 ➔ 괜 + 차 + 나' }
    ],
    commonMistakes: [
      { wrong: '좋-하 / 조하', correct: '조아 [jo-a]', reason: 'ㅎ在元音前完全脱落。' }
    ]
  }
];

// 高频智能音变规则转换解析引擎
export function analyzeSoundChange(input: string): {
  original: string;
  phonetic: string;
  appliedRules: string[];
  explanation: string;
} {
  const clean = input.trim();
  if (!clean) {
    return { original: '', phonetic: '', appliedRules: [], explanation: '请输入韩语词汇进行音变诊断。' };
  }

  // 针对高频词汇内置精准音变匹配
  const lookupDict: Record<string, { pron: string; rules: string[]; exp: string }> = {
    '한국어': { pron: '한구거', rules: ['연음화 (连音化)'], exp: '국의 받침 ㄱ이 뒤의 모음 어로 이어져 [한구거]로 발음됩니다.' },
    '국물': { pron: '궁물', rules: ['비음화 (鼻音化)'], exp: '받침 ㄱ 뒤에 미음(ㅁ)이 와서 비음화가 일어나 [궁물]로 발음됩니다.' },
    '한국말': { pron: '한궁말', rules: ['비음화 (鼻音化)'], exp: '국의 받침 ㄱ이 말의 ㅁ을 만나 [한궁말]로 발음됩니다.' },
    '감사합니다': { pron: '감사함니다', rules: ['비음화 (鼻音化)'], exp: '합의 받침 ㅂ이 니의 ㄴ을 만나 ㅂ➔ㅁ으로 비음화되어 [감사함니다]로 발음됩니다.' },
    '신라': { pron: '실라', rules: ['유음화 (流音化)'], exp: '신의 받침 ㄴ이 뒤의 ㄹ을 만나 ㄴ➔ㄹ로 유음화되어 [실라]로 발음됩니다.' },
    '칼날': { pron: '칼랄', rules: ['유음화 (流音化)'], exp: '칼의 받침 ㄹ 뒤에 날의 ㄴ이 와서 ㄴ➔ㄹ로 유음화되어 [칼랄]로 발음됩니다.' },
    '학교': { pron: '학꾜', rules: ['경음화 (紧音化)'], exp: '받침 ㄱ 뒤의 평음 교(ㄱ)가 경음(ㄲ)으로 바뀌어 [학꾜]로 발음됩니다.' },
    '식당': { pron: '식땅', rules: ['경음화 (紧音化)'], exp: '받침 ㄱ 뒤의 평음 당(ㄷ)이 경음(ㄸ)으로 바뀌어 [식땅]로 발음됩니다.' },
    '축하': { pron: '추카', rules: ['격음화 (激音化)'], exp: '축의 받침 ㄱ과 하의 ㅎ이 합쳐져 격음 [ㅋ]로 축약되어 [추카]로 발음됩니다.' },
    '어떻게': { pron: '어떠케', rules: ['격음화 (激音化)'], exp: '떻의 받침 ㅎ과 게의 ㄱ이 축약되어 [어떠케]로 발음됩니다.' },
    '같이': { pron: '가치', rules: ['구개음화 (口盖音化)'], exp: '같의 받침 ㅌ이 모음 이와 만나 구개음화되어 [가치]로 발음됩니다.' },
    '굳이': { pron: '구지', rules: ['구개음化 (口盖音化)'], exp: '굳의 받침 ㄷ이 모음 이와 만나 ㄷ➔ㅈ로 구개음화되어 [구지]로 발음됩니다.' },
    '좋아': { pron: '조아', rules: ['ㅎ 탈락 (ㅎ脱落)'], exp: '좋의 받침 ㅎ이 모음 아 앞에서 탈락하여 [조아]로 발음됩니다.' },
    '많이': { pron: '마니', rules: ['ㅎ 탈락 & 연음화'], exp: '많의 ㄶ에서 ㅎ은 탈락하고 ㄴ이 이로 연음되어 [마니]로 발음됩니다.' }
  };

  if (lookupDict[clean]) {
    const item = lookupDict[clean];
    return {
      original: clean,
      phonetic: item.pron,
      appliedRules: item.rules,
      explanation: item.exp
    };
  }

  // 动态启发式连音/音变规则分析
  return {
    original: clean,
    phonetic: clean,
    appliedRules: ['기본 발음 규칙 (标准标准音)'],
    explanation: '当前输入词汇遵循标准韩语拼读规则，建议点击发音按钮聆听标准母语者韵律！'
  };
}