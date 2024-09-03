<template>
  <menus-button
    ico="text-box"
    :text="t('insert.textBox')"
    huge
    @menu-click="editor?.chain().focus().setTextBox().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
