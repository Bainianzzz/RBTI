import type { LlmRequestBody } from '#shared/types/llm'

// LLM 代理：前端 POST { messages, responseFormat, temperature, stream }
// 服务端注入 API key，转发给 OpenAI 兼容端点（默认 DeepSeek）。
// stream=false（默认）：整段返回 { content }；裁决等收尾调用用这条。
// stream=true：返回 text/event-stream，逐 token 透传 delta，前端逐字渲染。

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<LlmRequestBody>(event)

  if (!body?.messages?.length) {
    throw createError({ statusCode: 400, statusMessage: 'messages is required' })
  }

  const apiKey = config.apiKey
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API key 未配置（请在 .env 中设置 API_KEY）',
    })
  }

  const upstreamBody = {
    model: config.apiModel,
    messages: body.messages,
    temperature: body.temperature ?? 1,
    max_tokens: body.maxTokens ?? 1024,
    response_format: body.responseFormat
      ? { type: body.responseFormat }
      : undefined,
  }

  // ── 非流式：等整段返回 ───────────────────────────────────
  if (body.stream !== true) {
    try {
      const resp = await $fetch<{ choices: { message: { content: string } }[] }>(
        `${config.apiUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: { ...upstreamBody, stream: false },
        },
      )
      return { content: resp.choices?.[0]?.message?.content ?? '' }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw createError({ statusCode: 502, statusMessage: `LLM 调用失败：${msg}` })
    }
  }

  // ── 流式：SSE 透传 delta ────────────────────────────────
  setResponseHeader(event, 'content-type', 'text/event-stream; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'no-cache, no-transform')
  setResponseHeader(event, 'connection', 'keep-alive')
  // 防 nginx/反代缓冲，保证 chunk 实时下发
  setResponseHeader(event, 'x-accel-buffering', 'no')

  const upstream = await fetch(`${config.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ ...upstreamBody, stream: true }),
  })

  if (!upstream.ok || !upstream.body) {
    const msg = await upstream.text().catch(() => upstream.statusText)
    throw createError({ statusCode: 502, statusMessage: `LLM 调用失败：${msg}` })
  }

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()

  // 把上游 OpenAI 兼容 SSE（data: {"choices":[{"delta":{"content":"x"}}]}）
  // 转成更简洁的 data: {"delta":"x"}，剥离 usage/prole 等无关字段。
  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder()
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          // SSE 以行为单位，按 \n 切；保留最后一段未结束行待下次拼接
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const delta: string | undefined = json.choices?.[0]?.delta?.content
              if (delta) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`),
                )
              }
            } catch {
              // 忽略 keepalive / 分片畸形，等下一片拼齐
            }
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
    cancel() {
      reader.cancel().catch(() => {})
    },
  })

  return sendStream(event, responseStream)
})
