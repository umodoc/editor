<template>
  <menus-button
    ico="image"
    text="图片"
    huge
    @menu-click="editor.chain().focus().selectFiles('image').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
