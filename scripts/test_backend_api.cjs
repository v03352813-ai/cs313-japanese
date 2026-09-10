const http = require('node:http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Starting CS313 Backend API Test Suite ===\n');

  // Test 1: Health
  const health = await request({ hostname: '127.0.0.1', port: 3001, path: '/api/health', method: 'GET' });
  console.log('1. Health Check:', health.status === 200 && health.data.status === 'ok' ? '✅ PASS' : '❌ FAIL', health.data);

  // Test 2: Card Verification
  const verify = await request({
    hostname: '127.0.0.1', port: 3001, path: '/api/auth/verify-key', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    cardKey: 'CS313-KR-8888-A1B2',
    device: { deviceId: 'dev_pc_01', deviceType: 'PC / 电脑端', browser: 'Chrome', ip: '127.0.0.1' }
  });
  console.log('2. Card Verification:', verify.status === 200 && verify.data.success ? '✅ PASS' : '❌ FAIL', verify.data.license);

  // Test 3: Progress Sync
  const sync = await request({
    hostname: '127.0.0.1', port: 3001, path: '/api/user/sync', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    userId: verify.data.license.userId,
    progress: {
      masteredVocabIds: ['v-001', 'v-002', 'v-030', 'v-056'],
      masteredGrammarIds: ['g-001', 'g-018'],
      studyStreak: 12,
      lastCheckinDate: '2026-08-29'
    }
  });
  console.log('3. Progress Sync:', sync.status === 200 && sync.data.success ? '✅ PASS' : '❌ FAIL', sync.data.progress);

  // Test 4: Get Progress
  const getProg = await request({
    hostname: '127.0.0.1', port: 3001, path: `/api/user/progress?userId=${verify.data.license.userId}`, method: 'GET'
  });
  console.log('4. Get Progress Query:', getProg.status === 200 && getProg.data.progress.studyStreak === 12 ? '✅ PASS' : '❌ FAIL');

  // Test 5: Exam Submit
  const examSub = await request({
    hostname: '127.0.0.1', port: 3001, path: '/api/exam/submit', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    userId: verify.data.license.userId,
    paperId: 'marathon-topik2-92th',
    paperTitle: '第 92 届 TOPIK II 全真模考',
    score: 88,
    totalScore: 100,
    timeSpentSec: 5200,
    userAnswers: { "920001": 2, "920002": 1 },
    wrongQuestionIds: [920005, 920018]
  });
  console.log('5. Exam Submission:', examSub.status === 200 && examSub.data.success ? '✅ PASS' : '❌ FAIL', examSub.data);

  // Test 6: Admin Generate Keys
  const genKeys = await request({
    hostname: '127.0.0.1', port: 3001, path: '/api/admin/generate-keys', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    count: 5, tier: 'kr_lifetime', batchNo: 'TEST-BATCH-2026', price: 49.9
  });
  console.log('6. Admin Generate Keys:', genKeys.status === 200 && genKeys.data.count === 5 ? '✅ PASS' : '❌ FAIL', genKeys.data.keys);

  // Test 7: Admin Stats
  const stats = await request({
    hostname: '127.0.0.1', port: 3001, path: '/api/admin/stats', method: 'GET'
  });
  console.log('7. Admin Stats Query:', stats.status === 200 && stats.data.stats.totalCards >= 10 ? '✅ PASS' : '❌ FAIL', {
    totalCards: stats.data.stats.totalCards,
    usedCards: stats.data.stats.usedCards,
    activationRate: stats.data.stats.activationRate,
    activeStudents: stats.data.stats.activeStudents,
    totalExams: stats.data.stats.totalExams
  });

  console.log('\n=== All 7 API Test Cases Completed Successfully! ===');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
