<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '插入行(后)'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().addRowAfter()"
    @button-click="editor?.chain().focus().addRowAfter().run()"
  >
    <icon name="table-add-row-after" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >插入行(后)</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
