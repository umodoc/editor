<template>
  <menus-button
    ico="equal-proportion"
    :text="t('bubbleMenu.image.proportion')"
    :menu-active="editor?.getAttributes('image')?.equalProportion"
    @menu-click="toggleEqualProportion"
  />
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleEqualProportion = () => {
  const image = getSelectionNode(editor.value)
  editor.value.commands.updateAttributes(image.type, {
    equalProportion: !image.attrs.equalProportion,
  })
}
</script>
