<template>
  <menus-button
    ico="toc"
    :text="t('toc.show')"
    huge
    :menu-active="page.showToc"
    @menu-click="page.showToc = !page.showToc"
  />
</template>

<script setup lang="ts">
const page = inject('page')
</script>
