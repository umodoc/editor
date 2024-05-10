<template>
  <editor-menus-button
    :button-active="editor?.isActive('bold')"
    :disabled="!editor?.can().chain().focus().toggleBold().run()"
    tooltip="加粗"
    shortcut="Ctrl+B"
    @button-click="editor?.chain().focus().toggleBold().run()"
  >
    <icon name="bold" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
