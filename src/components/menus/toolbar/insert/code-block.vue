<template>
  <menus-button
    ico="code-block"
    :text="t('insert.codeBlock')"
    shortcut="Ctrl+Alt+C"
    huge
    @menu-click="editor.chain().focus().setCodeBlock().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
