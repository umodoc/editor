<template>
  <menus-button
    ico="image-open"
    :text="t('bubbleMenu.image.open')"
    @menu-click="openImage"
  />
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const openImage = () => {
  const node = getSelectionNode(editor.value)
  const a = document.createElement('a')
  a.href = node.attrs.src
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
