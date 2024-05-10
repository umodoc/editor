<template>
  <editor-menus-button
    :button-active="page.showLineNumber"
    huge-button
    @button-click="page.showLineNumber = !page.showLineNumber"
  >
    <icon name="line-number" />
    <template #text>
      <p class="button-text">显示行号</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { page } = useStore()
</script>
