<template>
  <menus-button
    ico="align-distributed"
    :text="t('base.align.distributed')"
    shortcut="Ctrl+Shift+D"
    hide-text
    :menu-active="editor?.isActive({ textAlign: 'distributed' })"
    :disabled="!editor?.can().chain().focus().setTextAlign('distributed').run()"
    @menu-click="editor?.chain().focus().setTextAlign('distributed').run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
