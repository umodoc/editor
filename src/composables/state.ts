import type { RemovableRef } from '@vueuse/core'

import { i18n } from '@/i18n'
import type { DocumentOptions, SupportedLocale } from '@/types'

export type StateKey = 'toolbar' | 'document' | 'recent' | 'print' | 'locale'
export type StateValue<T extends StateKey> = T extends 'toolbar'
  ? {
      mode: string
      show: boolean
    }
  : T extends 'document'
    ? DocumentOptions
    : T extends 'recent'
      ? {
          fonts: string[]
          colors: string[]
        }
      : T extends 'print'
        ? {
            singleColumn: boolean
            showPageNumber: boolean
          }
        : T extends 'locale'
          ? SupportedLocale
          : never

export function useState<T extends StateKey>(
  key: T,
  editorKey?: string,
): RemovableRef<StateValue<T>> {
  const { options } = useStore()

  const storageKey = `umo-editor:${editorKey ?? options.value.editorKey}:${key}`

  if (key === 'document') {
    return useStorage(
      storageKey,
      (options.value.document ?? {}) as StateValue<T>,
    )
  }
  if (key === 'locale') {
    return useStorage(storageKey, i18n.global.locale.value as StateValue<T>)
  }
  if (key === 'recent') {
    return useStorage(storageKey, {
      fonts: [] as string[],
      colors: [] as string[],
    } as StateValue<T>)
  }
  if (key === 'print') {
    return useStorage(storageKey, {
      singleColumn: true,
      showPageNumber: true,
    } as StateValue<T>)
  }
  if (key === 'toolbar') {
    return useStorage(storageKey, {
      mode: options.value.toolbar?.defaultMode ?? 'classic',
      show: true,
    } as StateValue<T>)
  }
  throw new Error('[useStorage]', { cause: 'Key is not valid' })
}
