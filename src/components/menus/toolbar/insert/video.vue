<template>
  <menus-button
    ico="video"
    :text="t('insert.video')"
    huge
    @menu-click="
      editor?.chain().focus().selectFiles('video', container, true).run()
    "
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
</script>
