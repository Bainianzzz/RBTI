import type { EventSeed } from '~/types'

// 事件池种子：每局冒险会从中抽取，由 LLM 展开成具体情境。
// 种子只给一句话设定 + 标题，不锁死剧情，给 LLM 充分的生成空间。
//
// 日常池：偏轻松的魔法学院/野外日常，节奏舒缓、塑造角色。
// 高潮池：能让玩家兴奋的捕捉/首领/竞技场/黑魔法师事件，节奏紧凑、制造张力。

export const dailySeeds: EventSeed[] = [
  {
    id: 'guild_register',
    pool: 'daily',
    title: '冒险者公会登记',
    seedText: '你来到洛克王国的冒险者公会登记成为见习魔法师，柜台前排着形形色色的新人和他们的搭档精灵。',
  },
  {
    id: 'herb_class',
    pool: 'daily',
    title: '魔法药草课',
    seedText: '学院的第一堂魔法药草课，老师让大家在温室里辨认一株会害羞的药草。',
  },
  {
    id: 'cafeteria_lunch',
    pool: 'daily',
    title: '精灵食堂的午餐',
    seedText: '午休时间，精灵食堂里各种属性的精灵因为食物偏好吵成了一团。',
  },
  {
    id: 'library_study',
    pool: 'daily',
    title: '图书馆夜读',
    seedText: '夜深了，你独自留在魔法学院图书馆查资料，书架深处传来奇怪的翻书声。',
  },
  {
    id: 'training_ground',
    pool: 'daily',
    title: '训练场陪练',
    seedText: '训练场上，一位高年级学姐邀请你和她的精灵进行一场友好的陪练对战。',
  },
  {
    id: 'market_shopping',
    pool: 'daily',
    title: '王国集市采购',
    seedText: '热闹的王国集市上，你在给即将到来的探险采购补给，一个奇怪的小摊吸引了你。',
  },
  {
    id: 'night_patrol',
    pool: 'daily',
    title: '校园夜巡',
    seedText: '轮到你和同学组队进行校园夜巡，月光下的学院和白天完全不一样。',
  },
  {
    id: 'egg_incubator',
    pool: 'daily',
    title: '孵蛋室的意外',
    seedText: '你被分配去照看学院的精灵孵蛋室，其中一颗蛋似乎对你格外有反应。',
  },
  {
    id: 'forest_edge_stroll',
    pool: 'daily',
    title: '森林边缘散步',
    seedText: '课后你和同学去学院外的森林边缘散步，偶遇一只受伤的野生小精灵。',
  },
  {
    id: 'fortune_teller',
    pool: 'daily',
    title: '占卜师的帐篷',
    seedText: '集市角落有一顶神秘的占卜帐篷，里面据说能窥见你和精灵的前世缘分。',
  },
]

export const peakSeeds: EventSeed[] = [
  {
    id: 'wild_boss_encounter',
    pool: 'peak',
    title: '秘境首领精灵',
    seedText: '深入秘境时，一只强大的首领级野生精灵挡住了去路，周围空气都凝固了。',
  },
  {
    id: 'arena_tournament',
    pool: 'peak',
    title: '竞技场擂台赛',
    seedText: '王国竞技场正在举办新魔法师擂台赛，观众席爆满，你被推上了擂台。',
  },
  {
    id: 'dark_mage_attack',
    pool: 'peak',
    title: '黑魔法师突袭',
    seedText: '夜幕降临，一股黑魔法能量笼罩了学院，黑魔法师带着被腐蚀的精灵发起了突袭。',
  },
  {
    id: 'ancient_seal_break',
    pool: 'peak',
    title: '远古封印松动',
    seedText: '遗迹深处，一道封印亿万年的远古之力开始松动，大地在震颤。',
  },
  {
    id: 'poacher_confront',
    pool: 'peak',
    title: '精灵盗猎者',
    seedText: '你在野外撞见了一伙正在盗猎稀有精灵的不法之徒，他们发现了你。',
  },
  {
    id: 'berserk_spirit',
    pool: 'peak',
    title: '暴走精灵事件',
    seedText: '一只原本温顺的精灵突然暴走，能量失控威胁到了周围所有人。',
  },
  {
    id: 'contract_trial',
    pool: 'peak',
    title: '契约试炼降临',
    seedText: '精灵圣泉显灵，你被选中接受一场古老而神圣的契约试炼。',
  },
  {
    id: 'starlight_fate',
    pool: 'peak',
    title: '星空下的命运抉择',
    seedText: '流星雨之夜，一个关于你与本命精灵命运的重大抉择摆在了面前。',
  },
]

export const allSeeds: EventSeed[] = [...dailySeeds, ...peakSeeds]

export const seedById: Record<string, EventSeed> = Object.fromEntries(
  allSeeds.map((s) => [s.id, s]),
)
