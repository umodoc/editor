<template>
  <menus-button
    ico="table-header-cell"
    :text="t('table.toggleHeaderCell')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().toggleHeaderCell()"
    @menu-click="editor?.chain().focus().toggleHeaderCell().run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
