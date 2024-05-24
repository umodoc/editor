<template>
  <editor-menus-button
    ico="image"
    text="图片"
    huge
    @button-click="editor.chain().focus().selectFiles('image').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
