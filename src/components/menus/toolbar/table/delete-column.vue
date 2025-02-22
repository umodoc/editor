<template>
  <menus-button
    ico="table-delete-column"
    :text="t('table.deleteColumn.text')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().deleteColumn()"
    @menu-click="deleteColumn"
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)

const deleteColumn = () => {
  const dialog = useConfirm({
    attach: container,
    theme: 'danger',
    header: t('table.deleteColumn.title'),
    body: t('table.deleteColumn.message'),
    confirmBtn: {
      theme: 'danger',
      content: t('table.deleteColumn.delete'),
    },
    onConfirm() {
      editor.value?.chain().focus().deleteColumn().run()
      useMessage('success', {
        attach: container,
        content: t('table.deleteColumn.success'),
      })
      dialog.destroy()
    },
  })
}
</script>
