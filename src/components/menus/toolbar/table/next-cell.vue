<template>
  <menus-button
    ico="table-next-cell"
    text="下一个单元格"
    shortcut="Tab"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().goToNextCell()"
    @button-click="editor?.chain().focus().goToNextCell().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
