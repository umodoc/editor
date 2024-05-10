<template>
  <editor-menus-button
    :button-active="editor?.isActive('blockquote')"
    :disabled="!editor?.can().chain().focus().toggleBlockquote().run()"
    tooltip="引用"
    shortcut="Ctrl+Shift+B"
    @button-click="editor?.chain().focus().toggleBlockquote().run()"
  >
    <icon name="quote" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
