<template>
  <editor-menus-button
    ico="node-delete"
    text="删除"
    shortcut="Backspace"
    @button-click="editor?.chain().focus().deleteSelectionNode().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
