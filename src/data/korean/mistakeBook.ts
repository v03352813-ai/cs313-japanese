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

const STORAGE_KEY = 'cs313_topik_mistakes_v1';

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
    return Array.isArray(parsed) ? parsed : [];
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
  
  // 如果已存在则更新用户最新作答
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

// 初始高频错题精选题库预置
function getInitialMockMistakes(): MistakeRecord[] {
  return [
    {
      id: 'm-demo-92002',
      paperId: 'marathon-topik2-92th',
      paperTitle: '第 92 届 TOPIK II 官方 100 题全真马拉松考场',
      questionId: 92002,
      questionNumber: 2,
      questionType: '词汇语法',
      categoryTag: '词汇语法 (高阶对比)',
      title: '【易混淆助词】(   )에 들어갈 알맞은 것을 고르십시오.',
      passage: '성공은 타고난 재능(    ) 피나는 노력의 결과물이다.',
      options: ['뿐만 아니라', '치고는', '이라기보다는', '조차도'],
      correctAnswer: 2,
      userAnswer: 0,
      analysis: '前后句构成“与其说是...倒不如说是...”，必须使用 -이라기보다는，选第3项。学员易误选뿐만 아니라。',
      vocabList: [{ word: '재능', meaning: '才能/天赋' }, { word: '피나는 노력', meaning: '辛酸刻苦的努力' }],
      translation: '成功与其说是与生俱来的天赋，倒不如说是刻苦努力的结晶。',
      addedAt: getTodayStr(),
      nextReviewDate: getTodayStr(),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    },
    {
      id: 'm-demo-92004',
      paperId: 'marathon-topik2-92th',
      paperTitle: '第 92 届 TOPIK II 官方 100 题全真马拉松考场',
      questionId: 92004,
      questionNumber: 4,
      questionType: '排序连贯',
      categoryTag: '逻辑排序 (总分论述)',
      title: '【逻辑排序】다음 문장들을 문맥에 맞게 바르게 배열한 것을 고르십시오.',
      passage: '(가) 또한 타인의 피드백을 수용함으로써 부족한 점을 보완할 수 있다.\n(나) 진정한 성장은 자신의 한계를 인정하는 것에서 출발한다.\n(다) 따라서 실패를 두려워하지 않는 개방적인 태도가 필수적이다.\n(라) 한계를 직시할 때 비로소 배움에 대한 겸허한 자세가 생긴다.',
      options: [
        '(가) - (다) - (나) - (라)',
        '(나) - (가) - (다) - (라)',
        '(라) - (나) - (가) - (다)',
        '(나) - (라) - (가) - (다)'
      ],
      correctAnswer: 3,
      userAnswer: 1,
      analysis: '(나)提出核心论点 ➔ (라)承接解释 ➔ (가)递进说明 ➔ (다)总结得出结论，正确顺序为 (나)-(라)-(가)-(다)，选第4项。',
      vocabList: [{ word: '직시하다', meaning: '正视、直面' }, { word: '겸허하다', meaning: '谦虚谨慎的' }],
      translation: '真正的成长始于直面局限并吸纳他人反馈。',
      addedAt: getTodayStr(),
      nextReviewDate: getTodayStr(),
      reviewIntervalDays: 1,
      reviewCount: 0,
      isMastered: false
    }
  ];
}