import type { AdventureEvent, Verdict } from '~/types'
import { pets } from '~/data/pets'
import { extractStringField, parseJsonLoose } from '~/lib/utils'
import { VERDICT_SYSTEM } from './prompts'
import { callLlmStream } from './stream'
import type { ChatMessage, PartialVerdictFields } from './types'

function buildJourney(events: AdventureEvent[]) {
  return events
    .map(
      (event, index) =>
        `第${index + 1}幕：${event.narrative}\n  选择：「${event.chosenOption ?? '（自由发挥）'}」${event.freeInput ? `\n  心声：「${event.freeInput}」` : ''}`,
    )
    .join('\n\n')
}

function buildVerdictRoster() {
  return pets
    .map(
      (pet) =>
        `- ${pet.id} [${pet.element}/${pet.rarity}]：${pet.archetype}。标签：${pet.traits.join('、')}。${pet.personality}`,
    )
    .join('\n')
}

function buildVerdictMessages(events: AdventureEvent[]): ChatMessage[] {
  const userPrompt = `【用户的完整冒险旅程】
${buildJourney(events)}

【精灵契约库（约50只，id 即精灵名）】
${buildVerdictRoster()}

请从精灵库中选出与用户性格最适配的唯一一只，并写出判词。按 system prompt 规定的 JSON 结构返回。`

  return [
    { role: 'system', content: VERDICT_SYSTEM },
    { role: 'user', content: userPrompt },
  ]
}

async function requestVerdict(
  messages: ChatMessage[],
  temperature: number,
  onPartial?: (partial: PartialVerdictFields) => void,
) {
  let lastPetId = ''
  let lastVerdict = ''
  const raw = await callLlmStream(
    messages,
    (full) => {
      if (!onPartial) return
      const petId = extractStringField(full, 'pet_id')
      const verdict = extractStringField(full, 'verdict')
      // verdict 开始出现时，按提示词字段顺序，pet_id 已经完整闭合。
      if (petId === undefined || verdict === undefined) return
      if (petId === lastPetId && verdict === lastVerdict) return
      lastPetId = petId
      lastVerdict = verdict
      onPartial({ petId, verdict })
    },
    { temperature, maxTokens: 800, json: true },
  )

  return parseJsonLoose<{ pet_id: string; verdict: string }>(raw)
}

export async function generateVerdict(
  events: AdventureEvent[],
  onPartial?: (partial: PartialVerdictFields) => void,
): Promise<Verdict> {
  const messages = buildVerdictMessages(events)
  let parsed = await requestVerdict(messages, 0.7, onPartial)

  // 判词偶发为空时重试一次，不用静态文本冒充模型产物。
  if (!parsed.verdict?.trim()) {
    parsed = await requestVerdict(messages, 0.9, onPartial)
  }
  if (!parsed.pet_id?.trim()) {
    throw new Error('裁决失败：LLM 未返回有效的精灵')
  }
  if (!parsed.verdict?.trim()) {
    throw new Error('裁决失败：LLM 未返回有效判词')
  }

  return { petId: parsed.pet_id, verdict: parsed.verdict }
}
