/**
 * CS313 日语研习社 · 五十音图深度音韵学数据中心
 * 针对韩语40音同款模板提供：
 * 1. 假名口型要领与发音部位解析
 * 2. 标准书写笔顺拆解
 * 3. 类似汉语拼音对比
 * 4. 3大高频真题核心词汇发音矩阵
 * 5. 辅音+元音搭积木拼读词典与打字法则
 * 6. 清浊对立·促音长音辨音室题库
 */

export interface KanaDetailInfo {
  mouthShape: string;
  strokeOrder: string[];
  pinyinHint: string;
  ipa: string;
  sampleWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

// 46 清音与主要假名的深度音韵学解析
export const KANA_DETAILS: Record<string, KanaDetailInfo> = {
  // あ行 (元音)
  a: {
    mouthShape: '嘴唇自然放松微张，开口度比汉语拼音“啊”略小，舌头自然放平，发音短促清脆，不可拖长。',
    strokeOrder: ['① 从左至右微上扬画短横', '② 从上至下微带弧度竖画穿过', '③ 从中央顺时针画圆圈包围右侧'],
    pinyinHint: '类似汉语拼音 "a" (啊)',
    ipa: '[a]',
    sampleWords: [
      { word: '雨', reading: 'あめ', meaning: '雨水 / 雨伞' },
      { word: '朝', reading: 'あさ', meaning: '早晨 / 上午' },
      { word: '青', reading: 'あお', meaning: '蓝色 / 蔚蓝' }
    ]
  },
  i: {
    mouthShape: '嘴角向两侧自然微扬，舌面隆起靠近硬腭，比中文“衣”嘴唇更为放松，不可过度用力紧绷。',
    strokeOrder: ['① 左侧自上向下微带弧度画竖提', '② 右侧向下画较短微弯竖笔'],
    pinyinHint: '类似汉语拼音 "yi" (衣)',
    ipa: '[i]',
    sampleWords: [
      { word: '犬', reading: 'いぬ', meaning: '狗 / 小狗' },
      { word: '家', reading: 'いえ', meaning: '家 / 房屋' },
      { word: '今', reading: 'いま', meaning: '现在 / 此时' }
    ]
  },
  u: {
    mouthShape: '【核心难点·扁唇音】双唇微闭自然展开，绝对不可向前撅嘴凸起，舌身放平略微后缩，声音轻柔短促。',
    strokeOrder: ['① 顶部中央微微向右下落一点短横', '② 从左上起笔顺时针画一个半圆弧弯'],
    pinyinHint: '类似汉语拼音 "wu" (乌)，但千万不可撅嘴',
    ipa: '[ɯᵝ]',
    sampleWords: [
      { word: '海', reading: 'うみ', meaning: '大海 / 海洋' },
      { word: '歌', reading: 'うた', meaning: '歌曲 / 歌唱' },
      { word: '上', reading: 'うえ', meaning: '上面 / 顶部' }
    ]
  },
  e: {
    mouthShape: '嘴角向两侧适度张开，开口度介于“い”与“あ”之间，舌尖轻触下齿背，声音清晰明朗。',
    strokeOrder: ['① 顶部中央微斜画短点横', '② 从左下一折向右上斜提，折回向下画平滑波浪波折'],
    pinyinHint: '类似英语 "bed" 中的短元音 [e]',
    ipa: '[e]',
    sampleWords: [
      { word: '駅', reading: 'えき', meaning: '火车站 / 地铁站' },
      { word: '絵', reading: 'え', meaning: '画 / 图画' },
      { word: '笑顔', reading: 'えがお', meaning: '笑脸 / 笑容' }
    ]
  },
  o: {
    mouthShape: '双唇收成圆形微启，舌体后缩，发音自始至终保持圆形口型不变，严禁念成复元音“ou”。',
    strokeOrder: ['① 从左向右画水平短横', '② 竖笔下穿后逆时针向左上方打小圈再向右下甩出', '③ 右上方点一点'],
    pinyinHint: '类似汉语拼音 "o" (哦)，但口型固定不滑动',
    ipa: '[o̞]',
    sampleWords: [
      { word: 'お茶', reading: 'おちゃ', meaning: '茶 / 绿茶' },
      { word: 'お金', reading: 'おかね', meaning: '金钱 / 现金' },
      { word: '男', reading: 'おとこ', meaning: '男性 / 男人' }
    ]
  },

  // か行 (k-)
  ka: {
    mouthShape: '舌根紧贴软腭闭塞，然后骤然放开爆破出声，气流冲出送气适中，声带不振动。',
    strokeOrder: ['① 左侧自上而下写折提带钩', '② 中间自上而下微斜画一撇', '③ 右上方轻点一点'],
    pinyinHint: '类似汉语拼音 "ka" (卡)',
    ipa: '[ka]',
    sampleWords: [
      { word: '川', reading: 'かわ', meaning: '河流 / 小溪' },
      { word: '傘', reading: 'かさ', meaning: '雨伞' },
      { word: '顔', reading: 'かお', meaning: '脸庞 / 面容' }
    ]
  },
  ki: {
    mouthShape: '舌面隆起抵硬腭前部闭塞后释放，同时口型向两侧略扁，发音清朗利落。',
    strokeOrder: ['① 上部左向右画第一短横', '② 下部画第二条平行稍长横', '③ 斜向右下穿过并逆时针画半弧底托'],
    pinyinHint: '类似英语 "key" (钥匙) 的开头',
    ipa: '[kʲi]',
    sampleWords: [
      { word: '木', reading: 'き', meaning: '树木 / 木头' },
      { word: '切符', reading: 'きっぷ', meaning: '车票 / 门票' },
      { word: '着物', reading: 'きもの', meaning: '和服 / 衣物' }
    ]
  },
  ku: {
    mouthShape: '舌根抵软腭，爆破发声后迅速过渡到扁唇的“う”，双唇不可过度向前噘起。',
    strokeOrder: ['① 一笔顺势从右上向左下斜撇，随即向右下钝角折出'],
    pinyinHint: '类似汉语拼音 "ku" (哭)，注意嘴唇放平',
    ipa: '[kɯᵝ]',
    sampleWords: [
      { word: '車', reading: 'くるま', meaning: '汽车 / 车辆' },
      { word: '国', reading: 'くに', meaning: '国家 / 故乡' },
      { word: '靴', reading: 'くつ', meaning: '鞋子' }
    ]
  },
  ke: {
    mouthShape: '舌根爆破同时口腔半开，舌面微抬，类似发“开”的轻快短音。',
    strokeOrder: ['① 左侧自上而下画带弧度竖撇', '② 右上方画水平短横', '③ 自横中向下画悬针直竖'],
    pinyinHint: '类似汉语拼音 "kai" 的前半段，读短促的 ke',
    ipa: '[ke]',
    sampleWords: [
      { word: '今朝', reading: 'けさ', meaning: '今天早晨' },
      { word: '景色', reading: 'けしき', meaning: '风景 / 景色' },
      { word: '警察', reading: 'けいさつ', meaning: '警察' }
    ]
  },
  ko: {
    mouthShape: '舌根闭塞爆破后过渡到圆唇“お”，上下唇适度收圆。',
    strokeOrder: ['① 上部从左向右画微向下弯短横', '② 底部画平行相对的微向上弧横'],
    pinyinHint: '类似汉语拼音 "ko" (阔的开口)',
    ipa: '[ko̞]',
    sampleWords: [
      { word: '声', reading: 'こえ', meaning: '声音 / 嗓音' },
      { word: '心', reading: 'こころ', meaning: '心 / 心灵' },
      { word: '言葉', reading: 'ことば', meaning: '语言 / 单词' }
    ]
  },

  // さ行 (s-)
  sa: {
    mouthShape: '舌尖接近上齿龈，气流从窄缝中摩擦而出，同时下巴自然微垂。',
    strokeOrder: ['① 上部自左向右微扬一短横', '② 自右上向左下斜斜穿过一短竖', '③ 底部顺时针画半圆弧底'],
    pinyinHint: '类似汉语拼音 "sa" (撒)',
    ipa: '[sa]',
    sampleWords: [
      { word: '桜', reading: 'さくら', meaning: '樱花' },
      { word: '魚', reading: 'さかな', meaning: '鱼类' },
      { word: '財布', reading: 'さいふ', meaning: '钱包' }
    ]
  },
  shi: {
    mouthShape: '【特异音】日语不发 si，舌前部抬向硬腭形成缝隙摩擦，类似“吸”，清脆而不翘舌。',
    strokeOrder: ['① 一笔自上而下竖直写下，到底部向右上方圆润弯起如鱼钩'],
    pinyinHint: '类似汉语拼音 "xi" (西)，切勿卷舌念成 shi',
    ipa: '[ɕi]',
    sampleWords: [
      { word: '白', reading: 'しろ', meaning: '白色' },
      { word: '島', reading: 'しま', meaning: '岛屿' },
      { word: '仕事', reading: 'しごと', meaning: '工作 / 事情' }
    ]
  },
  su: {
    mouthShape: '舌尖逼近上齿龈摩擦，口型扁平不噘嘴，微露齿缝。',
    strokeOrder: ['① 上部自左向右画水平横画', '② 从中穿下直竖，中途画一个顺时针圆环后向下撇出'],
    pinyinHint: '类似汉语拼音 "si" (丝) 混入少许扁唇 u',
    ipa: '[sɯᵝ]',
    sampleWords: [
      { word: '寿司', reading: 'すし', meaning: '寿司' },
      { word: '水', reading: 'すい', meaning: '水 / 水分' },
      { word: '姿', reading: 'すがた', meaning: '身姿 / 姿态' }
    ]
  },
  se: {
    mouthShape: '气流自齿缝摩擦而出，随即顺势滑向半张开的“え”音。',
    strokeOrder: ['① 上部横画微斜', '② 右侧自上向下带钩垂直写下', '③ 左侧竖画下折托底向右连贯'],
    pinyinHint: '类似汉语拼音 "se" (塞的短促音)',
    ipa: '[se]',
    sampleWords: [
      { word: '先生', reading: 'せんせい', meaning: '老师 / 教授' },
      { word: '世界', reading: 'せかい', meaning: '世界' },
      { word: '席', reading: 'せき', meaning: '座位 / 席位' }
    ]
  },
  so: {
    mouthShape: '齿隙摩擦气流瞬间配合圆唇发出，声音干脆利索。',
    strokeOrder: ['① 一笔连续完成：向右短横、左下折、右下折、再圆弧向左下托起'],
    pinyinHint: '类似汉语拼音 "so" (缩的开头)',
    ipa: '[so̞]',
    sampleWords: [
      { word: '空', reading: 'そら', meaning: '天空' },
      { word: '外', reading: 'そと', meaning: '外面 / 室外' },
      { word: '側', reading: 'そば', meaning: '身旁 / 旁边' }
    ]
  },

  // た行 (t-)
  ta: {
    mouthShape: '舌尖紧贴上齿龈闭塞，然后迅速弹开爆发成音。',
    strokeOrder: ['① 左侧画水平短横', '② 从中穿过短撇斜下', '③ 右侧上下并列两小横'],
    pinyinHint: '类似汉语拼音 "ta" (踏)',
    ipa: '[ta]',
    sampleWords: [
      { word: '卵', reading: 'たまご', meaning: '鸡蛋' },
      { word: '高', reading: 'たか', meaning: '高昂 / 昂贵' },
      { word: '旅', reading: 'たび', meaning: '旅行 / 旅程' }
    ]
  },
  chi: {
    mouthShape: '【特异音】不发 ti，舌前部贴硬腭形成阻碍后微开释放，类似“七”。',
    strokeOrder: ['① 顶部水平画短横', '② 从横微偏右穿下直竖，下部顺时针画圆弧'],
    pinyinHint: '类似汉语拼音 "qi" (七)，切勿念成 ti',
    ipa: '[t͡ɕi]',
    sampleWords: [
      { word: '父', reading: 'ちち', meaning: '父亲 / 爸爸' },
      { word: '地下', reading: 'ちか', meaning: '地下' },
      { word: '地図', reading: 'ちず', meaning: '地图' }
    ]
  },
  tsu: {
    mouthShape: '【特异音】不发 tu，舌尖轻贴上门牙内侧阻气后微泄，类似中文“刺”但唇不突。',
    strokeOrder: ['① 一笔完成：自左向右微微上昂，随后大弧度顺时针向左下包抄圆弧'],
    pinyinHint: '类似汉语拼音 "ci" (刺)，扁唇勿撅',
    ipa: '[t͡sɯᵝ]',
    sampleWords: [
      { word: '机', reading: 'つくえ', meaning: '课桌 / 书桌' },
      { word: '月', reading: 'つき', meaning: '月亮 / 月份' },
      { word: '翼', reading: 'つばさ', meaning: '羽翼 / 翅膀' }
    ]
  },
  te: {
    mouthShape: '舌尖自上齿龈弹开，口型转为“え”，声带不震动。',
    strokeOrder: ['① 上方画平直短横', '② 到右端折回向左下，画一个圆润半弧托底'],
    pinyinHint: '类似汉语拼音 "te" (特别的特)',
    ipa: '[te]',
    sampleWords: [
      { word: '手', reading: 'て', meaning: '手 / 手部' },
      { word: '手紙', reading: 'てがみ', meaning: '信件 / 书信' },
      { word: '天気', reading: 'てんき', meaning: '天气 / 气候' }
    ]
  },
  to: {
    mouthShape: '舌尖自齿龈爆开，嘴唇迅速收为“お”圆口。',
    strokeOrder: ['① 左上方从上至下斜落一短竖', '② 右侧顺接画一个向右突出的圆弧'],
    pinyinHint: '类似汉语拼音 "to" (拓)',
    ipa: '[to̞]',
    sampleWords: [
      { word: '友達', reading: 'ともだち', meaning: '朋友 / 友人' },
      { word: '鳥', reading: 'とり', meaning: '鸟类 / 小鸟' },
      { word: '時計', reading: 'とけい', meaning: '钟表 / 手表' }
    ]
  },

  // な行 (n-)
  na: {
    mouthShape: '舌尖抵上齿龈闭塞，气流通过鼻腔共鸣后舌尖下放发音。',
    strokeOrder: ['① 左上画短横', '② 斜竖穿过', '③ 右上一点', '④ 右下竖弯绕圈'],
    pinyinHint: '类似汉语拼音 "na" (那)',
    ipa: '[na]',
    sampleWords: [
      { word: '夏', reading: 'なつ', meaning: '夏天 / 夏季' },
      { word: '名前', reading: 'なまえ', meaning: '名字 / 姓名' },
      { word: '波', reading: 'なみ', meaning: '海浪 / 波涛' }
    ]
  },
  ni: {
    mouthShape: '舌面贴硬腭阻气，鼻音共鸣后随“い”发音释放。',
    strokeOrder: ['① 左侧自上向下画微弧直竖', '② 右上方一短横', '③ 右下方平行一短横'],
    pinyinHint: '类似汉语拼音 "ni" (你)',
    ipa: '[ɲi]',
    sampleWords: [
      { word: '肉', reading: 'にく', meaning: '肉类' },
      { word: '虹', reading: 'にじ', meaning: '彩虹' },
      { word: '日曜日', reading: 'にちようび', meaning: '星期天' }
    ]
  },
  nu: {
    mouthShape: '鼻音流出后迅速转入扁唇“う”，舌面放平。',
    strokeOrder: ['① 左上向右下斜划一笔', '② 右上起笔弧形穿过，向左绕圈后再向右下打小结'],
    pinyinHint: '类似汉语拼音 "nu" (努)',
    ipa: '[nɯᵝ]',
    sampleWords: [
      { word: 'ぬいぐるみ', reading: 'ぬいぐるみ', meaning: '玩偶 / 毛绒公仔' },
      { word: '布', reading: 'ぬの', meaning: '布料 / 织物' },
      { word: '沼', reading: 'ぬま', meaning: '沼泽 / 池塘' }
    ]
  },
  ne: {
    mouthShape: '鼻腔起音后下巴自然微沉，口型微向两侧延展。',
    strokeOrder: ['① 左侧自上向下画垂直长竖', '② 右侧折线连贯绕圈向右甩出带小结'],
    pinyinHint: '类似汉语拼音 "ne" (呢)',
    ipa: '[ne]',
    sampleWords: [
      { word: '猫', reading: 'ねこ', meaning: '猫咪' },
      { word: '熱', reading: 'ねつ', meaning: '发烧 / 热情' },
      { word: '願い', reading: 'ねがい', meaning: '心愿 / 愿望' }
    ]
  },
  no: {
    mouthShape: '鼻音流出后唇形顺势圆收为“お”。',
    strokeOrder: ['① 一笔流利写成：从右上斜向左下，顺时针兜转大圆圈'],
    pinyinHint: '类似汉语拼音 "nuo" (诺)',
    ipa: '[no̞]',
    sampleWords: [
      { word: '飲み物', reading: 'のみもの', meaning: '饮料 / 饮品' },
      { word: '野原', reading: 'のはら', meaning: '原野 / 草原' },
      { word: '喉', reading: 'のど', meaning: '喉咙 / 咽喉' }
    ]
  },

  // は行 (h-)
  ha: {
    mouthShape: '声门处形成微弱气流摩擦，声带不震动，口腔自然大开。',
    strokeOrder: ['① 左侧画一垂直带钩长竖', '② 右上方短横', '③ 中穿直竖底部逆时针绕圈向右'],
    pinyinHint: '类似汉语拼音 "ha" (哈)',
    ipa: '[ha]',
    sampleWords: [
      { word: '花', reading: 'はな', meaning: '花朵 / 鲜花' },
      { word: '春', reading: 'はる', meaning: '春天 / 春季' },
      { word: '橋', reading: 'はし', meaning: '桥梁 / 筷子' }
    ]
  },
  hi: {
    mouthShape: '舌面靠近硬腭造成轻柔的气流摩擦，类似在玻璃上哈热气。',
    strokeOrder: ['① 从左上起笔画一小短横，顺时针兜大弧到底再向右上挑起'],
    pinyinHint: '类似拼音 "xi" 与 "hi" 之间轻柔摩擦',
    ipa: '[çi]',
    sampleWords: [
      { word: '光', reading: 'ひかり', meaning: '光芒 / 光彩' },
      { word: '火', reading: 'ひ', meaning: '火焰 / 火苗' },
      { word: '人', reading: 'ひと', meaning: '人 / 人类' }
    ]
  },
  fu: {
    mouthShape: '【特异音】上下唇自然靠拢形成窄缝，气流自双唇间吹出，切勿用上齿咬下唇发英文 f！',
    strokeOrder: ['① 顶部一点', '② 下方画大弧弯勾', '③ 左侧一点', '④ 右侧一点'],
    pinyinHint: '双唇吹灭蜡烛的声音，切勿咬嘴唇',
    ipa: '[ɸɯᵝ]',
    sampleWords: [
      { word: '冬', reading: 'ふゆ', meaning: '冬天 / 冬季' },
      { word: '船', reading: 'ふね', meaning: '船只 / 轮船' },
      { word: '富士山', reading: 'ふじさん', meaning: '富士山' }
    ]
  },
  he: {
    mouthShape: '声门轻微摩擦，随口腔向两边展开发出清脆音。',
    strokeOrder: ['① 一笔写成：左侧短斜向上扬，顶点折向右下方长长斜落'],
    pinyinHint: '类似汉语拼音 "hei" 的短读',
    ipa: '[he]',
    sampleWords: [
      { word: '部屋', reading: 'へや', meaning: '房间 / 屋子' },
      { word: '平和', reading: 'へいわ', meaning: '和平 / 平安' },
      { word: '下手', reading: 'へた', meaning: '笨拙 / 不擅长' }
    ]
  },
  ho: {
    mouthShape: '气流自喉部顺滑呼出，配合圆唇“お”，声带不震动。',
    strokeOrder: ['① 左侧长竖', '② 右上第一横', '③ 下方平行第二横', '④ 穿直竖绕圈向右'],
    pinyinHint: '类似汉语拼音 "he" 与 "o" 结合',
    ipa: '[ho̞]',
    sampleWords: [
      { word: '星', reading: 'ほし', meaning: '星星 / 天体' },
      { word: '本', reading: 'ほん', meaning: '书本 / 真实' },
      { word: '微笑', reading: 'ほほえみ', meaning: '微笑 / 笑颜' }
    ]
  },

  // ま行 (m-)
  ma: {
    mouthShape: '双唇闭合，气流自鼻腔共鸣后双唇张开释放。',
    strokeOrder: ['① 上面一条短横', '② 下面一条平行稍长横', '③ 从中穿直竖底部逆时针打圈'],
    pinyinHint: '类似汉语拼音 "ma" (妈)',
    ipa: '[ma]',
    sampleWords: [
      { word: '町', reading: 'まち', meaning: '城镇 / 街道' },
      { word: '窓', reading: 'まど', meaning: '窗户' },
      { word: '枕', reading: 'まくら', meaning: '枕头' }
    ]
  },
  mi: {
    mouthShape: '双唇闭合鼻音共鸣后随“い”向两侧嘴角拉开。',
    strokeOrder: ['① 从左上起笔画横折微弧向下绕圈', '② 自右上向左下斜斜画一撇穿过'],
    pinyinHint: '类似汉语拼音 "mi" (米)',
    ipa: '[mʲi]',
    sampleWords: [
      { word: '道', reading: 'みち', meaning: '道路 / 途径' },
      { word: '水', reading: 'みず', meaning: '水 / 清水' },
      { word: '緑', reading: 'みどり', meaning: '绿色 / 翠绿' }
    ]
  },
  mu: {
    mouthShape: '双唇闭合鼻音后迅速过渡到扁唇“う”，不噘嘴。',
    strokeOrder: ['① 上部自左向右横画', '② 从中下竖打小圈向右挑起', '③ 右上方点一点'],
    pinyinHint: '类似汉语拼音 "mu" (木)，但唇形放平',
    ipa: '[mɯᵝ]',
    sampleWords: [
      { word: '虫', reading: 'むし', meaning: '昆虫 / 虫子' },
      { word: '胸', reading: 'むね', meaning: '胸膛 / 心胸' },
      { word: '村', reading: 'むら', meaning: '村庄 / 乡村' }
    ]
  },
  me: {
    mouthShape: '双唇闭合鼻音释放，随之口型半开转入“え”。',
    strokeOrder: ['① 左上向右下斜划一撇', '② 从右上向左下大弧度画圆包裹'],
    pinyinHint: '类似汉语拼音 "mei" 的短快音',
    ipa: '[me]',
    sampleWords: [
      { word: '目', reading: 'め', meaning: '眼睛 / 视线' },
      { word: '雨傘', reading: 'めがね', meaning: '眼镜' },
      { word: '恵み', reading: 'めぐみ', meaning: '恩惠 / 赐福' }
    ]
  },
  mo: {
    mouthShape: '双唇闭合鼻音释放后唇形转为圆唇“お”。',
    strokeOrder: ['① 自上而下直竖到底部向右圆弧向上勾起', '② 上部插一短横', '③ 下部平行第二短横'],
    pinyinHint: '类似汉语拼音 "mo" (摸)',
    ipa: '[mo̞]',
    sampleWords: [
      { word: '森', reading: 'もり', meaning: '森林 / 树林' },
      { word: '物', reading: 'もの', meaning: '物品 / 东西' },
      { word: '桃', reading: 'もも', meaning: '桃子 / 桃树' }
    ]
  },

  // や行 (y-)
  ya: {
    mouthShape: '舌面靠近硬腭呈半元音 [j] 状态，迅速滑向“あ”。',
    strokeOrder: ['① 从左向右上方画弧折带弯勾', '② 右上方画一短斜点', '③ 自左上方穿下一长长撇画'],
    pinyinHint: '类似汉语拼音 "ya" (鸭)',
    ipa: '[ja]',
    sampleWords: [
      { word: '山', reading: 'やま', meaning: '高山 / 山脉' },
      { word: '休み', reading: 'やすみ', meaning: '休息 / 假期' },
      { word: '約束', reading: 'やくそく', meaning: '约定 / 承诺' }
    ]
  },
  yu: {
    mouthShape: '半元音 [j] 滑向扁唇“う”，唇部保持自然展开。',
    strokeOrder: ['① 从上向下斜竖向右绕大圈向上挑', '② 从中央自上而下垂穿一长竖'],
    pinyinHint: '类似汉语拼音 "you" (优)，扁唇不突出',
    ipa: '[jɯᵝ]',
    sampleWords: [
      { word: '雪', reading: 'ゆき', meaning: '白雪 / 雪花' },
      { word: '夢', reading: 'ゆめ', meaning: '梦想 / 梦境' },
      { word: '夕方', reading: 'ゆうがた', meaning: '傍晚 / 黄昏' }
    ]
  },
  yo: {
    mouthShape: '半元音 [j] 滑向圆唇“お”，口型由窄变圆。',
    strokeOrder: ['① 上部短横', '② 从横右端穿下竖直笔，中途逆时针打圈向右甩出'],
    pinyinHint: '类似汉语拼音 "yo" (哟)',
    ipa: '[jo̞]',
    sampleWords: [
      { word: '夜', reading: 'よる', meaning: '夜晚 / 黑夜' },
      { word: '桜', reading: 'よし', meaning: '好的 / 善意' },
      { word: '喜び', reading: 'よろこび', meaning: '喜悦 / 欢喜' }
    ]
  },

  // ら行 (r-)
  ra: {
    mouthShape: '【难点·齿龈闪音】舌尖轻快敲击上齿龈一次立即弹开，绝非英语卷舌 r 也非汉语拼音 l！',
    strokeOrder: ['① 顶部一点', '② 下部画反 S 状顺滑大弯'],
    pinyinHint: '弹舌音，舌尖在上牙龈轻点一下弹开',
    ipa: '[ɾa]',
    sampleWords: [
      { word: '雷', reading: 'らい', meaning: '雷电 / 打雷' },
      { word: '来週', reading: 'らいしゅう', meaning: '下周 / 来周' },
      { word: 'ラジオ', reading: 'ラジオ', meaning: '广播 / 收音机' }
    ]
  },
  ri: {
    mouthShape: '舌尖在上齿龈轻弹一下，随之嘴唇向两侧微展为“い”。',
    strokeOrder: ['① 左侧自上向下微竖带钩', '② 右侧自高处向下画稍长弧线'],
    pinyinHint: '舌尖轻弹齿龈发出 li/ri 之间的清脆音',
    ipa: '[ɾʲi]',
    sampleWords: [
      { word: '林檎', reading: 'りんご', meaning: '苹果' },
      { word: '旅行', reading: 'りょこう', meaning: '旅行 / 出游' },
      { word: '理由', reading: 'りゆう', meaning: '理由 / 原因' }
    ]
  },
  ru: {
    mouthShape: '舌尖轻点齿龈弹开，紧接扁唇“う”，唇部放松。',
    strokeOrder: ['① 一笔画出折线，底端逆时针打一小圆圈结'],
    pinyinHint: '舌尖轻弹齿龈发 ru',
    ipa: '[ɾɯᵝ]',
    sampleWords: [
      { word: '留守', reading: 'るす', meaning: '不在家 / 看家' },
      { word: 'ルール', reading: 'ルール', meaning: '规则 / 准则' },
      { word: '春雨', reading: 'はるさめ', meaning: '春雨' }
    ]
  },
  re: {
    mouthShape: '舌尖轻弹齿龈弹开，随之口型半张为“え”。',
    strokeOrder: ['① 左侧一竖直笔', '② 右侧折画到底部向右上方舒展扬起'],
    pinyinHint: '舌尖轻弹齿龈发 re',
    ipa: '[ɾe]',
    sampleWords: [
      { word: '歴史', reading: 'れきし', meaning: '历史' },
      { word: '冷蔵庫', reading: 'れいぞうこ', meaning: '冰箱' },
      { word: '練習', reading: 'れんしゅう', meaning: '练习' }
    ]
  },
  ro: {
    mouthShape: '舌尖轻弹齿龈弹开，配合圆唇“お”，字形与“る”类似但不打结。',
    strokeOrder: ['① 一笔连贯画出折线，底端大半弧不打圈（区别于る）'],
    pinyinHint: '舌尖轻弹齿龈发 ro',
    ipa: '[ɾo̞]',
    sampleWords: [
      { word: '廊下', reading: 'ろうか', meaning: '走廊 / 过道' },
      { word: '六', reading: 'ろく', meaning: '数字六 (6)' },
      { word: '蝋燭', reading: 'ろうそく', meaning: '蜡烛' }
    ]
  },

  // わ行 (w-) & 拨音
  wa: {
    mouthShape: '双唇微收圆呈半元音 [w]，迅速滑向“あ”。',
    strokeOrder: ['① 左侧垂直一竖', '② 右侧折向左再大半圆弧向右饱满包裹'],
    pinyinHint: '类似汉语拼音 "wa" (蛙)',
    ipa: '[ɰa]',
    sampleWords: [
      { word: '私', reading: 'わたし', meaning: '我 / 自身' },
      { word: '和食', reading: 'わしょく', meaning: '日料 / 和食' },
      { word: '笑い', reading: 'わらい', meaning: '笑容 / 笑声' }
    ]
  },
  wo: {
    mouthShape: '现代日语中常读作“お”，在句中充当宾格助词“を”。',
    strokeOrder: ['① 上部短横', '② 从中穿下折左，再向右下绕圈托底'],
    pinyinHint: '通常读音与 "o" 完全相同，仅用作语法宾语助词',
    ipa: '[o̞]',
    sampleWords: [
      { word: '本を読む', reading: 'ほんをよむ', meaning: '读书 (宾格助词)' },
      { word: 'お茶を飲む', reading: 'おちゃをのむ', meaning: '喝茶' },
      { word: '歌を歌う', reading: 'うたをうたう', meaning: '唱歌' }
    ]
  },
  n: {
    mouthShape: '【特异鼻音·独立一拍】自身不带元音，鼻腔共鸣占满整整一拍，根据后续音改变部位。',
    strokeOrder: ['① 从左上向右下斜落，顺势向右上微挑，再向下顺滑一撇'],
    pinyinHint: '鼻音，类似拼音后鼻音 ng 或前鼻音 n，单独占一拍',
    ipa: '[ɴ / n / m / ŋ]',
    sampleWords: [
      { word: '日本', reading: 'にほん', meaning: '日本' },
      { word: '音楽', reading: 'おんがく', meaning: '音乐' },
      { word: '安心', reading: 'あんしん', meaning: '安心 / 放心' }
    ]
  }
};

// 辅助函数：根据假名ID或假名文本智能获取深度解析
export function getKanaDetailedInfo(idOrKana: string, defaultRomaji: string = ''): KanaDetailInfo {
  const normalizedKey = idOrKana.toLowerCase().replace(/[^a-z]/g, '');
  if (KANA_DETAILS[normalizedKey]) {
    return KANA_DETAILS[normalizedKey];
  }

  // 浊音/半浊音等智能兜底回退
  return {
    mouthShape: `发音时保持口腔共鸣，声带充分震动，音质清晰饱满，短促不拖音。`,
    strokeOrder: ['① 标准自左向右起笔书写', '② 注意右上角两点浊音符「゛」或圆圈半浊音符「゜」的规范标注'],
    pinyinHint: `辅音与元音组合发音 [${defaultRomaji || idOrKana}]`,
    ipa: `[${defaultRomaji || idOrKana}]`,
    sampleWords: [
      { word: `${idOrKana}`, reading: defaultRomaji, meaning: '高频日常核心用词' }
    ]
  };
}

// 积木拼读实验室核心数据：辅音 + 元音
export interface ConsonantBlock {
  key: string;
  name: string;
  rowName: string;
  romaji: string;
  desc: string;
}

export const CONSONANT_BLOCKS: ConsonantBlock[] = [
  { key: '-', name: 'あ行 (元音)', rowName: 'あ行', romaji: '', desc: '声门纯元音，口腔自然发声' },
  { key: 'k', name: 'か行 (k-)', rowName: 'か行', romaji: 'k', desc: '舌根音，清脆爆破不送气' },
  { key: 's', name: 'さ行 (s-)', rowName: 'さ行', romaji: 's', desc: '齿龈擦音，气流自齿缝摩擦' },
  { key: 't', name: 'た行 (t-)', rowName: 'た行', romaji: 't', desc: '舌尖齿龈破裂音，节奏明晰' },
  { key: 'n', name: 'な行 (n-)', rowName: 'な行', romaji: 'n', desc: '鼻音共鸣，舌尖紧抵上齿龈' },
  { key: 'h', name: 'は行 (h-)', rowName: 'は行', romaji: 'h', desc: '声门与双唇轻柔呼气' },
  { key: 'm', name: 'ま行 (m-)', rowName: 'ま行', romaji: 'm', desc: '双唇闭合鼻音共鸣释放' },
  { key: 'y', name: 'や行 (y-)', rowName: 'や行', romaji: 'y', desc: '硬腭半元音，平滑滑向元音' },
  { key: 'r', name: 'ら行 (r-)', rowName: 'ら行', romaji: 'r', desc: '齿龈轻弹闪音，轻巧利落' },
  { key: 'w', name: 'わ行 (w-)', rowName: 'わ行', romaji: 'w', desc: '双唇半元音滑行' },
  { key: 'g', name: 'が行 (g-)', rowName: 'が行', romaji: 'g', desc: 'か行浊音，声带充分震动' },
  { key: 'z', name: 'ざ行 (z-)', rowName: 'ざ行', romaji: 'z', desc: 'さ行浊音，齿缝震动摩擦' },
  { key: 'd', name: 'だ行 (d-)', rowName: 'だ行', romaji: 'd', desc: 'た行浊音，舌尖爆破带声' },
  { key: 'b', name: 'ば行 (b-)', rowName: 'ば行', romaji: 'b', desc: 'は行浊音，双唇闭合爆破' },
  { key: 'p', name: 'ぱ行 (p-)', rowName: 'ぱ行', romaji: 'p', desc: 'は行半浊音，双唇爆破轻快' }
];

export const VOWEL_BLOCKS = [
  { key: 'a', char: 'a', label: 'a段 (阿)', mouth: '口大开' },
  { key: 'i', char: 'i', label: 'i段 (衣)', mouth: '嘴角微扬' },
  { key: 'u', char: 'u', label: 'u段 (乌)', mouth: '扁唇不撅' },
  { key: 'e', char: 'e', label: 'e段 (诶)', mouth: '半开明朗' },
  { key: 'o', char: 'o', label: 'o段 (哦)', mouth: '收圆不滑动' }
];

// 积木拼装映射生成器
export function assembleKanaSyllable(consonantKey: string, vowelKey: string) {
  const KANA_MAP: Record<string, { hira: string; kata: string; romaji: string; typingTips: string; word: string; meaning: string }> = {
    '-a': { hira: 'あ', kata: 'ア', romaji: 'a', typingTips: '键盘直接输入 [a]', word: '雨 (あめ)', meaning: '雨水' },
    '-i': { hira: 'い', kata: 'イ', romaji: 'i', typingTips: '键盘直接输入 [i]', word: '犬 (いぬ)', meaning: '小狗' },
    '-u': { hira: 'う', kata: 'ウ', romaji: 'u', typingTips: '键盘直接输入 [u]', word: '海 (うみ)', meaning: '大海' },
    '-e': { hira: 'え', kata: 'エ', romaji: 'e', typingTips: '键盘直接输入 [e]', word: '駅 (えき)', meaning: '车站' },
    '-o': { hira: 'お', kata: 'オ', romaji: 'o', typingTips: '键盘直接输入 [o]', word: 'お茶 (おちゃ)', meaning: '茶' },

    'ka': { hira: 'か', kata: 'カ', romaji: 'ka', typingTips: '键盘直接输入 [ka]', word: '傘 (かさ)', meaning: '雨伞' },
    'ki': { hira: 'き', kata: 'キ', romaji: 'ki', typingTips: '键盘直接输入 [ki]', word: '木 (き)', meaning: '树木' },
    'ku': { hira: 'く', kata: 'ク', romaji: 'ku', typingTips: '键盘直接输入 [ku]', word: '車 (くるま)', meaning: '车辆' },
    'ke': { hira: 'け', kata: 'ケ', romaji: 'ke', typingTips: '键盘直接输入 [ke]', word: '今朝 (けさ)', meaning: '今晨' },
    'ko': { hira: 'こ', kata: 'コ', romaji: 'ko', typingTips: '键盘直接输入 [ko]', word: '声 (こえ)', meaning: '声音' },

    'sa': { hira: 'さ', kata: 'サ', romaji: 'sa', typingTips: '键盘输入 [sa]', word: '桜 (さくら)', meaning: '樱花' },
    'si': { hira: 'し', kata: 'シ', romaji: 'shi', typingTips: '输入 [shi] 或 [si] 均可', word: '白 (しろ)', meaning: '白色' },
    'su': { hira: 'す', kata: 'ス', romaji: 'su', typingTips: '键盘输入 [su]', word: '寿司 (すし)', meaning: '寿司' },
    'se': { hira: 'せ', kata: 'セ', romaji: 'se', typingTips: '键盘输入 [se]', word: '世界 (せかい)', meaning: '世界' },
    'so': { hira: 'そ', kata: 'ソ', romaji: 'so', typingTips: '键盘输入 [so]', word: '空 (そら)', meaning: '天空' },

    'ta': { hira: 'た', kata: 'タ', romaji: 'ta', typingTips: '键盘输入 [ta]', word: '卵 (たまご)', meaning: '鸡蛋' },
    'ti': { hira: 'ち', kata: 'チ', romaji: 'chi', typingTips: '输入 [chi] 或 [ti] 均可', word: '父 (ちち)', meaning: '父亲' },
    'tu': { hira: 'つ', kata: 'ツ', romaji: 'tsu', typingTips: '输入 [tsu] 或 [tu] 均可', word: '月 (つき)', meaning: '月亮' },
    'te': { hira: 'て', kata: 'テ', romaji: 'te', typingTips: '键盘输入 [te]', word: '手 (て)', meaning: '手部' },
    'to': { hira: 'と', kata: 'ト', romaji: 'to', typingTips: '键盘输入 [to]', word: '友達 (ともだち)', meaning: '朋友' },

    'na': { hira: 'な', kata: 'ナ', romaji: 'na', typingTips: '键盘输入 [na]', word: '夏 (なつ)', meaning: '夏天' },
    'ni': { hira: 'に', kata: 'ニ', romaji: 'ni', typingTips: '键盘输入 [ni]', word: '肉 (にく)', meaning: '肉类' },
    'nu': { hira: 'ぬ', kata: 'ヌ', romaji: 'nu', typingTips: '键盘输入 [nu]', word: '布 (ぬの)', meaning: '布料' },
    'ne': { hira: 'ね', kata: 'ネ', romaji: 'ne', typingTips: '键盘输入 [ne]', word: '猫 (ねこ)', meaning: '猫咪' },
    'no': { hira: 'の', kata: 'ノ', romaji: 'no', typingTips: '键盘输入 [no]', word: '野原 (のはら)', meaning: '原野' },

    'ha': { hira: 'は', kata: 'ハ', romaji: 'ha', typingTips: '输入 [ha]，助词读 wa', word: '花 (はな)', meaning: '花朵' },
    'hi': { hira: 'ひ', kata: 'ヒ', romaji: 'hi', typingTips: '键盘输入 [hi]', word: '光 (ひかり)', meaning: '光芒' },
    'hu': { hira: 'ふ', kata: 'フ', romaji: 'fu', typingTips: '输入 [fu] 或 [hu] 均可', word: '冬 (ふゆ)', meaning: '冬天' },
    'he': { hira: 'へ', kata: 'ヘ', romaji: 'he', typingTips: '输入 [he]，方向助词读 e', word: '部屋 (へや)', meaning: '房间' },
    'ho': { hira: 'ほ', kata: 'ホ', romaji: 'ho', typingTips: '键盘输入 [ho]', word: '星 (ほし)', meaning: '星星' },

    'ma': { hira: 'ま', kata: 'マ', romaji: 'ma', typingTips: '键盘输入 [ma]', word: '町 (まち)', meaning: '城镇' },
    'mi': { hira: 'み', kata: 'ミ', romaji: 'mi', typingTips: '键盘输入 [mi]', word: '道 (みち)', meaning: '道路' },
    'mu': { hira: 'む', kata: 'ム', romaji: 'mu', typingTips: '键盘输入 [mu]', word: '虫 (むし)', meaning: '昆虫' },
    'me': { hira: 'め', kata: 'メ', romaji: 'me', typingTips: '键盘输入 [me]', word: '目 (め)', meaning: '眼睛' },
    'mo': { hira: 'も', kata: 'モ', romaji: 'mo', typingTips: '键盘输入 [mo]', word: '森 (もり)', meaning: '森林' },

    'ya': { hira: 'や', kata: 'ヤ', romaji: 'ya', typingTips: '键盘输入 [ya]', word: '山 (やま)', meaning: '高山' },
    'yu': { hira: 'ゆ', kata: 'ユ', romaji: 'yu', typingTips: '键盘输入 [yu]', word: '雪 (ゆき)', meaning: '白雪' },
    'yo': { hira: 'よ', kata: 'ヨ', romaji: 'yo', typingTips: '键盘输入 [yo]', word: '夜 (よる)', meaning: '夜晚' },

    'ra': { hira: 'ら', kata: 'ラ', romaji: 'ra', typingTips: '键盘输入 [ra]', word: '雷 (らい)', meaning: '打雷' },
    'ri': { hira: 'り', kata: 'リ', romaji: 'ri', typingTips: '键盘输入 [ri]', word: '林檎 (りんご)', meaning: '苹果' },
    'ru': { hira: 'る', kata: 'ル', romaji: 'ru', typingTips: '键盘输入 [ru]', word: '春 (はる)', meaning: '春天' },
    're': { hira: 'れ', kata: 'レ', romaji: 're', typingTips: '键盘输入 [re]', word: '歴史 (れきし)', meaning: '历史' },
    'ro': { hira: 'ろ', kata: 'ロ', romaji: 'ro', typingTips: '键盘输入 [ro]', word: '六 (ろく)', meaning: '数字六' },

    'wa': { hira: 'わ', kata: 'ワ', romaji: 'wa', typingTips: '键盘输入 [wa]', word: '私 (わたし)', meaning: '我' },
    'wo': { hira: 'を', kata: 'ヲ', romaji: 'wo', typingTips: '键盘输入 [wo]，读作 o', word: '本を読む', meaning: '看书' },

    'ga': { hira: 'が', kata: 'ガ', romaji: 'ga', typingTips: '键盘输入 [ga]', word: '外国 (がいこく)', meaning: '外国' },
    'gi': { hira: 'ぎ', kata: 'ギ', romaji: 'gi', typingTips: '键盘输入 [gi]', word: '銀行 (ぎんこう)', meaning: '银行' },
    'gu': { hira: 'ぐ', kata: 'グ', romaji: 'gu', typingTips: '键盘输入 [gu]', word: '軍 (ぐん)', meaning: '军队' },
    'ge': { hira: 'げ', kata: 'ゲ', romaji: 'ge', typingTips: '键盘输入 [ge]', word: '元気 (げんき)', meaning: '精神' },
    'go': { hira: 'ご', kata: 'ゴ', romaji: 'go', typingTips: '键盘输入 [go]', word: '午後 (ごご)', meaning: '下午' },

    'za': { hira: 'ざ', kata: 'ザ', romaji: 'za', typingTips: '键盘输入 [za]', word: '雑誌 (ざっし)', meaning: '杂志' },
    'zi': { hira: 'じ', kata: 'ジ', romaji: 'ji', typingTips: '输入 [ji] 或 [zi] 均可', word: '時間 (じかん)', meaning: '时间' },
    'zu': { hira: 'ず', kata: 'ズ', romaji: 'zu', typingTips: '键盘输入 [zu]', word: '地図 (ちず)', meaning: '地图' },
    'ze': { hira: 'ぜ', kata: 'ゼ', romaji: 'ze', typingTips: '键盘输入 [ze]', word: '全部 (ぜんぶ)', meaning: '全部' },
    'zo': { hira: 'ぞ', kata: 'ゾ', romaji: 'zo', typingTips: '键盘输入 [zo]', word: '象 (ぞう)', meaning: '大象' },

    'da': { hira: 'だ', kata: 'ダ', romaji: 'da', typingTips: '键盘输入 [da]', word: '大学 (だいがく)', meaning: '大学' },
    'di': { hira: 'ぢ', kata: 'ヂ', romaji: 'ji', typingTips: '输入 [di] 打出「ぢ」', word: '鼻血 (はなぢ)', meaning: '鼻血' },
    'du': { hira: 'づ', kata: 'ヅ', romaji: 'zu', typingTips: '输入 [du] 打出「づ」', word: '続く (つづく)', meaning: '持续' },
    'de': { hira: 'で', kata: 'デ', romaji: 'de', typingTips: '键盘输入 [de]', word: '電話 (でんわ)', meaning: '电话' },
    'do': { hira: 'ど', kata: 'ド', romaji: 'do', typingTips: '键盘输入 [do]', word: '何処 (どこ)', meaning: '哪里' },

    'ba': { hira: 'ば', kata: 'バ', romaji: 'ba', typingTips: '键盘输入 [ba]', word: '場所 (ばしょ)', meaning: '场所' },
    'bi': { hira: 'び', kata: 'ビ', romaji: 'bi', typingTips: '键盘输入 [bi]', word: '病院 (びょういん)', meaning: '医院' },
    'bu': { hira: 'ぶ', kata: 'ブ', romaji: 'bu', typingTips: '键盘输入 [bu]', word: '文学 (ぶんがく)', meaning: '文学' },
    'be': { hira: 'べ', kata: 'ベ', romaji: 'be', typingTips: '键盘输入 [be]', word: '勉強 (べんきょう)', meaning: '学习' },
    'bo': { hira: 'ぼ', kata: 'ボ', romaji: 'bo', typingTips: '键盘输入 [bo]', word: '帽子 (ぼうし)', meaning: '帽子' },

    'pa': { hira: 'ぱ', kata: 'パ', romaji: 'pa', typingTips: '键盘输入 [pa]', word: 'パン (面包)', meaning: '面包' },
    'pi': { hira: 'ぴ', kata: 'ピ', romaji: 'pi', typingTips: '键盘输入 [pi]', word: 'ピアノ (钢琴)', meaning: '钢琴' },
    'pu': { hira: 'ぷ', kata: 'プ', romaji: 'pu', typingTips: '键盘输入 [pu]', word: 'プール (泳池)', meaning: '泳池' },
    'pe': { hira: 'ぺ', kata: 'ペ', romaji: 'pe', typingTips: '键盘输入 [pe]', word: 'ペン (钢笔)', meaning: '钢笔' },
    'po': { hira: 'ぽ', kata: 'ポ', romaji: 'po', typingTips: '键盘输入 [po]', word: 'ポケット (口袋)', meaning: '口袋' }
  };

  const lookupKey = consonantKey === '-' ? `-${vowelKey}` : `${consonantKey}${vowelKey}`;
  const found = KANA_MAP[lookupKey];
  if (found) {
    return {
      exists: true,
      hiragana: found.hira,
      katakana: found.kata,
      romaji: found.romaji,
      typingTips: found.typingTips,
      exampleWord: found.word,
      exampleMeaning: found.meaning
    };
  }

  // 古音已淘汰空缺 (如 yi, ye, wu 等)
  return {
    exists: false,
    hiragana: '—',
    katakana: '—',
    romaji: `${consonantKey}${vowelKey}`,
    typingTips: '该发音在现代日语中已融合归并至元音段',
    exampleWord: '古代音节合并',
    exampleMeaning: '现代日文中直接使用元音代表'
  };
}

// 预设高频日语经典拼装组合（解决初学“搭积木”成就感）
export const PRESET_KANA_COMBOS = [
  { label: '🌸 樱花 (さくら)', consonant: 's', vowel: 'a', fullWord: 'さくら', meaning: '日本国花 · 樱花' },
  { label: '🐱 猫咪 (ねこ)', consonant: 'n', vowel: 'e', fullWord: 'ねこ', meaning: '宠物萌猫' },
  { label: '🍣 寿司 (すし)', consonant: 's', vowel: 'u', fullWord: 'すし', meaning: '传统料理' },
  { label: '🚗 车辆 (くるま)', consonant: 'k', vowel: 'u', fullWord: 'くるま', meaning: '汽车 / 车子' },
  { label: '🐶 小狗 (いぬ)', consonant: '-', vowel: 'i', fullWord: 'いぬ', meaning: '小狗 / 犬类' },
  { label: '🏔️ 富士 (ふじ)', consonant: 'h', vowel: 'u', fullWord: 'ふじ', meaning: '富士神山' },
  { label: '🌧️ 雨水 (あめ)', consonant: '-', vowel: 'a', fullWord: 'あめ', meaning: '细雨 / 雨露' },
  { label: '🍱 便当 (べんとう)', consonant: 'b', vowel: 'e', fullWord: 'べんとう', meaning: '和风便当' },
  { label: '🍵 绿茶 (おちゃ)', consonant: '-', vowel: 'o', fullWord: 'おちゃ', meaning: '日式绿茶' }
];

// 辨音室：清浊对立 & 促音长音辨析测试
export interface EarTrainingQuiz {
  id: string;
  type: 'voiced_unvoiced' | 'chouon_sokuon' | 'blind_identify';
  title: string;
  targetAudio: string;
  targetKana: string;
  options: {
    id: string;
    text: string;
    subText: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export const EAR_TRAINING_QUESTIONS: EarTrainingQuiz[] = [
  {
    id: 'ear-01',
    type: 'voiced_unvoiced',
    title: '【清浊辨听】分辨 k 与 g 的微弱声带震动',
    targetAudio: 'か',
    targetKana: 'か',
    options: [
      { id: 'opt-ka', text: 'か (ka)', subText: '清音 · 气流无振动', isCorrect: true },
      { id: 'opt-ga', text: 'が (ga)', subText: '浊音 · 声带提前震动', isCorrect: false }
    ],
    explanation: '「か」是清音，发音时声带不振动；「が」是浊音，发音瞬间声带伴随剧烈震动。'
  },
  {
    id: 'ear-02',
    type: 'voiced_unvoiced',
    title: '【清浊辨听】分辨 t 与 d 的爆破力道',
    targetAudio: 'だ',
    targetKana: 'だ',
    options: [
      { id: 'opt-ta', text: 'た (ta)', subText: '清音 · 舌尖爆破', isCorrect: false },
      { id: 'opt-da', text: 'だ (da)', subText: '浊音 · 声带紧绷震鸣', isCorrect: true }
    ],
    explanation: '听到了明显的声带底鸣，这是浊音「だ (da)」。'
  },
  {
    id: 'ear-03',
    type: 'voiced_unvoiced',
    title: '【清浊辨听】分辨 s 与 z 的摩擦质感',
    targetAudio: 'ざ',
    targetKana: 'ざ',
    options: [
      { id: 'opt-sa', text: 'さ (sa)', subText: '清音 · 纯齿隙气流', isCorrect: false },
      { id: 'opt-za', text: 'ざ (za)', subText: '浊音 · 带电般蜂鸣震颤', isCorrect: true }
    ],
    explanation: '浊音「ざ」有类似蜜蜂振翅般的声带杂音。'
  },
  {
    id: 'ear-04',
    type: 'voiced_unvoiced',
    title: '【清/浊/半浊三元对立】分辨 ha / ba / pa',
    targetAudio: 'ぱ',
    targetKana: 'ぱ',
    options: [
      { id: 'opt-ha', text: 'は (ha)', subText: '清音 · 顺畅呼气', isCorrect: false },
      { id: 'opt-ba', text: 'ば (ba)', subText: '浊音 · 双唇震颤', isCorrect: false },
      { id: 'opt-pa', text: 'ぱ (pa)', subText: '半浊音 · 双唇紧闭后轻快爆破', isCorrect: true }
    ],
    explanation: '「ぱ (pa)」是半浊音，双唇紧闭瞬间爆破，声音像小气泡炸裂般极其清脆。'
  },
  {
    id: 'ear-05',
    type: 'chouon_sokuon',
    title: '【特殊音拍】促音停顿拍 vs 平常单拍',
    targetAudio: 'きって',
    targetKana: 'きって',
    options: [
      { id: 'opt-kite', text: 'きて (ki-te)', subText: '普通连读 (来)', isCorrect: false },
      { id: 'opt-kitte', text: 'きって (ki-t-te)', subText: '促音停顿整整一拍 (邮票)', isCorrect: true }
    ],
    explanation: '单词中间有明显的“气流刹车短暂停顿整整一拍”，因此是带促音的「切符 (きって)」。'
  },
  {
    id: 'ear-06',
    type: 'chouon_sokuon',
    title: '【特殊音拍】长音双拍延展 vs 单拍短音',
    targetAudio: 'おばあさん',
    targetKana: 'おばあさん',
    options: [
      { id: 'opt-obasan', text: 'おばさん (4拍)', subText: '短音 · 意为“阿姨/大婶”', isCorrect: false },
      { id: 'opt-obaasan', text: 'おばあさん (5拍)', subText: '长音拉满两拍 · 意为“老奶奶”', isCorrect: true }
    ],
    explanation: '中间「ばあ」拖长了整整一拍，是「おばあさん (奶奶)」，长音发不满容易造成礼貌误会！'
  }
];
