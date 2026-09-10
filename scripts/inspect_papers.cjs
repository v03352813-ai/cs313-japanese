const fs = require('fs');
const path = require('path');

const examsPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/topikExams.ts');
const fileContent = fs.readFileSync(examsPath, 'utf8');

// Parse JSON after KOREAN_TOPIK_EXAMS: TopikExamPaper[] = 
const jsonStart = fileContent.indexOf('export const KOREAN_TOPIK_EXAMS: TopikExamPaper[] = ');
if (jsonStart !== -1) {
  const jsonStr = fileContent.substring(jsonStart + 'export const KOREAN_TOPIK_EXAMS: TopikExamPaper[] = '.length).trim().replace(/;$/, '');
  const papers = JSON.parse(jsonStr);
  console.log('Successfully parsed papers! Total count:', papers.length);
  
  const modeCounts = {};
  papers.forEach((p, idx) => {
    modeCounts[p.mode] = (modeCounts[p.mode] || 0) + 1;
    if (!p.questions || p.questions.length === 0) {
      console.warn(`Warning: Paper ${p.id} (${p.title}) has 0 questions!`);
    }
  });
  console.log('Mode distribution:', modeCounts);
  console.log('First 5 paper IDs:', papers.slice(0, 5).map(p => ({ id: p.id, title: p.title, qCount: p.questions.length })));
}
