<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '切换表头单元格'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().toggleHeaderCell()"
    @button-click="editor?.chain().focus().toggleHeaderCell().run()"
  >
    <icon name="table-header-cell" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >切换表头单元格</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
