<template>
  <menus-button
    ico="image"
    :text="t('insert.image')"
    huge
    @menu-click="editor.chain().focus().selectFiles('image').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
