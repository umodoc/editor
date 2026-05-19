<template>
  <menus-button
    ico="details"
    :text="t('insert.details')"
    huge
    @menu-click="editor?.chain().focus().setDetails().run()"
  />
</template>
<script setup>
const editor = inject('editor')
</script>

<style lang="scss" scoped>
.bookmark-list {
  border: solid 1px var(--umo-border-color-dark);
  border-radius: var(--umo-radius);
  margin-bottom: 5px;
  overflow: hidden;
  :deep(table) {
    th,
    td,
    tr {
      border: none !important;
      padding: 4px 10px;
    }
    th {
      border-bottom: solid 1px var(--umo-border-color) !important;
    }
  }
}
</style>
