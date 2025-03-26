<template>
  <menus-button
    ico="file"
    :text="t('insert.file')"
    huge
    @menu-click="
      editor
        ?.chain()
        .focus()
        .selectFiles('file', container, uploadFileMap)
        .run()
    "
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')
</script>
