const path = require('path');
const db = require(path.resolve(__dirname, '../server/db.cjs'));
console.log('Admin Stats:', db.getAdminStats());

// Test card verification
const verifyRes = db.verifyAndBindCardKey('CS313-KR-8888-A1B2', { deviceId: 'test-device-1', deviceType: 'PC' });
console.log('Verify Result:', verifyRes);

// Test student progress save
const progressRes = db.saveStudentProgress('std_8888a1b2', {
  masteredVocabIds: ['v-001', 'v-002', 'v-056'],
  studyStreak: 5,
  lastCheckinDate: '2026-08-29'
});
console.log('Progress Save Result:', progressRes);
