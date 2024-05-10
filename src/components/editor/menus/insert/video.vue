<template>
  <editor-menus-button
    huge-button
    @button-click="editor.chain().focus().selectFiles('video').run()"
  >
    <icon name="video" />
    <template #text>
      <p class="button-text">视频</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
