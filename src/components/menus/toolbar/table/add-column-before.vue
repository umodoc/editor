<template>
  <menus-button
    ico="table-add-column-before"
    :text="t('table.addColumnBefore')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addColumnBefore()"
    @menu-click="editor?.chain().focus().addColumnBefore().run()"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
