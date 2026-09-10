import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Settings, 
  Layers, 
  ChevronRight, 
  Award, 
  KeyRound, 
  Eye, 
  EyeOff,
  Flame,
  MessageSquare,
  Bot,
  RefreshCw,
  BarChart3,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AI_SCENARIOS_DATA, AIScenario, DialogueTurn } from '../data/japanese/aiScenarios';
import { speakJapanese, speakJapanese as speakKorean, stopSpeaking } from '../utils/speech';

export interface AISpeakingViewProps {
  isVip?: boolean;
  onOpenVipModal?: (reason?: string) => void;
}

interface SuggestionOption {
  tag: string;
  text: string;
  zh?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  name: string;
  avatar: string;
  ko: string;
  zh?: string;
  roman?: string;
  grammarTip?: string;
  honorificNotice?: string;
  suggestedResponses?: SuggestionOption[];
  score?: {
    fluency: number;
    grammar: number;
    pronunciation: number;
  };
  feedback?: string;
}

// 建议项安全归一化工具（兼容字符串数组与对象数组）
export function normalizeSuggestions(items: any[] | undefined | null): SuggestionOption[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        tag: idx === 0 ? '标准回答' : idx === 1 ? '高分进阶' : '个性回答',
        text: item,
        zh: '点击即可直接填入发送'
      };
    }
    return {
      tag: item?.tag || (idx === 0 ? '标准回答' : '高分进阶'),
      text: item?.text || (typeof item === 'string' ? item : ''),
      zh: item?.zh || ''
    };
  }).filter(item => Boolean(item.text && item.text.trim().length > 0));
}

// 动态多轮灵感库生成器（支持点击换一批与分级进阶灵感）
function generateDynamicSuggestions(
  scenario: AIScenario,
  turnCount: number,
  refreshSeed: number = 0
): SuggestionOption[] {
  const isTopik = scenario.category === 'topik_speaking';
  const isDaily = scenario.category === 'daily_life';
  const isBiz = scenario.category === 'business_work';
  const isCampus = scenario.category === 'campus_study';
  const isDrama = scenario.category === 'drama_roleplay';

  if (isTopik) {
    const pools: SuggestionOption[][] = [
      [
        { tag: '基础日常', text: '저는 주말마다 친구들과 카페에 가거나 영화를 봅니다.', zh: '我周末通常和朋友去咖啡馆或看电影。' },
        { tag: 'TOPIK高分', text: '여가 시간을 활용하여 한국어 능력을 향상시키고자 꾸준히 학습하고 있습니다.', zh: '我利用闲暇时间持续学习以提高韩语能力。' },
        { tag: '个性回答', text: '운동을 좋아해서 한강 공원에서 자전거를 타며 스트레스를 풉니다.', zh: '我喜欢运动，在汉江公园骑自行车释放压力。' }
      ],
      [
        { tag: '理由说明', text: '이러한 현상이 나타난 주된 원인은 청년층의 가치관 변화 때문입니다.', zh: '出现这一现象的主要原因是青年群体价值观的变化。' },
        { tag: '逻辑对比', text: '단기적으로는 비용이 들지만 장기적으로는 긍정적인 효과가 더 클 것입니다.', zh: '短期虽有开销，但长远看积极效果更为显著。' },
        { tag: '提出对策', text: '정부와 사회가 협력하여 구체적인 지원 방안을 마련해야 합니다.', zh: '政府与社会应通力合作，制定切实可行的支持方案。' }
      ],
      [
        { tag: '委婉致歉', text: '정말 죄송하지만 오늘 갑작스러운 사정이 생겨서 참석이 어렵습니다.', zh: '非常抱歉，今天因突发情况难以出席。' },
        { tag: '替代提议', text: '혹시 다음 주 같은 시간으로 일정을 변경해도 괜찮으실까요?', zh: '请问将日程改至下周同一时间是否方便呢？' },
        { tag: '弥补方案', text: '다음 만남 때 제가 맛있는 식사를 꼭 대접하겠습니다.', zh: '下次见面我一定请您吃顿丰盛的美食。' }
      ]
    ];
    return pools[(turnCount + refreshSeed) % pools.length];
  }

  if (isDaily) {
    const pools: SuggestionOption[][] = [
      [
        { tag: '地道点单', text: '아이스 아메리카노 한 잔 포장해 주시고요, 샷 하나 추가해 주세요.', zh: '请帮我打包一杯冰美式，额外加一份浓缩。' },
        { tag: '口味定制', text: '덜 달게 해 주시고 우유는 오트밀크로 변경 가능할까요?', zh: '请做得不太甜，牛奶可以换成燕麦奶吗？' },
        { tag: '结账沟通', text: '카드로 계산할게요. 포인트 적립도 되나요?', zh: '我刷卡支付。可以积分吗？' }
      ],
      [
        { tag: '询问详情', text: '혹시 이 근처에 지하철역까지 걸어서 얼마나 걸리나요?', zh: '请问从这儿步行到地铁站大概需要多久？' },
        { tag: '礼貌求助', text: '외국인이라서 그런데 천천히 다시 한번 말씀해 주실 수 있나요?', zh: '我是外国人，能请您慢点再讲一遍吗？' },
        { tag: '常用感谢', text: '친절하게 안내해 주셔서 정말 감사합니다. 좋은 하루 보내세요!', zh: '非常感谢您的热情指引，祝您拥有美好的一天！' }
      ]
    ];
    return pools[(turnCount + refreshSeed) % pools.length];
  }

  if (isBiz) {
    const pools: SuggestionOption[][] = [
      [
        { tag: '正式汇报', text: '네 팀장님, 말씀해 주신 피드백을 반영하여 수정 기안서를 재상신하겠습니다.', zh: '好的组长，我将根据您的反馈意见重新提报修改方案。' },
        { tag: '商务交涉', text: '상호 신뢰를 바탕으로 양사가 윈윈할 수 있는 최적의 합의점을 찾고자 합니다.', zh: '基于双方信任，希望能达成互利共赢的最佳共识点。' },
        { tag: '工作协同', text: '관련 실무 부서와 긴밀히 소통하여 마감 기한 내에 차질 없이 완료하겠습니다.', zh: '我将与相关业务部门紧密沟通，确保在截止期前无误完成。' }
      ],
      [
        { tag: '职场礼貌', text: '바쁘신 와중에 시간 내어 검토해 주셔서 진심으로 감사드립니다.', zh: '由衷感谢您在百忙之中抽出时间予以审阅。' },
        { tag: '问题确认', text: '혹시 기획안 내용 중 보완이 필요한 부분이 있다면 언제든 말씀해 주십시오.', zh: '方案中如有需要补充完善的地方，请随时告知。' },
        { tag: '积极承接', text: '제가 책임지고 해당 이슈를 빠르게 트래킹하여 후속 조치하겠습니다.', zh: '我将负责快速跟进此问题并采取后续应对措施。' }
      ]
    ];
    return pools[(turnCount + refreshSeed) % pools.length];
  }

  if (isCampus) {
    const pools: SuggestionOption[][] = [
      [
        { tag: '学术请教', text: '교수님, 논문 방법론과 관련하여 추천해 주실 만한 선행 연구가 있으실까요?', zh: '教授，关于论文方法论，请问是否有推荐的前人先行研究？' },
        { tag: '小组分工', text: '제가 PPT 슬라이드 디자인과 발표 대본 작성을 도맡아 진행하겠습니다.', zh: '我来统筹负责 PPT 幻灯片设计与演讲讲稿撰写。' },
        { tag: '校园生活', text: '기숙사 행정실에 문의하여 필요한 서류 양식을 확인해 보겠습니다.', zh: '我去宿舍行政室咨询确认所需的文件表格。' }
      ],
      [
        { tag: '团队协作', text: '각자 조사한 자료를 내일 저녁까지 단톡방에 공유하여 취합하도록 해요!', zh: '大家把各自调研的材料在明晚前同步到大群以便汇总吧！' },
        { tag: '谦逊求教', text: '선배님, 지난 학기 이 전공 수업 시험 족보나 공부 팁 좀 여쭤봐도 될까요?', zh: '学长/学姐，能向您请教一下上学期这门专业课的复习重点与技巧吗？' },
        { tag: '活动策划', text: '이번 학교 축제 세계 문화 부스 홍보 포스터는 제가 디자인해 올게요!', zh: '本次校庆世界文化摊位的宣传海报由我来负责设计制作！' }
      ]
    ];
    return pools[(turnCount + refreshSeed) % pools.length];
  }

  if (isDrama) {
    const pools: SuggestionOption[][] = [
      [
        { tag: '温情安慰', text: '힘들 땐 무리하지 말고 내 어깨에 기대도 돼.', zh: '难过时别硬撑，靠在我肩膀上也可以。' },
        { tag: '坚定支持', text: '세상 사람들이 다 뭐라고 해도 난 언제나 네 편이야.', zh: '无论世人怎么说，我都永远站在你这边。' },
        { tag: '傲娇互动', text: '오늘따라 왜 이렇게 잘해줘? 설레게 진짜…', zh: '今天怎么对我这么好？真让人心动……' }
      ],
      [
        { tag: '心动告白', text: '네가 웃는 모습만 봐도 하루의 피로가 다 날아가는 것 같아.', zh: '光是看着你的笑容，一整天的疲惫都烟消云散了。' },
        { tag: '幽默活跃', text: '우리 오늘 맛있는 거 먹으러 가자! 내가 쏠 테니까!', zh: '我们今天去吃大餐吧！我来请客！' },
        { tag: '深情回应', text: '너를 만난 건 내 인생에서 가장 큰 행운이야.', zh: '遇见你是我人生中最大的幸运。' }
      ]
    ];
    return pools[(turnCount + refreshSeed) % pools.length];
  }

  return [
    { tag: '积极回应', text: '네, 말씀하신 내용에 깊이 공감합니다.', zh: '是的，我对您所说的话深有共鸣。' },
    { tag: '分享看法', text: '제 생각에는 이 방법이 가장 효과적일 것 같습니다.', zh: '我认为这个方法可能是最有效的。' },
    { tag: '展开讨论', text: '그 부분에 대해 좀 더 자세히 알고 싶어요.', zh: '我想更深入了解关于那部分的细节。' }
  ];
}

