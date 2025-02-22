<template>
  <menus-button
    ico="align-left"
    :text="t('base.align.left')"
    shortcut="Ctrl+Shift+L"
    hide-text
    :menu-active="
      editor?.isActive({ textAlign: 'left' }) ||
      editor?.isActive({ nodeAlign: 'flex-start' })
    "
    :disabled="
      !editor?.can().chain().focus().setTextAlign('left').run() &&
      !editor?.can().chain().focus().setNodeAlign('left').run()
    "
    @menu-click="setAlignLeft"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
const setAlignLeft = () => {
  if (editor.value?.can().chain().focus().setTextAlign('left').run()) {
    editor.value.chain().focus().setTextAlign('left').run()
  }
  if (editor.value?.can().chain().focus().setNodeAlign('flex-start').run()) {
    editor.value.chain().focus().setNodeAlign('flex-start').run()
  }
}
</script>
