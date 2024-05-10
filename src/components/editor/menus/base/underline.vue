<template>
  <editor-menus-button
    :button-active="editor?.isActive('underline')"
    :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
    tooltip="下划线"
    shortcut="Ctrl+U"
    @button-click="editor?.chain().focus().toggleUnderline().run()"
  >
    <icon name="underline" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
