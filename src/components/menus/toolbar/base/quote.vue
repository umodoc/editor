<template>
  <menus-button
    :text="t('base.quote')"
    ico="quote"
    shortcut="Ctrl+Shift+B"
    hide-text
    :menu-active="editor?.isActive('blockquote')"
    :disabled="!editor?.can().chain().focus().toggleBlockquote().run()"
    @menu-click="editor?.chain().focus().toggleBlockquote().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
