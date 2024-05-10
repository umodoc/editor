<template>
  <editor-menus-button
    tooltip="全选"
    shortcut="Ctrl+A"
    @button-click="editor?.chain().focus().selectAll().run()"
  >
    <icon name="select-all" style="font-size: 16px" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
