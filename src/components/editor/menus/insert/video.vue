<template>
  <editor-menus-button
    ico="video"
    text="视频"
    huge
    @button-click="editor.chain().focus().selectFiles('video').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
