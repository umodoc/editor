<template>
  <editor-menus-button huge-button @button-click="dialogVisible = true">
    <icon name="page-margin" />
    <template #text>
      <p class="button-text">页边距</p>
    </template>
    <toolbar-page-options
      :visible="dialogVisible"
      @close="dialogVisible = false"
    />
  </editor-menus-button>
</template>

<script setup>
let dialogVisible = $ref(false)
</script>
