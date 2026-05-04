import { createI18n } from 'vue-i18n'

import en_US from './locales/en-US.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  defaultLocale: 'en-US',
  warnHtmlMessage: false,
  messages: {
    'en-US': en_US,
  },
})
