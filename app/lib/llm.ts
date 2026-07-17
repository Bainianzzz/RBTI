// 前端 LLM 接口层：统一调用 /api/llm（服务端代理 DeepSeek）。
// 对外暴露两个语义化函数，内部处理 JSON 解析与容错。
// 将来若上 LangGraph/RAG，只需替换本文件的实现，业务层不动。

import type { AdventureEvent, EventSeed, NextAction, Verdict } from '~/types'
import { NARRATOR_SYSTEM, VERDICT_SYSTEM } from '~/lib/prompts'
import { allSeeds } from '~/data/eventSeeds'
import { pets } from '~/data/pets'

import type { LlmProxyResponse } from '#shared/types/llm'

// 基础调用：转发给 server/api/llm.post.ts
async function callLlm(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
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
  narrative: string
  interlude: string
  options: string[]
  seedId: string | null
  pool: 'daily' | 'peak' | null
}

// 生成下一个冒险事件
export async function generateNextEvent(
  events: AdventureEvent[],
): Promise<NextEventResult> {
  // 构造候选种子清单（标注已用）
  const usedIds = new Set(events.map((e) => e.seedId))
  const candidateList = allSeeds.map(
    (s: EventSeed) =>
      `- ${s.id} [${s.pool}]${usedIds.has(s.id) ? ' (已用)' : ''}：${s.title} —— ${s.seedText}`,
  )

  const userContext = events.length
    ? events
        .map(
          (e, i) =>
            `第${i + 1}幕 [种子:${e.seedId}/${e.pool}]：${e.narrative}\n  你选了：「${e.chosenOption ?? '（自由发挥）'}」${e.freeInput ? `\n  自由心声：「${e.freeInput}」` : ''}`,
        )
        .join('\n\n')
    : '（冒险刚刚开始，这是第一个事件）'

  const userPrompt = `【已发生的旅程】
${userContext}

【当前进度】已用 ${events.length} 个事件（地板 4 / 天花板 10）。

【候选种子清单】
${candidateList.join('\n')}

请根据用户在已发生旅程中体现的性格与情绪，从候选清单选一个【尚未用过】且能自然过渡的种子展开下一个事件，并按 system prompt 规定的 JSON 结构返回。`

  const raw = await callLlm(
    [
      { role: 'system', content: NARRATOR_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.9, maxTokens: 600, json: true },
  )

  const parsed = parseJsonLoose<{
    next_action: string
    seed_id?: string
    pool?: string
    narrative?: string
    interlude?: string
    options?: string[]
  }>(raw)

  if (parsed.next_action === 'conclude') {
    return {
      nextAction: { type: 'conclude' },
      narrative: '',
      interlude: parsed.interlude ?? '旅程的尾声近了，精灵圣泉开始泛起微光。',
      options: [],
      seedId: null,
      pool: null,
    }
  }

  return {
    nextAction: { type: 'event', seedId: parsed.seed_id ?? '', pool: (parsed.pool as 'daily' | 'peak') ?? 'daily' },
    narrative: parsed.narrative ?? '',
    interlude: parsed.interlude ?? '',
    options: parsed.options ?? [],
    seedId: parsed.seed_id ?? null,
    pool: (parsed.pool as 'daily' | 'peak') ?? null,
  }
}

// 最终裁决：选出本命精灵
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

【精灵契约库（50只，id 即精灵名）】
${roster}

请从精灵库中选出与用户性格最适配的唯一一只，并写出判词。按 system prompt 规定的 JSON 结构返回。`

  const raw = await callLlm(
    [
      { role: 'system', content: VERDICT_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.7, maxTokens: 800, json: true },
  )

  const parsed = parseJsonLoose<{ pet_id: string; verdict: string }>(raw)
  return { petId: parsed.pet_id, verdict: parsed.verdict }
}
