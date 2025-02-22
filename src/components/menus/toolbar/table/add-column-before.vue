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
const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)
</script>
