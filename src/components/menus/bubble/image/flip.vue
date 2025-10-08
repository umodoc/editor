<template>
  <menus-button
    ico="image-flip"
    :text="t('bubbleMenu.image.flipX')"
    :menu-active="flipYActive"
    @menu-click="setFlip('flipY')"
  />
  <menus-button
    :text="t('bubbleMenu.image.flipY')"
    :menu-active="flipXActive"
    @menu-click="setFlip('flipX')"
  >
    <icon name="image-flip" style="transform: rotate(90deg)" />
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const flipYActive = computed(() => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image?.type?.name) {
    return editor.value?.getAttributes(image?.type?.name)?.flipY
  } else return false
})

const flipXActive = computed(() => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image?.type?.name) {
    return editor.value?.getAttributes(image?.type?.name)?.flipX
  } else return false
})

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
