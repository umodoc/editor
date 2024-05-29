<template>
  <menus-button
    ico="table-split-cell"
    text="拆分单元格"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().splitCell()"
    @button-click="editor?.chain().focus().splitCell().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
