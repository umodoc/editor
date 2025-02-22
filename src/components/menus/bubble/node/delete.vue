<template>
  <menus-button
    ico="node-delete"
    :text="t('bubbleMenu.delete')"
    shortcut="Backspace"
    @menu-click="editor?.chain().focus().deleteSelectionNode().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
