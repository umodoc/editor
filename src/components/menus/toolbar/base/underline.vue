<template>
  <menus-button
    ico="underline"
    :text="t('base.underline')"
    shortcut="Ctrl+U"
    hide-text
    :menu-active="editor?.isActive('underline')"
    :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
    @menu-click="editor?.chain().focus().toggleUnderline().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
