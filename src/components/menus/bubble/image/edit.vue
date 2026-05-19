<template>
  <menus-toolbar-tools-diagrams
    v-if="attrs.type === 'diagrams'"
    :content="attrs.content"
  />
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'

const editor = inject('editor')

const attrs = computed(() => {
  const node = editor.value ? getSelectionNode(editor?.value) : null
  return node?.attrs || {}
})
</script>
