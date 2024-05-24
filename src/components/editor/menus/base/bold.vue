<template>
  <editor-menus-button
    ico="bold"
    text="加粗"
    shortcut="Ctrl+B"
    hide-text
    :menu-active="editor?.isActive('bold')"
    :disabled="!editor?.can().chain().focus().toggleBold().run()"
    @button-click="editor?.chain().focus().toggleBold().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
