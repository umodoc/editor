<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '插入列(右)'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().addColumnAfter()"
    @button-click="editor?.chain().focus().addColumnAfter().run()"
  >
    <icon name="table-add-column-after" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text"
      >插入列(右)</span
    >
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')
</script>
