import type { ChatMessage, StreamOptions } from './types'

// Fetch + ReadableStream 消费服务端 SSE。每收到一段 delta 就回传当前完整文本，
// 最终返回全部内容供业务层执行严格 JSON 解析。
export async function callLlmStream(
  messages: ChatMessage[],
  onAccumulated: (full: string) => void,
  options: StreamOptions = {},
): Promise<string> {
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      responseFormat: options.json ? 'json_object' : 'text',
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(`LLM 调用失败：${message}`)
  }
  if (!response.body) throw new Error('LLM 未返回可读流')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      const line = event.trim()
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data) as { delta?: string }
        if (!parsed.delta) continue
        full += parsed.delta
        onAccumulated(full)
      } catch {
        // SSE 事件已按空行切分；畸形事件无法恢复，忽略后继续读取。
      }
    }
  }

  return full
}
