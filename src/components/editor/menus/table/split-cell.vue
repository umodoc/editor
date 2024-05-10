<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '拆分单元格'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().splitCell()"
    @button-click="editor?.chain().focus().splitCell().run()"
  >
    <icon name="table-split-cell" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >拆分单元格</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
