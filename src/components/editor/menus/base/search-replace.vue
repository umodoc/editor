<template>
  <editor-menus-button
    ico="search-replace"
    text="查找替换"
    shortcut="Ctrl+F"
    huge
    @button-click="searchReplace = true"
  />
</template>

<script setup>
const { searchReplace } = useStore()
</script>
