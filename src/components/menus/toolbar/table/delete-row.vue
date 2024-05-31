<template>
  <menus-button
    ico="table-delete-row"
    text="删除行"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().deleteRow()"
    @menu-click="deleteRow"
  />
</template>

<script setup>
const { editor } = useStore()
const $toolbar = useState('toolbar')

const deleteRow = () => {
  const dialog = useConfirm({
    theme: 'danger',
    header: '信息提醒',
    body: '此操作会删除当前选中的表格行，是否继续？',
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    onConfirm() {
      editor.value?.chain().focus().deleteRow().run()
      useMessage('success', '删除成功')
      dialog.destroy()
    },
  })
}
</script>
