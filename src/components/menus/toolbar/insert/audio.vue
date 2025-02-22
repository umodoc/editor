<template>
  <menus-button
    ico="audio"
    :text="t('insert.audio')"
    huge
    @menu-click="
      editor?.chain().focus().selectFiles('audio', container, true).run()
    "
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
</script>
