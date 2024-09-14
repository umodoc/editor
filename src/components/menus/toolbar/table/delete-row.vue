<template>
  <menus-button
    ico="table-delete-row"
    :text="t('table.deleteRow.text')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().deleteRow()"
    @menu-click="deleteRow"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
const $toolbar = useState('toolbar')

const deleteRow = () => {
  const dialog = useConfirm({
    theme: 'danger',
    header: t('table.deleteRow.title'),
    body: t('table.deleteRow.message'),
    confirmBtn: {
      theme: 'danger',
      content: t('table.deleteRow.delete'),
    },
    onConfirm() {
      editor.value?.chain().focus().deleteRow().run()
      useMessage('success', t('table.deleteRow.success'))
      dialog.destroy()
    },
  })
}
</script>
