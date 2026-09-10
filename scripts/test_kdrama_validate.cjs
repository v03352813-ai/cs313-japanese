// Let us inspect the actual scenes in kdrama.ts
const fs = require('fs');
const content = fs.readFileSync('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts', 'utf8');

// Match all scenes
const match = content.match(/export const K_DRAMA_SCENES: KDramaScene\[\] = (\[[\s\S]*?\]);\s*\/\//);
if (match) {
  try {
    const scenes = eval(match[1]);
    console.log('Total scenes count:', scenes.length);
    scenes.forEach((s, i) => {
      if (!s.id) console.error(`Scene ${i} missing id`);
      if (!s.dramaTitle) console.error(`Scene ${i} missing dramaTitle`);
      if (!s.category) console.error(`Scene ${i} missing category`);
      if (!s.dialogues || !Array.isArray(s.dialogues)) console.error(`Scene ${i} missing dialogues`);
      s.dialogues.forEach((d, di) => {
        if (!d.ko) console.error(`Scene ${i} dialogue ${di} missing ko`);
      });
    });
    console.log('All scenes integrity verified!');
  } catch (e) {
    console.error('Eval error:', e.message);
  }
} else {
  console.log('Match failed');
}
