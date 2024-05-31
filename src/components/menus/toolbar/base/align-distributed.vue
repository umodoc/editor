<template>
  <menus-button
    ico="align-distributed"
    text="分散对齐"
    shortcut="Ctrl+Shift+D"
    hide-text
    :menu-active="editor?.isActive({ textAlign: 'distributed' })"
    :disabled="!editor?.can().chain().focus().setTextAlign('distributed').run()"
    @menu-click="editor?.chain().focus().setTextAlign('distributed').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
