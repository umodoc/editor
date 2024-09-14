<template>
  <menus-button
    :text="t('bubbleMenu.code.wordWrap')"
    ico="code-word-wrap"
    :menu-active="editor?.getAttributes('codeBlock')?.wordWrap"
    @menu-click="toggleWordWrap"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleWordWrap = () => {
  const codeBlock = editor.value ? getSelectionNode(editor.value) : null
  if (codeBlock) {
    editor.value?.commands.updateAttributes(codeBlock.type, {
      wordWrap: !codeBlock.attrs.wordWrap,
    })
  }
}
</script>
