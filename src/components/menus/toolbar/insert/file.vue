<template>
  <menus-button
    ico="file"
    text="文件"
    huge
    @menu-click="editor.chain().focus().selectFiles('file').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
