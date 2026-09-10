const fs = require('fs');
const path = require('path');

const listeningLessons = [
  {
    id: 'lis-001',
    title: 'TOPIK I 经典：弘大咖啡厅点单与个性化定制',
    level: 'TOPIK I (初级)',
    category: '场景对话',
    duration: '01:15',
    badge: '真题第1-4题型',
    isFreePreview: true,
    intro: '本篇为 TOPIK I 经典简短日常对白，考察初级核心点单词汇、数量词搭配与敬语终结词尾。',
    scenario: '首尔弘大某网红咖啡厅内，店员与顾客之间的点单、口味定制及支付对话。',
    sentences: [
      {
        id: 1,
        speaker: '점원 (店员)',
        ko: '어서 오세요. 주문하시겠어요?',
        zh: '欢迎光临。请问您要点单吗？',
        roman: 'Eoseo oseyo. Jumunhasigesseoyo?',
        keyVocab: [
          { word: '어서 오세요', meaning: '欢迎光临' },
          { word: '주문하다', meaning: '点单、点菜' }
        ],
        grammarPoint: '-(으)시- (主体尊称) + -겠어요 (委婉询问)',
        timeRange: [0, 3.5]
      },
      {
        id: 2,
        speaker: '손님 (顾客)',
        ko: '네, 따뜻한 아메리카노 한 잔하고 치즈 케이크 하나 주세요.',
        zh: '好的，请给我一杯热美式咖啡和一个芝士蛋糕。',
        roman: 'Ne, ttatteut-han amerikano han janhago chijeu keikeu hana juseyo.',
        keyVocab: [
          { word: '따뜻하다', meaning: '温暖的、热的' },
          { word: '한 잔', meaning: '一杯（数词量词）' },
          { word: '주세요', meaning: '请给我' }
        ],
        grammarPoint: '名词 + 하고 (表示并列“和”)',
        timeRange: [3.5, 8.2]
      },
      {
        id: 3,
        speaker: '점원 (店员)',
        ko: '드시고 가시나요, 아니면 포장해 드릴까요?',
        zh: '请问是在这里用，还是给您打包呢？',
        roman: 'Deusigo gasinayo, animyeon pojanghae deurilkkayo?',
        keyVocab: [
          { word: '드시다', meaning: '吃/喝（먹다的敬语）' },
          { word: '포장하다', meaning: '包装、打包' },
          { word: '아니면', meaning: '或者、不然' }
        ],
        grammarPoint: '-(으)ㄹ까요? (征求对方意见)',
        timeRange: [8.2, 12.8]
      },
      {
        id: 4,
        speaker: '손님 (顾客)',
        ko: '여기서 먹고 갈게요. 얼마예요?',
        zh: '在店里吃完再走。一共多少钱？',
        roman: 'Yeogiseo meokgo galgeyo. Eolmayeyo?',
        keyVocab: [
          { word: '여기서', meaning: '在这里' },
          { word: '얼마', meaning: '多少钱' }
        ],
        grammarPoint: '-(으)ㄹ게요 (表示说话人的承诺或即时决定)',
        timeRange: [12.8, 17.0]
      },
      {
        id: 5,
        speaker: '점원 (店员)',
        ko: '모두 9,500원입니다. 진동벨로 알려드릴게요.',
        zh: '一共是 9,500 韩元。做好后会通过取餐呼叫器通知您。',
        roman: 'Modu guchon-obaek-wonimnida. Jindongbello allyeodeurilgeyo.',
        keyVocab: [
          { word: '진동벨', meaning: '震动呼叫器（取餐铃）' },
          { word: '알리다', meaning: '告知、通知' }
        ],
        grammarPoint: '-(으)로 (手段与工具助词)',
        timeRange: [17.0, 22.5]
      }
    ],
    questions: [
      {
        id: 1,
        question: '여자는 무엇을 주문했습니까? (女士点了什么？)',
        options: [
          '아이스 아메리카노와 샌드위치 (冰美式和三明治)',
          '따뜻한 아메리카노와 치즈 케이크 (热美式和芝士蛋糕)',
          '따뜻한 라테와 초콜릿 케이크 (热拿铁和巧克力蛋糕)',
          '주스 두 잔과 케이크 (两杯果汁和蛋糕)'
        ],
        correctIndex: 1,
        analysis: '女士原话提到 “따뜻한 아메리카노 한 잔하고 치즈 케이크 하나 주세요”，故选第2项。'
      }
    ]
  },
  {
    id: 'lis-002',
    title: 'TOPIK II 广播：首尔地铁 2 号线突发延误与换乘引导',
    level: 'TOPIK II (中级)',
    category: '公共广播',
    duration: '01:40',
    badge: '中级高频公播题',
    isFreePreview: true,
    intro: '考察公共告示场景下的敬语结构、被动句式与时间/线路换乘信息捕捉能力。',
    scenario: '首尔地铁2号线与4号线交汇站内，关于列车晚点及紧急维修的公播通知。',
    sentences: [
      {
        id: 1,
        speaker: '안내방송 (广播员)',
        ko: '승객 여러분께 안내 말씀 드리겠습니다.',
        zh: '各位乘客请注意，下面播送一条通知。',
        roman: 'Seung-gaek yeoreobunkke annae malsseum deurigetsseumnida.',
        keyVocab: [
          { word: '승객', meaning: '乘客' },
          { word: '안내', meaning: '引导、通知' }
        ],
        grammarPoint: '-(으)께 (给...尊称助词)',
        timeRange: [0, 4.0]
      },
      {
        id: 2,
        speaker: '안내방송 (广播员)',
        ko: '현재 상행선 선로 점검으로 인해 열차 운행이 약 15분간 지연되고 있습니다.',
        zh: '目前因上行线轨道检查，列车运行约延误15分钟。',
        roman: 'Hyeonjae sanghaengseon seonro jeomgeomeuro inhae yeolcha unhaeng-i yak sib-obungan jiyeondoego itseumnida.',
        keyVocab: [
          { word: '선로 점검', meaning: '轨道巡检' },
          { word: '지연되다', meaning: '被延误、推迟' }
        ],
        grammarPoint: '-(으)로 인해 (因为...书面语)',
        timeRange: [4.0, 10.5]
      },
      {
        id: 3,
        speaker: '안내방송 (广播员)',
        ko: '바쁘신 승객께서는 다른 대중교통을 이용해 주시기 바랍니다.',
        zh: '赶时间的乘客，请尽量换乘其他公共交通工具。',
        roman: 'Bappeusin seung-gaekkeseoneun dareun daejunggyotong-eul iyonghae jusigi baramnida.',
        keyVocab: [
          { word: '대중교통', meaning: '公共交通' },
          { word: '이용하다', meaning: '利用、使用' }
        ],
        grammarPoint: '-기 바랍니다 (请...希望...正式告示语气)',
        timeRange: [10.5, 15.8]
      }
    ],
    questions: [
      {
        id: 1,
        question: '이 안내 방송의 목적으로 알맞은 것은 무엇입니까? (本次广播的目的？)',
        options: [
          '열차 요금 인상을 안내하려고 (通知票价上涨)',
          '열차 운행 지연 상황을 알리려고 (告知列车晚点情况)',
          '새로운 지하철 노선을 홍보하려고 (宣传新地铁线路)',
          '분실물 센터 위치를 안내하려고 (指引失物招领处)'
        ],
        correctIndex: 1,
        analysis: '广播核心内容是说明列车因线路检修延误15分钟，选第2项。'
      }
    ]
  },
  {
    id: 'lis-003',
    title: 'TOPIK II 学术：大学期末论文提交与教授答疑',
    level: 'TOPIK II (中级)',
    category: '留学学术',
    duration: '01:50',
    badge: '学术场景第19-22题型',
    isFreePreview: false,
    intro: '模拟韩国大学教授办公室辅导场景，包含学术论文修改、引用规范与截止日期协商。',
    scenario: '韩国大学教授研究室内，留学生与指导教授讨论期末课程论文。',
    sentences: [
      {
        id: 1,
        speaker: '학생 (留学生)',
        ko: '교수님, 지난번에 제출한 과제에 대해 몇 가지 여쭤보고 싶어서 찾아왔습니다.',
        zh: '教授，关于上次提交的课程作业，有些问题想向您请教，所以特地前来了。',
        roman: 'Gyosunim, jinanbeone jechulhan gwajee daehae myeot gaji yeojjwobogo sipeoseo chajawatsseumnida.',
        keyVocab: [
          { word: '제출하다', meaning: '提交、呈交' },
          { word: '여쭤보다', meaning: '请教、问(묻다的敬语)' },
          { word: '찾아오다', meaning: '前来拜访' }
        ],
        grammarPoint: '-에 대해 (关于...) + -고 싶어서 (因为想要...)',
        timeRange: [0, 6.0]
      },
      {
        id: 2,
        speaker: '교수 (教授)',
        ko: '그래, 전체적인 논리 전개는 아주 훌륭한데, 참고 문헌 출처를 조금 더 명확히 보완하면 좋겠어.',
        zh: '好啊，整体的逻辑展开非常优秀，不过参考文献的来源出处要是能补充得更明确一些就更好了。',
        roman: 'Geurae, jeonchejeogin nolli jeon-gaeneun aju hullyunghande, chamgo munheon chulcheoreul jogeum deo myeonghwakhi bowanhamyeon jokesseo.',
        keyVocab: [
          { word: '논리 전개', meaning: '逻辑展开/论证' },
          { word: '참고 문헌', meaning: '参考文献' },
          { word: '보완하다', meaning: '弥补、补充完善' }
        ],
        grammarPoint: '-(으)면 좋겠다 (要是...就好了)',
        timeRange: [6.0, 13.5]
      },
      {
        id: 3,
        speaker: '학생 (留学生)',
        ko: '네, 교수님! 지적해 주신 선행 연구 논문들을 다시 검토하여 이번 주 금요일까지 최종본을 보내드리겠습니다.',
        zh: '好的教授！我会重新审阅您指出的前人先行研究论文，并在本周五前将终稿发送给您。',
        roman: 'Ne, gyosunim! Jijeokhae jusin seonhaeng yeongu nonmundeureul dasi geomtohaya...',
        keyVocab: [
          { word: '선행 연구', meaning: '先行研究/前人研究' },
          { word: '검토하다', meaning: '检讨、审阅' }
        ],
        grammarPoint: '-아/어 드리겠습니다 (为您做...谦让语)',
        timeRange: [13.5, 20.0]
      }
    ],
    questions: [
      {
        id: 1,
        question: '교수가 학생에게 제안한 점은 무엇입니까? (教授向学生提了什么建议？)',
        options: [
          '논문 주제를 다른 것으로 바꿀 것 (更换论文主题)',
          '참고 문헌의 출처를 더 명확하게 보완할 것 (更明确地补充参考文献出处)',
          '제출 기한을 일주일 연장할 것 (延长一周提交期限)',
          '발표 자료를 새로 만들 것 (重新制作汇报材料)'
        ],
        correctIndex: 1,
        analysis: '教授明确建议 “참고 문헌 출처를 조금 더 명확히 보완하면 좋겠어”，故选第2项。'
      }
    ]
  },
  {
    id: 'lis-004',
    title: '职场商务精听：新产品营销复盘与数据分析会议',
    level: 'TOPIK II (高级)',
    category: '职场商务',
    duration: '02:00',
    badge: '韩企职场实战',
    isFreePreview: false,
    intro: '模拟韩企跨国团队周会，掌握商务敬语、增长率数据汇报与项目后续改善方案。',
    scenario: '首尔江南某外企会议室内，项目主管向部门总监汇报新产品上线首周业绩。',
    sentences: [
      {
        id: 1,
        speaker: '팀장 (组长)',
        ko: '부장님, 이번 신제품 론칭 후 첫 주 매출이 목표치 대비 120%를 달성했습니다.',
        zh: '部长，本次新产品上线后第一周销售额达到了预期目标的 120%。',
        roman: 'Bujangnim, ibeon sinjepum ronching hu cheot ju maechuri mokpyochi daebi baek-isip-peosenteureul dalseonghaetsseumnida.',
        keyVocab: [
          { word: '매출', meaning: '销售额、业绩' },
          { word: '목표치', meaning: '目标值' },
          { word: '달성하다', meaning: '达成、实现' }
        ],
        grammarPoint: '名词 + 대비 (对比...相比之下)',
        timeRange: [0, 6.2]
      },
      {
        id: 2,
        speaker: '부장 (部长)',
        ko: '수고 많았어요. 2030 세대의 긍정적인 SNS 입소문 마케팅이 주효했던 것 같군요.',
        zh: '辛苦了！看来针对 2030 年轻群体的积极社交媒体口碑营销起到了关键作用。',
        roman: 'Sugo manasseoyo. I-gong-sam-gong sedae-ui geungjeongjeogin SNS ipsomun maketing-i juhyohaetteon geot gatgunyo.',
        keyVocab: [
          { word: '입소문', meaning: '口碑、人际传播' },
          { word: '주효하다', meaning: '奏效、见效' }
        ],
        grammarPoint: '-(으)ㄴ 것 같다 (看来好像是...)',
        timeRange: [6.2, 13.0]
      },
      {
        id: 3,
        speaker: '팀장 (组长)',
        ko: '다음 달 프로모션 계획도 철저히 수립하여 지속적인 매출 상승세를 이어가겠습니다.',
        zh: '下个月的促销计划我们也会周密制定，保持销售额的持续上升势头。',
        roman: 'Daeum dal peuromosyeon gyehoekdo cheoljeohi suriphayeo...',
        keyVocab: [
          { word: '상승세', meaning: '上升势头' },
          { word: '철저히', meaning: '彻底地、周密地' }
        ],
        grammarPoint: '-(으)ㄹ 계획이다 / -겠- (坚定意志)',
        timeRange: [13.0, 19.5]
      }
    ],
    questions: [
      {
        id: 1,
        question: '신제품의 성과가 좋았던 주요 원인은 무엇입니까? (新产品业绩优异的主要原因？)',
        options: [
          '가격 할인 폭이 매우 컸기 때문에 (因为降价幅度非常大)',
          '2030 세대 중심의 SNS 입소문 효과 덕분에 (多亏面向年轻人的SNS口碑营销效应)',
          '경쟁 업체가 제품 생산을 중단해서 (因为竞争对手停产)',
          'TV 광고를 대규모로 진행해서 (因为进行了大规模电视广告)'
        ],
        correctIndex: 1,
        analysis: '部长明确总结是 “2030 세대의 긍정적인 SNS 입소문 마케팅이 주효했다”，故选第2项。'
      }
    ]
  },
  {
    id: 'lis-005',
    title: '生活生存精听：首尔新村不动产 (부동산) 租房咨询',
    level: '生活实景',
    category: '实境生存',
    duration: '01:45',
    badge: '留学生租房刚需',
    isFreePreview: false,
    intro: '韩国独特的租房体制（전세全租 / 월세月租 / 보증금保证金）实战对话。',
    scenario: '新村地铁站附近不动产中介所内，中国留学生咨询学校周边的单身公寓 (원룸)。',
    sentences: [
      {
        id: 1,
        speaker: '중개사 (中介经纪人)',
        ko: '어떤 조건의 방을 찾고 계신가요? 보증금과 월세 예산이 어떻게 되세요?',
        zh: '请问您在找什么条件的房子呢？保证金和月租金预算大概是多少？',
        roman: 'Eotteon jogeon-ui bang-eul chatgo gyesin-gayo? Bojeung-geumgwa weolse yesan-i eotteoke doeseyo?',
        keyVocab: [
          { word: '보증금', meaning: '保证金/押金' },
          { word: '월세', meaning: '月租金' },
          { word: '예산', meaning: '预算' }
        ],
        grammarPoint: '-고 계시다 (正在做...敬语)',
        timeRange: [0, 5.5]
      },
      {
        id: 2,
        speaker: '유학생 (留学生)',
        ko: '학교에서 걸어서 10분 거리의 풀옵션 원룸이면 좋겠고요, 보증금 500에 월세 50만 원 정도 생각하고 있어요.',
        zh: '希望能是在学校步行10分钟距离内的全配家电单身公寓，预算大概是保证金500万、月租50万韩元左右。',
        roman: 'Hakgyo-eseo georeoseo sibbun geori-ui pul-opsyeon weonrumimyeon jokketgoyo, bojeung-geum obaek-e weolse osip-man-won jeongdo saeng-gak-hago isseoyo.',
        keyVocab: [
          { word: '풀옵션', meaning: '全家电配置 (Full Option)' },
          { word: '원룸', meaning: '单身公寓 (One-room)' },
          { word: '거리', meaning: '距离' }
        ],
        grammarPoint: '-(으)면 좋겠고요 (要是...就好了，并且...)',
        timeRange: [5.5, 13.8]
      },
      {
        id: 3,
        speaker: '중개사 (中介经纪人)',
        ko: '마침 역세권에 남향 채광이 아주 좋은 신축 매물이 하나 나왔는데, 지금 바로 보러 가실까요?',
        zh: '正好地铁站附近刚出来一套南向采光非常好的新建房源，现在就一起去看看房吗？',
        roman: 'Machim yeoksegwone namhyang chaegwang-i aju joeun sinchuk maemuri...',
        keyVocab: [
          { word: '역세권', meaning: '地铁站周边黄金商圈' },
          { word: '채광', meaning: '采光' },
          { word: '신축', meaning: '新建、刚建好' }
        ],
        grammarPoint: '-(으)ㄹ까요? (征求对方同意提议)',
        timeRange: [13.8, 20.5]
      }
    ],
    questions: [
      {
        id: 1,
        question: '유학생이 원하는 방의 조건으로 맞는 것은? (符合留学生租房条件的选项是？)',
        options: [
          '가구가 전혀 없는 빈 방 (没有任何家具的空房)',
          '학교에서 도보 10분 거리의 풀옵션 원룸 (学校步行10分钟内全配单身公寓)',
          '전세 1억 원 이상의 아파트 (全租1亿韩元以上的套房)',
          '룸메이트와 함께 사는 투룸 (和室友合住的两居室)'
        ],
        correctIndex: 1,
        analysis: '留学生明确提出 “학교에서 걸어서 10분 거리의 풀옵션 원룸”，故选第2项。'
      }
    ]
  },
  {
    id: 'lis-006',
    title: '仁川国际机场：登机口紧急变更广播与值机指引',
    level: 'TOPIK I (初级)',
    category: '公共广播',
    duration: '01:30',
    badge: '机场高频通告',
    isFreePreview: true,
    intro: '机场登机广播经典场景，掌握航班号、登机口编号与时间数字表达。',
    scenario: '仁川机场第1航站楼内，针对飞往上海浦东的 KE897 次航班登机口变更的紧急广播。',
    sentences: [
      {
        id: 1,
        speaker: '공항안내 (机场广播)',
        ko: '인천공항에서 상하이 푸둥으로 출발하는 대한항공 897편 승객 여러분께 탑승구 변경 안내 말씀 드립니다.',
        zh: '从仁川机场飞往上海浦东的大韩航空 897 次航班乘客请注意，下面播送一条登机口变更通知。',
        roman: 'Incheon-gonghang-eseo sanghai pudung-euro chulbalhaneun...',
        keyVocab: [
          { word: '탑승구', meaning: '登机口 (Gate)' },
          { word: '출발하다', meaning: '出发、起飞' }
        ],
        grammarPoint: '-(으)로 (目的地方向助词)',
        timeRange: [0, 6.5]
      },
      {
        id: 2,
        speaker: '공항안내 (机场广播)',
        ko: '당초 24번 탑승구에서 38번 탑승구로 변경되었사오니, 승객 여러분께서는 착오 없으시기 바랍니다.',
        zh: '原定 24 号登机口已变更为 38 号登机口，请各位乘客留意并避免走错。',
        roman: 'Dangcho isipsabon tapseunggu-eseo samsippalbeon tapseunggu-ro...',
        keyVocab: [
          { word: '당초', meaning: '原初、原定' },
          { word: '착오', meaning: '差错、失误' }
        ],
        grammarPoint: '-사오니 (因为...极敬郑重说明)',
        timeRange: [6.5, 13.0]
      }
    ],
    questions: [
      {
        id: 1,
        question: '변경된 탑승구 번호는 몇 번입니까? (变更后的登机口是几号？)',
        options: [
          '24번 탑승구 (24号)',
          '38번 탑승구 (38号)',
          '48번 탑승구 (48号)',
          '12번 탑승구 (12号)'
        ],
        correctIndex: 1,
        analysis: '广播明确提到从 24 号变更为 38 号登机口（38번 탑승구로 변경되었사오니），故选第2项。'
      }
    ]
  },
  {
    id: 'lis-007',
    title: '首尔综合医院内科：胃部不适问诊与处方用药指导',
    level: '生活实景',
    category: '实境生存',
    duration: '01:55',
    badge: '看病就医指南',
    isFreePreview: false,
    intro: '韩国医院就诊对话，掌握身体部位疼痛描述、病症持续时间与饭后用药说明。',
    scenario: '首尔某综合医院消化内科诊室，医生与中国患者沟通胃痛病情及饮食禁忌。',
    sentences: [
      {
        id: 1,
        speaker: '의사 (医生)',
        ko: '어디가 불편해서 오셨나요? 증상이 언제부터 시작되었어요?',
        zh: '请问您哪里不舒服呢？症状是从什么时候开始的？',
        roman: 'Eodiga bulpyeonhaeseo osyeonnayo? Jeungsang-i eonjebuteo sijakdoe-eosseoyo?',
        keyVocab: [
          { word: '불편하다', meaning: '不舒服、不适' },
          { word: '증상', meaning: '症状' }
        ],
        grammarPoint: '-아/어서 오다 (因...而来)',
        timeRange: [0, 4.5]
      },
      {
        id: 2,
        speaker: '환자 (患者)',
        ko: '이틀 전부터 속이 쓰리고 식사 후에 소화가 잘 안 되면서 명치 쪽이 콕콕 쑤셔요.',
        zh: '从两天前开始胃部泛酸烧心，饭后消化不良，而且心窝处一阵阵刺痛。',
        roman: 'Iteul jeonbuteo sog-i sseurigo siksa hue sohwaga jal an doemyeonseo...',
        keyVocab: [
          { word: '속이 쓰리다', meaning: '胃泛酸、烧心' },
          { word: '소화', meaning: '消化' },
          { word: '명치', meaning: '心口、心窝' }
        ],
        grammarPoint: '-(으)면서 (一边...一边.../同时伴随)',
        timeRange: [4.5, 12.0]
      },
      {
        id: 3,
        speaker: '의사 (医生)',
        ko: '급성 위염 증상으로 보입니다. 3일치 약을 처방해 드릴 테니, 식후 30분에 복용하시고 자극적인 음식은 피하세요.',
        zh: '看来是急性胃炎的症状。给您开3天的药，请在饭后30分钟服用，并尽量避免刺激性食物。',
        roman: 'Geupseong wiyeom jeungsang-euro boimnida. Sam-ilchi yageul...',
        keyVocab: [
          { word: '처방하다', meaning: '开处方' },
          { word: '복용하다', meaning: '服用（药物）' }
        ],
        grammarPoint: '-(으)ㄹ 테니 (因为我会...所以请...)',
        timeRange: [12.0, 19.8]
      }
    ],
    questions: [
      {
        id: 1,
        question: '의사가 환자에게 당부한 사항으로 알맞은 것은? (医生叮嘱患者的事项是？)',
        options: [
          '식사 전에 약을 먹을 것 (饭前服药)',
          '자극적인 음식을 피할 것 (避免刺激性食物)',
          '매일 2시간씩 격렬한 운동을 할 것 (每天剧烈运动2小时)',
          '입원하여 정밀 수술을 받을 것 (住院接受精密手术)'
        ],
        correctIndex: 1,
        analysis: '医生明确建议 “자극적인 음식은 피하세요”，故选第2项。'
      }
    ]
  },
  {
    id: 'lis-008',
    title: 'TOPIK II 专家讲座：人工智能与未来劳动力市场转型',
    level: 'TOPIK II (高级)',
    category: '访谈讲座',
    duration: '02:15',
    badge: '学术讲座第36-40题型',
    isFreePreview: false,
    intro: '考察社科科技前沿学术演讲长对话，掌握人工智能、人机协同与未来核心素养。',
    scenario: '韩国电视台经济论坛讲座，劳动经济学教授就生成式 AI 对就业结构的影响发表见解。',
    sentences: [
      {
        id: 1,
        speaker: '교수 (教授)',
        ko: '인공지능 기술의 비약적인 발전은 단순 반복 업무를 넘어 고도의 전문 지식 직군까지 광범위하게 재편하고 있습니다.',
        zh: '人工智能技术的飞跃式发展，已经超越了单纯重复性业务，正在广泛重塑高阶专业知识岗位。',
        roman: 'Ingongjineung gisul-ui biyagjeogin baljeon-eun...',
        keyVocab: [
          { word: '비약적', meaning: '飞跃性的' },
          { word: '재편하다', meaning: '重组、重新洗牌' }
        ],
        grammarPoint: '-(으)ㄹ 뿐만 아니라 / -를 넘어 (超越...)',
        timeRange: [0, 7.5]
      },
      {
        id: 2,
        speaker: '교수 (教授)',
        ko: '그러나 AI는 인간을 완전히 대체하는 것이 아니라, 인간과 AI가 협업하여 생산성을 극대화하는 방향으로 진화할 것입니다.',
        zh: '然而 AI 绝非完全取代人类，而是将朝着人机协同以实现生产力最大化的方向演进。',
        roman: 'Geureona AI-neun inganeul wanjeonhi daechehaneun geos-i anira...',
        keyVocab: [
          { word: '대체하다', meaning: '代替、取代' },
          { word: '협업하다', meaning: '协作、协同合作' },
          { word: '극대화하다', meaning: '最大化' }
        ],
        grammarPoint: '-는 것이 아니라 (不是...而是...)',
        timeRange: [7.5, 15.0]
      },
      {
        id: 3,
        speaker: '교수 (教授)',
        ko: '따라서 미래 인재에게 가장 요구되는 역량은 단순 지식 암기가 아닌, 비판적 사고력과 복합 문제 해결 능력입니다.',
        zh: '因此，未来人才最被看重的核心素养绝非死记硬背单纯知识，而是批判性思维与解决复杂问题的综合能力。',
        roman: 'Ttaraseo mirae injae-ege gajang yogudoeneun yeongryang-eun...',
        keyVocab: [
          { word: '역량', meaning: '素养、能力' },
          { word: '비판적 사고력', meaning: '批判性思维' }
        ],
        grammarPoint: '-이/가 아니라 (不是...而是...)',
        timeRange: [15.0, 22.5]
      }
    ],
    questions: [
      {
        id: 1,
        question: '강연자가 미래 인재에게 가장 중요하다고 강조한 역량은? (演讲者强调未来人才最核心的能力？)',
        options: [
          '단순 지식의 신속한 암기 능력 (单纯知识的快速记忆力)',
          '비판적 사고력과 복합 문제 해결 능력 (批判性思维与复杂问题解决能力)',
          '컴퓨터 하드웨어 수리 기술 (电脑硬件维修技术)',
          '외국어 단어의 다량 암기 (大量记忆外语单词)'
        ],
        correctIndex: 1,
        analysis: '教授明确总结 “가장 요구되는 역량은 비판적 사고력과 복합 문제 해결 능력”，故选第2项。'
      }
    ]
  }
];

