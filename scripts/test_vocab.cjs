const fs = require('fs');
const path = require('path');

const vocabPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/vocab.ts');
const fileContent = fs.readFileSync(vocabPath, 'utf8');

// Check category match
const catStart = fileContent.indexOf('export const VOCAB_CATEGORIES = [');
const catEnd = fileContent.indexOf('];', catStart);
const catArray = eval(fileContent.substring(catStart + 'export const VOCAB_CATEGORIES = '.length, catEnd + 1));

const dataStart = fileContent.indexOf('export const KOREAN_VOCAB_DATA: VocabItem[] = [');
const dataEnd = fileContent.lastIndexOf('];');
const dataArray = eval(fileContent.substring(dataStart + 'export const KOREAN_VOCAB_DATA: VocabItem[] = '.length, dataEnd + 1));

console.log('Total vocab items:', dataArray.length);
console.log('Categories count:', catArray.length);

const catCounts = {};
catArray.forEach(cat => {
  if (cat === '全部') {
    catCounts[cat] = dataArray.length;
  } else {
    const matched = dataArray.filter(item => item.category === cat || item.level === cat);
    catCounts[cat] = matched.length;
  }
});

console.log('Vocab Category Distribution:', catCounts);
