<template>
  <menus-button text="PDF" ico="pdf" huge @menu-click="exportPDF = true" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { exportPDF } = useStore()
</script>

<style lang="less" scoped></style>
