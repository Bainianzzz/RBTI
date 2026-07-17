// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // 全局 alias：让 @/ 指向 app/，兼容从旧 Vue 项目搬来的导入路径
  alias: {
    '@': '~~/app',
  },

  // shadcn-vue 组件目录走显式 import（import { Button } from '~/components/ui/button'），
  // 排除 ui/ 子目录避免 Nuxt 把 Badge.vue 和 index.ts 同时自动导入造成命名冲突。
  components: [
    { path: '~/components', pathPrefix: false, ignore: ['**/ui/**'] },
  ],

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
    deepseekApiKey: '',
    deepseekBaseUrl: 'https://api.deepseek.com',
    deepseekModel: 'deepseek-chat',
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
