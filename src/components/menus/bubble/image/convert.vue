<template>
  <menus-button
    ico="image-inline"
    :text="
      menuActive
        ? t('bubbleMenu.image.convertToNode')
        : t('bubbleMenu.image.convertToInline')
    "
    :menu-active="menuActive"
    @menu-click="convertPosition"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const menuActive = computed(() => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  return image?.type?.name === 'inlineImage'
})

const convertPosition = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image) {
    const typeName =
      image?.type?.name === 'inlineImage' ? 'inlineImage' : 'image'
    const imageData = image.attrs ?? {}
    if (!imageData.error && imageData.src) {
      // 1.删除原有节点
      editor.value
        ?.chain()
        .focus()
        .deleteSelectionNode()
        .setMeta('convert', true)
        .run()
      // 2.插入新的节点
      if (typeName === 'inlineImage') {
        editor.value
          ?.chain()
          .focus()
          .setImage({ ...imageData, equalProportion: false, inline: false })
          .run()
      } else {
        editor.value
          ?.chain()
          .focus()
          .setInlineImage({
            ...imageData,
            inline: true,
            equalProportion: false,
          })
          .run()
      }
    }
  }
}
</script>
