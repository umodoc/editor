<template>
  <menus-button
    v-if="editor?.getAttributes('image')?.draggable"
    ico="image-reset"
    :text="t('bubbleMenu.image.reset')"
    @menu-click="resetPosition"
  />
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'

const editor = inject('editor')

const resetPosition = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image) {
    editor.value?.commands.updateAttributes(image.type, {
      top: 0,
      left: 0,
      angle: 0,
      flipX: false,
      flipY: false,
    })
  }
}
</script>
