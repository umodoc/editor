<template>
  <menus-button
    ico="underline"
    text="下划线"
    shortcut="Ctrl+U"
    hide-text
    :menu-active="editor?.isActive('underline')"
    :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
    @button-click="editor?.chain().focus().toggleUnderline().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
