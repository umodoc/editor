<template>
  <editor-menus-button
    ico="page-margin"
    text="页边距"
    huge
    @button-click="dialogVisible = true"
  >
    <toolbar-page-options
      :visible="dialogVisible"
      @close="dialogVisible = false"
    />
  </editor-menus-button>
</template>

<script setup>
let dialogVisible = $ref(false)
</script>
