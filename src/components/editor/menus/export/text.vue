<template>
  <editor-menus-button
    ico="text"
    text="文本文档"
    huge
    @button-click="saveTextFile"
  />
</template>

<script setup>
import { saveAs } from 'file-saver'

const { options, editor } = useStore()

const saveTextFile = () => {
  if (!editor.value) return
  const blob = new Blob([editor.value?.getText()], {
    type: 'text/plain;charset=utf-8',
  })
  saveAs(blob, `${options.value.document.title}.txt`)
}
</script>
