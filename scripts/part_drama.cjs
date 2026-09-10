const dramaRoleplayScenarios = [
  {
    id: 'kdrama_01',
    title: '《背着善宰跑》· 汉江桥上的初雪心动重逢',
    koreanTitle: '선재 업고 튀어 · 한강다리 첫눈 재회',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🎬',
    gradient: 'from-amber-600 to-rose-900',
    description: '穿越时空回到高中，在纷飞的初雪中与撑着黄雨伞的柳善宰重逢对话。',
    targetSkills: ['情感对白表达', '同龄平语 (-아/야, -지?)', '心动与安慰'],
    systemPrompt: '你是《背着善宰跑》中的柳善宰，深情温暖。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '류선재 (柳善宰)',
        avatar: '🧑🏻‍🎓',
        ko: '솔아, 눈 온다. 왜 우산도 안 쓰고 이러고 서 있어? 감기 걸리면 어쩌려고…',
        zh: '小率，下雪了。怎么连伞都不撑就傻站在这儿？要是感冒了该怎么办……',
        roman: 'Sol-a, nun onda. Wae usando an sseugo...',
        grammarTip: '考点：-면 어쩌려고 (要是...的话怎么办)；반말 (平语)',
        suggestedResponses: [
          '선재야! 네가 살아있어서… 정말 다행이야. 다신 어디 가지 마.',
          '선재야, 나 너 지키러 왔어. 이번엔 내가 널 꼭 지켜줄게.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_02',
    title: '《眼泪女王》· 德国薰衣草田的深情告白',
    koreanTitle: '눈물의 여왕 · 독일 라벤더밭 진심 고백',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '👑',
    gradient: 'from-rose-700 to-purple-950',
    description: '与女王集团财阀继承人洪海仁在德国异国街头敞开心扉，挽救彼此濒临破碎的婚姻。',
    targetSkills: ['傲娇与真诚交织', '深度情感交锋', '誓言与承诺'],
    systemPrompt: '你是《眼泪女王》中的洪海仁，外冷内热。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '홍해인 (洪海仁)',
        avatar: '👸🏻',
        ko: '백현우, 나 안 보여? 여기까지 왜 따라왔어? 나 불쌍해서 동정하는 거야?',
        zh: '白贤佑，你看不见我吗？为什么一路追到这里？是因为看我可怜在同情我吗？',
        roman: 'Baek Hyun-woo, na an boyeo?...',
        grammarTip: '考点：-는 거야? (是在...吗？)；동정하다 (同情)',
        suggestedResponses: [
          '동정 아니야. 널 혼자 둘 수 없어서 왔어. 사랑해, 해인아.',
          '너 없는 내 인생은 아무 의미 없어. 기적이 있다면 너와 함께 기적을 만들고 싶어.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_03',
    title: '《鬼怪》· 荞麦花田初次召唤与雨伞相遇',
    koreanTitle: '도깨비 · 메밀꽃밭 첫 소환과 우산',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🕯️',
    gradient: 'from-slate-700 to-indigo-950',
    description: '吹灭生日蜡烛意外召唤出沉睡九百年的鬼怪金侁，在荞麦花海中探讨命运。',
    targetSkills: ['唯美文艺台词', '古今混用敬语', '命运隐喻'],
    systemPrompt: '你是活了900年的鬼怪金侁，沧桑深邃。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '김신 도깨비 (金侁鬼怪)',
        avatar: '🗡️',
        ko: '너야? 날 불러낸 게 너냐고. 대체 날 어떻게 소환한 거지?',
        zh: '是你吗？把本座召唤出来的人是你吗。你究竟是通过什么方式召唤我的？',
        roman: 'Neo-ya? Nal bulleonaen ge neonyago...',
        grammarTip: '考点：-냐고 묻다 (质问)；소환하다 (召唤)',
        suggestedResponses: [
          '저도 모르게 촛불을 껐더니 아저씨가 나타났어요! 아저씨 진짜 도깨비 맞아요?',
          '메밀꽃의 꽃말이 뭔지 아세요? "연인"이래요. 우리 운명인가 봐요.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_04',
    title: '《机智的医生生活》· 律帝医院五人组乐团排练',
    koreanTitle: '슬기로운 의사생활 · 99즈 밴드 합주와 칼국수',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🩺',
    gradient: 'from-teal-600 to-slate-950',
    description: '与李翊晙、蔡颂和等 99 级五人帮在地下室排练经典老歌，排练后一起抢吃刀削面。',
    targetSkills: ['生动生活化平语', '朋友间打趣互怼', '日常暖心互动'],
    systemPrompt: '你是机医搞笑活宝兼天才医生李翊晙。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '이익준 (李翊晙)',
        avatar: '👨🏻‍⚕️',
        ko: '야야, 베이스 박자 또 놓쳤지? 오늘 합주 끝나고 송화가 칼국수 쏜다니까 집중하자!',
        zh: '喂喂，贝斯节拍是不是又漏了？颂和说今天排练完她请吃刀削面，大家集中精神！',
        roman: 'Ya ya, beiseu bakja tto...',
        grammarTip: '考点：-ㄴ다니까 (因为听说要...所以)；박자를 놓치다 (漏拍)',
        suggestedResponses: [
          '익준아, 네 보컬 음정이 더 불안하거든? 칼국수에 만두 추가하는 거지?',
          '오늘 야간 당직만 아니었으면 밤새 연습하는 건데 아쉽다!'
        ]
      }
    ]
  },
  {
    id: 'kdrama_05',
    title: '《黑暗荣耀》· 棋盘前的复仇对弈与命运宣判',
    koreanTitle: '더 글로리 · 바둑판 앞의 복수와 침묵',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '♟️',
    gradient: 'from-slate-900 to-black',
    description: '在静谧压抑的棋院与文东恩对弈黑白围棋，展开字字诛心的复仇交锋。',
    targetSkills: ['冷峻气场营造', '哲理隐喻对白', '克制而极具张力的表达'],
    systemPrompt: '你是《黑暗荣耀》中的文东恩，冷峻坚毅。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '문동은 (文东恩)',
        avatar: '♟️',
        ko: '바둑은 침묵 속에서 욕망을 드러내는 게임이죠. 당신의 다음 수는 어디인가요, 연진아?',
        zh: '围棋是在无声的沉默中袒露欲望的博弈。你的下一步棋会落在哪里呢，妍珍啊？',
        roman: 'Baduk-eun chimmuk sog-eseo...',
        grammarTip: '考点：-에 비유하다 (比喻为...)；침묵 속에서 (在沉默中)',
        suggestedResponses: [
          '난 네가 만든 지옥에서 한 발짝도 나갈 생각이 없어. 끝까지 가보자, 동은아.',
          '침묵 끝에 남는 건 결국 폐허뿐이야. 하지만 난 멈추지 않을 거야.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_06',
    title: '《请回答1988》· 双门洞胡同口与崔泽的夜聊',
    koreanTitle: '응답하라 1988 · 쌍문동 골목길 택이와의 대화',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '📼',
    gradient: 'from-amber-700 to-yellow-950',
    description: '回到 1988 年的双门洞胡同，坐在台阶上陪刚下棋归来的阿泽吃热腾腾的烤红薯。',
    targetSkills: ['复古怀旧温馨对白', '亲近温暖关怀', '胡同邻里情谊'],
    systemPrompt: '你是双门洞围棋天才崔泽阿泽，单纯温柔。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '최택 (崔泽阿泽)',
        avatar: '👦🏻',
        ko: '덕선아, 오늘 대국 끝나고 오는데 네 생각 많이 나더라. 너 밥은 먹었어?',
        zh: '德善啊，今天下完棋回来的路上，格外想你。你吃晚饭了吗？',
        roman: 'Deoksun-a, oneul daeguk kkeutnago...',
        grammarTip: '考点：생각이 나다 (想起某人)；-았/었어? (吃饭了吗平语)',
        suggestedResponses: [
          '택아, 오늘 대국 이겼어? 너 또 두통약 먹었지? 밥 챙겨 먹어야 해!',
          '선우네랑 정환이네 다 모여서 방금 라면 끓여 먹었어. 너 주려고 귤 남겨뒀지!'
        ]
      }
    ]
  },
  {
    id: 'kdrama_07',
    title: '《太阳的后裔》· 乌鲁克战地与柳时镇大尉调侃',
    koreanTitle: '태양의 후예 · 우르크 파병지 유시진 대위',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🪖',
    gradient: 'from-amber-800 to-slate-950',
    description: '在异国维和战地帐篷前，与特战队柳时镇大尉展开机智幽默又深情的战地对话。',
    targetSkills: ['军旅格式体 (-지 말입니다)', '俏皮幽默化解危机', '浪漫告白'],
    systemPrompt: '你是幽默英勇的柳时镇大尉。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '유시진 대위 (柳时镇大尉)',
        avatar: '🪖',
        ko: '강 선생, 사과할까요, 고백할까요? 전 지금 아주 진지하지 말입니다.',
        zh: '姜医生，是要我道歉呢，还是要我告白呢？我现在可是非常认真的。',
        roman: 'Kang seonsaeng, sagwahalkkayo...',
        grammarTip: '考点：-지 말입니다 (军旅特有句尾)；-ㄹ까요 (是要...吗)',
        suggestedResponses: [
          '유 대위님은 매번 위험한 곳만 골라 가면서 사람 마음을 이렇게 흔들어 놓으시네요.',
          '사과하지 말고 고백하세요. 저도 유 대위님 기다렸단 말이에요.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_08',
    title: '《来自星星的你》· 与都敏俊教授聊400年时空',
    koreanTitle: '별에서 온 그대 · 도민준 교수와 400년의 시간',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '高级 (TOPIK 5-6)',
    icon: '🛸',
    gradient: 'from-slate-800 to-indigo-950',
    description: '在阳台初雪夜与拥有超能力的外星人都教授探讨时间、爱与炸鸡啤酒。',
    targetSkills: ['傲娇高冷学者语气', '深刻时空哲理', '浪漫反差萌'],
    systemPrompt: '你是外星人都敏俊教授，理性克制但深情。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '도민준 교수 (都敏俊教授)',
        avatar: '🪐',
        ko: '인간의 100년이라는 시간은 제게는 찰나에 불과합니다. 그런데 왜 당신과 함께하는 1초는 이토록 길게 느껴질까요?',
        zh: '人类所谓的百年岁月，于我而言不过是转瞬即逝的刹那。可为何与你相伴的一秒钟，却让人感觉如此漫长？',
        roman: 'Ingan-ui 100-nyeon-iraneun siganeun...',
        grammarTip: '考点：찰나에 불과하다 (不过是刹那)；이토록 (如此这般)',
        suggestedResponses: [
          '도민준 씨, 400년 동안 혼자 외로웠을 텐데 이제 내 옆에서 평생 같이 떡볶이랑 치맥 먹어요!',
          '당신이 어느 별에서 왔든 상관없어요. 지금 내 눈앞에 있는 당신이 중요하니까요.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_09',
    title: '《梨泰院Class》· 甜夜酒馆与朴世路的创业誓言',
    koreanTitle: '이태원 클라쓰 · 단밤 포차 박새로이의 다짐',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🌰',
    gradient: 'from-amber-800 to-red-950',
    description: '在梨泰院小酒馆与不向强权妥协的热血青年朴世路举杯畅谈人生与初心。',
    targetSkills: ['热血励志表达', '坚定意志阐述', '不服输的人生态度'],
    systemPrompt: '你是梨泰院甜夜酒馆老板朴世路。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '박새로이 (朴世路)',
        avatar: '🌰',
        ko: '내 가치를 네가 정하지 마. 내 인생 이제 시작이고 난 원하는 거 다 이루면서 살 거야!',
        zh: '我的价值不用你来定义。我的人生才刚刚开始，我想要的一切全都会一件件实现！',
        roman: 'Nae gachi-reul nega jeonghaji ma...',
        grammarTip: '考点：가치를 정하다 (定义价值)；다 이루다 (全部达成)',
        suggestedResponses: [
          '새로이야, 네 소신이 틀리지 않았다는 걸 세상에 꼭 보여주자. 나도 끝까지 함께할게!',
          '단밤을 대한민국 최고의 프랜차이즈로 키워보자. 짠!'
        ]
      }
    ]
  },
  {
    id: 'kdrama_10',
    title: '《德鲁纳酒店》· 月之客栈与张满月社长的华丽日常',
    koreanTitle: '호텔 델루나 · 장만월 사장의 럭셔리 힐링',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '🌕',
    gradient: 'from-purple-800 to-slate-950',
    description: '在只有亡灵才能入住的神秘酒店，应付挥金如土又傲娇可爱的千年社长张满月。',
    targetSkills: ['傲娇女王口吻', '奢华幽默对白', '治愈温情隐藏'],
    systemPrompt: '你是德鲁纳酒店社长张满月。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '장만월 사장 (张满月社长)',
        avatar: '💃🏻',
        ko: '구찬성, 내 다이아몬드 목걸이 결제 승인 왜 안 해줘? 내가 배고프면 호텔 문 닫는 거 보고 싶어?',
        zh: '具灿星，我的钻石项链刷卡为什么不给审批？难道想看到我肚子饿了把酒店大门给关了吗？',
        roman: 'Gu Chan-sung, nae daiamondeu...',
        grammarTip: '考点：결제 승인을 해주다 (审批刷卡)；-는 거 보고 싶어? (想看到...吗)',
        suggestedResponses: [
          '사장님, 이번 달 샴페인 값이랑 명품 쇼핑비로 호텔 재정이 파산 직전입니다!',
          '맛있는 만두 맛집 찾아뒀으니까 목걸이 대신 만두 먹으러 가시죠, 사장님.'
        ]
      }
    ]
  },
  {
    id: 'kdrama_11',
    title: '《举重妖精金福珠》· 体育大学操场欢喜冤家斗嘴',
    koreanTitle: '역도요정 김복주 · 한얼체대 풋풋한 썸',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '初级 (TOPIK 1-2)',
    icon: '🏋🏻‍♀️',
    gradient: 'from-pink-600 to-amber-950',
    description: '在体育大学校园里与游泳部初恋男友郑俊亨打打闹闹、互喊“小胖子 (뚱)”。',
    targetSkills: ['青春校园打情骂俏', '俏皮昵称', '纯真初恋心动'],
    systemPrompt: '你是游泳部帅气皮皮鬼郑俊亨。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '정준형 (郑俊亨)',
        avatar: '🏊🏻‍♂️',
        ko: '어이, 복주! 뚱~ 너 오늘따라 왜 이렇게 예쁘게 꾸미고 나왔어? 누구 만나러 가냐?',
        zh: '喂，福珠！小胖子~ 你今天怎么打扮得这么漂亮就出来了？这是去见谁呀？',
        roman: 'Eoi, Bok-ju! Ttung~...',
        grammarTip: '考点：예쁘게 꾸미다 (漂亮打扮)；누구 만나러 가다 (去见谁)',
        suggestedResponses: [
          '정준형 너 진짜 죽고 싶냐? 뚱이라고 부르지 말라니까! 닭발이나 사줘!',
          '너 보려고 예쁘게 입고 온 거거든? 눈치 진짜 없다, 정준형!'
        ]
      }
    ]
  },
  {
    id: 'kdrama_12',
    title: '《继承者们》· 帝国高中走廊霸气对峙',
    koreanTitle: '상속자들 · 제국고등학교 복도 대치',
    category: 'drama_roleplay',
    categoryLabel: '经典韩剧对戏',
    levelTag: '中级 (TOPIK 3-4)',
    icon: '👑',
    gradient: 'from-amber-700 to-slate-950',
    description: '在贵族高中走廊里与财阀二代金叹面对面，感受名台词“我可能喜欢上你了吗”。',
    targetSkills: ['霸道名台词对答', '韩剧经典句式 (-는가?)', '心跳博弈'],
    systemPrompt: '你是帝国集团继承人金叹。',
    turns: [
      {
        id: 1,
        speaker: 'ai',
        speakerName: '김탄 (金叹)',
        avatar: '🤴🏻',
        ko: '혹시 나 너 좋아하냐? 대답해, 차은상. 도망칠 생각 하지 말고.',
        zh: '我可能……喜欢上你了吗？回答我，车恩尚。别想着逃跑。',
        roman: 'Hoksi na neo joahanya?...',
        grammarTip: '考点：-냐? (反问疑问句尾)；도망칠 생각 하지 마 (别想逃跑)',
        suggestedResponses: [
          '김탄, 우린 사는 세계가 너무 달라. 더 이상 나한테 다가오지 마.',
          '도망 안 쳐. 나도 네가 신경 쓰여서 미칠 것 같단 말이야.'
        ]
      }
    ]
  }
];

module.exports = { dramaRoleplayScenarios };
console.log('Drama Scenarios count:', dramaRoleplayScenarios.length);
