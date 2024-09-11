<template>
  <menus-button
    ico="toc"
    :text="t('insert.toc')"
    huge
    @menu-click="editor?.chain().focus().addTableOfContents().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
