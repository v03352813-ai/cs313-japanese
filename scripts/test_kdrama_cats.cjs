const fs = require('fs');
const path = require('path');

const kdramaPath = path.resolve('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts');
const fileContent = fs.readFileSync(kdramaPath, 'utf8');

const jsonStart = fileContent.indexOf('export const K_DRAMA_SCENES: KDramaScene[] = [');
const jsonEnd = fileContent.lastIndexOf('];');
const scenes = eval(fileContent.substring(jsonStart + 'export const K_DRAMA_SCENES: KDramaScene[] = '.length, jsonEnd + 1));

console.log('Total scenes in K_DRAMA_SCENES:', scenes.length);
const catCounts = {};
scenes.forEach(s => {
  catCounts[s.category] = (catCounts[s.category] || 0) + 1;
});
console.log('KDrama Category distribution:', catCounts);
