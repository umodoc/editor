<template>
  <menus-button
    ico="equal-proportion"
    :text="t('bubbleMenu.image.proportion')"
    :menu-active="proportionActive"
    @menu-click="toggleEqualProportion"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')

const proportionActive = computed(() => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image?.type?.name) {
    return editor.value?.getAttributes(image?.type?.name)?.equalProportion
  } else return false
})

const toggleEqualProportion = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  if (image) {
    editor.value?.commands.updateAttributes(image.type, {
      equalProportion: !image.attrs.equalProportion,
    })
  }
}
</script>
