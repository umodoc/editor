<template>
  <menus-button
    ico="node-delete"
    text="删除"
    shortcut="Backspace"
    @menu-click="editor?.chain().focus().deleteSelectionNode().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
