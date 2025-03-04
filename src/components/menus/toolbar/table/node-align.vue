<template>
  <menus-button
    ico="table-node-align"
    :text="t('table.nodeAlign.text')"
    menu-type="dropdown"
    huge
    :select-options="alignments"
    @click="setcurNodeAlign"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')

const alignments = [
  { content: t('table.nodeAlign.left'), value: 'flex-start' },
  { content: t('table.nodeAlign.center'), value: 'center' },
  { content: t('table.nodeAlign.right'), value: 'flex-end' },
]
const setcurNodeAlign = ({ value }: { value: string }) => {
  if (!value) {
    return
  }
  editor.value.commands.setNodeAlign(value)
}
</script>
