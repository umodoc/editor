<template>
  <editor-menus-button
    ico="preview"
    text="演示模式"
    shortcut="F5"
    huge
    :menu-active="page.preview.enabled"
    @button-click="page.preview.enabled = !page.preview.enabled"
  />
</template>

<script setup>
const { page } = useStore()
</script>
