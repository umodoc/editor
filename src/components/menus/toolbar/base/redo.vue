<template>
  <menus-button
    ico="redo"
    :text="t('base.redo')"
    shortcut="Ctrl+Y / Ctrl+Shift+Z"
    hide-text
    :disabled="historyRecords.undone.length === 0"
    @menu-click="menuClick"
  />
</template>

<script setup lang="ts">
/* 重做*/
const historyRecords = inject('historyRecords')

const menuClick = inject('redoHistory') as () => void
</script>
