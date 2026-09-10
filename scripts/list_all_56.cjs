const fs = require('fs');
const content = fs.readFileSync('src/data/korean/topikExams.ts', 'utf8');
const matches = content.match(/"id":\s*"([^"]+)"/g) || [];
const ids = matches.map(m => m.match(/"id":\s*"([^"]+)"/)[1]);
console.log('All 56 IDs:');
ids.forEach((id, i) => console.log(`${i+1}. ${id}`));