<template>
  <menus-button
    ico="table-merge-cell"
    text="合并单元格"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().mergeCells()"
    @menu-click="editor?.chain().focus().mergeCells().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
