// app 与 server 之间 /api/llm 的请求/响应契约。
// 放在 shared/types/ 下，两端通过 #shared 别名引用，避免重复定义。

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 前端 -> server/api/llm.post.ts 的请求体
export interface LlmRequestBody {
  messages: DeepSeekMessage[]
  responseFormat?: 'text' | 'json_object'
  temperature?: number
  maxTokens?: number
}

// server/api/llm.post.ts -> 前端 的响应体
export interface LlmProxyResponse {
  content: string
}
