const fs = require('fs');
const path = require('path');
const fileContent = fs.readFileSync('d:/小语种学习/cs313-korean/src/data/korean/topikExams.ts', 'utf8');
const jsonMatch = fileContent.match(/export const KOREAN_TOPIK_EXAMS: TopikExamPaper\[\] = (\[[\s\S]*?\]);\n/);
if (!jsonMatch) {
  console.error('Could not extract JSON');
  process.exit(1);
}
const papers = JSON.parse(jsonMatch[1]);
console.log('Total Papers in Database: ' + papers.length);

let totalQuestions = 0;
let errors = [];

papers.forEach((paper, pIdx) => {
  totalQuestions += paper.questions.length;
  
  if (!paper.title || !paper.level || !paper.totalTimeMinutes) {
    errors.push('Paper [' + paper.id + '] missing basic meta');
  }

  paper.questions.forEach((q, qIdx) => {
    if (!q.title) errors.push('Paper [' + paper.id + '] Q' + (qIdx + 1) + ' missing title');
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push('Paper [' + paper.id + '] Q' + (qIdx + 1) + ' does not have 4 options');
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push('Paper [' + paper.id + '] Q' + (qIdx + 1) + ' invalid correctAnswer');
    }
    if (!q.explanation || !q.explanation.analysis) {
      errors.push('Paper [' + paper.id + '] Q' + (qIdx + 1) + ' missing explanation');
    }

    if (paper.mode === 'marathon_full' && paper.level.includes('TOPIK II') && q.questionNumber >= 81) {
      if (!q.passage || q.passage.length < 200) {
        errors.push('Paper [' + paper.id + '] Q' + q.questionNumber + ' long passage too short (' + (q.passage ? q.passage.length : 0) + ' chars)');
      }
    }
  });
});

console.log('Verified ' + papers.length + ' papers, ' + totalQuestions + ' questions.');
if (errors.length === 0) {
  console.log('PASSED_100_PERCENT: ALL ' + papers.length + ' PAPERS AND ALL ' + totalQuestions + ' QUESTIONS ARE 100% VALID AND COMPLETE!');
} else {
  console.error('Found ' + errors.length + ' errors: ', errors.slice(0, 10));
}
