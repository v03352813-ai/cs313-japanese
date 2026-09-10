const fs = require('fs');
const path = require('path');

const dir = 'd:/小语种学习/cs313-korean/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

console.log('Checking component files for common missing imports...');
files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Check lucide icons used in JSX like <SomeIcon ...
  const matches = content.match(/<([A-Z][a-zA-Z0-9]+)\s/g) || [];
  const jsxTags = [...new Set(matches.map(m => m.substring(1).trim()))];
  
  // Find imports
  const importLines = content.split('\n').filter(l => l.includes('import '));
  const importedWords = new Set();
  importLines.forEach(l => {
    const words = l.match(/[a-zA-Z0-9_]+/g) || [];
    words.forEach(w => importedWords.add(w));
  });

  const knownReactComponents = new Set([
    'React', 'div', 'span', 'button', 'input', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ErrorBoundary', 'HomePortal', 'AISpeakingView', 'ListeningView', 'TopikExamView',
    'VocabView', 'GrammarView', 'KDramaView', 'VideoImportModal', 'DramaThumbnail',
    'CinematicVideoCanvas', 'MultiLangModal', 'VipModal', 'Navbar', 'AdminKeyGeneratorModal',
    'GrammarVisualMindMap'
  ]);

  jsxTags.forEach(tag => {
    if (!importedWords.has(tag) && !knownReactComponents.has(tag)) {
      console.log(`[POTENTIAL MISSING IMPORT] in ${file}: <${tag} ...>`);
    }
  });
});
console.log('Component import check completed.');
