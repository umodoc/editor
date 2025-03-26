<template>
  <menus-button
    ico="image"
    :text="t('insert.image')"
    huge
    @menu-click="
      editor
        ?.chain()
        .focus()
        .selectFiles('image', container, uploadFileMap)
        .run()
    "
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')
</script>
