<template>
  <menus-button
    ico="file"
    :text="t('insert.file')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('file').run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
