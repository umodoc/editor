<template>
  <menus-button
    ico="audio"
    :text="t('insert.audio')"
    huge
    @menu-click="editor.chain().focus().selectFiles('audio').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
