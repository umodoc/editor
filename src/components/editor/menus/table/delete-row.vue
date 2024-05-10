<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '删除行'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().deleteRow()"
    @button-click="editor?.chain().focus().deleteRow().run()"
  >
    <icon name="table-delete-row" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text">删除行</span>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
