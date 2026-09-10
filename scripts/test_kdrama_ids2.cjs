const fs = require('fs');
const path = require('path');

const kdramaPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts');
const fileContent = fs.readFileSync(kdramaPath, 'utf8');

const matches = [...fileContent.matchAll(/"id":\s*"(drama-[^"]+)"/g)].map(m => m[1]);
console.log('Total drama scenes:', matches.length);
console.log('Scene IDs:', matches);
