<template>
  <menus-button ico="mind-map" :text="t('tools.mindMap')" huge />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
