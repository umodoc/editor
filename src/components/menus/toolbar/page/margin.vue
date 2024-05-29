<template>
  <menus-button
    ico="page-margin"
    text="页边距"
    huge
    @button-click="dialogVisible = true"
  >
    <page-options :visible="dialogVisible" @close="dialogVisible = false" />
  </menus-button>
</template>

<script setup>
let dialogVisible = $ref(false)
</script>
