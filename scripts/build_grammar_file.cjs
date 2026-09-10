const fs = require('fs');
const path = require('path');

// Read part1 content
const p1Content = fs.readFileSync(path.resolve(__dirname, 'part1.cjs'), 'utf8');
const p1Match = p1Content.match(/const gData = (\[[\s\S]*?\]);\n/);
let part1 = [];
if (p1Match) {
  part1 = eval(p1Match[1]);
}

const part2 = require('./part2.cjs');
const part3 = require('./part3.cjs');
const part4 = require('./part4.cjs');
const part5 = require('./part5.cjs');

const allItems = [...part1, ...part2, ...part3, ...part4, ...part5];
console.log('Total merged items:', allItems.length);

const header = `export interface GrammarExample {
  ko: string;
  zh: string;
}

export interface GrammarItem {
  id: string;
  title: string;
  level: '初级' | '中级' | '高级';
  category: '助词篇' | '终结词尾' | '连接词尾' | '原因/因果' | '转折/让步' | '推测/可能' | '假定/条件' | '意图/目的' | '间接引语' | '高级句型';
  tags?: string[]; // 支持多维度分类标签检索 (如 '连接词尾', '原因/因果')
  structure: string; // 接续公式
  meaning: string;   // 核心释义
  explanation: string; // 深度讲解
  examples: GrammarExample[];
  diffCheck?: {
    compareWith: string;
    difference: string;
  };
  tips?: string;
}

export const GRAMMAR_CATEGORIES = [
  '全部',
  '初级',
  '中级',
  '高级',
  '助词篇',
  '终结词尾',
  '连接词尾',
  '原因/因果',
  '转折/让步',
  '推测/可能',
  '假定/条件',
  '意图/目的',
  '间接引语'
];

export const KOREAN_GRAMMAR_DATA: GrammarItem[] = `;

const finalCode = header + JSON.stringify(allItems, null, 2) + ';\n';

const dest = path.resolve(__dirname, '../src/data/korean/grammar.ts');
fs.writeFileSync(dest, finalCode, 'utf8');
console.log('Successfully wrote:', dest, 'File size:', fs.statSync(dest).size);
