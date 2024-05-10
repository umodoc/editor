<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '插入行(前)'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().addRowBefore()"
    @button-click="editor?.chain().focus().addRowBefore().run()"
  >
    <icon name="table-add-row-before" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >插入行(前)</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
