<template>
  <menus-button
    ico="toc"
    :text="t('insert.toc')"
    huge
    @menu-click="editor?.chain().focus().addTableOfContents().run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
