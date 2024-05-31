<template>
  <menus-button
    ico="text-box"
    text="文本框"
    huge
    @menu-click="editor?.chain().focus().setTextBox().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
