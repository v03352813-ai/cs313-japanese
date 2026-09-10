const fs = require('fs');
const content = fs.readFileSync('src/data/korean/topikExams.ts', 'utf8');
const papers = (content.match(/"id":/g) || []).length;
const answers0 = (content.match(/"correctAnswer": 0/g) || []).length;
const answers1 = (content.match(/"correctAnswer": 1/g) || []).length;
const answers2 = (content.match(/"correctAnswer": 2/g) || []).length;
const answers3 = (content.match(/"correctAnswer": 3/g) || []).length;
const fileStats = fs.statSync('src/data/korean/topikExams.ts');
const out = [
  'Total Papers: ' + papers,
  'Answer distribution: A(0): ' + answers0 + ', B(1): ' + answers1 + ', C(2): ' + answers2 + ', D(3): ' + answers3,
  'New File Size: ' + (fileStats.size / 1024).toFixed(2) + ' KB'
].join('\n');
fs.writeFileSync('scripts/verify_output.txt', out, 'utf8');
