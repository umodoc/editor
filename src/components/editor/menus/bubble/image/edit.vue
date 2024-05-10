<template>
  <editor-menus-tools-qrcode
    v-if="type === 'qrcode'"
    :content="content"
    :huge-button="false"
  />
  <editor-menus-tools-barcode
    v-if="type === 'barcode'"
    :content="content"
    :huge-button="false"
  />
  <editor-menus-tools-diagrams
    v-if="type === 'diagrams'"
    :content="content"
    :huge-button="false"
  />
  <editor-menus-tools-mermaid
    v-if="type === 'mermaid'"
    :content="content"
    :huge-button="false"
  />
</template>

<script setup>
const { editor } = useStore()
const type = computed(() => {
  return editor.value?.getAttributes('image')?.type
})
const content = computed(() => {
  return editor.value?.getAttributes('image')?.content
})
</script>
