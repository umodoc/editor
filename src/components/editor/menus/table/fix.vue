<template>
  <editor-menus-button
    tooltip="当表格有错乱时，点击此按钮可自动修复表格"
    class="width-auto"
    huge-button
    :disabled="!editor?.can().fixTables()"
    @button-click="editor?.chain().focus().fixTables().run()"
  >
    <icon name="table-fix" />
    <template #text>
      <p class="button-text">修复</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
