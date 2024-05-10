<template>
  <editor-menus-button
    huge-button
    @button-click="editor?.chain().focus().setTextBox().run()"
  >
    <icon name="text-box" />
    <template #text>
      <p class="button-text">文本框</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
