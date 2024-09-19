<template>
  <menus-button
    ico="video"
    :text="t('insert.video')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('video', true).run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
</script>
