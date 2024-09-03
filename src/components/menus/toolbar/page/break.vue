<template>
  <menus-button
    ico="page-break"
    :text="t('page.break')"
    shortcut="Ctrl+Enter"
    huge
    @menu-click="setPageBreak"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()

const setPageBreak = () => {
  editor.value?.chain().focus().setPageBreak().run()
}
</script>
