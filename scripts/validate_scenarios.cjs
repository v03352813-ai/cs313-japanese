const { createServer } = require('vite');

async function test() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  const mod = await vite.ssrLoadModule('/src/data/korean/aiScenarios.ts');
  console.log('Total scenarios loaded:', mod.AI_SCENARIOS_DATA.length);
  let errorCount = 0;
  mod.AI_SCENARIOS_DATA.forEach((s, idx) => {
    if (!s.id) { console.error(`[${idx}] missing id`); errorCount++; }
    if (!s.title) { console.error(`[${idx}] missing title`); errorCount++; }
    if (!s.category) { console.error(`[${idx}] missing category`); errorCount++; }
    if (!s.levelTag) { console.error(`[${idx}] missing levelTag in ${s.id}`); errorCount++; }
    if (!s.turns || !Array.isArray(s.turns) || s.turns.length === 0) {
      console.error(`[${idx}] missing or empty turns in ${s.id}`);
      errorCount++;
    }
  });
  console.log('Errors:', errorCount);
  await vite.close();
}
test().catch(console.error);
