<template>
  <menus-button ico="html5" text="HTML" huge @menu-click="saveHtmlFile" />
</template>

<script setup lang="ts">
import { saveAs } from 'file-saver'

const { options, editor } = useStore()

const saveHtmlFile = () => {
  if (!editor.value) {
    return
  }
  const blob = new Blob([editor.value.getHTML()], {
    type: 'text/html;charset=utf-8',
  })
  const { title } = options.value.document ?? {}
  const filename =
    title !== '' ? options.value.document?.title : t('document.untitled')
  saveAs(blob, `${filename}.html`)
}
</script>
