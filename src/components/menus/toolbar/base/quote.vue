<template>
  <menus-button
    ico="quote"
    text="引用"
    shortcut="Ctrl+Shift+B"
    hide-text
    :menu-active="editor?.isActive('blockquote')"
    :disabled="!editor?.can().chain().focus().toggleBlockquote().run()"
    @button-click="editor?.chain().focus().toggleBlockquote().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
