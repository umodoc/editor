<template>
  <menus-button ico="html5" text="HTML" huge @menu-click="saveHtmlFile" />
</template>

<script setup>
import { saveAs } from 'file-saver'

import { inlineBlobImages } from '@/utils/file'

const editor = inject('editor')
const options = inject('options')

const saveHtmlFile = async () => {
  if (!editor.value) {
    return
  }
  const html = await inlineBlobImages(editor.value.getHTML())
  const blob = new Blob([html], {
    type: 'text/html;charset=utf-8',
  })
  const { title } = options.value.document
  const filename =
    title !== '' ? options.value.document?.title : t('document.untitled')
  saveAs(blob, `${filename}.html`)
}
</script>