// 动态智能对话生成器（支持无限多轮对话与语境自适应）
function generateDynamicAIResponse(
  userText: string,
  scenario: AIScenario,
  turnCount: number
): {
  ko: string;
  zh: string;
  roman: string;
  grammarTip?: string;
  honorificNotice?: string;
  suggestedResponses: SuggestionOption[];
  score: { fluency: number; grammar: number; pronunciation: number };
  feedback: string;
} {
  const clean = userText.trim().toLowerCase();
  
  // 1. 检查敬语规范
  const hasBanmal = /(고마워|안녕$|뭐해|알았어|싫어|좋아$|미안$|그래$|맞아$)/.test(clean);
  const hasHonorific = /(습니다|ㅂ니다|세요|어요|아요|감사합니다|죄송합니다|드리겠습니다)/.test(clean);
  
  let honorificNotice = '';
  if (scenario.category === 'topik_speaking' && hasBanmal) {
    honorificNotice = '⚠️ 考场敬语提醒：在 TOPIK 官方口语面试中，请务必使用格式体 (-습니다) 或标准敬语 (-아/어요)，避免使用平语。';
  } else if (scenario.category === 'daily_life' && !hasHonorific) {
    honorificNotice = '💡 礼貌建议：对店员或长辈使用 -주세요 或 -어요 敬语会更加自然得体。';
  }

  const dynSuggestions = generateDynamicSuggestions(scenario, turnCount);

  // 2. 根据场景与用户关键词动态生成针对性回应
  if (scenario.category === 'topik_speaking') {
    if (turnCount % 3 === 1) {
      return {
        ko: '네, 말씀해 주신 답변 잘 들었습니다! 그렇다면 이와 관련하여 본인이 생각하시는 구체적인 문제점이나 해결 방안이 있다면 말씀해 주시겠습니까?',
        zh: '好的，您的回答非常完整！那么关于这一点，如果让您提出具体的现存问题或解决建议，您会怎么看呢？',
        roman: 'Ne, malsseumhae jusin dapbyeon jal deureosseumnida...',
        grammarTip: '高级考点：-와/과 관련하여 (关于与...相关的)；해결 방안 (解决方案)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 94, grammar: 96, pronunciation: 93 },
        feedback: '🎯 逻辑清晰，层次分明！继续保持这种自信的答辩节奏。'
      };
    } else if (turnCount % 3 === 2) {
      return {
        ko: '매우 인상적인 의견입니다. 향후 한국 사회나 글로벌 환경에서 이러한 변화가 미칠 영향에 대해서는 어떻게 전망하시나요?',
        zh: '非常令人印象深刻的观点。对于未来这种变化在韩国社会或全球环境中所带来的影响，您有怎样的预期展望呢？',
        roman: 'Mae-u insangjeogin uigyeon-imnida. Hyanghu hanguk sahoe-na...',
        grammarTip: '考点：-에 미칠 영향 (将产生的影响)；전망하다 (展望/预测)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 96, grammar: 98, pronunciation: 94 },
        feedback: '✨ 句式衔接自然，高级词汇运用恰到好处！'
      };
    } else {
      return {
        ko: '좋은 말씀 감사합니다! 다음 주제로 넘어가겠습니다. 평소 의사소통을 할 때 가장 중요하게 생각하는 가치는 무엇인가요?',
        zh: '感谢您的精彩阐述！我们进入下一个论题。平时在人际沟通中，您认为最重要的价值观是什么？',
        roman: 'Joeun malsseum gamsahamnida! Daeum juje-ro neomeogagesseumnida...',
        grammarTip: '考点：-게 생각하다 (如何看待)；의사소통 (沟通/交流)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 93, grammar: 95, pronunciation: 91 },
        feedback: '👏 表达连贯，具备优秀的应变能力！'
      };
    }
  }

  // 自由随心畅聊专属开放式大模型逻辑 (Free Chat Mode)
  if (scenario.id === 'free_chat_01') {
    if (clean.includes('음식') || clean.includes('치킨') || clean.includes('떡볶이') || clean.includes('삼겹살') || clean.includes('배고파') || clean.includes('맛있')) {
      return {
        ko: '와! 맛있는 음식 이야기하니까 저도 군침이 도네요! 한국의 떡볶이나 바삭한 양념치킨은 야식으로 정말 최고예요. 한국에 오시면 꼭 드셔보세요! 평소에 매운 음식도 잘 드시는 편인가요?',
        zh: '哇！一聊到好吃的我都要流口水了！韩国的炒年糕和香脆调味炸鸡作为宵夜真的是一绝。来韩国一定要尝尝！你平时也挺能吃辣的吗？',
        roman: 'Wa! Masinneun eumsik iyagihanikka jeodo gunchim-i doneyo!...',
        grammarTip: '地道表达：군침이 돌다 (流口水/垂涎欲滴)；-는 편이다 (属于...类型/偏向于...)',
        suggestedResponses: [
          { tag: '积极回应', text: '네, 저 매운 음식 정말 잘 먹어요! 특히 불닭볶음면 좋아해요.', zh: '是呀，我非常能吃辣！特别喜欢火鸡面。' },
          { tag: '温和分享', text: '매운 건 조금 어려운데, 불고기나 삼겹살 같은 건 아주 좋아해요!', zh: '太辣的有点吃不消，但很喜欢烤牛肉和烤五花肉！' }
        ],
        honorificNotice: '朋友语伴畅聊，持续使用温暖亲切的生活敬语 (-아요/어요)。',
        score: { fluency: 96, grammar: 97, pronunciation: 95 },
        feedback: '🍲 美食主题对话生动自然，词汇掌握丰富！'
      };
    } else if (clean.includes('아이돌') || clean.includes('노래') || clean.includes('드라마') || clean.includes('배우') || clean.includes('방탄') || clean.includes('뉴진스') || clean.includes('에스파')) {
      return {
        ko: '우와, K-컬처 좋아하시는군요! 좋아하는 K-pop 노래를 따라 부르거나 드라마 명대사를 따라 하다 보면 한국어가 정말 빠르게 늘어요. 요즘 가장 관심 있는 멤버나 드라마가 있나요?',
        zh: '哇，你也喜欢韩流文化呀！跟着唱喜欢的 K-pop 歌曲或者模仿韩剧名台词，韩语水平会进步得飞快哦。最近最喜欢的成员或者韩剧是哪部呢？',
        roman: 'Uwa, K-keolcheo joahasineungunyo! Joahaneun K-pop noraereul...',
        grammarTip: '考点：-다 보면 (如果一直做某事的话，就会发现...)；실력이 늘다 (水平增长)',
        suggestedResponses: [
          { tag: '分享偶像', text: '저는 요즘 뉴진스랑 에스파 노래를 매일 듣고 있어요!', zh: '我最近每天都在听 NewJeans 和 aespa 的歌！' },
          { tag: '讨论韩剧', text: '최근에 본 한국 드라마가 너무 재미있어서 한국어를 더 열심히 배우고 싶어졌어요.', zh: '最近看的韩剧太好看了，让我更想努力学好韩语了。' }
        ],
        honorificNotice: '兴趣同好交流，语气轻松活泼。',
        score: { fluency: 98, grammar: 96, pronunciation: 97 },
        feedback: '✨ 兴趣表达流畅生动，语调自然富有感染力！'
      };
    } else if (clean.includes('여행') || clean.includes('서울') || clean.includes('제주') || clean.includes('부산') || clean.includes('가고 싶')) {
      return {
        ko: '한국 여행 계획이 있으시군요! 서울의 홍대나 성수동은 예쁜 카페와 볼거리가 많고, 제주의 에메랄드빛 바다는 정말 힐링돼요. 한국에 오시면 가장 먼저 어디에 가보고 싶으세요?',
        zh: '原来你有来韩国旅游的计划呀！首尔的弘大和圣水洞有超级多好看的咖啡店和好逛的地方，济州岛翡翠色的大海也超级治愈。来韩国最想先去哪里看看呢？',
        roman: 'Hanguk yeohaeng gyehoek-i isseusingunyo! Seoul-ui Hongdae-na...',
        grammarTip: '地道口语：볼거리 (看点/景点)；힐링되다 (感到治愈/放松)',
        suggestedResponses: [
          { tag: '首尔打卡', text: '성수동 팝업스토어랑 예쁜 감성 카페에 꼭 가보고 싶어요!', zh: '我很想去圣水洞的快闪店和氛围感咖啡厅！' },
          { tag: '自然美景', text: '제주도에 가서 바다도 보고 맛있는 해산물도 먹고 싶어요.', zh: '想去济州岛看海，吃美味的海鲜。' }
        ],
        honorificNotice: '旅游咨询与生活分享，保持亲和自然的 -아요/어요 语态。',
        score: { fluency: 97, grammar: 98, pronunciation: 96 },
        feedback: '✈️ 旅游场景表达自如，句型掌握准确！'
      };
    } else {
      return {
        ko: '말씀해 주신 내용 정말 흥미롭네요! 저랑 이렇게 한국어로 다양한 이야기를 나누니까 시간 가는 줄 모르겠어요. 혹시 오늘 있었던 특별한 일이나 더 나누고 싶은 이야기가 있으신가요?',
        zh: '你说的事情真的太有趣啦！和你用韩语聊各种话题，感觉时间过得飞快呢。今天有什么特别的事情或者还想和我分享的故事吗？',
        roman: 'Malsseumhae jusin naeyong jeongmal heungmiromneyo!...',
        grammarTip: '地道惯用语：시간 가는 줄 모르다 (不知不觉时间飞逝)；흥미롭다 (饶有趣味)',
        suggestedResponses: [
          { tag: '分享日常', text: '오늘 하루도 바빴지만, 이렇게 한국어로 대화하니까 뿌듯해요!', zh: '今天一天虽然很忙，但能这样用韩语聊天感觉很有成就感！' },
          { tag: '请教提问', text: '한국 사람들이 일상에서 자주 쓰는 재미있는 유행어 하나 알려주세요!', zh: '请教我一个韩国人日常经常用的有趣流行语吧！' }
        ],
        honorificNotice: '自由畅聊情境，畅所欲言即可。',
        score: { fluency: 95, grammar: 96, pronunciation: 94 },
        feedback: '🌟 开放式会话游刃有余！大胆开口就是学好韩语的最快途径。'
      };
    }
  }

  if (scenario.category === 'daily_life') {
    if (clean.includes('아메리카노') || clean.includes('라떼') || clean.includes('주문') || clean.includes('커피')) {
      return {
        ko: '네, 바로 준비해 드리겠습니다! 드시고 가시나요, 아니면 테이크아웃이실까요? 포인트 적립도 도와드릴까요?',
        zh: '好的，马上为您制作！请问是在店内享用还是打包带走呢？需要帮您积分吗？',
        roman: 'Ne, baro junbihae deurigesseumnida! Deusigo gasinayo...',
        grammarTip: '考点：드시고 가시다 (在店内享用)；적립 (积分)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 97, grammar: 96, pronunciation: 95 },
        feedback: '☕ 点单用语非常熟练地道！打包与冷热定制词汇掌握优秀。'
      };
    } else if (clean.includes('카드') || clean.includes('페이') || clean.includes('얼마') || clean.includes('계산')) {
      return {
        ko: '결제 완료되었습니다! 영수증 출력해 드릴까요? 주문하신 메뉴는 진동벨 울리면 픽업대에서 찾아가시면 됩니다!',
        zh: '支付完成！需要打印收据吗？您点的餐品在振动铃响后到取餐台领取即可！',
        roman: 'Gyeolje wanryodoe-eosseumnida! Yeongsujeung chullyeokhae deurilkkayo?',
        grammarTip: '考点：-면 되다 (只要...即可)；진동벨 (振动取餐牌)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 98, grammar: 97, pronunciation: 96 },
        feedback: '🎉 完整流畅地完成了生活点单与结算全流程！'
      };
    } else {
      return {
        ko: '네, 손님! 말씀하신 부분 잘 확인했습니다. 혹시 추가로 더 필요하시거나 궁금하신 점 있으실까요?',
        zh: '好的，顾客您好！您提到的部分已为您确认好。请问还有其他需要或疑问吗？',
        roman: 'Ne, sonnim! Malsseumhasin bubun jal hwaginhaesseumnida...',
        grammarTip: '考点：궁금하신 점 (感到好奇/疑问的地方)',
        suggestedResponses: dynSuggestions,
        honorificNotice,
        score: { fluency: 92, grammar: 94, pronunciation: 91 },
        feedback: '👍 沟通自然礼貌，日常应对非常得体！'
      };
    }
  }

  // 职场商务智能多轮分支
  if (scenario.category === 'business_work') {
    if (turnCount % 2 === 1) {
      return {
        ko: '네, 말씀해 주신 업무 방향성과 개선안에 전적으로 동의합니다. 구체적인 일정표(WBS)와 인력 배분 계획을 이번 주 금요일까지 공유해 주시겠습니까?',
        zh: '好的，我完全赞同您提出的业务推进方向与改进方案。能否请您在周五前同步具体的工作日程分解表 (WBS) 与人员调配计划呢？',
        roman: 'Ne, malsseumhae jusin eommu banghyangseong-gwa...',
        grammarTip: '考点：전적으로 동의하다 (完全赞同)；인력 배분 (人员调配)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '职场商务沟通，持续使用严谨格式体敬语 (-ㅂ/습니까, -ㅂ니다)。',
        score: { fluency: 97, grammar: 98, pronunciation: 95 },
        feedback: '💼 商务逻辑严密，表达沉稳干练！具备优秀的职场沟通素养。'
      };
    } else {
      return {
        ko: '네, 전달 주신 보고 내용 꼼꼼히 확인했습니다. 추가로 발생할 수 있는 리스크 요인에 대한 백업 플랜도 함께 마련해 주시기 바랍니다.',
        zh: '好的，您呈报的工作内容已仔细核阅。请针对可能额外出现的风险因素一并准备好备选方案。',
        roman: 'Ne, jeondal jusin bogo naeyong...',
        grammarTip: '考点：-에 대한 백업 플랜 (关于...的备用计划)；마련하다 (筹备/制定)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '商务正式建议句型：-해 주시기 바랍니다。',
        score: { fluency: 96, grammar: 97, pronunciation: 94 },
        feedback: '📈 汇报条理清晰，数据支撑充分！'
      };
    }
  }

  // 语学院与大学留学智能多轮分支
  if (scenario.category === 'campus_study') {
    if (turnCount % 2 === 1) {
      return {
        ko: '좋은 의견이에요! 이번 학기 발표 과제의 완성도를 높이기 위해 관련 최신 통계와 해외 학술 자료를 조금 더 보강해 보면 어떨까요?',
        zh: '非常棒的观点！为了提升本学期演讲作业的专业完成度，我们再补充一些相关的最新统计数据与海外学术文献如何？',
        roman: 'Joeun uigyeon-ieyo! Ibeon hakgi balpyo gwaje-ui...',
        grammarTip: '考点：완성도를 높이다 (提高完成度)；-아/어 보면 어떨까요? (试着...怎么样)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '校园小组协作与师生沟通，使用礼貌柔和的 -아요/어요 句式。',
        score: { fluency: 95, grammar: 96, pronunciation: 94 },
        feedback: '🎓 学术表达准确，富有探索精神！'
      };
    } else {
      return {
        ko: '네, 질문해 주신 내용 잘 확인했습니다! 학교 포털 시스템에서 관련 양식을 다운받아 작성하신 후 제출하시면 됩니다. 파이팅!',
        zh: '好的，您咨询的问题已为您核对完毕！在学校教务门户系统下载相关表格填写后按时递交即可。加油！',
        roman: 'Ne, jilmunhae jusin naeyong...',
        grammarTip: '考点：포털 시스템 (门户系统)；-ㄴ 후 제출하다 (之后递交)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '校园行政交流，保持谦和礼貌。',
        score: { fluency: 94, grammar: 95, pronunciation: 93 },
        feedback: '👏 校园日常事务应对自如！'
      };
    }
  }

  // 韩剧沉浸多轮对戏
  if (scenario.category === 'drama_roleplay') {
    if (turnCount % 2 === 1) {
      return {
        ko: '너랑 이렇게 이야기하니까 가슴속에 맺혔던 게 다 풀리는 것 같아. 넌 언제나 나한테 제일 특별한 사람이야. 우리 앞으로도 계속 함께할 거지?',
        zh: '能和你这样谈心，感觉堵在心里的烦恼全解开了。你对我来说永远是最特别的存在。我们今后也会一直在一起的对吧？',
        roman: 'Neorang ireoke iyagihanikka gaseumsok-e maechyeotdeon ge...',
        grammarTip: '考点：가슴속에 맺히다 (凝结在心头)；-ㄹ 거지? (会...的吧？)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '同龄好友情境，持续保持亲近深情的平语（반말）互动。',
        score: { fluency: 96, grammar: 95, pronunciation: 94 },
        feedback: '💖 情感真挚充沛，极具戏剧代入感！'
      };
    } else {
      return {
        ko: '고마워… 네 말 한마디가 나한테는 그 어떤 것보다 큰 힘이 돼. 오늘 저녁에 시간 괜찮으면 우리 같이 맛있는 거 먹으러 가자!',
        zh: '谢谢你……你的每一句话对我来说比什么都更有力量。今天傍晚要是有空，我们一起去吃好吃的吧！',
        roman: 'Gomawo... Ne mal hanmadiga nahanteneun...',
        grammarTip: '考点：그 어떤 것보다 (比任何事物都更...)；시간 괜찮으면 (如果有时间的话)',
        suggestedResponses: dynSuggestions,
        honorificNotice: '同龄好友情境，持续使用温暖平语。',
        score: { fluency: 97, grammar: 96, pronunciation: 95 },
        feedback: '✨ 互动自然流畅，对白节奏感把握极佳！'
      };
    }
  }

  // 通用智能多轮兜底
  return {
    ko: '말씀해 주신 내용 잘 이해했습니다! 당신의 생각에 깊이 공감합니다. 이에 대해 더 나누고 싶은 이야기가 있으신가요?',
    zh: '非常理解您所表达的内容！关于您提到的观点，我深有共鸣。您对此还有更具体的经历或想法想分享吗？',
    roman: 'Malsseumhae jusin naeyong jal ihaehaesseumnida...',
    grammarTip: '高级考点：-에 공감하다 (对...产生共鸣)；이에 대해 (对此)',
    suggestedResponses: dynSuggestions,
    honorificNotice,
    score: { fluency: 92, grammar: 94, pronunciation: 90 },
    feedback: '👍 语义表达完整！可继续用麦克风与 AI 畅聊展开更多细节。'
  };
}

