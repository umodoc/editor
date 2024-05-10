<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '切换表头行'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().toggleHeaderRow()"
    @button-click="editor?.chain().focus().toggleHeaderRow().run()"
  >
    <icon name="table-header-row" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >切换表头行</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
