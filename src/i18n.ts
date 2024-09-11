import { isRecord } from '@tool-belt/type-predicates'
import { merge } from 'ts-deepmerge'
import { createI18n } from 'vue-i18n'

import en_US from './locales/en-US.json'
import zh_CN from './locales/zh-CN.json'
import type { SupportedLocale } from './types'

const { options } = useStore()

const getLocale = (lang: SupportedLocale) => {
  const translations = options.value.translations?.[lang]
  if (isRecord(translations)) {
    return translations
  }
  return {}
}

export const i18n = createI18n({
  legacy: false,
  locale: options.value.locale || 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: {
    'en-US': merge(en_US, getLocale('en-US')),
    'zh-CN': merge(zh_CN, getLocale('zh-CN')),
  },
})
