<template>
  <menus-button
    ico="table-fix"
    :text="t('table.fix.text')"
    :tooltip="t('table.fix.tip')"
    huge
    :disabled="!editor?.can().fixTables()"
    @menu-click="editor?.chain().focus().fixTables().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
