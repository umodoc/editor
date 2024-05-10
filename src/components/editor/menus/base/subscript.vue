<template>
  <editor-menus-button
    :button-active="editor?.isActive('subscript')"
    :disabled="!editor?.can().chain().focus().toggleSubscript().run()"
    tooltip="下标"
    shortcut="Ctrl+,"
    @button-click="editor?.commands.toggleSubscript()"
  >
    <icon name="subscript" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
