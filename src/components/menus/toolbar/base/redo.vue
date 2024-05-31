<template>
  <menus-button
    ico="redo"
    text="撤销"
    shortcut="Ctrl+Y / Ctrl+Shift+Z"
    hide-text
    :disabled="!editor?.can().chain().focus().redo().run()"
    @menu-click="editor?.chain().focus().redo().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
