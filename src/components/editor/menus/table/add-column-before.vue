<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '插入列(左)'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().addColumnBefore()"
    @button-click="editor?.chain().focus().addColumnBefore().run()"
  >
    <icon name="table-add-column-before" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >插入列(左)</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
