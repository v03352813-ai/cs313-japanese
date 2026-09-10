/**
 * CS313 日语学习平台 · 原生 SQLite 高性能云数据库核心模块
 * 基于 Node.js 22 内置的 node:sqlite 引擎，启用 WAL 极速高并发事务模式
 */
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'cs313_japanese.db');
const db = new DatabaseSync(DB_PATH);

// 1. 启用 WAL 高性能并发读写模式
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// 2. 初始化 5 大核心业务数据表
db.exec(`
  -- 表 1: 卡密与设备鉴权表 (严格限制 2 台设备)
  CREATE TABLE IF NOT EXISTS card_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_key TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL DEFAULT 'jp_lifetime', -- jp_lifetime / all_lang
    status TEXT NOT NULL DEFAULT 'active',    -- active / used / frozen / revoked
    batch_no TEXT NOT NULL DEFAULT '2026-INIT',
    price REAL NOT NULL DEFAULT 49.9,
    bound_devices TEXT NOT NULL DEFAULT '[]', -- JSON 存储设备指纹列表
    activated_at TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_card_key ON card_keys(card_key);

  -- 表 2: 学员账号表
  CREATE TABLE IF NOT EXISTS students (
    user_id TEXT PRIMARY KEY,
    card_key TEXT,
    nickname TEXT NOT NULL DEFAULT '日语研习社学员',
    current_device_id TEXT,
    created_at TEXT NOT NULL,
    last_active_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_student_key ON students(card_key);

  -- 表 3: 学习进度与单词/语法多端同步表
  CREATE TABLE IF NOT EXISTS study_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    mastered_vocab_ids TEXT NOT NULL DEFAULT '[]',
    mastered_grammar_ids TEXT NOT NULL DEFAULT '[]',
    study_streak INTEGER NOT NULL DEFAULT 0,
    last_checkin_date TEXT,
    custom_notes TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_progress_user ON study_progress(user_id);

  -- 表 4: 真题答卷、得分与智能错题本表
  CREATE TABLE IF NOT EXISTS exam_records (
    record_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    paper_id TEXT NOT NULL,
    paper_title TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 100,
    time_spent_sec INTEGER NOT NULL DEFAULT 0,
    user_answers TEXT NOT NULL DEFAULT '{}',       -- JSON 答题卡
    wrong_question_ids TEXT NOT NULL DEFAULT '[]', -- JSON 错题题号
    submitted_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_exam_user ON exam_records(user_id);
  CREATE INDEX IF NOT EXISTS idx_exam_paper ON exam_records(paper_id);

  -- 表 5: 云端新真题与内容增量更新表
  CREATE TABLE IF NOT EXISTS dynamic_content_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type TEXT NOT NULL, -- new_exam / new_kdrama / new_grammar
    title TEXT NOT NULL,
    version INTEGER NOT NULL UNIQUE,
    payload TEXT NOT NULL,      -- JSON 加密题目数据
    is_published INTEGER NOT NULL DEFAULT 1,
    published_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_updates_version ON dynamic_content_updates(version);
`);

