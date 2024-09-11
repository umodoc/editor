<template>
  <menus-button
    ico="image-draggable"
    :text="t('bubbleMenu.image.draggable')"
    :menu-active="editor?.getAttributes('image')?.draggable"
    @menu-click="toggleDraggable"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleDraggable = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  editor.value?.commands.updateAttributes(image.type, {
    draggable: !image.attrs.draggable,
  })
}
</script>
