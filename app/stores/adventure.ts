// 冒险状态机：管理事件流（生成 -> 作答 -> 生成 / 裁决）。
// 地板 4 / 天花板 10：不足 4 幕禁止裁决，满 10 幕强制裁决。
// 失败时记录失败点，retry() 从断点续行。

import type { AdventureEvent, EventPool, Verdict } from '~/types'
import { generateNextEvent, generateVerdict, type NextEventResult } from '~/lib/llm'

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
  | 'generating' // 拉取下一事件中
  | 'answering' // 展示事件、等待作答
  | 'concluding' // 拉取裁决结果中
  | 'done' // 裁决完成
  | 'error' // 出错

type FailedOp = 'next' | 'conclude' | null

export const FLOOR = 4
export const CEILING = 10

export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    phase: 'idle' as AdventurePhase,
    events: [] as AdventureEvent[],
    active: null as ActiveEvent | null,
    verdict: null as Verdict | null,
    error: '' as string,
    failedOp: null as FailedOp,
  }),

  getters: {
    answeredCount: (s) => s.events.length,
    // 已答完 + 正在答的进度
    progress: (s) => s.events.length + (s.active ? 1 : 0),
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
    },

    async start() {
      this.reset()
      await this.fetchNextEvent()
    },

    // 提交当前作答，推进到下一事件或裁决
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

      // 天花板：满 10 幕强制裁决
      if (this.events.length >= CEILING) {
        await this.conclude()
        return
      }
      await this.fetchNextEvent()
    },

    async fetchNextEvent() {
      this.phase = 'generating'
      this.error = ''
      this.failedOp = 'next'
      try {
        const result = await generateNextEvent(this.events)

        if (result.nextAction.type === 'conclude') {
          // 地板保护：不足 4 幕，禁止裁决，重试一次拉事件
          if (this.events.length < FLOOR) {
            const forced = await generateNextEvent(this.events)
            if (forced.nextAction.type === 'conclude') {
              // 仍坚持收尾——极罕见，尊重裁决以免死循环
              await this.conclude()
              return
            }
            this.applyEvent(forced)
            return
          }
          await this.conclude()
          return
        }

        this.applyEvent(result)
      } catch (e) {
        this.fail(e)
      }
    },

    applyEvent(result: NextEventResult) {
      this.active = {
        seedId: result.seedId ?? '',
        pool: result.pool ?? 'daily',
        narrative: result.narrative,
        interlude: result.interlude,
        options: result.options,
        chosenOption: null,
        freeInput: '',
      }
      this.phase = 'answering'
      this.failedOp = null
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
