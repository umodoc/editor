<template>
  <menus-button
    ico="download"
    :text="t('bubbleMenu.file.download')"
    @menu-click="downloadFile"
  />
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
