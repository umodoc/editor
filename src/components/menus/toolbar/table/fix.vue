<template>
  <menus-button
    ico="table-fix"
    :text="t('table.fix.text')"
    :tooltip="t('table.fix.tip')"
    huge
    :disabled="!editor?.can().fixTables()"
    @menu-click="editor?.chain().focus().fixTables().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
