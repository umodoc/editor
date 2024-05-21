<template>
  <editor-menus-button huge-button @button-click="printing = true">
    <icon name="print" />
    <template #text>
      <p class="button-text">打印</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { printing } = useStore()
</script>

<style lang="less" scoped></style>
