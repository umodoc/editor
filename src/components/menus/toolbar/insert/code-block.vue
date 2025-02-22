<template>
  <menus-button
    ico="code-block"
    :text="t('insert.codeBlock')"
    shortcut="Ctrl+Alt+C"
    huge
    @menu-click="editor?.chain().focus().setCodeBlock().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
