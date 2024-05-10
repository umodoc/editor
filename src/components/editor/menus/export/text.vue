<template>
  <editor-menus-button huge-button @button-click="saveTextFile">
    <icon name="text" />
    <template #text>
      <p class="button-text">文本文档</p>
    </template>
  </editor-menus-button>
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
