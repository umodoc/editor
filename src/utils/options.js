import { isRecord } from '@tool-belt/type-predicates'

import { defaultOptions, objectSchema } from '@/options'

export const getOptions = (propsOptions, globalOptions) => {
  const propsOptionsValue =
    isRecord(propsOptions) && Object.keys(propsOptions).includes('value')
      ? propsOptions.value
      : propsOptions

  const componentOptions = Object.keys(propsOptionsValue).reduce((acc, key) => {
    if (propsOptionsValue[key] !== undefined) {
      acc[key] = propsOptionsValue[key]
    }
    return acc
  }, {})

  const options = objectSchema.merge(
    defaultOptions,
    globalOptions,
    componentOptions,
  )

  return options
}
