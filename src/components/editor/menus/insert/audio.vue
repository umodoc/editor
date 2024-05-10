<template>
  <editor-menus-button
    huge-button
    @button-click="editor.chain().focus().selectFiles('audio').run()"
  >
    <icon name="audio" />
    <template #text>
      <p class="button-text">音频</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
