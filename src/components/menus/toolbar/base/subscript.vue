<template>
  <menus-button
    ico="subscript"
    :text="t('base.subscript')"
    shortcut="Ctrl+,"
    hide-text
    :menu-active="editor?.isActive('subscript')"
    :disabled="!editor?.can().chain().focus().toggleSubscript().run()"
    @menu-click="editor?.commands.toggleSubscript()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
