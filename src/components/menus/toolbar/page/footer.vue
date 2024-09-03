<template>
  <menus-button
    ico="page-footer"
    :text="page.footer ? t('page.footer.hide') : t('page.footer.show')"
    huge
    @menu-click="page.footer = !page.footer"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { page } = useStore()
</script>
