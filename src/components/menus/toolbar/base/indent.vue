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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
