const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/components/KDramaView.tsx', 'utf8');

// Check for unimported identifiers
console.log('Has K_DRAMA_SCENES in imports:', /import[\s\S]*?K_DRAMA_SCENES[\s\S]*?from/.test(content));
console.log('Has K_DRAMA_SCENES in code:', content.includes('K_DRAMA_SCENES'));
