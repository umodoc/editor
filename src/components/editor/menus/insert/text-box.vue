<template>
  <editor-menus-button
    ico="text-box"
    text="文本框"
    huge
    @button-click="editor?.chain().focus().setTextBox().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
