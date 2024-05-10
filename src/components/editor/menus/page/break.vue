<template>
  <editor-menus-button
    shortcut="Ctrl+Enter"
    huge-button
    @button-click="setPageBreak"
  >
    <icon name="page-break" />
    <template #text>
      <p class="button-text">插入分页</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const setPageBreak = () => {
  editor.value?.chain().focus().setPageBreak().run()
}
</script>
