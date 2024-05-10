<template>
  <editor-menus-button huge-button @button-click="saveHtmlFile">
    <icon name="html5" />
    <template #text>
      <p class="button-text">HTML</p>
    </template>
  </editor-menus-button>
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
