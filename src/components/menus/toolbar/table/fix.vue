<template>
  <menus-button
    ico="table-fix"
    :text="t('table.fix.text')"
    :tooltip="t('table.fix.tip')"
    huge
    :disabled="!editor?.isActive('table')"
    @menu-click="editor?.chain().focus().fixTables().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
