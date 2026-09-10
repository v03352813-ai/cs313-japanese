const db = require('../server/db.cjs');
const fs = require('fs');
const path = require('path');

const res = db.generateBatchCardKeys(100, 'jp_lifetime', '2026-JP-INIT', 49.9);

const lines = [
  '================================================================',
  '  CS313 日语研习社 · 闲鱼官方自动发货卡密库 (100 条)',
  '  卡种权益：日语终身 VIP 独享版 (jp_lifetime)',
  '  官方标价：¥49.9 / 终身买断 · 永久免费更新',
  '  防盗版风控：严格限制 2 台设备绑定（例如 1 台 iPad/手机 + 1 台电脑）',
  '  生成时间：' + new Date().toLocaleString(),
  '================================================================',
  '',
  ...res.keys,
  ''
];

const targetPath = path.resolve(__dirname, '../闲鱼发货卡密库_100条_日语终身VIP.txt');
fs.writeFileSync(targetPath, lines.join('\r\n'), 'utf8');
console.log(`[Success] Generated ${res.keys.length} Japanese VIP keys in ${targetPath}`);
