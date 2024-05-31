<template>
  <menus-button
    ico="line-number"
    text="显示行号"
    :menu-active="page.showLineNumber"
    huge
    @menu-click="page.showLineNumber = !page.showLineNumber"
  />
</template>

<script setup>
const { page } = useStore()
</script>
