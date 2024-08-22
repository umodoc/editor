<template>
  <menus-button
    ico="image-rotate"
    :text="t('bubbleMenu.image.rotateCC')"
    @menu-click="setRotate(-90)"
  />
  <menus-button
    :text="t('bubbleMenu.image.rotateC')"
    @menu-click="setRotate(90)"
  >
    <icon name="image-rotate" style="transform: rotateY(180deg)" />
  </menus-button>
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const setRotate = (rotate) => {
  const image = getSelectionNode(editor.value)
  const { angle } = image.attrs
  editor.value.commands.updateAttributes(image.type, {
    angle: angle ? angle + rotate : rotate,
  })
}
</script>
