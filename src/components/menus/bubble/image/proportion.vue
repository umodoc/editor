<template>
  <menus-button
    ico="equal-proportion"
    :text="t('bubbleMenu.image.proportion')"
    :menu-active="editor?.getAttributes('image')?.equalProportion"
    @menu-click="toggleEqualProportion"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const toggleEqualProportion = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image) {
    editor.value?.commands.updateAttributes(image.type, {
      equalProportion: !image.attrs.equalProportion,
    })
  }
}
</script>
