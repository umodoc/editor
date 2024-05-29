<template>
  <menus-button
    v-if="select"
    text="字体大小"
    menu-type="select"
    hide-text
    :style="{ width: $toolbar.mode !== 'classic' ? '80px' : '58px' }"
    :select-options="fontSizes"
    :value="editor?.getAttributes('textStyle').fontSize || '14px'"
    v-bind="$attrs"
    placeholder="字号"
    filterable
    @button-click="setFontSize"
  >
  </menus-button>
  <menus-button
    ico="font-size-increase"
    text="增大字号"
    hide-text
    @button-click="increaseFontSize"
  />
  <menus-button
    ico="font-size-decrease"
    text="减小字号"
    hide-text
    @button-click="decreaseFontSize"
  />
</template>

<script setup>
const props = defineProps({
  select: {
    type: Boolean,
    default: true,
  },
})

const { editor } = useStore()
const $toolbar = useState('toolbar')

const fontSizes = [
  { label: '默认', value: '14px', order: 4 },
  { label: '初号', value: '42pt', order: 20 }, //56
  { label: '小初', value: '36pt', order: 19 }, //48
  { label: '一号', value: '26pt', order: 16 }, //35
  { label: '小一', value: '24pt', order: 15 }, //32
  { label: '二号', value: '22pt', order: 14 }, //29
  { label: '小二', value: '18pt', order: 11 }, //24
  { label: '三号', value: '16pt', order: 10 }, //22
  { label: '小三', value: '15pt', order: 9 }, //21
  { label: '四号', value: '14pt', order: 7 }, //19
  { label: '小四', value: '12pt', order: 4 }, //16
  { label: '五号', value: '10.5pt', order: 1 }, //14
  { label: '小五', value: '9pt', order: 3 }, //12
  { label: '六号', value: '7.5pt', order: 1 }, //10
  { label: '小六', value: '6.5pt', order: 0 }, //9
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
const setFontSize = (fontSize) => {
  editor.value.chain().focus().setFontSize(fontSize).run()
}

// 增大字号
const increaseFontSize = () => {
  const { fontSize } = editor.value.getAttributes('textStyle')
  if (fontSize) {
    const size = fontSizes.find(({ value }) => value === fontSize)
    if (!size) return
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
  const { fontSize } = editor.value.getAttributes('textStyle')
  if (fontSize) {
    const size = fontSizes.find(({ value }) => value === fontSize)
    if (!size) return
    const prevFont = fontSizes.find(({ order }) => order === size.order - 1)
    if (prevFont) {
      setFontSize(prevFont.value)
    }
  } else {
    setFontSize('14px')
  }
}
</script>
