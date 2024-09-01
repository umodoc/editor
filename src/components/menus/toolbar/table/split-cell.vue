<template>
  <menus-button
    ico="table-split-cell"
    :text="t('table.splitCell')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().splitCell()"
    @menu-click="editor?.chain().focus().splitCell().run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
