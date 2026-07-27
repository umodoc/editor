export const STAMP_PRESET_DEFINITIONS = [
  {
    value: 'company',
    labelKey: 'tools.stamp.presets.company',
    width: 159,
    height: 159,
  },
  {
    value: 'contract',
    labelKey: 'tools.stamp.presets.contract',
    width: 219,
    height: 219,
  },
  {
    value: 'finance',
    labelKey: 'tools.stamp.presets.finance',
    width: 144,
    height: 144,
  },
  {
    value: 'invoice',
    labelKey: 'tools.stamp.presets.invoice',
    width: 151,
    height: 113,
  },
  {
    value: 'legal',
    labelKey: 'tools.stamp.presets.legal',
    width: 76,
    height: 76,
  },
  {
    value: 'customs',
    labelKey: 'tools.stamp.presets.customs',
    width: 189,
    height: 136,
  },
  {
    value: 'other',
    labelKey: 'tools.stamp.presets.other',
    width: null,
    height: null,
    isCustom: true,
  },
]

export const getStampPresetOptions = (t) =>
  STAMP_PRESET_DEFINITIONS.map((item) => ({
    ...item,
    label: typeof t === 'function' ? t(item.labelKey) : item.labelKey,
  }))

export const getStampPresetByValue = (value) =>
  STAMP_PRESET_DEFINITIONS.find((item) => item.value === value) ||
  STAMP_PRESET_DEFINITIONS[STAMP_PRESET_DEFINITIONS.length - 1]

export const getStampPresetValueBySize = (width, height) => {
  const nextWidth = Number(width)
  const nextHeight = Number(height)
  const isSameSize = (current, target) =>
    Math.abs(Number(current || 0) - Number(target || 0)) < 0.01
  const matched = STAMP_PRESET_DEFINITIONS.find(
    (item) =>
      item.isCustom !== true &&
      isSameSize(item.width, nextWidth) &&
      isSameSize(item.height, nextHeight),
  )
  return matched?.value || 'other'
}
