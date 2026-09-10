const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts', 'utf8');

// Test if kdrama.ts has any syntax issues or missing fields
const jsonMatch = content.match(/export const K_DRAMA_SCENES: KDramaScene\[\] = (\[[\s\S]*?\]);\n/);
if (!jsonMatch) {
  console.log('Regex did not match K_DRAMA_SCENES');
} else {
  const scenes = JSON.parse(jsonMatch[1]);
  console.log('Parsed scenes count:', scenes.length);
  scenes.forEach((s, idx) => {
    if (!s.id) console.error('Scene ' + idx + ' missing id');
    if (!s.dialogues || !Array.isArray(s.dialogues)) console.error('Scene ' + idx + ' missing dialogues');
    if (!s.dramaTitle) console.error('Scene ' + idx + ' missing dramaTitle');
    if (!s.category) console.error('Scene ' + idx + ' missing category');
    if (!s.levelTag) console.error('Scene ' + idx + ' missing levelTag');
  });
  console.log('All scenes checked.');
}
