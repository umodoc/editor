<template>
  <editor-menus-button
    ico="clear-format"
    text="清除文本格式"
    hide-text
    @button-click="editor?.chain().focus().unsetAllMarks().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
