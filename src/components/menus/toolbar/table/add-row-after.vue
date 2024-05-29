<template>
  <menus-button
    ico="table-add-row-after"
    text="插入行(后)"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addRowAfter()"
    @button-click="editor?.chain().focus().addRowAfter().run()"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
