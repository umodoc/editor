<template>
  <menus-button
    :text="t('base.align.center')"
    ico="align-center"
    shortcut="Ctrl+Shift+E"
    hide-text
    :menu-active="
      editor?.isActive({ textAlign: 'center' }) ||
      editor?.isActive({ nodeAlign: 'center' })
    "
    :disabled="
      !editor?.can().chain().focus().setTextAlign('center').run() &&
      !editor?.can().chain().focus().setNodeAlign('center').run()
    "
    @menu-click="setAlignCenter"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')

const setAlignCenter = () => {
  if (editor.value?.can().chain().focus().setTextAlign('center').run()) {
    editor.value.chain().focus().setTextAlign('center').run()
  }
  if (editor.value?.can().chain().focus().setNodeAlign('center').run()) {
    editor.value.chain().focus().setNodeAlign('center').run()
  }
}
</script>
