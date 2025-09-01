<template>
  <menus-button
    ico="undo"
    :text="t('base.undo')"
    shortcut="Ctrl+Z"
    hide-text
    :disabled="historyRecords.done.length === 0"
    @menu-click="menuClick"
  />
</template>

<script setup lang="ts">
import { undoHistoryRecord } from '@/utils/history-record'
const editor = inject('editor')
const historyRecords = inject('historyRecords')
const pageOptions = inject('page')
// editor?.chain().focus().undo().run()
const menuClick = () => {
  // 此时要从done 里面搬运一条数据到undone里面
  undoHistoryRecord(historyRecords, function (record) {
    if (record?.type === 'editor') {
      editor?.value?.chain().focus().undo().run()
    } else if (record?.type === 'page' && record?.proType) {
      // 撤销
      if (pageOptions?.value && record.oldData !== undefined) {
        pageOptions.value[record.proType] = record.oldData
      }
    }
  })
}
</script>
