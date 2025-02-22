<template>
  <menus-button text="PDF" ico="pdf" huge @menu-click="exportFile.pdf = true" />
</template>

<script setup lang="ts">
const exportFile = inject('exportFile')
</script>

<style lang="less" scoped></style>
