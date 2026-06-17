<!--
 * @Author: wangqz
 * @Date: 2026-06-17
 * @LastEditTime: 2026-06-17
 * @Description: content
-->
<template>
  <menus-button ico="file-json" text="JSON" huge @menu-click="saveJSONFile" />
</template>

<script setup>
import { saveAs } from 'file-saver'

const editor = inject('editor')
const options = inject('options')

const saveJSONFile = () => {
  if (!editor.value) {
    return
  }
  const blob = new Blob([JSON.stringify(editor.value.getJSON(), null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const { title } = options.value.document
  const filename =
    title !== '' ? options.value.document?.title : t('document.untitled')
  saveAs(blob, `${filename}.json`)
}
</script>
