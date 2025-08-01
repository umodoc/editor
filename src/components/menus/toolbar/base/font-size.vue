<template>
  <menus-button
    v-if="select"
    :text="t('base.fontSize.text')"
    menu-type="select"
    hide-text
    style="width: 80px"
    :select-options="fontSizes"
    :select-value="
      isTypeRunning
        ? null
        : editor?.getAttributes('textStyle').fontSize || '14px'
    "
    v-bind="$attrs"
    :placeholder="t('base.fontSize.text')"
    filterable
    @menu-click="setFontSize"
  >
  </menus-button>
  <menus-button
    v-if="!disableMenu('font-size-increase')"
    ico="font-size-increase"
    :text="t('base.fontSize.increase')"
    hide-text
    @menu-click="increaseFontSize"
  />
  <menus-button
    v-if="!disableMenu('font-size-decrease')"
    ico="font-size-decrease"
    :text="t('base.fontSize.decrease')"
    hide-text
    @menu-click="decreaseFontSize"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  select: {
    type: Boolean,
    default: true,
  },
})

const editor = inject('editor')
const options = inject('options')

const disableMenu = (name: string) => {
  return options.value.disableExtensions.includes(name)
}
import { getTypewriterRunState } from '@/extensions/type-writer'
let isTypeRunning = $ref(false)
watch(
  () => getTypewriterRunState(),
  (newValue: boolean) => {
    isTypeRunning = newValue
  },
)
const fontSizes = [
  { label: t('base.fontSize.default'), value: '14px', order: 4 },
  { label: t('base.fontSize.42pt'), value: '42pt', order: 20 }, // 56
  { label: t('base.fontSize.36pt'), value: '36pt', order: 19 }, // 48
  { label: t('base.fontSize.26pt'), value: '26pt', order: 16 }, // 35
  { label: t('base.fontSize.24pt'), value: '24pt', order: 15 }, // 32
  { label: t('base.fontSize.22pt'), value: '22pt', order: 14 }, // 29
  { label: t('base.fontSize.18pt'), value: '18pt', order: 11 }, // 24
  { label: t('base.fontSize.16pt'), value: '16pt', order: 10 }, // 22
  { label: t('base.fontSize.15pt'), value: '15pt', order: 9 }, // 21
  { label: t('base.fontSize.14pt'), value: '14pt', order: 7 }, // 19
  { label: t('base.fontSize.12pt'), value: '12pt', order: 4 }, // 16
  { label: t('base.fontSize.10_5pt'), value: '10.5pt', order: 1 }, // 14
  { label: t('base.fontSize.9pt'), value: '9pt', order: 3 }, // 12
  { label: t('base.fontSize.7_5pt'), value: '7.5pt', order: 1 }, // 10
  { label: t('base.fontSize.6_5pt'), value: '6.5pt', order: 0 }, // 9
  { label: '10', value: '10px', order: 1 },
  { label: '11', value: '11px', order: 2 },
  { label: '12', value: '12px', order: 3 },
  { label: '16', value: '16px', order: 5 },
  { label: '18', value: '18px', order: 6 },
  { label: '20', value: '20px', order: 8 },
  { label: '22', value: '22px', order: 10 },
  { label: '24', value: '24px', order: 11 },
  { label: '26', value: '26px', order: 12 },
  { label: '28', value: '28px', order: 13 },
  { label: '32', value: '32px', order: 15 },
  { label: '36', value: '36px', order: 17 },
  { label: '42', value: '42px', order: 18 },
  { label: '48', value: '48px', order: 19 },
  { label: '72', value: '72px', order: 21 },
  { label: '96', value: '96px', order: 22 },
]

// 设置字体大小
const setFontSize = (fontSize: string) => {
  editor.value?.chain().focus().setFontSize(fontSize).run()
}

// 增大字号
const increaseFontSize = () => {
  const { fontSize } = editor.value?.getAttributes('textStyle') ?? {}
  if (fontSize) {
    const size = fontSizes.find(({ value }) => value === fontSize)
    if (!size) {
      return
    }
    const nextFont = fontSizes.find(({ order }) => order === size.order + 1)
    if (nextFont) {
      setFontSize(nextFont.value)
    }
  } else {
    setFontSize('16px')
  }
}

// 减小字号
const decreaseFontSize = () => {
  const { fontSize } = editor.value?.getAttributes('textStyle') ?? {}
  if (fontSize) {
    const size = fontSizes.find(({ value }) => value === fontSize)
    if (!size) {
      return
    }
    const prevFont = fontSizes.find(({ order }) => order === size.order - 1)
    if (prevFont) {
      setFontSize(prevFont.value)
    }
  } else {
    setFontSize('14px')
  }
}
</script>
