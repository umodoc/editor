<template>
  <menus-button
    ico="video"
    text="视频"
    huge
    @menu-click="editor.chain().focus().selectFiles('video').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
