<template>
  <menus-button
    :text="t('base.lineHeight.text')"
    ico="line-height"
    menu-type="dropdown"
    hide-text
    :select-options="lineHeights"
    @click="setLineHeight"
  />
</template>

<script setup>
const { options, editor } = useStore()

const lineHeights = computed(() => {
  const result = options.value.dicts.lineHeights.map((item) => {
    return {
      content: item.default
        ? l(item.label) + t('base.lineHeight.default')
        : l(item.label),
      value: item.value,
      active: editor.value?.isActive({ lineHeight: item.value }),
    }
  })
  return result
})

const setLineHeight = ({ content, value }) => {
  if (!content) {
    return
  }
  editor.value?.chain().focus().setLineHeight(value).run()
}
</script>
