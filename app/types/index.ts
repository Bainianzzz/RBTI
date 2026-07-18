// 精灵属性类型（以《洛克王国：世界》手游实际属性体系为准，共 18 种）
export type PetElement =
  | '火'
  | '水'
  | '草'
  | '电'
  | '地'
  | '翼'
  | '虫'
  | '龙'
  | '幽'
  | '冰'
  | '光'
  | '幻'
  | '萌'
  | '武'
  | '普通'
  | '机械'
  | '恶'
  | '毒'

// 精灵稀有度
export type PetRarity = '常见' | '少见' | '稀有' | '神宠'

// 精灵契约库中的单只精灵
export interface Pet {
  id: string
  name: string
  element: PetElement
  rarity: PetRarity
  // 招牌气质：一句话，如"孤高的火山巡夜者"
  archetype: string
  // 性格标签：3-5 个，用于语义匹配
  traits: string[]
  // 栖息地/活动场景
  habitat: string
  // 性格内核：一段给 LLM 匹配用的描述文本（约 40-80 字）
  personality: string
  // wiki 原始描述（图鉴正文，供结果页展示）
  wikiDescription: string
  // wiki 链接
  wikiUrl: string
  // 立绘（可选，无则结果页用属性色卡占位）
  image?: string
}

// 副本种子：用户每局冒险会从中抽取一个，LLM 在其中展开完整探索
export interface EventSeed {
  id: string
  // Wiki 中的副本名称
  title: string
  // Wiki 中的副本简介，给 LLM 展开探索
  seedText: string
}

// 一次具体生成的冒险事件（LLM 产出）
export interface AdventureEvent {
  seedId: string
  // LLM 生成的情境描述，≤60 字
  narrative: string
  // 旁白过场，1-2 句
  interlude: string
  // 3-4 个选项
  options: string[]
  // 用户最终提交的答案：选中的选项文本（二选一可为空，纯打字）
  chosenOption: string | null
  // 用户的自由输入文字（可选）
  freeInput: string
}

// LLM 在生成下一个事件时的决策动作
export type NextAction =
  | { type: 'event' }
  | { type: 'conclude' }

// 最终精灵裁决结果
export interface Verdict {
  petId: string
  // 判词：为什么是这只精灵（约 80-120 字）
  verdict: string
  // 共鸣点：用户旅程中的某个瞬间如何呼应这只精灵（可选，1-2 句）
  resonance?: string
}

// 一次完整的冒险状态
export interface AdventureSnapshot {
  events: AdventureEvent[]
  verdict: Verdict | null
}
