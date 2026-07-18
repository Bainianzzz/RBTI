// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // 纯客户端交互应用：无 SSR 预取内容，关掉 SSR 消除 hydration 风险，
  // typed.js 等 browser-only 依赖也天然安全。server/api 仍在 Nitro 运行。
  ssr: false,

  // Tailwind v4（通过 PostCSS 插件）
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt'],

  // 服务端私有配置：DeepSeek API key（仅 server/ 可见）
  runtimeConfig: {
    // 从 .env 读取；未配置时回退到 DeepSeek 默认值
    apiKey: process.env.API_KEY ?? '',
    apiUrl: process.env.API_URL ?? 'https://api.deepseek.com',
    apiModel: process.env.API_MODEL ?? 'deepseek-v4-flash',
  },

  app: {
    head: {
      title: '洛克王国 · 本命精灵契约',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
