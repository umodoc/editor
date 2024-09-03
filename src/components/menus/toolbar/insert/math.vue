<template>
  <menus-button
    ico="math"
    :text="t('insert.math')"
    huge
    @menu-click="editor.chain().focus().insertContent('$\\LaTeX$').run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
</script>
