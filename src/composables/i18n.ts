import { isRecord } from '@tool-belt/type-predicates'

import { i18n } from '../i18n'

const { global } = i18n

// @ts-ignore
export const { t } = global

export const l = (data: string | Record<string, string>) => {
  if (typeof data === 'string') {
    return data
  }

  if (isRecord(data)) {
    return data[global.locale.value.replace('-', '_')]
  }
}

export const useI18n = () => global
