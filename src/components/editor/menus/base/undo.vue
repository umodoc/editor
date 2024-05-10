<template>
  <editor-menus-button
    tooltip="撤销"
    shortcut="Ctrl+Z"
    :disabled="!editor?.can().chain().focus().undo().run()"
    @button-click="editor?.chain().focus().undo().run()"
  >
    <icon name="undo" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
