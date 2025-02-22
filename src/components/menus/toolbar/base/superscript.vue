<template>
  <menus-button
    ico="superscript"
    :text="t('base.superscript')"
    shortcut="Ctrl+."
    hide-text
    :menu-active="editor?.isActive('superscript')"
    :disabled="!editor?.can().chain().focus().toggleSuperscript().run()"
    @menu-click="editor?.commands.toggleSuperscript()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
