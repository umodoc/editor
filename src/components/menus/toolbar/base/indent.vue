<template>
  <menus-button
    :text="t('base.indent')"
    ico="indent"
    shortcut="Tab"
    hide-text
    @menu-click="editor?.chain().focus().indent().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
