const zhCNText = {
  quiz: {
    badgeTitle: '洛克王国本命测试',
    progressLabel: '第 {current} / {total} 题',
    previous: '上一题',
  },
  result: {
    completed: '鉴定完成',
    restart: '重新测试',
    shinyRefresh: '我要刷异色！',
    portraitSource: '立绘来源：洛克王国世界 BiliBili WIKI 图鉴',
    spiritPartnerLabel: '本命精灵',
    personality: '性格',
    habitat: '栖息地',
    viewWiki: '查看 Wiki 资料',
    shareResultImage: '分享结果',
    shareLink: '分享链接',
    downloadImage: '下载图片',
    downloadSoon: '下载图片功能即将上线',
    downloadSuccess: '图片下载成功',
    downloadFailed: '下载失败，请稍后重试',
    shareToMoments: '分享到朋友圈（复制链接）',
    githubStar: '觉得不错？来 GitHub 点个 Star',
    copySuccess: '已复制分享文案与链接',
    copyFailed: '复制失败，请手动复制地址栏链接',
    entertainmentNotice: '题目与人格分析皆由AI生成，测试结果仅供娱乐。',
    shareText: '我在洛克王国的本命精灵是 {petName}！你也快来试试吧：',
    personalities: ['固执', '大胆', '冷静', '开朗', '悠闲', '慎重', '勇敢', '温和'],
  },
  pets: {
    INTJ: {
      name: '夜枭',
      title: '建筑师',
      description:
        '栖息于高处的夜色猎手，凭借极佳视野与独立行动习性在黑暗中保持绝对静默。它往往先完成全局观察，再在锁定目标的瞬间精准爆发，展现出深思熟虑且极度理智的行动风格。',
      habitat: '叽叽喳喳台地',
    },
    INTP: {
      name: '机械方方',
      title: '逻辑学家',
      description:
        '由数据与机械构件组成的生命体，以能量最优传输与结构稳定性为核心逻辑。它对客观规律的执着远胜于情绪表达，习惯通过拆解世界运行机制来逼近答案。',
      habitat: '图鉴记录区域',
    },
    ENTJ: {
      name: '恶魔狼',
      title: '指挥官',
      description:
        '森林中极具威慑力的统帅，一声咆哮便能划定领地规则与行动边界。它不仅拥有强悍个体战力，更擅长以气场统摄族群，将环境迅速秩序化并推动集体向目标前进。',
      habitat: '图鉴记录区域',
    },
    ENTP: {
      name: '红绒十字',
      title: '辩论家',
      description:
        '外形荒诞而带有悖论感，行动轨迹常常难以预测，偏爱在混乱中创造新玩法。它天生不按常理出牌，总想拆解既定审美与逻辑，在跳跃思维中寻找下一种可能。',
      habitat: '图鉴记录区域',
    },
    INFJ: {
      name: '利灯鱼',
      title: '提倡者',
      description:
        '深海中寂静的引路者，虽身处孤暗，却以微光持续照亮前路。它从不争夺视线中心，却对环境有深层洞察，总在关键时刻以沉静而坚定的光稳定人心。',
      habitat: '图鉴记录区域',
    },
    INFP: {
      name: '奇丽花',
      title: '调停者',
      description:
        '对森林情绪波动高度敏感，是否盛放往往取决于周遭是否和谐。它始终追求内在纯净与自然共鸣，以柔软而克制的方式修补裂痕，守护生命最本真的律动。',
      habitat: '图鉴记录区域',
    },
    ENFJ: {
      name: '小皮球',
      title: '主人公',
      description:
        '极具亲和力，能用轻快跳跃带动同伴进入同一节奏。它天生拥有消弭隔阂的能力，常在群体中充当能量催化剂，激发他人状态与潜能。',
      habitat: '图鉴记录区域',
    },
    ENFP: {
      name: '粉星仔',
      title: '竞选者',
      description:
        '来自星际的梦想旅者，粉色光芒像永不熄灭的好奇心。它拒绝被惯性束缚，始终朝未知边界跃迁，在奇思妙想中开拓更自由的路径。',
      habitat: '图鉴记录区域',
    },
    ISTJ: {
      name: '獠牙猪',
      title: '物流师',
      description:
        '踏实的大地生存者，严格遵循自然节律与生存本能，不依赖捷径。它以稳健步伐和顽强耐力在严苛环境中扎根，是可靠、务实且自带规则感的行动典范。',
      habitat: '图鉴记录区域',
    },
    ISFJ: {
      name: '贝古斯',
      title: '守卫者',
      description:
        '沉稳而低调的守护者，以坚硬甲壳为弱小者抵御风雨与冲击。它不追求赞誉，只在危难时挺身而出，在长期奉献中维系秩序与安全感。',
      habitat: '图鉴记录区域',
    },
    ESTJ: {
      name: '窃光蚊',
      title: '总经理',
      description:
        '高效且分工明确的执行者，群体行动展现出近乎刻板的纪律性。它对目标保持高度专注，强调结果最优化，以清晰条理和果断推进完成任务。',
      habitat: '图鉴记录区域',
    },
    ESFJ: {
      name: '格兰球',
      title: '执政官',
      description:
        '森林里的和平协调者，热衷于组织活动并照顾每位成员的状态。它在互动中获取能量，擅长维护集体温度与稳定关系，是社群里最可靠的连接点。',
      habitat: '图鉴记录区域',
    },
    ISTP: {
      name: '酷拉',
      title: '鉴赏家',
      description:
        '独来独往的雷电掌控者，擅长用瞬时爆发解决棘手局面。它对复杂系统有近乎直觉的把控力，拒绝冗余修饰，始终以冷静、敏捷和实效为先。',
      habitat: '图鉴记录区域',
    },
    ISFP: {
      name: '雪影娃娃',
      title: '探险家',
      description:
        '冰雪中的艺术精灵，偏爱在静谧寒冬中展现克制而优雅的美感。它外表清冷却内心细腻，坚持自我风格，在感官世界里雕刻独属于自己的节奏。',
      habitat: '图鉴记录区域',
    },
    ESTP: {
      name: '燃薪虫',
      title: '企业家',
      description:
        '瞬间释放高能的冒险者，享受在火光与速度中连续突进的快感。它厌恶等待，偏爱直觉与力量的正面碰撞，随时准备投入下一场现实对抗。',
      habitat: '图鉴记录区域',
    },
    ESFP: {
      name: '月牙雪熊',
      title: '表演者',
      description:
        '热衷玩耍与展示的社交焦点，任何平淡雪地都能被它点亮成舞台。它用笑声消融寒意，活在当下且极具表现力，总能把快乐传递给周围每一个人。',
      habitat: '图鉴记录区域',
    },
  },
}

export default zhCNText