const fileContent = export interface ListeningSentence {
  id: number;
  speaker: string;
  ko: string;
  zh: string;
  roman: string;
  keyVocab: { word: string; meaning: string }[];
  grammarPoint?: string;
  timeRange: [number, number];
}

export interface ListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  analysis: string;
}

export const LISTENING_CATEGORIES = [
  '全部',
  '真题精听',
  '场景对话',
  '公共广播',
  '访谈讲座',
  '职场商务',
  '留学学术',
  '实境生存'
] as const;

export interface ListeningLesson {
  id: string;
  title: string;
  level: 'TOPIK I (初级)' | 'TOPIK II (中级)' | 'TOPIK II (高级)' | '生活实景';
  category: '全部' | '真题精听' | '场景对话' | '公共广播' | '访谈讲座' | '职场商务' | '留学学术' | '实境生存';
  duration: string;
  badge: string;
  isFreePreview?: boolean;
  intro: string;
  scenario: string;
  sentences: ListeningSentence[];
  questions: ListeningQuestion[];
}

export const KOREAN_LISTENING_DATA: ListeningLesson[] =  + JSON.stringify(listeningLessons, null, 2) + ;\n;

fs.writeFileSync('src/data/korean/listening.ts', fileContent, 'utf8');
console.log('Successfully written listening.ts');
