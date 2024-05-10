<template>
  <editor-menus-button
    :button-active="editor?.isActive({ textAlign: 'justify' })"
    :disabled="!editor?.can().chain().focus().setTextAlign('justify').run()"
    tooltip="两端对齐"
    shortcut="Ctrl+Shift+J"
    @button-click="editor?.chain().focus().setTextAlign('justify').run()"
  >
    <icon name="align-justify" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
