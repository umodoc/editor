<template>
  <editor-menus-button
    huge-button
    @button-click="editor.chain().focus().selectFiles('image').run()"
  >
    <icon name="image" />
    <template #text>
      <p class="button-text">图片</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
