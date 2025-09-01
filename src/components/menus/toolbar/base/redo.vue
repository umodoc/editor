<template>
  <menus-button
    ico="redo"
    :text="t('base.redo')"
    shortcut="Ctrl+Y / Ctrl+Shift+Z"
    hide-text
    :disabled="historyRecords.undone.length === 0"
    @menu-click="menuClick"
  />
</template>

<script setup lang="ts">
/* 重做*/
import { redoHistoryRecord } from '@/utils/history-record'
const editor = inject('editor')
const historyRecords = inject('historyRecords')
const pageOptions = inject('page')

const menuClick = () => {
  redoHistoryRecord(historyRecords, function (record) {
    if (record?.type === 'editor') {
      editor?.value?.chain().focus().redo().run()
    } else if (record?.type === 'page' && record?.proType) {
      //  恢复
      if (pageOptions?.value && record.newData !== undefined) {
        pageOptions.value[record.proType] = record.newData
      }
    }
  })
}
</script>
