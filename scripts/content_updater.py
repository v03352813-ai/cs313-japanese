"""
CS313.CN 自动化内容扩充与更新流水线脚本
用于批量将中韩词汇、真题试卷、语法要点与剧集字幕生成并更新到前端数据源中。
"""

import json
import os

def export_vocab_to_ts(vocab_list, output_path):
    content = """export interface VocabItem {
  id: string;
  word: string;
  hanja?: string;
  pronunciation: string;
  pos: '名词' | '动词' | '形容词' | '副词' | '数词' | '代词' | '冠词' | '感叹词';
  level: 'TOPIK 1' | 'TOPIK 2' | 'TOPIK 3' | 'TOPIK 4' | 'TOPIK 5' | 'TOPIK 6' | '场景专题';
  category: string;
  meaning: string;
  exampleKo: string;
  exampleZh: string;
  tips?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export const VOCAB_CATEGORIES = [
  '全部',
  'TOPIK 1 (初级入门)',
  'TOPIK 2 (初级进阶)',
  'TOPIK 3 (中级核心)',
  'TOPIK 4 (中级跃升)',
  'TOPIK 5-6 (高级精通)',
  '日常起居与餐饮',
  '韩国旅游与交通',
  '免税店与购物',
  '韩企职场与求职',
  'K-Pop追星应援',
  '韩剧高频口语',
  '四字成语与俗语'
];

export const KOREAN_VOCAB_DATA: VocabItem[] = """ + json.dumps(vocab_list, ensure_ascii=False, indent=2) + ";\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ 成功更新词汇库，共 {len(vocab_list)} 条单词，写入: {output_path}")

if __name__ == "__main__":
    print("CS313 内容扩充自动化脚本就绪。")
