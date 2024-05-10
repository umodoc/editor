<template>
  <editor-menus-button
    button-type="dropdown"
    tooltip="单元格对齐方式"
    :huge-button="hugeButton"
    :select-options="alignments"
    :disabled="!editor?.can().setCellAttribute('align')"
    @change="setCellsAlign"
  >
    <icon name="table-cells-align" :size="hugeButton ? '1em' : '18px'" />
    <template #text>
      <p class="button-text">对齐方式</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { hugeButton } = defineProps({
  hugeButton: {
    type: Boolean,
    default: true,
  },
})

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
