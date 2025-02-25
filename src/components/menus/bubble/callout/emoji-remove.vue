<template>
  <menus-button
    ico="remove"
    :text="t('bubbleMenu.callout.removeEmoji')"
    @menu-click="removeEmoji"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const emits = defineEmits(['change'])

const editor = inject('editor')

const removeEmoji = () => {
  const callout = editor.value ? getSelectionNode(editor.value) : null
  if (callout) {
    editor.value?.commands.updateAttributes('callout', {
      icon: null,
    })
  }
}
</script>
