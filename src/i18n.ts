import { createI18n } from 'vue-i18n'
import zh_CN from './locales/zh-CN.json'
import en_US from './locales/en-US.json'

const { options } = useStore()

const getLocale = (lang: 'en_US' | 'zh_CN') => {
  const translations = options.value.translations[lang]
  if (typeof translations === 'object') {
    return translations  
  }
  return {}
}

const deepMerge = (target: any, ...sources: any) => {
  if (typeof target !== 'object' || target === null) {
    target = {}
  }
  sources.forEach((source: any) => {
    if (source !== null && typeof source === 'object') {
      Object.keys(source).forEach((key) => {
        if (source[key] && typeof source[key] === 'object') {
          if (!target[key]) {
            target[key] = Array.isArray(source[key]) ? [] : {}
          }
          deepMerge(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      })
    }
  })
  return target
}

const i18n = createI18n({
  legacy: false,
  locale: options.value.locale || 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: {
    'en-US': deepMerge(en_US, getLocale('en_US')),
    'zh-CN': deepMerge(zh_CN, getLocale('zh_CN')),
  },
})

export default i18n
