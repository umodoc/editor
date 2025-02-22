<template>
  <menus-button
    ico="table-cells-align"
    :text="t('table.cellAlign.text')"
    :tooltip="t('table.cellAlign.tip')"
    menu-type="dropdown"
    huge
    :select-options="alignments"
    :disabled="!editor?.can().setCellAttribute('align', '')"
    @click="setCellsAlign"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')

const alignments = [
  { content: t('table.cellAlign.lt'), value: 'left-top' },
  { content: t('table.cellAlign.ct'), value: 'center-top' },
  { content: t('table.cellAlign.rt'), value: 'right-top' },
  { content: t('table.cellAlign.jt'), value: 'justify-top', divider: true },
  { content: t('table.cellAlign.lm'), value: 'left-middle' },
  { content: t('table.cellAlign.cm'), value: 'center-middle' },
  { content: t('table.cellAlign.rm'), value: 'right-middle' },
  { content: t('table.cellAlign.jm'), value: 'justify-middle', divider: true },
  { content: t('table.cellAlign.lb'), value: 'left-bottom' },
  { content: t('table.cellAlign.cb'), value: 'center-bottom' },
  { content: t('table.cellAlign.rb'), value: 'right-bottom' },
  { content: t('table.cellAlign.jb'), value: 'justify-bottom' },
]

const setCellsAlign = ({ value }: { value: string }) => {
  if (!value) {
    return
  }
  editor.value?.chain().focus().setCellAttribute('align', value).run()
}
</script>
