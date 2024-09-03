<template>
  <menus-button
    ico="image"
    :text="t('insert.image')"
    huge
    @menu-click="editor.chain().focus().selectFiles('image').run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
