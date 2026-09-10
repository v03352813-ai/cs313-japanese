/**
 * CS313 日语研习社 · 云端热更新与每日晨读数据中枢
 * 支持：
 * 1. 每日晨读金句与打卡数据 (Daily Morning Reading & Streak)
 * 2. 错题本与生词收藏本地持久化 (Mistake Bank & Favorites)
 * 3. 持续更新日志 (Weekly Changelog Drops)
 */

export interface DailyQuote {
  date: string;          // "今日推荐"
  dayNumber: number;     // 第几天打卡
  jp: string;
  ko?: string;           // 兼容旧代码字段
  zh: string;
  roman: string;
  source: string;        // 出处，如《千与千寻》《灌篮高手》
  keyGrammar: string;
  audioText: string;
}

export interface ContentUpdateLog {
  id: string;
  date: string;
  version: string;
  tag: '真题上新' | '原声精听' | '考纲扩充' | '功能升级';
  title: string;
  description: string;
}

// 持续更新公告日志（展示给付费用户，提升终身会员价值感）
export const CONTENT_UPDATE_LOGS: ContentUpdateLog[] = [
  {
    id: 'up-001',
    date: '本周最新',
    version: 'v2.6',
    tag: '原声精听',
    title: '上新《葬送的芙莉莲》欣梅尔名台词精析与影子跟读',
    description: '新增辛梅尔与芙莉莲名场面台词精析，包含地道口语与常体接续拆解。'
  },
  {
    id: 'up-002',
    date: '本周最新',
    version: 'v2.5',
    tag: '真题上新',
    title: '更新 JLPT N1/N2 历年全真模考精编大卷',
    description: '新增言语知识高频词汇与排词题深度解析，支持交互答题与 180 分即时评定。'
  },
  {
    id: 'up-003',
    date: '2026-08',
    version: 'v2.4',
    tag: '考纲扩充',
    title: '扩充秋叶原、东京日常出行与日企商务礼仪场景词库',
    description: '新增 600+ 日本本土生活场景高频词，配备标准东京腔真人发音与例句。'
  },
  {
    id: 'up-004',
    date: '2026-08',
    version: 'v2.3',
    tag: '原声精听',
    title: '上新《非自然死亡》法医解剖室经典法医学名台词',
    description: '三澄美琴经典台词解析，攻克动词使役被动态与高频敬语表达。'
  },
  {
    id: 'up-005',
    date: '2026-08',
    version: 'v2.2',
    tag: '功能升级',
    title: '上线 10 大动词活用可视化变形器与五十音速查表',
    description: '一键掌握五段/一段/カ变/サ变动词 10 大活用变形公式与浊音/拗音规律。'
  }
];

// 每日晨读打卡精选库（每日自动轮换）
export const DAILY_QUOTES_POOL: DailyQuote[] = [
  {
    date: '今日推荐',
    dayNumber: 1,
    jp: '一度あったことは忘れないものさ、思い出せないだけで。',
    ko: '一度あったことは忘れないものさ、思い出せないだけで。',
    zh: '曾经发生过的事不可能忘记，只不过是想不起来罢了。',
    roman: 'Ichido atta koto wa wasurenai mono sa, omoidasenai dake de.',
    source: '《千与千寻》钱婆婆名台词',
    keyGrammar: '〜ものさ (本就是这样/事理) + 〜だけで (仅仅只是...)',
    audioText: '一度あったことは忘れないものさ、思い出せないだけで。'
  },
  {
    date: '打卡第 2 天',
    dayNumber: 2,
    jp: '諦めたらそこで試合終了ですよ。',
    ko: '諦めたらそこで試合終了ですよ。',
    zh: '如果现在放弃的话，比赛可就提前结束了哦。',
    roman: 'Akirametara soko de shiai shuuryou desu yo.',
    source: '《灌篮高手》安西教练名言',
    keyGrammar: '〜たら (假定条件: 如果...) + そこで (在那个节点)',
    audioText: '諦めたらそこで試合終了ですよ。'
  },
  {
    date: '打卡第 3 天',
    dayNumber: 3,
    jp: '絶望してる暇があったら、美味いものを食べて寝るかな。',
    ko: '絶望してる暇があったら、美味いものを食べて寝るかな。',
    zh: '有绝望的时间，还不如吃点美味的东西然后好好睡一觉呢。',
    roman: 'Zetsubou shiteru hima ga attara, umai mono o tabete neru ka na.',
    source: '《非自然死亡》三澄美琴名台词',
    keyGrammar: '〜暇があったら (如果有空暇的话) + 〜て (动作相继发生)',
    audioText: '絶望してる暇があったら、美味いものを食べて寝るかな。'
  },
  {
    date: '打卡第 4 天',
    dayNumber: 4,
    jp: '大事なのは、何を選んだかじゃなくて、選んだ後どう生きるかだ。',
    ko: '大事なのは、何を選んだかじゃなくて、選んだ後どう生きるかだ。',
    zh: '重要的不是选择了什么，而是做出选择之后如何活下去。',
    roman: 'Daiji na no wa, nani o eranda ka ja nakute, eranda ato dou ikiru ka da.',
    source: '经典影视励志名言 · 每日自律',
    keyGrammar: '大事なのは〜だ (重点提示) + 〜じゃなくて (不是...而是...) + 〜後 (之后)',
    audioText: '大事なのは、何を選んだかじゃなくて、選んだ後どう生きるかだ。'
  }
];

const STREAK_KEY = 'cs313_jp_study_streak_v1';
const FAVORITES_KEY = 'cs313_jp_favorite_vocabs_v1';

export function getStudyStreak(): { count: number; lastDate: string; isCheckedToday: boolean } {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(STREAK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        count: parsed.count || 1,
        lastDate: parsed.lastDate || today,
        isCheckedToday: parsed.lastDate === today
      };
    }
  } catch {}
  return { count: 1, lastDate: '', isCheckedToday: false };
}

export function checkInToday(): number {
  const today = new Date().toISOString().slice(0, 10);
  const current = getStudyStreak();
  let newCount = current.count;
  if (!current.isCheckedToday) {
    newCount = current.count + 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ count: newCount, lastDate: today }));
  }
  return newCount;
}

export function getFavoriteVocabs(): string[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteVocab(vocabId: string): string[] {
  const list = getFavoriteVocabs();
  const updated = list.includes(vocabId) ? list.filter(id => id !== vocabId) : [...list, vocabId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
