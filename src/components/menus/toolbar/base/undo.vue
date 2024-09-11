<template>
  <menus-button
    ico="undo"
    :text="t('base.undo')"
    shortcut="Ctrl+Z"
    hide-text
    :disabled="!editor?.can().chain().focus().undo().run()"
    @menu-click="editor?.chain().focus().undo().run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