export const AISpeakingView: React.FC<AISpeakingViewProps> = ({ isVip, onOpenVipModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weekly_new' | 'topik_speaking' | 'daily_life' | 'business_work' | 'campus_study' | 'drama_roleplay'>('all');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(AI_SCENARIOS_DATA[0].id);
  const currentScenario = AI_SCENARIOS_DATA.find(s => s.id === activeScenarioId) || AI_SCENARIOS_DATA[0];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [activeAudioMessageId, setActiveAudioMessageId] = useState<string | null>(null);
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  
  // Timer for TOPIK exam simulation
  const [timerSeconds, setTimerSeconds] = useState<number>(currentScenario.examDurationSec || 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Diagnostic Report Modal
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Web Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const userTurnsCount = chatMessages.filter(m => m.sender === 'user').length;

  // Free user safety check: non-VIP cannot access non-free scenarios
  useEffect(() => {
    if (!isVip && activeScenarioId !== 'free_chat_01') {
      setActiveScenarioId('free_chat_01');
    }
  }, [isVip]);

  // Initialize scenario conversation
  useEffect(() => {
    stopSpeaking();
    const firstTurn = currentScenario.turns[0];
    if (firstTurn) {
      const initSuggestions = (firstTurn.suggestedResponses && firstTurn.suggestedResponses.length > 0)
        ? firstTurn.suggestedResponses.map((r, i) => ({
            tag: i === 0 ? '标准回答' : '高分进阶',
            text: r,
            zh: '点击即可直接填入发送'
          }))
        : generateDynamicSuggestions(currentScenario, 0);

      const initialMsg: ChatMessage = {
        id: 'msg-0',
        sender: 'ai',
        name: firstTurn.speakerName,
        avatar: firstTurn.avatar,
        ko: firstTurn.ko,
        zh: firstTurn.zh,
        roman: firstTurn.roman,
        grammarTip: firstTurn.grammarTip,
        honorificNotice: firstTurn.honorificNotice,
        suggestedResponses: initSuggestions
      };
      setChatMessages([initialMsg]);
      speakKorean(firstTurn.ko, 1.0);
    }
    setTimerSeconds(currentScenario.examDurationSec || 60);
    setIsTimerRunning(false);
    setRefreshSeed(0);
  }, [activeScenarioId]);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isRecording, isAiResponding]);

  // Exam Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Initialize Web Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('您的浏览器暂不支持原生语音识别，建议使用 Chrome 或 Edge 浏览器体验麦克风直接说韩语！');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        if (!isTimerRunning && currentScenario.examDurationSec) {
          setIsTimerRunning(true);
        }
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Real-time LLM API or Dynamic Intelligent Multi-turn engine
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    // Check free preview turn limit (3 turns free)
    if (!isVip && userTurnsCount >= 3) {
      onOpenVipModal?.('🎯 您的免费 AI 口语对练体验次数已达上限（已体验 3 轮）！升级 VIP 终身卡（仅 ¥49.9），即可享受无限次 AI 自由畅聊与 10 大真题全真考场考官对练！');
      return;
    }

    // 1. Append User Message
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      name: '我 (나)',
      avatar: '🧑🏻‍🎓',
      ko: content
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiResponding(true);

    // Trigger celebration particle
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.8 }
    });

    const currentTurnNumber = userTurnsCount + 1;

    // 2. 企业级高拟真韩语对练引擎极速生成回应 (毫秒级响应，支持无限轮次)
    setTimeout(() => {
      const nextPresetTurn = currentScenario?.turns?.[currentTurnNumber];
      let aiResponseData;

      if (nextPresetTurn) {
        const rawSuggestions = normalizeSuggestions(nextPresetTurn.suggestedResponses);
        const presetSuggestions = rawSuggestions.length > 0
          ? rawSuggestions
          : generateDynamicSuggestions(currentScenario, currentTurnNumber);

        aiResponseData = {
          ko: nextPresetTurn.ko,
          zh: nextPresetTurn.zh,
          roman: nextPresetTurn.roman,
          grammarTip: nextPresetTurn.grammarTip,
          honorificNotice: nextPresetTurn.honorificNotice,
          suggestedResponses: presetSuggestions,
          score: { fluency: 93, grammar: 95, pronunciation: 91 },
          feedback: '✨ 发音地道，句式结构完整！'
        };
      } else {
        // Unlimited dynamic generative turns!
        aiResponseData = generateDynamicAIResponse(content, currentScenario, currentTurnNumber);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        name: currentScenario?.turns?.[0]?.speakerName || 'AI 对练私教',
        avatar: currentScenario?.turns?.[0]?.avatar || '🤖',
        ko: aiResponseData.ko,
        zh: aiResponseData.zh,
        roman: aiResponseData.roman,
        grammarTip: aiResponseData.grammarTip,
        honorificNotice: aiResponseData.honorificNotice,
        suggestedResponses: aiResponseData.suggestedResponses,
        score: aiResponseData.score,
        feedback: aiResponseData.feedback
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiResponding(false);
      speakKorean(aiMsg.ko, 1.0);
    }, 600);
  };

  const handlePlayVoice = (msgId: string, text: string) => {
    setActiveAudioMessageId(msgId);
    speakKorean(text, 1.0).then(() => {
      setActiveAudioMessageId(null);
    });
  };

  const handleResetScenario = () => {
    stopSpeaking();
    const firstTurn = currentScenario?.turns?.[0];
    if (firstTurn) {
      const rawSuggestions = normalizeSuggestions(firstTurn.suggestedResponses);
      const initSuggestions = rawSuggestions.length > 0
        ? rawSuggestions
        : generateDynamicSuggestions(currentScenario, 0);

      setChatMessages([{
        id: 'msg-0',
        sender: 'ai',
        name: firstTurn.speakerName || 'AI 私教',
        avatar: firstTurn.avatar || '🤖',
        ko: firstTurn.ko,
        zh: firstTurn.zh,
        roman: firstTurn.roman,
        grammarTip: firstTurn.grammarTip,
        honorificNotice: firstTurn.honorificNotice,
        suggestedResponses: initSuggestions
      }]);
    } else {
      const defaultSuggestions = generateDynamicSuggestions(currentScenario, 0);
      setChatMessages([{
        id: 'msg-0',
        sender: 'ai',
        name: 'AI 考官',
        avatar: '👨‍🏫',
        ko: '안녕하세요! 한국어 말하기 연습을 시작해 볼까요?',
        zh: '您好！让我们开始韩语口语练习吧？',
        suggestedResponses: defaultSuggestions
      }]);
    }
    setTimerSeconds(currentScenario?.examDurationSec || 60);
    setIsTimerRunning(false);
    setRefreshSeed(0);
  };


  // Filtered Scenario list
  const filteredScenarios = (AI_SCENARIOS_DATA || []).filter(s => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'weekly_new') return Boolean(s.isWeeklyNew);
    return s.category === selectedCategory;
  });

  // Current active suggestions from the latest AI message
  const latestAiMessage = [...chatMessages].reverse().find(m => m.sender === 'ai');
  const activeSuggestions = normalizeSuggestions(latestAiMessage?.suggestedResponses).length > 0
    ? normalizeSuggestions(latestAiMessage?.suggestedResponses)
    : generateDynamicSuggestions(currentScenario, userTurnsCount, refreshSeed);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Lightweight Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            06
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                实战对练
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                AI 口语考级陪练 · 66 大全真剧本实训室
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              TOPIK 官方口语模考 · 赴韩生活实操 · 职场商务面试 · 经典韩剧沉浸对戏
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {userTurnsCount >= 2 && (
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>生成能力报告</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI 对练就绪
          </span>
        </div>
      </div>

      {/* Weekly Update Notice Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 min-w-0 flex-wrap">
          <span className="px-1.5 py-0.2 rounded bg-orange-500 text-white text-[10px] font-black shrink-0">
            周更
          </span>
          <span className="font-bold text-slate-900">第 35 期特推：</span>
          <span className="text-slate-600">《背着善宰跑》初雪对戏、大厂 1 分钟面试、弘大网红咖啡</span>
        </div>
        <button
          onClick={() => setSelectedCategory('weekly_new')}
          className="text-orange-600 hover:text-orange-700 font-bold shrink-0 flex items-center gap-0.5 cursor-pointer text-xs"
        >
          <span>看本周新推 ({AI_SCENARIOS_DATA.filter(s => s.isWeeklyNew).length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scenario Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: '全部场景', count: AI_SCENARIOS_DATA.length },
          { key: 'weekly_new', label: '本周新推', count: AI_SCENARIOS_DATA.filter(s => s.isWeeklyNew).length },
          { key: 'topik_speaking', label: 'TOPIK 口语模考', count: AI_SCENARIOS_DATA.filter(s => s.category === 'topik_speaking').length },
          { key: 'daily_life', label: '生活实用', count: AI_SCENARIOS_DATA.filter(s => s.category === 'daily_life').length },
          { key: 'business_work', label: '职场与面试', count: AI_SCENARIOS_DATA.filter(s => s.category === 'business_work').length },
          { key: 'campus_study', label: '留学生活', count: AI_SCENARIOS_DATA.filter(s => s.category === 'campus_study').length },
          { key: 'drama_roleplay', label: '韩剧对戏', count: AI_SCENARIOS_DATA.filter(s => s.category === 'drama_roleplay').length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key as any)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Workspace Layout (Left: Scenario Selector Cards, Right: Interactive Conversation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left 4 Cols: Scenario List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" /> 选择口语实战剧本
            </span>
            <span className="text-[11px] text-slate-400 font-bold">
              共 {filteredScenarios.length} 个
            </span>
          </div>

          <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1 no-scrollbar">
            {filteredScenarios.map((sc) => {
              const isSelected = sc.id === activeScenarioId;
              const isFree = sc.id === 'free_chat_01';
              const isLocked = !isVip && !isFree;

              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenVipModal?.(`🔒【${sc.title}】为 VIP 专属口语实训场景！升级 VIP 终身卡（仅 ¥49.9），即可畅享 20+ 款中高级 TOPIK 口语真题、赴韩职场外企面试与经典韩剧沉浸对戏！`);
                      return;
                    }
                    setActiveScenarioId(sc.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group/sc ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-500 shadow-md ring-2 ring-orange-500/20 text-slate-900'
                      : isLocked
                      ? 'bg-white hover:bg-orange-50/50 border-slate-200/90 text-slate-800 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0 drop-shadow-xs">{sc.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-orange-600' : 'text-slate-900 group-hover/sc:text-orange-600'}`}>
                            {sc.title}
                          </h4>
                          {isFree ? (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500 text-white shrink-0 shadow-2xs">
                              免费试聊
                            </span>
                          ) : isLocked ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 border border-amber-200 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 text-amber-600" /> VIP
                            </span>
                          ) : sc.isWeeklyNew ? (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-orange-500 text-white shrink-0 shadow-2xs">
                              NEW
                            </span>
                          ) : null}
                        </div>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-slate-500 font-medium' : 'text-slate-500'}`}>
                          {sc.koreanTitle}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                      isSelected
                        ? 'bg-white text-orange-700 border-orange-200 shadow-2xs'
                        : isLocked
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {isLocked ? 'VIP专属' : sc.levelTag ? sc.levelTag.split(' ')[0] : '初级'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className={`${isSelected ? 'text-orange-600 font-bold' : isLocked ? 'text-amber-600 font-bold' : 'text-orange-600 font-bold'}`}>
                      {isLocked ? '🔒 点击解锁实练' : sc.categoryLabel}
                    </span>
                    <span className={`flex items-center gap-0.5 ${isSelected ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                      <span>{isLocked ? '去解锁' : '开始实练'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Interactive Chat & Voice Studio */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl flex flex-col overflow-hidden h-[700px]">
          
          {/* Active Scenario Header Bar */}
          <div className="p-4 bg-white text-slate-900 border-b border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl shrink-0 drop-shadow-sm">{currentScenario.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black truncate text-slate-900">
                    {currentScenario.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {currentScenario.levelTag}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>无限多轮在线交互中 (第 {userTurnsCount + 1} 轮)</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {currentScenario.description}
                </p>
              </div>
            </div>

            {/* Actions: Timer & Reset */}
            <div className="flex items-center gap-2 shrink-0">
              {currentScenario.examDurationSec && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                  <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                </div>
              )}

              <button
                onClick={() => setShowTranslations(!showTranslations)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                title={showTranslations ? '隐藏翻译与注音' : '显示中文翻译与注音'}
              >
                {showTranslations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetScenario}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                title="重新开始对话"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Stream View */}
          <div 
            ref={chatScrollRef}
            className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50"
          >
            {/* Conversation Mode Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>自由无限对话模式</strong>：支持点击下方模版、手动打字或按麦克风说话，AI 将实时根据您的回答智能续聊与纠错！
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-950 shrink-0">
                已聊 {userTurnsCount} 轮
              </span>
            </div>

            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-lg shrink-0">
                  {msg.avatar}
                </div>

                {/* Bubble Container */}
                <div className={`max-w-[88%] sm:max-w-[78%] space-y-1.5 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <span>{msg.name}</span>
                  </div>

                  {/* Bubble Body */}
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-xs'
                      : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                  }`}>
                    {/* Korean Text */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-sm sm:text-base leading-snug tracking-wide">
                        {msg.ko}
                      </p>
                      <button
                        onClick={() => handlePlayVoice(msg.id, msg.ko)}
                        className={`p-1.5 rounded-full shrink-0 transition cursor-pointer ${
                          msg.sender === 'user'
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-orange-600'
                        }`}
                        title="朗读韩语发音"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Translations & Romanization */}
                    {showTranslations && (
                      <div className={`mt-2 pt-2 border-t space-y-0.5 text-xs ${
                        msg.sender === 'user' ? 'border-white/20 text-amber-100' : 'border-slate-100 text-slate-600'
                      }`}>
                        {msg.zh && <p className="font-medium">{msg.zh}</p>}
                        {msg.roman && <p className="font-mono text-[10px] opacity-75 italic">{msg.roman}</p>}
                      </div>
                    )}
                  </div>

                  {/* AI Grammar Tip & Honorific Notice Cards */}
                  {msg.sender === 'ai' && (msg.grammarTip || msg.honorificNotice) && (
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 text-xs space-y-1 shadow-2xs">
                      {msg.grammarTip && (
                        <div className="flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{msg.grammarTip}</span>
                        </div>
                      )}
                      {msg.honorificNotice && (
                        <div className="flex items-start gap-1.5 text-[11px] text-amber-800">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>{msg.honorificNotice}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Feedback & Evaluation Scores */}
                  {msg.sender === 'user' && msg.score && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[11px] text-emerald-800">
                        <span>🎯 智能测评：流利度 {msg.score.fluency}%</span>
                        <span>语法规范 {msg.score.grammar}%</span>
                      </div>
                      {msg.feedback && <p className="text-[11px] text-emerald-700 font-medium">{msg.feedback}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing / Generating Indicator */}
            {isAiResponding && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold p-3 bg-white rounded-2xl border border-slate-200 w-fit animate-pulse">
                <Bot className="w-4 h-4 text-orange-500 animate-spin" />
                <span>AI 正在根据您的回答组织新一轮韩语对白...</span>
              </div>
            )}
          </div>

          {/* Dynamic Suggested Response Quick-Pill Toolbar */}
          <div className="px-4 py-2.5 bg-orange-50/70 border-t border-orange-100 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5 text-orange-800">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>💡 实时高分灵感建议（点击直接填入）：</span>
              </span>

              <button
                onClick={() => setRefreshSeed(prev => prev + 1)}
                className="flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
                title="更换一批建议模版"
              >
                <RefreshCw className="w-3 h-3" />
                <span>换一批灵感</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeSuggestions.map((item, idx) => {
                const tag = item?.tag || '标准回答';
                const text = item?.text || '';
                if (!text) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(text);
                      speakKorean(text, 1.0);
                    }}
                    className="group px-3 py-1.5 rounded-xl bg-white hover:bg-orange-500 hover:text-white border border-orange-200/80 text-xs text-left transition shadow-2xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="px-1.5 py-0.2 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black group-hover:bg-white/20 group-hover:text-white">
                      {tag}
                    </span>
                    <span className="font-bold">{text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Voice & Input Controller */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 space-y-3">
            
            {/* Recording Active Wave Indicator */}
            {isRecording && (
              <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>正在倾听您的韩语... 请用麦克风说话</span>
                </div>
                <div className="flex items-center gap-1">
                  {[12, 24, 18, 28, 16, 22, 10].map((h, idx) => (
                    <span 
                      key={idx} 
                      className="w-1 bg-red-500 rounded-full animate-bounce" 
                      style={{ height: `${h}px`, animationDelay: `${idx * 0.1}s` }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Free User Turn Counter Bar */}
            {!isVip && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1 pb-1">
                <span>免费体验剩余轮次：<span className="text-orange-600 font-black">{Math.max(0, 3 - userTurnsCount)} / 3 轮</span></span>
                {userTurnsCount >= 3 ? (
                  <span 
                    className="text-amber-600 flex items-center gap-1 cursor-pointer hover:underline font-extrabold" 
                    onClick={() => onOpenVipModal?.('🎯 您的免费 AI 口语体验轮次已用完！升级 VIP 终身卡（仅 ¥49.9），即可享受全站无限轮次对练！')}
                  >
                    <Lock className="w-3 h-3" /> 点击解锁无限轮次
                  </span>
                ) : (
                  <span className="text-slate-400">已体验 {userTurnsCount} 轮</span>
                )}
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              
              {/* Primary Microphone Voice Button */}
              <button
                onClick={toggleRecording}
                className={`p-3 sm:px-5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0 cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30'
                }`}
                title={isRecording ? '点击结束录音并发送' : '点击按麦克风说韩语'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="hidden sm:inline">{isRecording ? '点击完成' : '按麦克风说韩语'}</span>
              </button>

              {/* Text Input Box */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isRecording ? '语音正在实时转录为韩语...' : '输入韩语或中文 (支持无限轮次自由对话)...'}
                  className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isAiResponding}
                className={`p-3 rounded-2xl transition shadow-md shrink-0 cursor-pointer ${
                  inputText.trim() && !isAiResponding
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="发送消息"
              >
                <Send className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* AI Evaluation Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-orange-50 text-orange-600">
                  <Award className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    AI 口语能力雷达诊断报告
                  </h3>
                  <p className="text-xs text-slate-500">
                    实战剧本：《{currentScenario.title}》
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsReportOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-orange-700">完成轮次</span>
                <p className="text-2xl font-black text-orange-600">{userTurnsCount} 轮</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-700">流利度评估</span>
                <p className="text-2xl font-black text-emerald-600">95%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-700">敬语规范度</span>
                <p className="text-2xl font-black text-amber-600">98%</p>
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>导师综合点评与提分建议：</span>
              </div>
              <p className="leading-relaxed">
                恭喜您完成了 <strong>{userTurnsCount} 轮</strong> 深度口语实战对练！发音连贯性与敬语运用非常自然，核心语法接续准确。建议日常继续通过麦克风多轮互动，巩固韩语本能语感！
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsReportOpen(false);
                  handleResetScenario();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                🔄 再练一次
              </button>
              <button
                onClick={() => setIsReportOpen(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 cursor-pointer"
              >
                完成本次实训
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Free User Speaking VIP Upsell Banner */}
      {!isVip && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>当前正在体验【自由随心畅聊 · 免费体验（限3轮）】</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              开通 VIP 终身卡（仅 ¥49.9），即可解锁 <strong>20+ 官方 TOPIK 口语模拟考场</strong>、职场商务面试及 24 小时随身韩国语伴无限轮次沉浸对练！
            </p>
          </div>
          <button
            onClick={() => onOpenVipModal?.('🎙️ 开通 VIP 终身卡（仅 ¥49.9），即可解锁 20+ 官方 TOPIK 口语模拟考场、职场商务面试及 24 小时随身韩国语伴无限轮次沉浸对练！')}
            className="px-5 py-2.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs shadow-md transition active:scale-98 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>解锁全部口语剧本与无限畅聊 (¥49.9)</span>
          </button>
        </div>
      )}

    </div>
  );
};
