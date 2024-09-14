<template>
  <menus-button
    ico="table-previous-cell"
    :text="t('table.prevCell')"
    shortcut="Shift+Tab"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().goToPreviousCell()"
    @menu-click="editor?.chain().focus().goToPreviousCell().run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
