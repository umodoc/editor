<template>
  <menus-button
    ico="text"
    :text="t('export.text')"
    huge
    @menu-click="saveTextFile"
  />
</template>

<script setup lang="ts">
import { saveAs } from 'file-saver'

const editor = inject('editor')
const options = inject('options')

const saveTextFile = () => {
  if (!editor.value) {
    return
  }
  const blob = new Blob([editor.value.getText()], {
    type: 'text/plain;charset=utf-8',
  })
  const { title } = options.value.document ?? {}
  const filename =
    title !== '' ? options.value?.document?.title : t('document.untitled')
  saveAs(blob, `${filename}.txt`)
}
</script>
