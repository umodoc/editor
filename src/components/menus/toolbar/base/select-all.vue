<template>
  <menus-button
    ico="select-all"
    text="全选"
    shortcut="Ctrl+A"
    hide-text
    @menu-click="editor?.chain().focus().selectAll().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
