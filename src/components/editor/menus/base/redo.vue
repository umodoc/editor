<template>
  <editor-menus-button
    tooltip="撤销"
    shortcut="Ctrl+Y / Ctrl+Shift+Z"
    :disabled="!editor?.can().chain().focus().redo().run()"
    @button-click="editor?.chain().focus().redo().run()"
  >
    <icon name="redo" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
