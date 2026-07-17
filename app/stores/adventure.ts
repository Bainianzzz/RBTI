// 冒险状态机：管理事件流（生成 → 作答 → 摘要 → 生成 / 裁决）。
//
// 叙事模型（弧线制 + 滚动摘要，无硬上下限）：
// 开局随机抽一个日常种子作为"开端"，再随机抽一个高潮种子作为"导向目标"。
// 每轮：LLM 生成事件（同一请求内顺带更新故事摘要）→ 用户作答 → 下一轮生成。
// 摘要作为压缩记忆传给下一轮叙事引擎，替代回放完整多轮历史。
// 每次请求都顺带判断"高潮是否已被用户的抉择解决"，是则收尾裁决。
// 失败时记录失败点，retry() 从断点续行。

import type { AdventureEvent, EventPool, EventSeed, Verdict } from '~/types'
import { generateNextEvent, generateVerdict, HARD_CAP, type NextEventResult } from '~/lib/llm'
import { dailySeeds, peakSeeds } from '~/data/eventSeeds'

// 当前正在作答的事件（events[] 里存的是已答完的历史）
export interface ActiveEvent {
  seedId: string
  pool: EventPool
  narrative: string
  interlude: string
  options: string[]
  chosenOption: string | null
  freeInput: string
}

export type AdventurePhase =
  | 'idle' // 未开始
  | 'generating' // 拉取下一事件 / 更新摘要中
  | 'answering' // 展示事件、等待作答
  | 'concluding' // 拉取裁决结果中
  | 'done' // 裁决完成
  | 'error' // 出错

type FailedOp = 'next' | 'conclude' | null

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    phase: 'idle' as AdventurePhase,
    events: [] as AdventureEvent[],
    active: null as ActiveEvent | null,
    verdict: null as Verdict | null,
    error: '' as string,
    failedOp: null as FailedOp,
    // 滚动故事摘要：每轮作答后由 LLM 更新，传给下一轮叙事引擎
    storySummary: '' as string,
    // 本局弧线种子
    openingSeedId: '' as string,
    climaxSeedId: '' as string,
  }),

  getters: {
    opening: (s): EventSeed | undefined =>
      dailySeeds.find((x) => x.id === s.openingSeedId),
    climax: (s): EventSeed | undefined =>
      peakSeeds.find((x) => x.id === s.climaxSeedId),
    canSubmit: (s) => {
      if (!s.active || s.phase !== 'answering') return false
      return !!s.active.chosenOption || s.active.freeInput.trim().length > 0
    },
    isFinished: (s) => s.phase === 'done' && !!s.verdict,
  },

  actions: {
    reset() {
      this.phase = 'idle'
      this.events = []
      this.active = null
      this.verdict = null
      this.error = ''
      this.failedOp = null
      this.storySummary = ''
      this.openingSeedId = ''
      this.climaxSeedId = ''
    },

    async start() {
      this.reset()
      // 开端：日常池随机一个；导向：高潮池随机一个
      this.openingSeedId = pick(dailySeeds).id
      this.climaxSeedId = pick(peakSeeds).id
      await this.fetchNextEvent()
    },

    // 提交当前作答，更新摘要，推进到下一事件或裁决
    async submitAnswer(option: string | null, freeInput: string) {
      if (!this.active || this.phase !== 'answering') return
      const answered: AdventureEvent = {
        seedId: this.active.seedId,
        pool: this.active.pool,
        narrative: this.active.narrative,
        interlude: this.active.interlude,
        options: this.active.options,
        chosenOption: option,
        freeInput: freeInput.trim(),
      }
      this.events.push(answered)
      this.active = null
      this.phase = 'generating'
      await this.fetchNextEvent()
    },

    async fetchNextEvent() {
      if (!this.opening || !this.climax) return
      // 硬上限：已答满 HARD_CAP 题后不再请求 LLM 生成新事件，直接收尾裁决。
      // 这是软提示之外的强制门，保证冒险长度不超过目标上限。
      if (this.events.length >= HARD_CAP) {
        await this.conclude()
        return
      }
      this.phase = 'generating'
      this.error = ''
      this.failedOp = 'next'
      try {
        const result = await generateNextEvent(
          this.events,
          this.opening,
          this.climax,
          this.storySummary,
        )
        // 软提示已让 LLM 倾向收尾，这里仍尊重它提前返回的 conclude
        if (result.nextAction.type === 'conclude') {
          await this.conclude()
          return
        }
        this.applyEvent(result)
      } catch (e) {
        this.fail(e)
      }
    },

    applyEvent(result: NextEventResult) {
      const isFirst = this.events.length === 0
      const pool: EventPool = result.pool ?? (isFirst ? 'daily' : 'daily')
      // 第一个事件贴开端种子；高潮事件贴高潮种子；中间事件自由（无种子）
      const seedId = isFirst
        ? this.openingSeedId
        : pool === 'peak'
          ? this.climaxSeedId
          : ''
      this.active = {
        seedId,
        pool,
        narrative: result.narrative,
        interlude: result.interlude,
        options: result.options,
        chosenOption: null,
        freeInput: '',
      }
      this.phase = 'answering'
      this.failedOp = null
      // 摘要由 LLM 在同一次生成请求里一并更新，这里直接落库
      if (result.storySummary) this.storySummary = result.storySummary
    },

    async conclude() {
      this.phase = 'concluding'
      this.error = ''
      this.failedOp = 'conclude'
      try {
        this.verdict = await generateVerdict(this.events)
        this.phase = 'done'
        this.failedOp = null
      } catch (e) {
        this.fail(e)
      }
    },

    async retry() {
      if (this.phase !== 'error') return
      if (this.failedOp === 'conclude') {
        await this.conclude()
      } else {
        await this.fetchNextEvent()
      }
    },

    selectOption(option: string) {
      if (!this.active) return
      this.active.chosenOption =
        this.active.chosenOption === option ? null : option
    },

    setFreeInput(text: string) {
      if (!this.active) return
      this.active.freeInput = text
    },

    fail(e: unknown) {
      this.phase = 'error'
      this.error = e instanceof Error ? e.message : String(e)
    },
  },
})
