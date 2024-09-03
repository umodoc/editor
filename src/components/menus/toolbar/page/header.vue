<template>
  <menus-button
    ico="page-header"
    :text="page.header ? t('page.header.hide') : t('page.header.show')"
    huge
    @menu-click="page.header = !page.header"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { page } = useStore()
</script>
