<template>
  <menus-button
    ico="clear-format"
    :text="t('base.clearFormat')"
    hide-text
    @menu-click="editor?.chain().focus().unsetAllMarks().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
