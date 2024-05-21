<template>
  <editor-menus-button
    huge-button
    @button-click="editor.chain().focus().selectFiles('file').run()"
  >
    <icon name="file" />
    <template #text>
      <p class="button-text">文件</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
