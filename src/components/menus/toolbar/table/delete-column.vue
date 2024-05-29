<template>
  <menus-button
    ico="table-delete-column"
    text="删除列"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().deleteColumn()"
    @button-click="deleteColumn"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')

const deleteColumn = () => {
  const dialog = useConfirm({
    theme: 'danger',
    header: '信息提醒',
    body: '此操作会删除当前选中的表格列，是否继续？',
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    onConfirm() {
      editor.value?.chain().focus().deleteColumn().run()
      useMessage('success', '删除成功')
      dialog.destroy()
    },
  })
}
</script>