// 3. 预置种子卡密库（包含测试卡密与终身VIP默认卡密）
function seedDefaultCards() {
  const checkStmt = db.prepare('SELECT COUNT(*) as count FROM card_keys');
  const result = checkStmt.get();
  if (result.count === 0) {
    const now = new Date().toISOString();
    const seedCards = [
      { key: 'CS313-KR-8888-A1B2', tier: 'kr_lifetime', batch: '2026-OFFICIAL-01', price: 49.9 },
      { key: 'CS313-ALL-VIP-GOLD', tier: 'all_lang', batch: '2026-BLACK-GOLD', price: 198.0 },
      { key: 'CS313-KR-9999-C3D4', tier: 'kr_lifetime', batch: '2026-OFFICIAL-01', price: 49.9 },
      { key: 'CS313-KR-7777-E5F6', tier: 'kr_lifetime', batch: '2026-OFFICIAL-01', price: 49.9 },
      { key: 'CS313-KR-6666-G7H8', tier: 'kr_lifetime', batch: '2026-OFFICIAL-01', price: 49.9 }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO card_keys (card_key, tier, status, batch_no, price, bound_devices, created_at)
      VALUES (?, ?, 'active', ?, ?, '[]', ?)
    `);

    seedCards.forEach(c => {
      insertStmt.run(c.key, c.tier, c.batch, c.price, now);
    });

    console.log('[SQLite DB] Successfully initialized and seeded default card keys.');
  }
}

seedDefaultCards();

// =========================================================================
// 4. 业务数据操作 API 函数封装 (DAO)
// =========================================================================

/**
 * 验证并核销卡密，绑定设备指纹 (严格限制 2 台设备)
 */
function verifyAndBindCardKey(cardKey, device = {}) {
  const cleanKey = (cardKey || '').trim().toUpperCase();
  const stmt = db.prepare('SELECT * FROM card_keys WHERE card_key = ?');
  const card = stmt.get(cleanKey);

  if (!card) {
    return { success: false, message: '激活卡密不存在，请检查后重新输入' };
  }

  if (card.status === 'frozen' || card.status === 'revoked') {
    return { success: false, message: '该卡密已被店主冻结或作废，如有疑问请联系客服' };
  }

  let devices = [];
  try {
    devices = JSON.parse(card.bound_devices || '[]');
  } catch {
    devices = [];
  }

  const devId = device.deviceId || 'unknown_device';
  const existingDevice = devices.find(d => d.deviceId === devId);

  const now = new Date().toISOString();

  // 如果此设备尚未绑定
  if (!existingDevice) {
    if (devices.length >= 2) {
      return {
        success: false,
        message: `该卡密已在 2 台设备 (${devices.map(d => d.name || d.deviceType || '设备').join('、')}) 上激活使用，超出最大设备限制！`
      };
    }

    // 绑定新设备
    devices.push({
      deviceId: devId,
      deviceType: device.deviceType || 'PC / 电脑端',
      browser: device.browser || '浏览器',
      ip: device.ip || '127.0.0.1',
      boundAt: now
    });

    const updateStmt = db.prepare(`
      UPDATE card_keys 
      SET bound_devices = ?, 
          status = 'used',
          activated_at = COALESCE(activated_at, ?)
      WHERE card_key = ?
    `);
    updateStmt.run(JSON.stringify(devices), now, cleanKey);
  }

  // 确保学员账号存在
  const userId = `std_${cleanKey.replace(/[^A-Z0-9]/g, '').slice(-12).toLowerCase()}`;
  const studentStmt = db.prepare(`
    INSERT INTO students (user_id, card_key, current_device_id, created_at, last_active_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET 
      last_active_at = excluded.last_active_at,
      current_device_id = excluded.current_device_id
  `);
  studentStmt.run(userId, cleanKey, devId, now, now);

  return {
    success: true,
    message: '卡密激活成功！已解锁终身学习特权与题库',
    license: {
      isVip: true,
      cardKey: cleanKey,
      tier: card.tier === 'all_lang' ? '全语种黑金卡' : '韩语单语种终身VIP',
      activatedAt: card.activated_at || now,
      boundDevicesCount: devices.length,
      maxDevices: 2,
      userId
    }
  };
}

/**
 * 获取学员云端同步进度
 */
function getStudentProgress(userId) {
  if (!userId) return null;
  const stmt = db.prepare('SELECT * FROM study_progress WHERE user_id = ?');
  const progress = stmt.get(userId);

  if (!progress) {
    return {
      userId,
      masteredVocabIds: [],
      masteredGrammarIds: [],
      studyStreak: 0,
      lastCheckinDate: null,
      customNotes: {},
      updatedAt: null
    };
  }

  return {
    userId: progress.user_id,
    masteredVocabIds: JSON.parse(progress.mastered_vocab_ids || '[]'),
    masteredGrammarIds: JSON.parse(progress.mastered_grammar_ids || '[]'),
    studyStreak: progress.study_streak,
    lastCheckinDate: progress.last_checkin_date,
    customNotes: JSON.parse(progress.custom_notes || '{}'),
    updatedAt: progress.updated_at
  };
}

/**
 * 保存/同步学员学习进度（双向合并）
 */
function saveStudentProgress(userId, data = {}) {
  if (!userId) return { success: false, message: 'Missing userId' };
  const now = new Date().toISOString();

  // 确保学员记录存在
  db.prepare(`
    INSERT INTO students (user_id, card_key, created_at, last_active_at)
    VALUES (?, 'guest', ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET last_active_at = excluded.last_active_at
  `).run(userId, now, now);

  const current = getStudentProgress(userId) || {};

  // 合并单词与语法
  const mergedVocab = Array.from(new Set([...(current.masteredVocabIds || []), ...(data.masteredVocabIds || [])]));
  const mergedGrammar = Array.from(new Set([...(current.masteredGrammarIds || []), ...(data.masteredGrammarIds || [])]));
  const maxStreak = Math.max(current.studyStreak || 0, data.studyStreak || 0);
  const lastCheckin = data.lastCheckinDate || current.lastCheckinDate || now.slice(0, 10);
  const mergedNotes = { ...(current.customNotes || {}), ...(data.customNotes || {}) };

  const stmt = db.prepare(`
    INSERT INTO study_progress (user_id, mastered_vocab_ids, mastered_grammar_ids, study_streak, last_checkin_date, custom_notes, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      mastered_vocab_ids = excluded.mastered_vocab_ids,
      mastered_grammar_ids = excluded.mastered_grammar_ids,
      study_streak = excluded.study_streak,
      last_checkin_date = excluded.last_checkin_date,
      custom_notes = excluded.custom_notes,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    userId,
    JSON.stringify(mergedVocab),
    JSON.stringify(mergedGrammar),
    maxStreak,
    lastCheckin,
    JSON.stringify(mergedNotes),
    now
  );

  return {
    success: true,
    progress: {
      userId,
      masteredVocabIds: mergedVocab,
      masteredGrammarIds: mergedGrammar,
      studyStreak: maxStreak,
      lastCheckinDate: lastCheckin,
      customNotes: mergedNotes,
      updatedAt: now
    }
  };
}

/**
 * 保存真题模考交卷成绩
 */
function saveExamRecord(record) {
  const now = new Date().toISOString();
  const recordId = record.recordId || `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const stmt = db.prepare(`
    INSERT INTO exam_records (record_id, user_id, paper_id, paper_title, score, total_score, time_spent_sec, user_answers, wrong_question_ids, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    recordId,
    record.userId || 'guest_user',
    record.paperId,
    record.paperTitle || 'TOPIK 模考',
    record.score,
    record.totalScore || 100,
    record.timeSpentSec || 0,
    JSON.stringify(record.userAnswers || {}),
    JSON.stringify(record.wrongQuestionIds || []),
    now
  );

  return {
    success: true,
    recordId,
    score: record.score,
    submittedAt: now
  };
}

/**
 * 获取学员历史答卷列表
 */
function getExamRecords(userId) {
  const stmt = db.prepare('SELECT * FROM exam_records WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 50');
  const rows = stmt.all(userId);

  return rows.map(r => ({
    recordId: r.record_id,
    userId: r.user_id,
    paperId: r.paper_id,
    paperTitle: r.paper_title,
    score: r.score,
    totalScore: r.total_score,
    timeSpentSec: r.time_spent_sec,
    userAnswers: JSON.parse(r.user_answers || '{}'),
    wrongQuestionIds: JSON.parse(r.wrong_question_ids || '[]'),
    submittedAt: r.submitted_at
  }));
}

/**
 * 店主后台：一键批量生成新卡密
 */
function generateBatchCardKeys(count = 10, tier = 'jp_lifetime', batchNo = 'BATCH-01', price = 49.9) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const generated = [];
  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO card_keys (card_key, tier, status, batch_no, price, bound_devices, created_at)
    VALUES (?, ?, 'active', ?, ?, '[]', ?)
  `);

  for (let i = 0; i < count; i++) {
    let randomPart1 = '';
    let randomPart2 = '';
    for (let j = 0; j < 4; j++) {
      randomPart1 += chars[Math.floor(Math.random() * chars.length)];
      randomPart2 += chars[Math.floor(Math.random() * chars.length)];
    }
    const key = `CS313-${tier === 'all_lang' ? 'ALL' : 'JP'}-${randomPart1}-${randomPart2}`;
    try {
      insertStmt.run(key, tier, batchNo, price, now);
      generated.push(key);
    } catch {
      // 忽略极小概率主键重复
    }
  }

  return {
    success: true,
    count: generated.length,
    keys: generated,
    batchNo,
    createdAt: now
  };
}

/**
 * 店主后台：获取运营数据统计大盘
 */
function getAdminStats() {
  const totalCards = db.prepare('SELECT COUNT(*) as count FROM card_keys').get().count;
  const usedCards = db.prepare("SELECT COUNT(*) as count FROM card_keys WHERE status = 'used'").get().count;
  const activeStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
  const totalExams = db.prepare('SELECT COUNT(*) as count FROM exam_records').get().count;

  const recentCards = db.prepare('SELECT * FROM card_keys ORDER BY created_at DESC LIMIT 50').all();

  return {
    totalCards,
    usedCards,
    activationRate: totalCards > 0 ? ((usedCards / totalCards) * 100).toFixed(1) + '%' : '0%',
    activeStudents,
    totalExams,
    recentCards: recentCards.map(c => ({
      ...c,
      boundDevices: JSON.parse(c.bound_devices || '[]')
    }))
  };
}

module.exports = {
  db,
  verifyAndBindCardKey,
  getStudentProgress,
  saveStudentProgress,
  saveExamRecord,
  getExamRecords,
  generateBatchCardKeys,
  getAdminStats
};
