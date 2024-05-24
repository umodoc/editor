<template>
  <editor-menus-button
    ico="code-block"
    text="代码块"
    shortcut="Ctrl+Alt+C"
    huge
    @button-click="editor.chain().focus().setCodeBlock().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
