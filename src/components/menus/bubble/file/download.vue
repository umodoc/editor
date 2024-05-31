<template>
  <menus-button ico="download" text="下载文件" @menu-click="downloadFile" />
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
