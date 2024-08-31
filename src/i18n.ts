import { merge } from 'ts-deepmerge'
import { createI18n } from 'vue-i18n'

import en_US from './locales/en-US.json'
import zh_CN from './locales/zh-CN.json'

const { options } = useStore()

export type SupportedLocale = 'en-US' | 'zh-CN'

const getLocale = (lang: SupportedLocale) => {
  const translations = options.value.translations[lang]
  if (typeof translations === 'object') {
    return translations
  }
  return {}
}

export const i18n = createI18n({
  legacy: false,
  locale: options.value.locale || 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: {
    'en-US': merge(en_US, getLocale('en_US')),
    'zh-CN': merge(zh_CN, getLocale('zh_CN')),
  },
})
