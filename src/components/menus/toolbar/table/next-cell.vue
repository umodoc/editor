<template>
  <menus-button
    ico="table-next-cell"
    :text="t('table.nextCell')"
    shortcut="Tab"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().goToNextCell()"
    @menu-click="editor?.chain().focus().goToNextCell().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
