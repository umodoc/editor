<template>
  <menus-button
    :menu-active="editor?.getAttributes('iframe')?.clickable"
    ico="clickable"
    :text="t('bubbleMenu.webpage.clickable')"
    @menu-click="toggleClickable"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const toggleClickable = () => {
  const webpage = editor.value ? getSelectionNode(editor.value) : null
  if (webpage) {
    editor.value?.commands.updateAttributes(webpage.type, {
      clickable: true,
    })
  }
}
</script>
