import { defineEventHandler, readBody, createError } from 'h3'

import type { LlmRequestBody } from '#shared/types/llm'

// 统一 DeepSeek 代理：前端 POST { messages, responseFormat, temperature }
// 服务端注入 API key，转发给 DeepSeek，返回结构化结果。
// 这样 key 永不暴露给浏览器。
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<LlmRequestBody>(event)

  if (!body?.messages?.length) {
    throw createError({ statusCode: 400, statusMessage: 'messages is required' })
  }

  const apiKey = config.deepseekApiKey
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DeepSeek API key 未配置（请在环境变量 NUXT_DEEPSEEK_API_KEY 中设置）',
    })
  }

  try {
    const resp = await $fetch<{ choices: { message: { content: string } }[] }>(
      `${config.deepseekBaseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: {
          model: config.deepseekModel,
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
    throw createError({ statusCode: 502, statusMessage: `DeepSeek 调用失败：${msg}` })
  }
})
