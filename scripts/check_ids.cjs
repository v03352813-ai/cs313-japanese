const fs = require('fs');
const content = fs.readFileSync('src/data/korean/topikExams.ts', 'utf8');
const matches = content.match(/"id":\s*"([^"]+)"/g) || [];
console.log('Total "id": matches =', matches.length);
const ids = matches.map(m => m.match(/"id":\s*"([^"]+)"/)[1]);
console.log('First 10 IDs:', ids.slice(0, 10));
console.log('Last 10 IDs:', ids.slice(-10));