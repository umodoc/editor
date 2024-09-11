<template>
  <menus-button
    ico="search-replace"
    :text="t('search.text')"
    shortcut="Ctrl+F"
    huge
    @menu-click="searchReplace = true"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { searchReplace } = useStore()
</script>
