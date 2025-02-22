<template>
  <menus-button
    ico="table-add-row-after"
    :text="t('table.addRowAfter')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addRowAfter()"
    @menu-click="editor?.chain().focus().addRowAfter().run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)
</script>
