<template>
  <menus-button
    :text="t('print.text')"
    ico="print"
    shortcut="Ctrl+P"
    :disabled="editor?.isEmpty"
    huge
    @menu-click="printing = true"
  >
  </menus-button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor, printing } = useStore()
</script>

<style lang="less" scoped></style>
