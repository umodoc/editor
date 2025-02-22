<template>
  <menus-button
    :text="t('print.text')"
    ico="print"
    shortcut="Ctrl+P"
    :disabled="editor?.isEmpty"
    huge
    @menu-click="printing = true"
  >
  </menus-button>
</template>

<script setup lang="ts">
const editor = inject('editor')
const printing = inject('printing')
</script>

<style lang="less" scoped></style>
