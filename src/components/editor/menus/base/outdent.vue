<template>
  <editor-menus-button
    tooltip="减少缩进"
    shortcut="Shift+Tab"
    @button-click="editor?.chain().focus().outdent().run()"
  >
    <icon name="outdent" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
