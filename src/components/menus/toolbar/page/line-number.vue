<template>
  <menus-button
    ico="line-number"
    :text="t('page.lineNumber')"
    :menu-active="page.showLineNumber"
    huge
    @menu-click="page.showLineNumber = !page.showLineNumber"
  />
</template>

<script setup>
const { page } = useStore()
</script>
