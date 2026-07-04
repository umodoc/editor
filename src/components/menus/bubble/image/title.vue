<template>
  <menus-button
    ico="text-2"
    :text="t('bubbleMenu.image.title')"
    :menu-active="image?.attrs?.showTitle !== false"
    @menu-click="toggleTitle"
  />
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'

const editor = inject('editor')

const image = computed(() => {
  if (!editor.value) {
    return null
  }
  const node = getSelectionNode(editor.value)
  return node?.type?.name === 'image' ? node : null
})

const toggleTitle = () => {
  if (!image.value) {
    return
  }
  editor.value?.commands.updateAttributes(image.value.type, {
    showTitle: image.value.attrs.showTitle === false,
  })
}
</script>
