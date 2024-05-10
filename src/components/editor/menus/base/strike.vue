<template>
  <editor-menus-button
    :button-active="editor?.isActive('strike')"
    :disabled="!editor?.can().chain().focus().toggleStrike().run()"
    tooltip="删除线"
    shortcut="Ctrl+Shift+X"
    @button-click="editor?.chain().focus().toggleStrike().run()"
  >
    <icon name="strike" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
