<template>
  <menus-button
    ico="table-header-column"
    text="切换表头列"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().toggleHeaderColumn()"
    @menu-click="editor?.chain().focus().toggleHeaderColumn().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
