<template>
  <editor-menus-button
    ico="audio"
    text="音频"
    huge
    @button-click="editor.chain().focus().selectFiles('audio').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
