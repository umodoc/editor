<template>
  <editor-menus-button tooltip="下载图片" @button-click="downloadImage">
    <icon name="image-download" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const downloadImage = () => {
  const a = document.createElement('a')
  a.href = editor.value?.getAttributes('image').src
  a.target = '_blank'
  a.click()
}
</script>
