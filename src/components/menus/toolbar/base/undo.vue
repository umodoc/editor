<template>
  <menus-button
    ico="undo"
    text="撤销"
    shortcut="Ctrl+Z"
    hide-text
    :disabled="!editor?.can().chain().focus().undo().run()"
    @menu-click="editor?.chain().focus().undo().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
