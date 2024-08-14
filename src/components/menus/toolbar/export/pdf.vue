<template>
  <menus-button
    text="PDF"
    ico="pdf"
    shortcut="Ctrl+P"
    huge
    @menu-click="exportPDF = true"
  >
  </menus-button>
</template>

<script setup>
const { exportPDF } = useStore()
</script>

<style lang="less" scoped></style>
