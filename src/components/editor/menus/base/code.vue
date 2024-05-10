<template>
  <editor-menus-button
    :button-active="editor?.isActive('code')"
    :disabled="!editor?.can().chain().focus().toggleCode().run()"
    tooltip="代码"
    shortcut="Ctrl+E"
    @button-click="editor?.chain().focus().toggleCode().run()"
  >
    <icon name="code" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
