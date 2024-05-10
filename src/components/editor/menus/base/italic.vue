<template>
  <editor-menus-button
    :button-active="editor?.isActive('italic')"
    :disabled="!editor?.can().chain().focus().toggleItalic().run()"
    tooltip="斜体"
    shortcut="Ctrl+I"
    @button-click="editor?.chain().focus().toggleItalic().run()"
  >
    <icon name="italic" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
