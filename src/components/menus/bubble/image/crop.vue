<template>
  <menus-button
    v-if="canShowCrop"
    ico="cutting"
    :text="buttonText"
    :menu-active="isCropping"
    @menu-click="toggleCrop"
  />
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'

const editor = inject('editor')

const image = computed(() => {
  if (!editor.value) {
    return null
  }
  const node = getSelectionNode(editor.value)
  return node?.type?.name === 'image' ? node : null
})

const selectedPos = computed(() => {
  const selection = editor.value?.state?.selection
  return selection?.node?.type?.name === 'image' ? selection.from : null
})

const isCropping = computed(
  () => selectedPos.value === editor.value?.storage?.image?.cropper?.activePos,
)

const canShowCrop = computed(
  () => !!image.value && image.value.attrs?.type?.startsWith?.('image'),
)

const buttonText = computed(() =>
  isCropping.value
    ? t('bubbleMenu.image.applyCrop')
    : t('bubbleMenu.image.crop'),
)

const toggleCrop = () => {
  editor.value?.commands.toggleImageCrop()
}
</script>
