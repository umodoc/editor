<template>
  <menus-button
    ico="search-replace"
    :text="t('search.text')"
    shortcut="Ctrl+F"
    huge
    @menu-click="searchReplace = true"
  />
</template>

<script setup lang="ts">
const searchReplace = inject('searchReplace')
</script>
