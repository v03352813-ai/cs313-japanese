# TOPIK 官方新真题自动录入与同步数据收件箱 (Incoming Inbox)

此目录为 **TOPIK 新真题自动更新闭环引擎** 的数据输入口。

## 📥 如何录入一套新公布的真题？

只需将新一届的真题 JSON 文件直接放入此文件夹（例如 `topik2_session_93.json`），运行同步命令：

```bash
npm run topik:sync
```

或者启动后台自动监听服务：
系统会自动解析文件、执行数据质量校验门禁、自动补充 20~30 行高难度学术阅读长文、自动生成全真答题卡与解析，并原子化更新到前端题库中！

## 📄 标准输入 JSON 格式模版：

```json
{
  "session": 93,
  "level": "TOPIK II (中高级 3-6级)",
  "year": "2025年最新大纲",
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "词汇语法",
      "categoryTag": "语法与词尾",
      "title": "【语法题干】...",
      "passage": "...",
      "options": ["选项1", "选项2", "选项3", "选项4"],
      "correctAnswer": 0,
      "score": 3,
      "explanation": {
        "analysis": "官方深度解析...",
        "vocabList": [{ "word": "단어", "meaning": "单词" }],
        "translation": "中文全译文..."
      }
    }
  ]
}
```
