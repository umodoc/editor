<template>
  <menus-button
    v-if="editor?.getAttributes('file')?.uploaded"
    ico="download"
    :text="t('bubbleMenu.file.download')"
    @menu-click="downloadFile"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const downloadFile = () => {
  const node = editor.value ? getSelectionNode(editor.value) : null
  const a = document.createElement('a')
  a.href = node?.attrs.url
  a.download = node?.attrs.name
  if (a) {
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
</script>
