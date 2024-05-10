<template>
  <editor-menus-button
    tooltip="下一个单元格"
    shortcut="Tab"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().goToNextCell()"
    @button-click="editor?.chain().focus().goToNextCell().run()"
  >
    <icon name="table-next-cell" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >下一个单元格</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
