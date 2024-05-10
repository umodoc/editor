<template>
  <editor-menus-button tooltip="下载文件" @button-click="downloadFile">
    <icon name="download" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const downloadFile = () => {
  const a = document.createElement('a')
  a.href = editor.value?.getAttributes('file').url
  a.target = '_blank'
  a.click()
}
</script>
