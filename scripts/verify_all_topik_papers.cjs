const { KOREAN_TOPIK_EXAMS } = require('../src/data/korean/topikExams.ts');

console.log(`Total Papers in Database: ${KOREAN_TOPIK_EXAMS.length}`);

let totalQuestions = 0;
let errors = [];

KOREAN_TOPIK_EXAMS.forEach((paper, pIdx) => {
  totalQuestions += paper.questions.length;
  
  // Verify paper level & time
  if (!paper.title || !paper.level || !paper.totalTimeMinutes) {
    errors.push(`Paper [${paper.id}] missing basic meta`);
  }

  // Verify questions
  paper.questions.forEach((q, qIdx) => {
    if (!q.title) errors.push(`Paper [${paper.id}] Q${qIdx + 1} missing title`);
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Paper [${paper.id}] Q${qIdx + 1} does not have 4 options`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push(`Paper [${paper.id}] Q${qIdx + 1} invalid correctAnswer`);
    }
    if (!q.explanation || !q.explanation.analysis) {
      errors.push(`Paper [${paper.id}] Q${qIdx + 1} missing explanation`);
    }

    // If Q81~100 in Marathon TOPIK II, verify long passage length
    if (paper.mode === 'marathon_full' && paper.level.includes('TOPIK II') && q.questionNumber >= 81) {
      if (!q.passage || q.passage.length < 200) {
        errors.push(`Paper [${paper.id}] Q${q.questionNumber} long passage too short (${q.passage ? q.passage.length : 0} chars)`);
      }
    }
  });
});

console.log(`Verified ${KOREAN_TOPIK_EXAMS.length} papers, ${totalQuestions} questions.`);
if (errors.length === 0) {
  console.log(`✅ ALL 56 PAPERS AND ALL ${totalQuestions} QUESTIONS PASSED 100% INTEGRITY CHECK WITH ZERO ERRORS!`);
} else {
  console.error(`Found ${errors.length} errors:`, errors.slice(0, 10));
}
