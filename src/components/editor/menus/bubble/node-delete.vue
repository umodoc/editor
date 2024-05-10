<template>
  <editor-menus-button
    tooltip="删除"
    shortcut="Backspace"
    @button-click="editor?.chain().focus().deleteSelectionNode().run()"
  >
    <icon name="node-delete" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
