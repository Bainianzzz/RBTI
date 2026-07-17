// 前端 LLM 接口层：统一调用 /api/llm（服务端代理 DeepSeek）。
// 对外暴露两个语义化函数（生成事件含滚动摘要 / 裁决），内部处理 JSON 解析与容错。
// 将来若上 LangGraph/RAG，只需替换本文件的实现，业务层不动。

import type { AdventureEvent, EventSeed, NextAction, Verdict } from '~/types'
import { NARRATOR_SYSTEM, VERDICT_SYSTEM, CLIMAX_FLOOR, HARD_CAP } from '~/lib/prompts'
import { pets } from '~/data/pets'

import type { LlmProxyResponse } from '#shared/types/llm'

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

// 基础调用：转发给 server/api/llm.post.ts
async function callLlm(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; json?: boolean } = {},
): Promise<string> {
  const data = await $fetch<LlmProxyResponse>('/api/llm', {
    method: 'POST',
    body: {
      messages,
      responseFormat: opts.json ? 'json_object' : 'text',
      temperature: opts.temperature,
      maxTokens: opts.maxTokens,
    },
  })
  return data.content ?? ''
}

// 安全的 JSON 解析：DeepSeek 偶尔会带 ```json 围栏或多余文本
function parseJsonLoose<T>(raw: string): T {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenceMatch ? fenceMatch[1]! : trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('LLM 返回的内容不是有效 JSON')
  }
  return JSON.parse(candidate.slice(start, end + 1)) as T
}

export interface NextEventResult {
  nextAction: NextAction
  storySummary: string
  narrative: string
  interlude: string
  options: string[]
  pool: 'daily' | 'peak' | null
}

// 精灵白名单数据（每次请求都注入 user 消息）。
// 只保留名字和性格内核，足够叙事引擎约束可选精灵范围。
const rosterForNarrative = pets.map((p) => ({
  name: p.name,
  personality: p.personality,
}))

// 生成下一个冒险事件（独立单轮对话）
export async function generateNextEvent(
  events: AdventureEvent[],
  opening: EventSeed,
  climax: EventSeed,
  storySummary: string,
): Promise<NextEventResult> {
  const isFirst = events.length === 0
  const questionNo = events.length + 1
  const climaxPhase = questionNo >= CLIMAX_FLOOR
  const endingPhase = questionNo >= HARD_CAP
  // 最新一幕的进展（含用户刚做出的选择），交给 LLM 折进摘要并据此生成下一事件
  const latest = events.length > 0 ? events[events.length - 1]! : null
  const latestBlock = latest
    ? `\n【最新一幕进展】\n情境：${latest.narrative}${latest.interlude ? `\n旁白：${latest.interlude}` : ''}\n用户的选择：「${latest.chosenOption ?? '（自由发挥）'}」${latest.freeInput ? `\n用户的心声：「${latest.freeInput}」` : ''}\n`
    : ''
  const phaseHint = endingPhase
    ? `\n【系统提示·收尾阶段】当前是第 ${questionNo} 题，已达硬上限。本题必须就是高潮事件（若高潮尚未发生），或直接返回 conclude（若高潮已被用户的抉择解决）。不要再铺垫日常事件。`
    : climaxPhase
      ? `\n【系统提示·高潮阶段】当前是第 ${questionNo} 题，已进入高潮阶段。本题及之后必须围绕"导向（高潮）"展开，pool 设为 "peak"，不要再堆叠无关日常事件。`
      : ''

  const summaryBlock = storySummary
    ? `\n【故事进展摘要（由前几幕提炼，你需要在此基础上推进）】\n${storySummary}\n`
    : '\n（这是第一幕，故事进展摘要为空，请从下方"开端"展开。）\n'

  const userPrompt = `【本局故事弧线】
- 开端（日常，故事起点）：${opening.title} —— ${opening.seedText}
- 导向（高潮，故事要推进并最终解决的目标）：${climax.title} —— ${climax.seedText}
${summaryBlock}
【精灵契约库（本局唯一允许出现的精灵，仅限以下数组）】
${JSON.stringify(rosterForNarrative)}
${phaseHint}
${latestBlock}
请${isFirst ? '先建立故事摘要，再从"开端"生成第一个事件' : '先把"最新一幕进展"整合进故事摘要，再基于更新后的摘要生成下一个事件'}。仅当高潮已经在旅程中发生过且被用户的抉择解决时，next_action 返回 conclude。按 system prompt 规定的 JSON 结构（含 story_summary 字段）返回。`

  const raw = await callLlm(
    [
      { role: 'system', content: NARRATOR_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
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

// 最终裁决：选出本命精灵（独立单次调用，判词为空时重试一次）
export async function generateVerdict(events: AdventureEvent[]): Promise<Verdict> {
  const journey = events
    .map(
      (e, i) =>
        `第${i + 1}幕：${e.narrative}\n  选择：「${e.chosenOption ?? '（自由发挥）'}」${e.freeInput ? `\n  心声：「${e.freeInput}」` : ''}`,
    )
    .join('\n\n')

  const roster = pets
    .map(
      (p) =>
        `- ${p.id} [${p.element}/${p.rarity}]：${p.archetype}。标签：${p.traits.join('、')}。${p.personality}`,
    )
    .join('\n')

  const userPrompt = `【用户的完整冒险旅程】
${journey}

【精灵契约库（约50只，id 即精灵名）】
${roster}

请从精灵库中选出与用户性格最适配的唯一一只，并写出判词。按 system prompt 规定的 JSON 结构返回。`

  const messages: ChatMessage[] = [
    { role: 'system', content: VERDICT_SYSTEM },
    { role: 'user', content: userPrompt },
  ]

  // 判词是核心产物：LLM 偶尔只返回 pet_id 而 verdict 为空，
  // 此时重试一次（提高温度、降低 maxTokens 聚焦于判词），而非用静态文本冒充判词。
  let parsed = parseJsonLoose<{ pet_id: string; verdict: string }>(
    await callLlm(messages, { temperature: 0.7, maxTokens: 800, json: true }),
  )
  if (!parsed.verdict?.trim()) {
    parsed = parseJsonLoose<{ pet_id: string; verdict: string }>(
      await callLlm(messages, { temperature: 0.9, maxTokens: 800, json: true }),
    )
  }
  if (!parsed.pet_id?.trim()) {
    throw new Error('裁决失败：LLM 未返回有效的精灵')
  }
  if (!parsed.verdict?.trim()) {
    throw new Error('裁决失败：LLM 未返回有效判词')
  }
  return { petId: parsed.pet_id, verdict: parsed.verdict }
}
