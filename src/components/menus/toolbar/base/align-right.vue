<template>
  <menus-button
    ico="align-right"
    text="右对齐"
    shortcut="Ctrl+Shift+R"
    hide-text
    :menu-active="
      editor?.isActive({ textAlign: 'right' }) ||
      editor?.isActive({ nodeAlign: 'flex-end' })
    "
    :disabled="
      !editor?.can().chain().focus().setTextAlign('right').run() &&
      !editor?.can().chain().focus().setNodeAlign('flex-end').run()
    "
    @button-click="setAlignRight"
  />
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
