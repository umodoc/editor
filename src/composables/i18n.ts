import { isRecord } from '@tool-belt/type-predicates'

import { i18n } from '../i18n'

export const { t } = i18n.global

export const l = (data: string | Record<string, string>) => {
  if (typeof data === 'string') {
    return data
  }

  if (isRecord(data)) {
    return data[i18n.global.locale.value.replace('-', '_')]
  }
}

export const useI18n = () => {
  return { t, l, locale: i18n.global.locale }
}

export { i18n }
