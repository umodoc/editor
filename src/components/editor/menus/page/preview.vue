<template>
  <editor-menus-button
    huge-button
    :button-active="page.preview.enabled"
    @button-click="page.preview.enabled = !page.preview.enabled"
  >
    <icon name="preview" />
    <template #text>
      <p class="button-text">演示模式</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { page } = useStore()
</script>
