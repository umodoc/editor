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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
