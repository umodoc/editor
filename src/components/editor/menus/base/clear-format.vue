<template>
  <editor-menus-button
    tooltip="清除文本格式"
    @button-click="editor?.chain().focus().unsetAllMarks().run()"
  >
    <icon name="clear-format" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
