<template>
  <menus-button
    ico="table-add-row-after"
    text="插入行(前)"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addRowBefore()"
    @menu-click="editor?.chain().focus().addRowBefore().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
