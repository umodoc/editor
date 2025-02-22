<template>
  <menus-button
    ico="outdent"
    :text="t('base.outdent')"
    shortcut="Shift+Tab"
    hide-text
    @menu-click="editor?.chain().focus().outdent().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
