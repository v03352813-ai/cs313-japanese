// 日语动词 10 大活用变形推导核心数据集
// 涵盖 1 类五段（各种音便与特例）、2 类一段、3 类不规则动词全套推导逻辑

export type VerbGroupType = 'group1_godan' | 'group2_ichidan' | 'group3_irregular';

export type ConjugationFormKey =
  | 'dict'        // 辞书形 (原形/终止形)
  | 'masu'        // ます形 (连用形)
  | 'te'          // て形 (连接形)
  | 'ta'          // た形 (过去形)
  | 'nai'         // ない形 (否定形)
  | 'ba'          // ば形 (假定形)
  | 'potential'   // 可能态 (可能形)
  | 'passive'     // 被动态 (受身形)
  | 'causative'   // 使役态 (使役形)
  | 'volitional'; // 意志形 (意向形)

export interface FormMeta {
  key: ConjugationFormKey;
  name: string;             // 如 "可能态 (れる/られる)"
  shortName: string;        // 如 "可能态"
  meaningTag: string;       // 如 "表示能力或客观允许"
  formulaTag: string;       // 如 "五段跳え段+る / 一段去る+られる"
  badgeColor: string;
}

export const CONJUGATION_FORMS_META: FormMeta[] = [
  { key: 'dict', name: '辞书形 (原形·终止形)', shortName: '辞书形', meaningTag: '动作原型 · 词典标准词条', formulaTag: '词尾均在う段假名', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'masu', name: 'ます形 (连用形·敬体)', shortName: 'ます形', meaningTag: '日常礼貌体 · 敬语基础', formulaTag: '五段跳い段+ます / 一段去る+ます', badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { key: 'te', name: 'て形 (连接形·进行中)', shortName: 'て形', meaningTag: '动作相继 / 正在进行 / 轻微祈使', formulaTag: '促音/拨音/イ音便法则', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { key: 'ta', name: 'た形 (过去形·完成态)', shortName: 'た形', meaningTag: '动作已完成 · 过去发生', formulaTag: '变化规则与て形完全一致(换た)', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { key: 'nai', name: 'ない形 (否定未然形)', shortName: 'ない形', meaningTag: '不做某事 · 否定意味', formulaTag: '五段跳あ段+ない / 一段去る+ない', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { key: 'ba', name: 'ば形 (假定形·条件)', shortName: 'ば形', meaningTag: '只要……就…… / 假定条件', formulaTag: '词尾跳え段+ば', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { key: 'potential', name: '可能态 (可能形·能力)', shortName: '可能态', meaningTag: '能够 / 可以 / 具备某种技能', formulaTag: '五段跳え段+る / 一段去る+られる', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { key: 'passive', name: '被动态 (受身形·被动)', shortName: '被动态', meaningTag: '被…… / 遭受某种影响', formulaTag: '五段跳あ段+れる / 一段去る+られる', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'causative', name: '使役态 (使役形·致使)', shortName: '使役态', meaningTag: '让某人做…… / 叫某人去……', formulaTag: '五段跳あ段+せる / 一段去る+させる', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'volitional', name: '意志形 (意向形·劝诱)', shortName: '意志形', meaningTag: '让我们……吧 / 打算做某事', formulaTag: '五段跳お段长音+う / 一段去る+よう', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
];

export interface DerivationDetail {
  stem: string;              // 词干部分 (例如 "書")
  originalEnding: string;    // 原词尾 (例如 "く")
  stepExplanation: string;   // 跃迁推导说明 (例如 "原词尾「く」(u段) ➔ 向上跃迁至 え段假名「け」")
  connectionEnding: string;  // 附加接续 (例如 "る")
  result: string;            // 最终形态 (例如 "書ける")
  furigana: string;          // 假名全注音 (例如 "かける")
  romaji: string;            // 罗马音 (例如 "kakeru")
  meaning: string;           // 中文含义 (例如 "能写 / 可以写")
  soundEffectTag?: string;   // 如 "イ音便", "促音便", "拨音便", "跳え段", "去る接续"
  exampleJa: string;         // 真题例句 (日文)
  exampleZh: string;         // 真题例句 (中文)
  trapNotes?: string;        // 考点避坑提示
}

export interface ConjugatorVerbItem {
  id: string;
  kanji: string;             // 汉字形式 (如 "書く", "食べる", "する")
  hiragana: string;          // 假名形式 (如 "かく", "たべる", "する")
  romaji: string;            // 罗马音 (如 "kaku")
  meaning: string;           // 中文原意 (如 "写 / 书写")
  group: VerbGroupType;      // 分类
  groupLabel: string;        // 如 "1类动词 (五段·く尾)"
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2';
  isFree: boolean;           // 免费试学 vs VIP
  specialFeatureBadge?: string; // 如 "イ音便典型", "促音便特例", "似一段实五段"
  forms: Record<ConjugationFormKey, DerivationDetail>;
}

export const VERB_CONJUGATOR_DATABASE: ConjugatorVerbItem[] = [
  // ==================== 1类 五段动词 典型库 ====================
  {
    id: 'kaku',
    kanji: '書く',
    hiragana: 'かく',
    romaji: 'kaku',
    meaning: '写 / 书写',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·く尾)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: 'イ音便典型',
    forms: {
      dict: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '原形词典形，词尾保留在う段假名「く」',
        connectionEnding: '',
        result: '書く',
        furigana: 'かく',
        romaji: 'kaku',
        meaning: '写 (原型)',
        exampleJa: '毎日日記を書く。',
        exampleZh: '每天写日记。'
      },
      masu: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 い段假名「き」 + ます',
        connectionEnding: 'きます',
        result: '書きます',
        furigana: 'かきます',
        romaji: 'kakimasu',
        meaning: '写 (敬体)',
        soundEffectTag: '跃迁至い段',
        exampleJa: '先生に手紙を書きます。',
        exampleZh: '给老师写信。'
      },
      te: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '「く」结尾动词发生【イ音便】：く 变 い + て',
        connectionEnding: 'いて',
        result: '書いて',
        furigana: 'かいて',
        romaji: 'kaite',
        meaning: '写着 / 请写',
        soundEffectTag: 'イ音便 (く→いて)',
        exampleJa: 'ここに名前を書いてください。',
        exampleZh: '请在这里写下名字。',
        trapNotes: '💡 重点：く结尾变いて，但特例「行く」变「行って」(促音便)！'
      },
      ta: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '规则与て形同理，发生【イ音便】：く 变 い + た',
        connectionEnding: 'いた',
        result: '書いた',
        furigana: 'かいた',
        romaji: 'kaita',
        meaning: '写了 (过去完成)',
        soundEffectTag: 'イ音便 (く→いた)',
        exampleJa: '昨日レポートを書いた。',
        exampleZh: '昨天写了报告。'
      },
      nai: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 あ段假名「か」 + ない',
        connectionEnding: 'かない',
        result: '書かない',
        furigana: 'かかない',
        romaji: 'kakanai',
        meaning: '不写 (否定未然)',
        soundEffectTag: '跃迁至あ段',
        exampleJa: '悪口は決して書かない。',
        exampleZh: '绝不写坏话。'
      },
      ba: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 え段假名「け」 + ば',
        connectionEnding: 'けば',
        result: '書けば',
        furigana: 'かけば',
        romaji: 'kakeba',
        meaning: '如果写的话 (假定)',
        soundEffectTag: '跃迁至え段',
        exampleJa: '書けば書くほど上手になる。',
        exampleZh: '越写就会越熟练。'
      },
      potential: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 え段假名「け」 + る',
        connectionEnding: 'ける',
        result: '書ける',
        furigana: 'かける',
        romaji: 'kakeru',
        meaning: '能写 / 会写 (可能态)',
        soundEffectTag: '五段跃迁至え段+る',
        exampleJa: '漢字が上手に書ける。',
        exampleZh: '能够把汉字写得很工整。',
        trapNotes: '💡 可能态动词前表示宾语的「を」通常转为「が」（漢字が書ける）。'
      },
      passive: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 あ段假名「か」 + れる',
        connectionEnding: 'かれる',
        result: '書かれる',
        furigana: 'かかれる',
        romaji: 'kakareru',
        meaning: '被写 (被动态/受身)',
        soundEffectTag: '五段跃迁至あ段+れる',
        exampleJa: '週刊誌に変な記事を書かれた。',
        exampleZh: '被周刊杂志写了奇怪的报道。'
      },
      causative: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 あ段假名「か」 + せる',
        connectionEnding: 'かせる',
        result: '書かせる',
        furigana: 'kakaseru',
        romaji: 'kakaseru',
        meaning: '让……写 / 叫……写 (使役态)',
        soundEffectTag: '五段跃迁至あ段+せる',
        exampleJa: '先生は生徒に作文を書かせた。',
        exampleZh: '老师让学生写了作文。'
      },
      volitional: {
        stem: '書',
        originalEnding: 'く',
        stepExplanation: '词尾「く」(u段) 跃迁到 お段长音「こう」',
        connectionEnding: 'こう',
        result: '書こう',
        furigana: 'かこう',
        romaji: 'kakou',
        meaning: '写吧 / 打算写 (意志形)',
        soundEffectTag: '五段跃迁至お段长音',
        exampleJa: 'これからの計画を書こう。',
        exampleZh: '把接下来的计划写下来吧。'
      }
    }
  },

  {
    id: 'iku',
    kanji: '行く',
    hiragana: 'いく',
    romaji: 'iku',
    meaning: '去 / 前往',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·促音便特例)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '⚠️ 促音便全日语最大特例',
    forms: {
      dict: { stem: '行', originalEnding: 'く', stepExplanation: '原形词典形，词尾在う段假名「く」', connectionEnding: '', result: '行く', furigana: 'いく', romaji: 'iku', meaning: '去 (原型)', exampleJa: '明日東京へ行く。', exampleZh: '明天去东京。' },
      masu: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳い段「き」+ ます', connectionEnding: 'きます', result: '行きます', furigana: 'いきます', romaji: 'ikimasu', meaning: '去 (敬体)', soundEffectTag: '跃迁至い段', exampleJa: '会社へ行きます。', exampleZh: '去公司。' },
      te: { stem: '行', originalEnding: 'く', stepExplanation: '【JLPT高频必考特例】「行く」不遵循イ音便，强制发生【促音便】：变「行って」！', connectionEnding: 'って', result: '行って', furigana: 'いって', romaji: 'itte', meaning: '去 / 前往 (连接)', soundEffectTag: '🚨 促音便特例 (绝非いいて)', exampleJa: '早く行ってください。', exampleZh: '请快点去。', trapNotes: '⚠️ 极其高频避坑：書く→書いて(イ音便)，但行く绝不是「いいて」，必须是「行って」！' },
      ta: { stem: '行', originalEnding: 'く', stepExplanation: '与て形同理，特例发生【促音便】：变「行った」', connectionEnding: 'った', result: '行った', furigana: 'いった', romaji: 'itta', meaning: '去了 (过去完成)', soundEffectTag: '🚨 促音便特例', exampleJa: '先月日本へ行った。', exampleZh: '上个月去了日本。' },
      nai: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳あ段「か」+ ない', connectionEnding: 'かない', result: '行かない', furigana: 'いかない', romaji: 'ikanai', meaning: '不去 (否定未然)', soundEffectTag: '跃迁至あ段', exampleJa: '今日はどこへも行かない。', exampleZh: '今天哪儿也不去。' },
      ba: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳え段「け」+ ば', connectionEnding: 'けば', result: '行けば', furigana: 'いけば', romaji: 'ikeba', meaning: '如果去的话 (假定)', soundEffectTag: '跃迁至え段', exampleJa: 'まっすぐ行けば駅に着きます。', exampleZh: '笔直往前走的话就会到达车站。' },
      potential: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳え段「け」+ る', connectionEnding: 'ける', result: '行ける', furigana: 'いける', romaji: 'ikeru', meaning: '能去 / 可以去 (可能态)', soundEffectTag: '跃迁至え段+る', exampleJa: '一人でも行けますか。', exampleZh: '一个人也能去吗？' },
      passive: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳あ段「か」+ れる', connectionEnding: 'かれる', result: '行かれる', furigana: 'いかれる', romaji: 'ikareru', meaning: '被去 / 被别人去了 (间接受害受身)', soundEffectTag: '跃迁至あ段+れる', exampleJa: '雨に行かれて困った。', exampleZh: '遇上被雨淋困扰了。' },
      causative: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳あ段「か」+ せる', connectionEnding: 'かせる', result: '行かせる', furigana: 'いかせる', romaji: 'ikaseru', meaning: '让……去 (使役态)', soundEffectTag: '跃迁至あ段+せる', exampleJa: '子供を塾に行かせる。', exampleZh: '让孩子去补习班。' },
      volitional: { stem: '行', originalEnding: 'く', stepExplanation: '「く」跳お段长音「こう」', connectionEnding: 'こう', result: '行こう', furigana: 'いこう', romaji: 'ikou', meaning: '去吧 / 走吧 (意志形)', soundEffectTag: '跃迁至お段长音', exampleJa: '一緒に海へ行こう！', exampleZh: '一起去海边吧！' }
    }
  },

  {
    id: 'nomu',
    kanji: '飲む',
    hiragana: 'のむ',
    romaji: 'nomu',
    meaning: '喝 / 饮用',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·む尾)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '拨音便典型 (んで)',
    forms: {
      dict: { stem: '飲', originalEnding: 'む', stepExplanation: '原形词典形，词尾在う段假名「む」', connectionEnding: '', result: '飲む', furigana: 'のむ', romaji: 'nomu', meaning: '喝 (原型)', exampleJa: 'お茶を飲む。', exampleZh: '喝茶。' },
      masu: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳い段「み」+ ます', connectionEnding: 'みます', result: '飲みます', furigana: 'のみます', romaji: 'nomimasu', meaning: '喝 (敬体)', soundEffectTag: '跃迁至い段', exampleJa: '毎朝コーヒーを飲みます。', exampleZh: '每天早晨喝咖啡。' },
      te: { stem: '飲', originalEnding: 'む', stepExplanation: '「ぬ/ぶ/む」结尾发生【拨音便】：む 变 ん + 浊音「で」', connectionEnding: 'んで', result: '飲んで', furigana: 'のんで', romaji: 'nonde', meaning: '喝着 / 请喝', soundEffectTag: '拨音便 (む→んで)', exampleJa: '温かいミルクを飲んで寝る。', exampleZh: '喝热牛奶然后睡觉。', trapNotes: '💡 记住口诀：“鼻音ぬぶむ，拨音ん加浊音で”。' },
      ta: { stem: '飲', originalEnding: 'む', stepExplanation: '同理拨音便：む 变 ん + 浊音「だ」', connectionEnding: 'んだ', result: '飲んだ', furigana: 'のんだ', romaji: 'nonda', meaning: '喝了 (过去完成)', soundEffectTag: '拨音便 (む→んだ)', exampleJa: '風邪薬を飲んだ。', exampleZh: '喝了感冒药。' },
      nai: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳あ段「ま」+ ない', connectionEnding: 'まない', result: '飲まない', furigana: 'のまない', romaji: 'nomanai', meaning: '不喝 (否定未然)', soundEffectTag: '跃迁至あ段', exampleJa: 'お酒は一切飲まない。', exampleZh: '一点酒都不喝。' },
      ba: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳え段「め」+ ば', connectionEnding: 'めば', result: '飲めば', furigana: 'のめば', romaji: 'nomeba', meaning: '如果喝的话 (假定)', soundEffectTag: '跃迁至え段', exampleJa: '薬を飲めば治るよ。', exampleZh: '只要吃药就会治好的。' },
      potential: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳え段「め」+ る', connectionEnding: 'める', result: '飲める', furigana: 'のめる', romaji: 'nomeru', meaning: '能喝 / 会喝酒 (可能态)', soundEffectTag: '五段跃迁至え段+る', exampleJa: '冷たい水が飲める。', exampleZh: '能喝上凉水了。' },
      passive: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳あ段「ま」+ れる', connectionEnding: 'まれる', result: '飲まれる', furigana: 'のまれる', romaji: 'nomareru', meaning: '被喝掉 / 被别人喝了 (受身)', soundEffectTag: '五段跃迁至あ段+れる', exampleJa: '冷蔵庫のプリンを弟に飲まれた。', exampleZh: '冰箱里的布丁饮料被弟弟喝了。' },
      causative: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳あ段「ま」+ せる', connectionEnding: 'ませる', result: '飲ませる', furigana: 'のませる', romaji: 'nomaseru', meaning: '让……喝 / 喂喝 (使役态)', soundEffectTag: '五段跃迁至あ段+せる', exampleJa: '赤ちゃんにミルクを飲ませる。', exampleZh: '给小婴儿喂奶喝。' },
      volitional: { stem: '飲', originalEnding: 'む', stepExplanation: '「む」跳お段长音「もう」', connectionEnding: 'もう', result: '飲もう', furigana: 'のもう', romaji: 'nomou', meaning: '喝吧 / 干一杯 (意志形)', soundEffectTag: '五段跃迁至お段长音', exampleJa: '今晩祝杯を飲もう！', exampleZh: '今晚干一杯庆祝酒吧！' }
    }
  },

  {
    id: 'kau',
    kanji: '買う',
    hiragana: 'かう',
    romaji: 'kau',
    meaning: '买 / 购买',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·う尾)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '促音便典型 (って)',
    forms: {
      dict: { stem: '買', originalEnding: 'う', stepExplanation: '原形词典形，词尾在う段假名「う」', connectionEnding: '', result: '買う', furigana: 'かう', romaji: 'kau', meaning: '买 (原型)', exampleJa: '本屋で辞書を買う。', exampleZh: '在书店买词典。' },
      masu: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳い段「い」+ ます', connectionEnding: 'います', result: '買います', furigana: 'かいます', romaji: 'kaimasu', meaning: '买 (敬体)', soundEffectTag: '跃迁至い段', exampleJa: '新しい靴を買います。', exampleZh: '买新鞋。' },
      te: { stem: '買', originalEnding: 'う', stepExplanation: '「う/つ/る」结尾发生【促音便】：う 变 っ + て', connectionEnding: 'って', result: '買って', furigana: 'かって', romaji: 'katte', meaning: '买着 / 请买', soundEffectTag: '促音便 (う→って)', exampleJa: 'お土産を買って帰る。', exampleZh: '买了特产带回家。', trapNotes: '💡 口诀：“うつる结尾促音便，小っ加て音更脆”。' },
      ta: { stem: '買', originalEnding: 'う', stepExplanation: '同理促音便：う 变 っ + た', connectionEnding: 'った', result: '買った', furigana: 'かった', romaji: 'katta', meaning: '买了 (过去完成)', soundEffectTag: '促音便 (う→った)', exampleJa: '切符を買った。', exampleZh: '买好票了。' },
      nai: { stem: '買', originalEnding: 'う', stepExplanation: '【极高频陷阱】「う」结尾动词跳あ段不变成「あ」，而是变成「わ」！+ ない', connectionEnding: 'わない', result: '買わない', furigana: 'かわない', romaji: 'kawanai', meaning: '不买 (否定未然)', soundEffectTag: '⚠️ う→わ 绝非かあない', exampleJa: '無駄なものは買わない。', exampleZh: '不买没有用的东西。', trapNotes: '⚠️ 考点避坑：う结尾变否定必化为「わ」（如買う→買わない、言う→言わない）。' },
      ba: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳え段「え」+ ば', connectionEnding: 'えば', result: '買えば', furigana: 'かえば', romaji: 'kaeba', meaning: '如果买的话 (假定)', soundEffectTag: '跃迁至え段', exampleJa: '安ければ買えばいい。', exampleZh: '便宜的话买就行了。' },
      potential: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳え段「え」+ る', connectionEnding: 'える', result: '買える', furigana: 'かえる', romaji: 'kaeru', meaning: '能买 / 买得起 (可能态)', soundEffectTag: '五段跃迁至え段+る', exampleJa: 'この店で安く買える。', exampleZh: '在这家店可以便宜买到。' },
      passive: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳あ段变「わ」+ れる', connectionEnding: 'われる', result: '買われる', furigana: 'かわれる', romaji: 'kawareru', meaning: '被买走 / 被赏识 (受身)', soundEffectTag: '跳あ段(わ)+れる', exampleJa: '最後の一冊が買われた。', exampleZh: '最后一本书被买走了。' },
      causative: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳あ段变「わ」+ せる', connectionEnding: 'わせる', result: '買わせる', furigana: 'かわせる', romaji: 'kawaseru', meaning: '让……买 (使役态)', soundEffectTag: '跳あ段(わ)+せる', exampleJa: '子供におもちゃを買わせられた。', exampleZh: '被孩子缠着给买了玩具。' },
      volitional: { stem: '買', originalEnding: 'う', stepExplanation: '「う」跳お段长音「おう」', connectionEnding: 'おう', result: '買おう', furigana: 'かおう', romaji: 'kaou', meaning: '买吧 / 打算买 (意志形)', soundEffectTag: '五段跃迁至お段长音', exampleJa: '新しいパソコンを買おう。', exampleZh: '打算买一台新电脑。' }
    }
  },

  {
    id: 'matsu',
    kanji: '待つ',
    hiragana: 'まつ',
    romaji: 'matsu',
    meaning: '等 / 等待',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·つ尾)',
    jlptLevel: 'N5',
    isFree: false,
    specialFeatureBadge: '促音便 (待って)',
    forms: {
      dict: { stem: '待', originalEnding: 'つ', stepExplanation: '原形词典形，词尾在「つ」', connectionEnding: '', result: '待つ', furigana: 'まつ', romaji: 'matsu', meaning: '等 (原型)', exampleJa: '駅で友達を待つ。', exampleZh: '在车站等朋友。' },
      masu: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳い段「ち」+ ます', connectionEnding: 'ちます', result: '待ちます', furigana: 'まちます', romaji: 'machimasu', meaning: '等 (敬体)', soundEffectTag: '跃迁至い段 (ち)', exampleJa: 'ロビーでお待ちします。', exampleZh: '在大厅等候您。' },
      te: { stem: '待', originalEnding: 'つ', stepExplanation: '「う/つ/る」结尾发生【促音便】：つ 变 っ + て', connectionEnding: 'って', result: '待って', furigana: 'まって', romaji: 'matte', meaning: '等等 / 请等', soundEffectTag: '促音便 (つ→って)', exampleJa: 'ちょっと待ってください。', exampleZh: '请稍等一下。' },
      ta: { stem: '待', originalEnding: 'つ', stepExplanation: '同理促音便：つ 变 っ + た', connectionEnding: 'った', result: '待った', furigana: 'まった', romaji: 'matta', meaning: '等过了 (过去完成)', soundEffectTag: '促音便 (つ→った)', exampleJa: '一時間も待った。', exampleZh: '等了整整一个小时。' },
      nai: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳あ段「た」+ ない', connectionEnding: 'たない', result: '待たない', furigana: 'またない', romaji: 'matanai', meaning: '不等 (否定未然)', soundEffectTag: '跃迁至あ段 (た)', exampleJa: 'これ以上待たない。', exampleZh: '不再等下去了。' },
      ba: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳え段「て」+ ば', connectionEnding: 'てば', result: '待てば', furigana: 'まてば', romaji: 'mateba', meaning: '如果等的话 (假定)', soundEffectTag: '跃迁至え段 (て)', exampleJa: '待てば海路の日和あり。', exampleZh: '只要耐心等待，自会有好运到来。' },
      potential: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳え段「て」+ る', connectionEnding: 'てる', result: '待てる', furigana: 'まてる', romaji: 'materu', meaning: '能等 / 等得及 (可能态)', soundEffectTag: '五段跃迁至え段+る', exampleJa: 'あと五分なら待てる。', exampleZh: '如果是五分钟的话我能等。' },
      passive: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳あ段「た」+ れる', connectionEnding: 'たれる', result: '待たれる', furigana: 'またれる', romaji: 'matareru', meaning: '被等待 / 翘首以盼 (受身)', soundEffectTag: '跃迁至あ段+れる', exampleJa: '解決が待たれる。', exampleZh: '人们翘首以待解决结果。' },
      causative: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳あ段「た」+ せる', connectionEnding: 'たせる', result: '待たせる', furigana: 'mataseru', meaning: '让……久等 (使役态)', soundEffectTag: '跃迁至あ段+せる', exampleJa: 'お待たせして申し訳ありません。', exampleZh: '让您久等了，实在抱歉。' },
      volitional: { stem: '待', originalEnding: 'つ', stepExplanation: '「つ」跳お段长音「とう」', connectionEnding: 'とう', result: '待とう', furigana: 'まとう', romaji: 'matou', meaning: '等等吧 (意志形)', soundEffectTag: '五段跃迁至お段长音', exampleJa: '雨が止むまで待とう。', exampleZh: '等到雨停吧。' }
    }
  },

  {
    id: 'hanasu',
    kanji: '話す',
    hiragana: 'はなす',
    romaji: 'hanasu',
    meaning: '说 / 讲 / 交流',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·す尾)',
    jlptLevel: 'N5',
    isFree: false,
    specialFeatureBadge: 'す尾无音便 (して)',
    forms: {
      dict: { stem: '話', originalEnding: 'す', stepExplanation: '原形词典形，词尾在「す」', connectionEnding: '', result: '話す', furigana: 'はなす', romaji: 'hanasu', meaning: '说 (原型)', exampleJa: '日本語で話す。', exampleZh: '用日语交谈。' },
      masu: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳い段「し」+ ます', connectionEnding: 'します', result: '話します', furigana: 'はなします', romaji: 'hanashimasu', meaning: '说 (敬体)', soundEffectTag: '跃迁至い段 (し)', exampleJa: '真実を話します。', exampleZh: '说出真相。' },
      te: { stem: '話', originalEnding: 'す', stepExplanation: '【注意】「す」结尾动词【不发生音便】，直接变「して」！', connectionEnding: 'して', result: '話して', furigana: 'はなして', romaji: 'hanashite', meaning: '说着 / 请讲', soundEffectTag: '无音便 (す→して)', exampleJa: 'ゆっくり話してください。', exampleZh: '请慢点说。', trapNotes: '💡 辨析：す结尾没有促音便或拨音便，直接是して。' },
      ta: { stem: '話', originalEnding: 'す', stepExplanation: '同样无音便：す 变「した」', connectionEnding: 'した', result: '話した', furigana: 'はなした', romaji: 'hanashita', meaning: '说了 (过去完成)', soundEffectTag: '无音便 (す→した)', exampleJa: 'さっき電話で話した。', exampleZh: '刚才在电话里说了。' },
      nai: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳あ段「さ」+ ない', connectionEnding: 'さない', result: '話さない', furigana: 'はなさない', romaji: 'hanasanai', meaning: '不说 (否定未然)', soundEffectTag: '跃迁至あ段 (さ)', exampleJa: '誰にも話さないで。', exampleZh: '请不要告诉任何人。' },
      ba: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳え段「せ」+ ば', connectionEnding: 'せば', result: '話せば', furigana: 'はなせば', romaji: 'haseba', meaning: '如果说的话 (假定)', soundEffectTag: '跃迁至え段 (せ)', exampleJa: '話せばわかる。', exampleZh: '只要说清楚就能理解。' },
      potential: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳え段「せ」+ る', connectionEnding: 'せる', result: '話せる', furigana: 'はなせる', romaji: 'hanaseru', meaning: '会说 / 能表达 (可能态)', soundEffectTag: '五段跃迁至え段+る', exampleJa: '英語が話せますか。', exampleZh: '你会说英语吗？' },
      passive: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳あ段「さ」+ れる', connectionEnding: 'される', result: '話される', furigana: 'はなされる', romaji: 'hanasareru', meaning: '被说起 / 被议论 (受身)', soundEffectTag: '跃迁至あ段+れる', exampleJa: '世界中で話されている。', exampleZh: '在全世界被使用交谈着。' },
      causative: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳あ段「さ」+ せる', connectionEnding: 'させる', result: '話させる', furigana: 'はなさせる', romaji: 'hanasaseru', meaning: '让……说 (使役态)', soundEffectTag: '跃迁至あ段+せる', exampleJa: '彼に自由に話させよう。', exampleZh: '让他自由地说吧。' },
      volitional: { stem: '話', originalEnding: 'す', stepExplanation: '「す」跳お段长音「そう」', connectionEnding: 'そう', result: '話そう', furigana: 'はなそう', romaji: 'hanasou', meaning: '说吧 / 聊聊吧 (意志形)', soundEffectTag: '五段跃迁至お段长音', exampleJa: '未来について話そう。', exampleZh: '来聊聊未来吧。' }
    }
  },

  {
    id: 'kaeru',
    kanji: '帰る',
    hiragana: 'かえる',
    romaji: 'kaeru',
    meaning: '回去 / 回家',
    group: 'group1_godan',
    groupLabel: '1类动词 (五段·似一段实五段特例)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '⚠️ 貌似一段实为五段',
    forms: {
      dict: { stem: '帰', originalEnding: 'る', stepExplanation: '虽倒数第二假名在「え段」，但属于【特殊五段动词】！', connectionEnding: '', result: '帰る', furigana: 'かえる', romaji: 'kaeru', meaning: '回去 (原型)', exampleJa: '家に帰る。', exampleZh: '回家。' },
      masu: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳い段「り」+ ます（绝非かえます）', connectionEnding: 'ります', result: '帰ります', furigana: 'かえります', romaji: 'kaerimasu', meaning: '回 (敬体)', soundEffectTag: '五段跳い段 (り)', exampleJa: '六時に帰ります。', exampleZh: '六点回家。', trapNotes: '⚠️ 大陷阱：若是2类一段会变「かえます」，但它是1类五段，必须是「かえります」！' },
      te: { stem: '帰', originalEnding: 'る', stepExplanation: '五段「る」结尾发生【促音便】：る 变 っ + て', connectionEnding: 'って', result: '帰って', furigana: 'かえって', romaji: 'kaette', meaning: '回去 (连接)', soundEffectTag: '促音便 (る→って)', exampleJa: '早く帰ってください。', exampleZh: '请早点回去。' },
      ta: { stem: '帰', originalEnding: 'る', stepExplanation: '五段促音便：る 变 っ + た', connectionEnding: 'った', result: '帰った', furigana: 'かえった', romaji: 'kaetta', meaning: '回去了 (完成态)', soundEffectTag: '促音便 (る→った)', exampleJa: '父はもう帰った。', exampleZh: '父亲已经回家了。' },
      nai: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳あ段「ら」+ ない', connectionEnding: 'らない', result: '帰らない', furigana: 'かえらない', romaji: 'kaeranai', meaning: '不回 (否定)', soundEffectTag: '五段跳あ段 (ら)', exampleJa: '今日は帰らない。', exampleZh: '今天不回去了。' },
      ba: { stem: '帰', originalEnding: 'る', stepExplanation: 'る 跳え段「れ」+ ば', connectionEnding: 'れば', result: '帰れば', furigana: 'かえれば', romaji: 'kaereba', meaning: '如果回去的话 (假定)', soundEffectTag: '五段跳え段 (れ)', exampleJa: '帰れば安心する。', exampleZh: '回去了就会安心。' },
      potential: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳え段「れ」+ る（绝非かえられる）', connectionEnding: 'れる', result: '帰れる', furigana: 'かえれる', romaji: 'kaereru', meaning: '能回 / 可以回家 (可能态)', soundEffectTag: '五段跳え段+る', exampleJa: '終電に間に合って帰れる。', exampleZh: '赶上末班车能回去了。' },
      passive: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳あ段「ら」+ れる', connectionEnding: 'られる', result: '帰られる', furigana: 'かえられる', romaji: 'kaerareru', meaning: '被回去 / 客人告辞走了 (受身/敬语)', soundEffectTag: '五段跳あ段+れる', exampleJa: '客に早く帰られた。', exampleZh: '客人早早就告辞走了。' },
      causative: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳あ段「ら」+ せる', connectionEnding: 'らせる', result: '帰らせる', furigana: 'かえらせる', romaji: 'kaeraseru', meaning: '让……回去 (使役态)', soundEffectTag: '五段跳あ段+せる', exampleJa: '部下を先に帰らせた。', exampleZh: '让下属先回去了。' },
      volitional: { stem: '帰', originalEnding: 'る', stepExplanation: '五段规律：る 跳お段长音「ろう」', connectionEnding: 'ろう', result: '帰ろう', furigana: 'かえろう', romaji: 'kaerou', meaning: '回去吧 (意志形)', soundEffectTag: '五段跳お段长音', exampleJa: 'そろそろ帰ろう。', exampleZh: '差不多该回家了吧。' }
    }
  },

  // ==================== 2类 一段动词 典型库 ====================
  {
    id: 'taberu',
    kanji: '食べる',
    hiragana: 'たべる',
    romaji: 'taberu',
    meaning: '吃 / 用餐',
    group: 'group2_ichidan',
    groupLabel: '2类动词 (下一段)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '一段动词基准法则 (去る接续)',
    forms: {
      dict: { stem: '食べ', originalEnding: 'る', stepExplanation: '倒数第二假名「べ」在え段，标准下一段动词', connectionEnding: '', result: '食べる', furigana: 'たべる', romaji: 'taberu', meaning: '吃 (原型)', exampleJa: '朝ご飯を食べる。', exampleZh: '吃早饭。' },
      masu: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词极简法则：直接【去る + ます】', connectionEnding: 'ます', result: '食べます', furigana: 'たべます', romaji: 'tabemasu', meaning: '吃 (敬体)', soundEffectTag: '去る+ます', exampleJa: '寿司を食べます。', exampleZh: '吃寿司。' },
      te: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词无任何音便：直接【去る + て】', connectionEnding: 'て', result: '食べて', furigana: 'たべて', romaji: 'tabete', meaning: '吃着 / 请吃', soundEffectTag: '去る+て (无音便)', exampleJa: '残さず食べてね。', exampleZh: '要吃完不要剩下哦。' },
      ta: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词法则：直接【去る + た】', connectionEnding: 'た', result: '食べた', furigana: 'たべた', romaji: 'tabeta', meaning: '吃了 (过去完成)', soundEffectTag: '去る+た', exampleJa: 'もう昼ご飯を食べた。', exampleZh: '已经吃了午饭。' },
      nai: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词法则：直接【去る + ない】', connectionEnding: 'ない', result: '食べない', furigana: 'たべない', romaji: 'tabenai', meaning: '不吃 (否定未然)', soundEffectTag: '去る+ない', exampleJa: '朝は何も食べない。', exampleZh: '早晨什么也不吃。' },
      ba: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词法则：直接【去る + れば】', connectionEnding: 'れば', result: '食べれば', furigana: 'たべれば', romaji: 'tabereba', meaning: '如果吃的话 (假定)', soundEffectTag: '去る+れば', exampleJa: '食べれば元気になる。', exampleZh: '吃了就会恢复精神。' },
      potential: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词可能态法则：【去る + られる】（口语常约音为食べれる）', connectionEnding: 'られる', result: '食べられる', furigana: 'たべられる', romaji: 'taberareru', meaning: '能吃 / 吃得下 (可能态)', soundEffectTag: '去る+られる', exampleJa: '辛い料理も食べられる。', exampleZh: '辣菜也吃得下。', trapNotes: '💡 提示：口语常省略ら变成「食べれる」(ら抜き言葉)，但JLPT标准考试必须写作「食べられる」！' },
      passive: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词被动态法则：【去る + られる】（形态与可能态完全一致）', connectionEnding: 'られる', result: '食べられる', furigana: 'たべられる', romaji: 'taberareru', meaning: '被吃掉 (受身)', soundEffectTag: '去る+られる', exampleJa: '猫に魚を食べられた。', exampleZh: '鱼被猫吃掉了。', trapNotes: '💡 重点区分：一段动词的「可能态」与「被动态」拼写完全相同，靠助词与语境区分！' },
      causative: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词使役态法则：【去る + させる】', connectionEnding: 'させる', result: '食べさせる', furigana: 'たべさせる', romaji: 'tabesaseru', meaning: '让……吃 / 喂食 (使役态)', soundEffectTag: '去る+させる', exampleJa: '野菜を無理に食べさせない。', exampleZh: '不要强迫孩子吃蔬菜。' },
      volitional: { stem: '食べ', originalEnding: 'る', stepExplanation: '一段动词意志形法则：【去る + よう】', connectionEnding: 'よう', result: '食べよう', furigana: 'たべよう', romaji: 'tabeyou', meaning: '吃吧 / 开动吧 (意志形)', soundEffectTag: '去る+よう', exampleJa: '温かいうちに食べよう！', exampleZh: '趁热开吃吧！' }
    }
  },

  {
    id: 'miru',
    kanji: '見る',
    hiragana: 'みる',
    romaji: 'miru',
    meaning: '看 / 观看',
    group: 'group2_ichidan',
    groupLabel: '2类动词 (上一段)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '上一段单假名极简典型',
    forms: {
      dict: { stem: '見', originalEnding: 'る', stepExplanation: '词干仅为「み」(い段)，典型上一段动词', connectionEnding: '', result: '見る', furigana: 'みる', romaji: 'miru', meaning: '看 (原型)', exampleJa: '映画を見る。', exampleZh: '看电影。' },
      masu: { stem: '見', originalEnding: 'る', stepExplanation: '去る + ます', connectionEnding: 'ます', result: '見ます', furigana: 'みます', romaji: 'mimasu', meaning: '看 (敬体)', soundEffectTag: '去る+ます', exampleJa: 'テレビを見ます。', exampleZh: '看电视。' },
      te: { stem: '見', originalEnding: 'る', stepExplanation: '去る + て', connectionEnding: 'て', result: '見て', furigana: 'みて', romaji: 'mite', meaning: '看着 / 请看', soundEffectTag: '去る+て', exampleJa: '前をよく見て歩く。', exampleZh: '好好看前面走路。' },
      ta: { stem: '見', originalEnding: 'る', stepExplanation: '去る + た', connectionEnding: 'た', result: '見た', furigana: 'みた', romaji: 'mita', meaning: '看了 (过去完成)', soundEffectTag: '去る+た', exampleJa: 'その景色を見たことがある。', exampleZh: '曾看过那番景色。' },
      nai: { stem: '見', originalEnding: 'る', stepExplanation: '去る + ない', connectionEnding: 'ない', result: '見ない', furigana: 'みない', romaji: 'minai', meaning: '不看 (否定未然)', soundEffectTag: '去る+ない', exampleJa: 'スマホばかり見ないで。', exampleZh: '不要老是看手机。' },
      ba: { stem: '見', originalEnding: 'る', stepExplanation: '去る + れば', connectionEnding: 'れば', result: '見れば', furigana: 'みれば', romaji: 'mireba', meaning: '如果看的话 (假定)', soundEffectTag: '去る+れば', exampleJa: '見ればすぐ分かる。', exampleZh: '只要看了马上就会明白。' },
      potential: { stem: '見', originalEnding: 'る', stepExplanation: '去る + られる（注意与見える区分）', connectionEnding: 'られる', result: '見られる', furigana: 'みられる', romaji: 'mirareru', meaning: '能看 / 能观赏到 (有意识可能)', soundEffectTag: '去る+られる', exampleJa: '屋上から富士山が見られる。', exampleZh: '从天台可以观赏到富士山。', trapNotes: '💡 避坑：見られる是有意识的主观能力；見える是无意识的客观映入眼帘。' },
      passive: { stem: '見', originalEnding: 'る', stepExplanation: '去る + られる', connectionEnding: 'られる', result: '見られる', furigana: 'みられる', romaji: 'mirareru', meaning: '被看到 / 被注视 (受身)', soundEffectTag: '去る+られる', exampleJa: '誰かに見られている気がする。', exampleZh: '感觉被什么人注视着。' },
      causative: { stem: '見', originalEnding: 'る', stepExplanation: '去る + させる', connectionEnding: 'させる', result: '見させる', furigana: 'みさせる', romaji: 'misaseru', meaning: '让……看 (使役态)', soundEffectTag: '去る+させる', exampleJa: '医者に傷口を見させる。', exampleZh: '让医生查看伤口。' },
      volitional: { stem: '見', originalEnding: 'る', stepExplanation: '去る + よう', connectionEnding: 'よう', result: '見よう', furigana: 'みよう', romaji: 'miyou', meaning: '看吧 / 去看看 (意志形)', soundEffectTag: '去る+よう', exampleJa: '話題のアニメを見よう。', exampleZh: '来看看热门动漫吧。' }
    }
  },

  // ==================== 3类 不规则动词 (サ变・カ变) ====================
  {
    id: 'suru',
    kanji: 'する',
    hiragana: 'する',
    romaji: 'suru',
    meaning: '做 / 干 / 搞',
    group: 'group3_irregular',
    groupLabel: '3类动词 (サ变核心)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '特殊音变独立记忆',
    forms: {
      dict: { stem: 'す', originalEnding: 'る', stepExplanation: 'サ变不规则动词原形', connectionEnding: '', result: 'する', furigana: 'する', romaji: 'suru', meaning: '做 (原型)', exampleJa: '宿題をする。', exampleZh: '做作业。' },
      masu: { stem: 'し', originalEnding: 'ます', stepExplanation: '不规则变化：直接变「します」', connectionEnding: 'ます', result: 'します', furigana: 'します', romaji: 'shimasu', meaning: '做 (敬体)', soundEffectTag: '不规则特例', exampleJa: '約束をします。', exampleZh: '做出约定。' },
      te: { stem: 'し', originalEnding: 'て', stepExplanation: '不规则变化：直接变「して」', connectionEnding: 'て', result: 'して', furigana: 'して', romaji: 'shite', meaning: '做着 / 请做', soundEffectTag: '不规则特例', exampleJa: '運動をして健康を保つ。', exampleZh: '做运动保持健康。' },
      ta: { stem: 'し', originalEnding: 'た', stepExplanation: '不规则变化：直接变「した」', connectionEnding: 'た', result: 'した', furigana: 'した', romaji: 'shita', meaning: '做了 (过去完成)', soundEffectTag: '不规则特例', exampleJa: '昨日大掃除をした。', exampleZh: '昨天做了大扫除。' },
      nai: { stem: 'し', originalEnding: 'ない', stepExplanation: '不规则变化：直接变「しない」', connectionEnding: 'ない', result: 'しない', furigana: 'しない', romaji: 'shinai', meaning: '不做 (否定未然)', soundEffectTag: '不规则特例', exampleJa: '後悔はしない。', exampleZh: '绝不后悔。' },
      ba: { stem: 'す', originalEnding: 'れば', stepExplanation: '不规则变化：直接变「すれば」', connectionEnding: 'れば', result: 'すれば', furigana: 'すれば', romaji: 'sureba', meaning: '如果做的话 (假定)', soundEffectTag: '不规则特例', exampleJa: '練習すれば必ずできる。', exampleZh: '只要练习就一定能做到。' },
      potential: { stem: 'で', originalEnding: 'きる', stepExplanation: '【超高频核心】「する」的可能态完全异根演变为「できる」！', connectionEnding: 'きる', result: 'できる', furigana: 'できる', romaji: 'dekiru', meaning: '能做 / 会做 / 做成 (可能态)', soundEffectTag: '🚨 完全异化 (する→できる)', exampleJa: '何でも一人でできる。', exampleZh: '什么都能一个人做到。', trapNotes: '⚠️ 极其高频避坑：绝没有「すられる」或「せられる」，必须是「できる」！' },
      passive: { stem: 'さ', originalEnding: 'れる', stepExplanation: '不规则变化：变「される」', connectionEnding: 'れる', result: 'される', furigana: 'される', romaji: 'sareru', meaning: '被做 / 被搞 (受身)', soundEffectTag: '不规则特例', exampleJa: '急に指名された。', exampleZh: '突然被点名了。' },
      causative: { stem: 'さ', originalEnding: 'せる', stepExplanation: '不规则变化：变「させる」', connectionEnding: 'せる', result: 'させる', furigana: 'させる', romaji: 'saseru', meaning: '让……做 (使役态)', soundEffectTag: '不规则特例', exampleJa: '自分で後片付けをさせる。', exampleZh: '让他自己去收拾整理。' },
      volitional: { stem: 'し', originalEnding: 'よう', stepExplanation: '不规则变化：变「しよう」', connectionEnding: 'よう', result: 'しよう', furigana: 'しよう', romaji: 'shiyou', meaning: '做吧 / 干吧 (意志形)', soundEffectTag: '不规则特例', exampleJa: '全力で挑戦しよう！', exampleZh: '拼尽全力去挑战吧！' }
    }
  },

  {
    id: 'kuru',
    kanji: '来る',
    hiragana: 'くる',
    romaji: 'kuru',
    meaning: '来 / 到来',
    group: 'group3_irregular',
    groupLabel: '3类动词 (カ变独苗)',
    jlptLevel: 'N5',
    isFree: true,
    specialFeatureBadge: '假名读音随变形大幅跳变',
    forms: {
      dict: { stem: '来', originalEnding: 'る', stepExplanation: 'カ变仅此一家！汉字写作「来」，原型读作「くる(ku-ru)」', connectionEnding: '', result: '来る', furigana: 'くる', romaji: 'kuru', meaning: '来 (原型)', exampleJa: '春が来る。', exampleZh: '春天来了。' },
      masu: { stem: '来', originalEnding: 'ます', stepExplanation: '【读音突变】词干汉字「来」由 ku 突变为 ki ➔「来ます(きます)」', connectionEnding: 'ます', result: '来ます', furigana: 'きます', romaji: 'kimasu', meaning: '来 (敬体)', soundEffectTag: '读音ku→ki', exampleJa: '明日学校へ来ます。', exampleZh: '明天来学校。' },
      te: { stem: '来', originalEnding: 'て', stepExplanation: '词干汉字「来」读作 ki ➔「来て(きて)」', connectionEnding: 'て', result: '来て', furigana: 'きて', romaji: 'kite', meaning: '来 / 请来', soundEffectTag: '读音ku→ki', exampleJa: '早くこっちへ来て！', exampleZh: '快到这边来！' },
      ta: { stem: '来', originalEnding: 'た', stepExplanation: '词干汉字「来」读作 ki ➔「来た(きた)」', connectionEnding: 'た', result: '来た', furigana: 'きた', romaji: 'kita', meaning: '来了 (过去完成)', soundEffectTag: '读音ku→ki', exampleJa: 'ついにこの日が来た。', exampleZh: '这一天终于到来了。' },
      nai: { stem: '来', originalEnding: 'ない', stepExplanation: '【读音再变】词干汉字「来」由 ku 变为 ko ➔「来ない(こない)」！', connectionEnding: 'ない', result: '来ない', furigana: 'こない', romaji: 'konai', meaning: '不来 (否定未然)', soundEffectTag: '读音ku→ko (こない)', exampleJa: '彼は時間通りに来ない。', exampleZh: '他没有按时来。', trapNotes: '⚠️ 考点避坑：否定不是きない，而是「来ない(こない)」！' },
      ba: { stem: '来', originalEnding: 'れば', stepExplanation: '词干汉字「来」读作 ku ➔「来れば(くれば)」', connectionEnding: 'れば', result: '来れば', furigana: 'くれば', romaji: 'kureba', meaning: '如果来的话 (假定)', soundEffectTag: '读音ku (くれば)', exampleJa: 'ここに来れば安心だ。', exampleZh: '只要来到这里就安心了。' },
      potential: { stem: '来', originalEnding: 'られる', stepExplanation: '词干读作 ko ➔「来られる(こられる)」', connectionEnding: 'られる', result: '来られる', furigana: 'こられる', romaji: 'korareru', meaning: '能来 / 可以来 (可能态)', soundEffectTag: '读音ko (こられる)', exampleJa: 'パーティーに来られますか。', exampleZh: '你能来参加派对吗？' },
      passive: { stem: '来', originalEnding: 'られる', stepExplanation: '词干读作 ko ➔「来られる(こられる)」', connectionEnding: 'られる', result: '来られる', furigana: 'こられる', romaji: 'korareru', meaning: '被来访 / 别人来了受困扰 (受害受身)', soundEffectTag: '读音ko (こられる)', exampleJa: '夜遅くに雨に来られた。', exampleZh: '深夜突遇来雨被淋困扰了。' },
      causative: { stem: '来', originalEnding: 'させる', stepExplanation: '词干读作 ko ➔「来させる(こさせる)」', connectionEnding: 'させる', result: '来させる', furigana: 'こさせる', romaji: 'kosaseru', meaning: '让……来 / 叫来 (使役态)', soundEffectTag: '读音ko (こさせる)', exampleJa: '明日専門家を来させる。', exampleZh: '明天叫专家过来。' },
      volitional: { stem: '来', originalEnding: 'よう', stepExplanation: '词干读作 ko ➔「来よう(こよう)」', connectionEnding: 'よう', result: '来よう', furigana: 'こよう', romaji: 'koyou', meaning: '来吧 / 打算来 (意志形)', soundEffectTag: '读音ko (こよう)', exampleJa: '明日もまた来よう！', exampleZh: '明天也再来吧！' }
    }
  }
];
