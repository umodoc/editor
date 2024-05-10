<template>
  <editor-menus-button
    :button-active="
      editor?.isActive({ textAlign: 'right' }) ||
      editor?.isActive({ nodeAlign: 'flex-end' })
    "
    :disabled="
      !editor?.can().chain().focus().setTextAlign('right').run() &&
      !editor?.can().chain().focus().setNodeAlign('flex-end').run()
    "
    tooltip="右对齐"
    shortcut="Ctrl+Shift+R"
    @button-click="setAlignRight"
  >
    <icon name="align-right" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const setAlignRight = () => {
  if (editor.value?.can().chain().focus().setTextAlign('right').run()) {
    editor.value?.chain().focus().setTextAlign('right').run()
  }
  if (editor.value?.can().chain().focus().setNodeAlign('flex-end').run()) {
    editor.value?.chain().focus().setNodeAlign('flex-end').run()
  }
}
</script>
