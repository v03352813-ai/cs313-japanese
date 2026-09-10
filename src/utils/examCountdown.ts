// JLPT 官方动态考期倒计时智能计算器
// 针对每年 7 月第 1 个周日与 12 月第 1 个周日全球大考
// 规则：
// 1. 考前 90 天内开始倒计时大考（如：距JLPT大考87天）
// 2. 考试当天：今日JLPT大考
// 3. 考试结束后 45 天内：考后待放榜
// 4. 其它阶段：动态倒计时距离下次报名开始时间（如：距下次报名40天）

export interface ExamCountdownStatus {
  phase: 'exam_countdown' | 'exam_day' | 'score_waiting' | 'next_register_countdown';
  badgeText: string;      // 导航栏徽章短文本: 如 "距12月大考87天"
  displayText: string;    // 完整展示文本: 如 "距2026年第2回JLPT大考仅剩 87 天"
  subText: string;        // 辅助说明: 如 "考前冲刺·抢位指南"
  buttonSubText: string;  // 按钮副标题: 如 "距大考87天" 或 "抢位攻略"
  days: number;
  sessionName: string;
  badgeClass: string;     // 徽章色彩样式
}

export function getJlptExamCountdown(customDate?: Date): ExamCountdownStatus {
  const now = customDate || new Date();
  
  // 核心考期配置：2026年第 2 回 JLPT (12月6日)
  const currentExamDate = new Date('2026-12-06T13:00:00');
  // 2027年第 1 回 JLPT 报名预计启动日期 (2027年3月15日)
  const nextRegisterDate = new Date('2027-03-15T14:00:00');

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysToExam = Math.ceil((currentExamDate.getTime() - now.getTime()) / msPerDay);

  if (daysToExam > 0 && daysToExam <= 90) {
    // 规则 1：考前 90 天内，倒计时大考天数
    return {
      phase: 'exam_countdown',
      badgeText: `距12月大考${daysToExam}天`,
      displayText: `距2026年第2回 JLPT 大考仅剩 ${daysToExam} 天`,
      subText: '考前冲刺·抢位指南',
      buttonSubText: `距大考${daysToExam}天`,
      days: daysToExam,
      sessionName: '第2回',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
    };
  } else if (daysToExam === 0) {
    // 规则 2：考试当天
    return {
      phase: 'exam_day',
      badgeText: '今日大考',
      displayText: '今日大考 · 沉着应战逢考必过',
      subText: 'JLPT 全球统考进行中',
      buttonSubText: '今日大考',
      days: 0,
      sessionName: '第2回',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
    };
  } else if (daysToExam < 0 && daysToExam >= -45) {
    // 规则 3：考试结束后的出分等待期
    return {
      phase: 'score_waiting',
      badgeText: '考后待放榜',
      displayText: '考试已圆满结束 · 官方成绩放榜中',
      subText: '考后约 6~7 周开放查分',
      buttonSubText: '考后待放榜',
      days: Math.abs(daysToExam),
      sessionName: '第2回',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
    };
  } else {
    // 规则 4：下次报名倒计时
    const daysToRegister = Math.max(1, Math.ceil((nextRegisterDate.getTime() - now.getTime()) / msPerDay));
    return {
      phase: 'next_register_countdown',
      badgeText: `距下次报名${daysToRegister}天`,
      displayText: `距2027年第1回报名还有 ${daysToRegister} 天`,
      subText: '提前备战抢考位',
      buttonSubText: `报名还剩${daysToRegister}天`,
      days: daysToRegister,
      sessionName: '2027第1回',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
    };
  }
}

// 保持向后兼容别名
export const getTopikExamCountdown = getJlptExamCountdown;
