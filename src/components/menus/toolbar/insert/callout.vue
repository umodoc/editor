<template>
  <menus-button
    ico="callout"
    :text="t('insert.callout')"
    huge
    @menu-click="editor?.chain().focus().insertCallout().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
