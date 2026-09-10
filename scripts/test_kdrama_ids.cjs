const fs = require('fs');
const path = require('path');

const kdramaPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts');
const fileContent = fs.readFileSync(kdramaPath, 'utf8');

const sceneIdMatches = fileContent.match(/id:\s*['"`](drama-[^'"`]+)['"`]/g);
console.log('Total drama scene IDs:', sceneIdMatches ? sceneIdMatches.length : 0);
if (sceneIdMatches) {
  console.log('Sample IDs:', sceneIdMatches.slice(0, 8));
}
