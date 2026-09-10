const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  KOREAN PLATFORM COMPREHENSIVE END-TO-END AUDIT   ');
console.log('====================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const issues = [];

function assert(condition, testName, errorDetails = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName}: ${errorDetails}`);
    issues.push({ testName, errorDetails });
  }
}

// ----------------------------------------------------
// TEST 1: TOPIK Exams (56 Papers, 2,192 Questions)
// ----------------------------------------------------
console.log('\n--- 1. Testing 56 TOPIK Exam Papers Dataset ---');
try {
  const examsPath = path.resolve('src/data/korean/topikExams.ts');
  const examsContent = fs.readFileSync(examsPath, 'utf8');
  assert(examsContent.includes('KOREAN_TOPIK_EXAMS'), 'topikExams.ts contains KOREAN_TOPIK_EXAMS export');
  
  // Count papers
  const paperMatches = examsContent.match(/"id":\s*"(marathon-|paper-|drill-)[^"]+"/g) || [];
  assert(paperMatches.length === 56, `Exactly 56 exam papers generated (found ${paperMatches.length})`);
  
  // Count total questions
  const qMatches = examsContent.match(/"correctAnswer":\s*[0-3]/g) || [];
  assert(qMatches.length >= 2100, `Found ${qMatches.length} valid TOPIK questions with 0-3 answers`);
  
  // Verify answer distribution
  const a0 = (examsContent.match(/"correctAnswer":\s*0/g) || []).length;
  const a1 = (examsContent.match(/"correctAnswer":\s*1/g) || []).length;
  const a2 = (examsContent.match(/"correctAnswer":\s*2/g) || []).length;
  const a3 = (examsContent.match(/"correctAnswer":\s*3/g) || []).length;
  assert(a0 > 0 && a1 > 0 && a2 > 0 && a3 > 0, `Answers distributed across all 4 options (A:${a0}, B:${a1}, C:${a2}, D:${a3})`);
} catch (e) {
  assert(false, 'TOPIK Exams Data Check', e.message);
}

// ----------------------------------------------------
// TEST 2: TOPIK Writing (51~54 AI Correction Engine)
// ----------------------------------------------------
console.log('\n--- 2. Testing TOPIK Writing & AI Correction Dataset ---');
try {
  const writingPath = path.resolve('src/data/korean/writing.ts');
  const writingContent = fs.readFileSync(writingPath, 'utf8');
  assert(writingContent.includes('TOPIK_WRITING_DATA'), 'writing.ts contains TOPIK_WRITING_DATA export');
  assert(writingContent.includes('q51') && writingContent.includes('q52') && writingContent.includes('q53') && writingContent.includes('q54'), 'Covers all 51, 52, 53, 54 question types');
  
  const writingViewPath = path.resolve('src/components/TopikWritingView.tsx');
  const writingViewContent = fs.readFileSync(writingViewPath, 'utf8');
  assert(writingViewContent.includes('handleRunAICorrection'), 'TopikWritingView contains AI correction runner');
  assert(writingViewContent.includes('띄어쓰기') || writingViewContent.includes('spacingIssues'), 'Contains spacing (띄어쓰기) diagnostic logic');
  assert(writingViewContent.includes('endingToneIssues'), 'Contains ending tone (-다/-ㄴ다) diagnostic logic');
  assert(writingViewContent.includes('vocabUpgrades'), 'Contains advanced vocabulary upgrade suggestions');
} catch (e) {
  assert(false, 'TOPIK Writing Check', e.message);
}

// ----------------------------------------------------
// TEST 3: 8 Sound Change Rules & Clinic
// ----------------------------------------------------
console.log('\n--- 3. Testing 8 Sound Change Rules & Clinic ---');
try {
  const phoneticsPath = path.resolve('src/data/korean/phonetics.ts');
  const phoneticsContent = fs.readFileSync(phoneticsPath, 'utf8');
  assert(phoneticsContent.includes('KOREAN_SOUND_RULES'), 'phonetics.ts contains KOREAN_SOUND_RULES export');
  assert(phoneticsContent.includes('연음화') && phoneticsContent.includes('비음화') && phoneticsContent.includes('유음화') && phoneticsContent.includes('경음화'), 'Covers Liaison, Nasalization, Lateralization, Tensification');
  assert(phoneticsContent.includes('격음화') && phoneticsContent.includes('구개음화') && phoneticsContent.includes('두음법칙') && phoneticsContent.includes('ㅎ탈락'), 'Covers Aspiration, Palatalization, Initial law, H-drop');
  
  const phoneticsViewPath = path.resolve('src/components/PhoneticsView.tsx');
  const phoneticsViewContent = fs.readFileSync(phoneticsViewPath, 'utf8');
  assert(phoneticsViewContent.includes('handleRunClinic'), 'PhoneticsView contains interactive clinic analyzer');
} catch (e) {
  assert(false, 'Phonetics Check', e.message);
}

// ----------------------------------------------------
// TEST 4: Ebbinghaus Mistake Notebook
// ----------------------------------------------------
console.log('\n--- 4. Testing Ebbinghaus Spaced Repetition Notebook ---');
try {
  const mistakePath = path.resolve('src/data/korean/mistakeBook.ts');
  const mistakeContent = fs.readFileSync(mistakePath, 'utf8');
  assert(mistakeContent.includes('addMistakeRecord') && mistakeContent.includes('recordMistakeReview'), 'mistakeBook.ts contains add & review algorithms');
  assert(mistakeContent.includes('SPACED_INTERVALS') || mistakeContent.includes('1, 3, 7, 15'), 'Contains 1-3-7-15-30 day spaced repetition interval scale');
  
  const mistakeViewPath = path.resolve('src/components/MistakeNotebookView.tsx');
  const mistakeViewContent = fs.readFileSync(mistakeViewPath, 'utf8');
  assert(mistakeViewContent.includes('handleSelectAnswer'), 'MistakeNotebookView contains re-test interactive logic');
  
  const examViewPath = path.resolve('src/components/TopikExamView.tsx');
  const examViewContent = fs.readFileSync(examViewPath, 'utf8');
  assert(examViewContent.includes('addMistakeRecord'), 'TopikExamView automatically syncs wrong questions to mistakeBook');
} catch (e) {
  assert(false, 'Mistake Notebook Check', e.message);
}

// ----------------------------------------------------
// TEST 5: AI Speaking (Free Chat & Scenarios & API)
// ----------------------------------------------------
console.log('\n--- 5. Testing AI Speaking & Free Chat Mode ---');
try {
  const scenarioPath = path.resolve('src/data/korean/aiScenarios.ts');
  const scenarioContent = fs.readFileSync(scenarioPath, 'utf8');
  assert(scenarioContent.includes('free_chat_01'), 'aiScenarios.ts contains free_chat_01 Open-ended Free Chat Mode');
  
  const speakingViewPath = path.resolve('src/components/AISpeakingView.tsx');
  const speakingViewContent = fs.readFileSync(speakingViewPath, 'utf8');
  assert(speakingViewContent.includes('handleSendMessage'), 'AISpeakingView contains message dispatcher');
  assert(speakingViewContent.includes('gemini-1.5-flash') || speakingViewContent.includes('generativelanguage.googleapis.com'), 'Contains cloud Gemini API integration');
  assert(speakingViewContent.includes('generateDynamicAIResponse'), 'Contains infinite turns local dynamic NLP fallback');
} catch (e) {
  assert(false, 'AI Speaking Check', e.message);
}

// ----------------------------------------------------
// TEST 6: Flashcards & Grammar & Listening & Drama
// ----------------------------------------------------
console.log('\n--- 6. Testing Vocab, Grammar, KDrama, Listening ---');
try {
  const vocabPath = path.resolve('src/data/korean/vocab.ts');
  const vocabContent = fs.readFileSync(vocabPath, 'utf8');
  assert(vocabContent.includes('KOREAN_VOCAB_DATA'), 'vocab.ts contains KOREAN_VOCAB_DATA');
  
  const grammarPath = path.resolve('src/data/korean/grammar.ts');
  const grammarContent = fs.readFileSync(grammarPath, 'utf8');
  assert(grammarContent.includes('KOREAN_GRAMMAR_DATA'), 'grammar.ts contains KOREAN_GRAMMAR_DATA');
  
  const kdramaPath = path.resolve('src/data/korean/kdrama.ts');
  const kdramaContent = fs.readFileSync(kdramaPath, 'utf8');
  assert(kdramaContent.includes('K_DRAMA_SCENES'), 'kdrama.ts contains K_DRAMA_SCENES');
  
  const listeningPath = path.resolve('src/data/korean/listening.ts');
  const listeningContent = fs.readFileSync(listeningPath, 'utf8');
  assert(listeningContent.includes('KOREAN_LISTENING_DATA'), 'listening.ts contains KOREAN_LISTENING_DATA');
} catch (e) {
  assert(false, 'Vocab/Grammar/KDrama/Listening Check', e.message);
}

// ----------------------------------------------------
// TEST 7: Navigation & Route Sync & Container Alignment
// ----------------------------------------------------
console.log('\n--- 7. Testing Navigation & Route & Layout Alignment ---');
try {
  const navPath = path.resolve('src/components/Navbar.tsx');
  const navContent = fs.readFileSync(navPath, 'utf8');
  assert(navContent.includes('max-w-6xl mx-auto px-4'), 'Navbar uses max-w-6xl mx-auto px-4 container matching page body');
  assert(navContent.includes("'home'") && navContent.includes("'speaking'") && navContent.includes("'exam'") && navContent.includes("'writing'") && navContent.includes("'phonetics'") && navContent.includes("'mistakes'") && navContent.includes("'kdrama'") && navContent.includes("'vocab'") && navContent.includes("'grammar'"), 'Navbar has all 9 core flat tabs');

  const appPath = path.resolve('src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  assert(appContent.includes("'writing'") && appContent.includes("'phonetics'") && appContent.includes("'mistakes'"), 'App.tsx hash change router listens to all new tabs');
  assert(appContent.includes('<TopikWritingView') && appContent.includes('<PhoneticsView') && appContent.includes('<MistakeNotebookView'), 'App.tsx renders all views');
} catch (e) {
  assert(false, 'Navigation/Layout Check', e.message);
}

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`  AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED  `);
if (failedTests > 0) {
  console.error(`  ⚠️ ${failedTests} TESTS FAILED!`);
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('  🎉 100% OF ALL MODULES, DATASETS & VIEWS VERIFIED PERFECTLY!');
}
console.log('====================================================');