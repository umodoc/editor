<template>
  <menus-button
    ico="mention"
    :text="t('insert.mention')"
    huge
    @menu-click="editor?.chain().focus().insertMention().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
