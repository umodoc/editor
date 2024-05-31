<template>
  <menus-button
    ico="align-justify"
    text="两端对齐"
    shortcut="Ctrl+Shift+J"
    hide-text
    :menu-active="editor?.isActive({ textAlign: 'justify' })"
    :disabled="!editor?.can().chain().focus().setTextAlign('justify').run()"
    @menu-click="editor?.chain().focus().setTextAlign('justify').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
