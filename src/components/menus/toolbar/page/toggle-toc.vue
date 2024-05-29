<template>
  <menus-button
    ico="toc"
    text="显示大纲"
    huge
    :menu-active="page.showToc"
    @button-click="page.showToc = !page.showToc"
  />
</template>

<script setup>
const { page } = useStore()
</script>
