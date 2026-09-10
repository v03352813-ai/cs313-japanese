const fs = require('fs');

const { topikScenarios } = require('./test_topik_count.cjs');
const { dailyLifeScenarios } = require('./test_daily_count.cjs');
const { businessWorkScenarios } = require('./part_biz.cjs');
const { campusStudyScenarios } = require('./part_campus.cjs');
const { dramaRoleplayScenarios } = require('./part_drama.cjs');

// Mark weekly new items
const weeklyNewIds = ['kdrama_01', 'kdrama_02', 'topik_sp_05', 'daily_02', 'biz_01', 'campus_03'];

const allScenarios = [
  ...topikScenarios,
  ...dailyLifeScenarios,
  ...businessWorkScenarios,
  ...campusStudyScenarios,
  ...dramaRoleplayScenarios
].map(s => {
  if (weeklyNewIds.includes(s.id)) {
    return {
      ...s,
      isWeeklyNew: true,
      weeklyBatchTag: '🔥 8月第4周新推'
    };
  }
  return s;
});

console.log('=== All Scenarios with Weekly New Tags ===');
console.log('TOTAL COUNT        :', allScenarios.length);
console.log('Weekly New Count   :', allScenarios.filter(s => s.isWeeklyNew).length);

const fileOutput = `export interface DialogueTurn {
  id: number;
  speaker: 'ai' | 'user';
  speakerName: string;
  avatar: string;
  ko: string;
  zh: string;
  roman?: string;
  grammarTip?: string;
  suggestedResponses?: string[];
  honorificNotice?: string;
}

export interface AIScenario {
  id: string;
  title: string;
  koreanTitle: string;
  category: 'topik_speaking' | 'daily_life' | 'business_work' | 'campus_study' | 'drama_roleplay';
  categoryLabel: string;
  levelTag: '初级 (TOPIK 1-2)' | '中级 (TOPIK 3-4)' | '高级 (TOPIK 5-6)';
  icon: string;
  gradient: string;
  description: string;
  targetSkills: string[];
  systemPrompt: string;
  turns: DialogueTurn[];
  referenceModelAnswer: string;
  examDurationSec?: number;
  isWeeklyNew?: boolean;
  weeklyBatchTag?: string;
}

export const AI_SCENARIOS_DATA: AIScenario[] = ${JSON.stringify(allScenarios, null, 2)};
`;

fs.writeFileSync('d:/小语种学习/cs313-korean/src/data/korean/aiScenarios.ts', fileOutput, 'utf8');
console.log('src/data/korean/aiScenarios.ts updated with weekly tags!');
