<template>
  <editor-menus-button
    ico="file"
    text="文件"
    huge
    @button-click="editor.chain().focus().selectFiles('file').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
