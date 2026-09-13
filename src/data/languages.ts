/**
 * CS313.CN 多语种复合平台架构底座规范
 * 统一抽象韩语、日语、俄语、西班牙语的考试体系、主题风格与模块配置
 */

export type LanguageCode = 'ko' | 'ja' | 'fr' | 'es' | 'ru';

export interface LanguageProfile {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  brandTitle: string;
  subdomain: string;
  routePath: string;
  themeColor: {
    primary: string;
    gradient: string;
    lightBg: string;
    badgeBg: string;
  };
  examSystem: {
    name: string;
    description: string;
    levels: string[];
  };
  features: {
    vocabCount: string;
    grammarCount: string;
    examCount: string;
    mediaTheme: string;
  };
  status: 'ONLINE' | 'UPCOMING';
}

export const CS313_LANGUAGES: Record<LanguageCode, LanguageProfile> = {
  ko: {
    code: 'ko',
    name: '韩语',
    nativeName: '한국어',
    flag: '🇰🇷',
    brandTitle: 'CS313 韩语研习社',
    subdomain: 'kr.cs313.cn',
    routePath: '/ko',
    themeColor: {
      primary: '#EA580C', // Orange-600
      gradient: 'from-orange-500 via-amber-500 to-orange-600',
      lightBg: 'bg-orange-50',
      badgeBg: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    examSystem: {
      name: 'TOPIK (韩国语能力考试)',
      description: '韩国国立国际教育院官方权威等级考试',
      levels: ['TOPIK I (初级 1-2级)', 'TOPIK II (中高级 3-6级)']
    },
    features: {
      vocabCount: '5,000+ 核心考纲与场景词',
      grammarCount: '350+ 体系化接续速查卡片',
      examCount: '历年真题库与交互答题卡',
      mediaTheme: '《请回答1988》《鬼怪》《黑暗荣耀》等热门剧集'
    },
    status: 'ONLINE'
  },
  ja: {
    code: 'ja',
    name: '日语',
    nativeName: '日本語',
    flag: '🇯🇵',
    brandTitle: 'CS313 日语研习社',
    subdomain: 'jp.cs313.cn',
    routePath: '/ja',
    themeColor: {
      primary: '#0284C7', // Sky-600
      gradient: 'from-sky-500 via-indigo-500 to-teal-500',
      lightBg: 'bg-sky-50',
      badgeBg: 'bg-sky-50 text-sky-600 border-sky-200'
    },
    examSystem: {
      name: 'JLPT (日本语能力测试)',
      description: '全球公认度最高的日语等级评定标准',
      levels: ['N5 (入门)', 'N4 (初级)', 'N3 (中级)', 'N2 (商务进阶)', 'N1 (高级精通)']
    },
    features: {
      vocabCount: '6,500+ JLPT 核心高频词',
      grammarCount: '420+ 经典句型与句尾接续',
      examCount: 'N1~N5 历届官方考期真题库（每年7月/12月考后持续同步扩充）',
      mediaTheme: '经典影视名台词 & 原声对白精听（每周持续扩充更新）'
    },
    status: 'ONLINE'
  },
  fr: {
    code: 'fr',
    name: '法语',
    nativeName: 'Français',
    flag: '🇫🇷',
    brandTitle: 'CS313 法语研习社',
    subdomain: 'fr.cs313.cn',
    routePath: '/fr',
    themeColor: {
      primary: '#80142A', // Royal Carmine Red
      gradient: 'from-rose-800 via-red-700 to-amber-600',
      lightBg: 'bg-rose-50',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    examSystem: {
      name: 'DELF / DALF & 考研二外',
      description: '法国教育部终身文凭 / 国内高校考研双轨备考',
      levels: ['DELF A1-A2 (基础突破)', 'DELF B1-B2 (中高级独立)', 'DALF C1-C2 (精通)', '全国高校考研二外法语 241/242/243']
    },
    features: {
      vocabCount: '5,000+ 核心考纲词汇与阴阳性搭配',
      grammarCount: '直陈/虚拟/条件/命令全时态变位器',
      examCount: '全国考研二外与 DELF 全真模拟卷',
      mediaTheme: '经典原声电影台词精听与高频句型解析'
    },
    status: 'ONLINE'
  },
  es: {
    code: 'es',
    name: '西班牙语',
    nativeName: 'Español',
    flag: '🇪🇸',
    brandTitle: 'CS313 西语研习社',
    subdomain: 'es.cs313.cn',
    routePath: '/es',
    themeColor: {
      primary: '#EA580C', // Orange-600
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      lightBg: 'bg-orange-50',
      badgeBg: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    examSystem: {
      name: 'DELE / SIELE (西班牙语官方考试)',
      description: '塞万提斯学院官方颁发终身语言文凭',
      levels: ['A1-A2 (基础)', 'B1-B2 (中级独立)', 'C1-C2 (高级精通)']
    },
    features: {
      vocabCount: '4,800+ 动词变位与高频词',
      grammarCount: '虚拟式与过去时态专题突破',
      examCount: 'DELE B1/B2 历年模拟真题',
      mediaTheme: '《纸钞屋》《毒枭》等经典西语原声'
    },
    status: 'UPCOMING'
  },
  ru: {
    code: 'ru',
    name: '俄语',
    nativeName: 'Русский язык',
    flag: '🇷🇺',
    brandTitle: 'CS313 俄语研习社',
    subdomain: 'ru.cs313.cn',
    routePath: '/ru',
    themeColor: {
      primary: '#4F46E5', // Indigo-600
      gradient: 'from-indigo-500 via-blue-600 to-purple-600',
      lightBg: 'bg-indigo-50',
      badgeBg: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    examSystem: {
      name: 'ТРКИ (俄罗斯国家对外俄语等级考试)',
      description: '俄罗斯联邦教育部权威等级认证',
      levels: ['ТРКИ-1 (初级)', 'ТРКИ-2 (中级)', 'ТРКИ-3 (高级)', 'ТРКИ-4 (精通)']
    },
    features: {
      vocabCount: '4,500+ 六格变格与定向动词表',
      grammarCount: '动词体貌与前缀接续全图解',
      examCount: 'ТРКИ 基础与一二级真题实训',
      mediaTheme: '经典名著原著选读与俄语金曲精听'
    },
    status: 'UPCOMING'
  }
};
