<template>
  <menus-button
    v-if="page.preview"
    ico="preview"
    :text="t('page.preview')"
    shortcut="F5"
    huge
    :menu-active="page.preview.enabled"
    @menu-click="page.preview.enabled = !page.preview.enabled"
  />
</template>

<script setup lang="ts">
const { page } = useStore()
</script>
