// 冒险状态机：管理事件流（生成 → 作答 → 摘要 → 生成 / 裁决）。
//
// 叙事模型（副本探索 + 滚动摘要）：
// 开局随机抽一个副本种子，整局围绕该副本探索。
// 每轮：LLM 生成事件（同一请求内顺带更新故事摘要）→ 用户作答 → 深入副本或完成探索。
// 摘要作为压缩记忆传给下一轮叙事引擎，替代回放完整多轮历史。
// 每次请求都顺带判断"副本目标是否已完成"，是则收尾裁决。
// 失败时记录失败点，retry() 从断点续行。

import type { AdventureEvent, EventSeed, Verdict } from '~/types'
import {
  generateNextEvent,
  generateVerdict,
  HARD_CAP,
  type NextEventResult,
  type PartialEventFields,
  type PartialVerdictFields,
} from '~/lib/llm'
import { eventSeeds } from '~/data/eventSeeds'
import { pickRandom } from '~/lib/utils'

// 当前正在作答的事件（events[] 里存的是已答完的历史）
export interface ActiveEvent {
  seedId: string
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

// Setup Store（组合式）：state 用 ref、getters 用 computed、actions 用普通函数。
// 通过 store 实例访问时 ref/computed 自动解包，调用方无需改动。
export const useAdventureStore = defineStore('adventure', () => {
  // ── state ────────────────────────────────────────────────
  const phase = ref<AdventurePhase>('idle')
  const events = ref<AdventureEvent[]>([])
  const active = ref<ActiveEvent | null>(null)
  const verdict = ref<Verdict | null>(null)
  const error = ref('')
  const failedOp = ref<FailedOp>(null)
  const isStreaming = ref(false)
  // 滚动故事摘要：每轮作答后由 LLM 更新，传给下一轮叙事引擎
  const storySummary = ref('')
  // 本局唯一的副本种子
  const dungeonSeedId = ref('')

  // ── getters ──────────────────────────────────────────────
  const dungeon = computed<EventSeed | undefined>(() =>
    eventSeeds.find((seed) => seed.id === dungeonSeedId.value),
  )
  const canSubmit = computed(() => {
    if (!active.value || phase.value !== 'answering' || isStreaming.value) return false
    return !!active.value.chosenOption || active.value.freeInput.trim().length > 0
  })
  const isFinished = computed(() => phase.value === 'done' && !!verdict.value)

  // ── actions ──────────────────────────────────────────────
  function reset() {
    phase.value = 'idle'
    events.value = []
    active.value = null
    verdict.value = null
    error.value = ''
    failedOp.value = null
    isStreaming.value = false
    storySummary.value = ''
    dungeonSeedId.value = ''
  }

  async function start() {
    reset()
    dungeonSeedId.value = pickRandom(eventSeeds).id
    await fetchNextEvent()
  }

  // 提交当前作答，更新摘要，推进到下一事件或裁决
  async function submitAnswer(option: string | null, freeInput: string) {
    if (!active.value || phase.value !== 'answering' || isStreaming.value) return
    const answered: AdventureEvent = {
      seedId: active.value.seedId,
      narrative: active.value.narrative,
      interlude: active.value.interlude,
      options: active.value.options,
      chosenOption: option,
      freeInput: freeInput.trim(),
    }
    events.value.push(answered)
    active.value = null
    phase.value = 'generating'
    await fetchNextEvent()
  }

  async function fetchNextEvent() {
    if (!dungeon.value) return
    // 硬上限：已答满 HARD_CAP 题后不再请求 LLM 生成新事件，直接收尾裁决。
    // 这是软提示之外的强制门，保证冒险长度不超过目标上限。
    if (events.value.length >= HARD_CAP) {
      await conclude()
      return
    }
    phase.value = 'generating'
    error.value = ''
    failedOp.value = 'next'
    active.value = null
    isStreaming.value = true
    try {
      const result = await generateNextEvent(
        events.value,
        dungeon.value,
        storySummary.value,
        applyPartialEvent,
      )
      // 软提示已让 LLM 倾向收尾，这里仍尊重它提前返回的 conclude
      if (result.nextAction.type === 'conclude') {
        await conclude()
        return
      }
      applyEvent(result)
    } catch (e) {
      fail(e)
    }
  }

  function applyPartialEvent(partial: PartialEventFields) {
    if (!active.value) {
      active.value = {
        seedId: dungeonSeedId.value,
        narrative: '',
        interlude: '',
        options: [],
        chosenOption: null,
        freeInput: '',
      }
    }
    if (partial.interlude !== undefined) active.value.interlude = partial.interlude
    if (partial.narrative !== undefined) active.value.narrative = partial.narrative
    if (partial.options !== undefined) active.value.options = partial.options
    // 首个可见字段到达后立即从加载态切到答题卡；流结束前控件保持禁用。
    if (partial.interlude || partial.narrative || partial.options?.length) {
      phase.value = 'answering'
    }
  }

  function applyEvent(result: NextEventResult) {
    active.value = {
      seedId: dungeonSeedId.value,
      narrative: result.narrative,
      interlude: result.interlude,
      options: result.options,
      chosenOption: null,
      freeInput: '',
    }
    isStreaming.value = false
    phase.value = 'answering'
    failedOp.value = null
    // 摘要由 LLM 在同一次生成请求里一并更新，这里直接落库
    if (result.storySummary) storySummary.value = result.storySummary
  }

  async function conclude() {
    active.value = null
    verdict.value = null
    isStreaming.value = true
    phase.value = 'concluding'
    error.value = ''
    failedOp.value = 'conclude'
    try {
      verdict.value = await generateVerdict(events.value, applyPartialVerdict)
      isStreaming.value = false
      phase.value = 'done'
      failedOp.value = null
    } catch (e) {
      fail(e)
    }
  }

  function applyPartialVerdict(partial: PartialVerdictFields) {
    if (!verdict.value) {
      verdict.value = { petId: partial.petId, verdict: partial.verdict }
      return
    }
    verdict.value.petId = partial.petId
    verdict.value.verdict = partial.verdict
  }

  async function retry() {
    if (phase.value !== 'error') return
    if (failedOp.value === 'conclude') {
      await conclude()
    } else {
      await fetchNextEvent()
    }
  }

  function selectOption(option: string) {
    if (!active.value) return
    active.value.chosenOption =
      active.value.chosenOption === option ? null : option
  }

  function setFreeInput(text: string) {
    if (!active.value) return
    active.value.freeInput = text
  }

  function fail(e: unknown) {
    isStreaming.value = false
    phase.value = 'error'
    error.value = e instanceof Error ? e.message : String(e)
  }

  return {
    // state
    phase,
    events,
    active,
    verdict,
    error,
    failedOp,
    isStreaming,
    storySummary,
    dungeonSeedId,
    // getters
    dungeon,
    canSubmit,
    isFinished,
    // actions
    reset,
    start,
    submitAnswer,
    fetchNextEvent,
    applyEvent,
    applyPartialEvent,
    applyPartialVerdict,
    conclude,
    retry,
    selectOption,
    setFreeInput,
    fail,
  }
})
