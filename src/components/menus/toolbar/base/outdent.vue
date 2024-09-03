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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
