const fs = require('fs');
const path = require('path');

// Verify topikExams data
const examsPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/topikExams.ts');
const fileContent = fs.readFileSync(examsPath, 'utf8');

console.log('TopikExams file size:', fileContent.length);

// Count papers in file
const paperMatches = fileContent.match(/id:\s*['"`]([^'"`]+)['"`]/g);
console.log('Total papers defined in file:', paperMatches ? paperMatches.length : 0);
