<template>
  <menus-button
    ico="bold"
    :text="t('base.bold')"
    shortcut="Ctrl+B"
    hide-text
    :menu-active="editor?.isActive('bold')"
    :disabled="!editor?.can().chain().focus().toggleBold().run()"
    @menu-click="editor?.chain().focus().toggleBold().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
