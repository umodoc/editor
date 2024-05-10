<template>
  <editor-menus-button
    tooltip="行高"
    button-type="dropdown"
    :select-options="lineHeights"
    @click="setLineHeight"
  >
    <icon name="line-height" />
  </editor-menus-button>
</template>

<script setup>
const { options, editor } = useStore()

const lineHeights = computed(() => {
  const result = options.value.dicts.lineHeights.map((item) => {
    return {
      content: item.default ? item.label + ' (默认)' : item.label,
      value: item.value,
      active: editor.value?.isActive({ lineHeight: item.value }),
    }
  })
  return result
})

const setLineHeight = ({ content, value }) => {
  if (!content) return
  editor.value?.chain().focus().setLineHeight(value).run()
}
</script>
