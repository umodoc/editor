<template>
  <menus-button
    :text="t('base.italic')"
    ico="italic"
    shortcut="Ctrl+I"
    hide-text
    :menu-active="editor?.isActive('italic')"
    :disabled="!editor?.can().chain().focus().toggleItalic().run()"
    @menu-click="editor?.chain().focus().toggleItalic().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
