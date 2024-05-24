<template>
  <editor-menus-button
    ico="strike"
    text="删除线"
    shortcut="Ctrl+Shift+X"
    hide-text
    :menu-active="editor?.isActive('strike')"
    :disabled="!editor?.can().chain().focus().toggleStrike().run()"
    @button-click="editor?.chain().focus().toggleStrike().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
