<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '删除列'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().deleteColumn()"
    @button-click="editor?.chain().focus().deleteColumn().run()"
  >
    <icon name="table-delete-column" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text">删除列</span>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
