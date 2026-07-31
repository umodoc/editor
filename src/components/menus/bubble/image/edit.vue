<template>
  <menus-toolbar-tools-signature
    v-if="attrs.type === 'signature'"
    :replace="true"
    :value="attrs"
  />
  <menus-toolbar-tools-qrcode
    v-if="attrs.type === 'qrcode'"
    :content="attrs.content"
    :replace="true"
    :value="attrs"
  />
  <menus-toolbar-tools-barcode
    v-if="attrs.type === 'barcode'"
    :content="attrs.content"
    :replace="true"
    :value="attrs"
  />
  <menus-toolbar-tools-stamp
    v-if="attrs.type === 'stamp'"
    :replace="true"
    :value="attrs"
  />
  <menus-toolbar-tools-diagrams
    v-if="attrs.type === 'diagrams'"
    :content="attrs.content"
  />
  <menus-toolbar-tools-mermaid
    v-if="attrs.type === 'mermaid'"
    :content="attrs.content"
    :config="JSON.parse(attrs.config || '{}')"
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
