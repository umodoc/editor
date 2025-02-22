<template>
  <menus-button
    ico="code"
    :text="t('base.code')"
    shortcut="Ctrl+E"
    hide-text
    :menu-active="editor?.isActive('code')"
    :disabled="!editor?.can().chain().focus().toggleCode().run()"
    @menu-click="editor?.chain().focus().toggleCode().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
