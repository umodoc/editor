<template>
  <menus-button
    ico="table-header-row"
    text="切换表头行"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().toggleHeaderRow()"
    @menu-click="editor?.chain().focus().toggleHeaderRow().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
