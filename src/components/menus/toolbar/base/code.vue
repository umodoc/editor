<template>
  <menus-button
    ico="code"
    text="代码"
    shortcut="Ctrl+E"
    hide-text
    :menu-active="editor?.isActive('code')"
    :disabled="!editor?.can().chain().focus().toggleCode().run()"
    @button-click="editor?.chain().focus().toggleCode().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
