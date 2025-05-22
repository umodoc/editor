<template>
  <menus-button text="Word" ico="word" huge @menu-click="exportDocx" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import htmlToDocx from 'html-to-docx'
import { saveAs } from 'file-saver'

const editor = inject<Editor>('editor')

const exportDocx = async () => {
  if (!editor?.value) {
    console.error('Editor instance not available')
    return
  }
  const htmlContent = editor.value.getHTML()
  // Adding a basic HTML structure if the content is partial
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${htmlContent}</body></html>`
  try {
    const fileBuffer = await htmlToDocx(fullHtml)
    saveAs(fileBuffer as Blob, 'document.docx')
  } catch (error) {
    console.error('Error exporting to DOCX:', error)
  }
}
</script>

<style lang="less" scoped></style>
