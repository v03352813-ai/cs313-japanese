const fs = require('fs');
const path = require('path');

const p = path.resolve('d:/小语种学习/cs313-korean/src/components/GrammarView.tsx');
console.log('Exists:', fs.existsSync(p));
