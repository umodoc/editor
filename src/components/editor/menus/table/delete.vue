<template>
  <editor-menus-button
    tooltip="删除当前表格"
    :disabled="!editor?.can().deleteTable()"
    huge-button
    @button-click="editor?.chain().focus().deleteTable().run()"
  >
    <icon name="table-delete" />
    <template #text>
      <p class="button-text">删除</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
