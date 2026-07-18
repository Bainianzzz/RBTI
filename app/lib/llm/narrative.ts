import type { AdventureEvent, EventSeed } from '~/types'
import { pets } from '~/data/pets'
import {
  extractStringArrayField,
  extractStringField,
  parseJsonLoose,
} from '~/lib/utils'
import { callLlmStream } from './stream'
import { CLIMAX_FLOOR, HARD_CAP, NARRATOR_SYSTEM } from './prompts'
import type { NextEventResult, PartialEventFields } from './types'

// 每次请求注入的精灵白名单只保留叙事所需字段。
const narrativeRoster = pets.map((pet) => ({
  name: pet.name,
  personality: pet.personality,
}))

function buildLatestEventBlock(events: AdventureEvent[]) {
  const latest = events.at(-1)
  if (!latest) return ''

  return `
【最新一幕进展】
情境：${latest.narrative}${latest.interlude ? `\n旁白：${latest.interlude}` : ''}
用户的选择：「${latest.chosenOption ?? '（自由发挥）'}」${latest.freeInput ? `\n用户的心声：「${latest.freeInput}」` : ''}
`
}

function buildPhaseHint(questionNumber: number) {
  if (questionNumber >= HARD_CAP) {
    return `\n【系统提示·收尾阶段】当前是第 ${questionNumber} 题，已达硬上限。本题必须就是高潮事件（若高潮尚未发生），或直接返回 conclude（若高潮已被用户的抉择解决）。不要再铺垫日常事件。`
  }
  if (questionNumber >= CLIMAX_FLOOR) {
    return `\n【系统提示·高潮阶段】当前是第 ${questionNumber} 题，已进入高潮阶段。本题及之后必须围绕"导向（高潮）"展开，pool 设为 "peak"，不要再堆叠无关日常事件。`
  }
  return ''
}

function buildNarrativePrompt(
  events: AdventureEvent[],
  opening: EventSeed,
  climax: EventSeed,
  storySummary: string,
) {
  const isFirst = events.length === 0
  const summaryBlock = storySummary
    ? `\n【故事进展摘要（由前几幕提炼，你需要在此基础上推进）】\n${storySummary}\n`
    : '\n（这是第一幕，故事进展摘要为空，请从下方"开端"展开。）\n'

  return `【本局故事弧线】
- 开端（日常，故事起点）：${opening.title} —— ${opening.seedText}
- 导向（高潮，故事要推进并最终解决的目标）：${climax.title} —— ${climax.seedText}
${summaryBlock}
【精灵契约库（本局唯一允许出现的精灵，仅限以下数组）】
${JSON.stringify(narrativeRoster)}
${buildPhaseHint(events.length + 1)}
${buildLatestEventBlock(events)}
请${isFirst ? '先建立故事摘要，再从"开端"生成第一个事件' : '先把"最新一幕进展"整合进故事摘要，再基于更新后的摘要生成下一个事件'}。仅当高潮已经在旅程中发生过且被用户的抉择解决时，next_action 返回 conclude。按 system prompt 规定的 JSON 结构（含 story_summary 字段）返回。`
}

function createPartialEventHandler(
  onPartial?: (partial: PartialEventFields) => void,
) {
  let lastInterlude: string | undefined
  let lastNarrative: string | undefined
  let lastOptions: string[] | undefined

  return (full: string) => {
    if (!onPartial) return
    const interlude = extractStringField(full, 'interlude')
    const narrative = extractStringField(full, 'narrative')
    const options = extractStringArrayField(full, 'options')
    const optionsChanged = options?.length !== lastOptions?.length

    if (
      interlude === lastInterlude
      && narrative === lastNarrative
      && !optionsChanged
    ) return

    lastInterlude = interlude
    lastNarrative = narrative
    if (optionsChanged) lastOptions = options
    onPartial({ interlude, narrative, options: lastOptions })
  }
}

export async function generateNextEvent(
  events: AdventureEvent[],
  opening: EventSeed,
  climax: EventSeed,
  storySummary: string,
  onPartial?: (partial: PartialEventFields) => void,
): Promise<NextEventResult> {
  const raw = await callLlmStream(
    [
      { role: 'system', content: NARRATOR_SYSTEM },
      {
        role: 'user',
        content: buildNarrativePrompt(events, opening, climax, storySummary),
      },
    ],
    createPartialEventHandler(onPartial),
    { temperature: 0.9, maxTokens: 1500, json: true },
  )

  const parsed = parseJsonLoose<{
    story_summary?: string
    next_action: string
    pool?: string
    narrative?: string
    interlude?: string
    options?: string[]
  }>(raw)

  if (parsed.next_action === 'conclude') {
    return {
      nextAction: { type: 'conclude' },
      storySummary: parsed.story_summary ?? storySummary,
      narrative: '',
      interlude: parsed.interlude ?? '旅程的尾声近了，精灵圣泉开始泛起微光。',
      options: [],
      pool: null,
    }
  }

  return {
    nextAction: { type: 'event' },
    storySummary: parsed.story_summary ?? storySummary,
    narrative: parsed.narrative ?? '',
    interlude: parsed.interlude ?? '',
    options: parsed.options ?? [],
    pool: (parsed.pool as 'daily' | 'peak') ?? null,
  }
}
