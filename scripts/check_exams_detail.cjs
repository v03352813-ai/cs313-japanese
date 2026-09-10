const fs = require('fs');
const content = fs.readFileSync('src/data/korean/topikExams.ts', 'utf8');
const papers = content.match(/"title":\s*"[^"]+"/g) || [];
console.log('Exam Titles sample (First 5):', papers.slice(0, 5));
console.log('Exam Titles sample (Middle 5):', papers.slice(25, 30));
console.log('Exam Titles sample (Last 5):', papers.slice(-5));