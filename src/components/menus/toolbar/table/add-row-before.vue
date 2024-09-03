<template>
  <menus-button
    ico="table-add-row-after"
    :text="t('table.addRowBefore')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addRowBefore()"
    @menu-click="editor?.chain().focus().addRowBefore().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
