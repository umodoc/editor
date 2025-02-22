<template>
  <menus-button
    ico="subscript"
    :text="t('base.subscript')"
    shortcut="Ctrl+,"
    hide-text
    :menu-active="editor?.isActive('subscript')"
    :disabled="!editor?.can().chain().focus().toggleSubscript().run()"
    @menu-click="editor?.commands.toggleSubscript()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
