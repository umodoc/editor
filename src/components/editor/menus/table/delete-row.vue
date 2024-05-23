<template>
  <editor-menus-button
    :tooltip="$toolbar.mode === 'ribbon' ? '' : '删除行'"
    :class="{ 'width-auto': $toolbar.mode === 'ribbon' }"
    :disabled="!editor?.can().deleteRow()"
    @button-click="deleteRow"
  >
    <icon name="table-delete-row" />
    <span v-if="$toolbar.mode === 'ribbon'" class="button-text">删除行</span>
  </editor-menus-button>
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
