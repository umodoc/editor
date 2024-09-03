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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
