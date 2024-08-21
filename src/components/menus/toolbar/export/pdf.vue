<template>
  <menus-button text="PDF" ico="pdf" huge @menu-click="exportPDF = true" />
</template>

<script setup>
const { exportPDF } = useStore()
</script>

<style lang="less" scoped></style>
