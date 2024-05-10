<template>
  <editor-menus-button
    huge-button
    @button-click="editor?.chain().focus().addTableOfContents().run()"
  >
    <icon name="toc" />
    <template #text>
      <p class="button-text">页面大纲</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
