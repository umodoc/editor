<template>
  <menus-button
    ico="redo"
    :text="t('base.redo')"
    shortcut="Ctrl+Y / Ctrl+Shift+Z"
    hide-text
    :disabled="!editor?.can().chain().focus().redo().run()"
    @menu-click="editor?.chain().focus().redo().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
