<template>
  <menus-button
    ico="table-header-column"
    :text="t('table.toggleHeaderColumn')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().toggleHeaderColumn()"
    @menu-click="editor?.chain().focus().toggleHeaderColumn().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)
</script>
