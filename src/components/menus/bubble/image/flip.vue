<template>
  <menus-button
    ico="image-flip"
    :text="t('bubbleMenu.image.flipX')"
    :menu-active="editor?.getAttributes('image')?.flipY"
    @menu-click="setFlip('flipY')"
  />
  <menus-button
    :text="t('bubbleMenu.image.flipY')"
    :menu-active="editor?.getAttributes('image')?.flipX"
    @menu-click="setFlip('flipX')"
  >
    <icon name="image-flip" style="transform: rotate(90deg)" />
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const setFlip = (flip: 'flipX' | 'flipY') => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  const { flipX, flipY } = image?.attrs ?? {}
  if (image && flip === 'flipX') {
    editor.value?.commands.updateAttributes(image.type, {
      flipX: !flipX,
    })
  }
  if (image && flip === 'flipY') {
    editor.value?.commands.updateAttributes(image.type, {
      flipY: !flipY,
    })
  }
}
</script>
