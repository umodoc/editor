import type { RemovableRef } from '@vueuse/core'

import type { DocumentOptions, SupportedLocale } from '@/types'

export type StateKey = 'toolbar' | 'document' | 'recent' | 'print'
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
  options: any,
): RemovableRef<StateValue<T>> {
  const storageKey = `umo-editor:${options?.value?.editorKey ?? 'default'}:${key}`

  if (key === 'document') {
    return useStorage<StateValue<T>>(
      storageKey,
      (options?.value?.document ?? {}) as StateValue<T>,
    )
  }
  if (key === 'recent') {
    return useStorage<StateValue<T>>(storageKey, {
      fonts: [] as string[],
      colors: [] as string[],
    } as StateValue<T>)
  }
  if (key === 'print') {
    return useStorage<StateValue<T>>(storageKey, {
      singleColumn: true,
      showPageNumber: true,
    } as StateValue<T>)
  }
  if (key === 'toolbar') {
    return useStorage<StateValue<T>>(storageKey, {
      mode: (options?.value?.toolbar?.defaultMode ?? 'classic') as string,
      show: true,
    } as StateValue<T>)
  }
  throw new Error('[useStorage]', { cause: 'Key is not valid' })
}
