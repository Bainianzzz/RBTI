import { createI18n } from 'vue-i18n'

import enUSQuestions from '@/i18n/locales/questions/en-US'
import zhCNQuestions from '@/i18n/locales/questions/zh-CN'
import enUSText from '@/i18n/locales/text/en-US'
import zhCNText from '@/i18n/locales/text/zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale: navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': { ...zhCNText, ...zhCNQuestions },
    'en-US': { ...enUSText, ...enUSQuestions },
  },
})
