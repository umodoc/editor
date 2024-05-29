<template>
  <menus-button
    ico="superscript"
    text="上标"
    shortcut="Ctrl+."
    hide-text
    :menu-active="editor?.isActive('superscript')"
    :disabled="!editor?.can().chain().focus().toggleSuperscript().run()"
    @button-click="editor?.commands.toggleSuperscript()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
