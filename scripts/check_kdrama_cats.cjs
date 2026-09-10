const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts', 'utf8');
const cats = content.match(/category:\s*['"](.*?)['"]/g);
console.log('Categories found in kdrama.ts:', Array.from(new Set(cats)));
