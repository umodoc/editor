<template>
  <menus-button
    ico="zoom-1"
    :text="t('view.zoomOriginal')"
    huge
    shortcut="Ctrl+1"
    :menu-active="page.zoomLevel === 100"
    @menu-click="page.zoomLevel = 100"
  />
</template>

<script setup>
const page = inject('page')
</script>
