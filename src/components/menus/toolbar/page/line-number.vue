<template>
  <menus-button
    ico="line-number"
    text="显示行号"
    :menu-active="page.showLineNumber"
    huge
    @button-click="page.showLineNumber = !page.showLineNumber"
  />
</template>

<script setup>
const { page } = useStore()
</script>
