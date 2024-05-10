<template>
  <editor-menus-button
    :button-active="editor?.isActive('superscript')"
    :disabled="!editor?.can().chain().focus().toggleSuperscript().run()"
    tooltip="上标"
    shortcut="Ctrl+."
    @button-click="editor?.commands.toggleSuperscript()"
  >
    <icon name="superscript" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
