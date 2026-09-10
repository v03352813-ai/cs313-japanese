export interface MistakeRecord {
  id: string; // `m-${paperId}-${questionId}`
  paperId: string;
  paperTitle: string;
  questionId: number;
  questionNumber: number;
  questionType: string;
  categoryTag: string;
  title: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number;
  analysis: string;
  vocabList: { word: string; meaning: string }[];
  translation: string;
  addedAt: string; // YYYY-MM-DD
  nextReviewDate: string; // YYYY-MM-DD (Spaced repetition)
  reviewIntervalDays: number; // 1 -> 3 -> 7 -> 15
  reviewCount: number;
  isMastered: boolean;
}

const STORAGE_KEY = 'cs313_jlpt_mistakes_v1';

// 艾宾浩斯复习间隔天数梯度
const SPACED_INTERVALS = [1, 3, 7, 15, 30];

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// 1. 获取所有错题
export function getSavedMistakes(): MistakeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMockMistakes();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getInitialMockMistakes();
  } catch {
    return getInitialMockMistakes();
  }
}

// 2. 保存错题集
export function saveMistakes(list: MistakeRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save mistakes', e);
  }
}

// 3. 添加一道错题
export function addMistakeRecord(record: Omit<MistakeRecord, 'id' | 'addedAt' | 'nextReviewDate' | 'reviewIntervalDays' | 'reviewCount' | 'isMastered'>): void {
  const list = getSavedMistakes();
  const id = `m-${record.paperId}-${record.questionId}`;
  
  const existingIdx = list.findIndex(m => m.id === id);
  const today = getTodayStr();

  if (existingIdx >= 0) {
    list[existingIdx].userAnswer = record.userAnswer;
    list[existingIdx].nextReviewDate = addDays(today, 1);
    list[existingIdx].isMastered = false;
  } else {
    const newRecord: MistakeRecord = {
      ...record,
      id,
      addedAt: today,
      nextReviewDate: addDays(today, 1),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    };
    list.unshift(newRecord);
  }
  saveMistakes(list);
}

// 4. 记录错题复习结果 (正确 ➔ 推进艾宾浩斯天数；错误 ➔ 重置为第1天)
export function recordMistakeReview(id: string, isCorrect: boolean): void {
  const list = getSavedMistakes();
  const idx = list.findIndex(m => m.id === id);
  if (idx === -1) return;

  const today = getTodayStr();
  const item = list[idx];

  if (isCorrect) {
    item.reviewCount += 1;
    const currentIntervalIdx = SPACED_INTERVALS.indexOf(item.reviewIntervalDays);
    const nextInterval = currentIntervalIdx < SPACED_INTERVALS.length - 1 
      ? SPACED_INTERVALS[currentIntervalIdx + 1] 
      : 30;

    item.reviewIntervalDays = nextInterval;
    item.nextReviewDate = addDays(today, nextInterval);
    if (item.reviewCount >= 3) {
      item.isMastered = true;
    }
  } else {
    item.reviewIntervalDays = 1;
    item.nextReviewDate = addDays(today, 1);
    item.isMastered = false;
  }

  saveMistakes(list);
}

// 5. 移出错题本 / 彻底掌握
export function removeMistakeRecord(id: string): void {
  const list = getSavedMistakes();
  const updated = list.filter(m => m.id !== id);
  saveMistakes(updated);
}

// 初始高频错题精选题库预置 (JLPT N2/N1 易错精选)
function getInitialMockMistakes(): MistakeRecord[] {
  return [
    {
      id: 'm-jlpt-n2-2023-01',
      paperId: 'jlpt-n2-2023-12',
      paperTitle: 'JLPT N2 官方全真模考精选（2023年12月回）',
      questionId: 202301,
      questionNumber: 7,
      questionType: '文字词汇',
      categoryTag: '文字词汇 (汉字读音与近义)',
      title: '【下划线读音】次の言葉の読み方として最もよいものを一つ選びなさい。',
      passage: '彼はどんな困難にも<u>屈せず</u>、最後までやり抜いた。',
      options: ['くっせず', 'かがまず', 'おれず', 'たわまず'],
      correctAnswer: 0,
      userAnswer: 2,
      analysis: '「屈する」的正确音读读法为「くっする（くっせず）」，意为“屈服、屈从”。易与训读或形近词混淆，选项2「折れず」虽含义接近但并非该汉字读音。',
      vocabList: [{ word: '屈する（くっする）', meaning: '屈服、妥协' }, { word: 'やり抜く（やりぬく）', meaning: '坚持到底、完成' }],
      translation: '他不屈服于任何困难，坚持奋斗到了最后。',
      addedAt: getTodayStr(),
      nextReviewDate: getTodayStr(),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    },
    {
      id: 'm-jlpt-n2-2023-02',
      paperId: 'jlpt-n2-2023-12',
      paperTitle: 'JLPT N2 官方全真模考精选（2023年12月回）',
      questionId: 202302,
      questionNumber: 15,
      questionType: '文法接续',
      categoryTag: '文法接续 (敬语活用)',
      title: '【敬语判断】次の文の（　）に入れるのに最もよいものを一つ選びなさい。',
      passage: '社長、先ほどお届けした企画書のデータは、もう（　）でしょうか。',
      options: ['拝見されました', 'ご覧になりました', 'お目にかかりました', 'ご覧いただきました'],
      correctAnswer: 1,
      userAnswer: 0,
      analysis: '此处主体是“社长（长辈/上级）”，动作是看企画书，必须使用尊他语（尊敬语）。「ご覧になる」是「見る」的尊他语；选项1「拝見されました」将自谦语叠加受身形成二重敬语且误用给对方，属于高频敬语错题！',
      vocabList: [{ word: 'ご覧になる（ごらんになる）', meaning: '【尊他】看、阅览' }, { word: '拝見する（はいけんする）', meaning: '【自谦】拜读、看' }],
      translation: '社长，刚才给您发送的策划案数据，您已经过目了吗？',
      addedAt: getTodayStr(),
      nextReviewDate: getTodayStr(),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    },
    {
      id: 'm-jlpt-n2-2023-03',
      paperId: 'jlpt-n2-2023-12',
      paperTitle: 'JLPT N2 官方全真模考精选（2023年12月回）',
      questionId: 202303,
      questionNumber: 22,
      questionType: '文法排序',
      categoryTag: '文法接续 (星号连词排列)',
      title: '【星号排序】次の文の★に入る最もよいものを、１・２・３・４から一つ選びなさい。',
      passage: '健康を保つためには、十分な睡眠を＿＿ ＿★＿ ＿＿ ＿＿ことが大切だ。',
      options: ['1. とるに', '2. こした', '3. ことは', '4. ない'],
      correctAnswer: 1,
      userAnswer: 0,
      analysis: '考查 N2 经典固定句型「～にこしたことはない」（再好不过了、最好不过）。正确排列顺序为：とるに(1) ➔ こした(2) ➔ ことは(3) ➔ ない(4)，因此★所在位置为第2项「こした」。',
      vocabList: [{ word: '～にこしたことはない', meaning: '最好、再好不过' }, { word: '保つ（たもつ）', meaning: '维持、保持' }],
      translation: '为了保持健康，能保证充足的睡眠是再好不过的了。',
      addedAt: getTodayStr(),
      nextReviewDate: getTodayStr(),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    }
  ];
}
