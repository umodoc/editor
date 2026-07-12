<template>
  <menus-button
    v-if="canShowReset"
    ico="refresh"
    :text="t('bubbleMenu.image.resetAll')"
    @menu-click="resetImage"
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
  return ['image', 'inlineImage'].includes(node?.type?.name) ? node : null
})

const canShowReset = computed(() => !!image.value?.attrs?.initialAttrs)

const resetImage = () => {
  if (!image.value) {
    return
  }
  editor.value?.commands.resetImageToInitial()
}
</script>
