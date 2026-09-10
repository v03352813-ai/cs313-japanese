/**
 * CS313 日语研习社 · 五十音图全套数据规范
 * 包含：46 清音、25 浊音/半浊音、33 拗音、促音、长音与拨音
 * 标配平假名、片假名、罗马字、汉字起源与趣味象形速记口诀
 */

export interface KanaItem {
  id: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  row: string; // あ行, か行...
  col: string; // 段: a, i, u, e, o
  origin: {
    hiragana: string; // 汉字草书来源 (如 "安")
    katakana: string; // 汉字楷书部首 (如 "阿的偏旁")
  };
  mnemonic: string; // 象形记忆口诀
  example: {
    word: string; // 单词汉字/假名
    hiragana: string; // 读音
    zh: string; // 中文释义
  };
  audioText: string;
}

export interface KanaRow {
  rowName: string;
  romajiConsonant: string;
  items: (KanaItem | null)[];
}

// 1. 清音 (Seion - 46音)
export const SEION_ROWS: KanaRow[] = [
  {
    rowName: 'あ行 (元音)',
    romajiConsonant: '',
    items: [
      {
        id: 'a',
        hiragana: 'あ',
        katakana: 'ア',
        romaji: 'a',
        row: 'あ行',
        col: 'a段',
        origin: { hiragana: '安 (草书)', katakana: '阿 (左耳旁)' },
        mnemonic: '十字架下有一个圆圈，像女子安静祈祷「あ(阿)」',
        example: { word: '雨', hiragana: 'あめ', zh: '雨水 / 雨伞' },
        audioText: 'あ'
      },
      {
        id: 'i',
        hiragana: 'い',
        katakana: 'イ',
        romaji: 'i',
        row: 'あ行',
        col: 'i段',
        origin: { hiragana: '以 (草书)', katakana: '伊 (人字旁)' },
        mnemonic: '左边长右边短，像汉字「以」的两笔',
        example: { word: '犬', hiragana: 'いぬ', zh: '狗 / 小狗' },
        audioText: 'い'
      },
      {
        id: 'u',
        hiragana: 'う',
        katakana: 'ウ',
        romaji: 'u',
        row: 'あ行',
        col: 'u段',
        origin: { hiragana: '宇 (草书)', katakana: '宇 (宝盖头)' },
        mnemonic: '上面一点，下面一个弯，像被踢中肚子弯腰叫「呜(う)」',
        example: { word: '海', hiragana: 'うみ', zh: '大海' },
        audioText: 'う'
      },
      {
        id: 'e',
        hiragana: 'え',
        katakana: 'エ',
        romaji: 'e',
        row: 'あ行',
        col: 'e段',
        origin: { hiragana: '衣 (草书)', katakana: '江 (右旁)' },
        mnemonic: '像古代一条轻柔的衣带舞动「え(衣)」',
        example: { word: '駅', hiragana: 'えき', zh: '车站' },
        audioText: 'え'
      },
      {
        id: 'o',
        hiragana: 'お',
        katakana: 'オ',
        romaji: 'o',
        row: 'あ行',
        col: 'o段',
        origin: { hiragana: '於 (草书)', katakana: '於 (左旁)' },
        mnemonic: '十下面加个圈右上一横，像嘴巴长得圆圆的「お(哦)」',
        example: { word: 'お茶', hiragana: 'おちゃ', zh: '茶 / 绿茶' },
        audioText: 'お'
      }
    ]
  },
  {
    rowName: 'か行 (k-)',
    romajiConsonant: 'k',
    items: [
      {
        id: 'ka',
        hiragana: 'か',
        katakana: 'カ',
        romaji: 'ka',
        row: 'か行',
        col: 'a段',
        origin: { hiragana: '加 (草书)', katakana: '加 (左力)' },
        mnemonic: '力字多一点，像在加油出力「か(卡)」',
        example: { word: '川', hiragana: 'かわ', zh: '河流' },
        audioText: 'か'
      },
      {
        id: 'ki',
        hiragana: 'き',
        katakana: 'キ',
        romaji: 'ki',
        row: 'か行',
        col: 'i段',
        origin: { hiragana: '幾 (草书)', katakana: '幾 (前两横)' },
        mnemonic: '两横一竖带个弯，形状像一把打开的钥匙 key「き」',
        example: { word: '木', hiragana: 'き', zh: '树木' },
        audioText: 'き'
      },
      {
        id: 'ku',
        hiragana: 'く',
        katakana: 'ク',
        romaji: 'ku',
        row: 'か行',
        col: 'u段',
        origin: { hiragana: '久 (草书)', katakana: '久 (前两撇)' },
        mnemonic: '像一张张开的小鸟嘴巴在哭「く(哭)」',
        example: { word: '車', hiragana: 'くるま', zh: '汽车' },
        audioText: 'く'
      },
      {
        id: 'ke',
        hiragana: 'け',
        katakana: 'ケ',
        romaji: 'ke',
        row: 'か行',
        col: 'e段',
        origin: { hiragana: '計 (草书)', katakana: '介 (右撇捺)' },
        mnemonic: '左边一竖右边十字，像竹剑比武开客气「け」',
        example: { word: '今朝', hiragana: 'けさ', zh: '今天早晨' },
        audioText: 'け'
      },
      {
        id: 'ko',
        hiragana: 'こ',
        katakana: 'コ',
        romaji: 'ko',
        row: 'か行',
        col: 'o段',
        origin: { hiragana: '己 (草书)', katakana: '己 (上两折)' },
        mnemonic: '上下两条平行弧线，像两条开口的弧「こ」',
        example: { word: '声', hiragana: 'こえ', zh: '声音' },
        audioText: 'こ'
      }
    ]
  },
  {
    rowName: 'さ行 (s-)',
    romajiConsonant: 's',
    items: [
      {
        id: 'sa',
        hiragana: 'さ',
        katakana: 'サ',
        romaji: 'sa',
        row: 'さ行',
        col: 'a段',
        origin: { hiragana: '左 (草书)', katakana: '散 (草字头)' },
        mnemonic: '像一把优雅的女士遮阳伞「さ」',
        example: { word: '桜', hiragana: 'さくら', zh: '樱花' },
        audioText: 'さ'
      },
      {
        id: 'shi',
        hiragana: 'し',
        katakana: 'シ',
        romaji: 'shi',
        row: 'さ行',
        col: 'i段',
        origin: { hiragana: '之 (草书)', katakana: '之 (三点水)' },
        mnemonic: '像一个钓鱼的鱼钩吸上水「し」',
        example: { word: '白', hiragana: 'しろ', zh: '白色' },
        audioText: 'し'
      },
      {
        id: 'su',
        hiragana: 'す',
        katakana: 'ス',
        romaji: 'su',
        row: 'さ行',
        col: 'u段',
        origin: { hiragana: '寸 (草书)', katakana: '須 (右三撇)' },
        mnemonic: '像孕妇挺着圆圆肚子在吹气「す」',
        example: { word: '寿司', hiragana: 'すし', zh: '寿司' },
        audioText: 'す'
      },
      {
        id: 'se',
        hiragana: 'せ',
        katakana: 'セ',
        romaji: 'se',
        row: 'さ行',
        col: 'e段',
        origin: { hiragana: '世 (草书)', katakana: '世 (前两笔)' },
        mnemonic: '直接取自汉字「世」的草书体「せ」',
        example: { word: '先生', hiragana: 'せんせい', zh: '老师' },
        audioText: 'せ'
      },
      {
        id: 'so',
        hiragana: 'そ',
        katakana: 'ソ',
        romaji: 'so',
        row: 'さ行',
        col: 'o段',
        origin: { hiragana: '曾 (草书)', katakana: '曾 (前两点)' },
        mnemonic: '一笔顺滑连成 Z 和 C，像缝纫机锁边「そ」',
        example: { word: '空', hiragana: 'そら', zh: '天空' },
        audioText: 'そ'
      }
    ]
  },
  {
    rowName: 'た行 (t-)',
    romajiConsonant: 't',
    items: [
      {
        id: 'ta',
        hiragana: 'た',
        katakana: 'タ',
        romaji: 'ta',
        row: 'た行',
        col: 'a段',
        origin: { hiragana: '太 (草书)', katakana: '多 (前半)' },
        mnemonic: '左十右二，像「太」字行书「た」',
        example: { word: '卵', hiragana: 'たまご', zh: '鸡蛋' },
        audioText: 'た'
      },
      {
        id: 'chi',
        hiragana: 'ち',
        katakana: 'チ',
        romaji: 'chi',
        row: 'た行',
        col: 'i段',
        origin: { hiragana: '知 (草书)', katakana: '千 (变形)' },
        mnemonic: '像数字「5」少了一顶帽子，像小猫吃鱼「ち」',
        example: { word: '地下鉄', hiragana: 'ちかてつ', zh: '地铁' },
        audioText: 'ち'
      },
      {
        id: 'tsu',
        hiragana: 'つ',
        katakana: 'ツ',
        romaji: 'tsu',
        row: 'た行',
        col: 'u段',
        origin: { hiragana: '川 (草书)', katakana: '川 (三点水)' },
        mnemonic: '像汹涌翻滚的海浪浪尖吐水「つ」',
        example: { word: '机', hiragana: 'つくえ', zh: '桌子' },
        audioText: 'つ'
      },
      {
        id: 'te',
        hiragana: 'て',
        katakana: 'テ',
        romaji: 'te',
        row: 'た行',
        col: 'e段',
        origin: { hiragana: '天 (草书)', katakana: '天 (前三笔)' },
        mnemonic: '像人的手掌弯曲捧着东西，日语手就是「て」',
        example: { word: '手', hiragana: 'て', zh: '手 / 手部' },
        audioText: 'て'
      },
      {
        id: 'to',
        hiragana: 'と',
        katakana: 'ト',
        romaji: 'to',
        row: 'た行',
        col: 'o段',
        origin: { hiragana: '止 (草书)', katakana: '止 (前两笔)' },
        mnemonic: '一竖插在一个大肚子上，像脚趾头 toe「と」',
        example: { word: '友達', hiragana: 'ともだち', zh: '朋友' },
        audioText: 'と'
      }
    ]
  },
  {
    rowName: 'な行 (n-)',
    romajiConsonant: 'n',
    items: [
      {
        id: 'na',
        hiragana: 'な',
        katakana: 'ナ',
        romaji: 'na',
        row: 'な行',
        col: 'a段',
        origin: { hiragana: '奈 (草书)', katakana: '奈 (左两笔)' },
        mnemonic: '像一把十字架前跪着虔诚呐喊「な」',
        example: { word: '夏', hiragana: 'なつ', zh: '夏天' },
        audioText: 'な'
      },
      {
        id: 'ni',
        hiragana: 'に',
        katakana: 'ニ',
        romaji: 'ni',
        row: 'な行',
        col: 'i段',
        origin: { hiragana: '仁 (草书)', katakana: '二 (字形)' },
        mnemonic: '左竖右二，像「仁」字的行草书「に」',
        example: { word: '日本', hiragana: 'にほん', zh: '日本' },
        audioText: 'に'
      },
      {
        id: 'nu',
        hiragana: 'ぬ',
        katakana: 'ヌ',
        romaji: 'nu',
        row: 'な行',
        col: 'u段',
        origin: { hiragana: '奴 (草书)', katakana: '奴 (右又)' },
        mnemonic: '像一碗好吃的拉面尾巴打了个小圆圈「ぬ」',
        example: { word: '猫', hiragana: 'ねこ', zh: '猫 (比较: ぬくもり 温暖)' },
        audioText: 'ぬ'
      },
      {
        id: 'ne',
        hiragana: 'ね',
        katakana: 'ネ',
        romaji: 'ne',
        row: 'な行',
        col: 'e段',
        origin: { hiragana: '祢 (草书)', katakana: '祢 (示字旁)' },
        mnemonic: '左边一竖，右边像盘着尾巴睡觉的小猫 ne-ko「ね」',
        example: { word: '猫', hiragana: 'ねこ', zh: '猫咪' },
        audioText: 'ね'
      },
      {
        id: 'no',
        hiragana: 'の',
        katakana: 'ノ',
        romaji: 'no',
        row: '画行',
        col: 'o段',
        origin: { hiragana: '乃 (草书)', katakana: '乃 (首撇)' },
        mnemonic: '一个圆圈划过，像写禁止标志 NO「の」',
        example: { word: '飲み物', hiragana: 'のみもの', zh: '饮料' },
        audioText: 'の'
      }
    ]
  },
  {
    rowName: 'は行 (h-)',
    romajiConsonant: 'h',
    items: [
      {
        id: 'ha',
        hiragana: 'は',
        katakana: 'ハ',
        romaji: 'ha',
        row: 'は行',
        col: 'a段',
        origin: { hiragana: '波 (草书)', katakana: '八 (字形)' },
        mnemonic: '像一个人插腰大笑哈哈哈「は」',
        example: { word: '花', hiragana: 'はな', zh: '花朵' },
        audioText: 'は'
      },
      {
        id: 'hi',
        hiragana: 'ひ',
        katakana: 'ヒ',
        romaji: 'hi',
        row: 'は行',
        col: 'i段',
        origin: { hiragana: '比 (草书)', katakana: '比 (右旁)' },
        mnemonic: '笑眯眯咧开的大嘴巴「ひ(嘻)」',
        example: { word: '光', hiragana: 'ひかり', zh: '光芒' },
        audioText: 'ひ'
      },
      {
        id: 'fu',
        hiragana: 'ふ',
        katakana: 'フ',
        romaji: 'fu',
        row: 'は行',
        col: 'u段',
        origin: { hiragana: '不 (草书)', katakana: '不 (左上)' },
        mnemonic: '像小老头在轻轻吹气呼呼呼「ふ」',
        example: { word: '富士山', hiragana: 'ふじさん', zh: '富士山' },
        audioText: 'ふ'
      },
      {
        id: 'he',
        hiragana: 'へ',
        katakana: 'ヘ',
        romaji: 'he',
        row: 'は行',
        col: 'e段',
        origin: { hiragana: '部 (右旁)', katakana: '部 (右旁)' },
        mnemonic: '像一座平缓的山坡「へ」',
        example: { word: '部屋', hiragana: 'へや', zh: '房间' },
        audioText: 'へ'
      },
      {
        id: 'ho',
        hiragana: 'ほ',
        katakana: 'ホ',
        romaji: 'ho',
        row: 'は行',
        col: 'o段',
        origin: { hiragana: '保 (草书)', katakana: '保 (木字)' },
        mnemonic: '像戴着顶帽子的「は」，像活佛济公「ほ」',
        example: { word: '星', hiragana: 'ほし', zh: '星星' },
        audioText: 'ほ'
      }
    ]
  },
  {
    rowName: 'ま行 (m-)',
    romajiConsonant: 'm',
    items: [
      {
        id: 'ma',
        hiragana: 'ま',
        katakana: 'マ',
        romaji: 'ma',
        row: 'ま行',
        col: 'a段',
        origin: { hiragana: '末 (草书)', katakana: '末 (前两笔)' },
        mnemonic: '像两根横线打个圈，马马虎虎「ま」',
        example: { word: '町', hiragana: 'まち', zh: '城镇 / 街道' },
        audioText: 'ま'
      },
      {
        id: 'mi',
        hiragana: 'み',
        katakana: 'ミ',
        romaji: 'mi',
        row: 'ま行',
        col: 'i段',
        origin: { hiragana: '美 (草书)', katakana: '三 (三撇)' },
        mnemonic: '像数字「21」合体，像看美丽的咪咪「み」',
        example: { word: '道', hiragana: 'みち', zh: '道路' },
        audioText: 'み'
      },
      {
        id: 'mu',
        hiragana: 'む',
        katakana: 'ム',
        romaji: 'mu',
        row: 'ま行',
        col: 'u段',
        origin: { hiragana: '武 (草书)', katakana: '牟 (头两笔)' },
        mnemonic: '像一头小牛趴在地上叫睦睦「む」',
        example: { word: '村', hiragana: 'むら', zh: '村庄' },
        audioText: 'む'
      },
      {
        id: 'me',
        hiragana: 'め',
        katakana: 'メ',
        romaji: 'me',
        row: 'ま行',
        col: 'e段',
        origin: { hiragana: '女 (草书)', katakana: '女 (撇捺)' },
        mnemonic: '像眼睛一样弯弯圆圆的，日语眼睛是「め」',
        example: { word: '目', hiragana: 'め', zh: '眼睛' },
        audioText: 'め'
      },
      {
        id: 'mo',
        hiragana: 'も',
        katakana: 'モ',
        romaji: 'mo',
        row: 'ま行',
        col: 'o段',
        origin: { hiragana: '毛 (草书)', katakana: '毛 (变形)' },
        mnemonic: '像汉字「毛」草写，毛发「も」',
        example: { word: '森', hiragana: 'もり', zh: '森林' },
        audioText: 'も'
      }
    ]
  },
  {
    rowName: 'や行 (y-)',
    romajiConsonant: 'y',
    items: [
      {
        id: 'ya',
        hiragana: 'や',
        katakana: 'ヤ',
        romaji: 'ya',
        row: 'や行',
        col: 'a段',
        origin: { hiragana: '也 (草书)', katakana: '也 (前两笔)' },
        mnemonic: '直接取自汉字「也」的写意「や」',
        example: { word: '山', hiragana: 'やま', zh: '大山' },
        audioText: 'や'
      },
      null,
      {
        id: 'yu',
        hiragana: 'ゆ',
        katakana: 'ユ',
        romaji: 'yu',
        row: 'や行',
        col: 'u段',
        origin: { hiragana: '由 (草书)', katakana: '由 (右折)' },
        mnemonic: '像一条可爱的小金鱼游啊游「ゆ」',
        example: { word: '雪', hiragana: 'ゆき', zh: '雪花' },
        audioText: 'ゆ'
      },
      null,
      {
        id: 'yo',
        hiragana: 'よ',
        katakana: 'ヨ',
        romaji: 'yo',
        row: 'や行',
        col: 'o段',
        origin: { hiragana: '与 (草书)', katakana: '与 (前两折)' },
        mnemonic: '像站在独轮车上哟嗬叫「よ」',
        example: { word: '夜', hiragana: 'よる', zh: '夜晚' },
        audioText: 'よ'
      }
    ]
  },
  {
    rowName: 'ら行 (r-)',
    romajiConsonant: 'r',
    items: [
      {
        id: 'ra',
        hiragana: 'ら',
        katakana: 'ラ',
        romaji: 'ra',
        row: 'ら行',
        col: 'a段',
        origin: { hiragana: '良 (草书)', katakana: '良 (前两笔)' },
        mnemonic: '上面一点下面一弯，像马桶拉粑粑「ら」',
        example: { word: '桜', hiragana: 'さくら', zh: '樱花' },
        audioText: 'ら'
      },
      {
        id: 'ri',
        hiragana: 'り',
        katakana: 'リ',
        romaji: 'ri',
        row: 'ら行',
        col: 'i段',
        origin: { hiragana: '利 (草书)', katakana: '利 (立刀旁)' },
        mnemonic: '左短右长，像一对并排的梨子「り」',
        example: { word: '林檎', hiragana: 'りんご', zh: '苹果' },
        audioText: 'り'
      },
      {
        id: 'ru',
        hiragana: 'る',
        katakana: 'ル',
        romaji: 'ru',
        row: 'ら行',
        col: 'u段',
        origin: { hiragana: '留 (草书)', katakana: '流 (右下)' },
        mnemonic: '像数字「3」尾巴带个小圆圈，如履薄冰「る」',
        example: { word: '留守', hiragana: 'るす', zh: '不在家' },
        audioText: 'る'
      },
      {
        id: 're',
        hiragana: 'れ',
        katakana: 'レ',
        romaji: 're',
        row: 'ら行',
        col: 'e段',
        origin: { hiragana: '礼 (草书)', katakana: '礼 (右弯)' },
        mnemonic: '左竖右折，像鞠躬行礼礼貌「れ」',
        example: { word: '歴史', hiragana: 'れきし', zh: '历史' },
        audioText: 'れ'
      },
      {
        id: 'ro',
        hiragana: 'ろ',
        katakana: 'ロ',
        romaji: 'ro',
        row: 'ら行',
        col: 'o段',
        origin: { hiragana: '吕 (草书)', katakana: '吕 (单口)' },
        mnemonic: '像数字「3」，尾巴不带圈，路上走「ろ」',
        example: { word: '蝋燭', hiragana: 'ろうそく', zh: '蜡烛' },
        audioText: 'ろ'
      }
    ]
  },
  {
    rowName: 'わ行 / 拨音',
    romajiConsonant: 'w / n',
    items: [
      {
        id: 'wa',
        hiragana: 'わ',
        katakana: 'ワ',
        romaji: 'wa',
        row: 'わ行',
        col: 'a段',
        origin: { hiragana: '和 (草书)', katakana: '和 (右口)' },
        mnemonic: '像白天鹅在湖面优雅划水「わ(哇)」',
        example: { word: '私', hiragana: 'わたし', zh: '我' },
        audioText: 'わ'
      },
      null,
      null,
      null,
      {
        id: 'wo',
        hiragana: 'を',
        katakana: 'ヲ',
        romaji: 'o/wo',
        row: 'わ行',
        col: 'o段',
        origin: { hiragana: '遠 (草书)', katakana: '乎 (前两横一撇)' },
        mnemonic: '专用宾格助词，像弯腰抬东西叫「を」',
        example: { word: '本を読む', hiragana: 'ほんをよむ', zh: '读书(作助词)' },
        audioText: 'を'
      }
    ]
  },
  {
    rowName: '拨音 (鼻音)',
    romajiConsonant: 'n',
    items: [
      {
        id: 'n',
        hiragana: 'ん',
        katakana: 'ン',
        romaji: 'n',
        row: '拨音',
        col: '鼻音',
        origin: { hiragana: '无 (草书)', katakana: '尔 (两点)' },
        mnemonic: '像英文字母小写 n 连写「ん」',
        example: { word: '本', hiragana: 'ほん', zh: '书本' },
        audioText: 'ん'
      },
      null,
      null,
      null,
      null
    ]
  }
];

