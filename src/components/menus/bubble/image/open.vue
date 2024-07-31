<template>
  <menus-button
    ico="image-open"
    :text="t('bubbleMenu.image.open')"
    @menu-click="openImage"
  />
</template>

<script setup>
const { editor } = useStore()

const openImage = () => {
  const node = editor.value?.commands.getSelectionNode()
  const a = document.createElement('a')
  a.href = node.attrs.src
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
