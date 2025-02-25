<template>
  <menus-button
    ico="new-window"
    :text="t('bubbleMenu.webpage.open')"
    @menu-click="openImage"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const openImage = () => {
  const node = editor.value ? getSelectionNode(editor?.value) : null
  const a = document.createElement('a')
  a.href = node?.attrs.src
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
