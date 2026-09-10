const fs = require('fs');
const vocabContent = fs.readFileSync('src/data/korean/vocab.ts', 'utf8');
const wordMatches = vocabContent.match(/"word":\s*"[^"]+"/g) || [];
console.log('Total words in vocab.ts =', wordMatches.length);

const examsContent = fs.readFileSync('src/data/korean/topikExams.ts', 'utf8');
const paperMatches = examsContent.match(/"id":\s*"[^"]+"/g) || [];
const questionMatches = examsContent.match(/"correctAnswer":\s*[0-3]/g) || [];
console.log('Total exam papers in topikExams.ts =', paperMatches.length);
console.log('Total exam questions in topikExams.ts =', questionMatches.length);