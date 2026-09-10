const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/components/AISpeakingView.tsx', 'utf8');
const lines = content.split('\n');
console.log('Total lines in AISpeakingView.tsx:', lines.length);

lines.forEach((l, i) => {
  if (l.includes('export const AISpeakingView')) {
    console.log(`export const AISpeakingView found at line ${i+1}`);
  }
  if (l.includes('return (') || l.includes('return(')) {
    console.log(`return statement found at line ${i+1}`);
  }
});
