<template>
  <editor-menus-button
    shortcut="Ctrl+F"
    huge-button
    @button-click="searchReplace = true"
  >
    <icon name="search-replace" />
    <template #text>
      <p class="button-text">查找替换</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { searchReplace } = useStore()
</script>
