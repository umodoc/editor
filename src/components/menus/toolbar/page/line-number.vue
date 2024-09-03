<template>
  <menus-button
    ico="line-number"
    :text="t('page.lineNumber')"
    :menu-active="page.showLineNumber"
    huge
    @menu-click="page.showLineNumber = !page.showLineNumber"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { page } = useStore()
</script>
