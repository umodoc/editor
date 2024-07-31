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
  const node = editor.value?.commands.getSelectionNode()
  const a = document.createElement('a')
  a.href = node.attrs.url
  a.download = node.attrs.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
