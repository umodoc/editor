<template>
  <menus-button
    ico="node-delete"
    :text="t('bubbleMenu.delete')"
    shortcut="Backspace"
    @menu-click="editor?.chain().focus().deleteSelectionNode().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
