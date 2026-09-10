const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/components/AISpeakingView.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('suggestedResponses')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
