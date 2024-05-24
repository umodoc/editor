<template>
  <editor-menus-button
    ico="table-header-cell"
    text="切换表头单元格"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().toggleHeaderCell()"
    @button-click="editor?.chain().focus().toggleHeaderCell().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
