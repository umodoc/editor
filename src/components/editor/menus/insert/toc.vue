<template>
  <editor-menus-button
    ico="toc"
    text="页面大纲"
    huge
    @button-click="editor?.chain().focus().addTableOfContents().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
