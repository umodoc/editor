<template>
  <menus-button
    ico="page-break"
    text="插入分页"
    shortcut="Ctrl+Enter"
    huge
    @button-click="setPageBreak"
  />
</template>

<script setup>
const { editor } = useStore()

const setPageBreak = () => {
  editor.value?.chain().focus().setPageBreak().run()
}
</script>
