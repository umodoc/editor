<template>
  <editor-menus-button
    ico="table-fix"
    text="修复"
    tooltip="当表格有错乱时，点击此按钮可自动修复表格"
    huge
    :disabled="!editor?.can().fixTables()"
    @button-click="editor?.chain().focus().fixTables().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
