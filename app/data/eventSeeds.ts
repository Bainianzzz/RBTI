import type { EventSeed } from '~/types'

// 副本资料来源：《洛克王国：世界》手游 BWIKI「副本图鉴」。
// 每局冒险随机选择一个副本，LLM 在该副本内展开完整探索。
export const DUNGEON_WIKI_URL = 'https://wiki.biligame.com/rocom/副本图鉴'

export const eventSeeds: EventSeed[] = [
  {
    id: 'island_green_web',
    title: '海岛绿网',
    seedText: '在湖中的小岛上，那座充满绿色织网的遗迹给了我们很多希望。当找不到前路的时候，寻找那片绿色的希冀吧！',
  },
  {
    id: 'windborne_sparks',
    title: '风起的星火',
    seedText: '一场关于飞行的考验，指引向前的火炬照亮着勇者的征途。和精灵一起学习飞行技巧，随风起伏，点燃那些守护古老秘密的火炬吧！',
  },
  {
    id: 'sea_cliff',
    title: '望海崖壁',
    seedText: '在繁华的商店街周边躲藏着黑巫团的成员，提升战斗技巧然后向他们发起挑战吧！',
  },
  {
    id: 'ruins_twin_witches',
    title: '遗迹双巫团',
    seedText: '聆风镇附近的黑巫团将自己隐藏得很好，提升战斗技巧，向他们发起挑战吧！',
  },
  {
    id: 'royal_twin_witches',
    title: '皇家双巫团',
    seedText: '在皇家办事处后的林地中躲藏着黑巫团的成员，提升战斗技巧然后向他们发起挑战吧！',
  },
  {
    id: 'obestan_lakeside_dream',
    title: '奥贝斯坦湖边的童梦',
    seedText: '去奥贝斯坦湖边看看吧，去体验踢石子的快乐！',
  },
  {
    id: 'spirit_king_gift',
    title: '精灵王的馈赠',
    seedText: '来自远古精灵王的赠予……似乎可以直达地下？',
  },
  {
    id: 'wind_spirit_water_witch',
    title: '风灵水巫',
    seedText: '在挽风屏障周边躲藏着黑巫团的成员，提升战斗技巧然后向他们发起挑战吧！',
  },
  {
    id: 'floating_valley',
    title: '浮落幽谷',
    seedText: '地宫深潭的谷底藏匿着远古的遗留，等待着有心人的探索……带上自己的精灵，想办法到达水底开启被封藏的宝物吧！',
  },
  {
    id: 'dune_earth_witch',
    title: '沙丘地巫',
    seedText: '在叽叽喳喳台地附近躲藏着黑巫团的成员，提升战斗技巧然后向他们发起挑战吧！',
  },
  {
    id: 'windbreak_valley',
    title: '破风山谷',
    seedText: '冰封的岚语峰上有一个高高的圣所，所有洛克都想飞往圣所最高处。带上飞行精灵和迎风逐浪的勇气，破空飞行吧！',
  },
  {
    id: 'windrest_sanctuary',
    title: '风眠圣所',
    seedText: '大灾变之后，传说中的光之精灵在战斗中陨落，化为一枚特殊的光茧，被精灵王带进风眠圣所。借助圣所内强大的魔力，光之精灵迪莫即将完成重生！',
  },
  {
    id: 'portal_mirror',
    title: '传送魔镜',
    seedText: '传送门呀传送门，请您告诉我：哪扇门可以指引我解开地宫的奥秘？',
  },
  {
    id: 'snowy_mountain_cabin',
    title: '雪山暖屋',
    seedText: '在那风雪崖壁之上，有一座孤零零的雪屋，雪屋中有一位孤零零的……',
  },
  {
    id: 'warm_fire_snowland',
    title: '暖火雪境',
    seedText: '在寒冷的雪顶峰顶，有一座雪封的地城。传说只要在里面寻找到火光，就能解锁上古留下来的宝藏！开启寻火之旅吧！',
  },
  {
    id: 'starfrost_ice_witch',
    title: '星雪冰巫',
    seedText: '在星霜雪峰有一座神秘的魔法门，探索门后的奥秘吧！',
  },
]

export const seedById: Record<string, EventSeed> = Object.fromEntries(
  eventSeeds.map((seed) => [seed.id, seed]),
)
