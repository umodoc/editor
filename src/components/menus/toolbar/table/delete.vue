<template>
  <menus-button
    ico="table-delete"
    text="删除"
    tooltip="删除当前表格"
    huge
    :disabled="!editor?.can().deleteTable()"
    @menu-click="deleteTable"
  />
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
