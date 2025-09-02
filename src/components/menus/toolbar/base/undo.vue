<template>
  <menus-button
    ico="undo"
    :text="t('base.undo')"
    shortcut="Ctrl+Z"
    hide-text
    :disabled="historyRecords.done.length === 0"
    @menu-click="menuClick"
  />
</template>

<script setup lang="ts">
const historyRecords = inject('historyRecords')
// editor?.chain().focus().undo().run()
const menuClick = inject('undoHistory') as () => void
</script>
