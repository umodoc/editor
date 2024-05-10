<template>
  <editor-menus-button
    :button-active="
      editor?.isActive({ textAlign: 'center' }) ||
      editor?.isActive({ nodeAlign: 'center' })
    "
    :disabled="
      !editor?.can().chain().focus().setTextAlign('center').run() &&
      !editor?.can().chain().focus().setNodeAlign('center').run()
    "
    tooltip="居中对齐"
    shortcut="Ctrl+Shift+E"
    @button-click="setAlignCenter"
  >
    <icon name="align-center" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const setAlignCenter = () => {
  if (editor.value?.can().chain().focus().setTextAlign('center').run()) {
    editor.value?.chain().focus().setTextAlign('center').run()
  }
  if (editor.value?.can().chain().focus().setNodeAlign('center').run()) {
    editor.value?.chain().focus().setNodeAlign('center').run()
  }
}
</script>