// 2. 浊音与半浊音 (Dakuon & Handakuon - 25音)
export const DAKUON_ROWS: KanaRow[] = [
  {
    rowName: 'が行 (g- 浊音)',
    romajiConsonant: 'g',
    items: [
      { id: 'ga', hiragana: 'が', katakana: 'ガ', romaji: 'ga', row: 'が行', col: 'a段', origin: { hiragana: 'か+浊点', katakana: 'カ+浊点' }, mnemonic: '清音「か」加两点变浊音「が」', example: { word: '学校', hiragana: 'がっこう', zh: '学校' }, audioText: 'が' },
      { id: 'gi', hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi', row: 'が行', col: 'i段', origin: { hiragana: 'き+浊点', katakana: 'キ+浊点' }, mnemonic: '清音「き」加两点变浊音「ぎ」', example: { word: '銀', hiragana: 'ぎん', zh: '银色' }, audioText: 'ぎ' },
      { id: 'gu', hiragana: 'ぐ', katakana: 'グ', romaji: 'gu', row: 'が行', col: 'u段', origin: { hiragana: 'く+浊点', katakana: 'ク+浊点' }, mnemonic: '清音「く」加两点变浊音「ぐ」', example: { word: '軍手', hiragana: 'ぐんて', zh: '手套' }, audioText: 'ぐ' },
      { id: 'ge', hiragana: 'げ', katakana: 'ゲ', romaji: 'ge', row: 'が行', col: 'e段', origin: { hiragana: 'け+浊点', katakana: 'ケ+浊点' }, mnemonic: '清音「け」加两点变浊音「げ」', example: { word: '元気', hiragana: 'げんき', zh: '精神 / 健康' }, audioText: 'げ' },
      { id: 'go', hiragana: 'ご', katakana: 'ゴ', romaji: 'go', row: 'が行', col: 'o段', origin: { hiragana: 'こ+浊点', katakana: 'コ+浊点' }, mnemonic: '清音「こ」加两点变浊音「ご」', example: { word: 'ご飯', hiragana: 'ごはん', zh: '米饭 / 吃饭' }, audioText: 'ご' },
    ]
  },
  {
    rowName: 'ざ行 (z- 浊音)',
    romajiConsonant: 'z',
    items: [
      { id: 'za', hiragana: 'ざ', katakana: 'ザ', romaji: 'za', row: 'ざ行', col: 'a段', origin: { hiragana: 'さ+浊点', katakana: 'サ+浊点' }, mnemonic: 'さ加两点变浊音「ざ」', example: { word: '雑誌', hiragana: 'ざっし', zh: '杂志' }, audioText: 'ざ' },
      { id: 'ji', hiragana: 'じ', katakana: 'ジ', romaji: 'ji', row: 'ざ行', col: 'i段', origin: { hiragana: 'し+浊点', katakana: 'シ+浊点' }, mnemonic: 'し加两点发「ji 极」', example: { word: '時間', hiragana: 'じかん', zh: '时间' }, audioText: 'じ' },
      { id: 'zu', hiragana: 'ず', katakana: 'ズ', romaji: 'zu', row: 'ざ行', col: 'u段', origin: { hiragana: 'す+浊点', katakana: '严+浊点' }, mnemonic: 'す加两点发「zu」', example: { word: 'ずっと', hiragana: 'ずっと', zh: '一直' }, audioText: 'ず' },
      { id: 'ze', hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze', row: 'ざ行', col: 'e段', origin: { hiragana: 'せ+浊点', katakana: 'セ+浊点' }, mnemonic: 'せ加两点变「ぜ」', example: { word: '全部', hiragana: 'ぜんぶ', zh: '全部' }, audioText: 'ぜ' },
      { id: 'zo', hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo', row: 'ざ行', col: 'o段', origin: { hiragana: 'そ+浊点', katakana: 'ソ+浊点' }, mnemonic: 'そ加两点变「ぞ」', example: { word: '象', hiragana: 'ぞう', zh: '大象' }, audioText: 'ぞ' },
    ]
  },
  {
    rowName: 'だ行 (d- 浊音)',
    romajiConsonant: 'd',
    items: [
      { id: 'da', hiragana: 'だ', katakana: 'ダ', romaji: 'da', row: 'だ行', col: 'a段', origin: { hiragana: 'た+浊点', katakana: 'タ+浊点' }, mnemonic: 'た加两点变「だ」', example: { word: '大学', hiragana: 'だいがく', zh: '大学' }, audioText: 'だ' },
      { id: 'd-ji', hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji(di)', row: 'だ行', col: 'i段', origin: { hiragana: 'ち+浊点', katakana: '千+浊点' }, mnemonic: 'ち加两点 (现代读音同「じ」)', example: { word: '鼻血', hiragana: 'はなぢ', zh: '鼻血' }, audioText: 'ぢ' },
      { id: 'd-zu', hiragana: 'づ', katakana: 'ヅ', romaji: 'zu(du)', row: 'だ行', col: 'u段', origin: { hiragana: 'つ+浊点', katakana: '川+浊点' }, mnemonic: 'つ加两点 (现代读音同「ず」)', example: { word: '続く', hiragana: 'つづく', zh: '持续' }, audioText: 'づ' },
      { id: 'de', hiragana: 'で', katakana: 'デ', romaji: 'de', row: 'だ行', col: 'e段', origin: { hiragana: 'て+浊点', katakana: '天+浊点' }, mnemonic: 'て加两点变「で」', example: { word: '電話', hiragana: 'でんわ', zh: '电话' }, audioText: 'で' },
      { id: 'do', hiragana: 'ど', katakana: 'ド', romaji: 'do', row: 'だ行', col: 'o段', origin: { hiragana: 'と+浊点', katakana: '止+浊点' }, mnemonic: 'と加两点变「ど」', example: { word: '何処', hiragana: 'どこ', zh: '哪里' }, audioText: 'ど' },
    ]
  },
  {
    rowName: 'ば行 (b- 浊音)',
    romajiConsonant: 'b',
    items: [
      { id: 'ba', hiragana: 'ば', katakana: 'バ', romaji: 'ba', row: 'ば行', col: 'a段', origin: { hiragana: 'は+浊点', katakana: '八+浊点' }, mnemonic: 'は加两点变爆破浊音「ば」', example: { word: '場所', hiragana: 'ばしょ', zh: '场所 / 地点' }, audioText: 'ば' },
      { id: 'bi', hiragana: 'び', katakana: 'ビ', romaji: 'bi', row: 'ば行', col: 'i段', origin: { hiragana: 'ひ+浊点', katakana: '比+浊点' }, mnemonic: 'ひ加两点变「び」', example: { word: '病院', hiragana: 'びょういん', zh: '医院' }, audioText: 'び' },
      { id: 'bu', hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu', row: 'ば行', col: 'u段', origin: { hiragana: 'ふ+浊点', katakana: '不+浊点' }, mnemonic: 'ふ加两点变「ぶ」', example: { word: '豚肉', hiragana: 'ぶたにく', zh: '猪肉' }, audioText: 'ぶ' },
      { id: 'be', hiragana: 'べ', katakana: 'ベ', romaji: 'be', row: 'ば行', col: 'e段', origin: { hiragana: 'へ+浊点', katakana: '部+浊点' }, mnemonic: 'へ加两点变「べ」', example: { word: '勉強', hiragana: 'べんきょう', zh: '学习' }, audioText: 'べ' },
      { id: 'bo', hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo', row: 'ば行', col: 'o段', origin: { hiragana: 'ほ+浊点', katakana: '保+浊点' }, mnemonic: 'ほ加两点变「ぼ」', example: { word: '僕', hiragana: 'ぼく', zh: '我 (男性谦逊)' }, audioText: 'ぼ' },
    ]
  },
  {
    rowName: 'ぱ行 (p- 半浊音)',
    romajiConsonant: 'p',
    items: [
      { id: 'pa', hiragana: 'ぱ', katakana: 'パ', romaji: 'pa', row: 'ぱ行', col: 'a段', origin: { hiragana: 'は+圆圈', katakana: '八+圆圈' }, mnemonic: 'は加小圆圈变清脆「ぱ」', example: { word: 'パン', hiragana: 'ぱん', zh: '面包' }, audioText: 'ぱ' },
      { id: 'pi', hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi', row: 'ぱ行', col: 'i段', origin: { hiragana: 'ひ+圆圈', katakana: '比+圆圈' }, mnemonic: 'ひ加小圆圈变「ぴ」', example: { word: 'ピアノ', hiragana: 'ぴあの', zh: '钢琴' }, audioText: 'ぴ' },
      { id: 'pu', hiragana: 'ぷ', katakana: 'プ', romaji: 'pu', row: 'ぱ行', col: 'u段', origin: { hiragana: 'ふ+圆圈', katakana: '不+圆圈' }, mnemonic: 'ふ加小圆圈变「ぷ」', example: { word: 'プール', hiragana: 'ぷーる', zh: '游泳池' }, audioText: 'ぷ' },
      { id: 'pe', hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe', row: 'ぱ行', col: 'e段', origin: { hiragana: 'へ+圆圈', katakana: '部+圆圈' }, mnemonic: 'へ加小圆圈变「ぺ」', example: { word: 'ペン', hiragana: 'ぺん', zh: '钢笔 / 笔' }, audioText: 'ぺ' },
      { id: 'po', hiragana: 'ぽ', katakana: 'ポ', romaji: 'po', row: 'ぱ行', col: 'o段', origin: { hiragana: 'ほ+圆圈', katakana: '保+圆圈' }, mnemonic: 'ほ加小圆圈变「ぽ」', example: { word: 'ポケット', hiragana: 'ぽけっと', zh: '口袋' }, audioText: 'ぽ' },
    ]
  }
];

// 3. 拗音 (Youon - 33音精选)
export const YOUON_ROWS = [
  { group: 'きゃ行', items: [
    { hiragana: 'きゃ', katakana: 'キャ', romaji: 'kya', zh: '客房·客气', audioText: 'きゃ' },
    { hiragana: 'きゅ', katakana: 'キュ', romaji: 'kyu', zh: '九·救急', audioText: 'きゅ' },
    { hiragana: 'きょ', katakana: 'キョ', romaji: 'kyo', zh: '今日(きょう)', audioText: 'きょ' },
  ]},
  { group: 'しゃ行', items: [
    { hiragana: 'しゃ', katakana: 'シャ', romaji: 'sha', zh: '写真(しゃしん)', audioText: 'しゃ' },
    { hiragana: 'しゅ', katakana: 'シュ', romaji: 'shu', zh: '趣味(しゅみ)', audioText: 'しゅ' },
    { hiragana: 'しょ', katakana: 'ショ', romaji: 'sho', zh: '食堂(しょくどう)', audioText: 'しょ' },
  ]},
  { group: 'ちゃ行', items: [
    { hiragana: 'ちゃ', katakana: 'チャ', romaji: 'cha', zh: 'お茶(おちゃ)', audioText: 'ちゃ' },
    { hiragana: 'ちゅ', katakana: 'チュ', romaji: 'chu', zh: '注意(ちゅうい)', audioText: 'ちゅ' },
    { hiragana: 'ちょ', katakana: 'チョ', romaji: 'cho', zh: 'ちょっと(稍等)', audioText: 'ちょ' },
  ]},
  { group: 'にゃ行', items: [
    { hiragana: 'にゃ', katakana: 'ニャ', romaji: 'nya', zh: '猫咪喵呜', audioText: 'にゃ' },
    { hiragana: 'にゅ', katakana: 'ニュ', romaji: 'nyu', zh: '牛乳(ぎゅうにゅう)', audioText: 'にゅ' },
    { hiragana: 'にょ', katakana: 'ニョ', romaji: 'nyo', zh: '女房(にょうぼう)', audioText: 'にょ' },
  ]},
  { group: 'ひゃ行', items: [
    { hiragana: 'ひゃ', katakana: 'ヒャ', romaji: 'hya', zh: '百(ひゃく)', audioText: 'ひゃ' },
    { hiragana: 'ひゅ', katakana: 'ヒュ', romaji: 'hyu', zh: 'ヒューマン', audioText: 'ひゅ' },
    { hiragana: 'ひょ', katakana: 'ヒョ', romaji: 'hyo', zh: '評価(ひょうか)', audioText: 'ひょ' },
  ]},
  { group: 'みゃ行', items: [
    { hiragana: 'みゃ', katakana: 'ミャ', romaji: 'mya', zh: 'ミャンマー', audioText: 'みゃ' },
    { hiragana: 'みゅ', katakana: 'ミュ', romaji: 'myu', zh: 'ミュージアム', audioText: 'みゅ' },
    { hiragana: 'みょ', katakana: 'ミョ', romaji: 'myo', zh: '妙案(みょうあん)', audioText: 'みょ' },
  ]},
  { group: 'りゃ行', items: [
    { hiragana: 'りゃ', katakana: 'リャ', romaji: 'rya', zh: '略語(りゃくご)', audioText: 'りゃ' },
    { hiragana: 'りゅ', katakana: 'リュ', romaji: 'ryu', zh: '留学生(りゅうがく)', audioText: 'りゅ' },
    { hiragana: 'りょ', katakana: 'リョ', romaji: 'ryo', zh: '旅行(りょこう)', audioText: 'りょ' },
  ]},
  { group: 'ぎゃ行', items: [
    { hiragana: 'ぎゃ', katakana: 'ギャ', romaji: 'gya', zh: '逆転(ぎゃくてん)', audioText: 'ぎゃ' },
    { hiragana: 'ぎゅ', katakana: 'ギュ', romaji: 'gyu', zh: '牛肉(ぎゅうにく)', audioText: 'ぎゅ' },
    { hiragana: 'ぎょ', katakana: 'ギョ', romaji: 'gyo', zh: '金魚(きんぎょ)', audioText: 'ぎょ' },
  ]},
  { group: 'じゃ行', items: [
    { hiragana: 'じゃ', katakana: 'ジャ', romaji: 'ja', zh: 'じゃあ(那么)', audioText: 'じゃ' },
    { hiragana: 'じゅ', katakana: 'ジュ', romaji: 'ju', zh: '授業(じゅぎょう)', audioText: 'じゅ' },
    { hiragana: 'じょ', katakana: 'ジョ', romaji: 'jo', zh: '女性(じょせい)', audioText: 'じょ' },
  ]},
  { group: 'びゃ行', items: [
    { hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya', zh: '白夜(びゃくや)', audioText: 'びゃ' },
    { hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu', zh: 'ビューティフル', audioText: 'びゅ' },
    { hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo', zh: '病院(びょういん)', audioText: 'びょ' },
  ]},
  { group: 'ぴゃ行', items: [
    { hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya', zh: 'ハッピー', audioText: 'ぴゃ' },
    { hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu', zh: 'ピュア(纯粹)', audioText: 'ぴゅ' },
    { hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo', zh: 'ぴょんぴょん(跳跃)', audioText: 'ぴょ' },
  ]}
];
