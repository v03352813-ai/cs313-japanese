const fs = require('fs');
const path = require('path');

const kdramaPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts');
const fileContent = fs.readFileSync(kdramaPath, 'utf8');

const sceneMatches = fileContent.match(/id:\s*['"`](kdrama-[^'"`]+)['"`]/g);
console.log('Total KDrama scenes:', sceneMatches ? sceneMatches.length : 0);
