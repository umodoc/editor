<template>
  <menus-button
    ico="file"
    :text="t('insert.file')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('file').run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
