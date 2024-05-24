<template>
  <editor-menus-button
    text="选择字体"
    menu-type="select"
    hide-text
    :value="editor?.getAttributes('textStyle').fontFamily || null"
    :style="{ width: $toolbar.mode !== 'classic' ? '144px' : '90px' }"
    placeholder="字体"
    filterable
    @button-click="setFontFamily"
  >
    <t-option-group
      v-for="(group, index) in allFonts"
      :key="index"
      :label="group.label"
      :divider="false"
    >
      <t-option
        class="font-family-item"
        v-for="item in group.children"
        :value="item.value"
        :key="item.value"
        :label="item.label"
      >
        <span :style="{ fontFamily: item.value }">{{ item.label }}</span>
        <span
          v-if="!fontDetect(item.value)"
          class="not-support"
          title="可能无法正常显示该字体，可能是本机未安装该字体"
          >!</span
        >
      </t-option>
    </t-option-group>
  </editor-menus-button>
</template>

<script setup>
const { options, editor } = useStore()
const $toolbar = useState('toolbar')
const $recent = useState('recent')

let usedFonts = $ref([])
// https://www.cnblogs.com/gaidalou/p/8479452.html
const fontDetect = (font) => {
  if (!font) return true
  if (typeof font !== 'string') return false

  const baseFont = 'fontname'
  const testChar = 'text'
  const canvasWidth = 100
  const canvasHeight = 100

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  context.textAlign = 'center'
  context.fillStyle = 'black'
  context.textBaseline = 'middle'

  const getImageDataWithFont = (currentFont) => {
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
  const all = [{ label: '常用字体', children: options.value.dicts.fonts }]
  // 通过字体值获取字体列表
  const getFontsByValues = (values) => {
    return values.map(
      (item) =>
        options.value.dicts.fonts.find(({ value }) => value === item) || {
          label: item,
          item,
        },
    )
  }
  if ($recent.value.fonts.length > 0) {
    all.unshift({
      label: '最近使用',
      children: getFontsByValues($recent.value.fonts),
    })
  }
  if (usedFonts.length > 0) {
    all.unshift({
      label: '已使用的字体',
      children: getFontsByValues(usedFonts),
    })
  }
  return all
})

// 获取当前文档中所有已使用的字体
const getUsedFonts = () => {
  const content = JSON.stringify(editor.value.getJSON())
  const matches = content.match(/"fontFamily":"([^"]+)"/g)
  if (matches) {
    matches.forEach((item) => {
      const font = item.replace('"fontFamily":"', '').replace('"', '')
      if (!usedFonts.includes(font)) usedFonts.push(font)
    })
  }
}

const setFontFamily = (fontFamily) => {
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
  editor.value.chain().focus().setFontFamily(fontFamily).run()
  getUsedFonts()
}

watch(
  () => editor.value,
  (val) => {
    if (val) getUsedFonts()
  },
)
</script>

<style lang="less">
.font-family-item {
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    .not-support {
      color: var(--umo-error-color);
      font-size: 14px;
    }
  }
}
</style>
