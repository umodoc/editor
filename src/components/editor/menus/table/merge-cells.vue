<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '合并单元格'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().mergeCells()"
    @button-click="editor?.chain().focus().mergeCells().run()"
  >
    <icon name="table-merge-cell" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >合并单元格</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
