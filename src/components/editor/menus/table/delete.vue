<template>
  <editor-menus-button
    tooltip="删除当前表格"
    :disabled="!editor?.can().deleteTable()"
    huge-button
    @button-click="deleteTable"
  >
    <icon name="table-delete" />
    <template #text>
      <p class="button-text">删除</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const deleteTable = () => {
  const dialog = useConfirm({
    theme: 'danger',
    header: '信息提醒',
    body: '此操作会删除当前选中的表格，是否继续？',
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    onConfirm() {
      editor.value?.chain().focus().deleteTable().run()
      useMessage('success', '删除成功')
      dialog.destroy()
    },
  })
}
</script>
