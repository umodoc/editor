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
const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)

const deleteRow = () => {
  const dialog = useConfirm({
    attach: container,
    theme: 'danger',
    header: t('table.deleteRow.title'),
    body: t('table.deleteRow.message'),
    confirmBtn: {
      theme: 'danger',
      content: t('table.deleteRow.delete'),
    },
    onConfirm() {
      editor.value?.chain().focus().deleteRow().run()
      useMessage('success', {
        attach: container,
        content: t('table.deleteRow.success'),
      })
      dialog.destroy()
    },
  })
}
</script>
