<template>
  <menus-button
    ico="video"
    :text="t('insert.video')"
    huge
    @menu-click="editor.chain().focus().selectFiles('video').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
