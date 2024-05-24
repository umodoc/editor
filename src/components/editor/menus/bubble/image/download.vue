<template>
  <editor-menus-button
    ico="image-download"
    text="下载图片"
    @button-click="downloadImage"
  />
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
