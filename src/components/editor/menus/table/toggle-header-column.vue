<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '切换表头列'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().toggleHeaderColumn()"
    @button-click="editor?.chain().focus().toggleHeaderColumn().run()"
  >
    <icon name="table-header-column" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >切换表头列</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
