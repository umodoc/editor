<template>
  <menus-button
    ico="page-break"
    :text="t('page.break')"
    shortcut="Ctrl+Enter"
    huge
    @menu-click="setPageBreak"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')

const setPageBreak = () => {
  editor.value?.chain().focus().setPageBreak().run()
}
</script>
