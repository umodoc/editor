<template>
  <editor-menus-button
    :button-active="editor?.isActive({ textAlign: 'distributed' })"
    :disabled="!editor?.can().chain().focus().setTextAlign('distributed').run()"
    tooltip="分散对齐"
    shortcut="Ctrl+Shift+D"
    @button-click="editor?.chain().focus().setTextAlign('distributed').run()"
  >
    <icon name="align-distributed" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
