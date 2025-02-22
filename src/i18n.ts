import { createI18n } from 'vue-i18n'

import en_US from './locales/en-US.json'
import ru_RU from './locales/ru-RU.json'
import zh_CN from './locales/zh-CN.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: {
    'en-US': en_US,
    'zh-CN': zh_CN,
    'ru-RU': ru_RU,
  },
})
