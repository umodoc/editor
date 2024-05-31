<template>
  <menus-button
    ico="toc"
    text="显示大纲"
    huge
    :menu-active="page.showToc"
    @menu-click="page.showToc = !page.showToc"
  />
</template>

<script setup>
const { page } = useStore()
</script>
