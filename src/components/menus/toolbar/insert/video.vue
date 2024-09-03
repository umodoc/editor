<template>
  <menus-button
    ico="video"
    :text="t('insert.video')"
    huge
    @menu-click="editor.chain().focus().selectFiles('video').run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
