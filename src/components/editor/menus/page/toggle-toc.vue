<template>
  <editor-menus-button
    huge-button
    :button-active="page.showToc"
    @button-click="page.showToc = !page.showToc"
  >
    <icon name="toc" />
    <template #text>
      <p class="button-text">显示大纲</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { page } = useStore()
</script>
