<template>
  <menus-button
    ico="new-window"
    :text="t('bubbleMenu.webpage.open')"
    @menu-click="openWebpage"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const openWebpage = () => {
  const webpage = editor.value ? getSelectionNode(editor?.value) : null
  if (webpage) {
    const a = document.createElement('a')
    a.href = webpage?.attrs.src
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
</script>
