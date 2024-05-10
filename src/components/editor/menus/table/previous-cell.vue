<template>
  <editor-menus-button
    tooltip="上一个单元格"
    shortcut="Shift+Tab"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().goToPreviousCell()"
    @button-click="editor?.chain().focus().goToPreviousCell().run()"
  >
    <icon name="table-previous-cell" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >上一个单元格</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
