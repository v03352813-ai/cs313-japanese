const fs = require('fs');

// Check if any scene in kdrama.ts causes issues
const kdramaCode = fs.readFileSync('d:/小语种学习/cs313-korean/src/data/korean/kdrama.ts', 'utf8');

// Let us inspect every scene and check all dialogues, avatars, categories, etc.
const sceneMatch = kdramaCode.match(/export const K_DRAMA_SCENES: KDramaScene\[\] = (\[[\s\S]*?\]);\s*\/\//);
if (sceneMatch) {
  const scenes = eval(sceneMatch[1]);
  console.log('Scenes count:', scenes.length);
  scenes.forEach((s, idx) => {
    // Test logic from KDramaView.tsx
    const categoryMeta = s.category;
    const isLocked = !s.isFreePreview;
    if (!s.dialogues || s.dialogues.length === 0) {
      console.error(`Scene ${idx} (${s.id}) has no dialogues!`);
    }
    s.dialogues.forEach((d, di) => {
      if (!d.id || !d.speaker || !d.ko) {
        console.error(`Scene ${idx} dialogue ${di} invalid:`, d);
      }
      if (d.clozeQuestion) {
        if (!d.clozeQuestion.maskedKo || !d.clozeQuestion.options || !Array.isArray(d.clozeQuestion.options)) {
          console.error(`Scene ${idx} dialogue ${di} clozeQuestion invalid:`, d.clozeQuestion);
        }
      }
    });
  });
}
console.log('Finished scene checks.');
