<template>
  <editor-menus-button
    ico="html5"
    text="HTML"
    huge
    @button-click="saveHtmlFile"
  />
</template>

<script setup>
import { saveAs } from 'file-saver'

const { options, editor } = useStore()

const saveHtmlFile = () => {
  if (!editor.value) return
  const blob = new Blob([editor.value?.getHTML()], {
    type: 'text/html;charset=utf-8',
  })
  saveAs(blob, `${options.value.document.title}.html`)
}
</script>
