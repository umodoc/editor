<template>
  <editor-menus-tools-qrcode v-if="type === 'qrcode'" :content="content" />
  <editor-menus-tools-barcode v-if="type === 'barcode'" :content="content" />
  <editor-menus-tools-diagrams v-if="type === 'diagrams'" :content="content" />
  <editor-menus-tools-mermaid v-if="type === 'mermaid'" :content="content" />
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
