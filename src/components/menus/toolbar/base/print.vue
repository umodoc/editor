<template>
  <menus-button
    text="打印"
    ico="print"
    shortcut="Ctrl+P"
    huge
    @menu-click="printing = true"
  >
  </menus-button>
</template>

<script setup>
const { printing } = useStore()
</script>

<style lang="less" scoped></style>
