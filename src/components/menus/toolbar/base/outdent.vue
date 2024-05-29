<template>
  <menus-button
    ico="outdent"
    text="减少缩进"
    shortcut="Shift+Tab"
    hide-text
    @button-click="editor?.chain().focus().outdent().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
