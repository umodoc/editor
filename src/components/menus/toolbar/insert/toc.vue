<template>
  <menus-button
    ico="toc"
    :text="t('insert.toc')"
    huge
    @menu-click="editor?.chain().focus().addTableOfContents().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
