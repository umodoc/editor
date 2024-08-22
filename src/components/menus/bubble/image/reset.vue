<template>
  <menus-button
    ico="image-reset"
    :text="t('bubbleMenu.image.reset')"
    @menu-click="resetPosition"
  />
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const resetPosition = () => {
  const image = getSelectionNode(editor.value)
  editor.value.commands.updateAttributes(image.type, {
    top: 0,
    left: 0,
    angle: 0,
    flipX: false,
    flipy: false,
  })
}
</script>
