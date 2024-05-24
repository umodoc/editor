<template>
  <editor-menus-button
    text="斜体"
    ico="italic"
    shortcut="Ctrl+I"
    hide-text
    :menu-active="editor?.isActive('italic')"
    :disabled="!editor?.can().chain().focus().toggleItalic().run()"
    @button-click="editor?.chain().focus().toggleItalic().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
