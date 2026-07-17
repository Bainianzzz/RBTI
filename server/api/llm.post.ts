import type { LlmRequestBody } from '#shared/types/llm'

// LLM 代理：前端 POST { messages, responseFormat, temperature }
// 服务端注入 API key，转发给 OpenAI 兼容端点（默认 DeepSeek），返回结构化结果。
// 这样 key 永不暴露给浏览器。
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

  try {
    const resp = await $fetch<{ choices: { message: { content: string } }[] }>(
      `${config.apiUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: {
          model: config.apiModel,
          messages: body.messages,
          stream: false,
          temperature: body.temperature ?? 1,
          max_tokens: body.maxTokens ?? 1024,
          response_format: body.responseFormat
            ? { type: body.responseFormat }
            : undefined,
        },
      },
    )

    return {
      content: resp.choices?.[0]?.message?.content ?? '',
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 502, statusMessage: `LLM 调用失败：${msg}` })
  }
})
