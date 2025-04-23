<template>
  <menus-button
    :text="t('base.fontFamily.text')"
    menu-type="select"
    hide-text
    :select-value="
      isTypeRunning
        ? null
        : editor?.getAttributes('textStyle').fontFamily || null
    "
    :style="{ width: $toolbar.mode !== 'classic' ? '144px' : '90px' }"
    filterable
    @menu-click="setFontFamily"
  >
    <t-option-group
      v-for="(group, index) in allFonts"
      :key="index"
      :label="group.label"
      :divider="false"
    >
      <t-option
        v-for="item in group.children"
        :key="item.value ?? ''"
        class="umo-font-family-item"
        :value="item.value ?? ''"
        :label="l(item.label)"
      >
        <span
          :style="{ fontFamily: item.value ?? undefined }"
          v-text="l(item.label)"
        ></span>
        <span
          v-if="!fontDetect(item.value ?? '')"
          class="umo-font-family-unsupport"
          :title="t('base.fontFamily.unsupport')"
          >!</span
        >
      </t-option>
    </t-option-group>
  </menus-button>
</template>

<script setup lang="ts">
import { isString } from '@tool-belt/type-predicates'

const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)
const $recent = useState('recent', options)

import { getTypewriterRunState } from '@/extensions/type-writer'
let isTypeRunning = $ref(false)
watch(
  () => getTypewriterRunState(),
  (newValue: boolean) => {
    isTypeRunning = newValue
  },
)
const usedFonts = $ref<string[]>([])
// https://www.cnblogs.com/gaidalou/p/8479452.html
const fontDetect = (font?: string) => {
  if (!font) {
    return true
  }
  if (!isString(font)) {
    return false
  }

  const baseFont = 'fontname'
  const testChar = 'text'
  const canvasWidth = 100
  const canvasHeight = 100

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })

  canvas.width = canvasWidth
  canvas.height = canvasHeight
  if (context) {
    context.textAlign = 'center'
    context.fillStyle = 'black'
    context.textBaseline = 'middle'
  }

  const getImageDataWithFont = (currentFont: string) => {
    if (!context) {
      return []
    }
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.font = `${canvasHeight}px ${currentFont}, ${baseFont}`
    context.fillText(testChar, canvasWidth / 2, canvasHeight / 2)
    const { data } = context.getImageData(0, 0, canvasWidth, canvasHeight)

    return Array.from(data).filter((pixel) => pixel !== 0)
  }

  // 返回结果，如果使用 baseFont 和输入的 font 时，通过 getImageDataWithFont 函数检测得到的像素数据不一致，则说明自定义字体生效
  return (
    getImageDataWithFont(baseFont).join('') !==
    getImageDataWithFont(font).join('')
  )
}

const allFonts = computed(() => {
  const all = [
    {
      label: t('base.fontFamily.all'),
      children: options.value.dicts?.fonts ?? [],
    },
  ]
  // 通过字体值获取字体列表
  const getFontsByValues = (values: string[]) => {
    return values.map(
      (item) =>
        options.value.dicts?.fonts.find(
          ({ value }: { value: string }) => value === item,
        ) ?? {
          label: item,
          item,
        },
    )
  }
  if ($recent.value.fonts.length > 0) {
    all.unshift({
      label: t('base.fontFamily.recent'),
      children: getFontsByValues($recent.value.fonts) as any,
    })
  }
  if (usedFonts.length > 0) {
    all.unshift({
      label: t('base.fontFamily.used'),
      children: getFontsByValues(usedFonts) as any,
    })
  }
  return all
})

// 获取当前文档中所有已使用的字体
const getUsedFonts = () => {
  const content = JSON.stringify(editor.value?.getJSON())
  const matches = content.match(/"fontFamily":"([^"]+)"/g)
  if (matches) {
    for (const item of matches) {
      const font = item.replace('"fontFamily":"', '').replace('"', '')
      if (!usedFonts.includes(font)) {
        usedFonts.push(font)
      }
    }
  }
}

const setFontFamily = (fontFamily: string) => {
  if (fontFamily) {
    $recent.value.fonts.forEach((item, index) => {
      if (item === fontFamily) {
        $recent.value.fonts.splice(index, 1)
      }
    })
    $recent.value.fonts.unshift(fontFamily)
    if ($recent.value.fonts.length > 10) {
      $recent.value.fonts.splice(10, 1)
    }
  }
  editor.value?.chain().focus().setFontFamily(fontFamily).run()
  getUsedFonts()
}

watch(
  () => editor.value,
  (val: any) => {
    if (val) {
      getUsedFonts()
    }
  },
)
</script>

<style lang="less">
.umo-font-family-item {
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    .umo-font-family-unsupport {
      color: var(--umo-error-color);
      font-size: 14px;
    }
  }
}
</style>
