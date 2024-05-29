<template>
  <menus-button
    ico="table-cells-align"
    text="对齐方式"
    tooltip="单元格对齐方式"
    menu-type="dropdown"
    huge
    :select-options="alignments"
    :disabled="!editor?.can().setCellAttribute('align')"
    @change="setCellsAlign"
  />
</template>

<script setup>
const { editor } = useStore()

const alignments = [
  { content: '靠上左对齐', value: 'left-top' },
  { content: '靠上居中对齐', value: 'center-top' },
  { content: '靠上右对齐', value: 'right-top' },
  { content: '靠上两端对齐', value: 'justify-top', divider: true },
  { content: '中间左对齐', value: 'left-middle' },
  { content: '中间对齐', value: 'center-middle' },
  { content: '中间右对齐', value: 'right-middle' },
  { content: '中间两端对齐', value: 'justify-middle', divider: true },
  { content: '靠下左对齐', value: 'left-bottom' },
  { content: '靠下居中对齐', value: 'center-bottom' },
  { content: '靠下右对齐', value: 'right-bottom' },
  { content: '靠下两端对齐', value: 'justify-bottom' },
]

const setCellsAlign = ({ value }) => {
  editor.value?.chain().focus().setCellAttribute('align', value).run()
}
</script>
