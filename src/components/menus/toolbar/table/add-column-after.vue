<template>
  <menus-button
    ico="table-add-column-after"
    text="插入列(右)"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addColumnAfter()"
    @button-click="editor?.chain().focus().addColumnAfter().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
