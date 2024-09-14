<template>
  <menus-button
    ico="table-delete"
    :text="t('table.delete.text')"
    huge
    :disabled="!editor?.can().deleteTable()"
    @menu-click="deleteTable"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()

const deleteTable = () => {
  const dialog = useConfirm({
    theme: 'danger',
    header: t('table.delete.title'),
    body: t('table.delete.message'),
    confirmBtn: {
      theme: 'danger',
      content: t('table.delete.delete'),
    },
    onConfirm() {
      editor.value?.chain().focus().deleteTable().run()
      useMessage('success', t('table.delete.success'))
      dialog.destroy()
    },
  })
}
</script>
