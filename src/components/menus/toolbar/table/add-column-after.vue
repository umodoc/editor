<template>
  <menus-button
    ico="table-add-column-after"
    :text="t('table.addColumnAfter')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addColumnAfter()"
    @menu-click="editor?.chain().focus().addColumnAfter().run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
